'use client'

import { useCallback, useEffect, useState } from 'react'

import Image from 'next/image'
import { usePathname,useSearchParams,useRouter } from 'next/navigation'

import { Box, CircularProgress,Zoom, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

import toast from 'react-hot-toast'

import acceptedInvite from '@public/images/pages/accepted-invite.svg'
import accessDenied from '@public/images/pages/access-denied.svg'

import { routes } from '@/constants/routes'

import CustomButton from '@components/button'
import { useWorkspace } from 'src/context/workspace-context'
import { useAuth } from 'src/hooks/useAuth'
import type { ApiResponse } from '@/types/api-response'
import { acceptInvitationApi } from '@/services/modules/invite'

const InvitationManagementPage = ({ invitationID }: { invitationID: string }) => {
  const router = useRouter()
  const { user } = useAuth()
  const pathname = usePathname()
  const { refetchWorkspaces } = useWorkspace()
const [accept, setaccept] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [showAccessDeniedPopup, setShowAccessDeniedPopup] = useState(false)
<<<<<<< HEAD

  const auth = useAuth()

=======
  const auth = useAuth()
const [acceptemail, setacceptemail] = useState(false)
>>>>>>> source-link/main

  const handleUserLogout = async () => {
    // Redirect to login page
    await fetch('/api/logout', { method: 'POST' })

    auth.logout()
  
     localStorage.clear()
  //  router.replace(`${routes.invite}?invitation_id=${invitationID}`)
    router.replace(`/invite?invitation_id=${invitationID}`);
  // Force a hard refresh to ensure clean state
  window.location.reload();
  }
  const acceptInvitationApiCall = useCallback(async () => {
    if (invitationID) {
      try {
        const response = await acceptInvitationApi(invitationID)

        setResponse(response)

        if (response?.data?.projectID) {
          refetchWorkspaces()
             if (response?.statusCode == 202) {
<<<<<<< HEAD
           
  toast.success("The invitation has already been accepted", { duration: 5000 })
          }
              if (response?.statusCode == 200) {
   
              toast.success(`Invitation accepted successfully!`,{ duration: 5000 })   
          }
          router.replace(`/project/${response?.data?.projectID}`)
=======
           setaccept(true)
     //toast.success("The invitation has already been accepted", { duration: 5000 })
          }
              if (response?.statusCode == 200) {
                 setacceptemail(true)
              toast.success(`Invitation accepted successfully!`,{ duration: 5000 })   
                      //  router.replace(`/project/${response?.data?.projectID}`)

          }
>>>>>>> source-link/main
        } else {
          if (response?.statusCode === 307) {
            if (response?.data?.redirect === '/register') {
              router.replace(`/invite/register?invitationID=${invitationID}`)
            } else {
              //router.replace(routes.login + `?returnUrl=${pathname}`)
                  setShowAccessDeniedPopup(true)
            }

          }

    

      
          if (response?.statusCode == 403) {
            //if (user) {
              toast.error(`You need to be logged in with valid account to accept invitation`)
              // setShowAccessDeniedPopup(true)
              handleUserLogout()
            //} else {
              // router.replace(routes.login + `?returnUrl=${pathname}`)
           // }
          }
              if (response?.statusCode == 200) {
   
              toast.success(`Invitation accepted successfully!`,{ duration: 5000 })   
          }
        

        }
      } catch (error) {
<<<<<<< HEAD
        console.error('Invitation Accept Error :', error)
=======
      //  console.error('Invitation Accept Error :', error)
>>>>>>> source-link/main
        setResponse(null)
      }
    }
  }, [invitationID, pathname, refetchWorkspaces, router, user])

  useEffect(() => {
    acceptInvitationApiCall()
  }, [acceptInvitationApiCall])

 

 const redirect=()=>{
  router.push("/login") 
 }
  
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      flexDirection={'column'}
      gap={20}
      justifyContent={'center'}
      height={'100dvh'}
    >
      {/* {response?.statusCode == 403 ? (
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
      ) : {  ( */}
       {response?.statusCode === 200 ? (

   
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
    ):(
    <CircularProgress />
    )}
      {/* // ) : {
     
      // )} */}
<<<<<<< HEAD

=======
{/* already accept popup */}
>>>>>>> source-link/main
<Dialog
     open={accept} onClose={() => setaccept(false)}
      TransitionComponent={Zoom}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15,15,20,0.55)' }
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 24px 70px rgba(0,0,0,0.25)',
          overflow: 'hidden'
        }
      }}
    >
      <Box bgcolor={'background.default'}>
        <Box className="flex flex-col items-center justify-center px-10 py-12">
          {/* Illustration */}
          <Box className="mb-2" sx={{ width: '100%', maxWidth: 220 }}>
            <Image
              src={acceptedInvite}
              alt='Invitation already accepted'
              width={220}
              height={220}
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>

          {/* Title */}
          <Typography variant='h5' fontWeight={800} className="mb-2 text-center">
            Already Accepted
          </Typography>

          {/* Message */}
          <Typography variant="body2" className="text-center mb-8" color="text.secondary" sx={{ maxWidth: 360 }}>
<<<<<<< HEAD
            This Invitation Accepted Successfully.
          </Typography>

          {/* Buttons */}
          <Box className="flex gap-3 w-full">
            {/* <CustomButton
              circular
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => setShowAccessDeniedPopup(false)}
            >
              Cancel
            </CustomButton> */}
=======
This invitation has already been accepted. You can head over to the project page to continue.          </Typography>

          {/* Buttons */}
          <Box className="flex gap-3 w-full">
          
>>>>>>> source-link/main
            <CustomButton
              circular
              variant="contained"
              size="large"
              fullWidth
<<<<<<< HEAD
onClick={redirect}
=======

onClick={() => {
  setaccept(false)
  router.replace(`/project/${response?.data?.projectID}`)
}}
>>>>>>> source-link/main
              sx={{
                backgroundColor: 'primary.main',
                fontWeight: 700,
                py: 1.4,
                boxShadow: '0 8px 20px rgba(25,118,210,0.35)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  boxShadow: '0 10px 24px rgba(25,118,210,0.45)'
                }
              }}
            >Okay
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Dialog>

<<<<<<< HEAD
=======
{/* accept */}
<Dialog
     open={acceptemail} onClose={() => setacceptemail(false)}
      TransitionComponent={Zoom}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15,15,20,0.55)' }
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 24px 70px rgba(0,0,0,0.25)',
          overflow: 'hidden'
        }
      }}
    >
      <Box bgcolor={'background.default'}>
        <Box className="flex flex-col items-center justify-center px-10 py-12">
          {/* Illustration */}
          <Box className="mb-2" sx={{ width: '100%', maxWidth: 220 }}>
            <Image
              src={acceptedInvite}
              alt='Invitation already accepted'
              width={220}
              height={220}
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>

          {/* Title */}
          <Typography variant='h5' fontWeight={800} className="mb-2 text-center">
            Invitation Accepted
          </Typography>

          {/* Message */}
          <Typography variant="body2" className="text-center mb-8" color="text.secondary" sx={{ maxWidth: 360 }}>
This Invitation Accepted Successfully.


        </Typography>

          {/* Buttons */}
          <Box className="flex gap-3 w-full">
          
            <CustomButton
              circular
              variant="contained"
              size="large"
              fullWidth

onClick={() => {
  setacceptemail(false)
  router.replace(`/project/${response?.data?.projectID}`)
}}
              sx={{
                backgroundColor: 'primary.main',
                fontWeight: 700,
                py: 1.4,
                boxShadow: '0 8px 20px rgba(25,118,210,0.35)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  boxShadow: '0 10px 24px rgba(25,118,210,0.45)'
                }
              }}
            >Okay
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Dialog>





>>>>>>> source-link/main

<Dialog
     open={showAccessDeniedPopup} onClose={() => setShowAccessDeniedPopup(false)}
      TransitionComponent={Zoom}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15,15,20,0.55)' }
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 24px 70px rgba(0,0,0,0.25)',
          overflow: 'hidden'
        }
      }}
    >
      <Box bgcolor={'background.default'}>
        <Box className="flex flex-col items-center justify-center px-10 py-12">
          {/* Illustration */}
          <Box className="mb-2" sx={{ width: '100%', maxWidth: 220 }}>
            <Image
              src={accessDenied}
              alt='Please log in to continue'
              width={220}
              height={220}
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>

          {/* Title */}
          <Typography variant='h5' fontWeight={800} className="mb-2 text-center">
            Log In Required
          </Typography>

          {/* Message */}
          <Typography variant="body2" className="text-center mb-8" color="text.secondary" sx={{ maxWidth: 360 }}>
<<<<<<< HEAD
            You already have an account. Please log in to accept this invitation.
          </Typography>

          {/* Buttons */}
          <Box className="flex gap-3 w-full">
            {/* <CustomButton
              circular
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => setShowAccessDeniedPopup(false)}
            >
              Cancel
            </CustomButton> */}
=======
You already have an account. Please log in with the correct account and accept the invitation.          </Typography>

          {/* Buttons */}
          <Box className="flex gap-3 w-full">
            
>>>>>>> source-link/main
            <CustomButton
              circular
              variant="contained"
              size="large"
              fullWidth
onClick={redirect}
              sx={{
                backgroundColor: 'primary.main',
                fontWeight: 700,
                py: 1.4,
                boxShadow: '0 8px 20px rgba(25,118,210,0.35)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  boxShadow: '0 10px 24px rgba(25,118,210,0.45)'
                }
              }}
            >Okay
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
    
    </Box>
  )
}

export default InvitationManagementPage
