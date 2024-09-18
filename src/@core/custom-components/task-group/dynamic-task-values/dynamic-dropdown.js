import { addDropdownItem, fetchProjectDropDownList } from '@api/project'
import { deleteDynamicValue, updateTask } from '@api/task'
import CustomButton from '@components/button'
import Chip from '@components/chip'
import { Icon } from '@iconify/react'
import { Autocomplete, Box, FormControl, Grid, IconButton, Menu, TextField, Typography, Zoom } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

const DynamicDropdown = ({ columnData = null, rowData = null, dynamicValue = null, refetch }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const [createMenu, setCreateMenu] = useState(false)

  const { data: dropdownItems, refetch: refetchDDL } = useQuery({
    queryKey: ['dropdown-items', rowData?.TaskGroupID],
    queryFn: () => fetchProjectDropDownList({ taskGroupID: rowData?.TaskGroupID })
  })

  const listItems = useMemo(() => {
    const finalArr = dropdownItems?.filter(i =>
      dynamicValue?.every(val => val?.Dropdown?.Dynamic_ddl_ID !== i?.Dynamic_ddl_ID)
    )

    return finalArr ?? []
  }, [dynamicValue, dropdownItems])

  const handleOpen = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const { handleSubmit, control } = useForm({ defaultValues: { dropdown: [] } })

  const onSubmit = async data => {
    try {
      if (createMenu) {
        const dropdownAddBody = {
          Valuetxt: data?.dropdown,
          WorkspaceID: columnData?.WorkspaceID,
          ProjectID: columnData?.ProjectID,
          TaskGroupID: rowData?.TaskGroupID,
          TaskID: rowData?.TaskID
        }
        const responseData = await addDropdownItem(dropdownAddBody)
        if (responseData?.status) {
          refetchDDL()
          setCreateMenu(false)
        }
      }
    } catch (error) {
      console.error('error :', error)
    }
  }

  const handleDropdownSelect = async item => {
    try {
      const body = {
        DynamicID: null,
        AdditionalColumnID: columnData?.AdditionalColumnID,
        value: item?.Dynamic_ddl_ID
      }
      const response = await updateTask({ id: rowData?.TaskID, body })
      if (response) {
        refetch()
      }
    } catch (error) {
      console.error('error select ddl :', error)
    }
  }

  const handleDeleteLabel = async id => {
    await deleteDynamicValue(id)
    refetch()
  }

  return (
    <Box display={'flex'} alignItems={'center'} height={'100%'}>
      <Box onClick={handleOpen} sx={{ cursor: 'pointer' }}>
        {dynamicValue?.length ? (
          <Box display={'flex'} alignItems={'center'} gap={2}>
            <Chip label={dynamicValue?.[0]?.Dropdown?.Valuetxt} />
            {dynamicValue?.length >= 2 && `+${dynamicValue?.length - 1}`}
          </Box>
        ) : (
          <IconButton>
            <Icon icon={'bi:plus-circle-dotted'} />
          </IconButton>
        )}
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
        {createMenu ? (
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
                        <TextField
                          value={value}
                          onChange={onChange}
                          error={!!errors?.dropdown}
                          size='small'
                          placeholder='Dropdown name'
                        />
                      )}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box minHeight={'50px'}></Box>
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} p={2}>
                  <CustomButton circular onClick={() => setCreateMenu(false)} size='small' variant='contained'>
                    {'Back'}
                  </CustomButton>
                  <CustomButton circular type='submit' size='small' variant='contained'>
                    {'Save'}
                  </CustomButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box width='300px' p={2} ml={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} p={2}>
                <Box display={'flex'} alignItems={'center'} mt={2} gap={2}>
                  <FormControl fullWidth>
                    <Autocomplete
                      clearOnBlur
                      value={null}
                      options={listItems ?? []}
                      id='autocomplete-free-solo-with-text'
                      renderOption={(props, option) => (
                        <li {...props} key={option.Valuetxt}>
                          {option.Valuetxt}
                        </li>
                      )}
                      size='small'
                      renderInput={params => <TextField size='small' fullWidth {...params} />}
                      getOptionLabel={option => {
                        return option.Valuetxt || ''
                      }}
                      onChange={(event, newValue) => {
                        handleDropdownSelect(newValue)
                      }}
                    />
                  </FormControl>
                  <IconButton size='small'>
                    <Icon icon={'mdi:pencil-outline'} fontSize={25} />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box minHeight={'50px'}>
                  {dynamicValue?.length ? (
                    <Box display={'flex'} alignItems={'center'} flexWrap={'wrap'} rowGap={3} columnGap={3}>
                      {dynamicValue?.map(i => (
                        <Box
                          key={i?.Dropdown?.Dynamic_ddl_ID}
                          borderRadius={10}
                          py={1}
                          px={3}
                          bgcolor={'#DCE3F6'}
                          border={1.2}
                          borderColor={'#004AAA'}
                          display={'flex'}
                          alignItems={'center'}
                          gap={2.5}
                        >
                          <Typography lineHeight={1} fontSize={14}>
                            {i?.Dropdown?.Valuetxt}
                          </Typography>
                          <IconButton size='small' sx={{ p: 0 }} onClick={() => handleDeleteLabel(i?.DynamicID)}>
                            <Icon icon={'ep:close-bold'} color='red' />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    'No DDL SELECTED'
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'end'} p={2}>
                  <CustomButton onClick={() => setCreateMenu(true)} size='small' variant='contained'>
                    {'Create a new label'}
                  </CustomButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default DynamicDropdown
