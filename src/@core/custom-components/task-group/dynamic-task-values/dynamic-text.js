import { updateSubTask } from '@api/sub-task'
import { updateTask } from '@api/task'
import CustomButton from '@components/button'
import { Icon } from '@iconify/react'
import { Box, ClickAwayListener, IconButton, Menu, TextField } from '@mui/material'
import { pattern } from '@patterns'
import React, { useState } from 'react'
import { Controller, Form, useForm } from 'react-hook-form'

const DynamicText = ({ columnData, rowData, dynamicValue, refetch, number, isSubTask }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, isDirty }
  } = useForm({
    defaultValues: { value: dynamicValue?.DynamicColumnValues ?? '' }
  })

  const handleOpen = e => {
    setAnchorEl(e.currentTarget)
    reset({ value: dynamicValue?.DynamicColumnValues ?? '' })
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSave = async data => {
    try {
      const body = {
        DynamicID: dynamicValue?.DynamicID ?? null,
        AdditionalColumnID: columnData?.AdditionalColumnID,
        value: data?.value
      }
      if (isSubTask) {
        body.TaskID = rowData?.TaskMasterID
        const response = await updateSubTask({ id: rowData?.SubTaskID, body })
        if (response) {
          refetch()
          handleCloseMenu()
        }
      } else {
        const response = await updateTask({ id: rowData?.TaskID, body })
        if (response) {
          refetch()
          handleCloseMenu()
        }
      }
    } catch (error) {
      console.error('error :', error)
    }
  }

  return (
    <div>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} pr={4}>
        {dynamicValue?.DynamicColumnValues ?? '-'}
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
                      if (number) {
                        if (e?.target?.value === '' || pattern.numbersAllowed?.test(e?.target?.value)) {
                          field.onChange(e)
                        }
                      } else {
                        field?.onChange(e)
                      }
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

export default DynamicText
