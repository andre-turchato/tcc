'use strict';

const NodeCache = require('node-cache');
const env = require('../config/env');

/**
 * Instância única do cache in-memory.
 * TTL padrão configurável via variável de ambiente CACHE_TTL_SECONDS.
 */
const cache = new NodeCache({ stdTTL: env.CACHE_TTL_SECONDS, checkperiod: 60 });

/**
 * Gera a chave de cache para o endpoint /api/indicadores.
 * Valores ausentes são representados como "_" para evitar colisões.
 *
 * @param {string|undefined} cid_capitulo
 * @param {string|undefined} sexo
 * @param {string|undefined} faixa_etaria
 * @returns {string}
 */
function gerarChaveIndicadores(cid_capitulo, sexo, faixa_etaria) {
  const c = cid_capitulo || '_';
  const s = sexo        || '_';
  const f = faixa_etaria || '_';
  return `indicadores:${c}:${s}:${f}`;
}

/**
 * Recupera um valor do cache.
 * @param {string} chave
 * @returns {any|undefined}
 */
function obter(chave) {
  return cache.get(chave);
}

/**
 * Armazena um valor no cache com o TTL padrão.
 * @param {string} chave
 * @param {any} valor
 */
function armazenar(chave, valor) {
  cache.set(chave, valor);
}

module.exports = { gerarChaveIndicadores, obter, armazenar };
