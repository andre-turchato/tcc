import { useQuery } from '@tanstack/react-query';
import { buscarGeometria } from '../services/api';

/**
 * Hook para buscar a geometria (GeoJSON) dos municípios do Sudoeste do Paraná.
 *
 * A geometria é carregada uma única vez ao inicializar a aplicação,
 * pois raramente muda (cache de 1 hora no cliente).
 *
 * @returns {{ data, isLoading, isError, error }}
 */
export function useGeometria() {
  return useQuery({
    queryKey: ['geometria'],
    queryFn: buscarGeometria,
    staleTime: 60 * 60 * 1000, // 1 hora
    retry: 2,
  });
}
