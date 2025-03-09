import React, { useState } from 'react';
import useClient from '../hooks/useClient';
import useResponsive from '../../theme/hooks/useResponsive';
import useClientAssets from '../../assets/hooks/useClientAsset';
import useAssetMutations from '../../assets/hooks/useAssetMutations';

function useClientVM(id) {
  const [openFormCreate, setOpenFormCreate] = useState(false);

  const {
    client, 
    errorClient, 
    isLoadingClient, 
  } = useClient(id);

  const {
    assets, 
    isLoadingAssets, 
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    search,
    setSearch,
  } = useClientAssets(id, true);

  const { 
    isDeleting,
    mutateDelete,
  } = useAssetMutations();
  
  const isMobile = useResponsive('down', 'md');
  const handleCloseFormCreate = () => setOpenFormCreate(false);
  const handleOpenFormCreate = () => setOpenFormCreate(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    client, 
    errorClient, 
    isLoadingClient,
    isMobile,
    handleOpenFormCreate,
    handleCloseFormCreate,
    handleChangePage,
    handleChangeRowsPerPage,
    search,
    setSearch,
    isDeleting,
    mutateDelete,
    openFormCreate,
    assets,
    isLoadingAssets,
    rowsPerPage,
    page,
  }
}

export default useClientVM