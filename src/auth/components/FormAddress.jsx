/* eslint-disable react/prop-types */
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { useWatch } from 'react-hook-form';

const estados = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MS',
  'MT',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

function FormAdress({ form, control, isValid }) {
  const {
    estado,
  } = useWatch({ control: control })
  return (
    <FormControl sx={{ width: '100%', gap: 3, mb: 4 }}>
      <TextField
        fullWidth
        name="CEP"

        required
        label="CEP"
        placeholder="Digite o CEP da sua região"
        {...form.register("CEP", { minLength: 8 })}
      />
      {isValid && (
        <>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              name="rua"
              label="Logradouro"
              required
              InputLabelProps={{
                shrink: true
              }}
              {...form.register("rua")}
            />
            <TextField
              fullWidth
              name="complemento"
              label="complemento"
          
              {...form.register("complemento")}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <TextField
                fullWidth
                name="numero"
                label="Número"
                type='number'
                required
                {...form.register("numero")}
              />
            </FormControl>
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              name="bairro"
              label="Bairro"
              required
              InputLabelProps={{
                shrink: true
              }}
              {...form.register("bairro")}
            />
            <TextField
              fullWidth
              name="cidade"
              label="Cidade"
              required
              InputLabelProps={{
                shrink: true
              }}
              {...form.register("cidade")}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="label">Estado</InputLabel>
              <Select
                labelId="label"
                required
                label="Estado"
                InputLabelProps={{
                  shrink: true
                }}
                {...form.register("estado")}
                value={estado}
              >
                {estados.map((sigla) => (
                  <MenuItem key={sigla} value={sigla}>
                    {sigla}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </>
      )}
    </FormControl>
  );
}

export default FormAdress;
