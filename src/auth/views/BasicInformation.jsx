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
              verifyError('cnpj')
              setCNPJ(e.target.value);
            }}
          />
          {cnpjValido && (
            <>
              <TextField
                fullWidth
                helperText={!!error['razao_social']?.length && error['razao_social'][0]}
                error={!!error['razao_social']?.length}
                name="razaoSocial"
                label="Razão Social"
                value={razaoSocial}
                onChange={(e) => {
                  verifyError('razao_social')
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
                      verifyError('ie')
                      setIE(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextField
                    fullWidth
                    name="nomeFantasia"
                    error={!!error['nome_fantasia']?.length}
                    helperText={!!error['nome_fantasia']?.length && error['nome_fantasia'][0]}
                    label="Nome Fantasia"
                    value={nomeFantasia}
                    onChange={(e) => {
                      verifyError('nome_fantasia')
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
                      verifyError('filial')
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
              verifyError('cpf')
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
                  verifyError('nome')
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
                  verifyError('telefone')
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
          // disabled={!shouldDisableButton()}
        >
          Continuar
        </LoadingButton>
      </Box>
    </form>
  );
}
