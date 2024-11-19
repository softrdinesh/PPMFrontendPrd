import CustomButton from '@components/button'
import { Icon } from '@iconify/react'
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import InviteMember from 'src/@core/layouts/components/modals/InviteMember'

const users = [
  {
    UserID: 1,
    name: 'Samad Saiyed',
    Role: {
      RoleName: 'Admin'
    }
  },
  {
    UserID: 2,
    name: 'Dinesh Rajan',
    Role: {
      RoleName: 'Member'
    }
  },
  {
    UserID: 3,
    name: 'Abdul Vahora',
    Role: {
      RoleName: 'Viewer'
    }
  }
]

const ProjectInvitePeople = ({ projectID, workspaceID, IsOpen }) => {
  const [openDialog, setOpenDialog] = useState(false)

  const [inviteUserOpen, setInviteUserOpen] = useState(false)

  const handleInviteUser = () => {
    setOpenDialog(false)
    setInviteUserOpen(true)
  }

  return (
    <>
      <CustomButton
        variant='outlined'
        startIcon={<Icon icon={'solar:users-group-rounded-linear'} style={{ marginInline: 2 }} />}
        sx={{ px: 3.5 }}
        onClick={() => setOpenDialog(true)}
      >
        Group
      </CustomButton>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth='sm'>
        <DialogTitle>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography variant='h6' fontWeight={800}>
              Users
            </Typography>
            <CustomButton
              onClick={handleInviteUser}
              variant='contained'
              circular
              size='small'
              startIcon={<Icon icon={'line-md:plus'} />}
            >
              Invite New Member
            </CustomButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12}></Grid>
            {users?.map(user => (
              <Grid item xs={12} key={user?.UserID}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                  <Typography>{user?.name}</Typography>
                  <Box display={'flex'} alignItems={'center'} gap={2}>
                    <Icon
                      icon={
                        user?.Role?.RoleName === 'Admin'
                          ? 'eos-icons:admin-outlined'
                          : user?.Role?.RoleName === 'Member'
                            ? 'material-symbols:editor-choice-outline'
                            : 'bi:eye'
                      }
                      color={
                        user?.Role?.RoleName === 'Admin'
                          ? 'red'
                          : user?.Role?.RoleName === 'Member'
                            ? 'green'
                            : 'orange'
                      }
                      fontSize={25}
                    />
                    <IconButton size='small'>
                      <Icon icon={'ic:twotone-close'} fontSize={25} />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
      <InviteMember
        openInviteModal={inviteUserOpen}
        setOpenInviteModal={setInviteUserOpen}
        workspaceID={workspaceID}
        projectID={projectID}
        IsOpen={IsOpen}
      />
    </>
  )
}

export default ProjectInvitePeople
