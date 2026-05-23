'use strict';

/**
 * Centraliza a leitura e validação das variáveis de ambiente.
 * Encerra o processo com erro claro caso variáveis obrigatórias estejam ausentes.
 */
require('dotenv').config();

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
    console.error(`[env] ERRO: variável de ambiente "${chave}" não definida.`);
    console.error('[env] Copie .env.example para .env e preencha os valores.');
    process.exit(1);
  }
}

module.exports = env;
