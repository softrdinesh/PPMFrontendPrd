import { Box, Grid, TextField } from '@mui/material'
import React from 'react'

function TaskGroupComponent() {
  return (
    <Box px={4} py={8} border={2} borderColor={'divider'} borderRadius={2}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Box display={'flex'} justifyContent={['center', 'end']}>
            <TextField size='small' />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TaskGroupComponent
