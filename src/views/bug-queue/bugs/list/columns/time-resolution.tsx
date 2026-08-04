'use client'
import { useEffect, useRef, useState } from 'react'

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
  const timerStartTimeRef = useRef<number | null>(null)
  const [overtimeSeconds, setOvertimeSeconds] = useState<number>(0)
  const [isOvertime, setIsOvertime] = useState<boolean>(false)
  const roleData = localStorage.getItem('Role');
  const parsedData = JSON.parse((roleData)as any);
  const rolename = parsedData?.rolename;
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
          TimeResolution: formatted,
          TimerStart: 0
        }

        await updateBug({ body, id: bug?.BugID?.toString() })
      } else {
        toast.error('TimeResolution is in the past.')
      }

      refetch()
      setOpen(null)
    }
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

  const updateOvertimeInBackend = async (overtimeSeconds: number) => {
    try {
      const formattedOvertime = formatCountdown(overtimeSeconds)
      
      if (bug?.BugID) {
        const originalResolution = bug?.timeResolution || '0h 0m 0s'
        localStorage.setItem(`originalResolution_${bug.BugID}`, originalResolution)
      }
      
      await updateBug({
        body: {
          TimeResolution: formattedOvertime,
          TimerStart: 1
        },
        id: bug?.BugID?.toString()
      })
    } catch (error) {
  //    console.error('Failed to update overtime in backend:', error)
    }
  }

  const handleTimerToggle = async () => {
    if (bug?.isTimerStart) {
      const currentCountdown = countdown || bug?.timeResolution || '0h 0m 0s'
      const currentSeconds = parseResolutionToSeconds(currentCountdown)

      await updateBug({
        body: {
          TimerStart: 0,
          TimeResolution: currentCountdown
        },
        id: bug?.BugID?.toString()
      })
      timerStartTimeRef.current = null

      if (bug?.BugID) {
        localStorage.setItem(`pausedCountdownSeconds_${bug.BugID}`, currentSeconds.toString())
        localStorage.setItem(`pausedMode_${bug.BugID}`, isOvertime ? 'overtime' : 'countdown')

        localStorage.removeItem(`overtimeStartTime_${bug.BugID}`)
        localStorage.removeItem(`timerStartTime_${bug.BugID}`)
        localStorage.removeItem(`lastKnownCountdown_${bug.BugID}`)
      }
    } else {
      const pausedSecondsStr = bug?.BugID ? localStorage.getItem(`pausedCountdownSeconds_${bug.BugID}`) : null
      const pausedMode = bug?.BugID ? localStorage.getItem(`pausedMode_${bug.BugID}`) : null

      if (pausedSecondsStr && pausedMode === 'overtime' && bug?.BugID) {
        const pausedSeconds = parseInt(pausedSecondsStr, 10)
        const overtimeStart = Date.now() - pausedSeconds * 1000
        localStorage.setItem(`overtimeStartTime_${bug.BugID}`, overtimeStart.toString())

        await updateBug({ body: { TimerStart: 1 }, id: bug?.BugID?.toString() })

        localStorage.removeItem(`pausedCountdownSeconds_${bug.BugID}`)
        localStorage.removeItem(`pausedMode_${bug.BugID}`)

        timerStartTimeRef.current = null
      } else if (pausedSecondsStr && pausedMode === 'countdown' && bug?.BugID) {
        const pausedSeconds = parseInt(pausedSecondsStr, 10)
        const totalSeconds = parseResolutionToSeconds(bug?.timeResolution || '0h 0m 0s')
        const elapsedAtPause = totalSeconds - pausedSeconds
        const reconstructedStart = Date.now() - elapsedAtPause * 1000
        localStorage.setItem(`timerStartTime_${bug.BugID}`, reconstructedStart.toString())
        timerStartTimeRef.current = reconstructedStart

        await updateBug({ body: { TimerStart: 1 }, id: bug?.BugID?.toString() })

        localStorage.removeItem(`pausedCountdownSeconds_${bug.BugID}`)
        localStorage.removeItem(`pausedMode_${bug.BugID}`)
      } else {
        await updateBug({ body: { TimerStart: 1 }, id: bug?.BugID?.toString() })
        const now = Date.now()
        timerStartTimeRef.current = now
        if (bug?.BugID) localStorage.setItem(`timerStartTime_${bug.BugID}`, now.toString())

        if (bug?.BugID) {
          localStorage.removeItem(`pausedCountdownSeconds_${bug.BugID}`)
          localStorage.removeItem(`pausedMode_${bug.BugID}`)
        }
      }
    }

    refetch()
  }

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout
    let syncInterval: NodeJS.Timeout
    let overtimeInterval: NodeJS.Timeout

    if (bug?.timeResolution && bug?.isTimerStart) {
      const storedOvertimeStart = bug?.BugID ? localStorage.getItem(`overtimeStartTime_${bug.BugID}`) : null
      const storedStartTime = bug?.BugID ? localStorage.getItem(`timerStartTime_${bug.BugID}`) : null
      const storedLastKnownCountdown = bug?.BugID ? localStorage.getItem(`lastKnownCountdown_${bug.BugID}`) : null

      const now = Date.now()

      if (storedOvertimeStart) {
        const overtimeStartTime = parseInt(storedOvertimeStart, 10)
        let overtime = Math.floor((now - overtimeStartTime) / 1000)
        if (overtime < 0) overtime = 0

        setIsOvertime(true)
        setOvertimeSeconds(overtime)
        setCountdown(formatCountdown(overtime))

        overtimeInterval = setInterval(() => {
          setOvertimeSeconds(prev => {
            const newSeconds = prev + 1
            const formatted = formatCountdown(newSeconds)
            setCountdown(formatted)
            
            // Store last known countdown value
            if (bug?.BugID) {
              localStorage.setItem(`lastKnownCountdown_${bug.BugID}`, formatted)
            }

            if (newSeconds % 10 === 0) {
              updateOvertimeInBackend(newSeconds)
            }

            return newSeconds
          })
        }, 1000)
      } else {
        // IMPORTANT: Use stored last known countdown or current time resolution
        let currentTimeResolution = bug?.timeResolution || '0h 0m 0s'
        
        // If we have a stored last known countdown, use it
        if (storedLastKnownCountdown) {
          currentTimeResolution = storedLastKnownCountdown
          // Also update the bug's timeResolution in localStorage for next time
          if (bug?.BugID) {
            localStorage.setItem(`lastKnownCountdown_${bug.BugID}`, storedLastKnownCountdown)
          }
        }
        
        const totalSeconds = parseResolutionToSeconds(currentTimeResolution)

        let startTime: number

        if (storedStartTime) {
          startTime = parseInt(storedStartTime, 10)
          timerStartTimeRef.current = startTime
        } else if (timerStartTimeRef.current) {
          startTime = timerStartTimeRef.current
          if (bug?.BugID) localStorage.setItem(`timerStartTime_${bug.BugID}`, startTime.toString())
        } else {
          startTime = Date.now()
          timerStartTimeRef.current = startTime
          if (bug?.BugID) localStorage.setItem(`timerStartTime_${bug.BugID}`, startTime.toString())
        }

        const elapsedSeconds = Math.floor((now - startTime) / 1000)
        let remainingSeconds = totalSeconds - elapsedSeconds

        const currentIsOvertime = remainingSeconds < 0
        setIsOvertime(currentIsOvertime)

        if (currentIsOvertime) {
          let overtime: number

          const storedOvertimeStartNow = bug?.BugID ? localStorage.getItem(`overtimeStartTime_${bug.BugID}`) : null

          if (storedOvertimeStartNow) {
            const overtimeStartValue = parseInt(storedOvertimeStartNow, 10)
            overtime = Math.floor((now - overtimeStartValue) / 1000)
          } else {
            const overtimeStartTime = now - Math.abs(remainingSeconds) * 1000
            if (bug?.BugID) localStorage.setItem(`overtimeStartTime_${bug.BugID}`, overtimeStartTime.toString())
            overtime = Math.abs(remainingSeconds)
          }

          setOvertimeSeconds(overtime)
          setCountdown(formatCountdown(overtime))

          overtimeInterval = setInterval(() => {
            setOvertimeSeconds(prev => {
              const newSeconds = prev + 1
              const formatted = formatCountdown(newSeconds)
              setCountdown(formatted)
              
              // Store last known countdown value
              if (bug?.BugID) {
                localStorage.setItem(`lastKnownCountdown_${bug.BugID}`, formatted)
              }

              if (newSeconds % 10 === 0) {
                updateOvertimeInBackend(newSeconds)
              }

              return newSeconds
            })
          }, 1000)
        } else {
          const initialDisplay = formatCountdown(remainingSeconds)
          setCountdown(initialDisplay)
          
          // Store initial countdown value
          if (bug?.BugID) {
            localStorage.setItem(`lastKnownCountdown_${bug.BugID}`, initialDisplay)
          }

          countdownInterval = setInterval(() => {
            const currentNow = Date.now()
            const elapsed = Math.floor((currentNow - startTime) / 1000)
            const remaining = totalSeconds - elapsed

            if (remaining <= 0) {
              clearInterval(countdownInterval)
              clearInterval(syncInterval)
              setCountdown('0h 0m 0s')
              setIsOvertime(true)
              setOvertimeSeconds(0)

              if (bug?.BugID) {
                localStorage.setItem(`overtimeStartTime_${bug.BugID}`, currentNow.toString())
                localStorage.setItem(`originalResolution_${bug.BugID}`, bug.timeResolution)
                localStorage.setItem(`lastKnownCountdown_${bug.BugID}`, '0h 0m 0s')
              }

              updateOvertimeInBackend(0)

              overtimeInterval = setInterval(() => {
                setOvertimeSeconds(prev => {
                  const newSeconds = prev + 1
                  const formatted = formatCountdown(newSeconds)
                  setCountdown(formatted)
                  
                  // Store last known countdown value
                  if (bug?.BugID) {
                    localStorage.setItem(`lastKnownCountdown_${bug.BugID}`, formatted)
                  }

                  if (newSeconds % 10 === 0) {
                    updateOvertimeInBackend(newSeconds)
                  }

                  return newSeconds
                })
              }, 1000)
            } else {
              const formatted = formatCountdown(remaining)
              setCountdown(formatted)
              
              // Store last known countdown value on every tick
              if (bug?.BugID) {
                localStorage.setItem(`lastKnownCountdown_${bug.BugID}`, formatted)
              }
            }
          }, 1000)

          syncInterval = setInterval(() => {
            const currentNow = Date.now()
            const elapsed = Math.floor((currentNow - startTime) / 1000)
            const remaining = totalSeconds - elapsed
            if (remaining > 0) {
              const formatted = formatCountdown(remaining)
              updateBug({ body: { TimeResolution: formatted }, id: bug?.BugID?.toString() })
              
              // Also store in localStorage
              if (bug?.BugID) {
                localStorage.setItem(`lastKnownCountdown_${bug.BugID}`, formatted)
              }
            }
          }, 10000)
        }
      }
    } else {
      setCountdown(null)
      timerStartTimeRef.current = null
      setOvertimeSeconds(0)
      setIsOvertime(false)
      if (bug?.BugID) {
        localStorage.removeItem(`timerStartTime_${bug.BugID}`)
        localStorage.removeItem(`overtimeStartTime_${bug.BugID}`)
        localStorage.removeItem(`originalResolution_${bug.BugID}`)
        // Don't remove lastKnownCountdown - keep it for when timer restarts
      }
    }

    return () => {
      clearInterval(countdownInterval)
      clearInterval(syncInterval)
      clearInterval(overtimeInterval)
      
      // Save the current countdown value when component unmounts
      if (bug?.BugID && countdown) {
        localStorage.setItem(`lastKnownCountdown_${bug.BugID}`, countdown)
      }
    }
 
  }, [bug?.timeResolution, bug?.isTimerStart, bug?.BugID])

  const getDisplayTime = () => {
    if (isOvertime && countdown) {
      const originalResolution = bug?.BugID 
        ? localStorage.getItem(`originalResolution_${bug.BugID}`) 
        : null
      const originalTime = originalResolution || bug?.timeResolution || '0h 0m 0s'
      return `${originalTime} (+${countdown})`
    }
    return countdown || bug?.timeResolution || 'Add Time'
  }

  return (
    <div className='flex items-center gap-2'>
      {bug?.timeResolution  &&  rolename!='Viewer' && (
        <IconButton size='small' className='p-0' onClick={handleTimerToggle}>
          {!bug?.isTimerStart   ? (
            <i className='ri-play-circle-line text-textPrimary size-6' />
          ) : (
            <i className='ri-pause-circle-line text-primary size-6' />
          )}
        </IconButton>
      )}

      {!!bug?.isTimerStart && bug?.timeResolution ? (
            rolename!='Viewer' ? (
        <div className='px-1'>
          <Typography className={`text-sm font-medium ${isOvertime ? 'text-error' : 'text-primary'}`}>
            {getDisplayTime()}
          </Typography>
        </div>
            ):
               <div className='px-1'>
           <Typography className={`text-sm font-medium ${isOvertime ? 'text-error' : 'text-primary'}`}>
            {getDisplayTime()}
          </Typography>
        </div>
      ) : (
        rolename!='Viewer' ? (
 <Button size='small' className='text-sm' onClick={handleOpen}>
          {bug?.timeResolution || 'Add Time'}
        </Button>
        ):(

          <Typography variant="body1">{bug?.timeResolution || 'None'}</Typography>
        )
       
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
