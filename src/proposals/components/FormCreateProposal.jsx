import {
  TextField,
  Button,
  CircularProgress,
  Chip,
  Checkbox,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Autocomplete,
} from '@mui/material';
import { verifyError } from '../../utils/error';
import useClientAssets from '../../assets/hooks/useClientAsset';

function FormCreateProposal(props) {
  const { 
    onClose, 
    open, 
    admin,
    mutateCreateProposal,
    isLoadingCreateProposal,
    formCreateProposal,
    clients,
    isLoadingClients,
    error,
    setError,
  } = props;
  
  const instruments = formCreateProposal?.watch("instrumentos");
  const client = formCreateProposal?.watch('cliente');
  
  const { assets, isLoadingAssets } = useClientAssets(admin ? client?.id : clients?.results[0]?.id);
  console.log(assets, 'aaaaaaaa', clients?.results[0]?.id)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
    >
      <DialogTitle>Criar novo pedido de calibração</DialogTitle>
      <DialogContent>
        {admin && (
          <Autocomplete
            autoHighlight
            options={clients?.results || []}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            getOptionLabel={
              (client) => client?.empresa?.razaoSocial || client?.nome
            }
            loading={isLoadingClients}
            name="cliente"
            value={client || null}
            loadingText="Carregando..."
            noOptionsText="Sem resultados"
            onChange={(event, newValue) => {verifyError("cliente", error, setError); formCreateProposal?.setValue('cliente', newValue)}}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                placeholder="Pesquisar cliente"
                helperText={!!error['cliente']?.length && error['cliente'][0]}
                error={!!error['cliente']?.length}
              />
            )}
            sx={{ my: 2 }}
          />
        )}

        {<Autocomplete
          multiple
          autoHighlight
          options={assets?.results || []}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          getOptionLabel={(instrument) => `${instrument?.tag}: ${instrument?.numeroDeSerie} - ${instrument?.instrumento?.tipoDeInstrumento?.descricao} - ${instrument?.instrumento?.minimo} - ${instrument?.instrumento?.maximo}`}
          disableCloseOnSelect
          loading={isLoadingAssets}
          renderTags={(value, getTagProps) => value?.map((tag, index) => <Chip {...getTagProps({ index })} key={tag?.tag} label={tag?.tag} />)}
          name="instrumentos"
          value={instruments}
          loadingText="Carregando..."
          noOptionsText="Sem resultados"
          {...formCreateProposal.register("instrumentos")}
          onChange={(event, newValue) => {verifyError("instrumentos", error, setError); formCreateProposal?.setValue('instrumentos', newValue)}}
          renderInput={(params) => (
            <TextField
              {...params}
              helperText={!!error['instrumentos']?.length && error['instrumentos'][0]}
              error={!!error['instrumentos']?.length}
              label={admin ? "Instrumentos do cliente" : "Instrumentos"}
              placeholder="Pesquisar instrumento"
            />
          )}
          renderOption={(props, instrumento, { selected }) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps}>
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {instrumento?.tag}: {instrumento?.numeroDeSerie} - {instrumento?.instrumento?.tipoDeInstrumento?.descricao} - {instrumento?.instrumento?.minimo} - {instrumento?.instrumento?.maximo}
              </li>
            );
          }}
          sx={{ my: 2 }}
        />}
        <TextField
          type="text"
          multiline
          name="informacoesAdicionais"
          label="Informações adicionais"
          placeholder="Informações adicionais"
          fullWidth
          {...formCreateProposal.register("informacoesAdicionais")}

        />
      </DialogContent>
      <DialogActions sx={{ mt: 3, mb: 2 }} >
        <Button onClick={() => { onClose(); formCreateProposal.reset() }}>Cancelar</Button>
        <Button 
          onClick={mutateCreateProposal} 
          type="submit" 
          variant="contained"
        >
          Enviar proposta
        </Button>

        {isLoadingCreateProposal && <CircularProgress />}
      </DialogActions>
    </Dialog>
  );
}

export default FormCreateProposal