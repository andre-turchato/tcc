'use strict';

const path = require('path');
const fs   = require('fs');

// Caminho absoluto para o arquivo GeoJSON estático
const GEOJSON_PATH = path.join(__dirname, '../../public/geo/sudoeste-pr.geojson');

/**
 * Lê e retorna o GeoJSON da malha territorial do Sudoeste do Paraná.
 * O arquivo é lido uma vez em memória para evitar I/O repetido.
 *
 * @returns {{ geojson: object }}
 * @throws {Error} Se o arquivo não for encontrado
 */
let _geojsonCache = null;

function obterGeometria() {
  if (_geojsonCache) return _geojsonCache;

  if (!fs.existsSync(GEOJSON_PATH)) {
    throw new Error(
      `Arquivo GeoJSON não encontrado em: ${GEOJSON_PATH}. ` +
      'Substitua o placeholder pelo arquivo real do IBGE.'
    );
  }

  const conteudo = fs.readFileSync(GEOJSON_PATH, 'utf-8');
  _geojsonCache = JSON.parse(conteudo);
  return _geojsonCache;
}

module.exports = { obterGeometria };
