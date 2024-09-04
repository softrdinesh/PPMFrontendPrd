// ** React Imports
import React, { memo, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Zoom from '@mui/material/Zoom'

// ** Third Party Imports
import { Icon } from '@iconify/react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { Controller, Form, useForm } from 'react-hook-form'

// ** Custom Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomButton from '@components/button'
import Chip from '@components/chip'

// ** Custom Functions
import { dateFormatMomentTask, dateFormatPicker } from 'src/constants/formats'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { Menu } from '@mui/material'

const TaskTimeline = ({ row, handleTimeLineChange }) => {
  const [open, setOpen] = useState(false)

  const {
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { isSubmitting, isDirty }
  } = useForm({
    defaultValues: { TimelineStartDate: row?.TimelineStartDate ?? null, TimelineEndDate: row?.TimelineEndDate ?? null }
  })

  console.log('row?.TimelineEndDate :', moment(row?.TimelineEndDate)?.toDate())
  const handleClose = () => setOpen(false)

  const onSubmit = async data => {
    try {
      await handleTimeLineChange(row, data)
      handleClose()
    } catch (error) {
      console.error('error :', error)
    }
  }

  useEffect(() => {
    if (open) {
      reset({ TimelineStartDate: row?.TimelineStartDate ?? null, TimelineEndDate: row?.TimelineEndDate ?? null })
    }
  }, [open])

  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'start'} height={'100%'}>
      {row?.TimelineStartDate || row?.TimelineEndDate ? (
        <Typography
          onClick={e => setOpen(e?.currentTarget)}
        >{`${row?.TimelineStartDate ? moment(row?.TimelineStartDate).format(dateFormatMomentTask) : ''} - ${row?.TimelineEndDate ? moment(row?.TimelineEndDate).format(dateFormatMomentTask) : ''}`}</Typography>
      ) : (
        <Chip
          size='small'
          label='Pick a timeline'
          color='secondary'
          skin='light'
          onClick={e => setOpen(e?.currentTarget)}
          sx={{ '&:hover': { backgroundColor: 'inherit' } }}
        />
      )}
      <Menu
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        TransitionComponent={Zoom}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center' }}
        sx={{ '& .MuiList-root': { p: 0 } }}
      >
        <Box p={2} maxWidth={'300px'}>
          <Form control={control} onSubmit={handleSubmit(onSubmit)}>
            <DatePickerWrapper>
              <Grid container spacing={6} py={5}>
                <Grid item xs={6}>
                  <Controller
                    name='TimelineStartDate'
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field?.value ? moment(field?.value)?.toDate() : null}
                        withPortal
                        onChange={date => {
                          field.onChange(date)
                          if (!date) {
                            setValue('TimelineEndDate', null)
                          }
                        }}
                        maxDate={watch('TimelineEndDate')}
                        dateFormat={dateFormatPicker}
                        customInput={
                          <TextField size='small' label='Timeline Start Date' fullWidth autoComplete='off' />
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='TimelineEndDate'
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field?.value ? moment(field?.value)?.toDate() : null}
                        withPortal
                        {...field}
                        minDate={watch('TimelineStartDate')}
                        disabled={!watch('TimelineStartDate')}
                        dateFormat={dateFormatPicker}
                        customInput={<TextField size='small' label='Timeline End Date' fullWidth autoComplete='off' />}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display={'flex'} width={'100%'} justifyContent={'center'}>
                    <DatePicker
                      inline
                      startDate={watch('TimelineStartDate') ? moment(watch('TimelineStartDate'))?.toDate() : null}
                      selectsRange
                      readOnly
                      endDate={watch('TimelineEndDate') ? moment(watch('TimelineEndDate'))?.toDate() : null}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={3} gap={4}>
                    <CustomButton circular variant='outlined' color='secondary' onClick={handleClose}>
                      Close
                    </CustomButton>
                    <CustomButton circular variant='contained' type='submit' disabled={!isDirty || isSubmitting}>
                      {isSubmitting ? <CircularProgress color='secondary' size={20} /> : `Save`}
                    </CustomButton>
                  </Box>
                </Grid>
              </Grid>
            </DatePickerWrapper>
          </Form>
        </Box>
      </Menu>
    </Box>
  )
}

export default memo(TaskTimeline)
