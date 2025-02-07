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
  console.log(instrument)

  const priceOptions = {
    "C": instrument?.instrumento?.preco_calibracao_no_cliente,
    "T": instrument?.instrumento?.preco_calibracao_no_cliente,
    "P": instrument?.instrumento?.preco_calibracao_no_laboratorio,
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
      <EditAsset  handleClose={handleClose} open={edit} instrument={instrument} isMobile={isMobile} />
      <CardContent p={2} sx={{
        padding: 2,
        height: '250px',
        overflow: 'auto',
      }}>
        <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
          {!!instrument?.instrumento?.tipoDeInstrumento?.descricao &&
            <Typography fontWeight="900" color={'grey'} variant="body1">
              {instrument?.instrumento?.tipoDeInstrumento?.descricao}
            </Typography>}

          {!!instrument?.posicao &&
            <Chip label={positionLabels[instrument?.posicao]} size="small" variant="outlined" />}
        </Box>

        {!!instrument?.instrumento?.tipoDeInstrumento?.fabricante
          && (<ContentRow colorValue={"black"} title="Fabricante" value={instrument?.instrumento?.tipoDeInstrumento?.fabricante} />)}

        {!!instrument?.instrumento?.tipoDeInstrumento?.modelo
          && (<ContentRow colorValue={"black"} title="Modelo" value={instrument?.instrumento?.tipoDeInstrumento?.modelo} />)}

        {!!instrument?.instrumento?.tipoDeInstrumento?.resolucao
          && (<ContentRow colorValue={"black"} title="Resolução" value={instrument?.instrumento?.tipoDeInstrumento?.resolucao} />)}

        {!!instrument?.instrumento?.procedimentoRelacionado?.codigo
          && (<ContentRow colorValue={"black"} title="Procedimento relacionado" value={instrument?.instrumento?.procedimentoRelacionado?.codigo} />)}

        {!!instrument?.tag
          && (<ContentRow colorValue={"black"} title="Tag" value={instrument?.tag} />)}

        {!!instrument?.numeroDeSerie
          && (<ContentRow colorValue={"black"} title="Número de série" value={instrument?.numeroDeSerie} />)}

        {!!instrument?.dataUltimaCalibracao &&
          (<ContentRow colorValue={"black"} title="Última calibração" value={fDate(instrument?.dataUltimaCalibracao, "dd/MM/yyyy")} />)}

        {!!instrument?.data_proxima_calibracao &&
          (<ContentRow colorValue={"black"} title="Próxima calibração" value={fDate(instrument?.data_proxima_calibracao, "dd/MM/yyyy")} />)}

        {!!instrument?.data_proxima_checagem &&
          (<ContentRow colorValue={"black"} title="Próxima checagem" value={fDate(instrument?.data_proxima_checagem, "dd/MM/yyyy")} />)}

        {!!instrument?.frequencia && (
          <ContentRow colorValue={"black"} title="Frequência" value={instrument?.frequencia > 1 ? `${instrument?.frequencia} meses` : `$${instrument?.frequencia} mês`} />)}

        {(!!instrument?.instrumento?.minimo || !!instrument?.instrumento?.maximo) &&
          (<ContentRow colorValue={"black"} title="Faixa atendida" isMobile={isMobile} value={`${instrument?.instrumento?.minimo} ${!!instrument?.instrumento?.maximo && `- ${instrument?.instrumento?.maximo}`} ${!!instrument?.instrumento?.unidade && `- ${instrument?.instrumento?.unidade}`}`} />)}
        {!!instrument?.instrumento?.capacidade_de_medicao?.valor && !!instrument?.instrumento?.capacidade_de_medicao?.unidade &&
          (<ContentRow colorValue={"black"} title="Capacidade de medição" isMobile={isMobile} value={`${instrument?.instrumento?.capacidade_de_medicao?.valor} ${instrument?.instrumento?.capacidade_de_medicao?.unidade}`} />)}

        {!!instrument?.local && (
          <ContentRow colorValue={"black"} title="Local" value={localLabels[instrument?.local]} />)}

        {!!instrument?.laboratorio && (
          <ContentRow colorValue={"black"} title="Laboratório" value={instrument?.laboratorio} />)}

        {!!instrument?.dias_uteis
          && instrument?.show_business_days
          && <ContentRow colorValue={"black"} title="Dias úteis" value={instrument?.dias_uteis} />}

        {(!!instrument?.instrumento?.preco_calibracao_no_cliente || !!instrument?.instrumento?.preco_calibracao_no_laboratorio || !!instrument?.preco_alternativo_calibracao) &&
          <ContentRow colorValue={"black"} title="Preço calibração" value={`R$ ${instrument?.preco_alternativo_calibracao ? instrument?.preco_alternativo_calibracao : (priceOptions[instrument?.local] || '')}`} />}

        {!!instrument?.pontos_de_calibracao?.length && (
          <ContentRow colorValue={"black"} title="Pontos de calibração" isMobile={isMobile} value={instrument?.pontos_de_calibracao?.map(({ nome }) => nome).join(", ")} />)}

        {!!instrument?.observacoes && (
          <ContentRow colorValue={"black"} title="Observações" isMobile={isMobile} value={instrument?.observacoes} />)}

      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {!!instrument?.instrumento?.tipo_de_servico &&
          <Typography fontWeight="900" color={'black'} variant="body1">
            {instrument?.instrumento?.tipo_de_servico === 'A' ? 'Acreditado' : 'Não acreditado'}
          </Typography>}
        {admin &&
          <Box display="flex">
            <ButtonTooltip title="Editar conteudo" action={() => setEdit((oldValue) => !oldValue)} icon={<EditIcon />} />
            <ButtonTooltip title="Remover instrumento da proposta" action={() => removeInstrumentProposal(instrument.id)} icon={<DeleteIcon />} />
          </Box>
        }
      </CardActions>
    </Card >
  );
}

export default CardInformation;
