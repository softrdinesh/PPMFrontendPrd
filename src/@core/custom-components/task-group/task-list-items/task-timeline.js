// ** React Imports
import React, { memo, useState } from 'react'

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

const TaskTimeline = ({ row, handleTimeLineChange }) => {
  const [open, setOpen] = useState(false)

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting, isDirty }
  } = useForm({
    defaultValues: { TimelineStartDate: row?.TimelineStartDate ?? null, TimelineEndDate: row?.TimelineEndDate ?? null }
  })

  const handleClose = () => setOpen(false)

  const onSubmit = async data => {
    try {
      await handleTimeLineChange(row, data)
      handleClose()
    } catch (error) {
      console.log('error :', error)
    }
  }

  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'start'} height={'100%'}>
      {row?.TimelineStartDate || row?.TimelineEndDate ? (
        <Typography
          onClick={() => setOpen(true)}
        >{`${row?.TimelineStartDate ? moment(row?.TimelineStartDate).format(dateFormatMomentTask) : ''} - ${row?.TimelineEndDate ? moment(row?.TimelineEndDate).format(dateFormatMomentTask) : ''}`}</Typography>
      ) : (
        <Chip
          size='small'
          label='Pick a timeline'
          color='secondary'
          skin='light'
          onClick={() => setOpen(true)}
          sx={{ '&:hover': { backgroundColor: 'inherit' } }}
        />
      )}
      <Dialog open={open} TransitionComponent={Zoom} onClose={handleClose} fullWidth maxWidth='sm'>
        <Box
          p={3}
          bgcolor={'background.default'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography fontWeight={500} fontSize={'1.2rem'}>
            Timeline Picker
          </Typography>
          <IconButton onClick={handleClose}>
            <Icon icon={'mdi:close'} />
          </IconButton>
        </Box>
        <DialogContent>
          <Form control={control} onSubmit={handleSubmit(onSubmit)}>
            <DatePickerWrapper>
              <Grid container spacing={6}>
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
                        isClearable
                        maxDate={watch('TimelineEndDate')}
                        dateFormat={dateFormatPicker}
                        customInput={<TextField label='Timeline Start Date' fullWidth />}
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
                        isClearable
                        minDate={watch('TimelineStartDate')}
                        disabled={!watch('TimelineStartDate')}
                        dateFormat={dateFormatPicker}
                        customInput={<TextField label='Timeline End Date' fullWidth />}
                      />
                    )}
                  />
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
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default memo(TaskTimeline)
