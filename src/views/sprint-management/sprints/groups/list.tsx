import { useState } from 'react'

import { Card, Collapse, IconButton, Menu, MenuItem, Typography } from '@mui/material'

import { useSprintManagement } from '@/context/sprint-context'
import type { SprintGroupItem } from '@/services/modules/sprint-group/type'
import CreateSprintGroupDialog from '../components/create-group-dialog'
import SprintList from './sprint-list'

const GroupItem = ({ sg }: { sg: SprintGroupItem }) => {
  const [collapse, setCollapse] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [anchorEl, setAnchorEl] = useState<any | null>(null)

  const toggleCollapse = () => setCollapse(!collapse)

  const handleMenuClose = () => setAnchorEl(null)

  const handleMenuOpen = (e: any) => {
    setAnchorEl(e?.currentTarget)
  }

  return (
    <Card className='rounded-lg'>
      <div className='py-2 px-3 flex items-center gap-2 justify-between'>
        <div className='flex items-center gap-2'>
          <IconButton size='small' className='rounded-xl' onClick={toggleCollapse}>
            <i className={`ri-arrow-right-s-line transition-all duration-300 ${collapse ? 'rotate-90' : ''}`} />
          </IconButton>

          <Typography className='font-semibold text-lg'>{sg?.GroupName}</Typography>
        </div>

        <div>
          <IconButton size='small' className='rounded-xl' onClick={handleMenuOpen}>
            <i className={`ri-more-2-line`} />
          </IconButton>

          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                setAnchorEl(null)
                setOpenEdit(true)
              }}
            >
              <div className='flex items-center gap-3'>
                <i className='ri-pencil-line size-4' />
                Edit
              </div>
            </MenuItem>
            <MenuItem>
              <div className='flex items-center gap-3'>
                <i className='ri-delete-bin-line size-4' />
                Delete
              </div>
            </MenuItem>
          </Menu>
        </div>
      </div>

      {openEdit && <CreateSprintGroupDialog open={openEdit} setOpen={setOpenEdit} group={sg} />}

      <Collapse in={collapse}>
        <SprintList sg={sg} />
      </Collapse>
    </Card>
  )
}

const GroupList = () => {
  const { data } = useSprintManagement()

  return <div className='space-y-9'>{data?.map(sg => <GroupItem key={sg?.SprintGroupID} sg={sg} />)}</div>
}

export default GroupList
