import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Box,
  Chip,
  List
} from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';

export default function SendEmailForm({ open, onClose, clienteEmail, sendProposalToEmail }) {
  const form = useForm({
    defaultValues: {
      enviarParaCadastrado: true,
      outrosEmails: []
    }
  });
  const [emailInput, setEmailInput] = useState('');
  
  const {
    outrosEmails,
  } = useWatch({ control: form.control })

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (email && validateEmail(email) && !outrosEmails.includes(email)) {
      const currentValues = form.getValues('outrosEmails') || [];
      form.setValue('outrosEmails', [...currentValues, emailInput]);
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (indexToRemove) => {
    const currentValues = form.getValues('outrosEmails');
    const newValues = currentValues?.filter((_, index) => index !== indexToRemove);
    form.setValue('outrosEmails', newValues);
  };

  const handleClose = () => {
    form.reset();
    setEmailInput('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={form.handleSubmit((data) => {sendProposalToEmail(data); handleClose()})}>
        <DialogTitle>Enviar Proposta por E-mail</DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                {...form.register('enviarParaCadastrado')}
                defaultChecked
              />
            }
            label={
              <Box display="flex" flexDirection="column">
                <span>Enviar para e-mail cadastrado</span>
                <Typography variant="caption" color="text.secondary">
                  {clienteEmail}
                </Typography>
              </Box>
            }
          />

          <Typography sx={{ mt: 2, mb: 1 }}>Enviar para outro(s) e-mail(s):</Typography>

          <Box display="flex" flexDirection="column" width="100%">
            <Box display="flex" flexDirection="row" gap={2}>
              <TextField
                label="E-mail"
                variant="outlined"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                size="small"
                fullWidth
              />
              <Button onClick={handleAddEmail}>
                Adicionar
              </Button>
            </Box>

            <List sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {outrosEmails.map((email, index) => (
                <Chip
                  key={index}
                  label={email}
                  onDelete={() => handleRemoveEmail(index)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </List>
          </Box>
        </DialogContent>

        <DialogActions>
            <Box  width="100%"  display="flex" alignItems="center" justifyContent="space-between">
              <Button onClick={handleClose} color="secondary">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Enviar
          </Button>
            </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function validateEmail(email) {
  // Validação simples de e-mail
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
