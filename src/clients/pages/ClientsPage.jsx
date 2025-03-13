import React, { useMemo } from 'react'
import { 
  Card, 
  Checkbox, 
  Container, 
  Grid, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TablePagination, 
  TableRow, 
  Typography 
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import TableToolbar from '../components/TableToolbar';
import TableHeader from '../../components/TableHeader';
import Scrollbar from '../../components/scrollbar/Scrollbar';
import Loading from '../../components/Loading';
import EmptyYet from '../../components/EmptyYet';
import useClientsVM from '../viewModels/useClientsVM';
import { headCells } from '../../utils/clients';


function ClientsPage() {
  const {
    clients,
    isLoadingClients,
    formFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    deleteClients,
    rowsPerPage,
    page,
    isMobile,
    selectedClients,
    handleSelectAllClick,
    isSelected,
    setSelectedClients,
    navigate,
    handleClick,
    isDeleting,
    user
  } = useClientsVM();

  const isThereClients = useMemo(() => !!clients?.results?.length, [clients?.results]);
  return (
    <>
      <Helmet>
        <title> Clientes | Kometro  </title>
      </Helmet>
      <Container>
        <Grid container display="flex" flexDirection={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" mb={5}>
          <Grid item sm={6} xs={12}>
            <Typography variant="h4" gutterBottom>
              Clientes
            </Typography>
          </Grid>
        </Grid>

        {isLoadingClients
          ? <Loading />
          : isThereClients
          ? (
            <Scrollbar>
              <TableToolbar
                numSelected={selectedClients?.length}
                deleteClients={() => { deleteClients(selectedClients); setSelectedClients([]) }}
                form={formFilter}
                isLoadingClients={isLoadingClients}
                isDeleting={isDeleting}
              />
              <TableContainer component={Paper} sx={{ minWidth: 800 }}>
                <Table
                  aria-labelledby="tabelaClientes"
                >
                  <TableHeader
                    numSelected={selectedClients.length}
                    onSelectAllClick={handleSelectAllClick}
                    rowCount={clients?.results?.length}
                    headCells={headCells}
                    admin={user?.admin}
                    checkbox
                  />
                  <TableBody>
                    {clients?.results?.map((row, index) => {
                      const isItemSelected = isSelected(row?.id);
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          onClick={() => { navigate(`/admin/cliente/${row?.id}`) }}
                          sx={{ cursor: 'pointer' }}
                          >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              onClick={(event) => handleClick(event, row?.id)}
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': index,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {row?.empresa?.razaoSocial || row?.nome || row?.usuario?.username}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  component="div"
                  count={clients?.count || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Linhas por páginas"
                />
              </TableContainer>
            </Scrollbar>
          )
          : <EmptyYet content="cliente" isMobile={isMobile} />
        }
      </Container>
    </>
  );
}

export default ClientsPage;