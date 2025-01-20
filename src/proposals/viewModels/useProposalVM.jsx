import React, { useState } from 'react'
import useResponsive from '../../theme/hooks/useResponsive';
import useProposal from '../hooks/useProposal';
import { useParams } from 'react-router';
import useAuth from '../../auth/hooks/useAuth';

const useProposalVM = () => {
  const [edit, setEdit] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [response, setResponse] = useState({ status: 0, message: '' });
  const [elaborateOpen, setElaborateOpen] = useState(false);
  const { id, idClient } = useParams();
  const { user } = useAuth();
  
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
    elaborate
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
  }
}

export default useProposalVM