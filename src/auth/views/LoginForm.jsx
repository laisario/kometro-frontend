import { Stack, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../components/Iconify.jsx';


export default function LoginForm(props) {
  const {
    isLoadingLogin,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    handleSubmit,
  } = props;

  
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          name="email"
          required
          label="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
        />

        <TextField
          name="password"
          label="Senha"
          required
          value={password}
          onChange={(e) => { if (error?.msg?.length) { setError(null) } setPassword(e.target.value) }}
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

        <LoadingButton 
          disabled={!email || !password} 
          loading={isLoadingLogin} 
          sx={{ mt: 4 }} type="submit" 
          fullWidth 
          size="large" 
          variant="contained" 
          onClick={handleSubmit}
          >
          Entrar
        </LoadingButton>
    </form>
  );
}
