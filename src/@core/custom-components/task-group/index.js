import React from 'react'
import { Icon } from '@iconify/react'
import { Box, Grid, TextField, useTheme } from '@mui/material'
import DataTable from './data-grid'

function TaskGroupComponent() {
  const theme = useTheme()

  return (
    <Box px={4} py={8} border={2} borderColor={'divider'} borderRadius={2}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Box display={'flex'} justifyContent={['center', 'end']}>
            <TextField
              size='small'
              placeholder='Search'
              InputProps={{
                startAdornment: (
                  <Icon
                    icon={'mdi:search'}
                    style={{ marginRight: 10, color: theme?.palette?.secondary?.light }}
                    fontSize={24}
                  />
                )
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          {/* <TaskTable /> */}
          <DataTable />
        </Grid>
      </Grid>
    </Box>
  )
}

export default TaskGroupComponent
