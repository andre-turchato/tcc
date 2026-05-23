/**
 * Combina os dados do GeoJSON (geometria) com os indicadores retornados pela API.
 *
 * Para cada feature do GeoJSON, busca o indicador correspondente pelo
 * campo `codigo_ibge` e injeta os dados na propriedade `properties`.
 *
 * @param {Object} geojson - FeatureCollection retornado por GET /api/geometria
 * @param {Array}  indicadores - array de { codigo_ibge, total_atendimentos, valor_total }
 * @returns {Object} novo GeoJSON com propriedades enriquecidas
 */
export function combinarDadosGeo(geojson, indicadores) {
  if (!geojson || !geojson.features) return geojson;

  // Cria um mapa rápido: codigo_ibge → indicador
  const mapaIndicadores = {};
  if (Array.isArray(indicadores)) {
    indicadores.forEach((item) => {
      mapaIndicadores[item.codigo_ibge] = item;
    });
  }

  const featuresEnriquecidas = geojson.features.map((feature) => {
    const codigoIbge = feature.properties?.codigo_ibge;
    const indicador = mapaIndicadores[codigoIbge] || null;

    return {
      ...feature,
      properties: {
        ...feature.properties,
        total_atendimentos: indicador?.total_atendimentos ?? null,
        valor_total: indicador?.valor_total ?? null,
      },
    };
  });

  return {
    ...geojson,
    features: featuresEnriquecidas,
  };
}

/**
 * Retorna o valor máximo de total_atendimentos no GeoJSON enriquecido.
 *
 * @param {Object} geojson - GeoJSON já combinado com indicadores
 * @returns {number} valor máximo encontrado (0 se não houver dados)
 */
export function obterMaximoAtendimentos(geojson) {
  if (!geojson?.features?.length) return 0;

  return geojson.features.reduce((maximo, feature) => {
    const total = feature.properties?.total_atendimentos;
    if (total && total > maximo) return total;
    return maximo;
  }, 0);
}
