import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { axios } from '../../api'
import { enqueueSnackbar } from 'notistack';

function useClientMutations(handleClose) {
    const queryClient = useQueryClient();
  
    const { 
      mutate: updateCriterion, 

    } = useMutation({
      mutationFn: async(data) => await axios.patch(`/clientes/${data?.id}/atualizar_criterio_frequencia_padrao/`, {
        criterioFrequencia: data?.criterion
      }),
      onSuccess: () => {
        enqueueSnackbar('Preferência configurada com sucesso!', {
          variant: 'success',
          autoHideDuration: 2000
        })
        queryClient.invalidateQueries({ queryKey: ['clientes'] });
        handleClose()
      },
      onError: (error) => {
        enqueueSnackbar(getErrorMessage(error?.status), {
          variant: 'error',
          autoHideDuration: 2000
        })
      }
    })
  
  return {
    updateCriterion
  }
}

export default useClientMutations