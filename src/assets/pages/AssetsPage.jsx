import React from 'react'
import { Helmet } from 'react-helmet-async';
import useAssetsVM from '../viewModels/useAssetsVM';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import ExportFilter from '../components/ExportFilter';
import Loading from '../../components/Loading';
import EmptyYet from '../../components/EmptyYet';
import SetorTree from '../components/SetorTree';
import InstrumentDetails from '../components/InstrumentDetails';
import RecordList from '../components/RecordList';
import SearchWithDropdown from '../components/SearchWithDropdown';

function AssetsPage() {
  const {
    handleClose,
    handleClickOpen,
    handleCheckboxSelectAll,
    handleChangeCheckbox,
    isMobile,
    sectors,
    isLoadingSectors, 
    open,
    error,
    selectAll,
    valueCheckbox,
    setError,
    setSelected,
    selected,
    asset, 
    mutateDeleteSectors,
    mutateUpdateSectors, 
    mutateCreateSectors, 
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
    mutateChangePosition,
    duplicateInstrument,
    openFormCreateInstrument, 
    setOpenFormCreateInstrument,
    handleCloseCreateInstrument,
    isFetchingAssets,
  } = useAssetsVM();
  return (
    <>
      <Helmet>
        <title> Instrumentos | Kometro </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Meus Instrumentos
          </Typography>
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: "row", 
              alignItems: 'center', 
              gap: 2,
            }}
          >
            <SearchWithDropdown 
              data={assets} 
              onSelect={(item) =>  { setSelectedItem({id: `instrument-${item?.id}`, type: 'instrument', parentId: item?.setor?.id}); setExpandedItems(prevState => [...prevState, item?.setor?.id])}} 
            />
            <Button
              variant="contained" 
              onClick={handleClickOpen}
              endIcon={<GetAppIcon />}
            >
              Exportar
            </Button>
          </Box>
        </Stack>
        <Box>
          <ExportFilter
            handleClose={handleClose}
            open={open}
            selected={selected}
            setSelected={setSelected}
            handleChangeCheckbox={handleChangeCheckbox}
            handleCheckboxSelectAll={handleCheckboxSelectAll}
            valueCheckbox={valueCheckbox}
            error={error}
            setError={setError}
            selectAll={selectAll}
            assets={assets}
            assetFilterForm={assetFilterForm}
            isFetchingAssets={isFetchingAssets}
          />
          {isLoadingSectors
            ? <Loading />
            : (!!sectors?.length
              ? (
                <Grid container sx={{ height: '100vh' }} spacing={4}>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      borderRight: { md: '1px solid #ddd' },
                      height: { xs: 'auto', md: 'calc(100vh - 64px)' },
                      overflowY: 'auto',
                      pr: 1
                    }}
                  >
                    <SetorTree
                      setores={sectors}
                      onEditSetor={mutateUpdateSectors}
                      onDeleteSetor={mutateDeleteSectors}
                      openCreateSectorId={openCreateSectorId}
                      handleCreate={handleCreate}
                      handleEdit={handleEdit}
                      defaultAssets={defaultAssets}
                      mutate={mutateCreateClient}
                      expandedItems={expandedItems}
                      setExpandedItems={setExpandedItems}
                      selectedItem={selectedItem}
                      setSelectedItem={setSelectedItem}
                      handleCloseCreateSector={handleCloseCreateSector}
                      setSearchDA={setSearchDA}
                      searchDA={searchDA}
                      isFetching={isFetching}
                      duplicateInstrument={duplicateInstrument}
                      error={error}
                      openFormCreateInstrument={openFormCreateInstrument}
                      setOpenFormCreateInstrument={setOpenFormCreateInstrument}
                      handleCloseCreateInstrument={handleCloseCreateInstrument}
                      setError={setError}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={8}
                    sx={{
                      overflowY: 'hidden',
                      height: 'calc(100vh - 80px)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Box 
                      sx={{
                        flex: '1 1 50%',
                        overflowY: 'auto',
                      }}
                    >
                      <InstrumentDetails
                        instrumento={asset}
                        mutateUpdateClient={mutateUpdateClient}
                        mutateCreateClient={mutateCreateClient}
                        isLoadingUpdateClient={isLoadingUpdateClient}
                        defaultAssets={defaultAssets}
                        selectedItem={selectedItem}
                        mutateDeleteClient={mutateDeleteClient}
                        setSelectedItem={setSelectedItem}
                        error={error}
                        setError={setError}
                        isFetching={isFetching}
                        setSearchDA={setSearchDA}
                        searchDA={searchDA}
                        setores={sectors}
                        mutateChangePosition={mutateChangePosition}
                        openFormCreateInstrument={openFormCreateInstrument}
                        setOpenFormCreateInstrument={setOpenFormCreateInstrument}
                        handleCloseCreateInstrument={handleCloseCreateInstrument}
                      />
                    </Box>

                    {selectedItem?.type === 'instrument' && (
                      <Box 
                        sx={{
                          flex: '1 1 50%',
                          overflowY: 'auto',
                        }}
                      >
                        <RecordList asset={asset} />
                      </Box>
                    )}
                  </Grid>
                </Grid>
              )
              : <EmptyYet isMobile={isMobile} content="setor"   onCreate={handleCreate} />
            )
          }
        </Box>
      </Container>
    </>
  )
}

export default AssetsPage