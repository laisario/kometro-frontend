import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Checkbox, Box
} from '@mui/material';
import { SelectAll } from '@mui/icons-material';

const InstrumentoTable = ({ csvContent, selectAll, instrumentos, valueCheckbox, selected, setSelected, handleCheckboxSelectAll }) => {
  const fieldMap = {
    tag: { label: 'Tag', path: 'tag' },
    numeroDeSerie: { label: 'Número de Série', path: 'numeroDeSerie' },
    observacoes: { label: 'Observações', path: 'observacaoStatus' },
    laboratorio: { label: 'Laboratório', path: 'laboratorio' },
    posicaoDoInstrumento: { label: 'Posição do Instrumento', path: 'posicao' },
    dataUltimaCalibracao: { label: 'Data Última Calibração', path: 'dataExpiracaoCalibracao' },
    frequenciaDeCalibracao: { label: 'Frequência de Calibração', isComplex: true },
    dataDaProximaCalibracao: { label: 'Data da Próxima Calibração', path: 'dataProximaCalibracao' },
    dataDaProximaChecagem: { label: 'Data da Próxima Checagem', path: 'dataProximaChecagem' },
    setor: { label: 'Setor', path: 'setor.nome' },
  };

  const activeFields = Object.keys(valueCheckbox).filter((key) => valueCheckbox[key]);

  const handleRowSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const getValue = (item, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], item) ?? '';
  };

  return (
    <Box>
      <Table size="small">
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
    </Box>
  );
};

export default InstrumentoTable;
