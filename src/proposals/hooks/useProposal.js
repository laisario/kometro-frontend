import { useMutation, useQuery } from 'react-query';
import { enqueueSnackbar } from 'notistack';
import { useContext } from 'react';
import ProposalsContext from '../context';
import { axios } from '../../api';


const useProposal = (id, cliente) => {
  const {rowsPerPage} = useContext(ProposalsContext);

  const { 
    data: proposal, 
    error: errorProposal, 
    isLoading: isLoadingProposal, 
    refetch: refetchProposal,
  } = useQuery({
    queryKey: ['propostas', id, rowsPerPage], 
    queryFn: async () => {
      let params = { page_size: 9999}
      if (cliente !== null) {
        params = { ...params, cliente, }
      }
      const response = await axios.get(`/propostas/${id}`, { params });

      return response?.data;
    },
    enabled: !!id
  });

  const removeInstrument = async (instrumentId) => {
    await axios.post(`/propostas/${id}/remover_instrumento/`, { instrumento_id: instrumentId });
  }

  const { mutate: removeInstrumentProposal, isLoading: isRemoving } = useMutation({
    mutationFn: removeInstrument,
    onSuccess: () => {
      enqueueSnackbar('Instrumento removido com sucesso!', {
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
    },
    onError: () => {
      enqueueSnackbar('Falha ao remover instrumento, tente novamente!', {
        variant: 'error'
      });
    }
  })

  const { mutate: sendProposalToEmail, isLoading: isLoadingSendProposal } = useMutation({
    mutationFn: async() => await axios.get(`/propostas/${id}/enviar_email/`),
    onSuccess: () => {
      enqueueSnackbar('Proposta enviada com sucesso!', {
        variant: 'success'
      });
    },
    onError: () => {
      enqueueSnackbar('Falha ao enviar proposta, tente novamente!', {
        variant: 'error'
      });
    }
  })

  const { mutate: aproveProposal, isLoading: isLoadingAproveProposal } = useMutation({
    mutationFn: async() => await axios.post(`/propostas/${id}/aprovar/`),
    onSuccess: () => {
      enqueueSnackbar('Proposta aprovada com sucesso!', {
        variant: 'success'
      });
    },
    onError: () => {
      enqueueSnackbar('Falha ao aprovar proposta, tente novamente!', {
        variant: 'error'
      });
    }
  })

  const { mutate: refuseProposal, isLoading: isLoadingRefuseProposal } = useMutation({
    mutationFn: async() => await axios.post(`/propostas/${id}/reprovar/`),
    onSuccess: () => {
      enqueueSnackbar('Proposta recusada com sucesso!', {
        variant: 'success'
      });
    },
    onError: () => {
      enqueueSnackbar('Falha ao recusar proposta, tente novamente!', {
        variant: 'error'
      });
    }
  })

  const elaborate = async (form, editProposol) => {
    const formValues = form.watch()
    const formatDayjs = (date) => dayjs.isDayjs(date) ? date.format('YYYY-MM-DD') : null;
    const commonData = {
      total: formValues.total || 0,
      condicaoDePagamento: formValues.formaDePagamento || null,
      transporte: formValues.transporte || null,
      numero: formValues.numeroProposta || 0,
      validade: formatDayjs(formValues.validade),
      status: formValues.status || null,
      prazoDePagamento: formatDayjs(formValues.prazoDePagamento),
      edit: editProposol,
      responsavel: formValues.responsavel || null,
      diasUteis: formValues.diasUteis || null,
    };

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
   
  };

  return {
    removeInstrumentProposal,
    isRemoving,
    proposal, 
    errorProposal, 
    isLoadingProposal, 
    refetchProposal,
    sendProposalToEmail, 
    isLoadingSendProposal,
    aproveProposal, 
    isLoadingAproveProposal,
    refuseProposal, 
    isLoadingRefuseProposal,
    elaborate
  }
}

export default useProposal