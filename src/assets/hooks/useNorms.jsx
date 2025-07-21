import React from 'react'
import { useQuery } from 'react-query';
import { axios } from '../../api';

function useNorms(id) {
  const { 
    data, 
  } = useQuery({
    queryKey: ['normas'], 
    queryFn: async () => {
      const response = await axios.get(`/normativos/`, {params: { cliente: id || null }});
      return response?.data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  return {
    normas: data,
  }
}

export default useNorms