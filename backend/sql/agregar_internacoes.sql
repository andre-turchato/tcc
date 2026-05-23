-- Migration: criação da função RPC de agregação de internações
-- Execute este script no SQL Editor do Supabase (ou via psql)
-- antes de iniciar a API backend.

-- Função utilizada pelo endpoint GET /api/indicadores
-- Recebe filtros opcionais e retorna dados agregados por município.
CREATE OR REPLACE FUNCTION agregar_internacoes(
  p_cid_capitulo  TEXT DEFAULT NULL,
  p_sexo          TEXT DEFAULT NULL,
  p_faixa_etaria  TEXT DEFAULT NULL
)
RETURNS TABLE (
  codigo_ibge        TEXT,
  total_atendimentos BIGINT,
  valor_total        NUMERIC
)
LANGUAGE sql
AS $$
  SELECT
    i.municipio_codigo  AS codigo_ibge,
    COUNT(*)            AS total_atendimentos,
    SUM(i.valor_total)  AS valor_total
  FROM internacoes i
  WHERE i.municipio_codigo IN (SELECT codigo_ibge FROM municipios_sudoeste)
    AND (i.cid_capitulo  = p_cid_capitulo  OR p_cid_capitulo  IS NULL)
    AND (i.sexo          = p_sexo          OR p_sexo          IS NULL)
    AND (i.faixa_etaria  = p_faixa_etaria  OR p_faixa_etaria  IS NULL)
  GROUP BY i.municipio_codigo;
$$;
