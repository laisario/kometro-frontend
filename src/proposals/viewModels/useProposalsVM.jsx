import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import useAuth from '../../auth/hooks/useAuth';
import useResponsive from '../../theme/hooks/useResponsive';
import ProposalsContext from '../context';

function useProposalsVM() {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ propostaEnviada: false, vertical: 'top', horizontal: 'right' });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const isMobile = useResponsive('down', 'md');
  const { user: { admin } } = useAuth();

  const { 
    data,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    formFilter,
    statusColor,
    statusString,
    refetch,
    deleteOrder,
    isLoading
  } = useContext(ProposalsContext);

  const navigate = useNavigate()

  const { vertical, horizontal, propostaEnviada } = alert;

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert((prevAlert) => ({ ...prevAlert, propostaEnviada: false }));
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data?.results?.map((n) => n.id);
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

  return {
    isSelected,
    handleClick,
    handleClose,
    handleSelectAllClick,
    handleOpen,
    handleCloseAlert,
    navigate,
    vertical,
    horizontal,
    propostaEnviada,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    formFilter,
    statusColor,
    statusString,
    refetch,
    deleteOrder,
    isLoading,
    admin,
    isMobile,
    open,
    setOpen,
    setAlert,
    data,
    selectedOrders,
    setSelectedOrders
  }
}

export default useProposalsVM