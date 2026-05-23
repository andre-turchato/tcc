'use strict';

const Fastify = require('fastify');

const indicadoresRoutes = require('./routes/indicadores');
const geometriaRoutes   = require('./routes/geometria');

/**
 * Cria e configura a instância Fastify com todas as rotas registradas.
 * Separado do server.js para facilitar testes unitários.
 *
 * @returns {import('fastify').FastifyInstance}
 */
function buildApp() {
  const app = Fastify({ logger: true });

  // Registra as rotas da API
  app.register(indicadoresRoutes);
  app.register(geometriaRoutes);

  // Rota de health check
  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}

module.exports = buildApp;
