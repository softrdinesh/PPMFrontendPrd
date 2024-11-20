import { fetchProfileData } from '@api/user'
import FallbackSpinner from '@components/spinner'
import OverviewCard from '@custom-components/profile/overview'
import ProfileTabs from '@custom-components/profile/tabs'
import { Grid } from '@mui/material'
import React from 'react'
import { useQuery } from 'react-query'
import { useAuth } from 'src/hooks/useAuth'

const ProfilePage = () => {
  const { user } = useAuth()
  const { data, isLoading, refetch } = useQuery({ queryKey: ['profile', user?.UserID], queryFn: fetchProfileData })

  if (isLoading) return <FallbackSpinner height={'80vh'} />

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <OverviewCard data={data} refetch={refetch} />
      </Grid>
      <Grid item xs={12} md={8}>
        <ProfileTabs data={data} refetch={refetch} />
      </Grid>
    </Grid>
  )
}

export default ProfilePage
