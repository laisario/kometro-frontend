import React from 'react'

const useProposal = (id) => {
  const { 
    data: proposal, 
    error: errorAsset, 
    isLoading: isLoadingAsset, 
    refetch: refetchAsset 
  } = useQuery({
    queryKey: ['propostas', id, page, rowsPerPage], 
    queryFn: async () => {
      let params = { page_size: rowsPerPage}
      if (cliente !== null) {
        params = { ...params, cliente, }
      }
      const response = await axios.get(`/propostas/${id}`, { params });
      return response?.data;
    },
    enabled: !!id
  });

  const removeInstrument = async (instrumentId) => {
    try {
      await axios.post(`/propostas/${id}/remover_instrumento/`, { instrumento_id: instrumentId });
    } catch (err) {
      console.log(err);
    }
  }

  const { mutate: removeInstrumentProposal, isLoading: isRemoving } = useMutation({
    mutationFn: removeInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
    },
  })

  const sendProposolByEmail = async () => {
    try {
      const response = await axios.get(`/propostas/${id}/enviar_email/`);
      return { status: response?.status, message: response?.data?.message, };
    } catch (err) {
      console.log(err);
      return { status: err.status, message: "Falha no envio da proposta." };
    }
  }


  const aprove = async () => {
    try {
      const response = await axios.post(`/propostas/${id}/aprovar/`);
      refetch()
      return { status: response?.status, message: response?.data?.message };
    } catch (err) {
      console.log(err);
      return { status: err.status, message: "Falha na aprovação da proposta." };
    }
  };

  const refuse = async () => {
    try {
      const response = await axios.post(`/propostas/${id}/reprovar/`);
      refetch()
      return { status: response?.status, message: response?.data?.message };
    } catch (err) {
      console.log(err);
      return { status: err.status, message: "Falha ao recusar a proposta." };
    }
  };


  return {
    refuse,
    aprove,
    sendProposolByEmail,
    removeInstrumentProposal,
    isRemoving,
    proposal, 
    errorAsset, 
    isLoadingAsset, 
    refetchAsset 
  }
}

export default useProposal