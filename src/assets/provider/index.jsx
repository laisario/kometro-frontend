import AssetsContext from "../context";
import _, {debounce} from 'lodash';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { axios } from '../../api';
import useAuth from "../../auth/hooks/useAuth";
import { enqueueSnackbar } from 'notistack';

const AssetsProvider = ({ children }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const queryClient = useQueryClient();
  const { cliente } = useAuth();

  const { 
      data: allAssets,
      error: errorAssets, 
      isLoading: isLoadingAssets, 
      refetch: refetchAssets,
  } = useQuery(['instrumentos', debouncedSearch, cliente, page, rowsPerPage], async () => {
    const response = await axios.get('/instrumentos', { params: { page: page + 1, page_size: rowsPerPage, search: debouncedSearch, client: cliente } });
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

  const deleteAsset = async (idInstrument) => {
    await axios.delete(`/instrumentos/${idInstrument}`);
  };

  const { mutate: mutateDelete, isLoading: isDeleting } = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
    },
  })

  const sendCriticalAnalisys = async ({ idCalibration, analiseCliente }) => {
    const patchData = { analiseCritica: analiseCliente?.criticalAnalysis }
    if (analiseCliente?.restrictions?.length) {
      patchData.restricaoAnaliseCritica = analiseCliente?.restrictions
    }
    const response = await axios.patch(`/calibracoes/${idCalibration}/`, patchData);
    return response.data;

  }

  const { 
    mutate: mutateCriticalAnalisys, 
    isLoading: isLoadingCriticalAnalisys, 
  } = useMutation({
    mutationFn: sendCriticalAnalisys,
    onSuccess: () => {
      enqueueSnackbar('Ánalise criada com sucesso!', {
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
    },
    onError: (error) => {
      enqueueSnackbar('Ocorreu um erro ao criar sua ánalise. Tente mais tarde!', {
        variant: 'error'
      });
      
    },
  })

  const formatedData = (form) => ({
    tag: form?.tag,
    numero_de_serie: form?.numeroDeSerie,
    data_proxima_checagem: form?.dataProximaChecagem && dayjs(form?.dataProximaChecagem)?.format('YYYY-MM-DD'),
    data_ultima_calibracao: form?.dataUltimaCalibracao && dayjs(form?.dataUltimaCalibracao)?.format('YYYY-MM-DD'),
    local: form?.local,
    instrumento: {
      maximo: form?.maximo,
      minimo: form?.minimo,
      unidade: form?.unidade,
      preco_calibracao_no_laboratorio: form?.precoCalibracaoLaboratorio,
      preco_calibracao_no_cliente: form?.precoCalibracaoCliente,
      capacidade_de_medicao: {
        valor: form?.capacidadeMedicao,
        unidade: form?.unidadeMedicao,
      },
      tipo_de_instrumento: {
        descricao: form?.descricao,
        fabricante: form?.fabricante,
        modelo: form?.modelo,
        resolucao: form?.resolucao,
      },
      procedimento_relacionado: {
        codigo: form?.procedimentoRelacionado
      },
      tipo_de_servico: form?.tipoDeServico,
    },
    preco_alternativo_calibracao: form?.precoAlternativoCalibracao,
    dias_uteis: form?.diasUteis,
    pontos_de_calibracao: form?.pontosCalibracao?.length ? form?.pontosCalibracao?.map(ponto => ({ nome: ponto })) : [],
    posicao: form?.posicao,
    frequencia: form?.frequencia,
    laboratorio: form?.laboratorio,
    observacoes: form?.observacoes,
    cliente: form?.client,
  })

  const updateInstrument = async (form) => {
    const data = formatedData(form)
    const response = await axios.patch(`/instrumentos/${form?.instrumento}/`, data);
    return response;
  }

  const { mutate: mutateUpdate, isLoading: isUpdatingInstrument, isError: isErrorUp, isSuccess: isSuccessUp } = useMutation({
    mutationFn: updateInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
    },
  })

  const createInstrument = async (form) => {
    const data = formatedData(form)

    const response = await axios.post(`/instrumentos/`, data);
    return response;
  }

  const { mutate: mutateCreate, isLoading: isCreating, isError: isErrorCreate, error: errorCreate, isSuccess: isSuccessCreate } = useMutation({
    mutationFn: createInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
    },
  })

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
        mutateUpdate,
        page,
        rowsPerPage,
        isUpdatingInstrument,
        mutateDelete,
        isDeleting,
        mutateCreate,
        isCreating,
        isErrorUp,
        isErrorCreate,
        errorCreate,
        isSuccessCreate,
        isSuccessUp,
        mutateCriticalAnalisys,
        isLoadingCriticalAnalisys,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

export default AssetsProvider;
