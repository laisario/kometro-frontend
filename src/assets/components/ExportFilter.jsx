import React, { useEffect, useState } from 'react'
import { 
  Box, 
  Checkbox, 
  FormControlLabel, 
  FormGroup, 
  FormHelperText, 
  FormLabel,
  FormControl,
  DialogTitle,
  DialogActions,
  Dialog,
  Button,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import { axios } from '../../api';
import CsvViewer from '../../components/CsvViewer';
import InstrumentoTable from './InstrumentoTable';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import { readString, useCSVDownloader } from "react-papaparse"

function ExportFilter(props) {
  const { 
    open, 
    handleClose, 
    selected,
    setSelected,
    handleChangeCheckbox, 
    valueCheckbox, 
    error, 
    setError, 
    selectAll, 
    assets,
    handleCheckboxSelectAll
  } = props;
  const [csvContent, setCsvContent] = useState(null)
  const [parsedCsv, setParsedCsv] = React.useState(null)
  const [loading, setLoading] = useState(false)
  const { CSVDownloader } = useCSVDownloader()

  useEffect(() => {
    if (!csvContent) return
    readString(csvContent, {
      header: true,
      worker: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results?.errors?.length) console.log("deu ruim")
        setParsedCsv(results?.data)
      }
    })
  }, [csvContent])

  const handlePrint = () => {
    if (!parsedCsv) return;
    window.print()
  };



  return (
    <Dialog
      open={open}
      fullScreen
      onClose={() => { setCsvContent(null); handleClose() }}
      PaperProps={{
        component: 'form',
        onSubmit: async (event) => {
          event.preventDefault();
          if (!Object.values(valueCheckbox).includes(true)) {
            setError(true);
            return;
          }

          const selectedData = {
            selectAll,
            instrumentosSelecionados: selected,
            camposSelecionados: Object.entries(valueCheckbox).filter(([,value]) => !!value).map(([key]) => key)
          };

          try {
            setLoading(true)
            const resposta = await axios.post('/instrumentos/exportar/', selectedData);
            setLoading(false)
            if (resposta.status === 200) {
              setCsvContent(resposta?.data)
            } else {
              setError(true)
            }
          } catch (error) {
            console.error('Erro ao enviar dados para o backend:', error);
            setError(true)
          }

          setError(false);
        },
      }}
    >
      <DialogTitle>Exporte informações dos instrumentos</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: "row" }}>
        {!csvContent && <Box sx={{ display: 'flex', flexDirection: "column" }}>
          <FormControl sx={{ m: 2 }} component="fieldset" variant="standard">
            <FormLabel component="legend">Escolha quais informações deseja incluir no relatório:</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={valueCheckbox?.tag} onChange={handleChangeCheckbox} name="tag" />}
                label="Tag"
              />
              <FormControlLabel
                control={<Checkbox checked={valueCheckbox?.numeroDeSerie} onChange={handleChangeCheckbox} name="numeroDeSerie" />}
                label="Número de Série"
              />
              <FormControlLabel
                control={<Checkbox checked={valueCheckbox?.observacoes} onChange={handleChangeCheckbox} name="observacoes" />}
                label="Observações"
              />
              <FormControlLabel
                control={<Checkbox checked={valueCheckbox?.laboratorio} onChange={handleChangeCheckbox} name="laboratorio" />}
                label="Laboratório"
              />
              <FormControlLabel
                control={<Checkbox checked={valueCheckbox?.posicaoDoInstrumento} onChange={handleChangeCheckbox} name="posicaoDoInstrumento" />}
                label="Posição do Instrumento"
              />
              <FormControlLabel
                control={<Checkbox checked={valueCheckbox?.dataUltimaCalibracao} onChange={handleChangeCheckbox} name="dataUltimaCalibracao" />}
                label="Data Última Calibração"
              />
              <FormControlLabel
                control={<Checkbox checked={valueCheckbox?.frequenciaDeCalibracao} onChange={handleChangeCheckbox} name="frequenciaDeCalibracao" />}
                label="Frequência de Calibração"
              />
              <FormControlLabel
                control={<Checkbox checked={valueCheckbox?.dataDaProximaCalibracao} onChange={handleChangeCheckbox} name="dataDaProximaCalibracao" />}
                label="Data da Próxima Calibração"
              />
              <FormControlLabel
                control={<Checkbox checked={valueCheckbox?.dataDaProximaChecagem} onChange={handleChangeCheckbox} name="dataDaProximaChecagem" />}
                label="Data da Próxima Checagem"
              />
              <FormControlLabel
                control={<Checkbox checked={valueCheckbox?.local} onChange={handleChangeCheckbox} name="setor" />}
                label="Setor"
              />
            </FormGroup>
            {error && !Object.values(valueCheckbox).includes(true) &&
              <FormHelperText error={error && !Object.values(valueCheckbox).includes(true)}>
                Por favor, marque pelo menos uma opção.
              </FormHelperText>
            }
          </FormControl>
        </Box>}
        <InstrumentoTable 
          instrumentos={assets?.results} 
          valueCheckbox={valueCheckbox}
          selected={selected}
          setSelected={setSelected}
          selectAll={selectAll}
          handleCheckboxSelectAll={handleCheckboxSelectAll}
          csvContent={csvContent}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setCsvContent(null); handleClose() }}>Cancelar</Button>
        {!parsedCsv && (loading ? <CircularProgress /> : <Button disabled={!selected?.length} type="submit">Exportar</Button>)}
        {csvContent && <Button className='button' variant='outlined' endIcon={<PrintIcon />} onClick={handlePrint}>Imprimir</Button>}
        {csvContent && <CSVDownloader style={{ background: 'transparent', border: 0 }} variant="contained" type="button" filename="meus_instrumentos" bom data={parsedCsv}><Button variant='contained' endIcon={<DownloadIcon />}>Download</Button></CSVDownloader>}
      </DialogActions>
      <style>
              {`
                  @media print {
          @page {
              size: Legal landscape;
              margin: 1cm;
          }

          #print-section {
              width: 100%;
              transform: scale(0.95);
              transform-origin: top left;
          }

          button, .button {
              display: none;
          }

      } `}
      </style>
    </Dialog >
  )
}

export default ExportFilter