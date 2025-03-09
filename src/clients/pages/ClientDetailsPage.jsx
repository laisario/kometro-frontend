import { Box, Button, CircularProgress, Container, InputAdornment, Paper, Snackbar, Stack, TablePagination, TextField, Typography } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router';
import SearchIcon from '@mui/icons-material/Search';
import ClientInformation from '../components/ClientInformation';
import ClientInstrumentInformation from '../components/ClientInstrumentInformation';
import useClientVM from '../viewModels/useClientVM';
import EditAsset from '../../components/EditAsset';
import EmptyYet from '../../components/EmptyYet'

function ClientDetailsPage() {
  const { id } = useParams();
  const { 
    client,
    isMobile,
    search,
    setSearch,
    handleOpenFormCreate,
    handleCloseFormCreate,
    openFormCreate,
    isLoadingClient,
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
    isDeleting,
    mutateDelete,
    isLoadingAssets,
    assets
  } = useClientVM(id);


  return (
    <>
      <Helmet>
        <title>Cliente | Kometro </title>
      </Helmet>
      <Container>
        <Stack direction="column" alignItems="flex-start" justifyContent="center" mb={5}>
          <Typography variant="h4" gutterBottom>
            Informações cliente
          </Typography>
          <Typography variant="h6" gutterBottom>
            {client?.empresa?.razaoSocial || client?.nome || client?.usuario?.username}
          </Typography>
        </Stack>
        {isLoadingClient 
          ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) 
          : <ClientInformation data={client} isMobile={isMobile} />}
        <br />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h4" gutterBottom>
            Instrumentos
          </Typography>
          <Stack direction='row' gap={2}>
            <TextField
              id="search-instrument"
              size='small'
              label="Busque um instrumento"
              variant="outlined"
              sx={{ width: '60%' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              variant='contained' 
              onClick={handleOpenFormCreate} 
              size={isMobile ? 'small' : 'medium'} 
            >
              Novo instrumento
            </Button>
            <EditAsset
              create
              clientId={id}
              handleClose={handleCloseFormCreate}
              open={openFormCreate}
              isMobile={isMobile}
            />
          </Stack>
        </Stack>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {isLoadingAssets
            ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            )
            : assets?.results?.length ? assets?.results?.map((instrument, index) => (
              <ClientInstrumentInformation
                key={index + instrument?.id}
                instrument={instrument}
                isMobile={isMobile}
                isDeleting={isDeleting}
                mutateDelete={mutateDelete}
              />
            ))
              : <EmptyYet content="instrumento" isMobile={isMobile} />
          }
        </Box>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={assets?.count || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Instrumentos por página"
        />
      </Container>
    </>
  )
}

export default ClientDetailsPage