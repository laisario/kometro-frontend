import React from 'react'
import { Helmet } from 'react-helmet-async';
import { Link, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import LoginForm from '../views/LoginForm';
import useLoginVM from '../viewModels/useLoginVM';

function LoginPage() {
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
  } = useLoginVM()
  return (
    <>
      <Helmet>
        <title> Login </title>
      </Helmet>

      <Container maxWidth="xs">
        <Typography variant="h3" gutterBottom>
          Entrar
        </Typography>

        <Typography variant="body2" sx={{ mb: 5 }}>
          Não tem uma conta? {''}
          <Link 
            to="/register"
            component={RouterLink}
            variant="subtitle2"
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            Criar conta
          </Link>
        </Typography>

        <LoginForm
          loading={loading}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleSubmit={handleSubmit}
        />
      </Container>
    </>
  )
}

export default LoginPage