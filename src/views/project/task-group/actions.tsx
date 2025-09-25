// import { useState } from 'react'

// import { Box, Grow, IconButton, Menu, MenuItem, Typography } from '@mui/material'

// import DeleteDialog from '@/components/dialog/delete-dialog'
// import NewTaskDialog from '../main-screen/task-group-add-dialog'
// const TaskGroupActions = () => {
//   const [anchorEl, setAnchorEl] = useState<any>(null)
//   const [deleteOpen, setDeleteOpen] = useState(false)
//   const [open, setOpen] = useState(false)
//   const [openEdit, setOpenEdit] = useState(false)

//   const handleOpen = () => setOpenEdit(true)

//   const handleClose = () => setOpenEdit(false)
//   const handleMenuOpen = (e: any) => {
//     e.stopPropagation()

//     setAnchorEl(e?.currentTarget)
//   }

//   const handleMenuClose = () => {
//     setAnchorEl(null)
//   }

//   const onEditClick = (e: any) => {
//     e.stopPropagation()
//     handleMenuClose()
//   }

//   const onDeleteClick = (e: any) => {
//     e.stopPropagation()
//     setDeleteOpen(true)
//     handleMenuClose()
//   }

//   const handleDelete = async () => {}

//   return (
//     <>
//       <IconButton size='small' onClick={handleMenuOpen} onFocus={event => event.stopPropagation()}>
//         <i className='ri-more-2-fill h-4 w-5' />
//       </IconButton>
//    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
//             <MenuItem
//               onClick={() => {
//                 setAnchorEl(null)
//                 setOpenEdit(true)
//               }}
//             >
//           <Box display={'flex'} alignItems={'center'} gap={3}>
//             <i className={'ri-pencil-line text-lg'} />
//             <Typography fontSize={13}>Edit</Typography>
//           </Box>
//         </MenuItem>
//         <MenuItem onClick={onDeleteClick}>
//           <Box display={'flex'} alignItems={'center'} gap={3}>
//             <i className={'ri-delete-bin-5-line text-lg text-error'} />
//             <Typography fontSize={13} className='text-error'>
//               Delete
//             </Typography>
//           </Box>
//         </MenuItem>
//       </Menu>
//     {openEdit &&  <NewTaskDialog open={openEdit} onCloseModal={handleClose} />}

//       <DeleteDialog
//         open={deleteOpen}
//         setOpen={val => setDeleteOpen(!!val)}
//         title={`Delete this taskgroup ?`}
//         onConfirm={handleDelete}
//         description={'You wont be able to revert this action'}
//       />
//     </>
//   )
// }

// export default TaskGroupActions
import { useState } from 'react'
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import DeleteDialog from '@/components/dialog/delete-dialog'
import NewTaskDialog from '../main-screen/task-group-add-dialog'

interface TaskGroupActionsProps {
  groupName?: string
  id?: Number
}

const TaskGroupActions = ({ groupName,id  }: TaskGroupActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editGroupName, setEditGroupName] = useState('')
const [editgroupid, seteditgroupid] = useState('')
  const handleMenuOpen = (e: any) => {
    e.stopPropagation()
    setAnchorEl(e?.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const onEditClick = (e: any) => {
    e.stopPropagation()
    setEditGroupName(groupName)
    seteditgroupid(id)
    setOpenEdit(true)
    handleMenuClose()
  }

  const onDeleteClick = (e: any) => {
    e.stopPropagation()
    setDeleteOpen(true)
    handleMenuClose()
  }

  const handleClose = () => {
    setOpenEdit(false)
    // Don't clear editGroupName immediately, let it clear after a small delay
    setTimeout(() => {
      setEditGroupName('')
    }, 100)
  }

  const handleDelete = async () => {}

  return (
    <>
      <IconButton size='small' onClick={handleMenuOpen} onFocus={event => event.stopPropagation()}>
        <i className='ri-more-2-fill h-4 w-5' />
      </IconButton>
      
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
        <MenuItem onClick={onEditClick}>
          <Box display={'flex'} alignItems={'center'} gap={3}>
            <i className={'ri-pencil-line text-lg'} />
            <Typography fontSize={13}>Edit</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={onDeleteClick}>
          <Box display={'flex'} alignItems={'center'} gap={3}>
            <i className={'ri-delete-bin-5-line text-lg text-error'} />
            <Typography fontSize={13} className='text-error'>
              Delete
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      <NewTaskDialog 
        open={openEdit}
        onCloseModal={handleClose}
        initialGroupName={editGroupName}
        TaskGroupID={editgroupid}
        isEdit={true}
      />

      <DeleteDialog
        open={deleteOpen}
        setOpen={val => setDeleteOpen(!!val)}
        title={`Delete this taskgroup ?`}
        onConfirm={handleDelete}
        description={'You wont be able to revert this action'}
      />
    </>
  )
}

export default TaskGroupActions
