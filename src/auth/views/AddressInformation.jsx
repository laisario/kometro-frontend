import { Link as RouterLink } from 'react-router';
import { Alert, Box, Link, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../components/Iconify';
import FormAdress from '../components/FormAddress';


export default function AddressInformation(props) {
  const {
    handleSubmit,
    isValid,
    form,
    erros,
    loading,
    control,
    error,
  } = props;
  console.log('AAAA', isValid)

  return (
    <form onSubmit={handleSubmit}>
      <FormAdress
        isValid={isValid}
        form={form}
        control={control}
      />
      {!!erros?.length && erros?.map((key, i) => (<Alert key={key + i} severity="error">{`${error[key]}: ${key}`}</Alert>))}
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
        <Typography variant="body2">
          Já tem uma conta? {''}
          <Link
            to="/login"
            component={RouterLink}
            variant="subtitle2"
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            Entrar
          </Link>
        </Typography>
        <LoadingButton
          endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
          loading={loading}
          sx={{ maxWidth: '45%' }}
          type="submit"
          fullWidth
          size="large"
          variant="contained"
          onClick={handleSubmit}
        >
          Continuar
        </LoadingButton>
      </Box>
    </form>
  );
}
