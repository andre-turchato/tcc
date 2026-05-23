/**
 * MapaCoropletico
 *
 * Componente principal do mapa interativo.
 * Renderiza o GeoJSON dos municípios do Sudoeste do Paraná usando Leaflet,
 * aplica coloração coroplética conforme total_atendimentos e exibe tooltip.
 */

import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { calcularCor, obterIntervaloLegenda } from '../utils/colorScale';
import { combinarDadosGeo, obterMaximoAtendimentos } from '../utils/mergeGeoData';
import LegendaMapa from './LegendaMapa';
import EstadoCarregamento from './EstadoCarregamento';

// Coordenadas centrais aproximadas do Sudoeste do Paraná
const CENTRO_SUDOESTE_PR = [-25.8, -52.9];
const ZOOM_INICIAL = 9;

/**
 * @param {{
 *   geojson: Object|null,
 *   indicadores: Array|null,
 *   carregandoGeo: boolean,
 *   carregandoIndicadores: boolean,
 *   erroGeo: Error|null,
 *   erroIndicadores: Error|null,
 *   semDados: boolean,
 * }} props
 */
export default function MapaCoropletico({
  geojson,
  indicadores,
  carregandoGeo,
  carregandoIndicadores,
  erroGeo,
  erroIndicadores,
  semDados,
}) {
  // Referência para forçar re-render do GeoJSON quando os dados mudam
  const geojsonKey = useRef(0);
  useEffect(() => {
    geojsonKey.current += 1;
  }, [indicadores]);

  // Combina geometria com indicadores
  const geoDados = combinarDadosGeo(geojson, indicadores || []);
  const maximo = obterMaximoAtendimentos(geoDados);

  // Função de estilo aplicada a cada feature do GeoJSON
  function estilizarFeature(feature) {
    const total = feature.properties?.total_atendimentos;
    return {
      fillColor: calcularCor(total, maximo),
      weight: 1,
      opacity: 1,
      color: '#555',
      fillOpacity: 0.75,
    };
  }

  // Eventos de interação em cada município
  function aoPassarMouse(event) {
    event.layer.setStyle({
      weight: 2,
      color: '#333',
      fillOpacity: 0.9,
    });
    event.layer.bringToFront();
  }

  function aoSairMouse(event, layerRef) {
    layerRef.resetStyle(event.layer);
  }

  function onEachFeature(feature, layer) {
    const { nome, total_atendimentos, valor_total } = feature.properties || {};

    // Formata os valores para o tooltip
    const totalFormatado =
      total_atendimentos !== null && total_atendimentos !== undefined
        ? new Intl.NumberFormat('pt-BR').format(total_atendimentos)
        : 'Sem dados';

    const valorFormatado =
      valor_total !== null && valor_total !== undefined
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor_total)
        : '—';

    layer.bindTooltip(
      `<div class="tooltip-info">
        <strong class="tooltip-municipio">${nome || 'Município'}</strong>
        <table class="tooltip-tabela">
          <tbody>
            <tr><td>Atendimentos:</td><td><strong>${totalFormatado}</strong></td></tr>
            <tr><td>Valor total:</td><td><strong>${valorFormatado}</strong></td></tr>
          </tbody>
        </table>
      </div>`,
      { sticky: true }
    );

    layer.on({
      mouseover: aoPassarMouse,
      mouseout: (e) => {
        // Resetar estilo exige referência ao GeoJSON layer — usamos o evento
        const alvo = e.target;
        alvo.setStyle(estilizarFeature(feature));
      },
    });
  }

  // Estados de loading e erro
  if (carregandoGeo) {
    return <EstadoCarregamento tipo="carregando" mensagem="Carregando o mapa..." />;
  }

  if (erroGeo) {
    return (
      <EstadoCarregamento
        tipo="erro"
        mensagem="Não foi possível carregar a geometria do mapa. Verifique se a API está em execução."
      />
    );
  }

  if (erroIndicadores) {
    return (
      <EstadoCarregamento
        tipo="erro"
        mensagem="Erro ao buscar os indicadores. Tente atualizar o mapa novamente."
      />
    );
  }

  return (
    <div className="mapa-container">
      {/* Feedback de carregamento dos indicadores (overlay) */}
      {carregandoIndicadores && (
        <div className="mapa-overlay">
          <EstadoCarregamento tipo="carregando" mensagem="Atualizando indicadores..." />
        </div>
      )}

      {/* Mensagem quando nenhum dado é encontrado */}
      {semDados && (
        <div className="mapa-aviso">
          Nenhum dado encontrado para os filtros selecionados.
        </div>
      )}

      {/* Mapa Leaflet */}
      {geojson && (
        <MapContainer
          center={CENTRO_SUDOESTE_PR}
          zoom={ZOOM_INICIAL}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            key={geojsonKey.current}
            data={geoDados}
            style={estilizarFeature}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      )}

      {/* Legenda */}
      <LegendaMapa maximo={maximo} />
    </div>
  );
}
