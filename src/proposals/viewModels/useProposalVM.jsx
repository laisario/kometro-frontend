import React, { useContext, useState } from 'react'
import useResponsive from '../../theme/hooks/useResponsive';
import useProposal from '../hooks/useProposal';
import { useNavigate, useParams } from 'react-router';
import useAuth from '../../auth/hooks/useAuth';
import ProposalsContext from '../context';

const useProposalVM = () => {
  const [edit, setEdit] = useState(false);
  const [elaborateOpen, setElaborateOpen] = useState(false);
  const { id, idClient } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate()

  const { deleteOrder } = useContext(ProposalsContext)
  
  const deleteOrderAndNavigate = () => {
    deleteOrder([id])
    navigate('/admin/propostas', { replace: true });
  }

  const {
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
    elaborate,
  } = useProposal(id, idClient);

  const isMobile = useResponsive('down', 'md');



  return {
    isMobile,
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
    elaborateOpen,
    setElaborateOpen,
    user,
    edit,
    setEdit,
    elaborate,
    deleteOrderAndNavigate,
  }
}

export default useProposalVM