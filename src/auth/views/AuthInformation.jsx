import { Link as RouterLink } from 'react-router';
import { Box, Stack, IconButton, InputAdornment, TextField, Alert, Link, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../components/Iconify';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';


export default function AuthInformation(props) {
  const {
    loading,
    setEmail,
    showPassword,
    setShowPassword,
    handleSubmit,
    error,
    setError,
    email,
    password,
    handlePasswordChange
  } = props;
  
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField 
          error={!!error?.email}
          helperText={error?.email}
          name="email" 
          label="Email" 
          value={email} 
          onChange={(e) => { if (error?.email) { setError(null) } setEmail(e.target.value) }} 
        />
        <TextField
          fullWidth
          error={!!error?.password}
          helperText={error?.password}
          name="password"
          label="Senha"
          value={password}
          onChange={(e) => handlePasswordChange(e)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 0 }}
        />
        <PasswordStrengthMeter password={password} />
      </Stack>

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
          loading={loading} 
          variant="contained"
          disabled={!email || !password}
          size="large" 
          sx={{ minWidth: '45%' }} 
          onClick={handleSubmit} 
          endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
        >
          Continuar
        </LoadingButton>
      </Box>
    </form>
  );
}
