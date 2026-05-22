# Modelo de Dados — Longevus

> **Versão:** 1.0  
> **Banco:** PostgreSQL + PostGIS (Supabase)

---

## 1. Tabelas

### 1.1 `internacoes`

Dados brutos filtrados e transformados provenientes do SIH/SUS.

```sql
CREATE TABLE internacoes (
  id               SERIAL PRIMARY KEY,
  municipio_codigo VARCHAR(7)     NOT NULL,  -- Código IBGE do município de residência
  idade            INTEGER        NOT NULL,
  sexo             CHAR(1)        NOT NULL,  -- 'M' = Masculino, 'F' = Feminino
  faixa_etaria     VARCHAR(10)    NOT NULL,  -- Ex: '0-10', '11-20', ..., '61+'
  cid_principal    VARCHAR(4)     NOT NULL,  -- Código CID-10 (ex: 'J18')
  cid_capitulo     VARCHAR(5)     NOT NULL,  -- Capítulo CID-10 (ex: 'X', 'XI')
  valor_total      NUMERIC(12, 2) NOT NULL,  -- Valor pago pela internação (R$)
  ano_competencia  INTEGER        NOT NULL,  -- Ano de referência
  mes_competencia  INTEGER        NOT NULL   -- Mês de referência
);
```

### 1.2 `municipios_sudoeste`

Tabela de referência dos municípios do Sudoeste do Paraná.

```sql
CREATE TABLE municipios_sudoeste (
  codigo_ibge  VARCHAR(7)   PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL,
  microrregiao VARCHAR(100)
);
```

---

## 2. Índices Recomendados

```sql
-- Otimiza as queries de filtro da API
CREATE INDEX idx_internacoes_cid_capitulo  ON internacoes (cid_capitulo);
CREATE INDEX idx_internacoes_sexo          ON internacoes (sexo);
CREATE INDEX idx_internacoes_faixa_etaria  ON internacoes (faixa_etaria);
CREATE INDEX idx_internacoes_municipio     ON internacoes (municipio_codigo);
```

---

## 3. Query Principal (Agregação)

Query executada pelo endpoint `GET /api/indicadores`:

```sql
SELECT
  i.municipio_codigo  AS codigo_ibge,
  COUNT(*)            AS total_atendimentos,
  SUM(i.valor_total)  AS valor_total
FROM internacoes i
WHERE
  i.municipio_codigo IN (SELECT codigo_ibge FROM municipios_sudoeste)
  AND (i.cid_capitulo   = :cid_capitulo   OR :cid_capitulo   IS NULL)
  AND (i.sexo           = :sexo           OR :sexo           IS NULL)
  AND (i.faixa_etaria   = :faixa_etaria   OR :faixa_etaria   IS NULL)
GROUP BY i.municipio_codigo;
```

---

## 4. Contrato de Resposta da API

### `GET /api/indicadores`

**Query Params:**
| Parâmetro | Tipo | Obrigatório | Exemplo |
|-----------|------|-------------|--------|
| `cid_capitulo` | string | Não | `"X"` |
| `sexo` | string | Não | `"M"`, `"F"` |
| `faixa_etaria` | string | Não | `"0-10"` |

**Resposta (200 OK):**
```json
{
  "dados": [
    {
      "codigo_ibge": "411850",
      "total_atendimentos": 1500,
      "valor_total": 250000.50
    },
    {
      "codigo_ibge": "410010",
      "total_atendimentos": 800,
      "valor_total": 120000.00
    }
  ]
}
```

### `GET /api/geometria`

**Resposta (200 OK):** GeoJSON FeatureCollection  
**Tamanho máximo:** 500KB  
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "codigo_ibge": "411850",
        "nome": "Francisco Beltrão"
      },
      "geometry": { ... }
    }
  ]
}
```

---

## 5. Faixas Etárias Padronizadas

| Faixa | Range de Idade |
|-------|----------------|
| `0-10` | 0 a 10 anos |
| `11-20` | 11 a 20 anos |
| `21-30` | 21 a 30 anos |
| `31-40` | 31 a 40 anos |
| `41-50` | 41 a 50 anos |
| `51-60` | 51 a 60 anos |
| `61+` | 61 anos ou mais |

---

## 6. Capítulos CID-10 Principais

| Código | Descrição |
|--------|-----------|
| I | Algumas doenças infecciosas e parasitárias |
| II | Neoplasias |
| IX | Doenças do aparelho circulatório |
| X | Doenças do aparelho respiratório |
| XI | Doenças do aparelho digestivo |
| XIII | Doenças do sistema osteomuscular |
| XIV | Doenças do aparelho geniturinário |
| XV | Gravidez, parto e puerpério |
| XIX | Lesões, envenenamentos |
