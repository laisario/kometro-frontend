import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import useAuth from '../../auth/hooks/useAuth';
import useResponsive from '../../theme/hooks/useResponsive';
import ProposalsContext from '../context';
import AssetsContext from '../../assets/context';
import  ClientsContext from '../../clients/context';
import { useWatch } from 'react-hook-form';
import { axios } from '../../api';

function useProposalsVM() {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [csvContent, setCsvContent] = useState(null);
  const isMobile = useResponsive('down', 'md');
  const { user } = useAuth();
  const admin = user?.admin

  const { 
    allProposals,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    formFilter,
    deleteOrder,
    isLoadingProposals,
    formCreateProposal,
    mutateCreateProposal,
    error,
    setError,
    open, 
    setOpen,
    handleOpen,
    handleClose
  } = useContext(ProposalsContext);

  
  const {
    allAssets,
    isLoadingAssets,
  } = useContext(AssetsContext);
  
  const {
    clients,
    isLoadingClients,
  } = useContext(ClientsContext);

  const navigate = useNavigate()

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = allProposals?.results?.map((n) => n.id);
      setSelectedOrders(newSelected);
      return;
    }
    setSelectedOrders([]);
  };

  const handleClick = (event, id) => {
    event?.stopPropagation()
    setSelectedOrders(selectedOrders?.includes(id) ? selectedOrders?.filter(documentId => documentId !== id) : [...selectedOrders, id]);
  };

  const isSelected = (id) => selectedOrders.indexOf(id) !== -1;

  const exportOrders = async () => {
    try {
      const resposta = await axios.post('/propostas/exportar/', { propostas_selecionadas: selectedOrders });;
      if (resposta.status === 200) {
        setCsvContent(resposta?.data)
      } else {
        console.log('Xi status não foi 200')
      }
    } catch (error) {
      console.error('Erro ao enviar dados para o backend:', error);
    }
  };

  return {
    isSelected,
    handleClick,
    handleClose,
    handleSelectAllClick,
    handleOpen,
    navigate,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    formFilter,
    deleteOrder,
    isLoadingProposals,
    admin,
    isMobile,
    open,
    setOpen,
    allProposals,
    selectedOrders,
    setSelectedOrders,
    allAssets,
    isLoadingAssets,
    formCreateProposal,
    clients,
    isLoadingClients,
    mutateCreateProposal,
    error,
    setError,
    exportOrders,
    csvContent
  }
}

export default useProposalsVM