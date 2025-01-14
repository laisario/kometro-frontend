import AssetsContext from "../context";
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
  
  const { data, error, isLoading, refetch } = useQuery(['propostas', page, rowsPerPage, debouncedSearchFilter, status, filterByDate], async () => {
    const response = await axios.get('/propostas',
      {
        params:
        {
          page_size: rowsPerPage,
          page: page + 1,
          search: debouncedSearchFilter,
          data_criacao_after: dateStart ? dayjs(dateStart).format('YYYY-MM-DD') : null,
          data_criacao_before: dateStop ? dayjs(dateStop).format('YYYY-MM-DD') : null,
          status
        }
      });
    return response?.data;
  });
  
  const handleSearchFilter = debounce((value) => setDebouncedSearchFilter(value));
  
  useEffect(() => { handleSearchFilter(search) }, [search, handleSearchFilter])
  
  const aprovacaoProposta = {
    null: 'Proposta em análise',
    false: 'Proposta negada',
    true: 'Proposta aprovada',
  };
  
  const colorAprovacaoProposta = {
    null: 'info',
    false: 'error',
    true: 'success',
  };
  
  const statusColor = {
    "E": 'info',
    "AA": 'warning',
    "A": 'success',
    "R": 'error',
  }
  
  const statusString = {
    "E": 'Em elaboração',
    "AA": 'Aguardando aprovação',
    "A": 'Aprovada',
    "R": 'Reprovada',
  }
  
  const { mutate: deleteOrder, isLoading: isDeleting } = useMutation(async (ids) => Promise.all(ids?.map((id) => axios.delete(`/propostas/${id}`))), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
    },
  })
  
  const createOrder = async ({instrumentos, cliente, ...rest}) => {
    try {
      await axios.post('/propostas/', { instrumentos: instrumentos?.map(instrumento => instrumento?.id), cliente: cliente?.id, ...rest });
    } catch (err) {
      console.log(err);
    }
  }
  
  const { mutate: mutateCreateOrder, isLoading: isLoadingCreateOrder, isSuccess: isSuccessCreateOrder } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
    },
  })
  
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const elaborate = async (form, editProposol, setResponse, setOpenAlert, setLoading, handleClose) => {
    const formValues = form.watch()
    const formatDayjs = (date) => dayjs.isDayjs(date) ? date.format('YYYY-MM-DD') : null;
    const commonData = {
      total: formValues.total || 0,
      condicaoDePagamento: formValues.formaDePagamento || null,
      transporte: formValues.transporte || null,
      numero: formValues.numeroProposta || 0,
      validade: formatDayjs(formValues.validade) || null,
      status: formValues.status || null,
      prazoDePagamento: formatDayjs(formValues.prazoDePagamento) || null,
      edit: editProposol,
      responsavel: formValues.responsavel || null,
      diasUteis: formValues.diasUteis || null,
    };

    try {
      let response;
      if (formValues.enderecoDeEntrega === 'enderecoCadastrado') {
        response = await axios.patch(`/propostas/${id}/elaborar/`, {
          ...commonData,
          enderecoDeEntrega: data?.cliente?.endereco?.id || null,
        });
      } else {
        response = await axios.patch(`/propostas/${id}/elaborar/`, {
          ...commonData,
          enderecoDeEntregaAdd: {
            cep: formValues.CEP || null,
            numero: formValues.numeroEndereco || null,
            logradouro: formValues.rua || null,
            bairro: formValues.bairro || null,
            cidade: formValues.cidade || null,
            estado: formValues.estado || null,
            complemento: formValues.complemento || null,
          } || null,
        });
      }
      setResponse({ status: response?.status, message: response?.data?.message });
    } catch (error) {
      console.log(error)
      setResponse({ status: error?.response?.status, message: "Ocorreu um erro ao elaborar a proposta, verifique se preencheu corretamente." });
    } finally {
      if (setLoading && handleClose) {
        setLoading(false)
        handleClose()
      }
      setOpenAlert(true);
      await refetch()
    }
  };

  return (
    <ProposalsContext.Provider
      value={{
        data,
        error,
        isLoading,
        deleteOrder,
        refetch,
        aprovacaoProposta,
        colorAprovacaoProposta,
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        formFilter,
        isDeleting,
        statusColor,
        statusString,
        mutateCreateOrder,
        isLoadingCreateOrder,
        isSuccessCreateOrder,
        elaborate
      }}
    >
      {children}
    </ProposalsContext.Provider>
  );
};

export default ProposalsProvider;


