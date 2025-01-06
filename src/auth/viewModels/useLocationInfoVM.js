import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import useCEP from '../hooks/useCEP';

function useLocationInfoVM() {
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const { registerLocation, loading } = useAuth();
  const form = useForm({
    defaultValues: {
      CEP: "",
      rua: "",
      numero: 0,
      bairro: "",
      cidade: "",
      estado: "",
      complemento: "",
    }
  })

  const control = form?.control && form?.control;

  const {
    CEP,
    rua,
    numero,
    bairro,
    cidade,
    estado,
    complemento
  } = useWatch({ control: form.control })

  const { isValid, ...cepInfo } = useCEP(CEP, form);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerLocation({
      uf: cepInfo?.estado || estado,
      cidade: cepInfo?.cidade || cidade,
      bairro: cepInfo?.bairro || bairro,
      logradouro: cepInfo?.rua || rua,
      numero,
      cep: cepInfo?.cep || CEP,
      complemento,
    });
    if (response?.status !== 201) {
      setError({ ...response?.response?.data })
      return null
    };
    return navigate('/register/auth');
  };

  const erros = !!error && Object.keys(error);

  return {
    handleSubmit,
    isValid,
    form,
    erros,
    loading,
    control,
    error,
    setError,
  }
}

export default useLocationInfoVM;