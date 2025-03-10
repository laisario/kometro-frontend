import React from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import Iconify from '../../components/Iconify';
import { fDate } from '../../utils/formatTime';
import Assets from '../components/Assets';
import AdditionalInformation from '../components/AdditionalInformation';
import InformationProposal from '../components/InformationProposal';
import FormElaborate from '../components/FormElaborate';
import useProposalVM from '../viewModels/useProposalVM';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';


function ProposalDetailsPage() {
  const {
    isMobile,
    proposal,
    removeInstrumentProposal,
    isRemoving,
    elaborateOpen,
    setElaborateOpen,
    user,
    setEdit,
    aproveProposal,
    refuseProposal,
    deleteOrderAndNavigate,
    sendProposalToEmail,
    isLoadingSendProposal,
    addInstrumentProposal,
    isLoadingAdd,
    elaborateProposal,
    isLoadingElaborateProposal,
    isSuccessElaborate,
    isDeleting,
    isLoadingAproveProposal,
    isLoadingRefuseProposal
  } = useProposalVM();

  const theme = useTheme()

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
              </Typography>}
          </Box>

          {user?.admin ? (
            <Box display="flex" gap={2} mt={isMobile ? 1 : 0} >
              <Tooltip title="Deletar proposta">
                <Button onClick={deleteOrderAndNavigate} color="secondary">
                  {isDeleting ? <CircularProgress size='20px' color="inherit" /> : <Iconify icon="eva:trash-2-fill" />}
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
                  endIcon={
                    isLoadingElaborateProposal 
                      ? <CircularProgress size='20px' color="inherit" />  
                      : <Iconify icon="eva:edit-fill" />
                  }
                >
                  Editar proposta
                </Button>
              )}
              <Tooltip title="Enviar proposta para email">
                <Button 
                  variant="contained" 
                  color="primary" 
                  disabled={proposal?.status === "E"} 
                  onClick={sendProposalToEmail} 
                  endIcon={
                    isLoadingSendProposal 
                      ? <CircularProgress size='20px' color="inherit" /> 
                      : <ForwardToInboxIcon />
                  }
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
                  onClick={() => aproveProposal()}
                  startIcon={
                    isLoadingAproveProposal 
                      ? <CircularProgress size='20px' color="inherit" /> 
                      : <Iconify icon="eva:checkmark-fill" />
                  }
                >
                  Aprovar proposta
                </Button>
              </Tooltip>
              <Tooltip title="Clique para reprovar a proposta">
                <Button
                  variant="contained"
                  color="error"
                  disabled={proposal?.status !== "AA"}
                  onClick={() => refuseProposal()}
                  startIcon={isLoadingRefuseProposal
                      ? <CircularProgress size='20px' color="inherit" /> 
                      : <Iconify icon="ph:x-bold" />
                  }
                >
                  Reprovar proposta
                </Button>
              </Tooltip>
            </Box>
          )}
        </Stack>

        <FormElaborate
          open={elaborateOpen}
          data={proposal}
          setElaborate={setElaborateOpen}
          elaborateProposal={elaborateProposal}
          isLoadingElaborateProposal={isLoadingElaborateProposal}
          isSuccessElaborate={isSuccessElaborate}
        />

        <Paper sx={{ padding: 4 }}>
          {proposal?.status === "E" 
            ? <Box p={1} bgcolor={theme?.palette?.info?.lighter} borderRadius={1}  display="flex" flexDirection="row" alignItems="center" gap={1}>
                <Avatar variant='rounded' sx={{width: 30, height: 30, backgroundColor: theme?.palette?.info?.light}}>
                  <HourglassBottomIcon fontSize='small' />
                </Avatar>
                <Typography variant='body2' color={theme?.palette?.info?.dark}>
                  <b>{user?.admin ? 'O cliente fez uma solicitação!' : 'Recebemos sua solicitação!'}</b>
                  {user?.admin 
                    ? ' Complete as informações para que ele possa revisar.'
                    : ' A equipe está preenchendo os detalhes da proposta. Assim que estiver pronta, você poderá visualizá-la aqui.' 
                  }
                </Typography> 
            </Box>
            : (
            <InformationProposal
              data={proposal}
              isMobile={isMobile}
              admin={user?.admin}
            />
          )}
          <Assets
            data={proposal}
            addInstrumentProposal={addInstrumentProposal}
            isLoadingAdd={isLoadingAdd}
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