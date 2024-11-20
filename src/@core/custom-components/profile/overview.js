import { Avatar, Box, Button, Card, CardContent, Divider, Typography } from '@mui/material'
import { getInitials } from '@utils/get-initials'
import React from 'react'

const UserDetails = ({ title, value }) => {
  return (
    <Box display={'flex'} alignItems={'center'} gap={2}>
      <Typography fontWeight={600} fontSize={15}>
        {title}:
      </Typography>
      <Typography fontSize={15}>{value}</Typography>
    </Box>
  )
}

const OverviewCard = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Box display={'flex'} flexDirection={'column'} gap={5}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} pt={8}>
            <Avatar
              variant='rounded'
              sx={{ width: 120, height: 120, boxShadow: theme => theme.shadows[4] }}
              src={data?.ProfilePicture}
            >
              {getInitials(data?.Name)}
            </Avatar>
          </Box>
          <Typography fontSize={17} fontWeight={500} textAlign={'center'}>
            {data?.Name}
          </Typography>
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Typography fontSize={19}>Details</Typography>
            <Divider />
            <UserDetails title={'Name'} value={data?.Name} />
            <UserDetails title={'Email'} value={data?.Email?.toLowerCase()} />
            <UserDetails title={'Country'} value={data?.country?.Name} />
            <UserDetails title={'Address'} value={data?.Address ?? '-'} />
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2}>
            <Button variant='contained'>Edit</Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default OverviewCard
