import { useQuery } from "react-query";
import { axios } from "../../api";
import _, {debounce} from 'lodash';
import { useEffect, useState } from "react";

const useAssets = (id) => {
  const [debouncedSearchFilter, setDebouncedSearchFilter] = useState('')
  const [search, setSearch] = useState('')
  
  const { 
    data: assets, 
  } = useQuery({
    queryKey: ['instrumentos', id, debouncedSearchFilter], 
    queryFn: async () => {
      const response = await axios.get('/instrumentos/', {
        params: {
          id,
          search: debouncedSearchFilter
        }
      });
      
      return response?.data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  
  const handleSearchFilter = debounce((value) => setDebouncedSearchFilter(value), 1500);
  useEffect(() => { handleSearchFilter(search) }, [search, handleSearchFilter])

  return {
    assets, 
    search,
    setSearch
  }
};

export default useAssets;