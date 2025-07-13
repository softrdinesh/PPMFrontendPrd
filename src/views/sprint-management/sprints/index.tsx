'use client'

import { useEffect } from 'react'

import { Icon } from '@iconify/react'

import Grid from '@mui/material/Grid2'
import { Divider, TextField, Typography } from '@mui/material'

import { SprintManagementProvider } from '@/context/sprint-context'
import { useWorkspace } from '@/context/workspace-context'
import NewSprintGroup from './components/new-group'
import CustomButton from '@/components/button'
import SprintFilterButton from './components/filters'
import GroupList from './groups/list'

const SprintManagementPage = ({ workspaceID }: { workspaceID: string }) => {
  const { selected, setSelected, workspace } = useWorkspace()

  useEffect(() => {
    if (workspaceID && !selected) {
      const activeData = workspace?.find(value => value?.WorkspaceID?.toString() === workspaceID)

      if (activeData) setSelected(activeData)
    }
  }, [selected, setSelected, workspace, workspaceID])

  return (
    <SprintManagementProvider workspaceID={workspaceID}>
      <Grid container spacing={6}>
        <Grid size={12}>
          <div className='flex items-center justify-between'>
            {/* Project Title */}
            <Typography fontWeight={700} fontSize={'1.75rem'}>
              {`Sprints`}
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
                placeholder='Search ID, sprint name...'
                InputProps={{
                  startAdornment: <Icon icon={'ion:search'} style={{ marginRight: 10 }} fontSize={24} />
                }}
              />
            </div>

            {/* Buttons */}
            <div className='flex items-center gap-5 flex-wrap justify-center'>
              <NewSprintGroup />
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
              <SprintFilterButton />

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
          <GroupList />
        </Grid>
      </Grid>
    </SprintManagementProvider>
  )
}

export default SprintManagementPage
