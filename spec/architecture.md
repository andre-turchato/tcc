# Arquitetura do Sistema Longevus

> **Versão:** 1.0  
> **Padrão:** Arquitetura em Camadas + Pipeline de Dados

---

## 1. Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        LONGEVUS                                 │
│                                                                 │
│  [DATASUS]                                                      │
│     │ .dbc                                                      │
│     ▼                                                           │
│  ┌──────────────────┐                                           │
│  │  Pipeline Python │  ← ETL (Extração, Transformação, Carga)  │
│  │  (pysus + pandas)│                                           │
│  └────────┬─────────┘                                           │
│           │ SQL INSERT                                          │
│           ▼                                                     │
│  ┌──────────────────────┐                                       │
│  │  Supabase            │                                       │
│  │  PostgreSQL + PostGIS│  ← Banco de dados principal          │
│  └────────┬─────────────┘                                       │
│           │ REST                                                │
│           ▼                                                     │
│  ┌──────────────────────┐                                       │
│  │  API Node.js/Fastify │  ← Camada de serviço + cache         │
│  └────────┬─────────────┘                                       │
│           │ JSON (HTTP)                                         │
│           ▼                                                     │
│  ┌──────────────────────────────────────┐                       │
│  │  Frontend React + Vite               │                       │
│  │  Leaflet + TanStack Query            │  ← Visualização      │
│  └──────────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes

### 2.1 Pipeline de Dados (ETL)
- **Linguagem:** Python
- **Bibliotecas:** `pysus`, `pandas`, `sqlalchemy`, `psycopg2`
- **Responsabilidade:** Extrair `.dbc` → Transformar → Carregar no Supabase
- **Execução:** Script manual ou agendado (cron)

### 2.2 Banco de Dados
- **Plataforma:** Supabase (PostgreSQL 15 + PostGIS)
- **Tabelas principais:**
  - `internacoes` — dados brutos filtrados do SIH/SUS
  - `municipios_sudoeste` — tabela de referência dos municípios da região
- **Extensões:** PostGIS (geometria), pg_trgm (busca)

### 2.3 API (Backend)
- **Runtime:** Node.js 20+
- **Framework:** Fastify
- **Cache:** node-cache (in-memory, TTL configurável)
- **Endpoints:**
  - `GET /api/indicadores` — dados agregados com filtros
  - `GET /api/geometria` — GeoJSON da malha territorial
- **Variáveis de ambiente:** `SUPABASE_URL`, `SUPABASE_KEY`

### 2.4 Frontend
- **Framework:** React 18 + Vite
- **Mapa:** Leaflet.js
- **Gerenciamento de dados:** TanStack Query (React Query)
- **Estilo:** Tailwind CSS
- **Componentes principais:**
  - `<MapaCoroplético />` — renderiza Leaflet + coloração dinâmica
  - `<Sidebar />` — filtros (CID, Sexo, Faixa Etária)
  - `<Tooltip />` — informações do município

---

## 3. Fluxo de Dados

### 3.1 Fluxo ETL (offline)
```
1. Download .dbc do DATASUS
2. Conversão .dbc → DataFrame (pysus)
3. Filtro: municípios do Sudoeste do PR
4. Transformação: faixas etárias, capítulos CID
5. Carga: INSERT no Supabase
```

### 3.2 Fluxo de Requisição (online)
```
1. Usuário seleciona filtros na Sidebar
2. Clica em "Atualizar Mapa"
3. TanStack Query dispara GET /api/indicadores?cid_capitulo=X&sexo=Y&faixa_etaria=Z
4. Fastify verifica cache → se hit: retorna imediato
5. Se miss: query no Supabase → armazena cache → retorna
6. Frontend recebe JSON → mapeia codigo_ibge → feature GeoJSON
7. Leaflet atualiza cores do mapa (escala coroplética)
```

---

## 4. Decisões Arquiteturais

| Decisão | Justificativa |
|---------|---------------|
| Separação ETL / API / Frontend | Permite evolução independente de cada camada |
| Cache na API | Evita sobrecarga no Supabase com queries repetidas |
| GeoJSON simplificado | Garante carregamento rápido (<500KB) em redes móveis |
| TanStack Query | Gerencia loading, error e cache no frontend de forma declarativa |
| Supabase | Elimina necessidade de infraestrutura própria de banco de dados |
