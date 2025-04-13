'use client'

import { useEffect } from 'react'

import Grid from '@mui/material/Grid2'

import { Divider, TextField, Typography } from '@mui/material'

import { Icon } from '@iconify/react'

import CustomButton from '@/components/button'
import { BugQueueProvider } from '@/context/bug-queue-context'
import { useWorkspace } from '@/context/workspace-context'
import BugQueueGroup from './bugs/groups'
import NewBugQueue from './main-screen/add-button'
import ProjectFilterButton from './main-screen/filters'
import ProjectInvitePeople from './main-screen/invite-people'

const BugQueueComponent = ({ workspaceID }: { workspaceID: string }) => {
  const { selected, setSelected, workspace } = useWorkspace()

  useEffect(() => {
    if (workspaceID && !selected) {
      const activeData = workspace?.find(value => value?.WorkspaceID?.toString() === workspaceID)

      if (activeData) setSelected(activeData)
    }
  }, [selected, setSelected, workspace, workspaceID])

  return (
    <BugQueueProvider>
      <Grid container spacing={6}>
        <Grid size={12}>
          <div className='flex items-center justify-between'>
            {/* Project Title */}
            <Typography fontWeight={700} fontSize={'1.75rem'}>
              {'Bug Queue'}
            </Typography>
          </div>
        </Grid>
        <Grid size={12}>
          <div className='flex items-center justify-between gap-5 flex-wrap-reverse'>
            {/* Search  */}
            <div className='flex-1 min-w-[300px]'>
              <TextField
                fullWidth
                size='small'
                placeholder='Search ID, task, Project, Keywords...'
                InputProps={{
                  startAdornment: <Icon icon={'ion:search'} style={{ marginRight: 10 }} fontSize={24} />
                }}
              />
            </div>

            {/* Buttons */}
            <div className='flex items-center gap-5 flex-wrap justify-center'>
              {true && <NewBugQueue />}
              <ProjectInvitePeople IsOpen={false} users={[]} />
              <Divider orientation='vertical' sx={{ borderColor: 'primary.main', height: 25, borderRightWidth: 1.5 }} />
              <div className='flex items-center gap-3'>
                <CustomButton variant='contained' sx={{ px: 2, minWidth: 'auto' }}>
                  <Icon icon={'fluent:pause-24-filled'} rotate={90} fontSize={20} />
                </CustomButton>
                <CustomButton variant='text' sx={{ px: 2, minWidth: 'auto' }}>
                  <Icon icon={'hugeicons:menu-circle'} rotate={90} fontSize={20} />
                </CustomButton>
              </div>

              {/* Filter Button */}
              <ProjectFilterButton />

              <CustomButton
                variant='outlined'
                startIcon={<Icon icon={'solar:calendar-date-outline'} style={{ marginInline: 2 }} />}
                endIcon={<Icon icon={'akar-icons:chevron-down'} style={{ marginInline: 5 }} />}
                sx={{ px: 3.5 }}
              >
                Today
              </CustomButton>
            </div>
          </div>
        </Grid>
        <Grid size={12}>
          <BugQueueGroup />
        </Grid>
      </Grid>
    </BugQueueProvider>
  )
}

export default BugQueueComponent
