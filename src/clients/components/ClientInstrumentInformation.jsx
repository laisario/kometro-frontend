import React, { useState } from 'react'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  CircularProgress,
  Tab,
  Button,
} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CalibrationPanel from './CalibrationPanel';
import EditAsset from '../../components/EditAsset';
import AssetInformation from '../../components/AssetInformation';


function ClientInstrumentInformation(props) {
  const { 
    instrument, 
    isMobile, 
    mutateDelete, 
    isDeleting, 
  } = props;
  const [openFormEdit, setOpenFormEdit] = useState(false);
  const [valueTab, setValueTab] = useState('information');
  const handleCloseFormEdit = () => setOpenFormEdit(false);
  const handleOpenFormEdit = () => setOpenFormEdit(true);
  const handleChangeTab = (event, newValue) => setValueTab(newValue);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${instrument?.id}-content`}
        id={`instrument-${instrument?.id}`}
      >
          <Box>
            <Typography variant='body1'>
              {instrument?.instrumento?.tipoDeInstrumento?.descricao}{instrument?.instrumento?.tipoDeInstrumento?.modelo && `, ${instrument?.instrumento?.tipoDeInstrumento?.modelo}`} {instrument?.instrumento?.tipoDeInstrumento?.fabricante && `- ${instrument?.instrumento?.tipoDeInstrumento?.fabricante}`}
            </Typography>

            {(instrument?.instrumento?.maximo || instrument?.instrumento?.minimo) && (
              <Typography variant='body2' fontWeight="500">
                {instrument?.instrumento?.maximo !== null ? `${instrument?.instrumento?.minimo} - ${instrument?.instrumento?.maximo}` : `${instrument?.instrumento?.minimo}`} {instrument?.instrumento?.unidade}
              </Typography>
            )}
          </Box>
      </AccordionSummary>
      <AccordionDetails>
        <TabContext sx={{ width: '100%' }} value={valueTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChangeTab}>
              <Tab label="Informações" value="information" />
              <Tab label="Calibrações" value="calibration" />
            </TabList>
          </Box>
          <TabPanel value="information" label="Informacao" >
            <AssetInformation instrument={instrument} isMobile={isMobile} />
          </TabPanel>
          <TabPanel value="calibration" label="Calibracoes">
            <CalibrationPanel
              isMobile={isMobile}
              instrument={instrument?.id}
            />
          </TabPanel>
        </TabContext>
      </AccordionDetails>
      <AccordionActions>
        <Button variant="outlined" onClick={handleOpenFormEdit} size="small" startIcon={<EditIcon />}>Editar instrumento</Button>
        <EditAsset
          handleClose={handleCloseFormEdit}
          open={openFormEdit}
          instrument={instrument}
          isMobile={isMobile}
        />
        {isDeleting ? <CircularProgress /> : <Button variant="contained" size="small" onClick={() => mutateDelete(instrument?.id)} endIcon={<DeleteForeverIcon />}>Excluir instrumento</Button>}
      </AccordionActions>
    </Accordion>
  )
}

export default ClientInstrumentInformation 