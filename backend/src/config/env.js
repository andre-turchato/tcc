'use strict';

/**
 * Centraliza a leitura e validação das variáveis de ambiente.
 * Lança erro caso variáveis obrigatórias estejam ausentes.
 * O encerramento do processo fica a cargo do ponto de entrada (server.js).
 */
require('dotenv').config();

/**
 * @throws {Error} Se variáveis obrigatórias não estiverem definidas
 */
function carregarEnv() {
  const env = {
    PORT:               parseInt(process.env.PORT  || '3000', 10),
    HOST:               process.env.HOST            || '0.0.0.0',
    SUPABASE_URL:       process.env.SUPABASE_URL,
    SUPABASE_KEY:       process.env.SUPABASE_KEY,
    CACHE_TTL_SECONDS:  parseInt(process.env.CACHE_TTL_SECONDS || '300', 10),
  };

  // Variáveis obrigatórias para conectar ao banco de dados
  const OBRIGATORIAS = ['SUPABASE_URL', 'SUPABASE_KEY'];

  for (const chave of OBRIGATORIAS) {
    if (!env[chave]) {
      throw new Error(
        `Variável de ambiente "${chave}" não definida. ` +
        'Copie .env.example para .env e preencha os valores.'
      );
    }
  }

  return env;
}

module.exports = carregarEnv();
