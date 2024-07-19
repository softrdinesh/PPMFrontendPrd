import React, { useMemo, useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { Box, Card, Grid, TextField, Typography, useTheme } from '@mui/material'
import DataTable from './data-grid'
import CustomButton from '@components/button'
import DeleteDialog from '@custom-components/delete-dialog'

function TaskGroupComponent({ isLoading, taskList, taskGroupData, refetch }) {
  // ** States
  const [selectedRows, setSelectedRows] = useState([])
  const [showCard, setShowCard] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // ** Memo
  const showSelected = useMemo(() => selectedRows?.length !== 0, [selectedRows])

  // ** Hooks
  const theme = useTheme()

  // ** Functions
  const handleSelectedRows = values => {
    setSelectedRows(values)
  }

  const handleDelete = async () => {
    setDeleteOpen(false)
  }

  useEffect(() => {
    if (showSelected) {
      setShowCard(true)
    } else {
      const timeout = setTimeout(() => setShowCard(false), 200) // Duration of the unmounting animation

      return () => clearTimeout(timeout)
    }
  }, [showSelected])

  return (
    <Box px={4} py={8} border={2} borderColor={'divider'} borderRadius={1}>
      <Grid container spacing={7}>
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
          <DataTable
            isLoading={isLoading}
            taskList={taskList}
            taskGroupID={taskGroupData?.TaskGroupID}
            refetch={refetch}
            handleSelectedRows={handleSelectedRows}
          />
        </Grid>
        {showCard && (
          <Grid item xs={12}>
            <Card
              sx={{
                display: showCard ? 'block' : 'none',
                animation: showSelected ? 'slide-in-anime 200ms linear' : 'slide-out-anime 200ms linear'
              }}
            >
              <Box m={2} p={2} display={'flex'} gap={5} alignItems={'center'}>
                <Typography fontWeight={600}>{`${selectedRows?.length} entries  selected`}</Typography>
                <CustomButton
                  variant='contained'
                  size='small'
                  color='error'
                  sx={{
                    backgroundColor: theme => theme.palette.error.light + '44',
                    border: 1,
                    borderColor: 'error',
                    color: 'error.main',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: theme => theme.palette.error.light + '55'
                    }
                  }}
                  onClick={() => setDeleteOpen(true)}
                  startIcon={<Icon icon={'solar:trash-bin-minimalistic-2-bold'} color='red' />}
                >
                  Delete
                </CustomButton>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>
      <DeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        description={`All selected rows will be permenantly deleted! You cannot revert once deleted.`}
        onConfirm={handleDelete}
      />
    </Box>
  )
}

export default TaskGroupComponent
