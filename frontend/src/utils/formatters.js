/**
 * Formata um número como moeda em BRL (Real Brasileiro).
 * Exemplo: 250000.50 → "R$ 250.000,50"
 */
export function formatarMoeda(valor) {
  if (valor === null || valor === undefined) return '—';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata um número inteiro com separador de milhar.
 * Exemplo: 1500 → "1.500"
 */
export function formatarNumero(valor) {
  if (valor === null || valor === undefined) return '—';
  return new Intl.NumberFormat('pt-BR').format(valor);
}
