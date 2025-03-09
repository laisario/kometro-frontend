import { Box, Stack, Typography, Paper, Chip, Divider } from '@mui/material'
import React from 'react'
import ContentRow from './ContentRowCard'
import { positionLabels, colorPositionInstrument, localLabels } from '../utils/assets';
import { fDate } from '../utils/formatTime';


function AssetInformation({instrument, isMobile}) {
  return (
    <>
      <Stack 
        direction={isMobile ? "column" : "row"} 
        divider={<Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />} 
        justifyContent="space-between"
      >
        <Box sx={{ minWidth: "35%" }}>
          {!!instrument?.tag && (
            <ContentRow title="Tag" value={instrument?.tag} />
          )}
          {!!instrument?.numeroDeSerie && (
            <ContentRow title="Número de série" value={instrument?.numeroDeSerie} />
          )}
          {!!instrument?.instrumento?.tipoDeInstrumento?.resolucao && (
            <ContentRow title="Resolução" value={instrument?.instrumento?.tipoDeInstrumento?.resolucao} />
          )}
          {!!instrument?.instrumento?.capacidadeDeMedicao?.valor && (
            <ContentRow
              title="Capacidade de medição" 
              value={`${instrument?.instrumento?.capacidadeDeMedicao?.valor} ${instrument?.instrumento?.capacidadeDeMedicao?.unidade}`}
            />
          )}
          {!!instrument?.instrumento?.procedimentoRelacionado?.codigo && (
            <ContentRow title="Procedimento relacionado" value={instrument?.instrumento?.procedimentoRelacionado?.codigo} />
          )}
          {!!instrument?.diasUteis && (
            <ContentRow title="Dias úteis" value={instrument?.diasUteis} />
          )}
          {!!instrument?.frequencia && (
            <ContentRow title="Frequência" value={instrument?.frequencia > 1 ? `${instrument?.frequencia} meses` : `${instrument?.frequencia} mês`} />
          )}
          {!!instrument?.laboratorio && (
            <ContentRow title="Laboratório" value={instrument?.laboratorio} />
          )}
          {!!instrument?.local && (
            <ContentRow title="Local" value={localLabels[instrument?.local]} />
          )}

          {!!instrument?.pontosDeCalibracao?.length && (
            <ContentRow title="Pontos de calibração:" isMobile={isMobile} value={instrument?.pontosDeCalibracao?.map(({ nome }) => nome).join(", ")} />)}
        </Box>
        {(instrument?.instrumento?.precoCalibracaoNoCliente
          || instrument?.instrumento?.precoCalibracaoNoLaboratorio
          || instrument?.precoAlternativoCalibracao
          || instrument?.dataProximaCalibracao
          || instrument?.dataProximaChecagem
          || instrument?.dataUltimaCalibracao) 
          && (
            <Box sx={{ minWidth: "35%" }}>
              {(!!instrument?.instrumento?.precoCalibracaoNoCliente || !!instrument?.instrumento?.precoCalibracaoNoLaboratorio || instrument?.precoAlternativoCalibracao)
                && <Typography fontWeight={700} mb={0.5}>Preços calibração:</Typography>}
              {!!instrument?.instrumento?.precoCalibracaoNoCliente && (
                <ContentRow title="Cliente" value={`R$ ${instrument?.instrumento?.precoCalibracaoNoCliente}`} />
              )}
              {!!instrument?.instrumento?.precoCalibracaoNoLaboratorio && (
                <ContentRow title="Laborátorio" value={`R$ ${instrument?.instrumento?.precoCalibracaoNoLaboratorio}`} />
              )}
              {!!instrument?.precoAlternativoCalibracao && (
                <ContentRow title="Alternativo" value={`R$ ${instrument?.precoAlternativoCalibracao}`} />
              )}
              {(!!instrument?.dataProximaCalibracao || !!instrument?.dataProximaChecagem || !!instrument?.dataUltimaCalibracao) && <Typography fontWeight={700} my={0.5}>Datas:</Typography>}
              {!!instrument?.dataProximaCalibracao && (
                <ContentRow title="Próxima calibração" value={fDate(instrument?.dataProximaCalibracao, "dd/MM/yyyy")} />
              )}
              {!!instrument?.dataProximaChecagem && (
                <ContentRow title="Próxima checagem" value={fDate(instrument?.dataProximaChecagem, "dd/MM/yyyy")} />
              )}
              {!!instrument?.dataUltimaCalibracao && (
                <ContentRow title="Última calibração" value={fDate(instrument?.dataUltimaCalibracao, "dd/MM/yyyy")} />
              )}
            </Box>
          )
        }
        <Box display="flex" flexDirection="column" sx={{ minWidth: "20%" }}>
            {!!instrument?.instrumento?.tipoDeServico && (
              <Chip 
                color="secondary" 
                sx={{ mt: isMobile ? 1 : 0 }} 
                label={instrument?.instrumento?.tipoDeServico === "A" ? "Acreditado" : "Não acreditado"} 
              />
            )}
            {!!instrument?.posicao && (
              <Chip 
                color={colorPositionInstrument[instrument?.posicao]} 
                sx={{ mt: 0.5, color: '#ffffff' }} 
                label={positionLabels[instrument?.posicao]} 
              />
            )}
        </Box>
      </Stack>
      {!!instrument?.observacoes && (
        <Paper square={false} variant='elevation' sx={{ backgroundColor: '#e5e5e5', p: 1, mt: 2, }}>
          <Typography variant='body2'>Observações: <strong>{instrument?.observacoes}</strong></Typography>
        </Paper>
      )}
    </>
  )
}

export default AssetInformation