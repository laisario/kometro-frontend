import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useEffect } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Row from '../../components/Row';

function Form(props) {
  const { 
    open, 
    handleClose, 
    create, 
    isMobile, 
    calibration, 
    mutate,
    form,
    isLoadingCreation,
    error,
    setError
  } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          const params = {form: form?.watch()}
          if (!create) {
            params.id = calibration?.id
          }
          form?.handleSubmit(() => mutate(params))();
        },
      }}
    >
      <DialogTitle>{create ? "Criar nova calibração" : "Editar calibração"}</DialogTitle>
      <DialogContent>
        <Row isMobile={isMobile}>
          <TextField
            id="ordemDeServico"
            label="Ordem de serviço"
            sx={{ width: isMobile ? '100%' : '50%' }}
            {...form?.register("ordemDeServico", {
              onChange: (e) => {if (error?.ordem_de_servico) setError({})},
            })}
            error={!!error?.ordem_de_servico}
            helperText={!!error?.ordem_de_servico && error?.ordem_de_servico}
          />
          <TextField
            autoFocus
            id="local"
            label="Local"
            sx={{ width: isMobile ? '100%' : '50%' }}
            {...form?.register("local", {
              onChange: (e) => {if (error?.local) setError({})},
            })}
            error={!!error?.local}
            helperText={!!error?.local && error?.local}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <DatePicker
              label="Última calibração"
              {...form?.register("data")}
              value={form?.watch('data') ? dayjs(form?.watch('data')) : null}
              onChange={newValue => form?.setValue("data", newValue)}
              sx={{ width: isMobile ? '100%' : '50%' }}
            />
          </LocalizationProvider>
        </Row>
        <Row>
          <TextField
            autoFocus
            id="maiorErro"
            label="Maior erro"
            fullWidth
            {...form?.register("maiorErro", {
              onChange: (e) => {if (error?.maior_erro) setError({})},
            })}
            error={!!error?.maior_erro}
            helperText={!!error?.maior_erro && error?.maior_erro}
          />
          <TextField
            autoFocus
            id="incerteza"
            label="Incerteza"
            fullWidth
            {...form?.register("incerteza", {
              onChange: (e) => {if (error?.incerteza) setError({})},
            })}
            error={!!error?.incerteza}
            helperText={!!error?.incerteza && error?.incerteza}
          />
          {!isMobile && (
            <TextField
              autoFocus
              id="criterioDeAceitacao"
              label="Critério de aceitação"
              fullWidth
              {...form?.register("criterioDeAceitacao", {
                onChange: (e) => {if (error?.criterio_de_aceitacao) setError({})},
              })}
              error={!!error?.criterio_de_aceitacao}
              helperText={!!error?.criterio_de_aceitacao && error?.criterio_de_aceitacao}
            />
          )}
        </Row>
        <Row>
          {isMobile && (
            <TextField
              autoFocus
              id="criterioDeAceitacao"
              label="Critério de aceitação"
              fullWidth
              {...form?.register("criterioDeAceitacao", {
                onChange: (e) => {if (error?.criterio_de_aceitacao) setError({})},
              })}
              error={!!error?.criterio_de_aceitacao}
              helperText={!!error?.criterio_de_aceitacao && error?.criterio_de_aceitacao}
            />
          )}
          <TextField
            autoFocus
            id="referenciaCriterioDeAceitacao"
            label="Referência critério de aceitação"
            fullWidth
            {...form?.register("referenciaDoCriterio", {
              onChange: (e) => {if (error?.referencia_do_criterio) setError({})},
            })}
            error={!!error?.referencia_do_criterio}
            helperText={!!error?.referencia_do_criterio && error?.referencia_do_criterio}
          />
        </Row>
        <TextField
          autoFocus
          id="observacoes"
          label="Observações"
          fullWidth
          multiline
          rows={1}
          {...form?.register("observacoes", {
            onChange: (e) => {if (error?.observacoes) setError({})},
          })}
          error={!!error?.observacoes}
          helperText={!!error?.observacoes && error?.observacoes}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" type="submit">{isLoadingCreation ? <CircularProgress /> : create ? 'Salvar' : 'Editar'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default Form