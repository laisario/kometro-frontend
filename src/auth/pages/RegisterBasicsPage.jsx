import { Helmet } from 'react-helmet-async';
import { Container, Typography } from '@mui/material';
import BasicInformation from '../views/BasicInformation';
import useBasicInfoVM from '../viewModels/useBasicInfoVM';


export default function RegisterBasicsPage() {
  const {
    handleSubmit,
    CNPJ,
    tipo,
    razaoSocial,
    IE,
    CPF,
    nome,
    telefone,
    erros,
    nomeFantasia,
    filial,
    setTipo,
    setCNPJ,
    setRazaoSocial,
    setIE,
    setNomeFantasia,
    setFilial,
    setCPF,
    setNome,
    setTelefone,
    setError,
    cnpjFormatado,
    cnpjValido,
    cpfValido,
    cpfFormatado,
    error,
    shouldDisableButton,
  } = useBasicInfoVM()
  return (
    <>
      <Helmet>
        <title> Criar conta | Kometro </title>
      </Helmet>

      <Container maxWidth="sm">
        <Typography variant="h3" gutterBottom>
          Criar conta
        </Typography>

        <Typography variant="body2" sx={{ mb: 5 }}>
          Calibre seus instrumentos conosco
        </Typography>

        <BasicInformation
          handleSubmit={handleSubmit}
          tipo={tipo}
          erros={erros}
          setTipo={setTipo}
          setCNPJ={setCNPJ}
          setRazaoSocial={setRazaoSocial}
          setIE={setIE}
          setNomeFantasia={setNomeFantasia}
          setFilial={setFilial}
          setCPF={setCPF}
          setNome={setNome}
          setTelefone={setTelefone}
          setError={setError}
          cnpjFormatado={cnpjFormatado}
          cnpjValido={cnpjValido}
          cpfValido={cpfValido}
          cpfFormatado={cpfFormatado}
          CNPJ={CNPJ}
          razaoSocial={razaoSocial}
          IE={IE}
          CPF={CPF}
          nome={nome}
          telefone={telefone}
          nomeFantasia={nomeFantasia}
          filial={filial}
          error={error}
          shouldDisableButton={shouldDisableButton}
        />
      </Container>
    </>
  );
}
