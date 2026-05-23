/**
 * Calcula a cor coroplética de um município com base no total de atendimentos.
 *
 * A escala vai de amarelo (#ffffb2) a vermelho (#bd0026) conforme o valor
 * relativo ao máximo encontrado no dataset atual.
 *
 * @param {number} valor - total_atendimentos do município
 * @param {number} maximo - valor máximo no dataset atual
 * @returns {string} cor em hexadecimal
 */
export function calcularCor(valor, maximo) {
  // Municípios sem dados recebem cor neutra
  if (!valor || !maximo || maximo === 0) return '#d9d9d9';

  // Escala de cor: amarelo → laranja → vermelho (5 níveis)
  const ESCALA = ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'];

  const proporcao = valor / maximo;

  if (proporcao <= 0.2) return ESCALA[0];
  if (proporcao <= 0.4) return ESCALA[1];
  if (proporcao <= 0.6) return ESCALA[2];
  if (proporcao <= 0.8) return ESCALA[3];
  return ESCALA[4];
}

/**
 * Retorna os intervalos da legenda com base no valor máximo do dataset.
 *
 * @param {number} maximo - valor máximo no dataset atual
 * @returns {Array<{cor: string, rotulo: string}>}
 */
export function obterIntervaloLegenda(maximo) {
  if (!maximo || maximo === 0) {
    return [{ cor: '#d9d9d9', rotulo: 'Sem dados' }];
  }

  return [
    { cor: '#ffffb2', rotulo: `Até ${Math.round(maximo * 0.2).toLocaleString('pt-BR')}` },
    { cor: '#fecc5c', rotulo: `Até ${Math.round(maximo * 0.4).toLocaleString('pt-BR')}` },
    { cor: '#fd8d3c', rotulo: `Até ${Math.round(maximo * 0.6).toLocaleString('pt-BR')}` },
    { cor: '#f03b20', rotulo: `Até ${Math.round(maximo * 0.8).toLocaleString('pt-BR')}` },
    { cor: '#bd0026', rotulo: `Acima de ${Math.round(maximo * 0.8).toLocaleString('pt-BR')}` },
    { cor: '#d9d9d9', rotulo: 'Sem dados' },
  ];
}
