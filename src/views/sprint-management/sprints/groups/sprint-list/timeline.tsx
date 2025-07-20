import { useEffect, useState } from 'react'

import { Button } from '@mui/material'

import moment from 'moment'

import type { SprintItem } from '@/services/modules/sprint-item/types'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { updateSprint } from '@/services/modules/sprint-item'

const DatePickerDynamic = ({
  startDate,
  endDate,
  onChange,
  render
}: {
  startDate: Date | null
  endDate: Date | null
  onChange: (v: [Date | null, Date | null]) => void
  render: any
}) => {
  return (
    <AppReactDatepicker
      monthsShown={2}
      selectsRange
      selected={startDate}
      startDate={startDate}
      endDate={endDate}
      onChange={onChange}
      customInput={render}
    />
  )
}

const SprintTimelineManagement = ({ original, refetch }: { original: SprintItem; refetch: () => void }) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleDateChange = async (dates: [Date | null, Date | null]) => {
    if (!dates) return

    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)

    if (start && end) {
      await updateSprint({
        id: original?.SprintID?.toString(),
        body: { SprintTimelineStart: start, SprintTimelineEnd: end }
      })
      refetch()
    }
  }

  useEffect(() => {
    if (original?.SprintTimelineStart) setStartDate(moment(original?.SprintTimelineStart).toDate())
    if (original?.SprintTimelineEnd) setEndDate(moment(original?.SprintTimelineEnd).toDate())
  }, [original?.SprintTimelineStart, original?.SprintTimelineEnd])

  if (!original?.SprintTimelineStart || !original?.SprintTimelineEnd)
    return (
      <DatePickerDynamic
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
        render={
          <Button
            size='small'
            className='rounded-full p-1 leading-3 px-2'
            variant={startDate && endDate ? 'contained' : 'outlined'}
          >
            {startDate && endDate
              ? `${moment(startDate).format('MMM DD')} - ${moment(endDate).format('MMM DD')}`
              : 'Add timeline'}
          </Button>
        }
      />
    )

  return (
    <DatePickerDynamic
      startDate={startDate}
      endDate={endDate}
      onChange={handleDateChange}
      render={
        <Button
          size='small'
          className='rounded-full p-1 leading-3 px-2'
          variant={startDate && endDate ? 'contained' : 'outlined'}
        >
          {`${moment(original?.SprintTimelineStart).format('MMM DD')} - ${moment(original?.SprintTimelineEnd).format('MMM DD')}`}
        </Button>
      }
    />
  )
}

export default SprintTimelineManagement
