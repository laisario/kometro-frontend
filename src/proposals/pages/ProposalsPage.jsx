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
  TablePagination,
  Checkbox,
  Paper,
} from '@mui/material';
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
import { fDate } from '../../utils/formatTime';
import FormCreateProposal from '../components/FormCreateProposal';
import TableHeader from '../../components/TableHeader';
import TableToolbar from '../components/TableToolbar';
import EmptyYet from '../../components/EmptyYet';
import useProposalsVM from '../viewModels/useProposalsVM';
import Loading from '../../components/Loading';
import { headCells, headCellsAdmin, statusColor, statusString } from '../../utils/proposals';


function ProposalsPage() {
  const {
    isSelected,
    handleClick,
    handleSelectAllClick,
    handleOpen,
    handleClose,
    navigate,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    formFilter,
    deleteOrder,
    isLoadingProposals,
    admin,
    isMobile,
    open,
    allProposals,
    selectedOrders,
    setSelectedOrders,
    mutateCreateProposal,
    isLoadingCreateProposal,
    formCreateProposal,
    allAssets,
    isLoadingAssets,
    clients,
    isLoadingClients,
    error,
    setError,
  } = useProposalsVM()

  const isFiltering = formFilter?.formState?.isDirty
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

          <Button variant="contained" onClick={handleOpen} >
            Nova proposta
          </Button>
        </Stack>
        
        {isLoadingProposals
          ? <Loading />
          : 
            <Scrollbar>
              <TableContainer component={Paper} sx={{ minWidth: 800 }}>
                <TableToolbar
                  form={formFilter} 
                  numSelected={selectedOrders.length} 
                  selectedOrders={selectedOrders} 
                  setSelectedOrders={setSelectedOrders} 
                  admin={admin} 
                  deleteOrder={deleteOrder}
                  isMobile={isMobile}
                  />
                {!allProposals?.results?.length ? <EmptyYet table content="proposta" isFiltering={isFiltering} isMobile={isMobile} />  : <>
                  <Table>
                    <TableHeader
                      numSelected={selectedOrders?.length}
                      onSelectAllClick={handleSelectAllClick}
                      rowCount={allProposals?.results?.length}
                      checkbox={admin}
                      headCells={admin ? headCellsAdmin : headCells}
                    />
                    <TableBody>
                      {allProposals?.results?.map((row, index) => {
                        const { id, dataCriacao, status, cliente, numero, total } = row;
                        const isItemSelected = isSelected(row.id);
                        return (
                          <TableRow
                          hover
                            key={id}
                            tabIndex={-1}
                            onClick={() => { 
                              navigate(
                                admin 
                                ? `/admin/proposta/${id}/${cliente?.id}` 
                                : `/dashboard/proposta/${id}`
                              )}}
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

                            <TableCell align="left">{fDate(dataCriacao)}</TableCell>
                            {admin 
                              ? (
                                <TableCell align="left">
                                {cliente?.empresa?.razaoSocial || cliente?.nome}
                              </TableCell>) 
                              : (
                                <TableCell align="left">
                                {+total > 0 ? `R$ ${total}` : "Aguardando resposta"}
                              </TableCell>)}

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
                    count={allProposals?.count || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Linhas por páginas"
                    />
                </>}
              </TableContainer>
            </Scrollbar>
        }

        <FormCreateProposal 
          open={open} 
          onClose={handleClose} 
          admin={admin} 
          mutateCreateProposal={mutateCreateProposal}
          isLoadingCreateProposal={isLoadingCreateProposal}
          formCreateProposal={formCreateProposal}
          allAssets={allAssets}
          isLoadingAssets={isLoadingAssets}
          clients={clients}
          isLoadingClients={isLoadingClients}
          error={error}
          setError={setError}
        />
      </Container>
    </>
  );
}

export default ProposalsPage