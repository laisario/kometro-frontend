import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputAdornment, InputLabel, List, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import useResponsive from '../../theme/hooks/useResponsive';
import { useForm, useWatch } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormDefaultAsset from './FormDefaultAsset';
import useNorms from '../hooks/useNorms';


function AddArrayField({ label, fieldName, form }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const currentValues = form.getValues(fieldName) || [];
    form.setValue(fieldName, [...currentValues, inputValue]);
    setInputValue('');
  };

  const handleRemove = (indexToRemove) => {
    const currentValues = form.getValues(fieldName);
    const newValues = currentValues?.filter((_, index) => index !== indexToRemove);
    form.setValue(fieldName, newValues);
  };

  const values = form.watch(fieldName) || [];

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Box display="flex" flexDirection="row" width="100%" gap={2}>
        <TextField
          label={label}
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          size="small"
          sx={{ width: '80%' }}
          helperText="Um de cada vez"
        />
        <Button onClick={handleAdd} variant="contained" size="small" sx={{ width: '20%' }}>
          Adicionar
        </Button>
      </Box>
      <List sx={{ mt: 1, overflowX: 'auto' }}>
        {values?.map((value, index) => (
          <Chip
            label={value}
            sx={{ m: 0.5 }}
            onDelete={() => handleRemove(index)}
            key={index}
          />
        ))}
      </List>
    </Box>
  );
}


const FormNorms = ({open, onClose, setNorms}) => {
  const [input, setInput] = useState('')
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <TextField
          label="Norma"
          size="small"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => {setNorms((prev) => [...prev, {nome: input, id: prev[prev.length - 1]?.id + 1}]);onClose();}}  variant="contained">Criar norma</Button>
      </DialogActions>
    </Dialog>
  )
}


const getInstrumentoLabel = (instrumento) => {
  if (!instrumento || typeof instrumento !== 'object') return '';

  const tipo = instrumento.tipoDeInstrumento || {};
  const descricao = tipo.descricao || '';
  const modelo = tipo.modelo || '';
  const fabricante = tipo.fabricante || '';
  const minimo = instrumento.minimo;
  const maximo = instrumento.maximo;
  const unidade = instrumento.unidade || '';

  let faixa = '';
  if (minimo != null && maximo != null && unidade) {
    faixa = ` (${minimo} – ${maximo} ${unidade})`;
  }

  const partes = [descricao, modelo, fabricante].filter(Boolean);
  const info = partes.join(' | ');

  return info ? `${info}${faixa}` : '';
};


function CreateInstrument(props) {
  const {
    handleClose, 
    open, 
    defaultAssets, 
    setor, 
    cliente, 
    mutate, 
    asset, 
    error,
    searchDA,
    setSearchDA,
    isFetching
  } = props;

  const [instrumentoSelecionado, setInstrumentoSelecionado] = useState(asset ? {
    descricao: !!asset?.instrumento?.tipoDeInstrumento?.descricao ? asset?.instrumento?.tipoDeInstrumento?.descricao : '',
    modelo: !!asset?.instrumento?.tipoDeInstrumento?.modelo ? asset?.instrumento?.tipoDeInstrumento?.modelo : '',
    fabricante: !!asset?.instrumento?.tipoDeInstrumento?.fabricante ? asset?.instrumento?.tipoDeInstrumento?.fabricante : '',
    procedimentoRelacionado: !!asset?.instrumento?.procedimentoRelacionado?.codigo ? asset?.instrumento?.procedimentoRelacionado?.codigo :'',
    tipoDeServico: !!asset?.instrumento?.tipoDeServico ? asset?.instrumento?.tipoDeServico : '',
    minimo:  !!asset?.instrumento?.minimo ? asset?.instrumento?.minimo : null,
    maximo:  !!asset?.instrumento?.maximo ? asset?.instrumento?.maximo : null,
    unidade:  !!asset?.instrumento?.unidade ? asset?.instrumento?.unidade : '',
    resolucao:  !!asset?.instrumento?.tipoDeInstrumento?.resolucao ? asset?.instrumento?.tipoDeInstrumento?.resolucao : null,
    tipoSinal:  !!asset?.instrumento?.tipoSinal ? asset?.instrumento?.tipoSinal : '',
    capacidadeMedicao: !!asset?.instrumento?.capacidadeDeMedicao?.valor ? asset?.instrumento?.capacidadeDeMedicao?.valor : null,
    unidadeCapacidade: !!asset?.instrumento?.capacidadeDeMedicao?.unidade ? asset?.instrumento?.capacidadeDeMedicao?.unidade : '',
  } : null);
  const [norms, setNorms] = useState(!!asset?.normativos?.length ? asset?.normativos : []);
  const [showFormNewAsset, setShowFormNewAsset] = useState(false);
  const [showFormNewNorm, setShowFormNewNorm] = useState(false);
  const [inputNorm, setInputNorm] = useState('');

  const isMobile = useResponsive('down', 'md');
  const { normas } = useNorms(cliente);

  const form = useForm({
    defaultValues: {
      tag: !!asset?.tag ? asset.tag : '',
      numeroDeSerie: !!asset?.numeroDeSerie ? asset.numeroDeSerie : '',
      classe: !!asset?.classe ? asset.classe : '',
      criterioDeAceitacao: !!asset?.criterioDeAceitacao ? Number(asset?.criterioDeAceitacao).toFixed(2) : null,
      unidade: !!asset?.unidade ? asset.unidade : '',
      referenciaDoCriterio: !!asset?.referenciaDoCriterio ? asset.referenciaDoCriterio : '',
      precoUltimaCalibracao: !!asset?.precoUltimaCalibracao ? asset.precoUltimaCalibracao : null,
      laboratorio: !!asset?.laboratorio ? asset.laboratorio : '',
      observacaoFornecedor: !!asset?.observacaoFornecedor ? asset.observacaoFornecedor : '',
      posicao: !!asset?.posicao ? asset.posicao : "I",
      observacaoStatus: !!asset?.observacaoStatus ? asset.observacaoStatus : '',
      frequenciaChecagem: {
        quantidade: !!asset?.frequenciaChecagem?.quantidade ? asset.frequenciaChecagem.quantidade : null,
        periodo: !!asset?.frequenciaChecagem?.periodo ? asset.frequenciaChecagem.periodo : 'dia',
      },
      frequenciaCalibracao: {
        quantidade: !!asset?.frequenciaCalibracao?.quantidade ? asset.frequenciaCalibracao.quantidade : null,
        periodo: !!asset?.frequenciaCalibracao?.periodo ? asset.frequenciaCalibracao.periodo : 'dia',
      },
      pontosDeCalibracao: !!asset?.pontosDeCalibracao?.length ? asset?.pontosDeCalibracao?.map((p) => p?.nome) : [],
    }
  });
  const onSubmit = (data) => {
    const payload = {
      ...data,
      cliente,
      instrumento: instrumentoSelecionado?.id,
      normativos: norms
    };

    if (!payload.frequenciaCalibracao?.quantidade) {
      delete payload.frequenciaCalibracao;
    }
  
    if (!payload.frequenciaChecagem?.quantidade) {
      delete payload.frequenciaChecagem;
    }
  
    if (asset?.id) {
      mutate({
        id: asset.id,
        setor: asset?.setor?.id,
        ...payload
      });
    } else {
      mutate({
        ...payload,
        setor: setor?.type === 'sector' ? Number(setor?.id) : Number(setor?.parentId),
      });
    }
  }
 
  return (
    <Dialog onClose={handleClose} open={open} fullScreen={isMobile}>
      <DialogTitle>{asset ? 'Editar instrumento' : 'Crie seu instrumento'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Escolha um instrumento base (obrigatório). Preencha os detalhes agora nas seções abaixo ou continue depois.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          Busque pelo nome do instrumento (ex: paquímetro, balança...)
        </Typography>
        <Autocomplete
          options={[...(defaultAssets?.results || []), 'CRIAR_NOVO']}
          multiple={false}
          fullWidth
          loading={isFetching}
          loadingText={'Procurando...'}
          value={instrumentoSelecionado}
          inputValue={searchDA}               
          onInputChange={(e, val, reason) => {
            if (reason === 'input') setSearchDA(val);
          }}
          onChange={(event, newValue) => {
            if (error?.instrumento) setError((prev) => ({ ...prev, instrumento: undefined }));

            setInstrumentoSelecionado(newValue);
            setSearchDA(getInstrumentoLabel(newValue));
          }}
          noOptionsText='Sem resultados'
          getOptionLabel={(option) => {
            if (option === 'CRIAR_NOVO') return '';
            return option?.tipoDeInstrumento?.descricao || '';
          }}
          renderOption={(props, option) => {
            const tipo = option?.tipoDeInstrumento || {};
            const procedimento = option?.procedimentoRelacionado?.codigo || '—';
            const tipoServico =
              option?.tipoDeServico === 'A' ? 'Acreditado'
              : option?.tipoDeServico === 'N' ? 'Não Acreditado'
              : option?.tipoDeServico === 'I' ? 'Interna' : '—';
            const tipoSinal =
              option?.tipoSinal === 'A' ? 'Analógico'
              : option?.tipoSinal === 'D' ? 'Digital' : '—';
            const descricao = tipo?.descricao || '—';
            const modelo = tipo?.modelo || '—';
            const fabricante = tipo?.fabricante || '—';
            const resolucao = tipo?.resolucao || '—';
            const minimo = option?.minimo || '—';
            const maximo = option?.maximo || '—';
            const unidade = option?.unidade || '—';
            const capacidade = option?.capacidadeDeMedicao?.valor || '—';
            const unidadeCapacidade = option?.capacidadeDeMedicao?.unidade || '—';

            return (
              <MenuItem
                {...props}
                key={option?.id}
                sx={{ display: 'block', alignItems: 'start', whiteSpace: 'normal' }}
              >
                <Box>
                  <Typography fontWeight="bold">
                    {`${descricao} - ${modelo} / ${fabricante}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Procedimento: {procedimento}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tipo de serviço: {tipoServico} • Sinal: {tipoSinal}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Faixa: {minimo} – {maximo} {unidade}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resolução: {resolucao}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacidade de medição: {capacidade} {unidadeCapacidade}
                  </Typography>
                </Box>
              </MenuItem>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Instrumento base"
              required
              error={!!error?.instrumento}
              helperText={error?.instrumento?.[0]}
            />
          )}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          mt={1}
        >
          Não encontrou o que procura? <Button onClick={() => setShowFormNewAsset(true)} size="small">Criar novo instrumento base</Button>
        </Typography>
        <FormDefaultAsset 
          open={showFormNewAsset}
          onClose={() => setShowFormNewAsset(false)}
          setInstrumentoSelecionado={setInstrumentoSelecionado}
        />
        <Box my={2}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              Identificação do Instrumento
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="TAG"
                  size="small"
                  fullWidth
                  {...form.register('tag')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Número de Série"
                  size="small"
                  fullWidth
                  {...form.register('numeroDeSerie')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Classe"
                  size="small"
                  fullWidth
                  {...form.register('classe')}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom mt={2}>
              Critério de Aceitação
            </Typography>
          </AccordionSummary>
          
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Critério de Aceitação"
                  type="number"
                  size="small"
                  inputProps={{
                    step: 'any',
                    inputMode: 'decimal',
                  }}
                  fullWidth
                  {...form.register('criterioDeAceitacao', { valueAsNumber: true })}
                  />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Unidade"
                  size="small"
                  fullWidth
                  {...form.register('unidade')}
                  />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Referência do Critério"
                  size="small"
                  fullWidth
                  {...form.register('referenciaDoCriterio')}
                  />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom mt={2}>
              Fornecedor
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Preço da Última Calibração"
                  type="number"
                  size="small"
                  inputProps={{
                    step: 0.01,
                    inputMode: 'decimal',
                    min: 0,
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  fullWidth
                  {...form.register('precoUltimaCalibracao', { valueAsNumber: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Laboratório"
                  size="small"
                  fullWidth
                  {...form.register('laboratorio')}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Observação do Fornecedor"
                  size="small"
                  fullWidth
                  {...form.register('observacaoFornecedor')}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom mt={2}>
              Status do Instrumento
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Posição"
                  size="small"
                  fullWidth
                  select
                  defaultValue="I"
                  {...form.register('posicao')}
                >
                  <MenuItem value="U">Em uso</MenuItem>
                  <MenuItem value="E">Em estoque</MenuItem>
                  <MenuItem value="I">Inativo</MenuItem>
                  <MenuItem value="F">Fora de uso</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Observação do Status"
                  size="small"
                  fullWidth
                  {...form.register('observacaoStatus')}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom mt={2}>
              Frequência
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Checagem
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Quantidade"
                      type="number"
                      inputProps={{ min: 0, max: 365 }}
                      size="small"
                      fullWidth
                      {...form.register('frequenciaChecagem.quantidade')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Frequência"
                      select
                      defaultValue='dia'
                      size="small"
                      fullWidth
                      {...form.register('frequenciaChecagem.periodo')}
                    >
                      <MenuItem value="dia">Dia</MenuItem>
                      <MenuItem value="mes">Mês</MenuItem>
                      <MenuItem value="ano">Ano</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container alignItems="center"  spacing={2}>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Calibração
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Quantidade"
                      type="number"
                      inputProps={{ min: 0, max: 100 }}
                      size="small"
                      fullWidth
                      {...form.register('frequenciaCalibracao.quantidade')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Frequência"
                      select
                      size="small"
                      fullWidth
                      defaultValue='dia'
                      {...form.register('frequenciaCalibracao.periodo')}
                    >
                      <MenuItem value="dia">Dia</MenuItem>
                      <MenuItem value="mes">Mês</MenuItem>
                      <MenuItem value="ano">Ano</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom mt={2}>
              Pontos de Calibração
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AddArrayField label="Pontos de Calibração" fieldName="pontosDeCalibracao" form={form} field="nome" />
          </AccordionDetails>
        </Accordion>     
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom mt={2}>
              Normativos legais
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Autocomplete
              multiple
              id="norms"
              options={normas || []}
              getOptionLabel={(option) =>  { 
                if (option === 'CRIAR_NOVO') return '';
                return option?.nome || ''
              }}
              filterOptions={(options, state) => {
                const filtered = !!options?.length && options?.filter((opt) =>
                  opt?.nome?.toLowerCase().includes(state.inputValue.toLowerCase())
                );

                return [...filtered, 'CRIAR_NOVO'];
              }}
              renderOption={(props, option) => {
                if (option === 'CRIAR_NOVO') {
                  return (
                    <MenuItem {...props} sx={{ justifyContent: 'center' }}>
                      <Button variant="outlined" size="small">
                        + Criar nova norma
                      </Button>
                    </MenuItem>
                  );
                }
                return <li {...props}>{option.nome}</li>;
              }}
              filterSelectedOptions
              renderTags={() => null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Normativos legais"
                  placeholder="Normativos"
                />
              )}
              onChange={(event, newValue) => {
                const last = newValue[newValue.length - 1];
                if (last === 'CRIAR_NOVO') {
                  setShowFormNewNorm(true);
                  return;
                }

                setNorms(newValue);
              }}
              inputValue={inputNorm}
              onInputChange={(event, newInputValue) => {
                setInputNorm(newInputValue);
              }}
            />
            <Box mt={2} display="flex" gap={1} flexWrap="wrap">
              {!!norms?.length  && norms.map((norma, i) => (
                <Chip
                  key={norma?.id + i}
                  label={norma?.nome}
                  onDelete={() =>
                    setNorms((prev) => prev?.filter((n) => n.id !== norma.id))
                  }
                />
              ))}
            </Box>
           <FormNorms open={showFormNewNorm} setNorms={setNorms} onClose={() => setShowFormNewNorm(false)} />
          </AccordionDetails>
        </Accordion>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={() => {form.handleSubmit(onSubmit)(); handleClose(); setInstrumentoSelecionado(null); setSearchDA('')}}  variant="contained">{asset ? 'Editar instrumento' : 'Criar instrumento'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateInstrument