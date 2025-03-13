import React from 'react';
import GetAppIcon from '@mui/icons-material/GetApp';
import { Container } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { 
  Button, 
  Grid, 
  Typography, 
} from '@mui/material';
import FormCreate from '../components/FormCreate';
import Iconify from '../../components/Iconify';
import CsvViewer from '../../components/CsvViewer';
import Loading from '../../components/Loading';
import { useDocumentsVM } from '../viewModels/useDocumentsVM';
import TableDocuments from '../components/TableDocuments';


export default function DocumentsPage() {
  const { 
    isMobile,
    isLoading,
    exportDocuments,
    selectedDocuments,
    handleOpenForm,
    mutateCreate,
    open,
    setOpen,
    isCreating,
    isSuccessCreate,
    data,
    csvContent,
    isDeleting,
    formFilter,
    filter,
    setFilter,
    handleSelectAllClick,
    isSelected,
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
    deleteDocumentos,
    handleClick,
    navigate,
    cleanSelectedDocuments,
    error,
    setError,
    form,
    handleClose,
    user,
  } = useDocumentsVM();

  return (
    <>
      <Helmet>
        <title> Documentos | Kometro </title>
      </Helmet>
      <Container>
        <Grid container display="flex" flexDirection={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" mb={5}>
          <Grid item sm={6} xs={12}>
            <Typography variant="h4" gutterBottom>
              Documentos
            </Typography>
          </Grid>
          <Grid item container spacing={2} sm={6} xs={12} justifyContent={isMobile ? "flex-start" : "flex-end"}>
            <Grid item>
              <Button variant="contained" startIcon={<GetAppIcon />} onClick={exportDocuments} disabled={selectedDocuments?.length < 1} >
                Exportar
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenForm}>
                Novo documento
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <FormCreate
          mutateCreate={mutateCreate}
          error={error}
          setError={setError}
          open={open}
          setOpen={setOpen}
          isCreating={isCreating}
          isSuccessCreate={isSuccessCreate}
          form={form}
          handleClose={handleClose}
        />

        {isLoading 
          ? <Loading /> 
          : (
            <TableDocuments
              selectedDocuments={selectedDocuments}
              isDeleting={isDeleting}
              formFilter={formFilter}
              isLoading={isLoading}
              filter={filter}
              setFilter={setFilter}
              handleSelectAllClick={handleSelectAllClick}
              data={data}
              deleteDocumentos={deleteDocumentos}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              isSelected={isSelected}
              navigate={navigate}
              handleClick={handleClick}
              cleanSelectedDocuments={cleanSelectedDocuments}
              isMobile={isMobile}
              user={user}
            />
          ) 
        }
      </Container>
      <CsvViewer csvContent={csvContent} fileName="documentos" />
    </>
  );
}