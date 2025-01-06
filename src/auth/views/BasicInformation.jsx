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
    erros,
    loading,
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
    razaoSocial,
    IE,
    CPF,
    nome,
    telefone,
    nomeFantasia,
    filial,
    error
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mb: 4 }}>
        <FormLabel id="pessoa">Quero criar minha conta como: </FormLabel>
        <RadioGroup row aria-labelledby="pessoa">
          <FormControlLabel
            value="E"
            control={<Radio checked={tipo === 'E'} onChange={(e) => setTipo(e.target.checked ? 'E' : 'P')} />}
            label="Pessoa jurídica"
          />
          <FormControlLabel
            value="P"
            control={<Radio checked={tipo === 'P'} onChange={(e) => setTipo(e.target.checked ? 'P' : 'E')} />}
            label="Pessoa física"
          />
        </RadioGroup>
      </FormControl>

      {tipo === 'E' && (
        <FormControl sx={{ width: '100%', gap: 3, mb: 4 }}>
          <TextField
            fullWidth
            required
            helperText={(!cnpjValido || CNPJ?.length > 18) && 'Por favor, digite um CNPJ válido'}
            error={!cnpjValido && CNPJ?.length > 18}
            name="CNPJ"
            label="CNPJ"
            placeholder="Digite o CNPJ da empresa"
            value={cnpjFormatado || CNPJ}
            onChange={(e) => {
              setCNPJ(e.target.value);
            }}
          />
          {cnpjValido && (
            <>
              <TextField
                fullWidth
                required
                name="razaoSocial"
                label="Razão Social"
                value={razaoSocial}
                onChange={(e) => {
                  setRazaoSocial(e.target.value);
                }}
              />
              <Grid container spacing={1}>
                <Grid item sm={4} xs={12}>
                  <TextField
                    fullWidth
                    name="IE"
                    label="Inscrição Estadual"
                    value={IE}
                    onChange={(e) => {
                      setIE(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextField
                    fullWidth
                    name="nomeFantasia"
                    label="Nome Fantasia"
                    value={nomeFantasia}
                    onChange={(e) => {
                      setNomeFantasia(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextField
                    fullWidth
                    name="filial"
                    label="Filial"
                    value={filial}
                    onChange={(e) => {
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
            error={!cpfValido && CPF?.length >= 11}
            name="CPF"
            label="CPF"
            placeholder="Digite o seu CPF"
            value={cpfFormatado || CPF}
            onChange={(e) => {
              if (error) {
                setError(null);
              }
              setCPF(e.target.value);
            }}
          />
          {cpfValido && (
            <>
              <TextField
                fullWidth
                name="nome"
                label="Nome"
                value={nome}
                onChange={(e) => {
                  if (error) {
                    setError(null);
                  }
                  setNome(e.target.value);
                }}
              />
              <TextField
                fullWidth
                name="telefone"
                label="Telefone"
                value={telefone}
                onChange={(e) => {
                  if (error) {
                    setError(null);
                  }
                  setTelefone(e.target.value);
                }}
              />
            </>
          )}
        </FormControl>
      )}
      {!!erros?.length && erros?.map((key, i) => (<Alert key={key + i} severity="error">{`${error[key]}: ${key}`}</Alert>))}

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
          loading={loading}
          sx={{ maxWidth: '45%' }}
          type="submit"
          fullWidth
          size="large"
          variant="contained"
          onClick={handleSubmit}
        >
          Continuar
        </LoadingButton>
      </Box>
    </form>
  );
}
