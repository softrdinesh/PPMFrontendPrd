// ** React Imports
import React, { useContext, useState } from 'react'

// ** Next Imports
import Image from 'next/image'

// ** MUI Components
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Local Imoports
import WorkspaceMen from '@images/workspace-men.svg'
import CreateWorkspace from 'src/@core/layouts/components/modals/CreateWorkspace'
import { WorkspaceContext } from 'src/context/workspace-context'

const Workspace = () => {
  // ** State
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
  }

  //  ** Context Imports
  const { refetchWorkspaces } = useContext(WorkspaceContext)

  return (
    <>
      <Box>
        <Typography variant='h4' fontWeight={700}>
          Create your workspace
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '22px',
            flexWrap: 'wrap-reverse'
          }}
          border={1}
          borderColor={'divider'}
          px={5}
          mt={5}
        >
          <Box py={6}>
            <Typography variant='body1' fontWeight={400}>
              Welcome To
            </Typography>
            <Typography my={1} fontWeight={600} variant='h6'>
              Your Workspace Area
            </Typography>
            <Typography variant='body1' fontWeight={400}>
              Create your perfect workspace here
            </Typography>
            <Button
              sx={{
                borderRadius: 18,
                fontWeight: 500,
                fontSize: '11px',
                textTransform: 'capitalize',
                marginTop: 10
              }}
              variant='contained'
              onClick={() => {
                handleOpen()
              }}
            >
              Create
            </Button>
          </Box>

          <Image
            alt='man doing work'
            src={WorkspaceMen}
            style={{
              objectFit: 'cover',
              maxWidth: '100%',
              maxHeight: '100%',
              height: 'auto',
              width: 'auto',
              marginTop: 10,
              marginBottom: 10
            }}
          />
        </Box>
      </Box>
      <CreateWorkspace open={open} onCloseModal={handleClose} refetchWorkspaces={refetchWorkspaces} />
    </>
  )
}

export default Workspace
