import { useQuery } from '@tanstack/react-query';
import { buscarIndicadores } from '../services/api';

/**
 * Hook para buscar os indicadores agregados por município.
 *
 * Os indicadores só são buscados quando `enabled` é true,
 * ou seja, quando o usuário clicar em "Atualizar Mapa".
 *
 * @param {Object}  filtros  - { cid_capitulo, sexo, faixa_etaria }
 * @param {boolean} enabled  - se true, dispara a requisição
 * @returns {{ data, isLoading, isError, error, isFetching }}
 */
export function useIndicadores(filtros, enabled) {
  return useQuery({
    queryKey: ['indicadores', filtros],
    queryFn: () => buscarIndicadores(filtros),
    enabled: !!enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos (alinhado com TTL do cache da API)
    retry: 2,
  });
}
