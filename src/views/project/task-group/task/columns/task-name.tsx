// ** React Imports
import type { ReactNode } from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import { styled } from '@mui/material/styles'
import toast from 'react-hot-toast'
import {
  
  writeTaskUpdate
} from '@/services/modules/task-updates'
// ** API Imports
import { Icon } from '@iconify/react'
import { IconButton } from '@mui/material'

import type { TaskListItemType } from '@/services/modules/task/types'
import TaskDetailsDialog from '../details'

interface TaskNameCellProps {
  renderTextField: ReactNode
  rowData: TaskListItemType
  refetch: () => void
}

// Styled Badge with smaller size
const SmallBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    fontSize: '0.625rem',
    height: '16px',
    minWidth: '16px',
    padding: '0 4px',
  },
}))

const TaskNameCell = ({ renderTextField, rowData, refetch }: TaskNameCellProps) => {
  const [openTaskView, setOpenTaskView] = useState(false)
  const [messageCount, setMessageCount] = useState(0)

  // WebSocket refs
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isConnectingRef = useRef(false)

  const maxReconnectAttempts = 5
  const reconnectInterval = 3000

  /**
   * Connect to WebSocket
   */
  const connectWebSocket = useCallback(() => {
    if (isConnectingRef.current || (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)) {
      return
    }

    const wsUrl = `wss://uat.ppmbackend.projectpulse360.com/statusTaskUpdate?taskId=${rowData?.TaskID}`
    isConnectingRef.current = true

    try {
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log(`WebSocket connected for task ${rowData?.TaskID}`)
        isConnectingRef.current = false
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('Task update received:', data)
          
          // Increment message count when new message arrives
          setMessageCount(prev => prev + 1)
          // handleSendUpdate(data.Message)
          // Refetch tasks when update is received
          refetch()
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        isConnectingRef.current = false
      }

      ws.onclose = (event) => {
        isConnectingRef.current = false
        socketRef.current = null

        // Auto-reconnect logic
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket()
          }, reconnectInterval)
        }
      }

      socketRef.current = ws
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      isConnectingRef.current = false
    }
  }, [rowData?.TaskID, refetch])

  /**
   * Disconnect WebSocket
   */
  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (socketRef.current) {
      socketRef.current.close(1000, 'Component unmounting')
      socketRef.current = null
    }

    reconnectAttemptsRef.current = 0
    isConnectingRef.current = false
  }, [])

  // Connect on mount and disconnect on unmount
  useEffect(() => {
    connectWebSocket()

    return () => {
      disconnectWebSocket()
    }
  }, [connectWebSocket, disconnectWebSocket])

  const handleTaskViewClick = () => {
    setOpenTaskView(true)
    // Reset message count when dialog is opened
    
    setMessageCount(0)
  }

  const handleClose = () => setOpenTaskView(false)


  const handleSendUpdate = async (value) => {
    try {
      const body = {
        message:value ,
          taskID:rowData?.TaskID
       
      }

      const updateRes = await writeTaskUpdate(body)

      // refetch()
      //setWriteUpdate(false)

      if (updateRes?.status) {
        toast.success('Task-Update Message was recorded successfully!')
      }
    } catch {}
  }
  return (
    <>
      <Box display={'flex'} gap={3} alignItems={'center'}>
        {renderTextField}
        <IconButton size='small' onClick={handleTaskViewClick}>
          <SmallBadge badgeContent={messageCount} color="error">
            <Icon icon={'lucide:message-circle-more'} fontSize={22} />
          </SmallBadge>
        </IconButton>
      </Box>
      <TaskDetailsDialog open={openTaskView} close={handleClose} taskData={rowData} refetchTasks={refetch} />
    </>
  )
}

export default TaskNameCell
