import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import CustomButton from '@components/button'
import NewTaskDialog from './task-group-add-dialog'
import SubscriptionExpiredDialog from '@/views/paymentpopup/SubscriptionExpiredDialog'
import { useRazorpayPayment } from '../../paymentpopup/useRazorpayPayment'
import { useAuth } from '@/hooks/useAuth'

const NewTask = (projectlength: any) => {
  const [open, setOpen] = useState(false)
  const [showPaymentExpiredDialog, setShowPaymentExpiredDialog] = useState(false)
  const [shouldOpenDialog, setShouldOpenDialog] = useState(false)
  const { profile, user } = useAuth()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Check payment status and workspace count
  const checkPaymentAndWorkspaceStatus = () => {
    try {
      const localStorageData = localStorage.getItem('paymentStatus')
      
      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData)
        const workspaceCount = projectlength?.projectlength?.length || 0

        // If payment is expired, show payment dialog
        if (parsedData.isExpired === true) {
          setShowPaymentExpiredDialog(true)
          return false
        }

        // If payment is active (isExpired === false)
        if (parsedData.isExpired === false) {
          // Allow creation regardless of workspace count
          setShowPaymentExpiredDialog(false)
          return true
        }

        // If payment status is undefined or unexpected
        setShowPaymentExpiredDialog(true)
        return false
      } else {
        // No payment status found - first time user
        // Allow first workspace creation for free
        const workspaceCount = projectlength?.projectlength?.length || 0
        if (workspaceCount === 0) {
          setShowPaymentExpiredDialog(false)
          return true
        } else {
          setShowPaymentExpiredDialog(true)
          return false
        }
      }
    } catch (error) {
      console.error('Error parsing localStorage:', error)
      setShowPaymentExpiredDialog(true)
      return false
    }
  }

  const handleCreateWorkspaceClick = () => {
    const canProceed = checkPaymentAndWorkspaceStatus()
    if (canProceed) {
      handleOpen()
    }
  }

  const handleClosePaymentDialog = () => {
    setShowPaymentExpiredDialog(false)
  }

  const { isLoading, razorpayLoaded, generateRazorPayOrder } = useRazorpayPayment({
    userId: Number(user?.id),
    onPaymentSuccess: () => {
      // Update payment status to active
      const existingData = localStorage.getItem('paymentStatus')
      if (existingData) {
        try {
          const parsed = JSON.parse(existingData)
          parsed.isExpired = false
          localStorage.setItem('paymentStatus', JSON.stringify(parsed))
        } catch (error) {
          console.error('Error updating payment status:', error)
        }
      } else {
        // Create new payment status if not exists
        localStorage.setItem('paymentStatus', JSON.stringify({
          isExpired: false,
          workspaceCount: 0
        }))
      }

      setShowPaymentExpiredDialog(false)
      // After payment success, check if we should open dialog
      const canOpen = checkPaymentAndWorkspaceStatus()
      if (canOpen) {
        handleOpen()
      }
    },
    onPaymentFailure: () => {
      setShowPaymentExpiredDialog(true)
    }
  })

  // Update dialog state when payment status changes
  useEffect(() => {
    const handleStorageChange = () => {
      checkPaymentAndWorkspaceStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <>
      <CustomButton
        variant='contained'
        startIcon={<Icon icon={'simple-line-icons:plus'} style={{ marginInline: 2 }} />}
        endIcon={<Icon icon={'akar-icons:chevron-down'} style={{ marginInline: 5 }} />}
        sx={{ px: 3.5 }}
        onClick={handleCreateWorkspaceClick}
      >
        New Group
      </CustomButton>
      
      <NewTaskDialog open={open} onCloseModal={handleClose} />
      
      <SubscriptionExpiredDialog
        open={showPaymentExpiredDialog}
        onClose={handleClosePaymentDialog}
        onRenew={generateRazorPayOrder}
        isLoading={isLoading}
        razorpayLoaded={razorpayLoaded}
      />
    </>
  )
}

export default NewTask
