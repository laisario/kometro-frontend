import React, { useEffect, useState } from 'react'
import { axios } from "../../api";
import _, {debounce} from 'lodash';
import { useQuery } from "react-query";

function useDefaultAssets() {
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [search, setSearch] = useState('')
  const { 
    data, 
    error,
    isFetching
  } = useQuery({
    queryKey: ['instrumentos-empresa', debouncedSearch], 
    queryFn: async () => {
      const response = await axios.get(`/instrumentos-empresa/`, { params: { 
        page_size: 9999,  
        search: debouncedSearch 
      }});
      return response?.data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const handleSearch = debounce((value) => setDebouncedSearch(value));
  useEffect(() => { handleSearch(search) }, [search, handleSearch])

  return {
    defaultAssets: data,
    errorDefaultAssets: error,
    search,
    setSearch,
    isFetching
  }
}

export default useDefaultAssets


