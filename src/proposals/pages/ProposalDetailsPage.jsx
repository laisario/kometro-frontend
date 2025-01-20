import React from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import CloseIcon from '@mui/icons-material/Close';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import Iconify from '../../components/Iconify';
import { fDate } from '../../utils/formatTime';
// refatorar
import Assets from '../components/Assets';
import AdditionalInformation from '../components/AdditionalInformation';
import InformationProposal from '../components/InformationProposal';
import FormElaborate from '../components/FormElaborate';
import useProposalVM from '../viewModels/useProposalVM';
import { statusColor, statusString } from '../../utils/proposals';


function ProposalDetailsPage() {
  const {
    isMobile,
    proposal,
    refetchProposal,
    isLoadingProposal,
    removeInstrumentProposal,
    isRemoving,
    elaborateOpen,
    setElaborateOpen,
    user,
    edit,
    setEdit,
    elaborate
  } = useProposalVM();
  console.log('a')

  return (
    <>
      <Helmet>
        <title>Proposta | Kometro </title>
      </Helmet>
      <Container>
        <Stack 
          direction={isMobile ? "column" : "row"} 
          alignItems={isMobile ? "flex-start" : "center"} 
          justifyContent="space-between" 
          mb={5}
        >
          <Box direction="column">
            {!!proposal?.numero &&
              <Typography variant="h4" gutterBottom>
                Proposta número: {proposal?.numero}
              </Typography>
            }
            {user?.admin ? (!!proposal?.cliente?.empresa?.razaoSocial || !!proposal?.cliente?.nome) &&
              <Typography variant="h6" gutterBottom>
                {proposal?.cliente?.nome && proposal?.cliente?.empresa?.razaoSocial ? `${proposal?.cliente?.empresa?.razaoSocial} - ${proposal?.cliente?.nome}` : proposal?.cliente?.empresa?.razaoSocial || proposal?.cliente?.nome}
              </Typography>
              : !!proposal?.dataCriacao &&
              <Typography variant="h6" gutterBottom>
                {fDate(proposal?.dataCriacao)}
              </Typography>
            }
          </Box>

          {user?.admin ? (
            <Box display="flex" gap={2} mt={isMobile ? 1 : 0} >
              <Tooltip title="Deletar proposta">
                <Button onClick={deleteOrderAndNavigate} color="secondary">
                  <Iconify icon="eva:trash-2-fill" />
                </Button>
              </Tooltip>
              {proposal?.status === 'E' ? (
                <Button 
                  color='secondary'
                  variant="contained" 
                  onClick={() => setElaborateOpen(true)} 
                  endIcon={<Iconify icon="eva:checkmark-fill" />}
                >
                  Elaborar proposta
                </Button>
              ) : (
                <Button 
                  color='secondary' 
                  variant="contained" 
                  onClick={() => { setEdit(true); setElaborateOpen(true) }} 
                  endIcon={<Iconify icon="eva:edit-fill" />}
                >
                  Editar proposta
                </Button>
              )}
              <Tooltip title="Enviar proposta para email">
                <Button 
                  variant="contained" 
                  color="primary" 
                  disabled={proposal?.status === "E"} 
                  onClick={handleSendEmail} 
                  endIcon={<ForwardToInboxIcon />}
                >
                  Enviar para cliente
                </Button>
              </Tooltip>
            </Box>
          ) : proposal?.status === "AA" && (
            <Box display='flex'>
              <Tooltip title="Clique para aprovar a proposta">
                <Button
                  variant="contained"
                  disabled={proposal?.status !== "AA"}
                  sx={{ marginX: 2 }}
                  onClick={() => aprove()}
                  startIcon={<Iconify icon="eva:checkmark-fill" />}
                >
                  Aprovar proposta
                </Button>
              </Tooltip>
              <Tooltip title="Clique para reprovar a proposta">
                <Button
                  variant="contained"
                  color="error"
                  disabled={proposal?.status !== "AA"}
                  onClick={() => refuse()}
                  startIcon={<Iconify icon="ph:x-bold" />}
                >
                  Reprovar proposta
                </Button>
              </Tooltip>
            </Box>
          )}
        </Stack>

        {!!proposal && (
          <FormElaborate
            open={elaborateOpen}
            data={proposal}
            setElaborate={setElaborateOpen}
            editProposol={edit}
            elaborate={elaborate}
          />
        )}

        <Paper sx={{ padding: 4 }}>
          {proposal?.status === "E" 
            ? <Typography variant='subtitle1'>
              As informações da proposta aparecerão aqui após a elaboração pela equipe
            </Typography> : (
            <InformationProposal
              data={proposal}
              isMobile={isMobile}
              admin={user?.admin}
              statusString={statusString}
              statusColor={statusColor}
            />
          )}
          <Assets
            data={proposal}
            refetch={refetchProposal}
            isLoading={isLoadingProposal}
            isMobile={isMobile}
            admin={user?.admin}
            removeInstrumentProposal={removeInstrumentProposal}
            isRemoving={isRemoving}
          />
          {proposal?.informacoesAdicionais && <AdditionalInformation data={proposal} />}
        </Paper>
      </Container>
    </>
  )
}

export default ProposalDetailsPage