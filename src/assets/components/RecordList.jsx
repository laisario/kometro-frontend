import { Box, Button, Card, CardContent } from '@mui/material'
import React, { useState } from 'react'
import useResponsive from '../../theme/hooks/useResponsive';
import CalibrationPanel from '../../clients/components/CalibrationPanel';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import useCalibrations from '../../clients/hooks/useCalibration';
import Form from '../../clients/components/Form';
import AddIcon from '@mui/icons-material/Add';
import Movimentations from './InstrumentMovimentations';

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
  } = useCalibrations(null, asset?.id, value === "2")


  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedCalibration({});
  };
  const calibracoes = '1'
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
              formCertificate={formCertificate}
              checagem={value === '2'}
            />
            {value !== movimentacoes && <Button 
              startIcon={<AddIcon />} 
              variant='contained' 
              size='small' 
              onClick={handleOpenForm}
              sx={{ mt: isMobile ? 1 : 0}}
            >
              {value === calibracoes ? 'Cria calibração' : 'Criar checagem'}
            </Button>}
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
            <Movimentations asset={asset} movimentations={asset?.historicoPosicoes} />
          </TabPanel>
        </TabContext>
      </CardContent>
    </Card>
  )
}

export default RecordList