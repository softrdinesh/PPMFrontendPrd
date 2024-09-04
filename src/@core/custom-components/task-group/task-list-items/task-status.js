import { addProjectStatus, fetchProjectStatusList, updateProjectStatus } from '@api/project'
import CustomButton from '@components/button'
import { Icon } from '@iconify/react'
import { Avatar, Box, Grid, IconButton, Menu, MenuItem, TextField, Tooltip, Typography, Zoom } from '@mui/material'
import { pattern } from '@patterns'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useWorkspace } from 'src/context/workspace-context'
import {
  generateStatusIcons,
  getContrastingTextColor,
  getHexColor,
  getLuminance,
  getStatusIconColor,
  getStatusIconSize
} from 'src/utils/functions'

const StatusMenuItem = ({ item, row, handleStatusChange, handleClose, handleEdit }) => {
  const generateTextColor = colorCode => {
    if (!colorCode) return null

    const hexColor = getHexColor(colorCode)
    const luminance = getLuminance(hexColor)

    if (luminance < 0.5) {
      return `${hexColor}`
    }

    return getContrastingTextColor(colorCode)
  }

  return (
    <Grid item xs={12}>
      {' '}
      <Box display={'flex'} alignItems={'stretch'} gap={2}>
        <Box
          component={MenuItem}
          key={item?.StatusID}
          borderRadius={1}
          color={generateTextColor(item?.Colorcode)}
          display={'flex'}
          gap={2}
          flex={1}
          p={0}
          alignItems={'center'}
          onClick={() => {
            if (row?.StatusID != item?.StatusID) {
              handleStatusChange(row, { StatusID: item?.StatusID })
            }
            handleClose()
          }}
        >
          <Avatar variant='rounded' sx={{ bgcolor: item?.Colorcode, width: 30, height: 30, p: 0 }}>
            {item?.TaskgroupID ? (
              <Icon
                icon={'material-symbols:table-chart-view-outline'}
                color={getContrastingTextColor(item?.Colorcode)}
                fontSize={22}
              />
            ) : (
              <Icon
                icon={generateStatusIcons(item?.Statusname)}
                color={getStatusIconColor(item?.Colorcode)}
                fontSize={getStatusIconSize(item?.Statusname)}
              />
            )}
          </Avatar>
          <Tooltip title={item?.Statusname}>
            <Typography flex={1} maxWidth={'140px'} textOverflow={'ellipsis'} overflow={'hidden'} whiteSpace={'nowrap'}>
              {item?.Statusname}
            </Typography>
          </Tooltip>
        </Box>
        {!item?.IsDefault && item?.TaskgroupID && (
          <IconButton onClick={() => handleEdit(item)}>
            <Icon icon={'mdi:pencil-outline'} fontSize={18} />
          </IconButton>
        )}
      </Box>
    </Grid>
  )
}

const TaskStatus = ({ row, handleStatusChange, refetch }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [formAnchor, setFormAnchor] = useState(null)
  const [isEdit, setIsEdit] = useState(null)
  const { statusList } = useWorkspace()

  const { data: dynamicStatus, refetch: refetchStatusList } = useQuery({
    queryKey: ['dynamic-status', row?.TaskGroupID],
    queryFn: () => fetchProjectStatusList({ taskGroupID: row?.TaskGroupID })
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting }
  } = useForm({ defaultValues: { Statusname: '', Colorcode: '' } })

  const handleOpen = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleFormClose = () => {
    setAnchorEl(formAnchor)
    setFormAnchor(null)
  }

  const generateBGColor = colorCode => {
    if (!colorCode) return 'background.default'

    const hexColor = getHexColor(colorCode)
    const luminance = getLuminance(hexColor)

    if (luminance < 0.5) {
      return `${hexColor}66`
    }

    return colorCode
  }

  const checkChangeInHexValue = value => {
    if (value === '' || (value?.startsWith('#') && (pattern.hexAllowed?.test(value?.slice(1)) || value?.length <= 1))) {
      return true
    }

    return false
  }

  const handleEdit = item => {
    setIsEdit(item?.StatusID)
    reset({ Statusname: item?.Statusname, Colorcode: item?.Colorcode })
    setFormAnchor(anchorEl)
    setAnchorEl(null)
  }

  const onSubmit = async data => {
    const body = {
      ...data,
      TaskgroupID: row?.TaskGroupID
    }
    if (isEdit) {
      const response = await updateProjectStatus({ body, id: isEdit })
      if (response?.status) {
        refetchStatusList()
        refetch()
        reset({ Statusname: '', Colorcode: '' })
        handleFormClose()
      }
    } else {
      const response = await addProjectStatus(body)
      if (response?.status) {
        refetchStatusList()
        reset({ Statusname: '', Colorcode: '' })
        handleFormClose()
      }
    }
  }

  return (
    <Box display={'flex'} alignItems={'center'} height={'100%'}>
      <Tooltip title={row?.Status?.Statusname}>
        <Box
          bgcolor={generateBGColor(row?.Status?.Colorcode)}
          borderRadius={1}
          maxWidth={'95%'}
          height={'60%'}
          display={'flex'}
          alignItems={'center'}
          color={getContrastingTextColor(generateBGColor(row?.Status?.Colorcode))}
          px={2}
          justifyContent={'center'}
          border={1}
          borderColor={'divider'}
          onClick={handleOpen}
          sx={{ cursor: 'pointer' }}
        >
          <Typography fontSize={'0.85rem'} textOverflow={'ellipsis'} overflow={'hidden'} color={'inherit'}>
            {row?.Status?.Statusname ?? 'None'}
          </Typography>
        </Box>
      </Tooltip>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        TransitionComponent={Zoom}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center' }}
        sx={{ '& .MuiList-root': { p: 0 } }}
      >
        <Box maxWidth={'500px'} p={4}>
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
                {statusList?.map(item => (
                  <StatusMenuItem
                    item={item}
                    row={row}
                    handleStatusChange={handleStatusChange}
                    key={item?.StatusID}
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
                    onClick={e => {
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
                {dynamicStatus?.map(item => (
                  <StatusMenuItem
                    item={item}
                    row={row}
                    handleStatusChange={handleStatusChange}
                    key={item?.StatusID}
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
        open={Boolean(formAnchor)}
        anchorEl={formAnchor}
        onClose={handleFormClose}
        TransitionComponent={Zoom}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center' }}
        sx={{ '& .MuiList-root': { p: 0 } }}
      >
        <Box maxWidth={'300px'} width={'100%'} p={4}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name='Statusname'
                  rules={{
                    required: 'Please enter a name for the label'
                  }}
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <TextField
                      {...field}
                      variant={'outlined'}
                      error={!!errors?.Statusname}
                      helperText={!!errors?.Statusname && errors?.Statusname?.message}
                      placeholder='eg. Status name'
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
                  <CustomButton size='small' variant='contained' circular type='submit' disabled={isSubmitting}>
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

export default TaskStatus
