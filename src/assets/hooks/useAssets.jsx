import { useQuery } from "react-query";
import { axios } from "../../api";
import _, {debounce} from 'lodash';
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

const useAssets = (id) => {
  const [debouncedSearchFilter, setDebouncedSearchFilter] = useState('')
  const [search, setSearch] = useState('')

  const assetFilterForm = useForm({
    defaultValues: {
      status: 'all',
      dateStart: "",
      dateStop: "",
      filterByDate: false,
    }
  })

  const {
    dateStart,
    dateStop,
    filterByDate,
    status
  } = useWatch({ control: assetFilterForm.control })
  
  const { 
    data: assets, 
  } = useQuery({
    queryKey: [
      'instrumentos', 
      id, 
      debouncedSearchFilter,
      dateStart,
      dateStop,
      filterByDate,
      status,
    ], 
    queryFn: async () => {
      const response = await axios.get('/instrumentos/', {
        params: {
          id,
          search: debouncedSearchFilter,
          dateStart,
          dateStop,
          filterByDate,
          status,
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
    setSearch,
    assetFilterForm
  }
};

export default useAssets;