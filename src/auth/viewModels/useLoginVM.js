import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';

function useLoginVM() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login, loading } = useAuth();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error: loginError } = await login(email, password);

    if (loginError) {
      console.log(loginError)
      setError(loginError);
      return;
    }

    const redirectPath = state?.redirect || '/dashboard';
    navigate(redirectPath, { replace: true });
  };
  return {
    loading,
    email,
    setEmail,
    password,
    setPassword,
    error,
    showPassword,
    setShowPassword,
    handleSubmit,
  }
}

export default useLoginVM