import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import _, {debounce} from 'lodash';
import { axios } from "../../api";

const useClientAssets = (clientId, table = false) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { 
    data: assets, 
    error: errorAssets, 
    isLoading: isLoadingAssets, 
  } = useQuery({
    queryKey: ['instrumentos', clientId, debouncedSearch, page, rowsPerPage], 
    queryFn: async () => {
      const response = await axios.get(`/instrumentos/`, { 
        params: { 
          page_size: table ? rowsPerPage : 9999, 
          client: clientId,  
          page: page + 1,
          search: debouncedSearch, 
      }});
      return response?.data;
    },
    enabled: !!clientId,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const handleSearch = debounce((value) => setDebouncedSearch(value), 500);
  
  useEffect(() => { handleSearch(search) }, [search, handleSearch]);

  return {
    assets, 
    errorAssets, 
    isLoadingAssets, 
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    search,
    setSearch,
  }
};

export default useClientAssets;