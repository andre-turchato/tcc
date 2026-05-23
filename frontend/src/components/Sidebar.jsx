/**
 * Sidebar
 *
 * Painel lateral com os filtros disponíveis para o mapa coroplético.
 * Contém selects para CID-10, Sexo e Faixa Etária, além dos botões
 * "Atualizar Mapa" e "Limpar Filtros".
 */

import { OPCOES_CID, OPCOES_SEXO, OPCOES_FAIXA_ETARIA } from '../constants/filtros';

/**
 * @param {{
 *   filtros: { cid_capitulo: string, sexo: string, faixa_etaria: string },
 *   onChange: (campo: string, valor: string) => void,
 *   onAtualizar: () => void,
 *   onLimpar: () => void,
 *   carregando: boolean,
 * }} props
 */
export default function Sidebar({ filtros, onChange, onAtualizar, onLimpar, carregando }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-titulo">Filtros</h2>

      {/* Filtro por CID-10 */}
      <div className="filtro-grupo">
        <label htmlFor="filtro-cid" className="filtro-label">
          CID-10 (Capítulo)
        </label>
        <select
          id="filtro-cid"
          className="filtro-select"
          value={filtros.cid_capitulo}
          onChange={(e) => onChange('cid_capitulo', e.target.value)}
        >
          {OPCOES_CID.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro por Sexo */}
      <div className="filtro-grupo">
        <label htmlFor="filtro-sexo" className="filtro-label">
          Sexo
        </label>
        <select
          id="filtro-sexo"
          className="filtro-select"
          value={filtros.sexo}
          onChange={(e) => onChange('sexo', e.target.value)}
        >
          {OPCOES_SEXO.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro por Faixa Etária */}
      <div className="filtro-grupo">
        <label htmlFor="filtro-faixa" className="filtro-label">
          Faixa Etária
        </label>
        <select
          id="filtro-faixa"
          className="filtro-select"
          value={filtros.faixa_etaria}
          onChange={(e) => onChange('faixa_etaria', e.target.value)}
        >
          {OPCOES_FAIXA_ETARIA.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </div>

      {/* Botões de ação */}
      <div className="sidebar-acoes">
        <button
          className="btn btn-primario"
          onClick={onAtualizar}
          disabled={carregando}
        >
          {carregando ? 'Atualizando...' : 'Atualizar Mapa'}
        </button>
        <button
          className="btn btn-secundario"
          onClick={onLimpar}
          disabled={carregando}
        >
          Limpar Filtros
        </button>
      </div>

      {/* Rodapé informativo */}
      <p className="sidebar-info">
        Dados de internações hospitalares do SUS — Sudoeste do Paraná.
      </p>
    </aside>
  );
}
