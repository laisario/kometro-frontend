import { useMutation } from "react-query";
import { axios } from "../../api";
import { enqueueSnackbar } from "notistack";

const useDocumentMutations = (handleClose, setError) => {
  const create = async (form) => {
    const response = await axios.post('/documentos/', form);
    if (response?.data?.id) {
      const formData = new FormData()
      formData.append("arquivo", form?.arquivo)
      await axios.patch(`/documentos/${response?.data?.id}/anexar/`, formData)
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


  return {
    mutateCreate,
    isCreating,
    isSuccessCreate,
    errorCreate,
    deleteDocumentos,
    isDeleting,
  }
}

export default useDocumentMutations;