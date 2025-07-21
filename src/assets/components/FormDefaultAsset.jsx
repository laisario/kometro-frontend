import React from 'react';
import {
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  DialogTitle,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import useDefaultAssetMutations from '../hooks/useDefaultAssetMutations';

function FormDefaultAsset({open, onClose, setInstrumentoSelecionado}) {
  const form = useForm({ defaultValues: {
    descricao: '',
    modelo: '',
    fabricante: '',
    procedimentoRelacionado: '',
    tipoDeServico: "",
    minimo: null,
    maximo: null,
    unidade: '',
    resolucao: null,
    tipoSinal: '',
    capacidadeMedicao: null,
    unidadeCapacidade: '',
  }});
  const { mutateCreateDefaultAsset, errorDefaultAsset, setError } = useDefaultAssetMutations(onClose, form, setInstrumentoSelecionado)

  const onSubmit = (data) => {
    mutateCreateDefaultAsset(data)
  }

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>Cadastrar Novo Instrumento</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ mt: 1 }}
          label="Descrição"
          fullWidth
          required
          {...form.register("descricao", {
            onChange: () => {
              if (errorDefaultAsset?.descricao) setError({});
            },
          })}
          error={!!errorDefaultAsset?.descricao}
          helperText={!!errorDefaultAsset?.descricao && errorDefaultAsset?.descricao[0]}
        />

        <Stack direction='row' gap={2} my={2}>
          <TextField label="Modelo" fullWidth {...form.register("modelo")} />
          <TextField label="Fabricante" fullWidth {...form.register("fabricante")} />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
          <TextField label="Procedimento Relacionado" fullWidth {...form.register("procedimentoRelacionado")} />
          <TextField
            label="Tipo de Serviço"
            select
            fullWidth
            defaultValue=""
            {...form.register("tipoDeServico", {
              onChange: () => {
                if (errorDefaultAsset?.tipo_de_servico) setError({});
              }
            })}
            error={!!errorDefaultAsset?.tipo_de_servico}
            helperText={!!errorDefaultAsset?.tipo_de_servico && errorDefaultAsset?.tipo_de_servico[0]}
          >
            <MenuItem value="A">Acreditado</MenuItem>
            <MenuItem value="NA">Não Acreditado</MenuItem>
            <MenuItem value="I">Interna</MenuItem>
          </TextField>
        </Stack>

        <Typography variant="subtitle1" mt={3} mb={2}>Característica Metrológica</Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
          <TextField
            label="Valor Mínimo"
            type="number"
            inputProps={{ step: "any" }}
            fullWidth
            {...form.register("minimo", {
              onChange: () => {
                if (errorDefaultAsset?.minimo) setError({});
              },
            })}
            error={!!errorDefaultAsset?.minimo}
            helperText={!!errorDefaultAsset?.minimo && errorDefaultAsset?.minimo[0]}
          />

          <TextField
            label="Valor Máximo"
            type="number"
            inputProps={{ step: "any" }}
            fullWidth
            {...form.register("maximo", {
              onChange: () => {
                if (errorDefaultAsset?.maximo) setError({});
              },
            })}
            error={!!errorDefaultAsset?.maximo}
            helperText={!!errorDefaultAsset?.maximo && errorDefaultAsset?.maximo[0]}
          />

          <TextField
            label="Unidade"
            fullWidth
            {...form.register("unidade", {
              onChange: () => {
                if (errorDefaultAsset?.unidade) setError({});
              },
            })}
            error={!!errorDefaultAsset?.unidade}
            helperText={!!errorDefaultAsset?.unidade && errorDefaultAsset?.unidade[0]}
          />
        </Stack>

        <Stack direction='row' gap={2} mb={2}>
          <TextField
            label="Resolução"
            type="number"
            inputProps={{ step: "any" }}
            fullWidth
            {...form.register("resolucao")}
          />
          <TextField
            label="Tipo de Sinal"
            select
            fullWidth
            defaultValue=""
            {...form.register("tipoSinal", {
              onChange: () => {
                if (errorDefaultAsset?.tipo_sinal) setError({});
              }
            })}
            error={!!errorDefaultAsset?.tipo_sinal}
            helperText={!!errorDefaultAsset?.tipo_sinal && errorDefaultAsset?.tipo_sinal[0]}
          >
            <MenuItem value="A">Analógico</MenuItem>
            <MenuItem value="D">Digital</MenuItem>
          </TextField>
        </Stack>

        <Typography variant="subtitle1" mt={3} mb={2}>Capacidade de Medição</Typography>

        <Stack direction='row' gap={2}>
          <TextField
            label="Capacidade"
            type="number"
            inputProps={{ step: "any" }}
            fullWidth
            {...form.register("capacidadeMedicao")}
          />
          <TextField
            label="Unidade"
            fullWidth
            {...form.register("unidadeCapacidade")}
          />
        </Stack>
      </DialogContent>
    
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => {form.handleSubmit(onSubmit)();}} variant="contained">Criar Instrumento</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FormDefaultAsset