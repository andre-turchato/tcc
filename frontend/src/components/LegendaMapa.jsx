/**
 * LegendaMapa
 *
 * Exibe a legenda de cores do mapa coroplético.
 * Cada nível da escala de amarelo → vermelho é apresentado com seu rótulo.
 */

import { obterIntervaloLegenda } from '../utils/colorScale';

/**
 * @param {{ maximo: number }} props
 */
export default function LegendaMapa({ maximo }) {
  const intervalos = obterIntervaloLegenda(maximo);

  return (
    <div className="legenda-mapa">
      <p className="legenda-titulo">Atendimentos</p>
      <ul className="legenda-lista">
        {intervalos.map((item) => (
          <li key={item.rotulo} className="legenda-item">
            <span
              className="legenda-cor"
              style={{ backgroundColor: item.cor }}
              aria-hidden="true"
            />
            <span className="legenda-rotulo">{item.rotulo}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
