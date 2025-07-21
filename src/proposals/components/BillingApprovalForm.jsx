import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react'
import { useForm, useWatch } from 'react-hook-form';
import Iconify from '../../components/Iconify';

function BillingApprovalForm({ open, onClose, isMobile, approveBilling }) {
  const form = useForm({
    defaultValues: {
      realizado: false,
      dataLiberacaoFaturamento: new Date().toISOString().slice(0, 16),
      nfEntrada: '',
      nf: '',
      observacao: '',
      usuarioLiberouFaturamento: '',
    }
  });

  const {
    dataLiberacao
  } = useWatch({ control: form.control })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Liberar para Faturamento</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <FormControlLabel
            control={<Checkbox {...form.register("realizado")} />}
            label="Realizado"
          />
          <Stack direction={isMobile ? 'column' : "row"} gap={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
              <DatePicker
                label="Data de liberaração"
                {...form.register("dataLiberacaoFaturamento")}
                value={dataLiberacao? dayjs(dataLiberacao) : null}
                onChange={newValue => form.setValue("dataLiberacao", newValue)}
                sx={{ width: isMobile ? '100%' : '40%' }}
              />
            </LocalizationProvider>
            <TextField
              label="Usuário que liberou"
              sx={{ width: isMobile ? '100%' : '60%' }}
              {...form.register("usuarioLiberouFaturamento")}
            />
          </Stack>

          <Stack direction={isMobile ? 'column' : "row"} gap={2}>
            <TextField
              label="Nota Fiscal de Entrada"
              sx={{ width: isMobile ? '100%' : '50%' }}
              {...form.register("nfEntrada")}
            />
            <TextField
              label="Nota Fiscal"
              sx={{ width: isMobile ? '100%' : '50%' }}
              {...form.register("nf")}
            />

          </Stack>

          <TextField
            label="Observação"
            multiline
            rows={isMobile? 2 : 1}
            fullWidth
            {...form.register("observacao")}
          />
       
        </Box>
      </DialogContent>
      <DialogActions>
        <Box  width="100%"  display="flex" alignItems="center" justifyContent="space-between">
          <Button onClick={onClose} color="secondary">Cancelar</Button>
          <Button 
            endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />} 
            onClick={form.handleSubmit((data) => {approveBilling(data); form.reset();  onClose()})} 
            variant="contained" 
            color="primary"
          >
            Salvar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default BillingApprovalForm