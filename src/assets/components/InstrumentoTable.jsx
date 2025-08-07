import React, { forwardRef } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Checkbox, Box
} from '@mui/material';
import { positionLabels } from '../../utils/assets';
import { fDate } from '../../utils/formatTime';

const InstrumentoTable = forwardRef(({ csvContent, selectAll, instrumentos, valueCheckbox, selected, setSelected, handleCheckboxSelectAll }, ref) => {
  const fieldMap = {
    tag: { label: 'Tag', path: 'tag' },
    numeroDeSerie: { label: 'Número de Série', path: 'numeroDeSerie' },
    observacoes: { label: 'Observações', path: 'observacaoStatus' },
    laboratorio: { label: 'Laboratório', path: 'laboratorio' },
    setor: { label: 'Setor', path: 'setor.nome' },
    posicaoDoInstrumento: { label: 'Posição do Instrumento', path: 'posicao' },
    dataUltimaCalibracao: { label: 'Data Última Calibração', path: 'dataUltimaCalibracao' },
    dataDaProximaCalibracao: { label: 'Data da Próxima Calibração', path: 'dataProximaCalibracao' },
    frequenciaDeCalibracao: { label: 'Frequência de Calibração', isComplex: true },
    dataUltimaChecagem: { label: 'Data Última Checagem', path: 'dataUltimaChecagem' },
    dataDaProximaChecagem: { label: 'Data da Próxima Checagem', path: 'dataProximaChecagem' },
    frequenciaDeChecagem: { label: 'Frequência de Checagem', isComplex: true },
  };

  const activeFields = Object.keys(valueCheckbox).filter((key) => valueCheckbox[key]);

  const handleRowSelect = (id) => {
    setSelected((prev) =>
      prev.includes(+id)
        ? prev.filter((x) => +x !== +id)
        : [...prev, +id]
    );
  };

  const getValue = (item, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], item) ?? '';
  };

  return (
    <div >
      <Table ref={ref} size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              {!csvContent && <Checkbox
                size="small"
                checked={selectAll}
                onChange={handleCheckboxSelectAll}
              />}
            </TableCell>
            {activeFields.map((fieldKey) => (
              <TableCell key={fieldKey}>
                {fieldMap[fieldKey]?.label || fieldKey}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {instrumentos?.map((inst) => (
            <TableRow key={inst.id} hover>
              <TableCell padding="checkbox">
                {!csvContent && <Checkbox
                  size="small"
                  checked={selected.includes(inst.id) || selectAll}
                  onChange={() => handleRowSelect(inst.id)}
                />}
              </TableCell>
              {activeFields.map((fieldKey) => {
                const field = fieldMap[fieldKey];
                if (field?.isComplex && fieldKey === 'frequenciaDeCalibracao') {
                  const freq = inst?.frequenciaCalibracao;
                  return (
                    <TableCell key={fieldKey}>
                      {freq
                        ? `${freq.quantidade} ${freq.periodo}`
                        : ''}
                    </TableCell>
                  );
                }

                if (field?.isComplex && fieldKey === 'frequenciaDeChecagem') {
                  const freq = inst?.frequenciaChecagem;
                  return (
                    <TableCell key={fieldKey}>
                      {freq
                        ? `${freq.quantidade} ${freq.periodo}`
                        : ''}
                    </TableCell>
                  );
                }

                if (fieldKey === 'posicaoDoInstrumento') {
                  const posicao = inst?.posicao;
                  return (
                    <TableCell key={fieldKey}>
                      {positionLabels[posicao]}
                    </TableCell>
                  );
                }

                if (fieldKey.includes("data")) {
                  return (
                    <TableCell key={fieldKey}>
                      {fDate(inst[field?.path], 'dd/MM/yyyy')}
                    </TableCell>
                  );
                }

                return (
                  <TableCell key={fieldKey}>
                    {getValue(inst, field.path)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

export default InstrumentoTable;
