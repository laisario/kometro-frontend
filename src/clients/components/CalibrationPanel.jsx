import { Stack, Box, Button, Divider, CircularProgress, Snackbar } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import Calibrations from './Calibrations';
import PreviewCalibration from './PreviewCalibration';
import Form from './Form';
import useCalibrations from '../hooks/useCalibration';


function CalibrationPanel({ isMobile, instrument }) {
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
  } = useCalibrations(null, instrument )

  
  return (
    <Stack flexDirection={isMobile ? 'column' : 'row'} width="100%" gap={2} divider={<Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />} justifyContent='space-between'>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: isMobile ? '100%' : '50%', gap: 2 }}>
        <Stack flexDirection='row' gap={1} >
          {/* <TextField size='small' fullWidth={isMobile} value={search} onChange={(e) => setSearch(e?.target?.value)} placeholder='Pesquise uma OS' /> */}
          <Button startIcon={<AddIcon />} variant='contained' onClick={handleOpenForm}>calibração</Button>
          <Form
            isMobile={isMobile}
            open={openForm}
            handleClose={handleCloseForm}
            create
            mutate={mutateCreation}
            form={formCreate}
            isLoadingCreation={isLoadingCreation}
          />
        </Stack>
        {isLoadingCreation 
          ? <CircularProgress /> 
          : (
            <Calibrations
              calibrations={calibrations} 
              isMobile={isMobile} 
              selectedCalibration={selectedCalibration} 
              setSelectedCalibration={setSelectedCalibration} 
            />
          )
        }
      </Box>
      <PreviewCalibration
        mutateEdit={mutateEdit}
        isLoadingEdit={isLoadingEdit}
        isMobile={isMobile}
        deleteCalibration={mutateDeleteCalibration}
        isDeleting={isDeletingCalibration}
        calibration={selectedCalibration}
        setSelectedCalibration={setSelectedCalibration}
        mutateAddCertificate={mutateAddCertificate}
        isLoadingAddCertificate={isLoadingAddCertificate}
        mutateDeleteCertificate={mutateDeleteCertificate}
        isLoadingDeleteCertificate={isLoadingDeleteCertificate}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        openCreateCertificate={openCreateCertificate}
        setOpenCreateCertificate={setOpenCreateCertificate}
        form={form}
      />
    </Stack>
  )
}

export default CalibrationPanel