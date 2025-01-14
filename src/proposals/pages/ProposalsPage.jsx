import { Helmet } from 'react-helmet-async';
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Alert,
  Snackbar,
  TablePagination,
  Checkbox,
} from '@mui/material';
import Label from '../../components/label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/scrollbar';
import { fDate } from '../../utils/formatTime';
import FormCreateProposal from '../components/FormCreateProposal';
import TableHeader from '../../components/TableHeader';
import TableToolbar from '../components/TableToolbar';
import EmptyYet from '../../components/EmptyYet';
import useProposalsVM from '../viewModels/useProposalsVM';
import Loading from '../../components/Loading';
import { headCells, headCellsAdmin } from '../../utils/proposals';


function ProposalsPage() {
  const {
    isSelected,
    handleClick,
    handleSelectAllClick,
    handleOpen,
    handleClose,
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
  } = useProposalsVM()

  return (
    <>
      <Helmet>
        <title> Propostas | Kometro </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {admin ? 'Propostas' : 'Minhas propostas'}
          </Typography>

          <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            Nova proposta
          </Button>
        </Stack>
        
        {isLoading
          ? <Loading />
          : !data?.results?.length 
            ? <EmptyYet content="proposta" isMobile={isMobile} /> 
            :(
            <Card>
              <TableToolbar
                form={formFilter} 
                numSelected={selectedOrders.length} 
                selectedOrders={selectedOrders} 
                setSelectedOrders={setSelectedOrders} 
                admin={admin} 
                deleteOrder={deleteOrder} 
                />
                <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHeader
                      numSelected={selectedOrders?.length}
                      onSelectAllClick={handleSelectAllClick}
                      rowCount={data?.results?.length}
                      checkbox={admin}
                      headCells={admin ? headCellsAdmin : headCells}
                    />
                    <TableBody>
                      {data?.results?.map((row, index) => {
                        const { id, dataCriacao, status, cliente, numero, total } = row;
                        const data = dataCriacao;
                        const isItemSelected = isSelected(row.id);
                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            onClick={() => { navigate(admin ? `/admin/proposta/${id}/${cliente?.id}` : `/dashboard/proposta/${id}`, { replace: true }) }}
                          >
                            {admin &&
                              <TableCell padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  onClick={(event) => handleClick(event, row.id)}
                                  checked={isItemSelected}
                                  inputProps={{
                                    'aria-labelledby': index,
                                  }}
                                />
                              </TableCell>
                            }
                            <TableCell align="left">{numero}</TableCell>

                            <TableCell align="left">{fDate(data)}</TableCell>
                            {admin ? (<TableCell align="left">{cliente?.empresa?.razao_social || cliente?.nome}</TableCell>) : (<TableCell align="left">{+total > 0 ? `R$ ${total}` : "Aguardando resposta"}</TableCell>)}

                            <TableCell align="left">
                              <Label color={statusColor[status]}>{statusString[status]}</Label>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={data?.count || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Linhas por páginas"
                  />
                </TableContainer>
              </Scrollbar>
            </Card>
          )
        }

        <FormCreateProposal open={open} setOpen={setOpen} setAlert={setAlert} onClose={handleClose} admin={admin} refetch={refetch} />

        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar
            open={propostaEnviada}
            anchorOrigin={{ vertical, horizontal }}
            key={vertical + horizontal}
            onClose={handleCloseAlert}
          >
            <Alert
              onClose={handleCloseAlert}
              severity="success"
              sx={{ width: '100%' }}
            >
              Sua proposta foi enviada com sucesso!
            </Alert>
          </Snackbar>
        </Stack>
      </Container>
    </>
  );
}

export default ProposalsPage