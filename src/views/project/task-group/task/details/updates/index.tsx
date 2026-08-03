import { useMemo, useState, useRef, useCallback, useEffect } from 'react'

import Image from 'next/image'
import axios from 'axios'
import { Icon } from '@iconify/react'
import { Avatar, Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'

import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import HtmlEditor from '@/components/input/html-editor'
import { useProject } from '@/context/project-context'
import type { TaskListItemType } from '@/services/modules/task/types'
import { getInitials } from '@/utils/getInitials'
import CustomButton from '@components/button'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { viewProject } from '@/services/modules/project'

import {
  fetchTaskUpdatesList,
  giveReplyToUpdate,
  likeTaskUpdate,
  writeTaskUpdate
} from '@/services/modules/task-updates'
import type { TaskUpdatesListItemType } from '@/services/modules/task-updates/types'

import EmptyImage from '@public/images/cards/upload-files.svg'

// ---------------------------------------------------------------------------
// NEW: helpers + component to detect whether a message is a plain URL
// (image / pdf / other file) or actual rich-text HTML, and render it
// accordingly instead of always dumping it into dangerouslySetInnerHTML.
// ---------------------------------------------------------------------------
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
const pdfExtensions = ['pdf']

const getFileExtension = (url: string) => {
  try {
    const cleanUrl = url.split('?')[0]
    const parts = cleanUrl.split('.')
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
  } catch {
    return ''
  }
}

const isUrl = (str: string) => {
  try {
    const trimmed = str?.trim()
    if (!trimmed) return false
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const MessageContent = ({ message }: { message: string }) => {
  const trimmed = message?.trim() || ''

  // NEW: state for full-image viewer (lightbox)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (isUrl(trimmed)) {
    const ext = getFileExtension(trimmed)

    // Image -> show actual image
    if (imageExtensions.includes(ext)) {
      return (
        <>
          <Box mt={2}>
            <Box
              component='img'
              src={trimmed}
              alt='attachment'
              onClick={() => setLightboxOpen(true)}
              sx={{
                maxWidth: '100%',
                maxHeight: 300,
                borderRadius: 2,
                objectFit: 'contain',
                display: 'block',
                cursor: 'pointer'
              }}
            />
          </Box>

          {/* NEW: Fullscreen image viewer with close icon */}
          {lightboxOpen && (
            <Box
              onClick={() => setLightboxOpen(false)}
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                bgcolor: 'rgba(0,0,0,0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1300
              }}
            >
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxOpen(false)
                }}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <Icon icon='mdi:close' fontSize={28} />
              </IconButton>

              <Box
                component='img'
                src={trimmed}
                alt='attachment-full'
                onClick={(e) => e.stopPropagation()}
                sx={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                  borderRadius: 2
                }}
              />
            </Box>
          )}
        </>
      )
    }

    // PDF -> show a pdf card/link
    if (pdfExtensions.includes(ext)) {
      return (
        <Box
          component='a'
          mt={2}
          href={trimmed}
          target='_blank'
          rel='noopener noreferrer'
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
        >
          <Icon icon='mdi:file-pdf-box' fontSize={28} color='#d32f2f' />
          <Typography color='primary' sx={{ textDecoration: 'underline' }}>
            View PDF
          </Typography>
        </Box>
      )
    }

    // Any other file type -> generic file link
    return (
      <Box
        component='a'
        mt={2}
        href={trimmed}
        target='_blank'
        rel='noopener noreferrer'
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
      >
        <Icon icon='mdi:file-outline' fontSize={28} />
        <Typography color='primary' sx={{ textDecoration: 'underline' }}>
          View File
        </Typography>
      </Box>
    )
  }

  // Not a URL -> render as before (rich text HTML)
  return <p dangerouslySetInnerHTML={{ __html: message }} />
}
// ---------------------------------------------------------------------------

interface WriteUpdateProps {
  taskID: string
  setWriteUpdate: (s: boolean) => void
  refetch: () => void
  onRefreshMessageCount?: (data?: any) => void
 
  sendMessage: (msg: any) => void
}

const WriteUpdate = ({ taskID, setWriteUpdate, refetch, onRefreshMessageCount, sendMessage }: WriteUpdateProps) => {
  const [value, setValue] = useState('')
  const { user } = useAuth()

 

  const handleChange = async (v: string) => {
    try {
      setValue(v)
    } catch (error) {
      console.error('error :', error)
    }
  }

  

  const handleFileUpload = async (value:any) => {
 



  try {
    const formData = new FormData();
    formData.append('file', value);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL1}/UploadProjecttaskUpdateDocument/0/${taskID}/${user?.id}`,
      formData,
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    refetch()
      setWriteUpdate(false)
    // setSelectedFile(null);
    toast.success("Image Uploaded Successfully!")
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Upload failed:', error.response?.data || error.message);
      //setUploadError(error.response?.data?.message || 'File upload failed');
    } else {
      console.error('Unexpected error:', error);
     // setUploadError('Something went wrong');
    }
  } finally {
   // setIsUploading(false);
  }
};


const handleSendUpdate = async () => {
  try {
    const hasImageTag = /<img\b[^>]*>/i.test(value)

    if (hasImageTag) {
      // Extract the base64 src from the <img> tag
      const srcMatch = value.match(/<img[^>]+src=["']([^"']+)["']/i)
      const base64Src = srcMatch?.[1]

      if (base64Src) {
        // Convert the base64 data URL into a real File/Blob (this is the fix)
        const res = await fetch(base64Src)
        const blob = await res.blob()
        const mimeMatch = base64Src.match(/^data:(.*?);base64,/)
        const mimeType = mimeMatch?.[1] || 'image/png'
        const extension = mimeType.split('/')[1] || 'png'
        const fileName = `pasted-image-${Date.now()}.${extension}`
        const file = new File([blob], fileName, { type: mimeType })

        handleFileUpload(file)

  
      }
    } else {
      const body = {
        message: value,
        taskID
      }
   
      const updateRes = await writeTaskUpdate(body)

      refetch()
      setWriteUpdate(false)

      if (updateRes?.status) {
        toast.success('Task-Update Message was recorded successfully!')

        const uniqueId = `${taskID}_${Date.now()}_${Math.random()}`

        const wsMessage = {
          TaskID: taskID,
          SenderID: user?.id,
          Message: value,
          ReceiverID: 0,
          timestamp: new Date().toISOString(),
          isUpdate: true,
          uniqueId
        }

        sendMessage(wsMessage)

        if (onRefreshMessageCount) {
          onRefreshMessageCount({
            ...updateRes?.data,
            TaskID: taskID,
            SenderID: user?.id,
            Message: value,
            timestamp: new Date().toISOString(),
            uniqueId
          })
        }
      }
    }
  } catch (error) {
    console.error('Error sending update:', error)
    toast.error('Failed to send update. Please try again.')
  }
}
  return (
    <Box display={'flex'} flexDirection={'column'} gap={4}>
      <HtmlEditor
        placeholder={'Please enter a project description....'}
        onChange={(v: string) => handleChange(v)}
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

interface UpdateMessageProps {
  message: TaskUpdatesListItemType
  refetch: () => void
}

type FormType = {
  message: string
}

const UpdateMessage = ({ message, refetch }: UpdateMessageProps) => {
  const [giveReply, setGiveReply] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
    const router = useRouter()
   const params = useParams()
  const projectId = Number(params.id)

  const { control, handleSubmit, reset } = useForm<FormType>({ defaultValues: { message: '' } })
const { data,   } = useQuery({
    queryKey: ['project-view', projectId],
    queryFn: () =>
      viewProject((projectId).toString()).then(res => {
        if (res?.statusCode === 403) {
          router.replace('/401')
          return undefined
        } else {
          return res?.data
        }
      })
  })
  const role1 = useMemo(() => data?.userProjects?.Role, [data?.userProjects?.Role])

  const handleLike = async () => {
    try {
      await likeTaskUpdate(message?.UpdateID?.toString())
      refetch()
    } catch (error) {
      console.error('Error liking update:', error)
      toast.error('Failed to like update')
    }
  }

  const onReplyClick = () => {
    setGiveReply(!giveReply)
    reset()
  }

  const onGiveReply = async (formData: FormType) => {
    try {
      const finalBody = {
        ...formData,
        updateID: message?.UpdateID,
        taskID: message?.TaskID
      }

      await giveReplyToUpdate(finalBody)
      refetch()
      reset()
      setGiveReply(false)
      toast.success('Reply added successfully')
    } catch (error) {
      console.error('Error replying:', error)
      toast.error('Failed to add reply')
    }
  }
  
  return (
    <Grid size={12}>
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
          <MessageContent message={message?.Message} />
        </Box>

        {showReplies && message?.replies?.length ? (
          <Grid container spacing={5} ml={4}>
            {message?.replies?.map(reply => (
              <Grid size={12} key={reply?.UpdateID}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                  <Box display={'flex'} alignItems={'center'} gap={3}>
                    <Avatar src={reply?.createdBy?.ProfilePicture} sx={{ width: 40, height: 40 }}>
                      {getInitials(reply?.createdBy?.Name)}
                    </Avatar>
                    <Typography fontWeight={600}>{reply?.createdBy?.Name}</Typography>
                  </Box>
                </Box>

                <Box mt={3} px={5} ml={6}>
                  <MessageContent message={reply?.Message} />
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
                    helperText={fieldState?.error?.message}
                    fullWidth
                    placeholder='Write your reply here'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton type='submit' color='primary'>
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
            {role1?.RoleName !=='Viewer' && 
            <CustomButton
              variant={message?.isLiked ? 'contained' : 'outlined'}
              circular
              size='small'
              onClick={handleLike}
              color={message?.isLiked ? 'error' : 'primary'}
            >
              {message?.isLiked ? 'Liked' : 'Like'}
            </CustomButton>
}
            {role1?.RoleName !=='Viewer' && 

            <CustomButton variant='outlined' circular size='small' onClick={onReplyClick}>
              {giveReply ? 'Hide' : 'Reply'}
            </CustomButton>
}
          </Box>
          <Box>
            <Typography color={'primary'}>{moment(message?.CreatedAt).fromNow()}</Typography>
          </Box>
        </Box>
      </Box>
    </Grid>
  )
}

interface ProjectUpdatesProps {
  taskData: TaskListItemType
  onRefreshMessageCount?: (data?: any) => void
}

const ProjectUpdates = ({ taskData, onRefreshMessageCount }: ProjectUpdatesProps) => {
  // ** Hooks
  const { project: projectData } = useProject()

  const { data, refetch } = useQuery({
    queryKey: ['task-update-messages', taskData?.TaskID],
    queryFn: () => fetchTaskUpdatesList(taskData?.TaskID?.toString())
  })

  const [writeUpdate, setWriteUpdate] = useState(false)

  
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isConnectingRef = useRef(false)

  const hasNotifiedInitialLoadRef = useRef(false)


  const onRefreshMessageCountRef = useRef(onRefreshMessageCount)
  useEffect(() => {
    onRefreshMessageCountRef.current = onRefreshMessageCount
  }, [onRefreshMessageCount])

  const { user } = useAuth()

  const maxReconnectAttempts = 5
  const reconnectInterval = 3000

  const connectWebSocket = useCallback(() => {
    // Prevent multiple connection attempts
    if (isConnectingRef.current) {
    
      return
    }

    // Check if socket is already open
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
   
      return
    }

    // Close any existing connection
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL}/statusTaskUpdate?taskId=${taskData?.TaskID}&senderID=${user?.id}`
    isConnectingRef.current = true

    try {
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        isConnectingRef.current = false
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = async (event) => {
        try {
          // Normalize incoming data
          let raw = null
          if (typeof event.data == 'string') {
            raw = event.data
          } else if (event.data instanceof Blob) {
            raw = await event.data.text()
          } else if (event.data instanceof ArrayBuffer) {
            raw = new TextDecoder().decode(event.data)
          } else {
            raw = String(event.data)
          }

          if (raw == "heartbeat" || (typeof raw == 'string' && raw.trim().toLowerCase() == "heartbeat")) {
            return
          }

          let parsedData
          try {
            parsedData = JSON.parse(raw)
          } catch (err) {
            console.error('Error parsing WebSocket message JSON:', err)
            return
          }

    
          if (onRefreshMessageCountRef.current) {
            onRefreshMessageCountRef.current(parsedData)
          }

          // Refetch updates
          refetch()

        } catch (error) {
          console.error('Error handling WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('ProjectUpdates WebSocket error:', error)
        isConnectingRef.current = false

        // Attempt to close on error if not already closed
        if (ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
          ws.close()
        }
      }

      ws.onclose = (event) => {
        console.log(`ProjectUpdates WebSocket closed with code: ${event.code}, reason: ${event.reason}`)
        isConnectingRef.current = false
        socketRef.current = null

        // Auto-reconnect only for abnormal closures
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1

          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
          }

          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket()
          }, reconnectInterval)
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.warn('Max WebSocket reconnection attempts reached')
        }
      }

      socketRef.current = ws
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      isConnectingRef.current = false

      // Retry connection after delay
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket()
        }, reconnectInterval)
      }
    }

  }, [taskData?.TaskID, user?.id, refetch])

  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (socketRef.current) {
      try {
        socketRef.current.close(1000, 'Component unmounting')
      } catch (error) {
        console.error('Error closing WebSocket:', error)
      }
      socketRef.current = null
    }

    reconnectAttemptsRef.current = 0
    isConnectingRef.current = false
  }, [])


  const sendWebSocketMessage = useCallback(
    (message: any) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        try {
              console.log('Sending WebSocket message:', message) // ADDED

          socketRef.current.send(JSON.stringify(message))
        } catch (sendError) {
          console.error('Error sending WebSocket message:', sendError)
        }
      } else {
        console.warn('WebSocket is not connected. Attempting to reconnect...')
        connectWebSocket()
      }
    },
    [connectWebSocket]
  )

  // Connect WebSocket when component mounts
  useEffect(() => {
    // Wait a moment before connecting to ensure component is fully mounted
    const timer = setTimeout(() => {
      connectWebSocket()
    }, 500)

    return () => {
      clearTimeout(timer)
      disconnectWebSocket()
    }
  }, [connectWebSocket, disconnectWebSocket])

  // Notify parent when data is loaded initially.
  // FIX: previously this fired on every `data` change (including the
  // refetch() triggered by every incoming socket message), which double
  // counted alongside the ws.onmessage handler above. Now it only fires
  // once, on the first successful load, and resets the guard per task.
  useEffect(() => {
    hasNotifiedInitialLoadRef.current = false
  }, [taskData?.TaskID])

  useEffect(() => {
    // FIX: read via ref instead of the prop directly, and drop
    // `onRefreshMessageCount` from the dependency array below — same
    // reasoning as connectWebSocket above: the prop identity changing on
    // every render should not re-trigger this effect.
    if (data && onRefreshMessageCountRef.current && !hasNotifiedInitialLoadRef.current) {
      hasNotifiedInitialLoadRef.current = true
      onRefreshMessageCountRef.current()
    }
  }, [data])

  const canSend = useMemo(
    () =>
      projectData?.userProjects?.Role?.RoleName === 'Member' || projectData?.userProjects?.Role?.RoleName === 'Admin',
    [projectData?.userProjects?.Role?.RoleName]
  )

  const handleWriteUpdate = () => {
    setWriteUpdate(true)
  }

  if (writeUpdate) {
    return (
      <WriteUpdate
        taskID={taskData?.TaskID?.toString()}
        setWriteUpdate={setWriteUpdate}
        refetch={refetch}
        onRefreshMessageCount={onRefreshMessageCount}
        sendMessage={sendWebSocketMessage}
      />
    )
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
      </Box>
      {data?.length ? (
        <Grid container spacing={5}>
          {data?.map(message => <UpdateMessage key={message?.UpdateID} message={message} refetch={refetch} />)}
        </Grid>
      ) : (
        <div className='w-full bg-primaryLighter p-10 rounded-lg flex flex-col md:flex-row items-center justify-center gap-4'>
          <Box>
            <Image src={EmptyImage} alt='' className='w-full h-auto' />
          </Box>
          <Box flex={1}>
            <Typography
              variant='h6'
              fontWeight={700}
              color={'primary.dark'}
            >{`No updates yet for this item`}</Typography>
          </Box>
        </div>
      )}
    </Box>
  )
}

export default ProjectUpdates
