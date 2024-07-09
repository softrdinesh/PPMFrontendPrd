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
          backgroundColor: `${theme.palette.grey[50]}`
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
            height: '25%',
            width: '25%'
          }}
        />
      </Box>
      <Box>
        <CreateWorkspace open={open} onCloseModal={handleClose} refetchWorkspaces={refetchWorkspaces} />
        {/* <div>
          <Modal
            open={open}
            onClose={onCloseModal}
            center
            showCloseIcon={false}
            styles={{
              modal: {
                borderRadius: 10,
                padding: 15
              }
            }}
            closeIcon={null}
          >
            <Box sx={style}>
              <Box
                // px={3}
                sx={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '18px', color: 'common.black' }}>
                  Add workspace name
                </Typography>
                <IconButton
                  aria-label='close'
                  onClick={() => {
                    handleClose()
                  }}
                >
                  <IconifyIcon icon={'mdi:close'} color={`common.black`} fontSize={24} />
                </IconButton>
              </Box>
              <Divider sx={{ height: 0, color: 'red' }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '18px', color: 'common.black' }}>
                  Add workspace name Add workspace name Add workspace name Add workspace name Add workspace name
                </Typography>
              </Box>
            </Box>
          </Modal>
        </div> */}
        {/* <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Box
              py={2}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '18px', color: 'common.black' }}>
                Add workspace name
              </Typography>
              <Box
                sx={{
                  height: 22,
                  width: 22,
                  border: '1px solid red',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'pink'
                }}
                borderColor={'red'}
              >
                <IconifyIcon icon={'mdi:close'} color={`common.black`} />
              </Box>
            </Box>
            <Divider sx={{ height: 0, color: 'red' }} />
            <Box px={3} py={2}></Box>
          </Box>
        </Modal> */}
      </Box>
    </Box>
  )
}

export default Workspace
