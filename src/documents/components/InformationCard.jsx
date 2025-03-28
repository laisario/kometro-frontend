import { Box, Button, Card, CardActions, CardContent, Chip, Divider, Typography } from '@mui/material'
import React from 'react'
import titleCase from '../../utils/formatTitle';
import { fDate } from '../../utils/formatTime';
import { criticalAnalysisMonths } from '../../utils/documents';

function InformationCard(props) {
  const { 
    data, 
    status, 
    statusColor, 
    setOpenFormReview, 
    user,
    form,
  } = props;
  const isCreator = data?.criador?.id === user?.id
  return (
    <Card sx={{bgcolor: 'background.paper'}}>
      <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Box>
          {data?.titulo &&
            <Typography variant="h5" component="div">
              {titleCase(data?.titulo)}
            </Typography>
          }
          {data?.identificador &&
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {data?.identificador}
            </Typography>
          }
          {data?.criador &&
            <Typography sx={{ mt: 1.5 }} variant="body1">
              Elaborador: <strong>{titleCase(data?.criador?.username)}</strong>
            </Typography>
          }
          {data?.codigo?.codigo &&
            <Typography sx={{ mt: 1 }} variant="body1">
              Código: <strong>{data?.codigo?.codigo}</strong>
            </Typography>
          }
          {!!data?.analiseCritica &&
            <Typography sx={{ mt: 1 }} variant="body1">
              Análise Crítica: <strong>{titleCase(criticalAnalysisMonths(data?.analiseCritica))}</strong>
            </Typography>
          }
          {data?.dataValidade &&
            <Typography sx={{ mt: 1 }} variant="body1">
              Validade: <strong>{fDate(data?.dataValidade)}</strong>
            </Typography>
          }
          {!!data?.frequencia &&
            <Typography sx={{ mt: 1 }} variant="body1">
              Frequência:  <strong>{data?.frequencia > 1 ? `${data?.frequencia} anos` : `${data?.frequencia} ano`}</strong>
            </Typography>
          }
          {!!data?.revisoes.length && <Typography sx={{ mt: 1 }} variant="body1">
          Número revisões: <strong>{data?.revisoes?.length}</strong>
          </Typography>}
        </Box>
        <Box>
            {data?.status &&
              <Chip label={status[data?.status]} color={statusColor[data?.status]} />}
        </Box>
      </CardContent>
      <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end" }}>
        {isCreator &&
          (<>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => {setOpenFormReview(true); form.setValue('tipo', 'revalidar') }}
              color='secondary'
              >
              Revalidar
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              color='secondary'
              onClick={() => {setOpenFormReview(true); form.setValue('tipo', 'revisar')} }
              >
              Revisar
            </Button>
          </>)
        }
      </CardActions>
    </Card>
  )
}

export default InformationCard