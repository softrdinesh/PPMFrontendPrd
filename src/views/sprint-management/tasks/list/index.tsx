import { useState } from 'react'

import Link from 'next/link'

import { Button, Card, CardContent, Collapse, IconButton, Typography } from '@mui/material'

import classNames from 'classnames'

import { useSprintTaskManagement } from '@/context/sprint-tast-context'
import { useWorkspace } from '@/context/workspace-context'
import { routes } from '@/constants/routes'
import type { SprintItem } from '@/services/modules/sprint-item/types'
import TaskTableSprint from './table'
import SprintTimelineManagement from '../../sprints/groups/sprint-list/timeline'
import CustomButton from '@/components/button'

const SprintTasksList = () => {
  const { data } = useSprintTaskManagement()
  const { selected } = useWorkspace()

  if (!data?.length)
    return (
      <Card>
        <CardContent>
          <div className='w-full flex flex-col items-center gap-4'>
            <Typography variant='h6'>No Sprints are added to this workspace!</Typography>
            <Button
              size='small'
              variant='outlined'
              LinkComponent={Link}
              href={routes.workspace + selected?.WorkspaceID + '/sprints'}
            >
              Create Now?
            </Button>
          </div>
        </CardContent>
      </Card>
    )

  return <div className='space-y-3'>{data?.map(k => <CollapsibleSprintList key={k?.SprintID} sp={k} />)}</div>
}

export default SprintTasksList

function CollapsibleSprintList({ sp }: { sp: SprintItem }) {
  const { refetch } = useSprintTaskManagement()
  const [taskOpen, setTaskOpen] = useState(true)

  return (
    <div className='space-y-3'>
      <div className='w-full flex items-center gap-2'>
        {/* Collapse ON/OFF */}
        <div className='shrink-0'>
          <IconButton size='small' className='rounded' onClick={() => setTaskOpen(!taskOpen)}>
            <i className={classNames('ri-arrow-right-s-line', taskOpen && 'rotate-90')} />
          </IconButton>
        </div>

        <Typography className='font-semibold text-primary'>{sp?.Name}</Typography>

        <div
          id={`sprint-edit-items-${sp?.SprintID}`}
          className='flex-1  flex justify-end items-center gap-4 justify-self-end'
        >
          <SprintTimelineManagement original={sp} refetch={refetch} />

          <div>
            <Typography>Performance</Typography>
          </div>

          <div>
            <CustomButton
              size='small'
              variant='outlined'
              className='py-1 leading-4'
              startIcon={<i className='ri-arrow-left-right-line' />}
            >
              Complete
            </CustomButton>
          </div>
        </div>
      </div>

      <Collapse in={taskOpen}>
        <TaskTableSprint enabled={taskOpen} sp={sp} />
      </Collapse>
    </div>
  )
}
