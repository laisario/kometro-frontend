import { useEffect, useState } from 'react';
import ClientsContext from '../context';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useForm, useWatch } from 'react-hook-form';
import _, {debounce} from 'lodash';
import { axios } from '../../api';
import { enqueueSnackbar } from 'notistack';

const ClientsProvider = ({ children }) => {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const queryClient = useQueryClient();

  const { 
    data: clients, 
    error: errorClients, 
    isLoading: isLoadingClients, 
  } = useQuery(['clientes', page, rowsPerPage, debouncedSearch], async () => {
    const response = await axios.get('/clientes', { params: { page: page + 1, page_size: rowsPerPage, search: debouncedSearch } });
    return response?.data;
  });

  const formFilter = useForm({defaultValues: { search: "" }});

  const {
    search,
  } = useWatch({ control: formFilter.control });

  const handleSearch = debounce((search) => setDebouncedSearch(search), 1500);

  useEffect(() => { handleSearch(search) }, [search, handleSearch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { 
    mutate: deleteClients, 
    isLoading: isDeleting 
  } = useMutation({
    mutationFn: async (ids) => Promise.all(ids?.map((id) => axios.delete(`/clientes/${id}`))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      enqueueSnackbar('Cliente deletado com sucesso!', {
        variant: 'success'
      });
    },
    onError: (error) => {
      console.log(error)
      enqueueSnackbar('Erro ao deletar cliente. Tente novamente!', {
        variant: 'error'
      });
    }
  })

  return (
    <ClientsContext.Provider
      value={{
        clients, 
        errorClients, 
        isLoadingClients, 
        formFilter,
        handleChangePage,
        handleChangeRowsPerPage,
        deleteClients,
        isDeleting,
        rowsPerPage,
        page
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export default ClientsProvider;
