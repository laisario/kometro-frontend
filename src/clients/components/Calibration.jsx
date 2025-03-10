import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { fDate } from '../../utils/formatTime';
import ContentRow from '../../components/ContentRowCard';
import ButtonTooltip from '../../components/ButtonTooltip';
import { statusLabel, statusColor, analiseCriticaColor, analiseCriticaLabel } from '../../utils/calibration';
import Label from '../../components/label';
import Form from './Form';
import FormCertificate from './FormCertificate';
import Attachment from '../../components/Attachment';

function Calibration(props) {
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
    error,
    setError
  } = props;

  const handleClose = () => {
    setSelectedCalibration({})
    setOpenEdit(false)
  }

  const handleOpenEdit = () => setOpenEdit(true)
  const handleCloseCertificate = () => setOpenCreateCertificate(false)
  const handleOpenCertificate = () => setOpenCreateCertificate(true)
  const handleDelete = () => deleteCalibration(calibration?.id)

  const deleteCertificate = (idCertificado) => {
    mutateDeleteCertificate({ id: calibration?.id, idCertificado, })
  }

  return (
    <Card sx={{
      bgcolor: 'background.default',
      width: '100%',
      maxHeight: '350px',
      overflow: "auto"
    }}>
      <CardContent sx={{ display: 'flex', gap: 2, justifyContent: "space-between", flexDirection: isMobile ? 'column' : 'row' }}>
        <Box width={(!calibration?.certificados?.length || isMobile) ? "100%" : "60%"}>
          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {isLoadingAddCertificate 
              ? <CircularProgress /> 
              : <ButtonTooltip title="Adicionar certificado" variant='filled' icon={<AddIcon />} action={handleOpenCertificate} />
            }
            <FormCertificate
              mutateAddCertificate={mutateAddCertificate}
              open={openCreateCertificate}
              handleClose={handleCloseCertificate}
              calibration={calibration}
            />
            {isLoadingEdit 
              ? <CircularProgress /> 
              : <ButtonTooltip title="Editar calibração" action={handleOpenEdit} icon={<EditIcon />} />
            }
            <Form
              mutate={mutateEdit}
              calibration={calibration}
              open={openEdit}
              isMobile={isMobile}
              handleClose={handleClose}
              form={form}
              error={error}
              setError={setError}
            />
            {isDeleting 
              ? <CircularProgress /> 
              : <ButtonTooltip title="Apagar calibração" variant='filled' icon={<DeleteIcon />} action={handleDelete} />
            }
          </CardActions>
          
          {calibration?.ordemDeServico && (
            <ContentRow colorTitle='black' colorValue='black' title={calibration?.ordemDeServico?.toUpperCase()} value={fDate(calibration?.data, "dd/MM/yyyy")} />
          )}
          {calibration?.local && (
            <ContentRow title="Local" value={calibration?.local} />
          )}
          {calibration?.observacoes && (
            <ContentRow isMobile title="Observações:" value={calibration?.observacoes} />
          )}
          {(calibration?.status)
            && <ContentRow title="Resultado" colorTitle='black' my={1} value={<Label color={statusColor[calibration?.status]}>{statusLabel[calibration?.status]}</Label>} />
          }

          <ContentRow title="Maior erro" value={calibration?.maiorErro ? calibration?.maiorErro : "Não faz parte do cálculo"} />

          <ContentRow title="Incerteza" value={calibration?.incerteza ? calibration?.incerteza : "Não faz parte do cálculo"} />
          {calibration?.criterioDeAceitacao && (
            <ContentRow title="Critério de aceitação" value={calibration?.criterioDeAceitacao !== 'None' ? calibration?.criterioDeAceitacao : "Não informado"} />
          )}
          {calibration?.referenciaDoCriterio && (
            <ContentRow title="Referência do critério" value={calibration?.referenciaDoCriterio} />
          )}

          {(calibration?.analiseCritica)
            && <ContentRow title="Análise critica" colorTitle='black' my={1} value={<Label color={analiseCriticaColor[calibration?.analiseCritica]}>{analiseCriticaLabel[calibration?.analiseCritica]}</Label>} />
          }
          {calibration?.restricaoAnaliseCritica && (
            <ContentRow isMobile title="Restrição análise crítica:" value={calibration?.restricaoAnaliseCritica} />
          )}
        </Box>
        {!!calibration?.certificados?.length && <Divider orientation={"vertical"} flexItem />}
        {!!calibration?.certificados?.length && (
          <Box
            width={isMobile ? "100%" : "30%"}
            height="100%"
            gap={2}
            display="flex"
            flexDirection="column"
          >
            {isLoadingDeleteCertificate ? <CircularProgress /> : calibration?.certificados?.map((certificado, i) => (
              <Box key={certificado?.id + i} sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  {certificado?.numero && <ContentRow colorTitle='black' title="Certificado:" isMobile value={<Attachment url={certificado?.arquivo} content={certificado?.numero} />} />}
                  <IconButton size='small' onClick={() => deleteCertificate(certificado?.id)}>
                    <ClearIcon />
                  </IconButton>
                </Box>
                {(certificado?.anexos?.map(({ anexo, id }, index) => (
                  <ContentRow my={0} key={id + index} title={`Anexo ${index + 1}`} value={<Attachment url={anexo} content={<AttachmentIcon fontSize='small' />} />} />
                )))}
              </Box>
            ))}
          </Box>)}
      </CardContent>
    </Card>
  )
}

export default Calibration