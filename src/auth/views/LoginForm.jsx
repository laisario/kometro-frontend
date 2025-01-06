import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../components/Iconify.jsx';


export default function LoginForm(props) {
  const {
    loading,
    email,
    setEmail,
    password,
    setPassword,
    error,
    showPassword,
    setShowPassword,
    handleSubmit,
  } = props;
  
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField error={!!error} name="email" label="Email" value={email} onChange={(e) => { if (error) { setError(null) } setEmail(e.target.value) }} />

        <TextField
          error={!!error}
          helperText={!!error && error}
          name="password"
          label="Senha"
          value={password}
          onChange={(e) => { if (error) { setError(null) } setPassword(e.target.value) }}
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
        />
      </Stack>

      <LoadingButton disabled={!email || !password} loading={loading} sx={{ mt: 4 }} type="submit" fullWidth size="large" variant="contained" onClick={handleSubmit}>
        Entrar
      </LoadingButton>
    </form>
  );
}
