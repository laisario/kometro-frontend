import { Alert, Button, Card, CardActions, CardContent, Typography, CircularProgress, Box, Divider } from '@mui/material';
import React, { useMemo } from 'react';
import { useTheme } from '@emotion/react';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import { fDate } from '../../utils/formatTime';

function ReviewCard(props) {
  const { 
    revisao, 
    user,
    error,
    mutateApproveReview,
    isLoadingApproveReview
  } = props;
  const theme = useTheme();
  const userApproved = useMemo(() => revisao?.aprovacoes?.some(aprovacao => aprovacao?.aprovador?.id === user?.id), [user, revisao])
  const approversIds = useMemo(() => revisao?.aprovadores?.map((approver) => approver?.id ), [revisao])
 
  return (
    <Card sx={{ 
      px: 4, 
      minHeight: '254px', 
      marginBottom: 4, 
      bgcolor: 'background.paper',
      display: 'flex', 
      justifyContent: 'center', 
      flexDirection: 'column'
    }}>
      <CardContent>
        <Typography variant="body1">
          <strong>{revisao?.tipo === 'revalidar' ? 'Revalidado' : 'Revisado'} {fDate(revisao?.dataRevisao)}</strong>
        </Typography>
        <Typography variant='body2' color="text.secondary">
          Por: <strong>{revisao?.revisor?.username}</strong>
        </Typography>
        <Typography  variant='body2' color="text.secondary">
          Aprovadores: <strong>{revisao?.aprovadores?.map((ap) => ap?.username).slice().join(", ")}</strong>
        </Typography>
        <Typography 
          color='text.secondary' 
          variant="body2"
        >
          {revisao?.tipo === 'revalidar' ? 'Observação: ' : 'Alteração: '}
          <strong>{revisao?.alteracao}</strong>
        </Typography>
      </CardContent>
      {!!revisao?.aprovacoes?.length && (
        <Box sx={{ px: 2 }}>
            <Divider sx={{mb: 2}} />
            <Typography variant='body2'><strong>Aprovações:</strong></Typography>
            <Box display="flex" sx={{mt: 1}} flexDirection="row">
              {revisao?.aprovacoes.map((aprovacao, index) => (
                <Box key={aprovacao.id + index} sx={{ backgroundColor: theme.palette.grey[300], p: 0.5, borderRadius: 1, mr: 0.5 }}>
                  <Box display="flex" flexDirection="row">
                    <PersonIcon fontSize="small" />
                    <Typography variant='body2'>
                      {aprovacao?.aprovador?.username}
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <DateRangeIcon fontSize="small" />
                    <Typography variant='body2'>
                        {fDate(aprovacao?.dataAprovacao, 'dd/MM/yyyy')}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
      )}
      {!!error && <Alert severity="error">{error}</Alert>}
      <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end" }}>
        {approversIds?.includes(user?.id) &&
          <Button
            size="small" 
            onClick={() => mutateApproveReview({revisao, userApproved})}
          >
            {
              isLoadingApproveReview 
                ? <CircularProgress />
                : userApproved ? "Retirar aprovação" : "Aprovar"
            }
          </Button>
        }
      </CardActions>
    </Card>
  )
}

export default ReviewCard