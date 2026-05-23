# Backend — API Longevus

API REST em **Node.js/Fastify** que serve dados agregados de internações hospitalares do SUS para o frontend do sistema **Longevus**.

---

## Objetivo

Fornecer dois endpoints ao frontend:

| Endpoint | Descrição |
|----------|-----------|
| `GET /api/indicadores` | Dados agregados por município (total de atendimentos e valor total) com filtros opcionais |
| `GET /api/geometria`   | GeoJSON com a malha territorial dos municípios do Sudoeste do Paraná |

---

## Pré-requisitos

- **Node.js 20+**
- Conta no [Supabase](https://supabase.com) com as tabelas `internacoes` e `municipios_sudoeste` populadas pelo pipeline ETL

---

## Instalação

```bash
cd backend/
npm install
```

---

## Configuração

1. Copie o arquivo de exemplo para `.env`:

```bash
cp .env.example .env
```

2. Preencha as variáveis:

```env
PORT=3000
HOST=0.0.0.0
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=your_service_role_key
CACHE_TTL_SECONDS=300
```

> **SUPABASE_KEY**: use a **Service Role Key** (Supabase > Project Settings > API > service_role). Nunca a exponha no frontend.

---

## Rodando localmente

**Modo desenvolvimento** (reinicia ao salvar arquivos, requer Node.js 20+):

```bash
npm run dev
```

**Modo produção:**

```bash
npm start
```

A API estará disponível em `http://localhost:3000`.

---

## Endpoints

### `GET /api/indicadores`

Retorna dados agregados de internações por município.

**Query params opcionais:**

| Parâmetro | Valores aceitos | Exemplo |
|-----------|-----------------|---------|
| `cid_capitulo` | Numeral romano CID-10 (I a XXII) | `X` |
| `sexo` | `M` ou `F` | `M` |
| `faixa_etaria` | `0-10`, `11-20`, `21-30`, `31-40`, `41-50`, `51-60`, `61+` | `41-50` |

**Exemplo de chamada:**

```bash
curl "http://localhost:3000/api/indicadores?cid_capitulo=X&sexo=M&faixa_etaria=41-50"
```

**Resposta de sucesso (200):**

```json
{
  "dados": [
    {
      "codigo_ibge": "411850",
      "total_atendimentos": 1500,
      "valor_total": 250000.50
    },
    {
      "codigo_ibge": "412020",
      "total_atendimentos": 800,
      "valor_total": 120000.00
    }
  ]
}
```

**Resposta de erro (400):**

```json
{
  "error": "Parâmetro inválido",
  "detail": "O valor de 'sexo' deve ser 'M' ou 'F'"
}
```

---

### `GET /api/geometria`

Retorna o GeoJSON FeatureCollection com a malha territorial dos municípios.

**Exemplo de chamada:**

```bash
curl "http://localhost:3000/api/geometria"
```

**Resposta (200):**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "codigo_ibge": "411850", "nome": "Francisco Beltrão" },
      "geometry": { "type": "Polygon", "coordinates": [[...]] }
    }
  ]
}
```

> Header `Cache-Control: public, max-age=86400` é adicionado automaticamente (cache de 1 dia no cliente/proxy).

---

## Cache

O endpoint `/api/indicadores` usa cache **in-memory** (`node-cache`) para evitar consultas repetidas ao banco:

- **Chave:** `indicadores:{cid_capitulo}:{sexo}:{faixa_etaria}` (valores ausentes representados como `_`)
- **TTL:** configurável via `CACHE_TTL_SECONDS` (padrão: 300 segundos = 5 minutos)
- **Exemplo de chave:** `indicadores:X:M:41-50` ou `indicadores:_:_:_` (sem filtros)

O cache é mantido em memória enquanto o processo está rodando. Ao reiniciar o servidor, o cache é limpo.

---

## GeoJSON

O arquivo `public/geo/sudoeste-pr.geojson` é um **placeholder** com 5 municípios de exemplo e coordenadas simplificadas.

**Para produção**, substitua-o pela malha municipal real do IBGE:

1. Acesse [IBGE — Bases Cartográficas](https://www.ibge.gov.br/geociencias/downloads-geociencias.html)
2. Baixe os shapefiles municipais do Paraná
3. Filtre os 42 municípios do Sudoeste do Paraná
4. Simplifique as geometrias (ex: com `mapshaper` ou `turf.js`) para manter o arquivo abaixo de **500KB**
5. Exporte como GeoJSON e substitua o arquivo `public/geo/sudoeste-pr.geojson`

---

## Estrutura do código

```
src/
├── app.js                          # Monta a instância Fastify e registra rotas
├── server.js                       # Inicia o servidor HTTP
├── config/
│   └── env.js                      # Leitura e validação de variáveis de ambiente
├── routes/
│   ├── indicadores.js              # Rota GET /api/indicadores
│   └── geometria.js                # Rota GET /api/geometria
├── services/
│   ├── indicadoresService.js       # Lógica de negócio + cache
│   └── geometriaService.js         # Leitura do GeoJSON
├── repositories/
│   └── internacoesRepository.js    # Acesso ao banco (Supabase)
├── lib/
│   ├── cache.js                    # Instância node-cache + utilitários
│   └── supabase.js                 # Cliente Supabase
└── utils/
    ├── validators.js               # Validação de parâmetros
    └── response.js                 # Padronização de respostas JSON
```

---

## Banco de dados — função RPC

O endpoint `/api/indicadores` utiliza a função SQL `agregar_internacoes` no Supabase.  
Execute o script de migração **antes de iniciar a API**:

```bash
# Via SQL Editor do Supabase (cole o conteúdo de sql/agregar_internacoes.sql)
# ou via psql:
psql "$DATABASE_URL" -f sql/agregar_internacoes.sql
```

O arquivo `sql/agregar_internacoes.sql` contém a definição completa da função.

---

## Health check

```bash
curl "http://localhost:3000/health"
# { "status": "ok" }
```
