import { useContext, useEffect, useState } from "react";
import AssetsContext from "../context";
import useResponsive from '../../theme/hooks/useResponsive';
import useAsset from "../hooks/useAsset";
import useSectorMutations from "../hooks/useSectorMutations";
import useDefaultAssets from "../hooks/useDefaultAssets";
import useAssetMutations from "../hooks/useAssetMutations";
import useAuth from "../../auth/hooks/useAuth";
import useAssets from "../hooks/useAssets";

const useAssetsVm = () => {
  const [open, setOpen] = useState(false);
  const [valueCheckbox, setValueCheckbox] = useState({
    tag: true,
    numeroDeSerie: true,
    observacoes: true,
    laboratorio: true,
    setor: true,
    posicaoDoInstrumento: true,
    dataUltimaCalibracao: true,
    dataDaProximaCalibracao: true,
    frequenciaDeCalibracao: true,
    dataUltimaChecagem: true,
    dataDaProximaChecagem: true,
    frequenciaDeChecagem: true,
  });
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openCreateSectorId, setOpenCreateSectorId] = useState(null);
  const [openEditSector, setOpenEditSector] = useState(false);
  const {user} = useAuth()
  const { sectors, isLoadingSectors } = useContext(AssetsContext);
  const [expandedItems, setExpandedItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  const { asset, isLoadingAsset, } = useAsset(selectedItem?.type === 'instrument' ? selectedItem?.id?.split("-")[1]  : null);
  const { assets, search, setSearch, assetFilterForm } = useAssets();
  
  const handleCloseCreateSector = () => setOpenCreateSectorId(null);
  
  const {
    mutateDeleteSectors,
    isDeletingSectors,
    mutateUpdateSectors, 
    mutateCreateSectors, 
    isLoadingUpdateSectors, 
    isLoadingCreateSectors,
    errorSectors,
  } = useSectorMutations(setOpenCreateSectorId, setExpandedItems, setSelectedItem, handleCloseCreateSector)
  
  const { defaultAssets, search: searchDA, setSearch: setSearchDA, isFetching } = useDefaultAssets();

  const { 
    mutateCreateClient,
    mutateUpdateClient,
    isLoadingUpdateClient,
    mutateDeleteClient,
    error,
    setError,
    mutateChangePosition
  } = useAssetMutations();

  const handleCreate = (selectedItem) => {
    const params = {
      nome: "Novo setor",
      cliente: user?.cliente,
    }
    if (selectedItem) {
      params['setorPaiId'] =  selectedItem?.type === 'sector' ? selectedItem?.id : selectedItem?.parentId
    }
    mutateCreateSectors(params)
  };

  const handleEdit = (selectedItem) => {
    setOpenCreateSectorId(selectedItem?.id)
  }

  const handleOpenEditSector = () => setOpenEditSector((prev) => !prev);

  const handleCloseEditSector = () => setOpenEditSector(false);


  const isMobile = useResponsive('down', 'md');

  const handleChangeCheckbox = (event) => {
    const { name, checked } = event.target;
    setValueCheckbox({ ...valueCheckbox, [name]: checked });
  };

  useEffect(() => {
    if (selectAll) {
      setSelected(assets?.results?.map(({ id }) => id))
    } else {
      setSelected([])
    }
  }, [selectAll])

  const handleCheckboxSelectAll = () => {
    setSelectAll((oldSelectAll) => !oldSelectAll)
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValueCheckbox({
      tag: true,
      numeroDeSerie: true,
      observacoes: true,
      laboratorio: true,
      posicaoDoInstrumento: true,
      dataUltimaCalibracao: true,
      frequenciaDeCalibracao: true,
      dataDaProximaCalibracao: true,
      dataDaProximaChecagem: true,
    });
    setError(false);
    setSelectAll(false)
  };

  return {
    handleClose,
    handleClickOpen,
    handleCheckboxSelectAll,
    handleChangeCheckbox,
    isMobile,
    isLoadingSectors,
    open,
    error,
    setError,
    sectors, 
    search, 
    setSearch,
    selectAll,
    valueCheckbox,
    setError,
    selected,
    setSelected,
    asset, 
    isLoadingAsset,
    mutateDeleteSectors,
    isDeletingSectors,
    mutateUpdateSectors, 
    mutateCreateSectors, 
    isLoadingUpdateSectors, 
    isLoadingCreateSectors,
    errorSectors,
    openCreateSectorId,
    openEditSector,
    handleCreate,
    handleOpenEditSector,
    handleCloseCreateSector,
    handleCloseEditSector,
    defaultAssets,
    mutateCreateClient,
    expandedItems,
    setExpandedItems,
    selectedItem,
    setSelectedItem,
    handleEdit,
    mutateUpdateClient,
    isLoadingUpdateClient,
    mutateDeleteClient,
    assets,
    setSearchDA,
    searchDA,
    isFetching,
    assetFilterForm,
    mutateChangePosition
  }
}

export default useAssetsVm