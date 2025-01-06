import { Helmet } from 'react-helmet-async';
import { Container, Typography, useScrollTrigger } from '@mui/material';
import AuthInformation from '../views/AuthInformation';
import useAuthInfoVM from '../viewModels/useAuthInfoVM';


export default function RegisterAuthPage() {
  const {
    loading,
    setEmail,
    setPassword,
    showPassword,
    setShowPassword,
    handleSubmit,
    erros,
    error,
    email,
    password
  } = useAuthInfoVM()
  return (
    <>
      <Helmet>
        <title> Configurar acesso | Kometro </title>
      </Helmet>

      <Container maxWidth="sm">
        <Typography variant="h3" gutterBottom>
          Configurar acesso
        </Typography>

        <Typography variant="body2" sx={{ mb: 5 }}>
          Deixe sua conta bem segura
        </Typography>

        <AuthInformation
          loading={loading}
          setEmail={setEmail}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleSubmit={handleSubmit}
          erros={erros}
          error={error}
          email={email}
          password={password}
        />
      </Container>
    </>
  );
}