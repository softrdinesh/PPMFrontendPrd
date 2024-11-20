import { projectMembers } from '@api/project'
import CustomButton from '@components/button'
import { Icon } from '@iconify/react'
import { Avatar, Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import { getInitials } from '@utils/get-initials'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import InviteMember from 'src/@core/layouts/components/modals/InviteMember'

const ProjectInvitePeople = ({ projectID, workspaceID, IsOpen }) => {
  const { data: users } = useQuery({ queryKey: ['members-list', projectID], queryFn: () => projectMembers(projectID) })
  console.log('users :', users)
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
              <Grid item xs={12} key={user?.UserProjectID}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                  <Box display={'flex'} alignItems={'center'} gap={3}>
                    <Avatar src={user?.User?.ProfilePicture}>{getInitials(user?.User?.Name)}</Avatar>
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                      <Typography>{user?.User?.Name}</Typography>
                      <Typography variant='caption'>{user?.User?.Email?.toLowerCase()}</Typography>
                    </Box>
                  </Box>
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
