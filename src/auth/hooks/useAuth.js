import { useContext, useMemo, useState } from 'react';
import  AuthContext from '../context'
import { axios } from '../../api';
import { useMutation } from 'react-query';
import { enqueueSnackbar } from 'notistack';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router';


const errorMessagesLogin = {
  400: 'Email e senha são obrigatórios.',
  404: 'Usuário não encontrado.',
  401: 'Email ou senha incorretos.',
  500: 'Erro no servidor. Tente novamente mais tarde.',
};

const errorMessagesRegister = {
  400: 'Todos os campos obrigatórios devem ser preenchidos.',
  409: 'Este email já está em uso.',
  500: 'Erro no servidor. Tente novamente mais tarde.',
}

export default function useAuth() {
  const { user, setUser, clienteId, setClienteId } = useContext(AuthContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleErrorLogin = (err) => {
    if (!err?.response) {
      return 'Sem resposta do servidor.';
    }

    return errorMessagesLogin[err?.status] || 'Erro desconhecido. Tente novamente mais tarde.';
  };
  
  const login = async({email, password}) => {
    const response = await axios.post('/login/', {
      username: email,
      password,
    });
    return response;
  };

  
  const { mutate: mutateLogin, isLoading: isLoadingLogin, error: errorLogin, isError: isErrorLogin } = useMutation(login,
    {
      onSuccess: (data) => {
        const decoded = jwtDecode(data?.data?.access);
        const token = data?.data?.access;

        window.localStorage.setItem('token', token);
        setUser({ token, nome: decoded?.nome, admin: decoded?.admin });
        
        const redirectPath = state?.redirect || '/dashboard';
        navigate(redirectPath, { replace: true });
      },
      onError: (error) => {
        const errMsg = handleErrorLogin(error);
        enqueueSnackbar(errMsg, {
          variant: 'error'
        });
        
      },
    }
  );
  
  const errorMsgLogin = useMemo(() => errorMessagesLogin[errorLogin?.status], [errorLogin?.status])
  
  const registerBasics = async ({ nome, telefone, cpf, empresa, razaoSocial, cnpj, ie, nomeFantasia, filial }) => {
    const payload = empresa
    ? { empresa, razaoSocial, cnpj, ie, nomeFantasia, filial }
    : { nome, telefone, cpf, };

    const response = await axios.post('/register/basics/', payload);
    setClienteId(response?.data);
    return response;
  }

  const { mutate: registerBasicsMutation, isLoading: isLoadingRegisterBasics} = useMutation(registerBasics,
    {
      onSuccess: (data) => {
        window.localStorage.setItem('clienteId', clienteId);
      },
      onError: (error) => {
        console.error('Register Basics Error:', error);
        if (!err?.response) {
          return { error: 'Sem resposta do server' };
        }
      },
    }
  );
  const registerLocation = async ({ uf, cidade, bairro, logradouro, numero, cep }) => {
      const payload = { clienteId, uf, cidade, bairro, logradouro, numero, cep };
      const response = await axios.post('/register/location/', payload);
      return response;
  };

  const { mutate: registerLocationMutation, isLoading: isLoadingRegisterLocation } = useMutation(registerLocation,
    {
      onError: (error) => {
        console.error('Register Location Error:', error);
        if (!err?.response) {
          return { error: 'Sem resposta do server' };
        }
      },
    }
  );


  const registerAuth = async ({ password, email }) => {
    const payload = { clienteId, password, username: email };
    const response = await axios.post('/register/auth/', payload);
    return response;
  };

  const { mutate:registerAuthMutation, isLoading: isLoadingRegisterAuth} = useMutation(registerAuth,
    {
      onError: (error) => {
        console.error('Register Auth Error:', error);
      },
    }
  );

  const logout = () => {
    window.localStorage.removeItem('token');
    setUser(null);
  };

  return { 
    user,
    logout, 
    mutateLogin,
    errorLogin,
    isErrorLogin,
    isLoadingLogin, 
    registerBasicsMutation, 
    isLoadingRegisterBasics, 
    registerLocationMutation,
    isLoadingRegisterLocation,
    registerAuthMutation,
    isLoadingRegisterAuth,
    errorMsgLogin,
  };
};
