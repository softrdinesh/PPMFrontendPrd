import { deleteMultipleTask } from '@api/task'
import CustomButton from '@components/button'
import DeleteDialog from '@custom-components/delete-dialog'
import { Icon } from '@iconify/react'
import { Box, Card, Grid, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Table from './table'

function TaskGroupComponent({
  users,
  isLoading,
  isRefetching,
  taskList,
  taskGroupData,
  refetch,
  projectID,
  projectData,
  refetchTaskGroup,
  role
}) {
  // ** States
  const [selectedRows, setSelectedRows] = useState({})
  const [showCard, setShowCard] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // ** Memos
  const showSelected = useMemo(() => Object?.keys(selectedRows)?.length !== 0, [selectedRows])

  const handleDelete = async () => {
    const finalArray = taskList
      ?.filter((i, idx) => Object?.keys(selectedRows)?.some(k => +k === +idx))
      ?.map(t => t?.TaskID)

    await deleteMultipleTask(finalArray)
    await refetch()
    setDeleteOpen(false)
    setSelectedRows({})
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
    <Box px={[0, 4]} py={[4, 8]} border={[0, 2]} borderColor={['divider', 'divider']} borderRadius={1}>
      <Grid container spacing={7}>
        {/* <Grid item xs={12}>
          <Box display={'flex'} justifyContent={['center', 'end']}>
            <TextField
              size='small'
              placeholder='Search'
              InputProps={{
                startAdornment: (
                  <Icon
                    icon={'ion:search'}
                    style={{ marginRight: 10, color: theme?.palette?.secondary?.light }}
                    fontSize={24}
                  />
                )
              }}
            />
          </Box>
        </Grid> */}
        <Grid item xs={12} overflow={'hidden'}>
          <Table
            users={users}
            role={role}
            key={taskGroupData?.TaskGroupID}
            projectID={projectID}
            isLoading={isLoading}
            isRefetching={isRefetching}
            taskList={taskList}
            taskGroupData={taskGroupData}
            taskGroupID={taskGroupData?.TaskGroupID}
            refetch={refetch}
            projectData={projectData}
            refetchTaskGroup={refetchTaskGroup}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </Grid>
        {showCard && role?.RoleName !== 'Viewer' && (
          <Grid item xs={12}>
            <Card
              sx={{
                display: showCard ? 'block' : 'none',
                animation: showSelected ? 'slide-in-anime 200ms linear' : 'slide-out-anime 200ms linear'
              }}
            >
              <Box m={2} p={2} display={'flex'} gap={5} alignItems={'center'}>
                <Typography fontWeight={600}>{`${Object?.keys(selectedRows)?.length} entries  selected`}</Typography>
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
