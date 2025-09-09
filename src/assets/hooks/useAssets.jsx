import { useQuery } from "react-query";
import { axios } from "../../api";
import _, {debounce} from 'lodash';
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

const useAssets = (id) => {
  const [debouncedSearchFilter, setDebouncedSearchFilter] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearchNormaFilter, setDebouncedSearchNormaFilter] = useState('')

  const assetFilterForm = useForm({
    defaultValues: {
      status: 'all',
      dateStart: "",
      dateStop: "",
      filterByDate: false,
      norma: '',
    }
  })

  const {
    dateStart,
    dateStop,
    filterByDate,
    status,
    norma,
  } = useWatch({ control: assetFilterForm.control })
  
  const { 
    data: assets,
    isFetching: isFetchingAssets,
  } = useQuery({
    queryKey: [
      'instrumentos', 
      id, 
      debouncedSearchFilter,
      dateStart,
      dateStop,
      filterByDate,
      status,
      debouncedSearchNormaFilter,
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
          norma: debouncedSearchNormaFilter,
        }
      });
      
      return response?.data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  
  const handleSearchFilter = debounce((value) => setDebouncedSearchFilter(value), 1500);
  const handleSearchNormaFilter = debounce((value) => setDebouncedSearchNormaFilter(value), 1500);

  useEffect(() => { handleSearchFilter(search) }, [search, handleSearchFilter])
  useEffect(() => { handleSearchNormaFilter(norma) }, [norma, handleSearchNormaFilter])

  return {
    assets, 
    search,
    setSearch,
    assetFilterForm,
    isFetchingAssets,
  }
};

export default useAssets;