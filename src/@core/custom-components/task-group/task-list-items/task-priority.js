import { addProjectPriority, fetchProjectPriorityList, updateProjectPriority } from '@api/project'
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography, Zoom } from '@mui/material'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useWorkspace } from 'src/context/workspace-context'
import { getContrastingTextColor, getHexColor } from 'src/utils/functions'

import CustomButton from '@components/button'
import { Icon } from '@iconify/react'
import { Avatar, Grid, TextField } from '@mui/material'
import { pattern } from '@patterns'
import { Controller, useForm } from 'react-hook-form'

const PriorityMenuItem = ({ item, row, handlePriorityChange, handleClose, handleEdit }) => {
  return (
    <Grid item xs={12}>
      <Box display={'flex'} alignItems={'stretch'} gap={2}>
        <Box
          component={MenuItem}
          flex={1}
          borderRadius={1}
          bgcolor={item?.Colorcode}
          textAlign={'center'}
          color={getContrastingTextColor(item?.Colorcode)}
          p={1}
          disableRipple
          justifyContent={'center'}
          disableTouchRipple
          sx={{ '&:hover': { bgcolor: getHexColor(item?.Colorcode) + '99' } }}
          onClick={() => {
            if (row?.PriorityID != item?.PriorityID) {
              handlePriorityChange(row, {
                PriorityID: item?.PriorityID,
                Title: row?.PriorityID ? 'Priority Changed' : 'Priority Added',
                Description: 'Task Priority has been updated',
                PreviousState: row?.Priority?.PriorityName,
                NewState: item?.PriorityName
              })
            }
            handleClose()
          }}
        >
          <Typography
            textOverflow={'ellipsis'}
            color={'inherit'}
            textAlign={'center'}
            overflow={'hidden'}
            whiteSpace={'nowrap'}
            maxWidth={'70px'}
          >
            {item?.PriorityName}
          </Typography>
        </Box>
        {!item?.IsDefault && item?.TaskgroupID && (
          <IconButton onClick={() => handleEdit(item)}>
            <Icon icon={'mdi:pencil-outline'} fontSize={16} />
          </IconButton>
        )}
      </Box>
    </Grid>
  )
}

const TaskPriority = ({ row, handlePriorityChange, refetch, canEdit }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [formAnchor, setFormAnchor] = useState(null)
  const [isEdit, setIsEdit] = useState(null)
  const { priorityList } = useWorkspace()

  const { data: dynamicPriority, refetch: refetchPriorityList } = useQuery({
    queryKey: ['project-priority', row?.TaskGroupID],
    queryFn: () => fetchProjectPriorityList({ taskGroupID: row?.TaskGroupID })
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isDirty }
  } = useForm({ defaultValues: { PriorityName: '', Colorcode: '' } })

  const handleOpen = e => {
    canEdit && setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setIsEdit(null)
  }

  const handleFormClose = () => {
    setAnchorEl(formAnchor)
    setFormAnchor(null)
    reset({ PriorityName: '', Colorcode: '' })
    setIsEdit(null)
  }

  const checkChangeInHexValue = value => {
    if (value === '' || (value?.startsWith('#') && (pattern.hexAllowed?.test(value?.slice(1)) || value?.length <= 1))) {
      return true
    }

    return false
  }

  const handleEdit = item => {
    setIsEdit(item?.PriorityID)
    reset({ PriorityName: item?.PriorityName, Colorcode: item?.Colorcode })
    setFormAnchor(anchorEl)
    setAnchorEl(null)
  }

  const onSubmit = async data => {
    const body = {
      ...data,
      TaskgroupID: row?.TaskGroupID
    }
    if (isEdit) {
      const response = await updateProjectPriority({ body, id: isEdit })
      if (response?.status) {
        refetchPriorityList()
        refetch()
        reset({ PriorityName: '', Colorcode: '' })
        handleFormClose()
      }
    } else {
      const response = await addProjectPriority(body)
      if (response?.status) {
        refetchPriorityList()
        reset({ PriorityName: '', Colorcode: '' })
        handleFormClose()
      }
    }
  }

  return (
    <Box display={'flex'} alignItems={'center'} height={'100%'}>
      <Box
        bgcolor={row?.Priority?.Colorcode}
        width={'80%'}
        borderRadius={1}
        height={'60%'}
        display={'flex'}
        px={1}
        alignItems={'center'}
        justifyContent={'center'}
        color={row?.Priority?.Colorcode && getContrastingTextColor(row?.Priority?.Colorcode)}
        border={1}
        borderColor={'divider'}
        onClick={handleOpen}
        sx={{ cursor: canEdit ? 'pointer' : 'not-allowed' }}
      >
        <Tooltip title={row?.Priority?.PriorityName}>
          <Typography fontSize={'0.85rem'} textOverflow={'ellipsis'} overflow={'hidden'} color={'inherit'}>
            {row?.Priority?.PriorityName ?? 'None'}
          </Typography>
        </Tooltip>
      </Box>
      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        TransitionComponent={Zoom}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        sx={{ '& .MuiList-root': { p: 0 } }}
      >
        <Box maxWidth={'400px'} p={4}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box pb={2}>
                <Typography fontWeight={700} fontSize={14}>
                  ESSENTIALS
                </Typography>
                <Typography variant='subtitle2' fontSize={12}>
                  Add or edit labels
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography fontWeight={700} fontSize={14} textTransform={'uppercase'}>
                  Your Labels
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={4} maxHeight={'200px'} sx={{ overflowY: 'auto' }}>
                {priorityList?.map(item => (
                  <PriorityMenuItem
                    item={item}
                    row={row}
                    handlePriorityChange={handlePriorityChange}
                    key={item?.PriorityID}
                    handleClose={handleClose}
                  />
                ))}
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={4} maxHeight={'200px'} sx={{ overflowY: 'auto' }}>
                <Grid item xs={12}>
                  <Box
                    component={MenuItem}
                    borderRadius={1}
                    display={'flex'}
                    gap={2}
                    p={0}
                    alignItems={'center'}
                    onClick={() => {
                      setFormAnchor(anchorEl)
                      setAnchorEl(null)
                    }}
                  >
                    <Avatar variant='rounded' sx={{ width: 30, height: 30, p: 0 }}>
                      <Icon icon={'mdi:plus-box-outline'} fontSize={18} />
                    </Avatar>

                    <Typography textOverflow={'ellipsis'} overflow={'hidden'} whiteSpace={'nowrap'}>
                      {'New Label'}
                    </Typography>
                  </Box>
                </Grid>
                {dynamicPriority?.map(item => (
                  <PriorityMenuItem
                    item={item}
                    row={row}
                    handlePriorityChange={handlePriorityChange}
                    key={item?.PriorityID}
                    handleClose={handleClose}
                    handleEdit={handleEdit}
                  />
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Menu>

      <Menu
        open={!!formAnchor}
        anchorEl={formAnchor}
        onClose={handleFormClose}
        TransitionComponent={Zoom}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        sx={{ '& .MuiList-root': { p: 0 } }}
      >
        <Box maxWidth={'300px'} width={'100%'} p={4}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name='PriorityName'
                  rules={{
                    required: 'Please enter a name for the label'
                  }}
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <TextField
                      {...field}
                      variant={'outlined'}
                      error={!!errors?.PriorityName}
                      helperText={!!errors?.PriorityName && errors?.PriorityName?.message}
                      placeholder='eg. Priority name'
                      InputProps={{
                        startAdornment: (
                          <Icon
                            icon={'material-symbols:table-chart-view-outline'}
                            fontSize={28}
                            style={{ marginRight: 12 }}
                          />
                        )
                      }}
                      inputProps={{ maxLength: 50 }}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='Colorcode'
                  rules={{
                    required: 'Please enter a color for field',
                    pattern: { value: pattern.hexValidate, message: 'Please enter a valid hex code' }
                  }}
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <TextField
                      {...field}
                      variant={'outlined'}
                      fullWidth
                      onChange={e => {
                        const colorValue = e?.target?.value
                        if (checkChangeInHexValue(colorValue)) {
                          field?.onChange(colorValue)
                        }
                      }}
                      error={!!errors?.Colorcode}
                      helperText={!!errors?.Colorcode && errors?.Colorcode?.message}
                      inputProps={{ maxLength: 7 }}
                      placeholder='eg. #hhhhhh'
                      InputProps={{ startAdornment: <input {...field} type='color' className='color-input' /> }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'} width={'100%'} alignItems={'center'} justifyContent={'space-between'}>
                  <CustomButton size='small' variant='outlined' circular onClick={handleFormClose}>
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
              </Grid>
            </Grid>
          </form>
        </Box>
      </Menu>
    </Box>
  )
}

export default TaskPriority
