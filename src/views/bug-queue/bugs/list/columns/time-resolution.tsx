'use client'
import { useEffect, useState } from 'react'

import { Button, Grid2, IconButton, Menu, Typography, Zoom } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'

import moment from 'moment'

import toast from 'react-hot-toast'

import CustomButton from '@/components/button'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import type { BugQueueListAPI } from '@/services/modules/bug-queue/types'
import { updateBug } from '@/services/modules/bug-queue'

interface Props {
  bug: BugQueueListAPI
  refetch: () => void
}

type FormType = {
  TimeResolution: Date | null
}

const TimeResolutionColumn = ({ bug, refetch }: Props) => {
  const [open, setOpen] = useState<any>(null)
  const [countdown, setCountdown] = useState<string | null>(null)

  const form = useForm<FormType>({ defaultValues: { TimeResolution: null } })

  const handleOpen = (e: any) => {
    setOpen(e?.currentTarget)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = async (data: FormType) => {
    if (data.TimeResolution) {
      const now = moment()
      const target = moment(data.TimeResolution)

      if (target.isAfter(now)) {
        const duration = moment.duration(target.diff(now))

        const hours = Math.floor(duration.asHours())
        const minutes = duration.minutes()
        const seconds = duration.seconds()

        const formatted = `${hours}h ${minutes}m ${seconds}s`

        const body = {
          TimeResolution: formatted
        }

        await updateBug({ body, id: bug?.BugID?.toString() })
      } else {
        toast.error('TimeResolution is in the past.')
      }

      refetch()

      setOpen(null)
    }
  }

  const handleTimerToggle = async () => {
    if (bug?.TimerStart) {
      await updateBug({ body: { TimerStart: 0, TimeResolution: countdown }, id: bug?.BugID?.toString() })
    } else {
      await updateBug({ body: { TimerStart: 1 }, id: bug?.BugID?.toString() })
    }

    refetch()
  }

  const parseResolutionToSeconds = (resolution: string) => {
    const regex = /(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/
    const match = resolution.match(regex)

    if (!match) return 0

    const hours = parseInt(match[1] || '0', 10)
    const minutes = parseInt(match[2] || '0', 10)
    const seconds = parseInt(match[3] || '0', 10)

    return hours * 3600 + minutes * 60 + seconds
  }

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    return `${h}h ${m}m ${s}s`
  }

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout
    let syncInterval: NodeJS.Timeout

    if (bug?.TimeResolution && bug?.TimerStart) {
      let remainingSeconds = parseResolutionToSeconds(bug.TimeResolution)

      setCountdown(formatCountdown(remainingSeconds))

      countdownInterval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds -= 1
          setCountdown(formatCountdown(remainingSeconds))
        } else {
          clearInterval(countdownInterval)
          clearInterval(syncInterval)
          setCountdown('0h 0m 0s')
        }
      }, 1000)

      // 🔄 Sync with backend every 10 seconds
      syncInterval = setInterval(() => {
        const formatted = formatCountdown(remainingSeconds)

        updateBug({ body: { TimeResolution: formatted }, id: bug?.BugID?.toString() })
      }, 10000)
    } else {
      setCountdown(null)
    }

    return () => {
      clearInterval(countdownInterval)
      clearInterval(syncInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bug?.TimeResolution, bug?.TimerStart])

  return (
    <div className='flex items-center gap-2'>
      {bug?.TimeResolution && (
        <IconButton size='small' className='p-0' onClick={handleTimerToggle}>
          {!bug?.TimerStart ? (
            <i className='ri-play-circle-line text-textPrimary size-6' />
          ) : (
            <i className='ri-pause-circle-line text-primary size-6' />
          )}
        </IconButton>
      )}

      {bug?.TimeResolution ? (
        <div>
          <Typography className='text-sm font-medium'>{countdown || bug?.TimeResolution || 'Add Time'}</Typography>
        </div>
      ) : (
        <Button size='small' onClick={handleOpen}>
          Add Time
        </Button>
      )}

      <Menu
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        TransitionComponent={Zoom}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        sx={{ '& .MuiList-root': { p: 0 } }}
      >
        <div className='p-2 max-w-[300px]'>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Grid2 container spacing={6}>
              <Grid2 size={12}>
                <div className='flex w-full justify-center'>
                  <Controller
                    control={form.control}
                    name='TimeResolution'
                    render={({ field }) => (
                      <AppReactDatepicker
                        inline
                        selected={field?.value}
                        showTimeInput
                        minDate={new Date()}
                        minTime={new Date()}
                        id='date-range-picker'
                        onChange={date => {
                          field?.onChange(date)
                        }}
                      />
                    )}
                  />
                </div>
              </Grid2>
              <Grid2 size={12}>
                <div className='flex justify-between gap-2 items-center'>
                  <CustomButton circular variant='outlined' color='secondary' onClick={handleClose}>
                    Close
                  </CustomButton>
                  <CustomButton
                    variant='contained'
                    circular
                    disabled={!form.formState.isDirty || form.formState.isSubmitting}
                    type='submit'
                  >
                    {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                  </CustomButton>
                </div>
              </Grid2>
            </Grid2>
          </form>
        </div>
      </Menu>
    </div>
  )
}

export default TimeResolutionColumn
