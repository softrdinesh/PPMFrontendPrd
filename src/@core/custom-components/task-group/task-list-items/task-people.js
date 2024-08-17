import { Avatar, AvatarGroup, Box, Tooltip } from '@mui/material'
import React from 'react'

const TaskPeople = ({ data }) => {
  console.log('data :', data)

  return (
    <Box display={'flex'} height={'100%'} alignItems={'center'}>
      <AvatarGroup max={2}>
        {data?.map(item => (
          <Tooltip key={item?.UserID} title={item?.Email?.toLowerCase()}>
            <Avatar alt={item?.Name} src='/images/avatars/3.png' sx={{ width: 32, height: 32 }} />
          </Tooltip>
        ))}
      </AvatarGroup>
    </Box>
  )
}

export default TaskPeople
