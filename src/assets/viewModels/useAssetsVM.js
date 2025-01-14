import { useContext, useEffect, useState } from "react";
import AssetsContext from "../context";
import useResponsive from '../../theme/hooks/useResponsive';

const useAssetsVm = () => {
  const [open, setOpen] = useState(false);
  const [valueCheckbox, setValueCheckbox] = useState({
    tag: true,
    numeroDeSerie: true,
    observacoes: true,
    laboratorio: true,
    posicaoDoInstrumento: true,
    dataUltimaCalibracao: true,
    frequenciaDeCalibracao: true,
    dataDaProximaCalibracao: true,
    dataDaProximaChecagem: true,
    local: true,
  });
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const { 
    allAssets, 
    search, 
    setSearch,
    isLoadingAssets, 
    page, 
    handleChangePage, 
    handleChangeRowsPerPage, 
    rowsPerPage 
  } = useContext(AssetsContext);

  const isMobile = useResponsive('down', 'md');

  const handleChangeCheckbox = (event) => {
    const { name, checked } = event.target;
    setValueCheckbox({ ...valueCheckbox, [name]: checked });
  };

  useEffect(() => {
    if (selectAll) {
      setSelected(allAssets?.results?.map(({ id }) => id))
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
    search, 
    setSearch,
    isLoadingAssets, 
    page, 
    handleChangePage, 
    handleChangeRowsPerPage, 
    rowsPerPage,
    open,
    error,
    allAssets, 
    search, 
    setSearch,
    isLoadingAssets, 
    page, 
    handleChangePage, 
    handleChangeRowsPerPage, 
    rowsPerPage,
    selectAll,
    valueCheckbox,
    setError,
    selected,
    setSelected
  }
}

export default useAssetsVm