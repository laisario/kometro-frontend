import React, { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import dayjs from 'dayjs';
import { capitalizeFirstLetter as CFL, titleCase } from '../../utils/formatString';
import FilesSelection from './FilesSelection';
import { statusMessages, statusColor, statusString } from '../../utils/proposals';



function InformationProposol(props) {
  const { 
    data, 
    isMobile, 
    admin, 
  } = props;
  const [openAnexos, setOpenAnexos] = useState(false)
  const [openProposals, setOpenProposals] = useState(false)

  const handleCloseAnexo = () => {
    setOpenAnexos(false)
  }

  const handleCloseProposal = () => {
    setOpenProposals(false)
  }

  const handleOpenAnexos = () => setOpenAnexos(true)
  const handleOpenProposals = () => setOpenProposals(true)

  const message = statusMessages(admin)[data?.status]

  const mappedAnexos = useMemo(() => data?.anexos?.map(({ anexo }) => ({url: anexo})), [data?.anexos])
  const mappedProposals = useMemo(() =>data?.revisoes?.map((rev) => ({ url: rev?.pdf, rev: rev?.rev })), [data?.revisoes])

  return (
    <Grid container justifyContent="space-between" flexDirection={isMobile ? 'column-reverse' : 'row'}>
      <Box>
        {+(data?.total) > 0 &&
          <Typography variant="h6">Total: R${data?.totalComDesconto}</Typography>
        }
        {!!data?.dataCriacao && admin &&
          <Typography variant="subtitle1" fontWeight="500">
            Proposta criada: {dayjs(data?.dataCriacao).locale('pt-BR').format('D [de] MMMM [de] YYYY')}
          </Typography>
        }
        {!!data?.condicaoDePagamento &&
          <Typography variant="subtitle1" fontWeight="500">
            Condição de pagamento: {data?.condicaoDePagamento}
          </Typography>
        }
        {!!data?.prazoDePagamento &&
          <Typography variant="subtitle1" fontWeight="500">
            Prazo de pagamento: {dayjs(data?.prazoDePagamento).locale('pt-BR').format('D [de] MMMM [de] YYYY')}
          </Typography>
        }
        {!!data?.diasUteis &&
          <Typography variant="subtitle1" fontWeight="500">
            Dias úteis entrega: {data?.diasUteis > 1 ? `Em ${data?.diasUteis} dias` : `Em ${data?.diasUteis} dia`}
          </Typography>
        }
        {!!data?.transporte &&
          <Typography variant="subtitle1" fontWeight="500">
            Transporte: {CFL(data?.transporte)}
          </Typography>
        }
        {!!data?.enderecoDeEntrega &&
          <Typography variant="subtitle1" fontWeight="500">
            Endereço de entrega: {data?.enderecoDeEntrega?.logradouro}, {data?.enderecoDeEntrega?.numero}
            {!!data?.enderecoDeEntrega?.complemento && `- ${data?.enderecoDeEntrega?.complemento}`} - {data?.enderecoDeEntrega?.bairro?.nome} - {data?.enderecoDeEntrega?.cep}
          </Typography>
        }
        {!!data?.responsavel?.username && (<Typography variant="subtitle1" fontWeight="500">Funcionário responsável: {titleCase(data?.responsavel?.username)}</Typography>)}
      </Box>
      <Box display="flex" mb={isMobile ? 2 : 0}  flexDirection={isMobile ? "row" : "column"} gap={1}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Tooltip title={message}>
            <Chip
              label={statusString[data?.status]}
              color={statusColor[data?.status]}
              variant="filled"
              sx={{ color: '#fff' }}
            />
          </Tooltip>
          {data?.dataAprovacao && data?.status !== "AA" && data?.status !== "E" && (
            <Typography variant='overline' fontSize={10} color="grey.400" >Em {dayjs(data?.dataAprovacao).locale('pt-BR').format('DD/MM/YYYY')}</Typography>
          )}
        </Box>
        <FilesSelection open={openAnexos} handleClose={handleCloseAnexo} arr={mappedAnexos} title={data?.anexos?.length > 1 ? 'Anexos' : 'Anexo'} />
        <FilesSelection open={openProposals} handleClose={handleCloseProposal} arr={mappedProposals} title={data?.revisoes?.length > 1 ? 'Propostas' : 'Proposta'} />
        {!!data?.revisoes?.length && <Tooltip placement="right-end" title="Clique para abrir pdf da proposta">
          {isMobile ? (
              <IconButton
                target="_blank"
                size="small"
                onClick={handleOpenProposals}
                color='secondary'
              >
                <PreviewIcon />
              </IconButton>
          ) : (
              <Button
                startIcon={<PreviewIcon />}
                target="_blank"
                onClick={handleOpenProposals}
                color='secondary'
                variant="outlined"
              >
                {data?.revisoes?.length > 1 ? 'Propostas' : 'Proposta'}
              </Button>
          )}
        </Tooltip>}
        {!!data?.anexos?.length && (
          <Tooltip placement="right-end" title="Clique para ver documento anexado">
            {isMobile ? (
              <IconButton onClick={handleOpenAnexos} color='secondary' aria-label="anexo" variant="contained">
                <DownloadIcon />
              </IconButton>
            ) : (
              <Button startIcon={<DownloadIcon />} onClick={handleOpenAnexos} target="_blank" color='secondary' variant="outlined">
                {data?.anexos?.length > 1 ? 'Anexos' : 'Anexo'}
              </Button>
            )}
          </Tooltip>
        )}
      </Box>
    </Grid >
  )
}

export default InformationProposol