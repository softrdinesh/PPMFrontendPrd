import { updateTask } from '@api/task'
import CustomButton from '@components/button'
import { Icon } from '@iconify/react'
import { Box, ClickAwayListener, IconButton, Menu, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Controller, Form, useForm } from 'react-hook-form'

const TaskTitle = ({ row, refetch }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, isDirty }
  } = useForm({
    defaultValues: { value: row?.Taskname ?? '' }
  })

  const handleOpen = e => {
    setAnchorEl(e.currentTarget)
    reset({ value: row?.Taskname ?? '' })
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSave = async data => {
    try {
      const body = { Taskname: data?.value }
      const response = await updateTask({ id: row?.TaskID, body })
      if (response) {
        refetch()
        handleCloseMenu()
      }
    } catch (error) {
      console.log('error :', error)
    }
  }

  return (
    <div>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} pr={4} width={'100%'}>
        <Typography
          variant='body2'
          overflow={'hidden'}
          textOverflow={'ellipsis'}
          whiteSpace={'nowrap'}
          m={0}
          lineHeight={'3.5rem'}
        >
          {row?.Taskname ?? '-'}
        </Typography>
        <IconButton size='small' onClick={handleOpen}>
          <Icon icon={'mdi:pencil-outline'} />
        </IconButton>
      </Box>
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleCloseMenu}>
        <Form control={control} onSubmit={handleSubmit(handleSave)}>
          <ClickAwayListener onClickAway={handleCloseMenu}>
            <Box sx={{ p: 2, width: 270 }} display={'flex'} alignItems={'center'} flexDirection={'column'} gap={4}>
              <Controller
                control={control}
                name='value'
                rules={{
                  required: true
                }}
                render={({ field, formState }) => (
                  <TextField
                    {...field}
                    error={!!formState?.errors?.value}
                    onChange={e => {
                      field?.onChange(e)
                    }}
                    size='small'
                    placeholder='Enter a value'
                  />
                )}
              />
              <Box display={'flex'} px={3} width={'100%'} alignItems={'center'} justifyContent={'space-between'}>
                <CustomButton size='small' variant='outlined' circular>
                  Close
                </CustomButton>
                <CustomButton
                  size='small'
                  variant='contained'
                  circular
                  type='submit'
                  disabled={isSubmitting || !isDirty}
                >
                  Save
                </CustomButton>
              </Box>
            </Box>
          </ClickAwayListener>
        </Form>
      </Menu>
    </div>
  )
}

export default TaskTitle
