import { useEffect, useRef } from 'react'
import io from 'socket.io-client'

const useSocket = (projectId, handleUpdate) => {
  const socket = useRef(null)

  useEffect(() => {
    socket.current = io(process?.env?.NEXT_PUBLIC_API_URL)

    // Subscribe to the project room
    socket.current.emit('subscribeToProject', projectId)

    // Listen for updates
    socket.current.on('projectUpdate', message => {
      if (message.projectId === projectId) {
        let data = message?.data
        try {
          data = JSON.parse(message?.data)
        } catch {
          data = message?.data
        }
        handleUpdate(data)
      }
    })

    // Cleanup when component unmounts or projectId changes
    return () => {
      socket.current.emit('unsubscribeFromProject', projectId)
      socket.current.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  return socket?.current
}

export default useSocket
