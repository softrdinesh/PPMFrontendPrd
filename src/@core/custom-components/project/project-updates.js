import { Icon } from '@iconify/react'
import { Box, TextField, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { images } from 'src/constants/images'

const ProjectUpdates = ({ projectData }) => {
  const theme = useTheme()

  const canSend = useMemo(
    () =>
      projectData?.userProjects?.Role?.RoleName === 'Member' || projectData?.userProjects?.Role?.RoleName === 'Admin',
    [projectData?.userProjects?.Role?.RoleName]
  )

  return (
    <Box px={{ sm: 0, md: 12 }} pb={5}>
      <Box width={'100%'} mb={5}>
        {canSend && <TextField fullWidth size='small' placeholder='Write an update...' />}
        {canSend && (
          <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} gap={2} mt={1}>
            <Typography
              color={'primary.main'}
              fontSize={15}
              component={Link}
              href={'mailto:' + projectData?.CreatedBy?.Email}
            >
              Write updates via mail
            </Typography>
            <Icon icon={'ant-design:mail-outlined'} color={theme.palette.primary.main} fontSize={20} />
          </Box>
        )}
      </Box>
      <Box
        width={'100%'}
        bgcolor={theme.palette.primary.light + 22}
        p={10}
        borderRadius={1}
        display={'flex'}
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems={'center'}
        justifyContent={'center'}
        gap={5}
      >
        <Box>
          <Image src={images.ImgUploadBg} alt='' />
        </Box>
        <Box flex={1}>
          <Typography variant='h6' fontWeight={700} color={'primary.dark'}>{`No updates yet for this item`}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ProjectUpdates
