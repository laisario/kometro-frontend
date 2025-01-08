import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useCNPJ from '../hooks/useCNPJ';
import useCPF from '../hooks/useCPF';

function useBasicInfoVM() {
  const [tipo, setTipo] = useState('E');
  const [CNPJ, setCNPJ] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [IE, setIE] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [filial, setFilial] = useState('');
  const [CPF, setCPF] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [error, setError] = useState({});
  const { registerBasicsMutation } = useAuth();
  
  const erros = !!error && Object.keys(error)

  const {
    cnpj: cnpjFormatado,
    isValid: cnpjValido,
  } = useCNPJ(CNPJ);
  const { cpf: cpfFormatado, isValid: cpfValido } = useCPF(CPF);

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerBasicsMutation({
      nome,
      telefone,
      cpf: cpfFormatado || CPF,
      empresa: tipo === 'E',
      razaoSocial,
      cnpj: CNPJ,
      ie: IE || null,
      nomeFantasia: nomeFantasia || null,
      filial: filial || null,
    });
  };
  
  useEffect(() => {
    setError({})
  }, [CNPJ])

  const shouldDisableButton = () => {
    if (tipo === 'E') {
      return CNPJ && razaoSocial
    } else {
      return CPF && nome && telefone
    }
  }
  
  return {
    handleSubmit,
    CNPJ,
    razaoSocial,
    IE,
    tipo,
    CPF,
    erros,
    nome,
    telefone,
    setTipo,
    setCNPJ,
    setRazaoSocial,
    setIE,
    setNomeFantasia,
    nomeFantasia,
    filial,
    setFilial,
    setCPF,
    setNome,
    setTelefone,
    setError,
    cnpjFormatado,
    cnpjValido,
    cpfValido,
    cpfFormatado,
    nomeFantasia,
    filial,
    error,
    shouldDisableButton
  }
}

export default useBasicInfoVM