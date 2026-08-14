'use client'

import { useState, useRef, type ChangeEvent } from 'react'
import {
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Tooltip,
  alpha,
  Container,
  Chip,
  Backdrop
} from '@mui/material'
import { Icon } from '@iconify/react'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'

interface FeedbackScreenProps {
  onSubmit?: (message: string, file: File | null) => void | Promise<void>
  userId?: string | number // Changed from projectId to userId
}

const MAX_LENGTH = 500
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
  'application/zip'
]

const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'pdf':
      return 'mdi:file-pdf-box'
    case 'doc':
    case 'docx':
      return 'mdi:file-word-box'
    case 'xls':
    case 'xlsx':
      return 'mdi:file-excel-box'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'mdi:file-image-box'
    case 'zip':
      return 'mdi:folder-zip'
    case 'txt':
      return 'mdi:file-document-box'
    default:
      return 'mdi:file-outline'
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// API Service function - Updated to use userId
const submitFeedbackToAPI = async (message: string, file: File | null, userId: string | number) => {
  const formData = new FormData()
  formData.append('Feedbackmessage', message) // Using Feedbackmessage as per your comment
  if (file) {
    formData.append('file', file)
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL1}/CreateFeedback/${message}/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add any authentication headers if needed:
          // 'Authorization': `Bearer ${yourToken}`,
          // 'Accept': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      }
    )
    return response.data
  } catch (error) {
<<<<<<< HEAD
    console.error('API Error:', error)
=======
   // console.error('API Error:', error)
>>>>>>> source-link/main
    throw error
  }
}

const FeedbackScreen = ({ onSubmit, userId }: FeedbackScreenProps) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const trimmedLength = message.trim().length
  const isValid = trimmedLength > 0 && message.length <= MAX_LENGTH
  const isOverLimit = message.length > MAX_LENGTH

  const toastStyle = {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    padding: '12px 20px',
    borderRadius: '12px',
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
    border: `1px solid ${theme.palette.divider}`,
    maxWidth: '400px',
    fontSize: '14px',
    fontWeight: 500
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File exceeds the 5MB limit', {
        position: 'top-center',
        duration: 4000,
        style: toastStyle,
        iconTheme: { primary: theme.palette.error.main, secondary: theme.palette.background.paper }
      })
      e.target.value = ''
      return
    }

    if (!ALLOWED_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      toast.error('File type not supported', {
        position: 'top-center',
        duration: 4000,
        style: toastStyle,
        iconTheme: { primary: theme.palette.error.main, secondary: theme.palette.background.paper }
      })
      e.target.value = ''
      return
    }

    setSelectedFile(file)
    e.target.value = ''
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleSubmit = async () => {
    if (!isValid) return
    setIsSubmitting(true)
    
    try {
      // Get userId from props or from authenticated user
      const currentUserId = user?.id ||0 // Fallback to 1 if no userId available
      
      // If custom onSubmit prop is provided, use it
      if (onSubmit) {
        await onSubmit(message.trim(), selectedFile)
      } else {
        // Otherwise, use the API service with userId
        await submitFeedbackToAPI(message.trim(), selectedFile, currentUserId)
      }
      
      setSubmitted(true)
      toast.success('Feedback sent successfully', {
        position: 'top-center',
        duration: 4000,
        style: toastStyle,
        iconTheme: { primary: theme.palette.success.main, secondary: theme.palette.background.paper }
      })
    } catch (error: any) {
<<<<<<< HEAD
      console.error('Error submitting feedback:', error)
=======
      //console.error('Error submitting feedback:', error)
>>>>>>> source-link/main
      
      // Enhanced error handling
      let errorMessage = 'Failed to send feedback. Please try again.'
      
      if (error.response) {
<<<<<<< HEAD
        console.error('Error response:', error.response.data)
        console.error('Error status:', error.response.status)
=======
       // console.error('Error response:', error.response.data)
       // console.error('Error status:', error.response.status)
>>>>>>> source-link/main
        
        if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.'
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid data provided.'
        } else if (error.response.status === 413) {
          errorMessage = 'File too large. Please upload a smaller file.'
        } else if (error.response.status === 404) {
          errorMessage = 'User not found. Please try again.'
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.'
      }
      
      toast.error(errorMessage, {
        position: 'top-center',
        duration: 4000,
        style: toastStyle,
        iconTheme: { primary: theme.palette.error.main, secondary: theme.palette.background.paper }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setMessage('')
    setSelectedFile(null)
    setSubmitted(false)
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Toaster />

      {/* Full page backdrop spinner */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)'
        }}
        open={isSubmitting}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <CircularProgress color="primary" size={60} thickness={4} />
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              fontWeight: 500,
              letterSpacing: '0.5px'
            }}
          >
            Submitting your feedback...
          </Typography>
        </Box>
      </Backdrop>

      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: '20px',
            p: { xs: 3, sm: 4.5, md: 5 },
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDark
              ? '0 1px 3px rgba(0,0,0,0.4), 0 20px 60px rgba(0,0,0,0.4)'
              : '0 1px 3px rgba(20,20,43,0.04), 0 20px 60px rgba(20,20,43,0.08)',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: isDark
                ? '0 1px 3px rgba(0,0,0,0.4), 0 24px 72px rgba(0,0,0,0.5)'
                : '0 1px 3px rgba(20,20,43,0.04), 0 24px 72px rgba(20,20,43,0.12)'
            }
          }}
        >
          {/* Decorative accent bar */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px'
            }}
          />

          {/* Header Section */}
          <Box sx={{ mb: 4, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}
              >
                <Icon icon="mdi:message-text-outline" width={24} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.75rem', sm: '2rem' }
                }}
              >
                Send Feedback
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.95rem',
                maxWidth: 600,
                lineHeight: 1.6
              }}
            >
              Let us know what's working or what isn't — your feedback goes straight to our product team.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <Chip
                icon={<Icon icon="mdi:lightning-bolt-outline" width={16} />}
                label="Read weekly"
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.text.primary,
                  fontWeight: 500
                }}
              />
              <Chip
                icon={<Icon icon="mdi:shield-check-outline" width={16} />}
                label="Private & secure"
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.08),
                  color: theme.palette.text.primary,
                  fontWeight: 500
                }}
              />
              <Chip
                icon={<Icon icon="mdi:clock-fast" width={16} />}
                label="Takes &lt; 1 minute"
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.08),
                  color: theme.palette.text.primary,
                  fontWeight: 500
                }}
              />
            </Box>
          </Box>

          {submitted ? (
            <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2.5,
                  backgroundColor: theme.palette.success.main,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.35)}`,
                  animation: 'scaleIn 0.3s ease-out'
                }}
              >
                <Icon icon="mdi:check-bold" width={32} height={32} color={theme.palette.success.contrastText} />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.75, letterSpacing: '-0.01em' }}
              >
                Thank you for your feedback!
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 4, maxWidth: 400, mx: 'auto' }}>
                We appreciate you taking the time to share your thoughts with us.
              </Typography>
              <Button
                onClick={handleReset}
                startIcon={<Icon icon="mdi:refresh" width={18} />}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.primary,
                  borderRadius: '10px',
                  px: 3,
                  py: 1.1,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                  }
                }}
              >
                Send another feedback
              </Button>
            </Box>
          ) : (
            <>
              {/* Feedback Form */}
              <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1 }}>
                <Typography
                  component="label"
                  htmlFor="feedbackMessage"
                  variant="body2"
                  sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                >
                  Feedback message
                  <Typography component="span" sx={{ color: theme.palette.error.main, ml: 0.5 }}>
                    *
                  </Typography>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontVariantNumeric: 'tabular-nums',
                    color: isOverLimit ? theme.palette.error.main : theme.palette.text.secondary,
                    fontWeight: 600,
                    px: 1.5,
                    py: 0.3,
                    borderRadius: '4px',
                    backgroundColor: isOverLimit ? alpha(theme.palette.error.main, 0.08) : 'transparent'
                  }}
                >
                  {message.length}/{MAX_LENGTH}
                </Typography>
              </Box>

              <TextField
                id="feedbackMessage"
                value={message}
                onChange={handleChange}
                placeholder="Type your feedback here..."
                multiline
                rows={isMobile ? 5 : 6}
                fullWidth
                variant="outlined"
                error={isOverLimit}
                disabled={isSubmitting}
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.background.default,
                    borderRadius: '12px',
                    fontSize: '0.9375rem',
                    color: theme.palette.text.primary,
                    transition: 'all 0.2s ease',
                    '& fieldset': { borderColor: theme.palette.divider, borderWidth: 2 },
                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                    '&.Mui-focused fieldset': { 
                      borderColor: theme.palette.primary.main, 
                      borderWidth: 2,
                      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.08)}`
                    },
                    '&.Mui-error fieldset': { borderColor: theme.palette.error.main }
                  }
                }}
              />

              {/* Attachment */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
                  Attachment{' '}
                  <Typography component="span" variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    (optional)
                  </Typography>
                </Typography>

                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleFileSelect}
                  accept={ALLOWED_TYPES.join(',')}
                />

                {!selectedFile ? (
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    startIcon={<Icon icon="mdi:paperclip" width={18} />}
                    variant="outlined"
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      borderRadius: '12px',
                      borderColor: theme.palette.divider,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      color: theme.palette.text.secondary,
                      textTransform: 'none',
                      fontWeight: 500,
                      py: 1.3,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        borderStyle: 'dashed',
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Attach a file (max 5MB)
                  </Button>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: '12px',
                      backgroundColor: theme.palette.background.default,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        flexShrink: 0
                      }}
                    >
                      <Icon icon={getFileIcon(selectedFile.name)} width={22} color={theme.palette.primary.main} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {selectedFile.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {formatFileSize(selectedFile.size)}
                      </Typography>
                    </Box>
                    <Tooltip title="Remove attachment">
                      <IconButton
                        size="small"
                        onClick={handleRemoveFile}
                        disabled={isSubmitting}
                        sx={{
                          color: theme.palette.text.secondary,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                            color: theme.palette.error.main
                          }
                        }}
                      >
                        <Icon icon="mdi:close" width={20} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>

              <Button
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                fullWidth
                startIcon={!isSubmitting && <Icon icon="mdi:send-outline" width={20} />}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-2px)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: alpha(theme.palette.text.primary, 0.08),
                    color: alpha(theme.palette.text.primary, 0.3),
                    boxShadow: 'none'
                  }
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={22} sx={{ color: theme.palette.action.disabled }} />
                ) : (
                  'Submit Feedback'
                )}
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mt: 2.5,
                  pt: 2,
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                }}
              >
                <Icon icon="mdi:lock-outline" width={16} color={theme.palette.text.secondary} />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                  Sent privately — never shared publicly
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Container>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  )
}

export default FeedbackScreen
