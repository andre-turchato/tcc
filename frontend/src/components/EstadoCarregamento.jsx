/**
 * EstadoCarregamento
 *
 * Componente genérico para exibir estados de loading, erro e ausência de dados.
 * Mantém a interface informativa para profissionais de saúde sem perfil técnico.
 */

/**
 * @param {{ tipo: 'carregando' | 'erro' | 'vazio', mensagem?: string }} props
 */
export default function EstadoCarregamento({ tipo, mensagem }) {
  if (tipo === 'carregando') {
    return (
      <div className="estado-carregamento">
        <div className="spinner" aria-label="Carregando..." />
        <p>{mensagem || 'Carregando dados...'}</p>
      </div>
    );
  }

  if (tipo === 'erro') {
    return (
      <div className="estado-carregamento estado-erro">
        <span className="icone-estado">⚠️</span>
        <p>{mensagem || 'Ocorreu um erro ao carregar os dados. Tente novamente.'}</p>
      </div>
    );
  }

  if (tipo === 'vazio') {
    return (
      <div className="estado-carregamento estado-vazio">
        <span className="icone-estado">🔍</span>
        <p>{mensagem || 'Nenhum dado encontrado para os filtros selecionados.'}</p>
      </div>
    );
  }

  return null;
}
