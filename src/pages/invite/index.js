import { acceptInvitationApi } from '@api/project'
import { Box, CircularProgress, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'

import CustomButton from '@components/button'
import acceptedInvite from '@images/pages/accepted-invite.svg'
import accessDenied from '@images/pages/access-denied.svg'
import { routes } from '@routes'
import toast from 'react-hot-toast'
import { useWorkspace } from 'src/context/workspace-context'
import { useAuth } from 'src/hooks/useAuth'

const InvitationManagementPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { refetchWorkspaces } = useWorkspace()

  const invitationID = router.query?.invitation_id

  const [response, setResponse] = useState(null)

  const acceptInvitationApiCall = useCallback(async () => {
    if (invitationID) {
      try {
        const response = await acceptInvitationApi(invitationID)
        console.log('response :', response)

        setResponse(response)
        if (response?.data?.projectID) {
          refetchWorkspaces()
          router.replace(`/project/${response?.data?.projectID}`)
        } else {
          if (response?.statusCode === 307) {
            if (response?.data?.redirect === '/register') {
              router.replace(`/invite/register?invitationID=${router.query?.invitation_id}`)
            } else {
              router.replace({
                pathname: routes.login,
                query: { returnUrl: router.asPath }
              })
            }
          }
          if (response?.statusCode === 403) {
            if (user) {
              toast.error(`You need to be logged in with valid account to accept invitation`)
            } else {
              router.replace({
                pathname: routes.login,
                query: { returnUrl: router.asPath }
              })
            }
          }
        }
      } catch (error) {
        console.error('Invitation Accept Error :', error)
        setResponse(null)
      }
    }
  }, [invitationID, refetchWorkspaces, router, user])

  useEffect(() => {
    acceptInvitationApiCall()
  }, [acceptInvitationApiCall])

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      flexDirection={'column'}
      gap={20}
      justifyContent={'center'}
      height={'100dvh'}
    >
      {response?.statusCode === 403 ? (
        <>
          <Typography variant='h5' fontWeight={800}>
            Access Denied
          </Typography>
          <Image
            src={accessDenied}
            alt='Access Denied'
            width={400}
            height={400}
            style={{ width: '100%', maxWidth: 400, height: 'auto' }}
          />
          <CustomButton circular variant='contained' onClick={() => router.replace(routes.dashboard)}>
            Back to home
          </CustomButton>
        </>
      ) : response?.statusCode === 200 ? (
        <>
          <Image
            src={acceptedInvite}
            alt='Invite Accepted'
            width={400}
            height={400}
            style={{ width: '100%', maxWidth: 400, height: 'auto' }}
          />
          <Typography variant='h5' fontWeight={800}>
            Invitation accepted
          </Typography>
        </>
      ) : (
        <CircularProgress />
      )}
    </Box>
  )
}

InvitationManagementPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
InvitationManagementPage.authGuard = false

export default InvitationManagementPage
