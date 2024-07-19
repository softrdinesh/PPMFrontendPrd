import CustomButton from '@components/button'
import Chip from '@components/chip'
import { Icon } from '@iconify/react'
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Typography,
  Zoom
} from '@mui/material'
import React, { memo, useState } from 'react'
import DatePicker from 'react-datepicker'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, Form, useForm } from 'react-hook-form'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { dateFormatPicker } from 'src/constants/formats'

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
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
      {row?.TimelineStartDate || row?.TimelineEndDate ? (
        <Typography>{`${row?.TimelineStartDate ?? ''} - ${row?.TimelineEndDate ?? ''}`}</Typography>
      ) : (
        <Chip size='small' label='Pick a timeline' color='secondary' skin='light' onClick={() => setOpen(true)} />
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
                        selected={field?.value}
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
                        selected={field?.value}
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
