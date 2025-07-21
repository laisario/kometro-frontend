import { useTheme } from '@emotion/react';
import { Box, Card, CardActions, CardContent, Chip, Typography } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fDate } from '../../utils/formatTime';
import EditAsset from '../../components/EditAsset';
import ButtonTooltip from '../../components/ButtonTooltip';
import { localLabels, positionLabels } from '../../utils/assets'
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
    
      <CardContent p={2} sx={{ padding: 2, height: '250px', overflow: 'auto' }}>
        <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
          {!!instrument?.instrumento?.tipoDeInstrumento?.descricao && (
            <Typography fontWeight="900" color={'grey'} variant="body1">
              {instrument?.instrumento?.tipoDeInstrumento?.descricao}
            </Typography>
          )}
          {!!instrument?.posicao && (
            <Chip label={positionLabels[instrument?.posicao]} size="small" variant="outlined" />
          )}
        </Box>
    
        {!!instrument?.instrumento?.tipoDeInstrumento?.fabricante && (
          <ContentRow colorValue="black" title="Fabricante" value={instrument?.instrumento?.tipoDeInstrumento?.fabricante} />
        )}
    
        {!!instrument?.instrumento?.tipoDeInstrumento?.modelo && (
          <ContentRow colorValue="black" title="Modelo" value={instrument?.instrumento?.tipoDeInstrumento?.modelo} />
        )}
    
        {!!instrument?.instrumento?.tipoDeInstrumento?.resolucao && (
          <ContentRow colorValue="black" title="Resolução" value={instrument?.instrumento?.tipoDeInstrumento?.resolucao} />
        )}
    
        {!!instrument?.instrumento?.procedimentoRelacionado?.codigo && (
          <ContentRow colorValue="black" title="Procedimento relacionado" value={instrument?.instrumento?.procedimentoRelacionado?.codigo} />
        )}
    
        {!!instrument?.tag && (
          <ContentRow colorValue="black" title="Tag" value={instrument?.tag} />
        )}
    
        {!!instrument?.numeroDeSerie && (
          <ContentRow colorValue="black" title="Número de série" value={instrument?.numeroDeSerie} />
        )}
    
        {!!instrument?.dataProximaCalibracao && (
          <ContentRow colorValue="black" title="Próxima calibração" value={fDate(instrument?.dataProximaCalibracao, "dd/MM/yyyy")} />
        )}
    
        {!!instrument?.dataProximaChecagem && (
          <ContentRow colorValue="black" title="Próxima checagem" value={fDate(instrument?.dataProximaChecagem, "dd/MM/yyyy")} />
        )}
    
        {!!instrument?.frequenciaCalibracao?.quantidade && (
          <ContentRow
            colorValue="black"
            title="Frequência calibração"
            value={`${instrument.frequenciaCalibracao.quantidade} ${instrument.frequenciaCalibracao.periodo}${instrument.frequenciaCalibracao.quantidade > 1 ? 's' : ''}`}
          />
        )}
    
        {!!instrument?.frequenciaChecagem?.quantidade && (
          <ContentRow
            colorValue="black"
            title="Frequência checagem"
            value={`${instrument.frequenciaChecagem.quantidade} ${instrument.frequenciaChecagem.periodo}${instrument.frequenciaChecagem.quantidade > 1 ? 's' : ''}`}
          />
        )}
    
        {(!!instrument?.instrumento?.minimo || !!instrument?.instrumento?.maximo) && (
          <ContentRow
            colorValue="black"
            title="Faixa atendida"
            isMobile={isMobile}
            value={`${instrument?.instrumento?.minimo} ${!!instrument?.instrumento?.maximo ? `- ${instrument?.instrumento?.maximo}` : ''} ${!!instrument?.instrumento?.unidade ? `- ${instrument?.instrumento?.unidade}` : ''}`}
          />
        )}
    
        {!!instrument?.instrumento?.capacidadeDeMedicao?.valor && !!instrument?.instrumento?.capacidadeDeMedicao?.unidade && (
          <ContentRow
            colorValue="black"
            title="Capacidade de medição"
            isMobile={isMobile}
            value={`${instrument?.instrumento?.capacidadeDeMedicao?.valor} ${instrument?.instrumento?.capacidadeDeMedicao?.unidade}`}
          />
        )}
    
        {!!instrument?.local && (
          <ContentRow colorValue="black" title="Local" value={localLabels[instrument?.local]} />
        )}
    
        {!!instrument?.laboratorio && (
          <ContentRow colorValue="black" title="Laboratório" value={instrument?.laboratorio} />
        )}
    
        {!!instrument?.diasUteis && instrument?.showBusinessDays && (
          <ContentRow colorValue="black" title="Dias úteis" value={instrument?.diasUteis} />
        )}
    
        {(!!(instrument?.instrumento?.precoCalibracaoNoCliente || !!instrument?.instrumento?.precoCalibracaoNoLaboratorio || !!instrument?.precoAlternativoCalibracao)) && (
          <ContentRow
            colorValue="black"
            title="Preço calibração"
            value={`R$ ${instrument?.precoAlternativoCalibracao ?? (priceOptions[instrument?.local] || '')}`}
          />
        )}
    
        {!!instrument?.pontosDeCalibracao?.length && (
          <ContentRow
            colorValue="black"
            title="Pontos de calibração"
            isMobile={isMobile}
            value={instrument?.pontosDeCalibracao?.map(({ nome }) => nome).join(", ")}
          />
        )}
    
        {!!instrument?.observacaoFornecedor && (
          <ContentRow
            colorValue="black"
            title="Observações"
            isMobile={isMobile}
            value={instrument?.observacaoFornecedor}
          />
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
