import { FormHelperText } from '@mui/material'
import React from 'react'

function errorMessage(error) {
  if (!error) return <></>

  return <FormHelperText error={error}>{error}</FormHelperText>
}

export default errorMessage
