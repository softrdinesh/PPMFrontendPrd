import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface UseRazorpayPaymentProps {
  userId: number
  onPaymentSuccess?: () => void
  onPaymentFailure?: () => void
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayError {
  error: {
    metadata?: {
      payment_id?: string
      paymentId?: string
      order_id?: string
      orderId?: string
    }
  }
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export const useRazorpayPayment = ({ userId, onPaymentSuccess, onPaymentFailure }: UseRazorpayPaymentProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('')
  const logoImage = 'https://appsuresolutions.netlify.app/assets/header_logo-Bj3Dgdu3.svg'

  // Load Razorpay SDK once
  useEffect(() => {
    const scriptId = 'razorpay-sdk'
    if (document.getElementById(scriptId)) {
      setRazorpayLoaded(Boolean((window as any).Razorpay))
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      setRazorpayLoaded(true)
    }
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK')
      setRazorpayLoaded(false)
    }
    document.body.appendChild(script)
  }, [])

  const updatePaymentConfirmation = async (
    userIdParam: number,
    paymentId?: string | null,
    status: string = ''
  ) => {
    try {
      const baseUrl = 'https://uat.ppmbackend.projectpulse360.com/UpdatePaymentconfirmation'
      const params = new URLSearchParams()
      params.append('UserID', String(userIdParam))
      params.append('PaymentID', paymentId ?? '')

      const url = `${baseUrl}?${params.toString()}`

      const resp = await fetch(url, {
        method: 'POST'
      })

      const text = await resp.text()

      const isExpired = status !== 'Success'
      const paymentData = {
        isExpired
      }
      localStorage.setItem('paymentStatus', JSON.stringify(paymentData))

      return { ok: resp.ok, status: resp.status, body: text }
    } catch (err) {
      console.error('Error calling UpdatePaymentconfirmation:', err)
      const paymentData = {
        isExpired: true
      }
      try {
        localStorage.setItem('paymentStatus', JSON.stringify(paymentData))
      } catch (e) {
        console.error('Error saving paymentStatus to localStorage on failure:', e)
      }
      return { ok: false, error: err }
    }
  }

  const openRazorPaySdk = async (razorPayOrderId: string, amount: number) => {
    if (!razorpayLoaded || !window.Razorpay) {
      alert('Razorpay SDK is not loaded yet. Please wait and try again.')
      console.error('Razorpay SDK not loaded')
      return
    }

    setIsLoading(false)
    setPaymentStatus('')

    const options = {
      key: 'rzp_test_S2PQXDlmtoFOad',
      name: 'Your Company Name',
      description: 'Subscription Payment',
      image: logoImage,
      order_id: razorPayOrderId,
      handler: function (response: RazorpayResponse) {
        setPaymentStatus('Payment Successful!')
        toast.success('Payment successful! Subscription activated.')

        updatePaymentConfirmation(userId, response.razorpay_payment_id, 'Success')
          .then(res => {
            onPaymentSuccess?.()
          })
          .catch(err => {
            console.error('Error updating payment confirmation after success:', err)
            try {
              localStorage.setItem('paymentStatus', JSON.stringify({ isExpired: false }))
              onPaymentSuccess?.()
            } catch (e) {
              console.error('Failed to write local payment status after success fallback:', e)
            }
          })
      },
      modal: {
        confirm_close: true,
        ondismiss: async (reason: any) => {
          const dismissReason = reason === undefined ? 'cancelled' : reason

          if (reason === undefined) {
            setPaymentStatus('Payment Cancelled')
            toast.error('Payment cancelled. Please complete the payment to activate your subscription.')

            updatePaymentConfirmation(userId, '', 'Cancelled')
              .then(res => {
                onPaymentFailure?.()
              })
              .catch(err => {
                console.error('Error updating cancellation confirmation:', err)
                try {
                  localStorage.setItem('paymentStatus', JSON.stringify({ isExpired: true }))
                  onPaymentFailure?.()
                } catch (e) {
                  console.error('Error writing cancel fallback to localStorage:', e)
                }
              })
          } else if (reason === 'timeout') {
            setPaymentStatus('Payment Timed Out')
            toast.error('Payment timed out. Please try again.')

            updatePaymentConfirmation(userId, '', 'Timeout')
              .then(res => {
                onPaymentFailure?.()
              })
              .catch(err => {
                console.error('Error updating timeout confirmation:', err)
                try {
                  localStorage.setItem('paymentStatus', JSON.stringify({ isExpired: true }))
                  onPaymentFailure?.()
                } catch (e) {
                  console.error('Error writing timeout fallback to localStorage:', e)
                }
              })
          } else {
            setPaymentStatus('Payment Failed')
            toast.error('Payment failed. Please check your payment details and try again.')

            updatePaymentConfirmation(userId, '', 'Failed')
              .then(res => {
                onPaymentFailure?.()
              })
              .catch(err => {
                console.error('Error updating failure confirmation:', err)
                try {
                  localStorage.setItem('paymentStatus', JSON.stringify({ isExpired: true }))
                  onPaymentFailure?.()
                } catch (e) {
                  console.error('Error writing failure fallback to localStorage:', e)
                }
              })
          }
        }
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9042531799'
      },
      theme: {
        color: '#e59722'
      }
    }

    try {
      const rzp1 = new window.Razorpay(options)

      rzp1.on('payment.failed', function (response: RazorpayError) {
        setIsLoading(false)
        setPaymentStatus('Payment Failed')
        toast.error('Payment failed. Please check your payment details and try again.')

        const failedPaymentId =
          response?.error?.metadata?.payment_id ?? response?.error?.metadata?.paymentId ?? ''

        updatePaymentConfirmation(userId, failedPaymentId, 'Failed')
          .then(res => {
            onPaymentFailure?.()
            console.log('Failed payment confirmation result:', res)
          })
          .catch(err => {
            console.error('Error updating failed payment confirmation:', err)
            try {
              localStorage.setItem('paymentStatus', JSON.stringify({ isExpired: true }))
              onPaymentFailure?.()
            } catch (e) {
              console.error('Error writing failed fallback to localStorage:', e)
            }
          })
      })

      rzp1.open()
    } catch (error) {
      console.error('Error opening Razorpay:', error)
    }
  }

  const generateRazorPayOrder = async () => {
    if (!razorpayLoaded) {
      return
    }

    setIsLoading(true)
    setPaymentStatus('')

    try {
      const formData = new FormData()
      formData.append('amount', '100')

      const response = await fetch(`https://uat.ppmbackend.projectpulse360.com/GenerateRazorID/`, {
        method: 'POST',
        headers: {},
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setIsLoading(false)

      if (data && data.id) {
        openRazorPaySdk(data.id, 30)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('generateRazorPayOrder Error:', error)
      setPaymentStatus('Error generating order')
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    razorpayLoaded,
    paymentStatus,
    generateRazorPayOrder
  }
}
