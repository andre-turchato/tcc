'use strict';

/**
 * Valores aceitos para o parâmetro `sexo`.
 */
const SEXOS_VALIDOS = ['M', 'F'];

/**
 * Valores aceitos para o parâmetro `faixa_etaria`.
 */
const FAIXAS_ETARIAS_VALIDAS = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61+'];

/**
 * Capítulos válidos da CID-10 em numeral romano (I a XXII).
 * Inclui todos os capítulos oficiais da Classificação Internacional de Doenças.
 */
const CAPITULOS_CID10_VALIDOS = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX',
  'XX', 'XXI', 'XXII',
];

/**
 * Valida o parâmetro `sexo`.
 * @param {string} valor
 * @returns {{ valido: boolean, mensagem?: string }}
 */
function validarSexo(valor) {
  if (!SEXOS_VALIDOS.includes(valor)) {
    return {
      valido: false,
      mensagem: `O valor de 'sexo' deve ser ${SEXOS_VALIDOS.map(v => `'${v}'`).join(' ou ')}`,
    };
  }
  return { valido: true };
}

/**
 * Valida o parâmetro `faixa_etaria`.
 * @param {string} valor
 * @returns {{ valido: boolean, mensagem?: string }}
 */
function validarFaixaEtaria(valor) {
  if (!FAIXAS_ETARIAS_VALIDAS.includes(valor)) {
    return {
      valido: false,
      mensagem: `O valor de 'faixa_etaria' deve ser um de: ${FAIXAS_ETARIAS_VALIDAS.join(', ')}`,
    };
  }
  return { valido: true };
}

/**
 * Valida o parâmetro `cid_capitulo`.
 * @param {string} valor
 * @returns {{ valido: boolean, mensagem?: string }}
 */
function validarCidCapitulo(valor) {
  if (!CAPITULOS_CID10_VALIDOS.includes(valor)) {
    return {
      valido: false,
      mensagem: `O valor de 'cid_capitulo' deve ser um numeral romano válido da CID-10 (ex: I, II, IX, X, XI)`,
    };
  }
  return { valido: true };
}

/**
 * Valida todos os parâmetros de query do endpoint /api/indicadores.
 * Retorna uma lista de erros encontrados (vazia se todos forem válidos).
 *
 * @param {{ cid_capitulo?: string, sexo?: string, faixa_etaria?: string }} params
 * @returns {string[]} lista de mensagens de erro
 */
function validarParametrosIndicadores({ cid_capitulo, sexo, faixa_etaria }) {
  const erros = [];

  if (sexo !== undefined) {
    const resultado = validarSexo(sexo);
    if (!resultado.valido) erros.push(resultado.mensagem);
  }

  if (faixa_etaria !== undefined) {
    const resultado = validarFaixaEtaria(faixa_etaria);
    if (!resultado.valido) erros.push(resultado.mensagem);
  }

  if (cid_capitulo !== undefined) {
    const resultado = validarCidCapitulo(cid_capitulo);
    if (!resultado.valido) erros.push(resultado.mensagem);
  }

  return erros;
}

module.exports = {
  validarParametrosIndicadores,
  SEXOS_VALIDOS,
  FAIXAS_ETARIAS_VALIDAS,
  CAPITULOS_CID10_VALIDOS,
};
