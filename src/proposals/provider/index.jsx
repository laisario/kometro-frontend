import _, {debounce} from 'lodash';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useForm, useWatch } from 'react-hook-form';
import dayjs from 'dayjs';
import { axios } from '../../api';
import { enqueueSnackbar } from 'notistack';
import ProposalsContext from "../context";

const ProposalsProvider = ({ children }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [debouncedSearchFilter, setDebouncedSearchFilter] = useState('')
  const [error, setError] = useState({});
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const formFilter = useForm({
    defaultValues: {
      search: "",
      status: "",
      dateStart: "",
      dateStop: "",
      filterByDate: false,
    }
  })
  
  const {
    search,
    status,
    dateStart,
    dateStop,
    filterByDate,
  } = useWatch({ control: formFilter.control })
  
  const formCreateProposal = useForm({
    defaultValues: {
      cliente: '',
      informacoesAdicionais: '',
      instrumentos: [],
    }
  })
  
  const {
    cliente,
    informacoesAdicionais,
    instrumentos,
  } = useWatch({ control: formCreateProposal.control })
  
  const { 
    data: allProposals, 
    error: errorProposals, 
    isLoading: isLoadingProposals 
  } = useQuery(
    ['propostas', 
    page, 
    rowsPerPage, 
    debouncedSearchFilter, 
    status, 
    filterByDate], async () => {
    const response = await axios.get('/propostas',
      {
        params:
        {
          page_size: rowsPerPage,
          page: page + 1,
          search: debouncedSearchFilter,
          dataCriacaoAfter: dateStart ? dayjs(dateStart).format('YYYY-MM-DD') : null,
          dataCriacaoBefore: dateStop ? dayjs(dateStop).format('YYYY-MM-DD') : null,
          status
        }
      });
      return response?.data;
    });
    
    const handleSearchFilter = debounce((value) => setDebouncedSearchFilter(value), 500);
    
    useEffect(() => { handleSearchFilter(search) }, [search, handleSearchFilter])
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const createProposal = async () => {
      await axios.post('/propostas/', { 
        instrumentos: instrumentos?.length ? instrumentos?.map(instrumento => instrumento?.id) : null, 
        cliente: cliente?.id ? cliente?.id : null, 
        informacoesAdicionais: informacoesAdicionais
      });
    }
  
    const { 
      mutate: mutateCreateProposal, 
      isLoading: isLoadingCreateProposal
    } = useMutation({
      mutationFn: createProposal,
      onSuccess: () => {
        enqueueSnackbar('Proposta criada com sucesso!', {
          variant: 'success'
        });
        queryClient.invalidateQueries({ queryKey: ['propostas'] })
        handleClose()
        formCreateProposal.reset()

      },
      onError: (error) => {
        const erros = error?.response?.data
        setError(erros)
        enqueueSnackbar('Falha ao criar a proposta, tente novamente!', {
          variant: 'error'
        });
      }
    })

    const { mutate: deleteOrder, isLoading: isDeleting } = useMutation({
    mutationFn: async (ids) => Promise.all(ids?.map((id) => axios.delete(`/propostas/${id}`))), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
      enqueueSnackbar('Proposta deletada com sucesso!', {
        variant: 'success'
      });
    },
    onError: (error) => {
      enqueueSnackbar('Falha ao deletar a proposta, tente novamente!', {
        variant: 'error'
      });
    }
  })
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ProposalsContext.Provider
      value={{
        allProposals,
        errorProposals,
        isLoadingProposals,
        deleteOrder,
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        formFilter,
        isDeleting,
        formCreateProposal,
        mutateCreateProposal,
        isLoadingCreateProposal,
        error,
        setError,
        handleOpen,
        handleClose,
        open
      }}
    >
      {children}
    </ProposalsContext.Provider>
  );
};

export default ProposalsProvider;


