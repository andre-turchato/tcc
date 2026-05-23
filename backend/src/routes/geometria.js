'use strict';

const { obterGeometria } = require('../services/geometriaService');

/**
 * Registra a rota GET /api/geometria no Fastify.
 *
 * Retorna o GeoJSON FeatureCollection com a malha territorial
 * dos municípios do Sudoeste do Paraná.
 *
 * Comportamento:
 *   - Arquivo pré-gerado em public/geo/sudoeste-pr.geojson
 *   - Adiciona header Cache-Control de 1 dia (max-age=86400)
 *
 * @param {import('fastify').FastifyInstance} fastify
 */
async function geometriaRoutes(fastify) {
  fastify.get('/api/geometria', async (request, reply) => {
    const geojson = obterGeometria();

    reply.header('Cache-Control', 'public, max-age=86400');
    return geojson;
  });
}

module.exports = geometriaRoutes;
