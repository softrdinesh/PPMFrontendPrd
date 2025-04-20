'use client'

import { useEffect, useMemo, useState } from 'react'

import { Card, CardContent, Collapse, IconButton, Typography } from '@mui/material'

import { useWorkspace } from '@/context/workspace-context'

import BugList from './list'
import DeleteBugsComponent from './delete-bugs'

const BugQueueGroup = () => {
  const { selected } = useWorkspace()
  const [collapse, setCollapse] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [showCard, setShowCard] = useState(false)

  const showSelected = useMemo(() => Object?.keys(selectedRows)?.length !== 0, [selectedRows])

  const toggleCollapse = () => setCollapse(!collapse)

  useEffect(() => {
    if (showSelected) {
      setShowCard(true)
    } else {
      const timeout = setTimeout(() => setShowCard(false), 200) // Duration of the unmounting animation

      return () => clearTimeout(timeout)
    }
  }, [showSelected])

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
        <CardContent className='space-y-4'>
          {selected?.WorkspaceID && (
            <BugList
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              workspaceID={selected?.WorkspaceID}
            />
          )}

          <DeleteBugsComponent showCard={showCard} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default BugQueueGroup
