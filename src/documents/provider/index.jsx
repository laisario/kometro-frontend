import React, { useState, useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useForm, useWatch } from 'react-hook-form';
import _, {debounce} from 'lodash';
import DocumentsContext from "../context";
import { axios, axiosForFiles } from '../../api';
import { isPastFromToday } from '../../utils/formatTime';
import { enqueueSnackbar } from 'notistack';
import { useSearchParams } from 'react-router';

const DocumentsProvider = ({ children }) => {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState({});
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const vencidoParam = searchParams.get('vencido');

  const formFilter = useForm({
    defaultValues: {
      search: "",
      status: "",
    }
  })

  const form = useForm({
    defaultValues: {
      codigo: '',
      identificador: '',
      titulo: '',
      status: '',
      elaborador: '',
      frequencia: null,
      arquivo: null,
      dataValidade: '',
    }
  })

  const handleClose = () => {
    form.reset()
    setOpen(false);
  };

  const {
    search,
    status: statusFilter,
  } = useWatch({ control: formFilter.control })

  const { data, isLoading, } = useQuery(
    ['documentos', page, rowsPerPage, debouncedSearch, statusFilter, vencidoParam],
    async () => {
      let params = {
        page: page + 1, 
        page_size: rowsPerPage, 
        search: debouncedSearch, 
        status: statusFilter, 
      }

      if (vencidoParam !== null) {
        params.vencido = vencidoParam;
      }

      const response = await axios.get('/documentos/', { params });
      return response?.data
  }, {refetchOnReconnect: false,
    refetchOnWindowFocus: false});

  const handleSearch = debounce((value) => setDebouncedSearch(value), 1500);

  useEffect(() => { handleSearch(search) }, [search, handleSearch])

  const create = async (form) => {
    const response = await axios.post('/documentos/', form);
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
    isSuccess: isSuccessCreate, 
    error: errorCreate 
  } = useMutation({
    mutationFn: create,
    onSuccess: () => {
      enqueueSnackbar('Documento criada com sucesso!', {
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      handleClose();
    },
    onError: (error) => {
      const erros = error?.response?.data
      setError(erros)
      enqueueSnackbar('Falha ao criar documento, tente novamente!', {
        variant: 'error'
      });
    }
  })

  const { 
    mutate: deleteDocumentos, 
    isLoading: isDeleting 
  } = useMutation(async (ids) => Promise.all(ids?.map((id) => axios.delete(`/documentos/${id}/`))), {
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
        errorCreate,
        isCreating,
        isSuccessCreate,
        expiredDocuments,
        error,
        setError,
        open,
        setOpen,
        form,
        handleClose,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};

export default DocumentsProvider;


