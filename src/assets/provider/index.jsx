import AssetsContext from "../context";
import _, {debounce} from 'lodash';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { axios } from '../../api';


const AssetsProvider = ({ children }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const { 
    data: allAssets,
    error: errorAssets, 
    isLoading: isLoadingAssets, 
    refetch: refetchAssets,
  } = useQuery(['instrumentos', debouncedSearch, page, rowsPerPage], async () => {
    const response = await axios.get('/instrumentos', { params: { page: page + 1, page_size: rowsPerPage, search: debouncedSearch} });
    return response?.data;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = debounce((value) => setDebouncedSearch(value), 500);

  useEffect(() => { handleSearch(search) }, [search, handleSearch])

  return (
    <AssetsContext.Provider
      value={{
        allAssets,
        errorAssets, 
        isLoadingAssets, 
        refetchAssets,
        handleChangePage,
        handleChangeRowsPerPage,
        search,
        setSearch,
        page,
        rowsPerPage,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

export default AssetsProvider;
