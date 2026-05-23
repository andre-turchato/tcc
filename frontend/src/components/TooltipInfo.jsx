/**
 * TooltipInfo
 *
 * Componente que exibe as informações de um município no tooltip do mapa.
 * Exibe: nome, total de atendimentos e valor total em BRL.
 */

import { formatarMoeda, formatarNumero } from '../utils/formatters';

/**
 * @param {{ nome: string, totalAtendimentos: number|null, valorTotal: number|null }} props
 */
export default function TooltipInfo({ nome, totalAtendimentos, valorTotal }) {
  return (
    <div className="tooltip-info">
      <strong className="tooltip-municipio">{nome}</strong>
      <table className="tooltip-tabela">
        <tbody>
          <tr>
            <td>Atendimentos:</td>
            <td>
              <strong>
                {totalAtendimentos !== null ? formatarNumero(totalAtendimentos) : 'Sem dados'}
              </strong>
            </td>
          </tr>
          <tr>
            <td>Valor total:</td>
            <td>
              <strong>
                {valorTotal !== null ? formatarMoeda(valorTotal) : '—'}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
