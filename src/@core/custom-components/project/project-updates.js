import { fetchTaskUpdatesList, writeTaskUpdate } from '@api/task-updates'
import CustomButton from '@components/button'
import HtmlEditor from '@components/html-editor'
import { Icon } from '@iconify/react'
import { Avatar, Box, Typography, useTheme } from '@mui/material'
import { getInitials } from '@utils/get-initials'
import moment from 'moment'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { images } from 'src/constants/images'

const WriteUpdate = ({ taskID }) => {
  const [value, setValue] = useState('')

  const handleChange = async v => {
    try {
      setValue(v)
    } catch (error) {
      console.error('error :', error)
    }
  }

  const handleSendUpdate = async () => {
    try {
      const body = {
        message: value,
        taskID
      }
      console.log('VASLUE', body)

      const updateRes = await writeTaskUpdate(body)

      if (updateRes?.status) {
        toast.success('Task-Update Message was recorded successfully!')
      }
    } catch (error) {
      console.log('handleSendUpdate error :', error)
    }
  }

  return (
    <Box display={'flex'} flexDirection={'column'} gap={4}>
      <HtmlEditor
        placeholder={'Please enter a project description....'}
        onChange={handleChange}
        setContent={value}
        defaultValue={value}
      />
      <Box textAlign={'end'}>
        <CustomButton variant='contained' onClick={handleSendUpdate}>
          Update
        </CustomButton>
      </Box>
    </Box>
  )
}

const UpdateMessage = ({ message }) => {
  console.log('message :', message)

  return (
    <Box bgcolor={'background.default'} p={6} borderRadius={4} sx={{ borderBottomLeftRadius: 0 }}>
      {/* Details of user and Notification */}
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Box display={'flex'} alignItems={'center'} gap={3}>
          <Avatar src={message?.createdBy?.ProfilePicture} sx={{ width: 50, height: 50 }}>
            {getInitials(message?.createdBy?.Name)}
          </Avatar>
          <Typography fontWeight={600}>{message?.createdBy?.Name}</Typography>
        </Box>
      </Box>

      <Box mt={3} px={5}>
        <p dangerouslySetInnerHTML={{ __html: message?.Message }} />
      </Box>

      <Box mt={6} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Box display={'flex'} alignItems={'center'} gap={3}>
          <CustomButton variant='outlined' circular size='small'>
            Like
          </CustomButton>
          <CustomButton variant='outlined' circular size='small'>
            Reply
          </CustomButton>
        </Box>
        <Box>
          <Typography color={'primary'}>{moment(message?.CreatedAt).fromNow()}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

const ProjectUpdates = ({ projectData, taskData }) => {
  // ** Hooks
  const { data, refetch } = useQuery({
    queryKey: ['task-update-messages', taskData?.TaskID],
    queryFn: () => fetchTaskUpdatesList(taskData?.TaskID)
  })

  const theme = useTheme()

  const [writeUpdate, setWriteUpdate] = useState(false)

  const canSend = useMemo(
    () =>
      projectData?.userProjects?.Role?.RoleName === 'Member' || projectData?.userProjects?.Role?.RoleName === 'Admin',
    [projectData?.userProjects?.Role?.RoleName]
  )

  const handleWriteUpdate = () => {
    setWriteUpdate(true)
  }

  if (writeUpdate) {
    return <WriteUpdate taskID={taskData?.TaskID} setWriteUpdate={setWriteUpdate} refetch={refetch} />
  }

  return (
    <Box px={{ sm: 0, md: 12 }} pb={5}>
      <Box width={'100%'} mb={5} textAlign={'end'}>
        {canSend && (
          <CustomButton
            variant='contained'
            circular
            startIcon={<Icon icon={'mdi:pencil-outline'} />}
            onClick={handleWriteUpdate}
          >
            {'Write an Update'}
          </CustomButton>
        )}
        {/* {canSend && (
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
        )} */}
      </Box>
      {data?.length ? (
        data?.map(message => <UpdateMessage key={message?.UpdateID} message={message} taskData={taskData} />)
      ) : (
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
            <Typography
              variant='h6'
              fontWeight={700}
              color={'primary.dark'}
            >{`No updates yet for this item`}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ProjectUpdates
