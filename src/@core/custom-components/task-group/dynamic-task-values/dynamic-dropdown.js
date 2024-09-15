import { addDropdownItem, fetchProjectDropDownList } from '@api/project'
import { updateTask } from '@api/task'
import CustomButton from '@components/button'
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  createFilterOptions,
  FormControl,
  Grid,
  IconButton,
  Menu,
  TextField,
  Typography,
  Zoom
} from '@mui/material'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { getContrastingTextColor } from 'src/utils/functions'

const filter = createFilterOptions()

const DynamicDropdown = ({ columnData = null, rowData = null, dynamicValue = null, refetch }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const [createMenu, setCreateMenu] = useState(false)

  const { data: dropdownItems } = useQuery({
    queryKey: ['dropdown-items', rowData?.TaskGroupID],
    queryFn: () => fetchProjectDropDownList({ taskGroupID: rowData?.TaskGroupID })
  })

  const handleOpen = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const { handleSubmit, control } = useForm({ defaultValues: { dropdown: [] } })

  const onSubmit = async data => {
    try {
      if (data?.dropdown?.title) {
        const dropdownAddBody = {
          Valuetxt: data?.dropdown?.title,
          WorkspaceID: columnData?.WorkspaceID,
          ProjectID: columnData?.ProjectID,
          TaskGroupID: rowData?.TaskGroupID,
          TaskID: rowData?.TaskID
        }
        console.log('dropdownAddBody :', dropdownAddBody)
        const responseData = await addDropdownItem(dropdownAddBody)
        console.log('responseData :', responseData)
      }
    } catch (error) {
      console.error('error :', error)
    }
  }

  return (
    <Box display={'flex'} alignItems={'center'} height={'100%'}>
      <Box
        bgcolor={dynamicValue?.Priority?.Colorcode ?? 'background.default'}
        width={'80%'}
        borderRadius={1}
        height={'60%'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        color={dynamicValue?.Priority?.Colorcode && getContrastingTextColor(dynamicValue?.Priority?.Colorcode)}
        border={1}
        borderColor={'divider'}
        onClick={handleOpen}
        sx={{ cursor: 'pointer' }}
      >
        <Typography fontSize={'0.85rem'} textOverflow={'ellipsis'} overflow={'hidden'} color={'inherit'}>
          {dynamicValue?.Priority?.PriorityName ?? 'None'}
        </Typography>
      </Box>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        TransitionComponent={Zoom}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center' }}
        sx={{ '& .MuiList-root': { p: 0 } }}
      >
        <Box component={'form'} onSubmit={handleSubmit(onSubmit)} width='300px' p={2} ml={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} p={2}>
              <Box display={'flex'} alignItems={'center'} mt={2} gap={2}>
                <FormControl fullWidth>
                  <Controller
                    name='dropdown'
                    rules={{ required: true }}
                    control={control}
                    render={({ field: { value, onChange }, formState: { errors } }) => (
                      <Autocomplete
                        freeSolo
                        clearOnBlur
                        value={value}
                        handleHomeEndKeys
                        options={dropdownItems ?? []}
                        id='autocomplete-free-solo-with-text'
                        renderOption={(props, option) => (
                          <li {...props} key={option.title}>
                            {option.title}
                          </li>
                        )}
                        size='small'
                        renderInput={params => (
                          <TextField error={!!errors?.dropdown} size='small' fullWidth {...params} />
                        )}
                        getOptionLabel={option => {
                          if (typeof option === 'string') {
                            return option || ''
                          }
                          if (option.inputValue) {
                            return option.inputValue || ''
                          }

                          return option.title || ''
                        }}
                        onChange={(event, newValue) => {
                          if (typeof newValue === 'string') {
                            onChange({
                              title: newValue
                            })
                          } else if (newValue && newValue.inputValue) {
                            onChange({
                              title: newValue.inputValue
                            })
                          } else {
                            onChange(newValue)
                          }
                        }}
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params)
                          const { inputValue } = params
                          const isExisting = options.some(option => inputValue === option.title)

                          if (inputValue !== '' && !isExisting) {
                            filtered.push({
                              inputValue,
                              title: `Add "${inputValue}"`
                            })
                          }

                          return filtered
                        }}
                      />
                    )}
                  />
                </FormControl>
                <IconButton size='small'>
                  <Icon icon={'mdi:pencil-outline'} fontSize={25} />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box minHeight={'50px'}></Box>
            </Grid>
            <Grid item xs={12}>
              <Box display={'flex'} alignItems={'center'} justifyContent={createMenu ? 'space-between' : 'end'} p={2}>
                <CustomButton onClick={() => setCreateMenu(!createMenu)} size='small' variant='contained'>
                  {createMenu ? 'Back' : 'Create a new label'}
                </CustomButton>
                {createMenu && (
                  <CustomButton type='submit' size='small' variant='contained'>
                    {'Save'}
                  </CustomButton>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Menu>
    </Box>
  )
}

export default DynamicDropdown
