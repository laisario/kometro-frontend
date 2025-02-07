import React, { useState, useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useForm, useWatch } from 'react-hook-form';
import _, {debounce} from 'lodash';
import DocumentsContext from "../context";
import { axios, axiosForFiles } from '../../api';
import { isPastFromToday } from '../../utils/formatTime';
import { enqueueSnackbar } from 'notistack';

const DocumentsProvider = ({ children }) => {
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [openFormRevision, setOpenFormRevision] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState({});
  const queryClient = useQueryClient();

  const formFilter = useForm({
    defaultValues: {
      search: "",
      status: "",
    }
  })

  const {
    search,
    status: statusFilter,
  } = useWatch({ control: formFilter.control })

  const { data, isLoading, } = useQuery(['documentos', page, rowsPerPage, debouncedSearch, statusFilter], async () => {
    const response = await axios.get('/documentos', { params: { page: page + 1, page_size: rowsPerPage, search: debouncedSearch, status: statusFilter } });
    return response?.data
  });

  const handleSearch = debounce((value) => setDebouncedSearch(value), 500);

  useEffect(() => { handleSearch(search) }, [search, handleSearch])

  const create = async (form) => {
    const response = await axios.post('/documentos/', {
      codigo: form?.codigo,
      identificador: form?.identificador,
      titulo: form?.titulo,
      status: form?.status,
      data_revisao: form?.data_revisao,
      data_validade: form?.data_validade,
      criador: form?.criador,
      frequencia: form?.frequencia,
    });
    if (response?.data?.id) {
      const formData = new FormData()
      formData.append("arquivo", form?.arquivo)
      await axiosForFiles.patch(`/documentos/${response?.data?.id}/anexar/`, formData)
    }
    return response
  }

  const { 
    mutate: mutateCreate, 
    isLoading: isCreating, 
    isError: isErrorCreate, 
    isSuccess: isSuccessCreate, 
    error: errorCreate 
  } = useMutation({
    mutationFn: create,
    onSuccess: () => {
      enqueueSnackbar('Documento criada com sucesso!', {
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
    },
    onError: (error) => {
      const erros = error?.response?.data
      setError(erros)
      enqueueSnackbar('Falha ao criar documento, tente novamente!', {
        variant: 'error'
      });
    }
  })

  const createRevision = async (form) => {
    const response = await axios.post(`/documentos/${id}/revisar/`, {
      alteracao: form?.alteracao,
      aprovadores: form?.aprovadores,
    });
    if (response?.data?.revisao_id) {
      const formData = new FormData()
      formData.append("arquivo", form?.arquivo)
      await axiosForFiles.patch(`/documentos/${id}/alterar_anexo/`, formData)
    }
    return response
  }

  const { 
    mutate: mutateCreateRevision, 
    isLoading: isCreatingRevision, 
    isError: isErrorCreateRevision, 
    isSuccess: isSuccessCreateRevision, 
    error: errorCreateRevision
   } = useMutation({
    mutationFn: createRevision,
    onSuccess: () => {
      enqueueSnackbar('Revisão criada com sucesso!', {
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
    },
    onError: (error) => {
      const erros = error?.response?.data
      setError(erros)
      enqueueSnackbar('Falha ao criar revisão, tente novamente!', {
        variant: 'error'
      });
    }
  })

  const { 
    mutate: deleteDocumentos, 
    isLoading: isDeleting 
  } = useMutation(async (ids) => Promise.all(ids?.map((id) => axios.delete(`/documentos/${id}`))), {
    onSuccess: () => {
      enqueueSnackbar('Documento deletado com sucesso!', {
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
    },
    onError: () => {
      enqueueSnackbar('Falha ao deletar o documento, tente novamente!', {
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

  const expiredDocuments = useMemo(() => {
    return data?.results?.filter((document) =>
      isPastFromToday(document?.data_validade)
    );
  }, [data]);
  
  return (
    <DocumentsContext.Provider
      value={{
        data,
        deleteDocumentos,
        isDeleting,
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        isLoading,
        formFilter,
        mutateCreate,
        isErrorCreate,
        errorCreate,
        isCreating,
        isSuccessCreate,
        mutateCreateRevision,
        isCreatingRevision,
        isErrorCreateRevision,
        isSuccessCreateRevision,
        errorCreateRevision,
        expiredDocuments,
        openFormRevision,
        setOpenFormRevision
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};

export default DocumentsProvider;


