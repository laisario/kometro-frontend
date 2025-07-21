import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  Select,
  TextField,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Paper,
  Link,
  CircularProgress,
  Stack,
  InputAdornment,
  DialogTitle,
  DialogActions
} from '@mui/material';
import 'dayjs/locale/pt-br';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, useWatch } from 'react-hook-form';
import dayjs from 'dayjs';
import { axiosForFiles } from '../../api';
import Iconify from '../../components/Iconify';
import FormAdress from '../../auth/components/FormAddress';
import { truncateString } from '../../utils/formatString';
import useUsers from '../../auth/hooks/useUsers';


function FormElaborate(props) {
  const { 
    data, 
    open, 
    setElaborate, 
    elaborateProposal,
    isLoadingElaborateProposal,
  } = props;
  const [anexos, setAnexos] = useState([])
  const [loadingAnexo, setLoadingAnexo] = useState(false)
  const totalOriginal = data?.total || 0;
  const [totalComDesconto, setTotalComDesconto] = useState(data?.totalComDesconto);

  const defaultValues = useMemo(() => ({
    numeroProposta: data?.numero || '',
    transporte: data?.transporte || '',
    condicaoDePagamento: data?.condicaoDePagamento,
    enderecoDeEntrega: "enderecoCadastrado" || '',
    validade: data?.validade || null,
    prazoDePagamento: data?.prazoDePagamento || null,
    responsavel: data?.responsavel?.id || null,
    diasUteis: data?.diasUteis || null,
    CEP: data?.enderecoDeEntrega?.cep || "",
    rua: data?.enderecoDeEntrega?.logradouro || "",
    numero: data?.enderecoDeEntrega?.numero || "",
    bairro: data?.enderecoDeEntrega?.bairro?.nome || "",
    cidade: data?.enderecoDeEntrega?.bairro?.cidade || "",
    estado: data?.enderecoDeEntrega?.estado || "",
    complemento: data?.enderecoDeEntrega?.complemento || "",
    total: totalOriginal,
    descontoPercentual: Number(data?.descontoPercentual).toFixed(0) || 0
  }), [data])

  const form = useForm({ defaultValues });

  useEffect(() => {
    form?.reset(defaultValues)
  }, [defaultValues])
  
  const {
    enderecoDeEntrega,
    validade,
    responsavel,
  } = useWatch({ control: form.control })
  
  const { users } = useUsers();
  
  const ref = useRef(null)

  const handleChangeAnexo = (event) => {
    if (!event.target.files.length) return
    Array.from(event.target.files).forEach(async file => {
      const formData = new FormData()
      formData.append('anexo', file)
      setLoadingAnexo(true)
      const { data: anexo, status } = await axiosForFiles.patch(`/propostas/${data?.id}/anexar/`, formData)
      setLoadingAnexo(false)
      if (status === 201) {
        setAnexos((oldAnexos) => ([...oldAnexos, anexo]))
      }
    })
  }

  const handleRemoveAttachment = async (anexo) => {
    const attachmentToRemove = anexos?.find(att => att.id === anexo?.id)
    const formData = new FormData()
    formData.append('anexo', attachmentToRemove?.id)
    setLoadingAnexo(true)
    const { status } = await axiosForFiles.patch(`/propostas/${data?.id}/desanexar/`, formData)
    setLoadingAnexo(false)
    if (status === 200) {
      setAnexos((oldAnexos) => oldAnexos?.filter((an) => an?.id !== anexo?.id))
    }
  }

  const handleClose = () => {
    setElaborate(false)
    form.reset()
    setLoadingAnexo(false)
  }

  useEffect(() => {
    setAnexos(data?.anexos?.map((anexo) => anexo))
  }, [])

  const descontoPercentual = form.watch("descontoPercentual")

  const handleCalcularDesconto = () => {
    const descontoFloat = parseFloat(descontoPercentual);
    const totalComDesconto =
      !isNaN(descontoFloat) && descontoFloat >= 0 && descontoFloat <= 100
        ? (totalOriginal * (1 - descontoFloat / 100)).toFixed(2)
        : totalOriginal;
    setTotalComDesconto(totalComDesconto)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Elaboração da proposta</DialogTitle>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DialogContent>
        <Box sx={{ mb: 2 }}>
            <Typography>Anexos</Typography>
            <Box display="flex" gap={2} flexWrap="nowrap" overflow="auto" flexShrink={0}>
              <Paper onClick={() => ref?.current?.click()} sx={{ cursor: 'pointer', display: 'flex', flexShrink: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 100, width: 100 }} elevation={4}>
                {loadingAnexo ? <CircularProgress /> : <Typography color="gray" fontSize={72} lineHeight={0.75} mb={0} fontWeight={300}>+</Typography>}
                <Typography color="gray" variant='caption'>Novo anexo</Typography>
                <input
                  style={{ display: 'none' }}
                  id="upload-btn"
                  name="anexos"
                  type="file"
                  ref={ref}
                  onChange={handleChangeAnexo}
                />
              </Paper>
              {anexos?.map((anexo, i) => <Paper key={i + 1} sx={{ textDecoration: "none", display: 'flex', flexShrink: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 100, width: 100 }} elevation={4}>
                <Link href={anexo?.anexo} target="_blank" rel='noreferrer' style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <DescriptionIcon color='gray' fontSize="large" />
                  <Typography color="gray" variant='caption'>{truncateString(new URL(anexo?.anexo).pathname?.split('/').reverse()[0], 12)}</Typography>
                </Link>
                <CloseIcon fontSize='small' color='gray' onClick={() => handleRemoveAttachment(anexo)} />
              </Paper>)}

            </Box>
          </Box>
          <Box display="flex" gap={2} sx={{ my: 2 }}>
            <TextField
              id="numero"
              label="Número"
              name="numeroProposta"
              variant="outlined"
              sx={{ width: '50%' }}
              {...form.register("numeroProposta")}
              size="small"
            />
            <TextField
              id="transporte"
              label="Transporte"
              name="transporte"
              variant="outlined"
              sx={{ width: '50%' }}
              {...form.register("transporte")}
              size="small"
            />
          </Box>
          <Box display="flex" gap={2} sx={{ my: 2 }}>
            <DatePicker
              label="Validade"
              {...form.register("validade")}
              value={validade ? dayjs(validade) : null}
              onChange={newValue => form.setValue("validade", newValue)}
              sx={{ width: '50%' }}
            />
            <TextField
              id="condicaoDePagamento"
              label="Condição de pagamento"
              name="condicaoDePagamento"
              variant="outlined"
              sx={{ width: '50%' }}
              {...form.register("condicaoDePagamento")}
            />
          </Box>
          <Box display="flex" gap={2}>
            <FormControl sx={{ width: '50%' }} size="small">
              <InputLabel id="select-responsible">Responsável</InputLabel>
              <Select
                labelId="select-responsible"
                id="select-responsible"
                name="responsavel"
                label="Responsável"
                fullWidth
                {...form.register("responsavel")}
                value={responsavel}
              >
                {users?.map((user) => <MenuItem key={user?.id} value={user?.id}>{user?.username}</MenuItem>)}
              </Select>
            </FormControl>
            {data?.showBusinessDays && (<TextField
              id="diasUteis"
              label="Dias Úteis"
              name="diasUteis"
              type="number"
              variant="outlined"
              sx={{ width: '50%' }}
              {...form.register("diasUteis")}
              size="small"
            />)}
          </Box>
          <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, my: 1 }}>
            <FormLabel id="aprovacao">Endereço de entrega: </FormLabel>
            <RadioGroup row aria-labelledby="aprovacao">
              <FormControlLabel
                value="enderecoCadastrado"
                control={
                  <Radio
                    checked={enderecoDeEntrega === 'enderecoCadastrado'}
                    {...form.register("enderecoDeEntrega")}
                  />
                }
                label="Endereço cliente cadastrado"
              />
              <FormControlLabel
                value="novoEndereco"
                control={
                  <Radio
                    checked={enderecoDeEntrega === 'novoEndereco'}
                    {...form.register("enderecoDeEntrega")}
                  />
                }
                label="Novo enderenço"
              />
            </RadioGroup>
          </FormControl>
          {enderecoDeEntrega === 'novoEndereco' && (
            <FormAdress 
              form={form} 
            />
          )}
          <Box display="flex" gap={1} >
            {+totalOriginal !== 0 && (
              <Box>
                <Stack direction="row" flexWrap={'wrap'} alignItems="center" spacing={2}>
                  <Typography>Desconto</Typography>
                  <TextField
                    placeholder="0"
                    variant="outlined"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">% de {data?.total}</InputAdornment>,
                    }}
                    size="small"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    {...form.register("descontoPercentual")}
                  />
                  <Button variant="text" size='small'  onClick={handleCalcularDesconto}>
                    Calcular Desconto
                  </Button>
                </Stack>
          
                <Stack direction="row" alignItems="center" spacing={2} mt={2}>
                  <Typography>Total:</Typography>
                  <Typography variant="subtitle1">R$ {totalComDesconto}</Typography>
                </Stack>
              </Box>
            )}
          </Box>
        </DialogContent>
      </LocalizationProvider>
      <DialogActions>
        <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
          <Button color="secondary" onClick={handleClose}>Cancelar</Button>
          {isLoadingElaborateProposal ? <CircularProgress /> : <Button
            endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
            sx={{ maxWidth: '45%' }}
            type="submit"
            fullWidth
            variant="contained"
            onClick={() => {
              form.handleSubmit((submitData) => elaborateProposal({
                addressClient: data?.cliente?.endereco?.id,
                data: submitData, 
              }))()
              handleClose()
            }}
          >
            Salvar
          </Button>}
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default FormElaborate;
