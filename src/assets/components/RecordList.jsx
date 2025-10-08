import { Box, Button, Card, CardContent, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import useResponsive from '../../theme/hooks/useResponsive';
import CalibrationPanel from '../../clients/components/CalibrationPanel';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import useCalibrationsMutations from '../../clients/hooks/useCalibrationMutation';
import Form from '../../clients/components/Form';
import AddIcon from '@mui/icons-material/Add';
import Movimentations from './InstrumentMovimentations';
import useAuth from '../../auth/hooks/useAuth';
import { EXPORT_ACTION, NO_PERMISSION_ACTION } from '../../utils/messages';

const recordList = [
  {
    value: "1",
    label: 'Calibração'
  },
  {
    value: "2",
    label: 'Checagem'
  }
]

const dataButton = {
  '1': 'Criar calibração',
  '2': 'Criar checagem',
  '3': 'Exportar movimentações',
}

const messageTooltip = {
  '1': NO_PERMISSION_ACTION,
  '2': NO_PERMISSION_ACTION,
  '3': EXPORT_ACTION,
}

function RecordList({asset}) {
  const isMobile = useResponsive('down', 'md');
  const [value, setValue] = useState('1');
  const {
    data: calibrations,
    mutateDeleteCalibration,
    isDeletingCalibration,
    mutateCreation,
    isLoadingCreation,
    mutateEdit,
    isLoadingEdit,
    mutateAddCertificate,
    isLoadingAddCertificate,
    mutateDeleteCertificate,
    isLoadingDeleteCertificate,
    selectedCalibration,
    setSelectedCalibration,
    form,
    handleOpenForm,
    handleCloseForm,
    openForm, 
    openEdit,
    setOpenEdit,
    openCreateCertificate,
    setOpenCreateCertificate,
    formCreate,
    error,
    isLoadingCalibrations,
    setError,
    formCertificate,
    exportMovements
  } = useCalibrationsMutations(null, asset?.id, value === "2")

  const { hasCreatePermission } = useAuth()


  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedCalibration({});
  };
  const movimentacoes = '3'
  return (
    <Card>
      <CardContent>
        <TabContext value={value}>
          <Box 
           sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            flexDirection: isMobile? 'column' : 'row', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'start' : 'center',
           }}
          >
            <TabList onChange={handleChange}>
              <Tab label="Calibração" value="1" />
              <Tab label="Checagem" value="2" />
              <Tab label="Movimentações" value="3" />
            </TabList>
            <Form
              isMobile={isMobile}
              open={openForm}
              handleClose={handleCloseForm}
              create
              mutate={mutateCreation}
              form={formCreate}
              isLoadingCreation={isLoadingCreation}
              error={error}
              setError={setError}
              formCertificate={formCertificate}
              checagem={value === '2'}
              criterios={asset?.criteriosAceitacao}
            />
            <Tooltip placement="top-start" title={hasCreatePermission ? value === movimentacoes && messageTooltip[movimentacoes] : messageTooltip[value]}>
              <span>
                <Button 
                  startIcon={<AddIcon />} 
                  variant='contained'
                  disabled={!hasCreatePermission && value !== movimentacoes}
                  size='small' 
                  onClick={value === movimentacoes ? exportMovements : handleOpenForm}
                  sx={{ my: isMobile ? 1 : 0}}
                  >
                  {dataButton[value]}
                </Button>
              </span>
            </Tooltip>
          </Box>
          {recordList?.map((record) => (
            <TabPanel key={record?.label} value={record?.value} sx={{p:0, pt: 2}}>
              <CalibrationPanel
                isMobile={isMobile}
                calibrations={calibrations}
                mutateDeleteCalibration={mutateDeleteCalibration}
                isDeletingCalibration={isDeletingCalibration}
                isLoadingCreation={isLoadingCreation}
                mutateEdit={mutateEdit}
                isLoadingEdit={isLoadingEdit}
                mutateAddCertificate={mutateAddCertificate}
                isLoadingAddCertificate={isLoadingAddCertificate}
                mutateDeleteCertificate={mutateDeleteCertificate}
                isLoadingDeleteCertificate={isLoadingDeleteCertificate}
                selectedCalibration={selectedCalibration}
                setSelectedCalibration={setSelectedCalibration}
                form={form}
                openEdit={openEdit}
                setOpenEdit={setOpenEdit}
                openCreateCertificate={openCreateCertificate}
                setOpenCreateCertificate={setOpenCreateCertificate}
                error={error}
                isLoadingCalibrations={isLoadingCalibrations}
                setError={setError}
                checagem={recordList?.find(record => record?.label?.toLowerCase() === "checagem").value === record?.value }
              />
            </TabPanel>
          ))}
          <TabPanel sx={{ p: 0}} value={movimentacoes}>
            <Movimentations isMobile={isMobile} asset={asset} movimentationsPosition={asset?.historicoPosicoes} movimentationsSector={asset?.historicoSetores} />
          </TabPanel>
        </TabContext>
      </CardContent>
    </Card>
  )
}

export default RecordList