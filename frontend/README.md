# Longevus — Frontend

Interface web do sistema Longevus para visualização geoespacial de dados de saúde pública do Sudoeste do Paraná.

## Objetivo

Este frontend consome a API backend do Longevus e renderiza um **mapa coroplético interativo** dos municípios do Sudoeste do Paraná, permitindo que profissionais de saúde analisem padrões de internações hospitalares do SUS com filtros por CID-10, sexo e faixa etária.

---

## Stack

| Tecnologia | Papel |
|---|---|
| [React 18](https://react.dev/) | Framework de UI declarativa |
| [Vite](https://vitejs.dev/) | Bundler e servidor de desenvolvimento |
| [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) | Renderização do mapa interativo |
| [@tanstack/react-query](https://tanstack.com/query) | Gerenciamento de requisições, cache e estados |

---

## Pré-requisitos

- Node.js 18+
- API backend em execução (ver `backend/README.md`)

---

## Instalação

```bash
cd frontend
npm install
```

---

## Configuração do ambiente

Copie o arquivo de exemplo e configure a URL da API:

```bash
cp .env.example .env
```

Edite o `.env` com a URL da API backend:

```env
VITE_API_BASE_URL=http://localhost:3000
```

> **Atenção:** nunca comite o arquivo `.env` com valores reais.

---

## Executando localmente

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

> A API backend deve estar em execução na porta configurada em `VITE_API_BASE_URL`.

---

## Build para produção

```bash
npm run build
```

Os arquivos gerados ficam em `frontend/dist/`.

---

## Estrutura de arquivos

```
src/
├── main.jsx                    # Ponto de entrada — inicializa React e QueryClient
├── App.jsx                     # Componente raiz — layout e gerenciamento de estado
├── styles/
│   └── globals.css             # Estilos globais (sem framework CSS externo)
├── components/
│   ├── Sidebar.jsx             # Painel de filtros (CID, sexo, faixa etária)
│   ├── MapaCoropletico.jsx     # Mapa Leaflet com coloração dinâmica
│   ├── LegendaMapa.jsx         # Legenda de cores do mapa
│   ├── TooltipInfo.jsx         # Tooltip com dados do município
│   └── EstadoCarregamento.jsx  # Feedback de loading, erro e vazio
├── services/
│   └── api.js                  # Funções de chamada à API (buscarGeometria, buscarIndicadores)
├── hooks/
│   ├── useGeometria.js         # Hook para buscar GeoJSON dos municípios
│   └── useIndicadores.js       # Hook para buscar indicadores com filtros
├── utils/
│   ├── colorScale.js           # Cálculo de escala de cor coroplética
│   ├── formatters.js           # Formatação de moeda e números (BRL)
│   └── mergeGeoData.js         # Combinação de GeoJSON com indicadores da API
└── constants/
    └── filtros.js              # Opções estáticas dos filtros (CID, sexo, faixa etária)
```

---

## Componentes principais

### `<Sidebar />`
Painel lateral com selects para CID-10, Sexo e Faixa Etária. Inclui os botões:
- **Atualizar Mapa** — dispara requisição `GET /api/indicadores` com os filtros selecionados
- **Limpar Filtros** — reseta todos os selects e remove os dados do mapa

### `<MapaCoropletico />`
Renderiza o mapa usando React-Leaflet. Recebe o GeoJSON dos municípios e os indicadores já combinados. Aplica coloração coroplética (escala amarelo → vermelho) e exibe tooltip ao passar o mouse.

### `<LegendaMapa />`
Legenda visual posicionada sobre o mapa. Exibe os intervalos de atendimentos com as cores correspondentes.

### `<EstadoCarregamento />`
Componente genérico para exibir estados de `carregando`, `erro` e `vazio` de forma amigável.

---

## Dependência da API

O frontend depende da API backend do Longevus rodando localmente:

- `GET /api/geometria` — retorna o GeoJSON da malha municipal
- `GET /api/indicadores` — retorna dados agregados por município com filtros opcionais

Consulte `spec/api-spec.md` para o contrato completo da API.
