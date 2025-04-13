'use client'

import { useState } from 'react'

import dynamic from 'next/dynamic'

import { Card, CardContent, Collapse, IconButton, Typography } from '@mui/material'

import { useWorkspace } from '@/context/workspace-context'

const BugList = dynamic(() => import('./list'), {
  ssr: false
})

const BugQueueGroup = () => {
  const { selected } = useWorkspace()
  const [collapse, setCollapse] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])

  const toggleCollapse = () => setCollapse(!collapse)

  return (
    <Card className='rounded-lg'>
      <div className='py-2 px-3 flex items-center gap-2 justify-between'>
        <div className='flex items-center gap-2'>
          <IconButton size='small' className='rounded-xl' onClick={toggleCollapse}>
            <i className={`ri-arrow-right-s-line transition-all duration-300 ${collapse ? 'rotate-90' : ''}`} />
          </IconButton>

          <Typography className='font-semibold text-lg'>Incoming Bugs</Typography>
        </div>
      </div>

      <Collapse in={collapse}>
        <CardContent>
          {selected?.WorkspaceID && (
            <BugList
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              workspaceID={selected?.WorkspaceID}
            />
          )}
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default BugQueueGroup
