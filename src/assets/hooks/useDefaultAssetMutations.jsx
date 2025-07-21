import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query';
import 'dayjs/locale/pt-br';
import { axios } from '../../api';

function useDefaultAssetMutations(onClose, form, setInstrumentoSelecionado) {
  const [error, setError] = useState({});
  const queryClient = useQueryClient();

  const createSector = async (data) => {
    const response = await axios.post(`/instrumentos-empresa/`, data);
    return response
  }

  const { 
    mutate: mutateCreate, 
    isLoading: isLoadingCreate, 
  } = useMutation({
    mutationFn: createSector,
    onSuccess: (novoInstrumento) => {
      queryClient.invalidateQueries({ queryKey: ['instrumentos-empresa'] })
      form.reset()
      setInstrumentoSelecionado(novoInstrumento?.data);
      onClose()
      enqueueSnackbar('Instrumento criado com sucesso!', {
        variant: 'success'
      });
    },
    onError: (erro) => {
      setError(erro?.response?.data)
      enqueueSnackbar('Falha ao criar instrumento, tente novamente!', {
        variant: 'error'
      });
    }
  })

  return {
    mutateCreateDefaultAsset: mutateCreate,
    isLoadingCreateDefaultAsset: isLoadingCreate,
    errorDefaultAsset: error,
    setError,
  }
}

export default useDefaultAssetMutations