# Pipeline ETL — Longevus

Pipeline de extração, transformação e carga (ETL) dos dados do **SIH/SUS**
(Sistema de Informações Hospitalares do SUS) para o banco de dados do projeto
Longevus no Supabase.

---

## Pré-requisitos

- **Python 3.10+**
- Acesso à internet (para download dos arquivos `.dbc` do DATASUS)
- Conta no [Supabase](https://supabase.com) com o banco configurado

---

## Instalação

1. Clone o repositório e acesse a pasta do pipeline:

```bash
cd pipeline/
```

2. Crie e ative um ambiente virtual:

```bash
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
.venv\Scripts\activate      # Windows
```

3. Instale as dependências:

```bash
pip install -r requirements.txt
```

---

## Configuração do `.env`

Copie o arquivo de exemplo e preencha com as credenciais do seu Supabase:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
SUPABASE_HOST=db.xxxx.supabase.co
SUPABASE_PORT=5432
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=sua_senha_aqui
```

As credenciais podem ser encontradas em:  
**Supabase → Project → Settings → Database → Connection Info**

---

## Criação das Tabelas

Antes de executar o pipeline pela primeira vez, crie as tabelas no banco:

```bash
# Via psql
psql "postgresql://<usuario>:<senha>@<host>:5432/postgres" -f sql/create_tables.sql

# Ou cole o conteúdo de sql/create_tables.sql diretamente no SQL Editor do Supabase
```

---

## Uso

Execute o pipeline informando o ano e mês de competência:

```bash
# Extrair e carregar dados de junho de 2023
python main.py --ano 2023 --mes 6

# Extrair e carregar dados de janeiro de 2022
python main.py --ano 2022 --mes 1
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `--ano`   | int  | Sim         | Ano de competência (ex: `2023`) |
| `--mes`   | int  | Sim         | Mês de competência de 1 a 12 (ex: `6` para junho) |

---

## Estrutura de Arquivos

```
pipeline/
├── README.md                   # Este arquivo
├── requirements.txt            # Dependências Python
├── .env.example                # Exemplo de variáveis de ambiente
├── main.py                     # Entry point — orquestra o pipeline
├── config.py                   # Configurações centralizadas
├── etl/
│   ├── __init__.py
│   ├── extractor.py            # RF-01: Download dos .dbc do DATASUS
│   ├── transformer.py          # RF-02, RF-03, RF-04: Transformações
│   └── loader.py               # RF-05: Carga no Supabase
├── sql/
│   └── create_tables.sql       # Script SQL de criação das tabelas
└── data/
    └── municipios_sudoeste.csv # Lista dos 42 municípios com código IBGE
```

---

## Fluxo do Pipeline

```
[DATASUS FTP]
     │  .dbc (SIH/SUS — Paraná)
     ▼
[extractor.py]  ← RF-01: download e leitura via pysus
     │  DataFrame bruto
     ▼
[transformer.py]
  ├── RF-02: filtro por municípios do Sudoeste do PR
  ├── RF-03: criação da coluna faixa_etaria
  └── RF-04: criação da coluna cid_capitulo
     │  DataFrame transformado
     ▼
[loader.py]  ← RF-05: UPSERT no Supabase
  ├── municipios_sudoeste
  └── internacoes
```

---

## Municípios do Sudoeste do Paraná

O filtro é aplicado sobre os **42 municípios** listados em
`data/municipios_sudoeste.csv`, organizados em três microrregiões:
**Francisco Beltrão**, **Pato Branco** e **Capanema**.

---

## Solução de Problemas

| Problema | Possível causa | Solução |
|----------|---------------|---------|
| `RuntimeError: Variáveis de ambiente...` | `.env` não configurado | Copie `.env.example` para `.env` e preencha |
| `ImportError: pysus não instalado` | Dependência ausente | `pip install pysus` |
| `Arquivo não encontrado no DATASUS` | Dados ainda não disponíveis | Aguarde a publicação pelo DATASUS (geralmente 2–3 meses de defasagem) |
| Timeout na conexão | Rede ou host incorreto | Verifique `SUPABASE_HOST` no `.env` |
