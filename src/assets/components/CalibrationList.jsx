import { Box, Card, CardContent } from '@mui/material'
import React from 'react'
import useResponsive from '../../theme/hooks/useResponsive';
import CalibrationPanel from '../../clients/components/CalibrationPanel';

function CalibrationList({asset}) {
  const isMobile = useResponsive('down', 'md');

  return (
    <Card >
      <CardContent>
        <CalibrationPanel
          isMobile={isMobile}
          instrument={asset?.id}
        />
      </CardContent>
    </Card>
  )
}

export default CalibrationList