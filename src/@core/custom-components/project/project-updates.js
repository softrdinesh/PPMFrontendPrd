import { fetchTaskUpdatesList, giveReplyToUpdate, likeTaskUpdate, writeTaskUpdate } from '@api/task-updates'
import CustomButton from '@components/button'
import HtmlEditor from '@components/html-editor'
import { Icon } from '@iconify/react'
import { Avatar, Box, Grid, IconButton, InputAdornment, TextField, Typography, useTheme } from '@mui/material'
import { getInitials } from '@utils/get-initials'
import moment from 'moment'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { images } from 'src/constants/images'

const WriteUpdate = ({ taskID, setWriteUpdate, refetch }) => {
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

      const updateRes = await writeTaskUpdate(body)
      refetch()
      setWriteUpdate(false)
      if (updateRes?.status) {
        toast.success('Task-Update Message was recorded successfully!')
      }
    } catch {}
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

const UpdateMessage = ({ message, refetch }) => {
  const [giveReply, setGiveReply] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  const { control, handleSubmit, reset } = useForm({ defaultValues: { message: '' } })

  const handleLike = async () => {
    try {
      await likeTaskUpdate(message?.UpdateID)
      refetch()
    } catch {}
  }

  const onReplyClick = () => {
    setGiveReply(!giveReply)
    reset()
  }

  const onGiveReply = async formData => {
    const finalBody = {
      ...formData,
      updateID: message?.UpdateID,
      taskID: message?.TaskID
    }
    console.log('FINAL BODY', finalBody)
    await giveReplyToUpdate(finalBody)
    refetch()
    reset()
    setGiveReply(false)
  }

  return (
    <Grid item xs={12}>
      <Box bgcolor={'background.default'} p={6} borderRadius={4} sx={{ borderBottomLeftRadius: 0 }}>
        {/* Details of user and Notification */}
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <Box display={'flex'} alignItems={'center'} gap={3}>
            <Avatar src={message?.createdBy?.ProfilePicture} sx={{ width: 45, height: 45 }}>
              {getInitials(message?.createdBy?.Name)}
            </Avatar>
            <Typography fontWeight={600}>{message?.createdBy?.Name}</Typography>
          </Box>
          <Box>
            <IconButton onClick={() => setShowReplies(!showReplies)}>
              <Icon
                icon={'mdi:chevron-right'}
                rotate={showReplies ? 45 : 0}
                style={{ transition: 'all linear 300ms' }}
              />
            </IconButton>
          </Box>
        </Box>

        <Box mt={3} px={5} ml={4}>
          <p dangerouslySetInnerHTML={{ __html: message?.Message }} />
        </Box>

        {showReplies && message?.replies?.length ? (
          <Grid container spacing={5} ml={4}>
            {message?.replies?.map(reply => (
              <Grid item xs={12} key={reply?.UpdateID}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                  <Box display={'flex'} alignItems={'center'} gap={3}>
                    <Avatar src={reply?.createdBy?.ProfilePicture} sx={{ width: 40, height: 40 }}>
                      {getInitials(reply?.createdBy?.Name)}
                    </Avatar>
                    <Typography fontWeight={600}>{reply?.createdBy?.Name}</Typography>
                  </Box>
                </Box>

                <Box mt={3} px={5} ml={6}>
                  <p dangerouslySetInnerHTML={{ __html: reply?.Message }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : null}

        <Box height={giveReply ? 30 : 0} sx={{ transition: 'all linear 300ms' }}>
          {giveReply && (
            <form onSubmit={handleSubmit(onGiveReply)}>
              <Controller
                control={control}
                name='message'
                rules={{ required: 'Please enter something....' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    size='small'
                    error={!!fieldState?.error}
                    fullWidth
                    placeholder='Write your reply here'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton type='submit' color='primary' variant='contained'>
                            <Icon icon={'mynaui:send'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </form>
          )}
        </Box>

        <Box mt={6} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <Box display={'flex'} alignItems={'center'} gap={3}>
            <CustomButton
              variant={message?.isLiked ? 'contained' : 'outlined'}
              circular
              size='small'
              onClick={handleLike}
              color={message?.isLiked ? 'error' : 'primary'}
            >
              {message?.isLiked ? 'Liked' : 'Like'}
            </CustomButton>
            <CustomButton variant='outlined' circular size='small' onClick={onReplyClick}>
              {giveReply ? 'Hide' : 'Reply'}
            </CustomButton>
          </Box>
          <Box>
            <Typography color={'primary'}>{moment(message?.CreatedAt).fromNow()}</Typography>
          </Box>
        </Box>
      </Box>
    </Grid>
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
        <Grid container spacing={5}>
          {data?.map(message => (
            <UpdateMessage key={message?.UpdateID} message={message} taskData={taskData} refetch={refetch} />
          ))}
        </Grid>
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
