import React, { forwardRef, useMemo, useState } from 'react';
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
    laboratorio: { label: 'Laboratório', path: 'laboratorio' },
    setor: { label: 'Setor', path: 'setor.nome' },
    posicaoDoInstrumento: { label: 'Posição do Instrumento', path: 'posicao' },
    dataUltimaCalibracao: { label: 'Data Última Calibração', path: 'dataUltimaCalibracao' },
    dataDaProximaCalibracao: { label: 'Data da Próxima Calibração', path: 'dataProximaCalibracao' },
    frequenciaDeCalibracao: { label: 'Frequência de Calibração' },
    dataUltimaChecagem: { label: 'Data Última Checagem', path: 'dataUltimaChecagem' },
    dataDaProximaChecagem: { label: 'Data da Próxima Checagem', path: 'dataProximaChecagem' },
    frequenciaDeChecagem: { label: 'Frequência de Checagem' },
    normativos: { label: 'Normativos' },
  };

  const activeFields = Object.keys(valueCheckbox).filter((key) => valueCheckbox[key]);

  const handleRowSelect = (id, instrumento) => {
    setSelected((prev) => {
      const exists = prev.find((item) => item.id === id);
  
      if (exists) {
        return prev.filter((item) => item.id !== id);
      }
      return [...prev, { id, instrumento }];
    });
  };

  const getValue = (item, path) => {
    return path?.split('.')?.reduce((acc, part) => acc?.[part], item) ?? '';
  };

  const list = useMemo(() => {
    if (csvContent && !!selected?.length) {
      return selected?.map((inst) => inst?.instrumento)
    }
    return instrumentos
  }, [csvContent])

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
          {list?.map((inst) => (
            <TableRow key={inst.id} hover>
              <TableCell padding="checkbox">
                {!csvContent && <Checkbox
                  size="small"
                  checked={selected.find((instrumento) => +instrumento?.id === +inst?.id) || selectAll}
                  onChange={() => handleRowSelect(inst.id, inst)}
                />}
              </TableCell>
              {activeFields.map((fieldKey) => {
                const field = fieldMap[fieldKey];
                if (fieldKey === 'frequenciaDeCalibracao') {
                  const freq = inst?.frequenciaCalibracao;
                  return (
                    <TableCell key={fieldKey}>
                      {freq
                        ? `${freq.quantidade} ${freq.periodo}`
                        : ''}
                    </TableCell>
                  );
                }

                if (fieldKey === 'frequenciaDeChecagem') {
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

                if (fieldKey === 'normativos') {
                  const lastNorm = inst?.normativos?.length - 1
                  return (
                    <TableCell key={fieldKey}>
                      {inst?.normativos?.map((n, i) => `${n?.nome} ${i == lastNorm ? '.' : ','} `)}
                    </TableCell>
                  );
                }

                return (
                  <TableCell key={fieldKey}>
                    {getValue(inst, field?.path)}
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
