import { updateSubTask } from '@api/sub-task'
import { updateTask } from '@api/task'
import CustomButton from '@components/button'
import Chip from '@components/chip'
import { Icon } from '@iconify/react'
import { Box, Dialog, DialogContent, Grid, IconButton } from '@mui/material'
import { debounce } from 'lodash'
import moment from 'moment'
import React, { memo, useState } from 'react'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const DynamicDate = ({ columnData, rowData, dynamicValue, refetch, isSubTask }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState(dynamicValue?.DynamicColumnValues ?? null)

  const handleOpenDialog = () => {
    setSelectedDate(dynamicValue?.DynamicColumnValues ?? null)
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)

      const body = {
        DynamicID: dynamicValue?.DynamicID ?? null,
        AdditionalColumnID: columnData?.AdditionalColumnID,
        value: moment(selectedDate).format('LLL')
      }
      if (isSubTask) {
        body.TaskID = rowData?.TaskMasterID
        const response = await updateSubTask({ id: rowData?.SubTaskID, body })
        if (response) {
          refetch()
          handleClose()
        }
      } else {
        const response = await updateTask({ id: rowData?.TaskID, body })
        if (response) {
          refetch()
          setOpenDialog(false)
        }
      }
    } catch (error) {
      console.error('error :', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDateChange = date => {
    setIsSubmitting(false)
    setSelectedDate(moment(date).format('LLL'))
  }

  const debouncedClick = debounce(handleSave, 600)

  return (
    <div>
      {selectedDate ? (
        <Box display={'flex'} alignItems={'center'} gap={3} justifyContent={'space-between'} pr={2}>
          {selectedDate}
          <IconButton size='small' onClick={handleOpenDialog}>
            <Icon icon={'mdi:pencil-outline'} />
          </IconButton>
        </Box>
      ) : (
        <Chip label={'Pick a date'} size='small' onClick={handleOpenDialog} />
      )}

      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth='xs'
        sx={{ '& .MuiPaper-root': { backgroundColor: 'transparent' } }}
      >
        <DialogContent>
          <Grid container spacing={6}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <Box display={'flex'} justifyContent={'center'}>
                <DatePickerWrapper>
                  <DatePicker
                    showTimeSelect
                    selected={selectedDate ? moment(selectedDate).toDate() : null}
                    inline
                    autoComplete='off'
                    placeholderText='Pick a date'
                    onChange={handleDateChange}
                  />
                </DatePickerWrapper>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display={'flex'} justifyContent={'center'}>
                <CustomButton variant='contained' circular onClick={debouncedClick} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </CustomButton>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default memo(DynamicDate)
