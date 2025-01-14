import React from 'react'
import { Helmet } from 'react-helmet-async';
import useAssetsVM from '../viewModels/useAssetsVM';
import { Box, Button, Checkbox, Container, FormControlLabel, FormGroup, Stack, TablePagination, Typography } from '@mui/material';
import { Search, SearchIconWrapper, StyledInputBase } from '../styledComponents';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import ExportFilter from '../components/ExportFilter';
import Loading from '../../components/Loading';
import EmptyYet from '../../components/EmptyYet';
import AssetsList from '../components/AssetsList';

function AssetsPage() {
  const {
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
    selectAll,
    valueCheckbox,
    setError,
    allAssets,
    setSelected,
    selected,
  } = useAssetsVM();

  return (
    <>
      <Helmet>
        <title> Instrumentos | Kometro </title>
      </Helmet>

      <Container>
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Meus Instrumentos
          </Typography>
          <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "center", alignItems: 'center' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Procure um instrumento"
                inputProps={{ 'aria-label': 'Procure um instrumento' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Search>
            <FormGroup sx={{ mx: 1 }}>
              <FormControlLabel control={<Checkbox checked={selectAll} />} onChange={handleCheckboxSelectAll} label="Selecionar todos" />
            </FormGroup>
            <Button variant="contained" fullWidth={isMobile} disabled={selected?.length === 0} sx={{ ml: 1 }} onClick={handleClickOpen} endIcon={<GetAppIcon />}>Exportar</Button>
          </Box>
        </Stack>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ExportFilter
            handleClose={handleClose}
            open={open}
            selected={selected}
            handleChangeCheckbox={handleChangeCheckbox}
            valueCheckbox={valueCheckbox}
            error={error}
            setError={setError}
            selectAll={selectAll}
          />
          {isLoadingAssets
            ? <Loading />
            : (allAssets?.results?.length
              ? <AssetsList assets={allAssets} setSelected={setSelected} selected={selected} />
              : <EmptyYet isMobile={isMobile} content="instrumento" />)}
          <TablePagination
            rowsPerPageOptions={[8, 16, 32, 64, 128]}
            component="div"
            count={allAssets?.count || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Instrumentos por página"
          />
        </Box>
      </Container>
    </>
  )
}

export default AssetsPage