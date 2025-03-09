import React from 'react'
import { Box, Typography } from '@mui/material'
import Calibration from './Calibration'

function PreviewCalibration(props) {
  const {
    calibration,
    isMobile,
    isDeleting,
    deleteCalibration,
    mutateEdit,
    isLoadingEdit,
    mutateAddCertificate,
    isLoadingAddCertificate,
    mutateDeleteCertificate,
    isLoadingDeleteCertificate,
    setSelectedCalibration,
    openEdit,
    setOpenEdit,
    openCreateCertificate,
    setOpenCreateCertificate,
    form,
  } = props;

  return (
    <Box sx={{
      width: isMobile ? '100%' : '68%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      maxHeight: '450px',
      borderRadius: 4,
    }}>
      {!Object.keys(calibration)?.length
        ? <Typography color='grey' fontWeight={400} textAlign="center">Selecione uma calibração para visualizá-la</Typography>
        : (
          <Calibration
            isMobile={isMobile}
            calibration={calibration}
            mutateEdit={mutateEdit}
            isLoadingEdit={isLoadingEdit}
            isDeleting={isDeleting}
            deleteCalibration={deleteCalibration}
            mutateAddCertificate={mutateAddCertificate}
            isLoadingAddCertificate={isLoadingAddCertificate}
            mutateDeleteCertificate={mutateDeleteCertificate}
            isLoadingDeleteCertificate={isLoadingDeleteCertificate}
            setSelectedCalibration={setSelectedCalibration}   openEdit={openEdit}
            setOpenEdit={setOpenEdit}
            openCreateCertificate={openCreateCertificate}
            setOpenCreateCertificate={setOpenCreateCertificate}
            form={form}
          />
      )
      }
    </Box>
  )
}

export default PreviewCalibration