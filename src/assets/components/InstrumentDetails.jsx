import { Card, CardContent, Typography, Chip, Stack, IconButton, MenuItem, Menu, CardHeader, Grid, useTheme, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useState } from 'react'
import useAuth from '../../auth/hooks/useAuth';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import CreateInstrument from './CreateInstrument';
import { fDate } from '../../utils/formatTime';
import EmptyYet from '../../components/EmptyYet';


const tipoSinalMap = {
  A: 'Analógico',
  D: 'Digital',
};

const tipoServicoMap = {
  A: 'Acreditado',
  NA: 'Não acreditado',
  I: 'Interno',
};

const posicaoMap = {
  U: { label: 'Em uso', color: 'success' },
  E: { label: 'Em estoque', color: 'info' },
  I: { label: 'Inativo', color: 'default' },
  F: { label: 'Fora de uso', color: 'warning' },
};

const pluralize = (quantidade, periodo) => {
  if (!quantidade || !periodo) return '';
  const pluralMap = {
    dia: 'dias',
    mes: 'meses',
    ano: 'anos',
  };
  return quantidade > 1 ? pluralMap[periodo] || periodo : periodo;
};


const OptionsMenu = ({ 
  mutateUpdateClient, 
  isLoadingUpdateClient,
  defaultAssets,
  selectedItem,
  asset,
  mutateDeleteClient,
  setSelectedItem,
  openForm, 
  setOpenForm,
  isFetching,
  searchDA,
  setSearchDA,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const open = Boolean(anchorEl);
  const { user } = useAuth();
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        >
        <MoreVertIcon />
      </IconButton>
      <Menu
        open={open}
        id="basic-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
        >
        <MenuItem onClick={() => setOpenForm({status: true, type: 'edit'})}>Editar</MenuItem>
        <MenuItem onClick={() => setOpenForm({status: true, type: 'delete'})}>Excluir</MenuItem>
      </Menu>

      <ConfirmDeleteDialog
        open={openForm?.type === 'delete' && openForm?.status}
        onClose={() => setOpenForm({status: false, type: 'delete'})}
        type="instrument"
        onConfirm={() => {mutateDeleteClient(asset?.id); setSelectedItem(null)}}
        />

      <CreateInstrument
        handleClose={() => setOpenForm({status: false, type: 'edit'})}
        open={openForm?.type === 'edit' && openForm?.status}
        defaultAssets={defaultAssets}
        setor={selectedItem}
        cliente={user?.cliente}
        mutate={mutateUpdateClient}
        asset={asset}
        isFetching={isFetching}
        setSearchDA={setSearchDA}
        searchDA={searchDA}
      />
    </div>
  )
}


function InstrumentDetails({ 
  instrumento,   
  mutateUpdateClient,
  isLoadingUpdateClient,
  defaultAssets,
  selectedItem,
  mutateDeleteClient,
  setSelectedItem,
  isFetching,
  searchDA,
  setSearchDA,
}) {
  const { user } = useAuth();

  const [openForm, setOpenForm] = useState({
    status: false,
    type: '',
  });
  
  if (!instrumento) {
    return (<>
    <EmptyYet
      content="instrumento"
      onCreate={() =>  setOpenForm({status: true, type: 'create'})}
      imageAlt="Mascote da empresa"
      />
    <CreateInstrument
      handleClose={() => setOpenForm({status: false, type: 'create'})}
      open={openForm?.type === 'create' && openForm?.status}
      defaultAssets={defaultAssets}
      setor={selectedItem}
      cliente={user?.cliente}
      mutate={mutateUpdateClient}
    />
    </>)
  }
  
  const tipoDeInstrumento = instrumento?.instrumento?.tipoDeInstrumento;
  const theme = useTheme()
  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" mb={2}>
            Informacoes instrumentos
          </Typography>
          <Box display='flex' alignItems='center'>
            {!!instrumento?.dataExpiracaoCalibracao && (
              <Chip
              label={`Expira ${fDate(instrumento?.dataExpiracaoCalibracao)}`}
              variant="filled"
              color={'warning'}
              size='small'
                sx={{ color: theme.palette.common.white }}
              />
            )}
            <OptionsMenu
              mutateUpdateClient={mutateUpdateClient} 
              isLoadingUpdateClient={isLoadingUpdateClient} 
              defaultAssets={defaultAssets}
              selectedItem={selectedItem}
              asset={instrumento}
              mutateDeleteClient={mutateDeleteClient}
              setSelectedItem={setSelectedItem}
              openForm={openForm}
              setOpenForm={setOpenForm}
              isFetching={isFetching}
              setSearchDA={setSearchDA}
              searchDA={searchDA}
            />
          </Box>
        </Stack>

        <Grid container spacing={2}>
          {(tipoDeInstrumento?.descricao || instrumento?.tag ||
            tipoDeInstrumento?.modelo || tipoDeInstrumento?.fabricante ||
            instrumento?.classe || instrumento?.numeroDeSerie ||
            instrumento?.instrumento?.procedimentoRelacionado?.codigo) && (
            <Grid item xs={12} sm={6} md={6}>
              {(tipoDeInstrumento?.descricao || instrumento?.tag) && (
                <Typography variant="subtitle2">
                  {tipoDeInstrumento?.descricao} | {instrumento?.tag}
                </Typography>
              )}
              {(tipoDeInstrumento?.modelo || tipoDeInstrumento?.fabricante) && (
                <Typography variant="body2">
                  {tipoDeInstrumento?.modelo} - {tipoDeInstrumento?.fabricante}
                </Typography>
              )}
              {!!instrumento?.classe && (
                <Typography variant="body2">Classe: {instrumento.classe}</Typography>
              )}
              {!!instrumento?.numeroDeSerie && (
                <Typography variant="body2">Número de Série: {instrumento.numeroDeSerie}</Typography>
              )}
              {!!instrumento?.instrumento?.procedimentoRelacionado?.codigo && (
                <Typography variant="body2">
                  Procedimento: {instrumento.instrumento.procedimentoRelacionado.codigo}
                </Typography>
              )}
            </Grid>
          )}

          {(tipoDeInstrumento?.resolucao ||
            instrumento?.instrumento?.minimo ||
            instrumento?.instrumento?.maximo ||
            instrumento?.instrumento?.tipoSinal) && (
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="subtitle2" my={1}>Características metrológicas</Typography>
              {!!tipoDeInstrumento?.resolucao && (
                <Typography variant="body2">Resolução: {tipoDeInstrumento.resolucao}</Typography>
              )}
              {(instrumento?.instrumento?.minimo || instrumento?.instrumento?.maximo) && (
                <Typography variant="body2">
                  Faixa: {instrumento.instrumento.minimo} - {instrumento.instrumento.maximo} {instrumento.instrumento.unidade}
                </Typography>
              )}
              {!!instrumento?.instrumento?.tipoSinal && (
                <Typography variant="body2">
                  Tipo de sinal: {tipoSinalMap[instrumento?.instrumento?.tipoSinal] || 'Desconhecido'}
                </Typography>
              )}
            </Grid>
          )}

          {(instrumento?.frequenciaChecagem?.quantidade || instrumento?.frequenciaCalibracao?.quantidade) && (
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="subtitle2" my={1}>Frequência</Typography>
              {!!instrumento?.frequenciaChecagem?.quantidade && (
                <Typography variant="body2">
                  Checagem: {instrumento.frequenciaChecagem.quantidade}{' '}
                  {pluralize(instrumento.frequenciaChecagem.quantidade, instrumento.frequenciaChecagem.periodo)}
                </Typography>
              )}
              {!!instrumento?.frequenciaCalibracao?.quantidade && (
                <Typography variant="body2">
                  Calibração: {instrumento.frequenciaCalibracao.quantidade}{' '}
                  {pluralize(instrumento.frequenciaCalibracao.quantidade, instrumento.frequenciaCalibracao.periodo)}
                </Typography>
              )}
            </Grid>
          )}

          {(instrumento?.criterioDeAceitacao ||
            instrumento?.referenciaDoCriterio ||
            instrumento?.instrumento?.tipoDeServio ||
            instrumento?.observacaoCriterioAceitacao) && (
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="subtitle2" my={1}>Critério de aceitação</Typography>
              {!!instrumento?.criterioDeAceitacao && (
                <Typography variant="body2">
                  Critério de aceitação: {instrumento.criterioDeAceitacao} {instrumento.unidade}
                </Typography>
              )}
              {!!instrumento?.referenciaDoCriterio && (
                <Typography variant="body2">Memória de cálculo: {instrumento.referenciaDoCriterio}</Typography>
              )}
              {!!instrumento?.instrumento?.tipoDeServio && (
                <Typography variant="body2">
                  Tipo de serviço: {tipoServicoMap[instrumento.instrumento.tipoDeServio] || 'Desconhecido'}
                </Typography>
              )}
              {!!instrumento?.observacaoCriterioAceitacao && (
                <Typography variant="body2">Observação: {instrumento.observacaoCriterioAceitacao}</Typography>
              )}
            </Grid>
          )}

          {(instrumento?.laboratorio || instrumento?.precoUltimaCalibracao || instrumento?.observacaoFornecedor) && (
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="subtitle2" my={1}>Fornecedor</Typography>
              {!!instrumento?.laboratorio && (
                <Typography variant="body2">Laboratório: {instrumento.laboratorio}</Typography>
              )}
              {!!instrumento?.precoUltimaCalibracao && (
                <Typography variant="body2">
                  Preço última calibração: R$ {instrumento.precoUltimaCalibracao}
                </Typography>
              )}
              {!!instrumento?.observacaoFornecedor && (
                <Typography variant="body2">Observação: {instrumento.observacaoFornecedor}</Typography>
              )}
            </Grid>
          )}

          {(instrumento?.posicao || instrumento?.dataUtilizao || instrumento?.observacaoStatus || instrumento?.dataProximaCalibracao) && (
            <Grid item xs={12} sm={6} md={6}>
              {!!instrumento?.posicao && (
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" my={1}>Status</Typography>
                  <Chip
                    label={posicaoMap[instrumento.posicao]?.label || 'Desconhecido'}
                    color={posicaoMap[instrumento.posicao]?.color || 'default'}
                    size="small"
                  />
                </Stack>
              )}
              {!!instrumento?.observacaoStatus && (
                <Typography variant="body2">Observação: {instrumento.observacaoStatus}</Typography>
              )}
              {!!instrumento?.dataProximaCalibracao && (
                <Typography variant="body2">Próxima calibração: {fDate(instrumento?.dataProximaCalibracao)}</Typography>
              )}
              {!!instrumento?.dataProximaChecagem && (
                <Typography variant="body2">Próxima checagem: {fDate(instrumento?.dataProximaChecagem)}</Typography>
              )}
            </Grid>
          )}

          {!!instrumento?.pontosDeCalibracao?.length && (
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="subtitle2" my={1}>Pontos de Calibração</Typography>
              <Typography variant="body2">
                {instrumento.pontosDeCalibracao.map((ponto, index, arr) => {
                  const isLast = index === arr.length - 1;
                  return `${ponto?.nome}${isLast ? '.' : ', '}`;
                })}
              </Typography>
            </Grid>
          )}

          {!!instrumento?.normativos?.length && (
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="subtitle2" my={1}>Normativo/legal</Typography>
              <Typography variant="body2">
                {instrumento.normativos.map((norma, index, arr) => {
                  const isLast = index === arr.length - 1;
                  return `${norma?.nome}${isLast ? '.' : ', '}`;
                })}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default InstrumentDetails