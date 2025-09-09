import {
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Box,
  Typography,
  ListSubheader
} from '@mui/material';
import { colorPositionInstrument, positionLabels } from '../../utils/assets';
import { formatDateTimeBR } from '../../utils/formatTime';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


const PositionList = ({movimentationsPosition, firstMovimentation, asset}) => {
  return (
    <List
      aria-labelledby="movimentacao-da-posicao"  
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Movimentação da posição
        </ListSubheader>
      }
      sx={{p: 2}}
    >
      {movimentationsPosition?.map((mov, index) => {
        const usuario = mov.usuarioAlteracao?.empresa?.razaoSocial || mov.usuarioAlteracao?.nome || mov?.usuarioAlteracao?.usuario?.username
        return (
          <div key={index}>
            <ListItem alignItems="center">
              <Chip
                label={positionLabels[mov.novaPosicao] || 'Unknown'}
                color={colorPositionInstrument[mov.novaPosicao] || 'default'}
                size="medium"
                sx={{ mr: 2}}
              />
              <ListItemText
                primary={formatDateTimeBR(mov.dataAlteracao)}
                secondary={`Movimentado por: ${usuario}`}
              />
            </ListItem>
            {index < movimentationsPosition.length - 1 && <Divider component="li" />}
          </div>
        )})}
        {!!movimentationsPosition?.length && <ListItem alignItems="flex-start">
          <Chip
            label={positionLabels[firstMovimentation.antigaPosicao] || 'Unknown'}
            color={colorPositionInstrument[firstMovimentation.antigaPosicao] || 'default'}
            size="medium"
            sx={{ mr: 2, mt: 0.5 }}
          />
          <ListItemText
            primary={formatDateTimeBR(asset?.dataCriacao)}
            secondary={`Movimentado por: ${asset?.cliente?.empresa?.razaoSocial || asset?.cliente?.nome || asset?.cliente?.usuario?.username}`}
          />
        </ListItem>}
    </List>
  )
}


const SectorList = ({movimentationsSector}) => {
  return (
    <List    
      aria-labelledby="movimentacao-de-setores"  
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Movimentação de setores
        </ListSubheader>
      }
      sx={{p: 2}}
    >
      {movimentationsSector?.map((mov, index) => {
        const usuario = mov?.usuarioAlteracao?.empresa?.razaoSocial || mov?.usuarioAlteracao?.nome || mov?.usuarioAlteracao?.usuario?.username
        return (
          <div key={index}>
            <ListItem alignItems="center">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {mov?.antigoSetor || 'Antigo setor'}
                </Typography>
                <ArrowDownwardIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {mov?.novoSetor || 'Novo setor'}
                </Typography>
              </Box>
              <ListItemText
                primary={formatDateTimeBR(mov?.dataAlteracao)}
                secondary={`Movimentado por: ${usuario}`}
              />
            </ListItem>
            {index < movimentationsSector?.length - 1 && <Divider component="li" />}
          </div>
        )})}
    </List>
  )
}


export default function Movimentations({ movimentationsPosition = [], asset, movimentationsSector, isMobile }) {
  const firstMovimentation = movimentationsPosition[movimentationsPosition?.length - 1]
  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2}}>
      {!!movimentationsPosition?.length && <PositionList asset={asset} movimentationsPosition={movimentationsPosition} firstMovimentation={firstMovimentation} />}
      {!!movimentationsSector?.length && <SectorList movimentationsSector={movimentationsSector} />}
    </Box>
  );
}
