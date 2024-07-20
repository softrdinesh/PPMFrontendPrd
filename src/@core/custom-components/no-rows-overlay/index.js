import { Stack, Typography } from '@mui/material'
import React from 'react'

const NoRowsOverlay = ({ title }) => {
  return (
    <Stack height='100%' alignItems='center' justifyContent='center' fontWeight={600} textTransform={'capitalize'}>
      <Typography fontWeight={500}>{title ?? 'No data found'}</Typography>
    </Stack>
  )
}

export default NoRowsOverlay
