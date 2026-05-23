/**
 * App
 *
 * Componente raiz do Longevus.
 * Organiza a interface em duas áreas: Sidebar (filtros) e MapaCoropletico.
 * Gerencia o estado dos filtros e o controle de quando buscar os indicadores.
 */

import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MapaCoropletico from './components/MapaCoropletico';
import { useGeometria } from './hooks/useGeometria';
import { useIndicadores } from './hooks/useIndicadores';
import { FILTROS_INICIAIS } from './constants/filtros';

export default function App() {
  // Estado dos filtros selecionados na Sidebar
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);

  // Controla quando disparar a busca de indicadores
  // (true somente após clicar em "Atualizar Mapa")
  const [buscarAtivo, setBuscarAtivo] = useState(false);

  // Filtros que foram efetivamente submetidos para a query
  const [filtrosAtivos, setFiltrosAtivos] = useState(FILTROS_INICIAIS);

  // Busca a geometria uma única vez ao inicializar
  const {
    data: geojson,
    isLoading: carregandoGeo,
    isError: erroGeo,
  } = useGeometria();

  // Busca os indicadores somente quando o usuário clicar em "Atualizar Mapa"
  const {
    data: dadosIndicadores,
    isLoading: carregandoIndicadores,
    isFetching: buscandoIndicadores,
    isError: erroIndicadores,
  } = useIndicadores(filtrosAtivos, buscarAtivo);

  const indicadores = dadosIndicadores?.dados || null;

  // Verifica se a busca retornou resultado vazio
  const semDados = buscarAtivo && !carregandoIndicadores && Array.isArray(indicadores) && indicadores.length === 0;

  // Atualiza um campo específico dos filtros
  const handleFiltroChange = useCallback((campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  // Dispara nova busca com os filtros selecionados
  const handleAtualizar = useCallback(() => {
    setFiltrosAtivos({ ...filtros });
    setBuscarAtivo(true);
  }, [filtros]);

  // Limpa todos os filtros e reseta o mapa
  const handleLimpar = useCallback(() => {
    setFiltros(FILTROS_INICIAIS);
    setFiltrosAtivos(FILTROS_INICIAIS);
    setBuscarAtivo(false);
  }, []);

  return (
    <div className="app-layout">
      {/* Cabeçalho */}
      <header className="app-header">
        <h1>Longevus</h1>
        <p>Análise Geoespacial da Saúde Pública — Sudoeste do Paraná</p>
      </header>

      {/* Conteúdo principal */}
      <main className="app-conteudo">
        {/* Sidebar com filtros */}
        <Sidebar
          filtros={filtros}
          onChange={handleFiltroChange}
          onAtualizar={handleAtualizar}
          onLimpar={handleLimpar}
          carregando={carregandoIndicadores || buscandoIndicadores}
        />

        {/* Área do mapa */}
        <section className="app-mapa">
          <MapaCoropletico
            geojson={geojson}
            indicadores={indicadores}
            carregandoGeo={carregandoGeo}
            carregandoIndicadores={carregandoIndicadores || buscandoIndicadores}
            erroGeo={erroGeo ? new Error('Erro ao carregar geometria') : null}
            erroIndicadores={erroIndicadores ? new Error('Erro ao buscar indicadores') : null}
            semDados={semDados}
          />
        </section>
      </main>
    </div>
  );
}
