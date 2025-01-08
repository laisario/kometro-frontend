import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import useCEP from '../hooks/useCEP';

function useLocationInfoVM() {
  const [error, setError] = useState({});
  const { registerLocationMutation, loading } = useAuth();
  const form = useForm({
    defaultValues: {
      CEP: "",
      rua: "",
      numero: "",
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
    registerLocationMutation({
      uf: cepInfo?.estado || estado,
      cidade: cepInfo?.cidade || cidade,
      bairro: cepInfo?.bairro || bairro,
      logradouro: cepInfo?.rua || rua,
      numero,
      cep: cepInfo?.cep || CEP,
      complemento,
    });
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