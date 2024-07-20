import { Avatar, AvatarGroup, Box } from '@mui/material'
import React from 'react'

const TaskPeople = ({ data }) => {
  return (
    <Box display={'flex'} height={'100%'} alignItems={'center'}>
      <AvatarGroup max={2}>
        {data?.map(item => (
          <Avatar
            key={item?.UserID}
            alt={item?.Name}
            title={item?.Email?.toLowerCase()}
            src='/images/avatars/3.png'
            sx={{ width: 32, height: 32 }}
          />
        ))}
      </AvatarGroup>
    </Box>
  )
}

export default TaskPeople
