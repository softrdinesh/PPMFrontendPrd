import Link from 'next/link'

import { Button, Card, CardContent, Typography } from '@mui/material'

import { useSprintTaskManagement } from '@/context/sprint-tast-context'
import { useWorkspace } from '@/context/workspace-context'
import { routes } from '@/constants/routes'

const SprintTasksList = () => {
  const { data } = useSprintTaskManagement()
  const { selected } = useWorkspace()

  console.log(data, 'selected')
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

  return <>hello</>
}

export default SprintTasksList
