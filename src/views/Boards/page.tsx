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
  Snackbar,
  Grid
} from '@mui/material'
import { Icon } from '@iconify/react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import TaskColumn from './TaskColumn'
import {NewTaskDialog} from '../../views/project/main-screen/Taskboard'
import axios from 'axios'

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
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

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

  const [columns, setColumns] = useState<Column[]>([
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
      id: 'inProgress', 
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
  ])

  // Update columns count
  const columnsWithCount = columns.map(col => ({
    ...col,
    count: tasks[col.id]?.length || 0
  }))

  const totalTasks = Object.values(tasks).reduce((sum, columnTasks) => sum + columnTasks.length, 0)

  const handleDrop = (taskId: string, columnId: string) => {
    let taskToMove: Task | null = null
    let sourceColumn: string = 'todo'
    
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
    setCreateCategoryDialog(true)
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a category name',
        severity: 'error'
      })
      return
    }

    // Generate ID from category name
    const newId = newCategoryName.toLowerCase().replace(/\s+/g, '')
    
    // Check if category already exists locally
    if (columns.find(col => col.id === newId)) {
      setSnackbar({
        open: true,
        message: 'Category with this name already exists',
        severity: 'error'
      })
      return
    }

    try {
      // Prepare API request parameters
      const loginUserId = '76' // Static LoginuserID as shown in your API example
      const colorCode = encodeURIComponent(selectedColor) // URL encode the color code
      
      // Make API call to create board category
      const apiUrl = `https://uat.ppmbackend.projectpulse360.com/CreateBoardCategory?Categoryname=${(newCategoryName)}&ColorCode=${colorCode}&LoginuserID=${loginUserId}`
      
      const response = await axios.post(apiUrl)
      
      // Check if API call was successful
      if (response.data) {
        // You may want to check specific response structure based on your API
        // For now, assuming success if we get a response
        
        const newColumn: Column = {
          id: newId,
          title: newCategoryName,
          color: selectedColor,
          icon: getCategoryIcon(newCategoryName),
          iconColor: selectedColor,
          lightBg: alpha(selectedColor, 0.08),
          count: 0
        }

        // Add new column locally
        setColumns([...columns, newColumn])
        
        // Initialize empty task array for new category
        setTasks({
          ...tasks,
          [newId]: []
        })

        setCreateCategoryDialog(false)
        setNewCategoryName('')
        setSelectedColor('#2196F3')
        
        setSnackbar({
          open: true,
          message: 'Category created successfully',
          severity: 'success'
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
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'Network error: No response from server'
      } else {
        // Something else happened
        errorMessage = error.message || 'Unknown error occurred'
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      })
    }
  }

  // Edit Category handlers
  const handleEditCategory = (column: Column) => {
    setEditingCategory(column)
    setEditCategoryDialog(true)
  }

  const handleSaveCategory = () => {
    if (editingCategory) {
      const updatedColumns = columns.map(col => 
        col.id === editingCategory.id ? editingCategory : col
      )
      setColumns(updatedColumns)
      setEditCategoryDialog(false)
      setEditingCategory(null)
      setSnackbar({
        open: true,
        message: 'Category updated successfully',
        severity: 'success'
      })
    }
  }

  // Delete Category handlers
  const handleDeleteCategory = (column: Column) => {
    setCategoryToDelete(column)
    setDeleteCategoryDialog(true)
  }

  const handleConfirmDeleteCategory = () => {
    if (categoryToDelete) {
      // Check if there are tasks in the category
      const tasksInCategory = tasks[categoryToDelete.id] || []
      
      if (tasksInCategory.length > 0) {
        setSnackbar({
          open: true,
          message: `Cannot delete category with ${tasksInCategory.length} task(s). Move or delete tasks first.`,
          severity: 'error'
        })
        setDeleteCategoryDialog(false)
        setCategoryToDelete(null)
        return
      }

      // Remove the column from columns array
      const updatedColumns = columns.filter(col => col.id !== categoryToDelete.id)
      setColumns(updatedColumns)
      
      // Remove the category from tasks
      const updatedTasks = { ...tasks }
      delete updatedTasks[categoryToDelete.id]
      setTasks(updatedTasks)
      
      setDeleteCategoryDialog(false)
      setCategoryToDelete(null)
      
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success'
      })
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
      setSnackbar({
        open: true,
        message: 'Task updated successfully',
        severity: 'success'
      })
    }
  }

  const handleDeleteTask = (taskId: string, columnId: string) => {
    const updatedTasks = { ...tasks }
    updatedTasks[columnId] = updatedTasks[columnId].filter(t => t.id !== taskId)
    setTasks(updatedTasks)
    setSnackbar({
      open: true,
      message: 'Task deleted successfully',
      severity: 'success'
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box 
      sx={{ 
        width: '100%',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}
    >
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
                width: { xs: '50%', sm: 'auto' },
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
                width: { xs: '50%', sm: 'auto' },
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
                marginLeft: 300,
                px: 1.5,
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
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

      {/* Create Category Dialog */}
      <Dialog 
        open={createCategoryDialog} 
        onClose={() => setCreateCategoryDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Create New Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            sx={{ mt: 2, mb: 3 }}
            placeholder="Enter category name (e.g., Backlog, Testing)"
            autoFocus
          />
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
            Select Color
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
            {/* Color Picker */}
            <Box sx={{ flex: 1 }}>
              <HexColorPicker
                color={selectedColor}
                onChange={setSelectedColor}
                style={{ 
                  width: '50%', 
                  height: '100px',
                  borderRadius: '8px'
                }}
              />
            </Box>
            
            {/* Color Preview and Input */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Color Preview */}
              {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '10px',
                    backgroundColor: selectedColor,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`
                  }}
                />
                {/* <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                    Selected Color
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    {selectedColor.toUpperCase()}
                  </Typography>
                </Box> */}
              {/* </Box> */} 
              
              {/* Color Input */}
              <Box>
                {/* <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.secondary }}>
                  Hex Color Code
                </Typography> */}
                <HexColorInput
                  color={selectedColor}
                  onChange={setSelectedColor}
                  prefixed
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `2px solid ${theme.palette.divider}`,
                    fontSize: '16px',
                    fontFamily: theme.typography.fontFamily,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.palette.primary.main;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.palette.divider;
                  }}
                />
              </Box>
              
              {/* Quick Color Presets */}
          
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateCategoryDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateCategory}>Create Category</Button>
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
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditCategoryDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCategory}>Save</Button>
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
          </Typography>
          {categoryToDelete && tasks[categoryToDelete.id]?.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This category contains {tasks[categoryToDelete.id].length} task(s). 
              You must move or delete all tasks before deleting this category.
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
            Delete
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
          {columnsWithCount.map((column) => (
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
              {/* Column Header */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  mb: 2,
                  borderRadius: '12px',
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.15 : 0.05)}`
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  width: '100%'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    flex: 1, 
                    minWidth: 0,
                    mr: 2
                  }}>
                    <Box
                      sx={{
                        width: { xs: 40, sm: 44 },
                        height: { xs: 40, sm: 44 },
                        borderRadius: '10px',
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
                          fontSize: '22px', 
                          color: 'white' 
                        }} 
                      />
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography 
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontSize: { xs: '1rem', sm: '1.0625rem' },
                          letterSpacing: '-0.01em',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {column.title}
                      </Typography>
                      <Typography 
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: 500,
                          display: 'block'
                        }}
                      >
                        {column.count} {column.count === 1 ? 'task' : 'tasks'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
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
                        }
                      }}
                    >
                      <Icon icon="mdi:pencil" width={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCategory(column)}
                      sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                          color: theme.palette.error.main
                        }
                      }}
                    >
                      <Icon icon="mdi:delete" width={18} />
                    </IconButton>
                    <Chip
                      label={column.count}
                      size="small"
                      sx={{
                        backgroundColor: column.lightBg,
                        color: column.iconColor,
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        height: '28px',
                        minWidth: '36px',
                        border: `1px solid ${alpha(column.iconColor, 0.3)}`,
                        '& .MuiChip-label': {
                          px: 1.5
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Paper>

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
          ))}
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default YourFeaturePage
