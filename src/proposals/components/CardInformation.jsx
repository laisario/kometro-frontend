import { useTheme } from '@emotion/react';
import { Box, Card, CardActions, CardContent, Chip, Typography } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fDate } from '../../utils/formatTime';
import EditAsset from '../../components/EditAsset';
import ButtonTooltip from '../../components/ButtonTooltip';
import { colorPositionInstrument, localLabels, positionLabels } from '../../utils/assets'
import ContentRow from '../../components/ContentRowCard';


function CardInformation({ instrument, isMobile, admin, removeInstrumentProposal }) {
  const [edit, setEdit] = useState(false)
  const theme = useTheme();

  const priceOptions = {
    "C": instrument?.instrumento?.precoCalibracaoNoCliente,
    "T": instrument?.instrumento?.precoCalibracaoNoCliente,
    "P": instrument?.instrumento?.precoCalibracaoNoLaboratorio,
  }
  const handleClose = () => {
    setEdit(false)
  }

  return (
    <Card sx={{
      backgroundColor: theme.palette.background.neutral,
      minWidth: isMobile ? '100%' : '40%',
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      scroll: "auto",
      mb: 2,
    }}>
      <EditAsset handleClose={handleClose} open={edit} instrument={instrument} isMobile={isMobile} />
    
      <CardContent p={2} sx={{ padding: 2, maxHeight: '180px',overflow: 'auto' }}>
        <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
          {!!instrument?.instrumento?.tipoDeInstrumento?.descricao && (
            <Typography fontWeight="900" color={'grey'} variant="body1">
              {instrument?.instrumento?.tipoDeInstrumento?.descricao}
            </Typography>
          )}
          {!!instrument?.posicao && (
            <Chip variant="filled" label={positionLabels[instrument?.posicao]} color={colorPositionInstrument[instrument?.posicao]} size="small" />
          )}
        </Box>
    
        {(!!instrument?.instrumento?.minimo || !!instrument?.instrumento?.maximo) && (
          <ContentRow
            colorValue="black"
            title="Faixa atendida"
            isMobile={isMobile}
            value={`${instrument?.instrumento?.minimo} ${instrument?.instrumento?.maximo ? `- ${instrument?.instrumento?.maximo}` : ''} ${instrument?.instrumento?.unidade ? ` ${instrument?.instrumento?.unidade}` : ''}`}
          />
        )}
        {!!instrument?.instrumento?.tipoDeInstrumento?.modelo && (
          <ContentRow colorValue="black" title="Modelo" value={instrument?.instrumento?.tipoDeInstrumento?.modelo} />
        )}
        {!!instrument?.instrumento?.tipoDeInstrumento?.fabricante && (
          <ContentRow colorValue="black" title="Fabricante" value={instrument?.instrumento?.tipoDeInstrumento?.fabricante} />
    
        )}
    
        {!!instrument?.instrumento?.tipoDeInstrumento?.resolucao && (
          <ContentRow colorValue="black" title="Resolução" value={instrument?.instrumento?.tipoDeInstrumento?.resolucao} />
        )}
    
        {!!instrument?.tag && (
          <ContentRow colorValue="black" title="Tag" value={instrument?.tag} />
        )}
      </CardContent>
    
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {!!instrument?.instrumento?.tipoDeServico && (
          <Typography fontWeight="900" color="black" variant="body1">
            {instrument?.instrumento?.tipoDeServico === 'A' ? 'Acreditado' : 'Não acreditado'}
          </Typography>
        )}
        {admin && (
          <Box display="flex">
            <ButtonTooltip title="Editar conteúdo" action={() => setEdit((old) => !old)} icon={<EditIcon />} />
            <ButtonTooltip title="Remover instrumento da proposta" action={() => removeInstrumentProposal(instrument.id)} icon={<DeleteIcon />} />
          </Box>
        )}
      </CardActions>
    </Card>
  );
}

export default CardInformation;
