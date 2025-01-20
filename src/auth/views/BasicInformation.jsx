import { Link, Box, TextField, Typography, Alert, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Radio from '@mui/material/Radio';
import { Link as RouterLink } from 'react-router';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Iconify from '../../components/Iconify';

export default function BasicInformation(props) {
  const {
    handleSubmit,
    tipo,
    CNPJ,
    setTipo,
    setCNPJ,
    setRazaoSocial,
    setIE,
    setNomeFantasia,
    setFilial,
    setCPF,
    setNome,
    setTelefone,
    cnpjFormatado,
    cnpjValido,
    cpfValido,
    cpfFormatado,
    razaoSocial,
    IE,
    CPF,
    nome,
    telefone,
    nomeFantasia,
    filial,
    error,
    setError,
    verifyError
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mb: 4 }}>
        <FormLabel id="pessoa">Quero criar minha conta como: </FormLabel>
        <RadioGroup row aria-labelledby="pessoa">
          <FormControlLabel
            value="E"
            control={<Radio checked={tipo === 'E'} 
            onChange={(e) => setTipo(e.target.checked ? 'E' : 'P')} />}
            label="Pessoa jurídica"
          />
          <FormControlLabel
            value="P"
            control={<Radio checked={tipo === 'P'}
            onChange={(e) => setTipo(e.target.checked ? 'P' : 'E')} />}
            label="Pessoa física"
          />
        </RadioGroup>
      </FormControl>

      {tipo === 'E' && (
        <FormControl sx={{ width: '100%', gap: 3, mb: 4 }}>
          <TextField
            fullWidth
            helperText={((!cnpjValido || CNPJ?.length > 18) && 'Por favor, digite um CNPJ válido') || (!!error['cnpj']?.length && error['cnpj'][0]) }
            error={(!cnpjValido && CNPJ?.length > 18) || !!error['cnpj']?.length}
            name="CNPJ"
            label="CNPJ"
            placeholder="Digite o CNPJ da empresa"
            value={cnpjFormatado || CNPJ}
            onChange={(e) => {
              verifyError('cnpj', error, setError)
              setCNPJ(e.target.value);
            }}
          />
          {cnpjValido && (
            <>
              <TextField
                fullWidth
                helperText={!!error['razaoSocial']?.length && error['razaoSocial'][0]}
                error={!!error['razaoSocial']?.length}
                name="razaoSocial"
                label="Razão Social"
                value={razaoSocial}
                onChange={(e) => {
                  verifyError('razaoSocial', error, setError)
                  setRazaoSocial(e.target.value);
                }}
              />
              <Grid container spacing={1}>
                <Grid item sm={4} xs={12}>
                  <TextField
                    fullWidth
                    name="IE"
                    helperText={!!error['ie']?.length && error['ie'][0]}
                    error={!!error['ie']?.length}
                    label="Inscrição Estadual"
                    value={IE}
                    onChange={(e) => {
                      verifyError('ie', error, setError)
                      setIE(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextField
                    fullWidth
                    name="nomeFantasia"
                    error={!!error['nomeFantasia']?.length}
                    helperText={!!error['nomeFantasia']?.length && error['nomeFantasia'][0]}
                    label="Nome Fantasia"
                    value={nomeFantasia}
                    onChange={(e) => {
                      verifyError('nomeFantasia', error, setError)
                      setNomeFantasia(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextField
                    fullWidth
                    name="filial"
                    helperText={!!error['filial']?.length && error['filial'][0]}
                    error={!!error['filial']?.length}
                    label="Filial"
                    value={filial}
                    onChange={(e) => {
                      verifyError('filial', error, setError)
                      setFilial(e.target.value);
                    }}
                  />

                </Grid>
              </Grid>
            </>
          )}
        </FormControl>
      )}

      {tipo === 'P' && (
        <FormControl sx={{ width: '100%', gap: 3, mb: 4 }}>
          <TextField
            fullWidth
            error={(!cpfValido && CPF?.length >= 11) || !!error['cpf']?.length}
            helperText={((!cpfValido) && 'Por favor, digite um CPF válido') || (!!error['cpf']?.length && error['cpf'][0])}
            name="CPF"
            label="CPF"
            placeholder="Digite o seu CPF"
            value={cpfFormatado || CPF}
            onChange={(e) => {
              verifyError('cpf', error, setError)
              setCPF(e.target.value);
            }}
          />
          {cpfValido && (
            <>
              <TextField
                fullWidth
                name="nome"
                label="Nome"
                error={!!error['nome']?.length}
                helperText={!!error['nome']?.length && error['nome'][0]}
                value={nome}
                onChange={(e) => {
                  verifyError('nome', error, setError)
                  setNome(e.target.value);
                }}
              />
              <TextField
                fullWidth
                name="telefone"
                error={!!error['telefone']?.length}
                helperText={!!error['telefone']?.length && error['telefone'][0]}
                label="Telefone"
                value={telefone}
                onChange={(e) => {
                  verifyError('telefone', error, setError)
                  setTelefone(e.target.value);
                }}
              />
            </>
          )}
        </FormControl>
      )}

      <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
        <Typography variant="body2">
          Já tem uma conta? {''}
          <Link
            to="/login"
            component={RouterLink}
            variant="subtitle2"
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            Entrar
          </Link>
        </Typography>
        <LoadingButton
          endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
          sx={{ maxWidth: '45%' }}
          type="submit"
          fullWidth
          size="large"
          variant="contained"
        >
          Continuar
        </LoadingButton>
      </Box>
    </form>
  );
}
