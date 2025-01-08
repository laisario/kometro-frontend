import React, { useState } from 'react'
import useAuth from '../hooks/useAuth';

function useAuthInfoVM() {
  const { registerAuthMutation } = useAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ email: "", password: "" })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isPasswordValid = validatePassword(password);
    const isEmailValid = validateEmail(email);

    if (isPasswordValid && isEmailValid) {
      registerAuthMutation({ email, password})
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setError((prevErrors) => ({
        ...prevErrors,
        password: "A senha deve ter pelo menos 8 caracteres.",
      }));
      return false;
    }
    setError((prevErrors) => ({ ...prevErrors, password: "" }));
    return true;
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      setError((prevErrors) => ({
        ...prevErrors,
        email: "Por favor, insira um email válido.",
      }));
      return false;
    }
    setError((prevErrors) => ({ ...prevErrors, email: "" }));
    return true;
  };


  const handlePasswordChange = (e) => {
    if (error?.password) {
      setError('') 
    }
    const value = e.target.value;
    setPassword(value);
  }

  return {
    setEmail,
    setPassword,
    showPassword,
    setShowPassword,
    handleSubmit,
    error,
    setError,
    email,
    password,
    handlePasswordChange
  }
}

export default useAuthInfoVM