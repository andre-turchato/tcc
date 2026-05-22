# Requisitos do Sistema Longevus

> **Versão:** 1.0  
> **Status:** Em especificação  
> **Autor:** André Luiz Costa da Silva

---

## 1. Requisitos Funcionais

### 1.1 Pipeline de Dados (ETL — Python)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-01 | O sistema deve extrair arquivos `.dbc` do SIH/SUS referentes ao estado do Paraná | Alta |
| RF-02 | O sistema deve filtrar os registros, mantendo apenas municípios do Sudoeste do Paraná | Alta |
| RF-03 | O sistema deve criar faixas etárias agrupadas (0-10, 11-20, 21-30, 31-40, 41-50, 51-60, 61+) | Alta |
| RF-04 | O sistema deve agrupar os códigos CID-10 por capítulos | Alta |
| RF-05 | O sistema deve carregar os dados transformados no banco PostgreSQL/PostGIS (Supabase) | Alta |

### 1.2 Backend (API Node.js/Fastify)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-06 | A API deve expor o endpoint `GET /api/indicadores` com parâmetros: `cid_capitulo`, `sexo`, `faixa_etaria` | Alta |
| RF-07 | O endpoint `/api/indicadores` deve retornar dados agregados por município no formato `{ dados: [{ codigo_ibge, total_atendimentos, valor_total }] }` | Alta |
| RF-08 | A API deve expor o endpoint `GET /api/geometria` retornando o GeoJSON da malha territorial do Sudoeste do Paraná | Alta |
| RF-09 | A API deve implementar cache dos resultados de queries para reduzir sobrecarga no banco | Média |

### 1.3 Frontend (React + Vite)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-10 | O frontend deve renderizar um mapa interativo com a malha municipal do Sudoeste do Paraná | Alta |
| RF-11 | O mapa deve aplicar coloração coroplética nos municípios conforme o valor de `total_atendimentos` (escala amarelo → vermelho) | Alta |
| RF-12 | O tooltip do mapa deve exibir: nome do município, total de atendimentos e valor total (R$) ao passar o mouse | Alta |
| RF-13 | A sidebar deve conter filtros por CID-10 (capítulo), Sexo e Faixa Etária | Alta |
| RF-14 | O botão "Atualizar Mapa" deve disparar nova requisição à API com os filtros selecionados | Alta |
| RF-15 | O frontend deve usar TanStack Query para gerenciamento de estado e requisições | Média |

---

## 2. Requisitos Não-Funcionais

| ID | Categoria | Requisito |
|----|-----------|----------|
| RNF-01 | **Performance** | A renderização do mapa deve ocorrer em menos de 2 segundos após a seleção dos filtros |
| RNF-02 | **Leveza** | O frontend deve receber apenas dados JSON agregados — nenhum dado bruto é transmitido |
| RNF-03 | **Geometria** | O arquivo GeoJSON não deve exceder 500KB |
| RNF-04 | **Disponibilidade** | O banco de dados deve estar disponível via Supabase com SLA padrão da plataforma |
| RNF-05 | **Manutenibilidade** | O código deve seguir arquitetura em camadas bem definidas (pipeline / api / frontend) |
| RNF-06 | **Usabilidade** | A interface deve ser acessível a profissionais de saúde sem afinidade técnica com dados |

---

## 3. Restrições

- Os dados são limitados ao recorte geográfico do **Sudoeste do Paraná**
- A fonte primária de dados é exclusivamente o **SIH/SUS (DATASUS)**
- A base cartográfica será obtida do **IBGE**
- O banco de dados utilizado é **Supabase (PostgreSQL + PostGIS)**

---

## 4. Critérios de Aceitação Globais

- [ ] Pipeline executa do `.dbc` ao banco sem intervenção manual
- [ ] API responde em menos de 500ms com cache ativo
- [ ] GeoJSON carregado abaixo de 500KB
- [ ] Mapa renderiza e colore corretamente após filtros aplicados
- [ ] Tooltip exibe dados corretos ao passar o mouse
