'use strict';

const { validarParametrosIndicadores } = require('../utils/validators');
const { erroParametroInvalido, sucessoIndicadores } = require('../utils/response');
const { obterIndicadores } = require('../services/indicadoresService');

/**
 * Registra a rota GET /api/indicadores no Fastify.
 *
 * Query params opcionais:
 *   - cid_capitulo : capítulo CID-10 em numeral romano (ex: X, XI)
 *   - sexo         : 'M' ou 'F'
 *   - faixa_etaria : '0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61+'
 *
 * @param {import('fastify').FastifyInstance} fastify
 */
async function indicadoresRoutes(fastify) {
  fastify.get('/api/indicadores', async (request, reply) => {
    const { cid_capitulo, sexo, faixa_etaria } = request.query;

    // Valida os parâmetros recebidos
    const erros = validarParametrosIndicadores({ cid_capitulo, sexo, faixa_etaria });
    if (erros.length > 0) {
      return erroParametroInvalido(reply, 'Parâmetro inválido', erros.join('; '));
    }

    const dados = await obterIndicadores({ cid_capitulo, sexo, faixa_etaria });
    return sucessoIndicadores(reply, dados);
  });
}

module.exports = indicadoresRoutes;
