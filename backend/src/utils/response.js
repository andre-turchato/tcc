'use strict';

/**
 * Retorna uma resposta de erro padronizada (400 Bad Request).
 *
 * @param {import('fastify').FastifyReply} reply
 * @param {string} mensagem  - Título do erro
 * @param {string} detalhe   - Mensagem descritiva para o cliente
 */
function erroParametroInvalido(reply, mensagem, detalhe) {
  return reply.code(400).send({
    error: mensagem,
    detail: detalhe,
  });
}

/**
 * Retorna uma resposta de sucesso padronizada para /api/indicadores.
 *
 * @param {import('fastify').FastifyReply} reply
 * @param {Array} dados
 */
function sucessoIndicadores(reply, dados) {
  return reply.send({ dados });
}

module.exports = { erroParametroInvalido, sucessoIndicadores };
