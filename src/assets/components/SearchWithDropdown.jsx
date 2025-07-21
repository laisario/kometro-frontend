import { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  ClickAwayListener,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


export default function InstrumentSearch({ data = [], onSelect }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim().length > 0) {
      const result = data?.results.filter((item) => {
        const tag = item.tag?.toLowerCase() || '';
        const tipo = item.instrumento?.tipoDeInstrumento?.descricao?.toLowerCase() || '';
        const serie = item.numeroDeSerie?.toLowerCase() || '';
        return (
          tag.includes(value.toLowerCase()) ||
          tipo.includes(value.toLowerCase()) ||
          serie.includes(value.toLowerCase())
        );
      });
      setFiltered(result);
      setOpen(true);
    } else {
      setOpen(false);
      setFiltered([]);
    }
  };

  const handleClickItem = (item) => {
    onSelect?.(item);
    setSearch('');
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative' }}>
        <TextField
          fullWidth
          placeholder="Procure por tag, descrição ou número de série"
          value={search}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="small"
        />
        {open && filtered.length > 0 && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 10,
              maxHeight: 300,
              overflowY: 'auto',
            }}
            >
            <List>
              {filtered.map((item) => {
                const tipo = item.instrumento?.tipoDeInstrumento?.descricao || 'Tipo desconhecido';
                const tag = item.tag || 'Sem tag';
                return (
                  <ListItemButton key={item.id} onClick={() => handleClickItem(item)}>
                    <ListItemText primary={`${tag} — ${tipo}`} />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
