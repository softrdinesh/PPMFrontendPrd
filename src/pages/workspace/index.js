// ** React Imports
import React, { useContext, useState } from 'react'

// ** Next Imports
import Image from 'next/image'

// ** MUI Components
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'

// ** Local Imoports
import WorkspaceMen from '../../../public/images/workspace-men.svg'
import CreateWorkspace from 'src/@core/layouts/components/modals/CreateWorkspace'
import { WorkspaceContext } from 'src/context/workspace-context'

const Workspace = () => {
  // ** State
  const [open, setOpen] = useState(false)

  // ** Hooks
  const theme = useTheme()

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
  }

  //  ** Context Imports
  const { refetchWorkspaces } = useContext(WorkspaceContext)

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: '30px', color: 'common.black' }}>Create your workspace</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: `1px solid ${theme.palette.common.lightGray}`,
          borderRadius: '22px',
          flexWrap: 'wrap-reverse'
        }}
        px={5}
        mt={5}
      >
        <Box py={6}>
          <Typography sx={{ fontWeight: 400, fontSize: '20px', color: `${theme.palette.common.Gray37}` }}>
            Welcome To
          </Typography>
          <Typography my={1} sx={{ fontWeight: 600, fontSize: '24px', color: `${theme.palette.common.black}` }}>
            Your Workspace Area
          </Typography>
          <Typography sx={{ fontWeight: 400, fontSize: '14px', color: `${theme.palette.common.Gray37}` }}>
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
      <Box>
        <CreateWorkspace open={open} onCloseModal={handleClose} refetchWorkspaces={refetchWorkspaces} />
      </Box>
    </Box>
  )
}

export default Workspace
