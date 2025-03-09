import React, { useContext, useState } from 'react'
import ClientsContext from '../context'
import { useNavigate } from 'react-router';
import useAuth from '../../auth/hooks/useAuth';
import useResponsive from '../../theme/hooks/useResponsive';

function useClientsVM() {
  const [selectedClients, setSelectedClients] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useResponsive('down', 'md');

  const {
    clients, 
    errorClients, 
    isLoadingClients, 
    formFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    deleteClients,
    isDeleting,
    rowsPerPage,
    page
  } = useContext(ClientsContext);

  const isSelected = (id) => selectedClients.indexOf(id) !== -1;

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = clients?.results?.map((n) => n.id);
      setSelectedClients(newSelected);
      return;
    }
    setSelectedClients([]);
  };

  const handleClick = (event, id) => {
    event?.stopPropagation()
    setSelectedClients(selectedClients?.includes(id) ? selectedClients?.filter(clientId => clientId !== id) : [...selectedClients, id]);
  };
  
  return {
    clients, 
    errorClients, 
    isLoadingClients, 
    formFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    deleteClients,
    isDeleting,
    rowsPerPage,
    page,
    isMobile,
    user,
    isSelected,
    handleSelectAllClick,
    handleClick,
    selectedClients,
    setSelectedClients,
    navigate,
  }
}

export default useClientsVM