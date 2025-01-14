import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/scrollbar';


export default function OrderFilterSidebar({ openFilter, onOpenFilter, onCloseFilter, resetFilters, form }) {
  return (
    <>
      <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
        Filtros
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filtros
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <div>
              <FormControl>
                <FormLabel id="status-filter">Status</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="status-filter"
                  name="status"
                >
                  <FormControlLabel value="E" control={<Radio checked={form?.status === "E"} {...form.register("status")} />} label="Em elaboração" />
                  <FormControlLabel value="AA" control={<Radio checked={form?.status === "AA"} {...form.register("status")} />} label="Aguardando aprovação" />
                  <FormControlLabel value="A" control={<Radio checked={form?.status === "A"} {...form.register("status")} />} label="Aprovada" />
                  <FormControlLabel value="R" control={<Radio checked={form?.status === "R"} {...form.register("status")} />} label="Reprovada" />

                </RadioGroup>
              </FormControl>
            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Datas
              </Typography>
              <DatePicker
                label="Ínicio"
                name="dateStart"
                {...form.register("dateStart")}
                value={form?.dateStart}
                onChange={newValue => form.setValue("dateStart", newValue)}
              />
              <DatePicker
                label="Fim"
                name="dateStop"
                {...form.register("dateStop")}
                value={form?.dateStop}
                onChange={newValue => form.setValue("dateStop", newValue)}
                sx={{my: 1}}
              />
              <Button variant="contained" fullWidth onClick={() => form.setValue("filterByDate", true)} >Filtrar</Button>
            </div>


          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
            onClick={resetFilters}
          >
            Limpar filtros
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
