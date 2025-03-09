import { Avatar, Box, Typography, useTheme } from '@mui/material';
import ScaleIcon from '@mui/icons-material/Scale';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ArticleIcon from '@mui/icons-material/Article';
import RateReviewIcon from '@mui/icons-material/RateReview';
import React from 'react'


function EmptyYet({ content, isMobile, isFiltering = false, table = false, isDashboard = false }) {
  const theme = useTheme()
  const messages = {
    proposta: isFiltering ? 'Nenhuma prosposta encontrada.' : 'Ainda não há propostas registradas.',
    instrumento: 'Ainda não há instrumentos registrados.',
    documento: isFiltering ? 'Nenhum documento encontrado.' : 'Ainda não há documentos registrados.',
    instrumentosProposta: 'Ops, parece que não tem nenhum instrumento registrado nessa proposta. Que tal adicionar um?',
    revisao: 'Tudo certo! Nenhuma revisão para aprovar.'
  }
  const icons = {
    proposta: <BorderColorIcon size="small" />,
    instrumento: <ScaleIcon size="small" />,
    documento: <ArticleIcon size="small" />,
    instrumentosProposta: <ScaleIcon size="small" />,
    revisao: <RateReviewIcon size="small" />,
  }
  return (
    <Box
      width="100%"
      bgcolor={theme?.palette?.info?.lighter}
      border={`solid 2px ${theme?.palette?.info?.lighter}`}
      borderRadius={isFiltering || table ? 0 : 2}
      display="flex"
      alignItems="center"
      padding={isDashboard ? 2 : 4}
      gap={2}
    >
      <Avatar variant='rounded' sx={{width: 35, height: 35, backgroundColor: theme?.palette?.info?.light}}>
        {icons[content]}
      </Avatar>
      <Typography
        variant='body1'
        color={theme?.palette?.info?.main}
        fontWeight={400}
      >
        {messages[content]}
      </Typography>
    </Box>
  )
}

export default EmptyYet