import {
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import { colorPositionInstrument, positionLabels } from '../../utils/assets';
import { formatDateTimeBR } from '../../utils/formatTime';

export default function Movimentations({ movimentations = [], asset }) {
  const firstMovimentation = movimentations[movimentations?.length - 1]
  return (
    <List>
      {movimentations?.map((mov, index) => {
        const usuario = mov.usuarioAlteracao?.empresa?.razaoSocial || mov.usuarioAlteracao?.nome || mov?.usuarioAlteracao?.usuario?.username
        return (
          <div key={index}>
            <ListItem alignItems="flex-start">
              <Chip
                label={positionLabels[mov.novaPosicao] || 'Unknown'}
                color={colorPositionInstrument[mov.novaPosicao] || 'default'}
                size="medium"
                sx={{ mr: 2, mt: 0.5 }}
              />
              <ListItemText
                primary={formatDateTimeBR(mov.dataAlteracao)}
                secondary={`Movimentado por: ${usuario}`}
              />
            </ListItem>
            {index < movimentations.length - 1 && <Divider component="li" />}
          </div>
        )})}
        {!!movimentations?.length && <ListItem alignItems="flex-start">
          <Chip
            label={positionLabels[firstMovimentation.antigaPosicao] || 'Unknown'}
            color={colorPositionInstrument[firstMovimentation.antigaPosicao] || 'default'}
            size="medium"
            sx={{ mr: 2, mt: 0.5 }}
          />
          <ListItemText
            primary='Posição na criação do instrumento'
          />
        </ListItem>}
    </List>
  );
}
