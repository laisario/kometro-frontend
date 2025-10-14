import { useQuery } from 'react-query';
import { axios } from '../../api';


const useCalibration = (id, debouncedSearch, instrumento, checagem) => {
  console.log(instrumento, "instrumento")
  const { data, isLoading: isLoadingCalibrations  } = useQuery(
    ['calibracoes', debouncedSearch, instrumento, id, checagem], async () => {
      if (id) {
        const response = await axios.get(`/calibracoes/${id}/`, { params: { page_size: 9999 } });
        return response?.data;
      }
      
      const response = await axios.get('/calibracoes/', { params: { page_size: 9999, ordem_de_servico: debouncedSearch, instrumento, checagem } });
      console.log(response, "AAAAAA")
      return response?.data?.results;
    }, { 
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: !!instrumento,
      // staleTime: 15 * 60 * 1000,
      // cacheTime: 60 * 60 * 1000,
      // refetchOnMount: false,
      // refetchInterval: false,
    });

  return {
    data,
    isLoadingCalibrations
  }
};

export default useCalibration;