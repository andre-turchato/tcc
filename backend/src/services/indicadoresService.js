'use strict';

const { buscarAgregadoPorMunicipio } = require('../repositories/internacoesRepository');
const { gerarChaveIndicadores, obter, armazenar } = require('../lib/cache');

/**
 * Retorna os indicadores agregados por município, com cache in-memory.
 *
 * Fluxo:
 *  1. Gera a chave de cache com base nos filtros
 *  2. Verifica se já existe resultado em cache → retorna direto
 *  3. Caso contrário: consulta o banco, armazena no cache e retorna
 *
 * @param {{ cid_capitulo?: string, sexo?: string, faixa_etaria?: string }} filtros
 * @returns {Promise<Array>}
 */
async function obterIndicadores(filtros = {}) {
  const chave = gerarChaveIndicadores(
    filtros.cid_capitulo,
    filtros.sexo,
    filtros.faixa_etaria,
  );

  // Verifica cache
  const emCache = obter(chave);
  if (emCache !== undefined) {
    return emCache;
  }

  // Consulta o banco e armazena no cache
  const dados = await buscarAgregadoPorMunicipio(filtros);
  armazenar(chave, dados);

  return dados;
}

module.exports = { obterIndicadores };
