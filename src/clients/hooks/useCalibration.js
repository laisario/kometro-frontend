import { useEffect, useMemo, useState } from 'react';
import _, {debounce} from 'lodash';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { axios, axiosForFiles } from '../../api';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

const useCalibrations = (id, instrumento) => {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCalibration, setSelectedCalibration] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreateCertificate, setOpenCreateCertificate] = useState(false);
  const [error, setError] = useState({});

  const queryClient = useQueryClient();
  
  const { data, isLoading: isLoadingCalibrations  } = useQuery(['calibracoes', debouncedSearch, instrumento, id], async () => {
    if (id) {
      const response = await axios.get(`/calibracoes/${id}/`, { params: { page_size: 9999 } });
      return response?.data;
    }
    const response = await axios.get('/calibracoes/', { params: { page_size: 9999, ordem_de_servico: debouncedSearch, instrumento } });
    return response?.data?.results;
  });
  
  const handleSearchOS = debounce((value) => setDebouncedSearch(value));
  useEffect(() => { handleSearchOS(search) }, [search, handleSearchOS])
  
  const deleteClibration = async (idCalibration) => {
    await axios.delete(`/calibracoes/${idCalibration}`);
  };
  
  const defaultValues = useMemo(() => ({
    local: selectedCalibration?.local ? selectedCalibration?.local : '',
    data: selectedCalibration?.data ? selectedCalibration?.data : null,
    ordemDeServico: selectedCalibration?.ordemDeServico ? selectedCalibration?.ordemDeServico : '',
    observacoes: selectedCalibration?.observacoes ? selectedCalibration?.observacoes : '',
    maiorErro: selectedCalibration?.maiorErro ? selectedCalibration?.maiorErro : null,
    incerteza: selectedCalibration?.incerteza ? selectedCalibration?.incerteza : null,
    criterioDeAceitacao: selectedCalibration?.criterioDeAceitacao !== 'none' || selectedCalibration?.criterioDeAceitacao ? selectedCalibration?.criterioDeAceitacao : '',
    referenciaDoCriterio: selectedCalibration?.referenciaDoCriterio ? selectedCalibration?.referenciaDoCriterio : null,
  }), [selectedCalibration])
  
  const form = useForm({ defaultValues })
  const formCreate = useForm({ defaultValues: {
    local: '',
    data: null,
    ordemDeServico: '',
    observacoes: '',
    maiorErro: null,
    incerteza: null,
    criterioDeAceitacao: '',
    referenciaDoCriterio: null
  }})


  useEffect(() => {
    form?.reset(defaultValues)
  } , [defaultValues])

  const handleOpenForm = () => setOpenForm(true);
  
  const handleCloseForm = () => setOpenForm(false);
  
  const {
    mutate: mutateDeleteCalibration,
    isLoading: isDeletingCalibration,
  } = useMutation({
    mutationFn: deleteClibration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calibracoes'] })
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
      setSelectedCalibration({});
      enqueueSnackbar('Calibração deletada com sucesso!', {
        variant: 'success'
      });
    },
    onError: (error) => {
      enqueueSnackbar('Erro ao deletar calibração. Tente novamente!', {
        variant: 'error'
      });
    },
  })


  const formatedData = (form) => ({
    ...form,
    data: form?.data && dayjs(form?.data)?.format('YYYY-MM-DD'),
  })

  const create = async (params) => {
    const data = formatedData(params?.form)
    const response = await axios.post(`/calibracoes/`, { ...data, instrumento });
    return response.data;
  }

  const {
    mutate: mutateCreation,
    isLoading: isLoadingCreation,
    error: errorCreating,
  } = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calibracoes'] })
      enqueueSnackbar('Calibração criada com sucesso!', {
        variant: 'success'
      });
      form.reset();
      setOpenForm(false);
    },
    onError: (error) => {
      setError(error?.response?.data);
      enqueueSnackbar('Erro ao criar calibração. Tente novamente!', {
        variant: 'error'
      });
    },
  })


  const edit = async (params) => {
    const data = formatedData(params?.form)
    const response = await axios.patch(`/calibracoes/${params?.id}/`, { ...data, instrumento });
    return response.data;
  }

  const {
    mutate: mutateEdit,
    isLoading: isLoadingEdit,
  } = useMutation({
    mutationFn: edit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calibracoes'] });
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] });
      setOpenEdit(false);
      setSelectedCalibration({});
      enqueueSnackbar('Calibração editada com sucesso!', {
        variant: 'success'
      });
    },
    onError: (error) => {
      setError(error?.response?.data);
      enqueueSnackbar('Erro ao editar calibração. Tente novamente!', {
        variant: 'error'
      });
    },
  })

  const addCertificate = async (params) => {
    const { data } = await axiosForFiles.post(`/calibracoes/${params?.id}/adicionar_certificado/`, { arquivo: params?.arquivo, numero: params?.numero })
    const anexosPromises = params?.anexos?.map(async anexo => {
      const formData = new FormData()
      formData.append('anexo', anexo?.anexo)
      formData.append('certificado', data?.id)
      const {data: dataAnexo } = await axiosForFiles.patch(`/calibracoes/anexar/`, formData)
      return dataAnexo
    })
    const anexos = await Promise.all(anexosPromises)
    data.anexos = anexos
    return data;
  }

  const {
    mutate: mutateAddCertificate,
    isLoading: isLoadingAddCertificate,
    data: dataAddCertificate,
  } = useMutation({
    mutationFn: addCertificate,
    onSuccess: async (res) => {
      setSelectedCalibration(selCalibration => ({...selCalibration, certificados: [...selCalibration?.certificados, res]}))
      setOpenCreateCertificate(false)
      enqueueSnackbar('Certificado adicionado com sucesso!', {
        variant: 'success'
      });
    }, 
    onError: (error) => {
      setError(error?.response?.data);
      enqueueSnackbar('Erro ao adicionar certificado. Tente novamente!', {
        variant: 'error'
      });
    },
  })

  const deleteCertificate = async (params) => {
    await axios.post(`/calibracoes/${params?.id}/apagar_certificado/`, { id: params?.idCertificado })
  }
   
  const {
    mutate: mutateDeleteCertificate,
    isLoading: isLoadingDeleteCertificate,
  } = useMutation({
    mutationFn: deleteCertificate,
    onSuccess: async (_, data) => {
      setSelectedCalibration(selCalibration => ({...selCalibration, certificados: selCalibration?.certificados?.filter(certificado => certificado?.id !== data?.idCertificado)}))
      enqueueSnackbar('Certificado deletado com sucesso!', {
        variant: 'success'
      });
    },
    onError: (error) => {
      enqueueSnackbar('Erro ao deletar certificado. Tente novamente!', {
        variant: 'error'
      });
    },
  })

  return {
    data,
    error,
    search,
    setSearch,
    errorCreating,
    mutateDeleteCalibration,
    mutateCreation,
    mutateEdit,
    mutateAddCertificate,
    mutateDeleteCertificate,
    isDeletingCalibration,
    isLoadingCreation,
    isLoadingEdit,
    isLoadingAddCertificate,
    isLoadingDeleteCertificate,
    dataAddCertificate,
    selectedCalibration,
    setSelectedCalibration,
    form,
    handleCloseForm,
    handleOpenForm,
    openForm,
    openEdit,
    setOpenEdit,
    openCreateCertificate,
    setOpenCreateCertificate,
    formCreate,
    error,
    setError,
    isLoadingCalibrations,
  }
}

export default useCalibrations;