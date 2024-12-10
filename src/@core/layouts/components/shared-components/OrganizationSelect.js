import { Icon } from '@iconify/react'
import { Box, MenuItem, TextField, Typography } from '@mui/material'
import React from 'react'

const OrganizationSelect = () => {
  return (
    <TextField size='small' select value={'y'} fullWidth>
      <MenuItem value='y'>
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <Icon icon={'ri:building-line'} />
          <Typography>Your Organization</Typography>
        </Box>
      </MenuItem>
    </TextField>
  )
}

export default OrganizationSelect
