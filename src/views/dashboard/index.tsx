'use client'

import { useState } from 'react'

import Image from 'next/image'

import { Box, Typography } from '@mui/material'

import CustomButton from '@/components/button'
import { useWorkspace } from '@/context/workspace-context'
import CreateWorkspaceDialog from '../sidebar/create-workspace-dialog'

import WorkspaceMen from '@public/images/cards/workspace-men.svg'

const DashboardPage = () => {
  // ** State
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
  }

  //  ** Context Imports
  const { refetchWorkspaces } = useWorkspace()

  return (
    <>
      <Box>
        <Typography className='text-lg lg:text-3xl font-bold text-textPrimary'>Create your workspace</Typography>
        <div className='flex items-center justify-between rounded-4xl flex-wrap border border-bgDivider px-6 mt-4'>
          <Box py={6}>
            <Typography className='font-normal text-base lg:text-lg'>Welcome To</Typography>
            <Typography className='font-bold text-lg lg:text-xl' my={1}>
              Your Workspace Area
            </Typography>
            <Typography className='font-normal text-base lg:text-lg'>Create your perfect workspace here</Typography>
            <CustomButton circular size='small' className='mt-10 px-6' variant='contained' onClick={handleOpen}>
              Create
            </CustomButton>
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
        </div>
      </Box>
      <CreateWorkspaceDialog open={open} onCloseModal={handleClose} refetchWorkspaces={refetchWorkspaces} />
    </>
  )
}

export default DashboardPage
