import { useState } from 'react'

import { Icon } from '@iconify/react'
import {
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  styled,
  Typography,
  Zoom
} from '@mui/material'

import { debounce } from 'lodash'

import CustomAvatar from '@/@core/components/mui/Avatar'
import useVerticalNav from '@/@menu/hooks/useVerticalNav'
import { useWorkspace } from '@/context/workspace-context'
import { deleteWorkspace } from '@/services/modules/workspace'
import type { WorkspaceListItem } from '@/services/modules/workspace/type'
import { getInitials } from '@/utils/getInitials'
import DeleteWorkspaceDialog from './delete-workspace'
import { useAuth } from '@/hooks/useAuth'
import { deleteSprintWorkspace } from '@/services/modules/sprint-workspace'
import CreateWorkspaceDialog from './create-workspace-dialog'
import CreateProject from './create-project-dialog'
import SubscriptionExpiredDialog from '@/views/paymentpopup/SubscriptionExpiredDialog'
import { useRazorpayPayment } from '../paymentpopup/useRazorpayPayment'

const MenuNavLink = styled(ListItemButton)(() => ({
  width: '100%',
  borderRadius: 8,
  transition: 'padding-left .25s ease-in-out',
  '& .MuiTypography-root': {
    fontWeight: 300,
    fontSize: '0.9rem'
  }
}))

const MenuItemTextMetaWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out'
}))

const WorkspaceItem = ({ workspaces }: { workspaces: WorkspaceListItem }) => {
  // ** States
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [showPaymentExpiredDialog, setShowPaymentExpiredDialog] = useState(false)
  
  const { profile, user } = useAuth()
  const { selected, setSelected, refetchWorkspaces,projects, workspace} = useWorkspace()

  const { isCollapsed, isHovered, collapsedWidth } = useVerticalNav()

  // ** Use Payment Hook
  const { isLoading, razorpayLoaded, generateRazorPayOrder } = useRazorpayPayment({
    userId: Number(user?.id),
    onPaymentSuccess: () => {
      checkPaymentStatus()
      setShowPaymentExpiredDialog(false)
    },
    onPaymentFailure: () => {
      checkPaymentStatus()
      setShowPaymentExpiredDialog(true)
    }
  })

  // ** Functions
  const isNavLinkActive = () => {
    if (selected?.WorkspaceID === workspaces?.WorkspaceID) {
      return true
    } else {
      return false
    }
  }

  const handleOpenMenu = (e: any) => {
    setAnchorEl(e.currentTarget)
  }

  const handleOpenClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteOpen = () => {
    setOpen(true)
    handleOpenClose()
  }
  
  const handleClose = () => setOpen1(false)

  const handleDelete = async () => {
    try {
 

      const response =
        profile === 'projects'
          ? await deleteWorkspace({
              OrganizationID: workspaces.OrganizationID,
              WorkspaceID: workspaces.WorkspaceID?.toString(),
              WorkspaceName: workspaces.WorkspaceName
            })
          : await deleteSprintWorkspace({
              OrganizationID: workspaces.OrganizationID,
              WorkspaceID: workspaces.WorkspaceID?.toString(),
              WorkspaceName: workspaces.WorkspaceName
            })

      if (response?.status) {
        refetchWorkspaces()
        setOpen(false)
        handleOpenClose()

        if (selected?.WorkspaceID === workspaces?.WorkspaceID) {
          setSelected(null)
        }
      }
    } catch (error) {
<<<<<<< HEAD
      console.error('Delete Workspace Error :', error)
=======
      //console.error('Delete Workspace Error :', error)
>>>>>>> source-link/main
    }
  }

  const debouncedDelete = debounce(handleDelete, 400)

  
    const handleSelect = (ws: WorkspaceListItem) => {
    setSelected(ws)
  }

 

  const handleClosePaymentDialog = () => {
    setShowPaymentExpiredDialog(false)
  }

   const handleCreateWorkspaceClick = () => {
     const workspaceCount = workspace?.length ?? 0

<<<<<<< HEAD
    if (workspaceCount >= 1) {
    const canOpen = checkPaymentStatus()
handleOpenClose()
        if (canOpen) {
      setIsModalOpen(true)
    }
      return
    }
=======
//     if (workspaceCount >= 1) {
//     const canOpen = checkPaymentStatus()
// handleOpenClose()
//         if (canOpen) {
//       setIsModalOpen(true)
//     }
//       return
//     }

 try {
    const paymentStatus = localStorage.getItem('paymentStatus')
    if (paymentStatus) {
      const parsed = JSON.parse(paymentStatus)
      if (parsed.workspaceCount !== undefined && parsed.workspaceCount !== null) {
     //   console.log(categoryCount >= parsed.taskGroupCount,'categoryCount >= parsed.taskGroupCount');
        if (workspaceCount >= parsed.workspaceCount) {
          setShowPaymentExpiredDialog(true)
          return
        }
      }
    }
  } catch (error) {
   // console.error('Error checking payment status:', error)
  }






>>>>>>> source-link/main

    setIsModalOpen(true)
    handleOpenClose()
  }


   const handleCreateproject= () => {
     const projectcount = projects?.length ?? 0

<<<<<<< HEAD
    if (projectcount >= 1) {
    const canOpen = checkPaymentStatus()
handleOpenClose()
        if (canOpen) {
      setOpen1(true)
    }
      return
    }

    setOpen1(true)
    handleOpenClose()
=======

  try {
    const paymentStatus = localStorage.getItem('paymentStatus')
    if (paymentStatus) {
      const parsed = JSON.parse(paymentStatus)
      if (parsed.projectCount !== undefined && parsed.projectCount !== null) {
     //   console.log(categoryCount >= parsed.taskGroupCount,'categoryCount >= parsed.taskGroupCount');
        if (projectcount >= parsed.projectCount) {
          setShowPaymentExpiredDialog(true)
          return
        }
      }
    }
  } catch (error) {
   // console.error('Error checking payment status:', error)
  }

  setOpen1(true)
   handleOpenClose()





//     if (projectcount >= 1) {
//     const canOpen = checkPaymentStatus()
// handleOpenClose()
//         if (canOpen) {
//       setOpen1(true)
//     }
//       return
//     }

//     setOpen1(true)
//     handleOpenClose()
>>>>>>> source-link/main
  }



const roleData = localStorage.getItem('Role');
const parsedData = JSON.parse((roleData)as any);
const rolename = parsedData?.rolename;




  const checkPaymentStatus = () => {
  const paymentStatus = localStorage.getItem('paymentStatus')
  const workspaceCount = workspace?.length ?? 0
  const projectCount = projects?.length ?? 0
  const hasUsedFreeQuota = workspaceCount > 0 || projectCount > 0

  // If the free quota hasn't been used yet, always allow — no need to even
  // look at payment status.
  if (!hasUsedFreeQuota) {
    setShowPaymentExpiredDialog(false)
    return true
  }

  // Free quota is used up — payment status now decides.
  try {
    if (paymentStatus) {
      const parsed = JSON.parse(paymentStatus)

      if (parsed.isExpired == true) {
        setShowPaymentExpiredDialog(true)
        return false
      }
      if (parsed.isExpired == false) {
        setShowPaymentExpiredDialog(false)
        return true
      }
      // Unexpected shape — be conservative
      setShowPaymentExpiredDialog(true)
      return false
    }
    // No stored status at all, quota already used → must pay
    setShowPaymentExpiredDialog(true)
    return false
  } catch (error) {
<<<<<<< HEAD
    console.error('Error parsing payment status:', error)
=======
 //   console.error('Error parsing payment status:', error)
>>>>>>> source-link/main
    setShowPaymentExpiredDialog(true)
    return false
  }
}
  return (
    <ListItem
      disablePadding
      className='nav-link'
      sx={{
        transition: 'padding .25s ease-in-out'
      }}
    >
      <MenuNavLink
        disableTouchRipple
        disableRipple
        className={isNavLinkActive() ? 'active' : ''}
        onClick={() => handleSelect(workspaces)}
        sx={{
          py: 2.25,
          backgroundColor: isNavLinkActive() ? 'rgba(255,255,255,0.8)' : 'inherit',
          '&:hover': {
            backgroundColor: isNavLinkActive() ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)'
          },
          pl: isCollapsed && !isHovered ? ((collapsedWidth || 0) - 38 - 16) / 8 : 2.25,
          pr: isCollapsed && !isHovered ? ((collapsedWidth || 0) - 38 - 16) / 8 : 2.25
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 35,
            transition: 'margin .25s ease-in-out',
            color: 'white'
          }}
        >
          <CustomAvatar
            skin={isNavLinkActive() ? 'light' : 'filled'}
            color='error'
            variant='circular'
            sx={{ width: 28, height: 28, fontSize: '1rem' }}
          >
            {getInitials(workspaces?.WorkspaceName)}
          </CustomAvatar>
        </ListItemIcon>

        <MenuItemTextMetaWrapper
          sx={{
            ...(isCollapsed && !isHovered ? { opacity: 0 } : { opacity: 1 })
          }}
          className='truncate'
        >
          <Typography
            {...(!isCollapsed &&
              !isHovered && {
                noWrap: true
              })}
            className={`truncate !font-normal ${isNavLinkActive() ? 'text-black' : 'text-white'}`}
          >
            {workspaces?.WorkspaceName}
          </Typography>
 
{rolename !== 'Viewer' &&
          <IconButton size='small' onClick={handleOpenMenu}>
            <Icon
              icon={'solar:menu-dots-bold'}
              className='shrink-0'
              fontSize={'0.2rem'}
              color={!isNavLinkActive() ? 'white' : 'black'}
            />
          </IconButton>
}
          <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleOpenClose} TransitionComponent={Zoom}>
            <MenuItem onClick={handleCreateWorkspaceClick}>
            {rolename !== 'Viewer' &&
              <Box display={'flex'} alignItems={'center'} gap={2}>
                <Icon icon={'mdi:plus-circle-outline'} />
                <Typography>Create WorkSpace</Typography>
              </Box>
}
            </MenuItem>
            {profile === 'projects' && (
              <MenuItem onClick={handleCreateproject}>
                <Box display={'flex'} alignItems={'center'} gap={2}>
                  <Icon icon={'mdi:plus-circle-outline'} />
                  <Typography>Create Project</Typography>
                </Box>
              </MenuItem>
            )}
            <MenuItem onClick={handleDeleteOpen}>
              <Box display={'flex'} alignItems={'center'} gap={2}>
                <Icon icon={'mdi:delete-outline'} />
                <Typography>Delete</Typography>
              </Box>
            </MenuItem>
          </Menu>
          <DeleteWorkspaceDialog open={open} setOpen={setOpen} onConfirm={debouncedDelete} />
        </MenuItemTextMetaWrapper>
      </MenuNavLink>
      <CreateProject open={open1} onCloseModal={handleClose} />

      <CreateWorkspaceDialog
        open={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
        refetchWorkspaces={refetchWorkspaces}
      />
      <SubscriptionExpiredDialog
        open={showPaymentExpiredDialog}
        onClose={handleClosePaymentDialog}
        onRenew={generateRazorPayOrder}
        isLoading={isLoading}
        razorpayLoaded={razorpayLoaded}
      />
    </ListItem>
  )
}

const ListWorkspaces = () => {
  const { workspace: workspaceList } = useWorkspace()
  return (
    <div className='space-y-1 py-3'>
      {workspaceList?.map(workspace => <WorkspaceItem key={workspace?.WorkspaceID} workspaces={workspace} />)}
    </div>
  )
}

export default ListWorkspaces
