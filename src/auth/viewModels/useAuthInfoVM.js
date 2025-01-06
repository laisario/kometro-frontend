import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';

function useAuthInfoVM() {
  const navigate = useNavigate();
  const { registerAuth, loading } = useAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await registerAuth({ email, password})
    if (response?.status !== 201) {
      setError({ ...response?.response?.data })
      return null
    };
    return navigate('/login', { replace: true });
  };

  const erros = !!error && Object.keys(error)
  return {
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
  }
}

export default useAuthInfoVM