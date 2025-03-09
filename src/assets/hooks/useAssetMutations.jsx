import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import { axios } from '../../api';

function useAssetMutations(handleCleanCreateForm, handleClose) {
  const [error, setError] = useState({});
  const queryClient = useQueryClient();
  const deleteAsset = async (id) => {
    await axios.delete(`/instrumentos/${id}`);
  };
  
  const { 
    mutate: mutateDelete, 
    isLoading: isDeleting 
  } = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
      enqueueSnackbar('Instrumento deletado com sucesso!', {
        variant: 'success'
      });
    },
    onError: () => {
      enqueueSnackbar('Ocorreu um erro ao deletar o instrumento. Tente mais tarde!', {
        variant: 'error'
      });
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
    onError: () => {
      enqueueSnackbar('Ocorreu um erro ao criar sua ánalise. Tente mais tarde!', {
        variant: 'error'
      });
    },
  })

  const formatedData = (form) => ({
    tag: form?.tag,
    numeroDeSerie: form?.numeroDeSerie,
    dataProximaChecagem: form?.dataProximaChecagem && dayjs(form?.dataProximaChecagem)?.format('YYYY-MM-DD'),
    dataUltimaCalibracao: form?.dataUltimaCalibracao && dayjs(form?.dataUltimaCalibracao)?.format('YYYY-MM-DD'),
    local: form?.local,
    instrumento: {
      maximo: form?.maximo,
      minimo: form?.minimo,
      unidade: form?.unidade,
      precoCalibracaoNoLaboratorio: form?.precoCalibracaoLaboratorio,
      precoCalibracaoNoCliente: form?.precoCalibracaoCliente,
      capacidadeDeMedicao: {
        valor: form?.capacidadeMedicao,
        unidade: form?.unidadeMedicao,
      },
      tipoDeInstrumento: {
        descricao: form?.descricao,
        fabricante: form?.fabricante,
        modelo: form?.modelo,
        resolucao: form?.resolucao,
      },
      tipoDeServico: form?.tipoDeServico,
    },
    procedimentoRelacionado: form?.procedimentoRelacionado,
    precoAlternativoCalibracao: form?.precoAlternativoCalibracao,
    diasUteis: form?.diasUteis,
    pontosDeCalibracao: form?.pontosCalibracao?.length ? form?.pontosCalibracao?.map(ponto => ({ nome: ponto })) : [],
    posicao: form?.posicao,
    frequencia: form?.frequencia,
    laboratorio: form?.laboratorio,
    observacoes: form?.observacoes,
    cliente: form?.client,
  })

  const updateInstrument = async (form) => {
    const data = formatedData(form);
    const response = await axios.patch(`/instrumentos/${form?.instrumento}/`, data);
    return response;
  }

  const { 
    mutate: mutateUpdate, 
    isLoading: isLoadingUpdate, 
  } = useMutation({
    mutationFn: updateInstrument,
    onSuccess: () => {
      enqueueSnackbar('Instrumento atualizado com sucesso!', {
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
      handleClose()
    },
    onError: () => {
      setError(error?.response?.data)
      enqueueSnackbar('Falha ao atualizar instrumento, tente novamente!', {
        variant: 'error'
      });
    }
  })

  const createInstrument = async (form) => {
    const data = formatedData(form)

    const response = await axios.post(`/instrumentos/`, data);
    return response;
  }

  const { 
    mutate: mutateCreate, 
    isLoading: isLoadingCreate, 
  } = useMutation({
    mutationFn: createInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      handleCleanCreateForm()
      handleClose()
      enqueueSnackbar('Instrumento criado com sucesso!', {
        variant: 'success'
      });
    },
    onError: (error) => {
      setError(error?.response?.data)
      enqueueSnackbar('Falha ao criar instrumento, tente novamente!', {
        variant: 'error'
      });
    }
  })

  return {
    mutateDelete,
    isDeleting,
    mutateCriticalAnalisys,
    isLoadingCriticalAnalisys,
    mutateUpdate, 
    mutateCreate, 
    isLoadingUpdate, 
    isLoadingCreate,
    error,
    setError,
  }
}

export default useAssetMutations