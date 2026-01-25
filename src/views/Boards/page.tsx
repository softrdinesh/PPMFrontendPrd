// src/app/(dashboard)/your-feature/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  Typography, 
  Box, 
  Button, 
  TextField,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Grid,
  CircularProgress
} from '@mui/material'
import { Icon } from '@iconify/react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import TaskColumn from './TaskColumn'
import {NewTaskDialog} from '../../views/project/main-screen/Taskboard'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

interface Task {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  assignee: string
}

interface TaskColumns {
  todo: Task[]
  inProgress: Task[]
  review: Task[]
  done: Task[]
  [key: string]: Task[] // Allow dynamic keys for new categories
}

interface Column {
  id: string
  title: string
  color: string
  icon: string
  iconColor: string
  lightBg: string
  count: number
  boardCategoryID?: number // Add API ID field
}

const YourFeaturePage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const teamMembers = ['John Doe', 'Jane Smith', 'Bob Johnson']
  
  // Loading states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Edit states
  const [editCategoryDialog, setEditCategoryDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Column | null>(null)
  const [editTaskDialog, setEditTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingTaskColumn, setEditingTaskColumn] = useState<string | null>(null)
  
  // Delete states
  const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Column | null>(null)
  
  // Create category states
  const [createCategoryDialog, setCreateCategoryDialog] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedColor, setSelectedColor] = useState('#2196F3') // Default primary color
  
  // Remove snackbar state since we're using react-hot-toast
  // Validation errors for create category
  const [categoryValidationErrors, setCategoryValidationErrors] = useState<{name?: string, color?: string}>({})
  const [categoryLoading, setCategoryLoading] = useState(false)

  // Get icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<string, string> = {
      'todo': 'mdi:clipboard-list-outline',
      'inprogress': 'mdi:progress-clock',
      'review': 'mdi:eye-check-outline',
      'done': 'mdi:checkbox-marked-circle-outline',
      'backlog': 'mdi:clock-outline',
      'blocked': 'mdi:alert-circle-outline',
      'testing': 'mdi:test-tube',
      'deployed': 'mdi:rocket-launch-outline',
      'category': 'mdi:format-list-checks',
      'dev': 'mdi:code-braces',
      'dd': 'mdi:dots-horizontal-circle',
      'valeu': 'mdi:check-circle-outline',
    }
    
    const defaultIcons = [
      'mdi:format-list-checks',
      'mdi:checkbox-multiple-marked-outline',
      'mdi:clipboard-check-outline',
      'mdi:clipboard-flow-outline',
      'mdi:clipboard-text-outline',
    ]
    
    const key = categoryName.toLowerCase().replace(/\s+/g, '')
    return icons[key] || defaultIcons[Math.floor(Math.random() * defaultIcons.length)]
  }

  // Mock data with proper typing
  const [tasks, setTasks] = useState<TaskColumns>({
    todo: [
      { id: '1', title: 'Design System Update', description: 'Update the design system documentation', priority: 'high', assignee: 'John Doe' },
      { id: '2', title: 'API Integration', description: 'Integrate new payment gateway', priority: 'medium', assignee: 'Jane Smith' }
    ],
    inProgress: [
      { id: '3', title: 'Dashboard Redesign', description: 'Redesign the analytics dashboard', priority: 'high', assignee: 'Alex Johnson' }
    ],
    review: [
      { id: '4', title: 'Mobile App Testing', description: 'Test the new mobile app features', priority: 'low', assignee: 'Sam Wilson' }
    ],
    done: [
      { id: '5', title: 'Bug Fixes', description: 'Fix critical bugs reported by users', priority: 'medium', assignee: 'Mike Brown' }
    ]
  })

  // Initialize with empty array - will be populated from API
  const [columns, setColumns] = useState<Column[]>([])

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('https://uat.ppmbackend.projectpulse360.com/GetBoardList?LoginuserID=76')
      
      if (response.data && Array.isArray(response.data)) {
        // Map API response to Column format
        const apiColumns: Column[] = response.data.map((item: any) => {
          // Generate ID from category name (lowercase, no spaces)
          const columnId = item.categoryname.toLowerCase().replace(/\s+/g, '')
          
          return {
            id: columnId,
            title: item.categoryname,
            color: item.colorCode || '#2196F3',
            icon: getCategoryIcon(item.categoryname),
            iconColor: item.colorCode || '#2196F3',
            lightBg: alpha(item.colorCode || '#2196F3', 0.08),
            count: tasks[columnId]?.length || 0,
            boardCategoryID: item.boardCategoryID
          }
        })
        
        setColumns(apiColumns)
        
        // Initialize empty task arrays for any new categories from API
        const updatedTasks = { ...tasks }
        apiColumns.forEach(col => {
          if (!updatedTasks[col.id]) {
            updatedTasks[col.id] = []
          }
        })
        setTasks(updatedTasks)
        
        // Use toast instead of snackbar
       
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      setError('Failed to load categories from API')
      
      // Use toast instead of snackbar
      toast.error('Failed to load categories from API', {
        position: 'top-center',
        duration: 4000,
        style: {
          background: 'white',
          color: 'black',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          maxWidth: '400px',
          fontSize: '14px',
          fontWeight: 500,
        },
      })
      
      // Fallback to default columns if API fails
      const defaultColumns: Column[] = [
        { 
          id: 'todo', 
          title: 'To Do', 
          color: '#2196F3', // Primary color
          icon: 'mdi:clipboard-list-outline',
          iconColor: '#2196F3',
          lightBg: alpha('#2196F3', 0.08),
          count: 0
        },
        { 
          id: 'inprogress', 
          title: 'In Progress', 
          color: '#FF9800', // Warning color
          icon: 'mdi:progress-clock',
          iconColor: '#FF9800',
          lightBg: alpha('#FF9800', 0.08),
          count: 0
        },
        { 
          id: 'review', 
          title: 'Review', 
          color: '#00BCD4', // Info color
          icon: 'mdi:eye-check-outline',
          iconColor: '#00BCD4',
          lightBg: alpha('#00BCD4', 0.08),
          count: 0
        },
        { 
          id: 'done', 
          title: 'Done', 
          color: '#4CAF50', // Success color
          icon: 'mdi:checkbox-marked-circle-outline',
          iconColor: '#4CAF50',
          lightBg: alpha('#4CAF50', 0.08),
          count: 0
        }
      ]
      setColumns(defaultColumns)
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Update columns count when tasks change
  useEffect(() => {
    const updatedColumns = columns.map(col => ({
      ...col,
      count: tasks[col.id]?.length || 0
    }))
    setColumns(updatedColumns)
  }, [tasks])

  const columnsWithCount = columns.map(col => ({
    ...col,
    count: tasks[col.id]?.length || 0
  }))

  const totalTasks = Object.values(tasks).reduce((sum, columnTasks) => sum + columnTasks.length, 0)

  const handleDrop = (taskId: string, columnId: string) => {
    let taskToMove: Task | null = null
    let sourceColumn: string = ''
    
    Object.entries(tasks).forEach(([colId, columnTasks]) => {
      const task = columnTasks.find(t => t.id === taskId)
      if (task) {
        taskToMove = task
        sourceColumn = colId
      }
    })

    if (taskToMove && sourceColumn !== columnId) {
      const updatedTasks = { ...tasks }
      updatedTasks[sourceColumn] = updatedTasks[sourceColumn].filter(t => t.id !== taskId)
      if (!updatedTasks[columnId]) {
        updatedTasks[columnId] = []
      }
      updatedTasks[columnId] = [...updatedTasks[columnId], taskToMove]
      setTasks(updatedTasks)
    }
  }

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleSubmit = async (taskData: any) => {
    console.log('Task submitted:', taskData)
    // Your API call or logic here
  }

  // Create Category handlers
  const handleOpenCreateCategory = () => {
    setNewCategoryName('')
    setSelectedColor('#2196F3')
    setCategoryValidationErrors({})
    setCreateCategoryDialog(true)
  }

  const handleCreateCategory = async () => {
    // Clear previous validation errors
    setCategoryValidationErrors({})
    
    let hasError = false
    const errors: {name?: string, color?: string} = {}

    // Validate category name
    if (!newCategoryName.trim()) {
      errors.name = 'Category name is required'
      hasError = true
    } else if (newCategoryName.length > 50) {
      errors.name = 'Category name must be less than 50 characters'
      hasError = true
    }

    // Validate category name already exists
    const newId = newCategoryName.toLowerCase().replace(/\s+/g, '')
    if (columns.find(col => col.id === newId)) {
      errors.name = 'Category with this name already exists'
      hasError = true
    }

    // Validate color format
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (!colorRegex.test(selectedColor)) {
      errors.color = 'Invalid color format. Use hex format like #2196F3'
      hasError = true
    }

    if (hasError) {
      setCategoryValidationErrors(errors)
      return
    }

    setCategoryLoading(true)

    try {
      // Prepare API request parameters
      const loginUserId = '76' // Static LoginuserID as shown in your API example
      const colorCode = encodeURIComponent(selectedColor) // URL encode the color code
      
      // Make API call to create board category
      const apiUrl = `https://uat.ppmbackend.projectpulse360.com/CreateBoardCategory?Categoryname=${encodeURIComponent(newCategoryName)}&ColorCode=${colorCode}&LoginuserID=${loginUserId}`
      
      const response = await axios.post(apiUrl)
      
      // Check if API call was successful
      if (response.data) {
        // Refresh categories from API after successful creation
        await fetchCategories()
        
        setCreateCategoryDialog(false)
        setNewCategoryName('')
        setSelectedColor('#2196F3')
        setCategoryValidationErrors({})
        
        // Use toast instead of snackbar
        toast.success('Category created successfully', {
          position: 'top-center',
          duration: 4000,
          style: {
            background: 'white',
            color: 'black',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            maxWidth: '400px',
            fontSize: '14px',
            fontWeight: 500,
          },
        })
      } else {
        throw new Error('Failed to create category')
      }
    } catch (error: any) {
      console.error('Error creating category:', error)
      
      // Handle specific error cases
      let errorMessage = 'Failed to create category'
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`
        
        // Handle duplicate category error from server
        if (error.response.status === 400 || (error.response.data?.message && error.response.data.message.toLowerCase().includes('already exists'))) {
          setCategoryValidationErrors({ name: 'Category with this name already exists on the server' })
        }
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'Network error: No response from server'
      } else {
        // Something else happened
        errorMessage = error.message || 'Unknown error occurred'
      }
      
      // Only show toast if there's no field-specific error
      if (!categoryValidationErrors.name) {
        toast.error(errorMessage, {
          position: 'top-center',
          duration: 4000,
          style: {
            background: 'white',
            color: 'black',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            maxWidth: '400px',
            fontSize: '14px',
            fontWeight: 500,
          },
        })
      }
    } finally {
      setCategoryLoading(false)
    }
  }

  const handleCloseCreateCategoryDialog = () => {
    setCreateCategoryDialog(false)
    setCategoryValidationErrors({})
    setNewCategoryName('')
    setSelectedColor('#2196F3')
  }

  // Edit Category handlers
  const handleEditCategory = (column: Column) => {
    setEditingCategory(column)
    setEditCategoryDialog(true)
  }

  const handleSaveCategory = async () => {
    if (editingCategory) {
      try {
        // Prepare API request parameters for update
        const loginUserId = '76' // Static LoginuserID
        const colorCode = encodeURIComponent(editingCategory.color) // URL encode the color code
        
        // Make API call to update board category
        // Using the exact API format you provided: https://uat.ppmbackend.projectpulse360.com/UpdateBoardCategory?Categoryname=DEV&ColorCode=%232196F3&LoginuserID=1&CategoryID=2
        const apiUrl = `https://uat.ppmbackend.projectpulse360.com/UpdateBoardCategory?Categoryname=${encodeURIComponent(editingCategory.title)}&ColorCode=${colorCode}&LoginuserID=${loginUserId}&CategoryID=${editingCategory.boardCategoryID}`
        
        const response = await axios.post(apiUrl)
        
        // Check if API call was successful
        if (response.data) {
          // Refresh categories from API after successful update
          await fetchCategories()
          
          setEditCategoryDialog(false)
          setEditingCategory(null)
          
          // Use toast instead of snackbar
          toast.success('Category updated successfully', {
            position: 'top-center',
            duration: 4000,
            style: {
              background: 'white',
              color: 'black',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              maxWidth: '400px',
              fontSize: '14px',
              fontWeight: 500,
            },
          })
        } else {
          throw new Error('Failed to update category')
        }
      } catch (error: any) {
        console.error('Error updating category:', error)
        
        // Handle specific error cases
        let errorMessage = 'Failed to update category'
        
        if (error.response) {
          // Server responded with error status
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`
        } else if (error.request) {
          // Request made but no response received
          errorMessage = 'Network error: No response from server'
        } else {
          // Something else happened
          errorMessage = error.message || 'Unknown error occurred'
        }
        
        toast.error(errorMessage, {
          position: 'top-center',
          duration: 4000,
          style: {
            background: 'white',
            color: 'black',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            maxWidth: '400px',
            fontSize: '14px',
            fontWeight: 500,
          },
        })
      }
    }
  }

  // Delete Category handlers
  const handleDeleteCategory = (column: Column) => {
    setCategoryToDelete(column)
    setDeleteCategoryDialog(true)
  }

  const handleConfirmDeleteCategory = async () => {
    if (categoryToDelete) {
      // Check if there are tasks in the category
      const tasksInCategory = tasks[categoryToDelete.id] || []
      
      if (tasksInCategory.length > 0) {
        toast.error(`Cannot delete category with ${tasksInCategory.length} task(s). Move or delete tasks first.`, {
          position: 'top-center',
          duration: 4000,
          style: {
            background: 'white',
            color: 'black',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            maxWidth: '400px',
            fontSize: '14px',
            fontWeight: 500,
          },
        })
        setDeleteCategoryDialog(false)
        setCategoryToDelete(null)
        return
      }

      try {
        // Check if category has an ID from API
        if (!categoryToDelete.boardCategoryID) {
          throw new Error('Category does not have a valid ID')
        }

        // Make API call to delete category using the exact API format you provided:
        // https://uat.ppmbackend.projectpulse360.com/RemoveBoardCategory?LoginuserID=76&CategoryID=6
        const apiUrl = `https://uat.ppmbackend.projectpulse360.com/RemoveBoardCategory?LoginuserID=76&CategoryID=${categoryToDelete.boardCategoryID}`
        
        const response = await axios.post(apiUrl)
        
        // Check if API call was successful
        if (response.data) {
          // Refresh categories from API after successful deletion
          await fetchCategories()
          
          setDeleteCategoryDialog(false)
          setCategoryToDelete(null)
          
          toast.success('Category deleted successfully', {
            position: 'top-center',
            duration: 4000,
            style: {
              background: 'white',
              color: 'black',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              maxWidth: '400px',
              fontSize: '14px',
              fontWeight: 500,
            },
          })
        } else {
          throw new Error('Failed to delete category')
        }
      } catch (error: any) {
        console.error('Error deleting category:', error)
        
        // Handle specific error cases
        let errorMessage = 'Failed to delete category'
        
        if (error.response) {
          // Server responded with error status
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`
        } else if (error.request) {
          // Request made but no response received
          errorMessage = 'Network error: No response from server'
        } else {
          // Something else happened
          errorMessage = error.message || 'Unknown error occurred'
        }
        
        toast.error(errorMessage, {
          position: 'top-center',
          duration: 4000,
          style: {
            background: 'white',
            color: 'black',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            maxWidth: '400px',
            fontSize: '14px',
            fontWeight: 500,
          },
        })
      }
    }
  }

  // Edit Task handlers
  const handleEditTask = (task: Task, columnId: string) => {
    setEditingTask(task)
    setEditingTaskColumn(columnId)
    setEditTaskDialog(true)
  }

  const handleSaveTask = () => {
    if (editingTask && editingTaskColumn) {
      const updatedTasks = { ...tasks }
      updatedTasks[editingTaskColumn] = updatedTasks[editingTaskColumn].map(t =>
        t.id === editingTask.id ? editingTask : t
      )
      setTasks(updatedTasks)
      setEditTaskDialog(false)
      setEditingTask(null)
      setEditingTaskColumn(null)
      
      toast.success('Task updated successfully', {
        position: 'top-center',
        duration: 4000,
        style: {
          background: 'white',
          color: 'black',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          maxWidth: '400px',
          fontSize: '14px',
          fontWeight: 500,
        },
      })
    }
  }

  const handleDeleteTask = (taskId: string, columnId: string) => {
    const updatedTasks = { ...tasks }
    updatedTasks[columnId] = updatedTasks[columnId].filter(t => t.id !== taskId)
    setTasks(updatedTasks)
    
    toast.success('Task deleted successfully', {
      position: 'top-center',
      duration: 4000,
      style: {
        background: 'white',
        color: 'black',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        maxWidth: '400px',
        fontSize: '14px',
        fontWeight: 500,
      },
    })
  }

  // Remove handleCloseSnackbar function since we're using toast

  // Add refresh function
  const handleRefreshCategories = () => {
    fetchCategories()
  }

  return (
    <Box 
      sx={{ 
        width: '100%',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}
    >
      {/* Add Toaster component */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'white',
            color: 'black',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            maxWidth: '400px',
            fontSize: '14px',
            fontWeight: 500,
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#4CAF50',
              secondary: 'white',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f44336',
              secondary: 'white',
            },
          },
        }}
      />
      
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          px: { xs: 2, sm: 3, md: 4 },
          py: 3,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            width: { xs: '100%', sm: 'auto' }
          }}>
            {isMobile && (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ mr: 1 }}
              >
                <Icon icon="mdi:menu" />
              </IconButton>
            )}
            <Box
              sx={{
                width: { xs: 44, sm: 48 },
                height: { xs: 44, sm: 48 },
                borderRadius: '12px',
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
              }}
            >
              <Icon 
                icon="mdi:view-dashboard" 
                style={{ 
                  fontSize: '24px', 
                  color: 'white' 
                }} 
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  letterSpacing: '-0.02em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Task Board
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 0.5,
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Manage your team's workflow and track progress
                {error && (
                  <Typography variant="caption" color="error" display="block">
                    {error}
                  </Typography>
                )}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            width: { xs: '100%', sm: 'auto' },
            mt: { xs: 1, sm: 0 }
          }}>

            <Button
              variant="outlined"
              startIcon={<Icon icon="mdi:plus" width={20} />}
              onClick={handleOpenCreateCategory}
              sx={{
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                px: { xs: 2.5, sm: 3 },
                py: { xs: 1, sm: 1.2 },
                borderRadius: '10px',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                fontWeight: 600,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                width: { xs: 'auto', sm: 'auto' },
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              Add Category
            </Button>
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:plus-circle" width={20} />}
              onClick={() => setOpenDialog(true)}
              sx={{
                backgroundColor: theme.palette.primary.main,
                px: { xs: 2.5, sm: 3 },
                py: { xs: 1, sm: 1.2 },
                borderRadius: '10px',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                fontWeight: 600,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                width: { xs: 'auto', sm: 'auto' },
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                }
              }}
            >
              New Task
            </Button>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Box sx={{ 
            position: 'relative', 
            flex: 1, 
            width: '100%',
            maxWidth: { xs: '100%', sm: '420px' }
          }}>
            <Icon 
              icon="mdi:magnify" 
              style={{ 
                position: 'absolute', 
                left: 16, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                fontSize: '20px', 
                color: theme.palette.action.active,
                zIndex: 1 
              }}
            />
            <TextField
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  pl: 5,
                  pr: 2,
                  py: 0.5,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '10px',
                  fontSize: '0.9375rem',
                  '& fieldset': {
                    borderColor: theme.palette.divider,
                    borderWidth: 2
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2
                  }
                }
              }}
            />
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Button
              variant="outlined"
              startIcon={<Icon icon="mdi:filter" width={18} />}
              onClick={handleFilterClick}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                borderRadius: '10px',
                px: { xs: 2, sm: 2.5 },
                py: { xs: 0.75, sm: 1 },
                fontWeight: 500,
                textTransform: 'none',
                flex: { xs: 1, sm: 'auto' },
                whiteSpace: 'nowrap',
                borderWidth: 2,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              Filter
            </Button>
            
            <Chip
              label={`${totalTasks} tasks`}
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: '10px',
                height: { xs: '35px', sm: '40px' },
                ml: { xs: 0, sm: 'auto' },
                px: 1.5,
                '& .MuiChip-label': {
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  px: 1
                }
              }}
            />
          </Box>
        </Box>
      </Paper>

      <NewTaskDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSubmit={handleSubmit}
        teamMembers={teamMembers}
      />  

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[3]
          }
        }}
      >
        <MenuItem onClick={handleFilterClose}>
          <Icon icon="mdi:flag" style={{ marginRight: 12, color: theme.palette.error.main }} />
          Priority: High
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <Icon icon="mdi:flag-outline" style={{ marginRight: 12, color: theme.palette.warning.main }} />
          Priority: Medium
        </MenuItem>
        <MenuItem onClick={handleFilterClose}>
          <Icon icon="mdi:flag-outline" style={{ marginRight: 12, color: theme.palette.success.main }} />
          Priority: Low
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleFilterClose}>
          <Icon icon="mdi:account" style={{ marginRight: 30, color: theme.palette.text.secondary }} />
          Assignee
        </MenuItem>
      </Menu>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: theme.palette.background.paper
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
            Menu
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <MenuItem sx={{ py: 1.5, borderRadius: 1, color: theme.palette.text.primary }}>
            <Icon icon="mdi:home" style={{ marginRight: 12, color: theme.palette.text.secondary }} />
            Dashboard
          </MenuItem>
          <MenuItem sx={{ py: 1.5, borderRadius: 1, color: theme.palette.text.primary }}>
            <Icon icon="mdi:calendar" style={{ marginRight: 12, color: theme.palette.text.secondary }} />
            Calendar
          </MenuItem>
          <MenuItem sx={{ py: 1.5, borderRadius: 1, color: theme.palette.text.primary }}>
            <Icon icon="mdi:chart-bar" style={{ marginRight: 12, color: theme.palette.text.secondary }} />
            Analytics
          </MenuItem>
        </Box>
      </Drawer>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading categories from API...</Typography>
        </Box>
      )}

      {/* Create Category Dialog */}
      <Dialog 
        open={createCategoryDialog} 
        onClose={handleCloseCreateCategoryDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Create New Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={newCategoryName}
            onChange={(e) => {
              setNewCategoryName(e.target.value)
              if (categoryValidationErrors.name) {
                setCategoryValidationErrors(prev => ({ ...prev, name: '' }))
              }
            }}
            sx={{ mt: 2, mb: 1 }}
            placeholder="Enter category name (e.g., Backlog, Testing)"
            autoFocus
            error={!!categoryValidationErrors.name}
            helperText={categoryValidationErrors.name}
            disabled={categoryLoading}
            inputProps={{
              maxLength: 50
            }}
            InputProps={{
              endAdornment: (
                <Typography variant="caption" color="textSecondary">
                  {newCategoryName.length}/50
                </Typography>
              )
            }}
          />
          
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: theme.palette.text.primary }}>
            Category Color
          </Typography>
          
          {/* Compact Color Picker with Input */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 1
          }}>
            <Box
              sx={{
                position: 'relative',
                width: 48,
                height: 48,
                borderRadius: '8px',
                backgroundColor: selectedColor,
                border: `2px solid ${categoryValidationErrors.color ? theme.palette.error.main : theme.palette.divider}`,
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: `0 2px 8px ${alpha(selectedColor, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 4px 12px ${alpha(selectedColor, 0.4)}`
                }
              }}
            >
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => {
                  setSelectedColor(e.target.value)
                  if (categoryValidationErrors.color) {
                    setCategoryValidationErrors(prev => ({ ...prev, color: '' }))
                  }
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
                disabled={categoryLoading}
              />
            </Box>
            
            <TextField
              fullWidth
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value)
                if (categoryValidationErrors.color) {
                  setCategoryValidationErrors(prev => ({ ...prev, color: '' }))
                }
              }}
              placeholder="#2196F3"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'monospace',
                  fontSize: '0.9375rem'
                }
              }}
              error={!!categoryValidationErrors.color}
              helperText={categoryValidationErrors.color}
              disabled={categoryLoading}
              inputProps={{
                pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
                title: 'Hex color format (e.g., #2196F3 or #FFF)'
              }}
            />
          </Box>
          
          {categoryValidationErrors.color && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 1,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
              icon={<Icon icon="mdi:alert-circle" />}
            >
              {categoryValidationErrors.color}
            </Alert>
          )}
          
          {/* Color format hint */}
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
            Use hex format (e.g., #2196F3 for blue, #4CAF50 for green)
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseCreateCategoryDialog}
            disabled={categoryLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateCategory}
            disabled={categoryLoading}
            startIcon={categoryLoading ? <CircularProgress size={20} /> : <Icon icon="mdi:check" />}
          >
            {categoryLoading ? 'Creating...' : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>

{/* Edit Category Dialog */}
<Dialog 
  open={editCategoryDialog} 
  onClose={() => setEditCategoryDialog(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle sx={{ fontWeight: 600 }}>Edit Category</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      label="Category Name"
      value={editingCategory?.title || ''}
      onChange={(e) => setEditingCategory(editingCategory ? {...editingCategory, title: e.target.value} : null)}
      sx={{ mt: 2, mb: 1 }}
      placeholder="Enter category name"
      autoFocus
    />
    
    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: theme.palette.text.primary }}>
      Category Color
    </Typography>
    
    {/* Compact Color Picker with Input */}
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      mb: 1
    }}>
      <Box
        sx={{
          position: 'relative',
          width: 48,
          height: 48,
          borderRadius: '8px',
          backgroundColor: editingCategory?.color || '#2196F3',
          border: `2px solid ${theme.palette.divider}`,
          cursor: 'pointer',
          flexShrink: 0,
          boxShadow: `0 2px 8px ${alpha(editingCategory?.color || '#2196F3', 0.3)}`,
          '&:hover': {
            boxShadow: `0 4px 12px ${alpha(editingCategory?.color || '#2196F3', 0.4)}`
          }
        }}
      >
        <input
          type="color"
          value={editingCategory?.color || '#2196F3'}
          onChange={(e) => setEditingCategory(editingCategory ? {...editingCategory, color: e.target.value} : null)}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer'
          }}
        />
      </Box>
      
      <TextField
        fullWidth
        value={editingCategory?.color || '#2196F3'}
        onChange={(e) => setEditingCategory(editingCategory ? {...editingCategory, color: e.target.value} : null)}
        placeholder="#2196F3"
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'monospace',
            fontSize: '0.9375rem'
          }
        }}
        inputProps={{
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          title: 'Hex color format (e.g., #2196F3 or #FFF)'
        }}
      />
    </Box>
    
    {/* Color format hint */}
    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
      Use hex format (e.g., #2196F3 for blue, #4CAF50 for green)
    </Typography>
    
    {/* Display Category ID if available */}
    {editingCategory?.boardCategoryID && (
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2 }}>
        Category ID: {editingCategory.boardCategoryID}
      </Typography>
    )}
  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button onClick={() => setEditCategoryDialog(false)}>
      Cancel
    </Button>
    <Button 
      variant="contained" 
      onClick={handleSaveCategory}
      startIcon={<Icon icon="mdi:check" />}
    >
      Save Changes
    </Button>
  </DialogActions>
</Dialog>
      {/* Delete Category Dialog */}
      <Dialog 
        open={deleteCategoryDialog} 
        onClose={() => setDeleteCategoryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category "{categoryToDelete?.title}"?
            {categoryToDelete?.boardCategoryID && (
              <Typography variant="caption" display="block" color="textSecondary">
                Category ID: {categoryToDelete.boardCategoryID}
              </Typography>
            )}
          </Typography>
          {categoryToDelete && tasks[categoryToDelete.id]?.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This category contains {tasks[categoryToDelete.id].length} task(s). 
              You must move or delete all tasks before deleting this category.
            </Alert>
          )}
          {categoryToDelete && tasks[categoryToDelete.id]?.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This category is empty and can be safely deleted.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteCategoryDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmDeleteCategory}
            disabled={categoryToDelete && tasks[categoryToDelete.id]?.length > 0}
          >
            Delete Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog 
        open={editTaskDialog} 
        onClose={() => setEditTaskDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Task Title"
            value={editingTask?.title || ''}
            onChange={(e) => setEditingTask(editingTask ? {...editingTask, title: e.target.value} : null)}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={editingTask?.description || ''}
            onChange={(e) => setEditingTask(editingTask ? {...editingTask, description: e.target.value} : null)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={editingTask?.priority || 'medium'}
              label="Priority"
              onChange={(e) => setEditingTask(editingTask ? {...editingTask, priority: e.target.value as 'high' | 'medium' | 'low'} : null)}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Assignee</InputLabel>
            <Select
              value={editingTask?.assignee || ''}
              label="Assignee"
              onChange={(e) => setEditingTask(editingTask ? {...editingTask, assignee: e.target.value} : null)}
            >
              {teamMembers.map(member => (
                <MenuItem key={member} value={member}>{member}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditTaskDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTask}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Board */}
      {!loading && (
        <Box 
          sx={{ 
            overflowX: 'auto',
            height: { xs: 'auto', sm: 'calc(100vh - 180px)' },
            minHeight: { xs: 'calc(100vh - 220px)', sm: 'auto' },
            backgroundColor: theme.palette.background.default,
            '&::-webkit-scrollbar': {
              height: '8px'
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.action.hover,
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.action.disabled,
              borderRadius: '4px',
              '&:hover': {
                background: theme.palette.action.active
              }
            }
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              gap: { xs: 2, sm: 3 },
              p: { xs: 2, sm: 3, md: 4 },
              height: '100%',
              minWidth: 'fit-content',
              flexDirection: { xs: 'column', lg: 'row' },
              [theme.breakpoints.down('lg')]: {
                flexDirection: 'row',
                flexWrap: 'wrap'
              },
              [theme.breakpoints.down('sm')]: {
                flexDirection: 'column'
              }
            }}
          >
            {columnsWithCount.length === 0 && !loading ? (
              <Box sx={{ textAlign: 'center', width: '100%', py: 8 }}>
                <Typography variant="h6" color="textSecondary">
                  No categories found. Create your first category!
                </Typography>
              </Box>
            ) : (
              columnsWithCount.map((column) => (
                <Box
                  key={column.id}
                  sx={{
                    minWidth: { xs: '100%', sm: '280px', md: '300px', lg: '320px' },
                    maxWidth: { xs: '100%', sm: '280px', md: '300px', lg: '320px' },
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    [theme.breakpoints.down('lg')]: {
                      minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(50% - 16px)' },
                      maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(50% - 16px)' }
                    },
                    [theme.breakpoints.down('sm')]: {
                      minWidth: '100%',
                      maxWidth: '100%'
                    }
                  }}
                >
                  {/* Compact Column Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                      p: 2,
                      borderRadius: '10px',
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.1 : 0.05)}`
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5, 
                      flex: 1, 
                      minWidth: 0,
                      mr: 1
                    }}>
                      {/* Compact Icon */}
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '8px',
                          backgroundColor: column.iconColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Icon 
                          icon={column.icon} 
                          style={{ 
                            fontSize: '18px', 
                            color: 'white' 
                          }} 
                        />
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography 
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontSize: '0.9375rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {column.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="caption"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontWeight: 500,
                              fontSize: '0.75rem'
                            }}
                          >
                            {column.count} tasks
                          </Typography>
                          {column.boardCategoryID && (
                            <Typography 
                              variant="caption"
                              sx={{
                                color: theme.palette.text.disabled,
                                fontSize: '0.65rem'
                              }}
                            >
                             
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      flexShrink: 0
                    }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditCategory(column)}
                        sx={{
                          color: theme.palette.text.secondary,
                          '&:hover': {
                            backgroundColor: alpha(column.iconColor, 0.1),
                            color: column.iconColor
                          },
                          width: 32,
                          height: 32
                        }}
                      >
                        <Icon icon="mdi:pencil" width={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCategory(column)}
                        sx={{
                          color: theme.palette.text.secondary,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                            color: theme.palette.error.main
                          },
                          width: 32,
                          height: 32
                        }}
                      >
                        <Icon icon="mdi:delete" width={16} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Task Column */}
                  <TaskColumn
                    title={column.title}
                    tasks={tasks[column.id] || []}
                    columnId={column.id}
                    onDrop={handleDrop}
                    color={column.color}
                    isMobile={isMobile}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </Box>
              ))
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default YourFeaturePage
