'use strict';

const supabase = require('../lib/supabase');

/**
 * Executa a query de agregação de internações por município no Supabase.
 *
 * A query agrupa os registros da tabela `internacoes` por município,
 * filtrados pelos parâmetros opcionais. Apenas municípios presentes
 * em `municipios_sudoeste` são incluídos no resultado.
 *
 * Equivalente SQL:
 *   SELECT municipio_codigo AS codigo_ibge,
 *          COUNT(*)         AS total_atendimentos,
 *          SUM(valor_total) AS valor_total
 *   FROM internacoes
 *   WHERE municipio_codigo IN (SELECT codigo_ibge FROM municipios_sudoeste)
 *     AND (cid_capitulo = :cid_capitulo OR :cid_capitulo IS NULL)
 *     AND (sexo         = :sexo         OR :sexo         IS NULL)
 *     AND (faixa_etaria = :faixa_etaria OR :faixa_etaria IS NULL)
 *   GROUP BY municipio_codigo;
 *
 * A função RPC `agregar_internacoes` deve ser criada no Supabase com a seguinte assinatura:
 *
 *   CREATE OR REPLACE FUNCTION agregar_internacoes(
 *     p_cid_capitulo  TEXT DEFAULT NULL,
 *     p_sexo          TEXT DEFAULT NULL,
 *     p_faixa_etaria  TEXT DEFAULT NULL
 *   )
 *   RETURNS TABLE (
 *     codigo_ibge        TEXT,
 *     total_atendimentos BIGINT,
 *     valor_total        NUMERIC
 *   )
 *   LANGUAGE sql
 *   AS $$
 *     SELECT
 *       i.municipio_codigo  AS codigo_ibge,
 *       COUNT(*)            AS total_atendimentos,
 *       SUM(i.valor_total)  AS valor_total
 *     FROM internacoes i
 *     WHERE i.municipio_codigo IN (SELECT codigo_ibge FROM municipios_sudoeste)
 *       AND (i.cid_capitulo  = p_cid_capitulo  OR p_cid_capitulo  IS NULL)
 *       AND (i.sexo          = p_sexo          OR p_sexo          IS NULL)
 *       AND (i.faixa_etaria  = p_faixa_etaria  OR p_faixa_etaria  IS NULL)
 *     GROUP BY i.municipio_codigo;
 *   $$;
 *
 * @param {{ cid_capitulo?: string, sexo?: string, faixa_etaria?: string }} filtros
 * @returns {Promise<Array<{ codigo_ibge: string, total_atendimentos: number, valor_total: number }>>}
 */
async function buscarAgregadoPorMunicipio({ cid_capitulo, sexo, faixa_etaria } = {}) {
  const { data, error } = await supabase.rpc('agregar_internacoes', {
    p_cid_capitulo:  cid_capitulo  || null,
    p_sexo:          sexo          || null,
    p_faixa_etaria:  faixa_etaria  || null,
  });

  if (error) {
    throw new Error(`Erro ao consultar o banco de dados: ${error.message}`);
  }

  // Garante que os campos numéricos sejam retornados como number
  return (data || []).map(row => ({
    codigo_ibge:        String(row.codigo_ibge),
    total_atendimentos: Number(row.total_atendimentos),
    valor_total:        Number(row.valor_total),
  }));
}

module.exports = { buscarAgregadoPorMunicipio };
