'use client'

import { useState, useEffect } from 'react'

import Image from 'next/image'

import { Box, Typography, CircularProgress } from '@mui/material'

import CustomButton from '@/components/button'
import { useWorkspace } from '@/context/workspace-context'
import CreateWorkspaceDialog from '../sidebar/create-workspace-dialog'
import { Icon } from '@iconify/react'
import WorkspaceMen from '@public/images/cards/workspace-men.svg'
import { useAuth } from '@/hooks/useAuth'
import SubscriptionExpiredDialog from '@/views/paymentpopup/SubscriptionExpiredDialog'
import { useRazorpayPayment } from '../paymentpopup/useRazorpayPayment'
import axios from 'axios'

const DashboardPage = () => {
  // ** State
  const [open, setOpen] = useState(false)
  const [showPaymentExpiredDialog, setShowPaymentExpiredDialog] = useState(false)
  const [shouldOpenDialog, setShouldOpenDialog] = useState(false)
  const { refetchWorkspaces, workspace, projects } = useWorkspace() // <-- added `projects` here, swap the field name if your context uses a different key

  const { profile, user } = useAuth()

  // ** Use Payment Hook
  // const { isLoading, razorpayLoaded, generateRazorPayOrder } = useRazorpayPayment({
  //   userId: Number(user?.id),
  //   onPaymentSuccess: () => {
  //     const canOpen = checkPaymentStatus()
  //     setShouldOpenDialog(canOpen)
  //     setShowPaymentExpiredDialog(false)
  //   },
  //   onPaymentFailure: () => {
  //     const canOpen = checkPaymentStatus()
  //     setShouldOpenDialog(canOpen)
  //     setShowPaymentExpiredDialog(true)
  //   }
  // })

  const handleOpen = () =>{
    const workspaceCount = workspace?.length ?? 0
  const projectCount = projects?.length ?? 0
 
  const hasUsedFreeQuota = workspaceCount > 0 || projectCount > 0

  if (hasUsedFreeQuota) {
    const canOpen = checkPaymentStatus()
    if (canOpen) {
  setOpen(true)
    }
  } else {
    // First workspace/project — always free, no payment check needed
    setOpen(true)
  }
  } 

  const handleClose = () => {
    setOpen(false)
  }


  const { isLoading, razorpayLoaded, generateRazorPayOrder } = useRazorpayPayment({
    userId: Number(user?.id),
    onPaymentSuccess: () => {
      const canOpen = checkPaymentStatus()

      setShouldOpenDialog(canOpen)
      setShowPaymentExpiredDialog(false)
    },
    onPaymentFailure: () => {
      const canOpen = checkPaymentStatus()

      setShouldOpenDialog(canOpen)
      setShowPaymentExpiredDialog(true)
    }
  })

  // const checkPaymentStatus = () => {
  //   const paymentStatus = localStorage.getItem('paymentStatus')

  //   const workspaceCount = workspace?.length ?? 0
  //   const projectCount = projects?.length ?? 0

  //   // If either the workspace count or project count is greater than 0, block and show the payment popup.
  //   // Only when BOTH are 0 is the user allowed through without payment.
  //   if (workspaceCount > 0 ) {
  //     setShowPaymentExpiredDialog(true)
  //     return false
  //   }

  //   try {
  //     if (paymentStatus) {
  //       const parsed = JSON.parse(paymentStatus)

  //       // If parsed explicitly says expired, show payment dialog and disallow opening the Task Group dialog
  //       if (parsed.isExpired == true) {
  //         setShowPaymentExpiredDialog(true)
  //         return false
  //       }
  //       // If parsed explicitly says not expired, ensure payment dialog is hidden and allow opening Task Group dialog
  //       if (parsed.isExpired == false) {
  //         setShowPaymentExpiredDialog(false)
  //         return true
  //       }
  //       // In case parsed.isExpired is missing or unexpected, be conservative: treat as expired
  //       setShowPaymentExpiredDialog(true)
  //       return false
  //     }
  //     // No stored status, but both workspaceCount and projectCount are 0, so allow the first creation
  //     setShowPaymentExpiredDialog(false)
  //     return true
  //   } catch (error) {
  //     console.error('Error parsing payment status:', error)
  //     // On parse error, treat as expired to be safe
  //     setShowPaymentExpiredDialog(true)
  //     return false
  //   }
  // }
const checkPaymentStatus = () => {
  const paymentStatus = localStorage.getItem('paymentStatus')
  const workspaceCount = workspace?.length ?? 0
  const projectCount = projects?.length ?? 0
  const hasUsedFreeQuota = workspaceCount > 0 || projectCount > 0

  // If the free quota hasn't been used yet, always allow — no need to even
  // look at payment status.
  if (!hasUsedFreeQuota) {
    setShowPaymentExpiredDialog(false)
    return true
  }

  // Free quota is used up — payment status now decides.
  try {
    if (paymentStatus) {
      const parsed = JSON.parse(paymentStatus)

      if (parsed.isExpired == true) {
        setShowPaymentExpiredDialog(true)
        return false
      }
      if (parsed.isExpired == false) {
        setShowPaymentExpiredDialog(false)
        return true
      }
      // Unexpected shape — be conservative
      setShowPaymentExpiredDialog(true)
      return false
    }
    // No stored status at all, quota already used → must pay
    setShowPaymentExpiredDialog(true)
    return false
  } catch (error) {
<<<<<<< HEAD
    console.error('Error parsing payment status:', error)
=======
   // console.error('Error parsing payment status:', error)
>>>>>>> source-link/main
    setShowPaymentExpiredDialog(true)
    return false
  }
}
  const handleClosePaymentDialog = () => {
    setShowPaymentExpiredDialog(false)
  }
// useEffect(() => {
//   paymentcheck()
// }, [])
const paymentcheck = async () => {
  const Baseurl = process.env.NEXT_PUBLIC_API_URL1
  const userid = localStorage.getItem('userData')
  const value= JSON.parse(userid as string)
  try {
    const res = await axios.post(`${Baseurl}/CheckAccountExpiry/${value?.userData?.UserID}`)

    
    if (res.data && res.data.length > 0) {
      const paymentData = {
       isExpired: res.data[0].isExpired,
       projectCount:res.data[0].projectCount,
       workspaceCount:res.data[0].workspaceCount,
       taskGroupCount:res.data[0].taskGroupCount,
       boardCount:res.data[0].boardCount,
       boardsectionCount:res.data[0].boardsectionCount,
       boardTaskCount:res.data[0].boardTaskCount,
       amount:res.data[0].amount
            //  isExpired: true
      }
      // localStorage.setItem('paymentStatus', JSON.stringify(paymentData))
            localStorage.setItem('paymentStatus', JSON.stringify(paymentData))


    }
  } catch (error) {
<<<<<<< HEAD
    console.error('Payment check error:', error)
=======
   // console.error('Payment check error:', error)
>>>>>>> source-link/main
  }
}






  const roleData = localStorage.getItem('Role');
const parsedData = JSON.parse((roleData)as any);
const rolename = parsedData?.rolename;
  return (
    <>
      <SubscriptionExpiredDialog
        open={showPaymentExpiredDialog}
        onClose={handleClosePaymentDialog}
        onRenew={generateRazorPayOrder}
        isLoading={isLoading}
        razorpayLoaded={razorpayLoaded}
      />

      <Box>
        <Typography className='text-lg lg:text-3xl font-bold text-textPrimary'>Create your workspace</Typography>
        <div className='flex items-center justify-between rounded-4xl flex-wrap border border-bgDivider px-6 mt-4'>
          <Box py={6}>
            <Typography className='font-normal text-base lg:text-lg'>Welcome To</Typography>
            {rolename !== 'Viewer' ? (
 <Typography className='font-bold text-lg lg:text-xl' my={1}>
              Your Workspace Area
            </Typography>
            ):
        (
            <Typography className='font-bold text-lg lg:text-xl' my={1}>
           Project Plus
            </Typography>
              )}
                          {rolename !== 'Viewer' &&

            <Typography className='font-normal text-base lg:text-lg'>Create your perfect workspace here</Typography> }
          {rolename !=='Viewer' &&
           <CustomButton circular size='small' className='mt-10 px-6' variant='contained' onClick={handleOpen}>
              Create
            </CustomButton>
}
          </Box>

          <Image
            alt='man doing work'
            src={WorkspaceMen}
            style={{
              objectFit: 'cover',
              maxWidth: '100%',
              maxHeight: '100%',
              height: 'auto',
              width: 'auto',
              marginTop: 10,
              marginBottom: 10
            }}
          />
        </div>
      </Box>
      <CreateWorkspaceDialog open={open} onCloseModal={handleClose} refetchWorkspaces={refetchWorkspaces} />
    </>
  )
}

export default DashboardPage
