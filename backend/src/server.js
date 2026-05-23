'use strict';

const env    = require('./config/env');
const buildApp = require('./app');

/**
 * Ponto de entrada da API Longevus.
 * Inicia o servidor Fastify na porta e host configurados.
 */
async function iniciar() {
  const app = buildApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    console.log(`[servidor] API Longevus rodando em http://${env.HOST}:${env.PORT}`);
  } catch (erro) {
    app.log.error(erro);
    process.exit(1);
  }
}

iniciar();
