import { createColumn } from '@api/task-group'
import CustomButton from '@components/button'
import { Icon } from '@iconify/react'
import { Box, Grid, Menu, MenuItem, TextField, Typography, useTheme, Zoom } from '@mui/material'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

const getIcon = key => {
  switch (key) {
    case 'USR':
      return 'tdesign:user'
    case 'TXT':
      return 'streamline:pencil'

    case 'DDL':
      return 'hugeicons:book-02'

    case 'DPK':
      return 'solar:calendar-date-linear'

    case 'LBL':
      return 'material-symbols:table-chart-view-outline'

    case 'NUM':
      return 'mingcute:dots-fill'

    default:
      return 'mingcute:dots-fill'
  }
}

const AddColumnsMenu = ({ open, close, columns, taskGroupAllData, refetchTaskGroup }) => {
  const theme = useTheme()
  const [selectedColumnType, setSelectedColumnType] = useState(null)

  const handleTypeClicked = e => {
    setSelectedColumnType(e)
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: { columnName: '' } })
  const handleTypeClose = () => setSelectedColumnType(null)

  const onSubmit = async data => {
    // Add logic here to add the new column
    await createColumn({ ...data, ...taskGroupAllData, columnTypeID: selectedColumnType?.ColumnTypeID }).then(() => {
      refetchTaskGroup()
      close()
      handleTypeClose()
      reset()
    })
  }

  return (
    <>
      <Menu
        open={Boolean(open)}
        onClose={close}
        anchorEl={open}
        TransitionComponent={Zoom}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Box component={'form'} onSubmit={handleSubmit(onSubmit)} p={4} maxWidth={'300px'}>
          {selectedColumnType ? (
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Box display={'flex'} gap={3} width={'200px'}>
                  <Typography fontWeight={'bold'} fontSize={13} textTransform={'uppercase'}>
                    {`Add ${selectedColumnType?.Title}`}
                  </Typography>
                  <Icon icon={getIcon(selectedColumnType?.Key)} fontSize={20} color={theme?.palette?.primary?.main} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='columnName'
                  control={control}
                  rules={{ required: 'Please name your column' }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      size='small'
                      placeholder='Enter a label for column'
                      {...field}
                      error={!!errors?.columnName}
                      helperText={errors?.columnName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                  <CustomButton
                    circular
                    variant='outlined'
                    color='secondary'
                    size='small'
                    onClick={handleTypeClose}
                  >{`Close`}</CustomButton>
                  <CustomButton
                    type='submit'
                    circular
                    variant='outlined'
                    endIcon={<Icon icon={'mdi:plus'} />}
                    size='small'
                  >{`Add  Column`}</CustomButton>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography fontWeight={'bold'} fontSize={13} textTransform={'uppercase'}>
                  Essentials
                </Typography>
              </Grid>
              {columns?.map(item => (
                <Grid item xs={12} md={6} key={item?.ColumnTypeID}>
                  <Box
                    component={MenuItem}
                    display={'flex'}
                    alignItems={'center'}
                    gap={3}
                    p={0}
                    px={0}
                    py={1}
                    onClick={() => handleTypeClicked(item)}
                  >
                    <Icon icon={getIcon(item?.Key)} fontSize={20} color={theme?.palette?.primary?.main} />
                    <Typography fontSize={14} textTransform={'capitalize'}>
                      {item?.Title}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Menu>
    </>
  )
}

export default AddColumnsMenu
