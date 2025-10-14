import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  TextField,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  ListItemButton,
  Divider
} from '@mui/material';
import { FixedSizeList as VirtualizedList } from 'react-window';
import { Clear as ClearIcon } from '@mui/icons-material';

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

const InstrumentOption = ({ index, style, data, adminPreview }) => {
  const { options, onSelect, selectedValue } = data;
  const option = options[index];

  if (!option) return null;

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
  const precoCalibracaoNoCliente = option?.precoCalibracaoNoCliente || '—';
  const precoCalibracaoNoLaboratorio = option?.precoCalibracaoNoLaboratorio || '—';

  const isSelected = selectedValue?.id === option?.id;

  return (
    <div style={style}>
      <ListItemButton
        onClick={() => onSelect(option)}
        selected={isSelected}
        sx={{
          display: 'block',
          alignItems: 'start',
          whiteSpace: 'normal',
          minHeight: 120,
          py: 1,
          px: 2,
          my: 2,
          '&.Mui-selected': {
            backgroundColor: 'primary.light',
            '&:hover': {
              backgroundColor: 'primary.light',
            },
          },
        }}
      >
        <Box>
          <Typography fontWeight="bold" variant="subtitle1">
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
          {adminPreview && (
            <>
              <Typography variant="body2" color="text.secondary">
                Preço de calibração no cliente: R${precoCalibracaoNoCliente}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preço de calibração no laboratório: R${precoCalibracaoNoLaboratorio}
              </Typography>
            </>
          )}
        </Box>
      </ListItemButton>
      <Divider />
    </div>
  );
};

const VirtualizedInstrumentAutocomplete = ({
  options = [],
  value,
  onChange,
  loading = false,
  error,
  helperText,
  onSearch,
  searchValue,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  adminPreview = false,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const listRef = useRef(null);

  const ITEM_HEIGHT = 200;

  const handleInputChange = useCallback((event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onSearch?.(newValue);
  }, [onSearch]);

  const handleSelect = useCallback((option) => {
    onChange?.(option);
    setOpen(false);
    setInputValue(getInstrumentoLabel(option));
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange?.(null);
    setInputValue('');
    onSearch?.('');
  }, [onChange, onSearch]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (value) {
      setInputValue(getInstrumentoLabel(value));
    } else {
      setInputValue('');
    }
  }, [value]);

  const itemData = useMemo(() => ({
    options,
    onSelect: handleSelect,
    selectedValue: value,
  }), [options, handleSelect, value]);

  const handleItemsRendered = useCallback(({ visibleStopIndex }) => {
    if (hasNextPage && !isFetchingNextPage && visibleStopIndex >= options.length - 2) {
      fetchNextPage?.();
    }
  }, [hasNextPage, isFetchingNextPage, options.length, fetchNextPage]);

  const handleScroll = useCallback(({ scrollTop, scrollHeight, clientHeight }) => {
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const totalHeight = useMemo(() => {
    const itemCount = options.length + (isFetchingNextPage ? 1 : 0);
    return Math.min(400, itemCount * ITEM_HEIGHT);
  }, [options.length, isFetchingNextPage]);

  const displayValue = value ? getInstrumentoLabel(value) : inputValue;

  return (
    <Box position="relative">
      <TextField
        {...props}
        value={displayValue}
        fullWidth
        onChange={handleInputChange}
        onFocus={handleOpen}
        error={!!error}
        helperText={helperText}
        InputProps={{
          ...props.InputProps,
          endAdornment: (
            <InputAdornment position="end">
              {loading && <CircularProgress size={20} />}
              {value && (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
      
      {open && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1300,
            maxHeight: 400,
            minHeight: 200,
            mt: 1,
          }}
        >
          {options.length === 0 && !loading ? (
            <Box p={2} textAlign="center">
              <Typography color="text.secondary">
                Nenhum instrumento encontrado
              </Typography>
            </Box>
          ) : (
            <VirtualizedList
              ref={listRef}
              height={totalHeight}
              itemCount={options.length + (isFetchingNextPage ? 1 : 0)}
              itemSize={ITEM_HEIGHT}
              itemData={itemData}
              onItemsRendered={handleItemsRendered}
              onScroll={handleScroll}
              overscanCount={2}
            >
              {({ index, style, data }) => {
                if (index >= data.options.length) {
                  return (
                    <div style={{...style, height: ITEM_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Box textAlign="center">
                        <CircularProgress size={20} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Carregando mais...
                        </Typography>
                      </Box>
                    </div>
                  );
                }
                return <InstrumentOption adminPreview={adminPreview} index={index} style={style} data={data} />;
              }}
            </VirtualizedList>
          )}
        </Paper>
      )}
      
      {open && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={1299}
          onClick={handleClose}
        />
      )}
    </Box>
  );
};

export default VirtualizedInstrumentAutocomplete;
