// ** React Imports
import { useEffect, useState } from 'react';

// ** MUI Components
import {
  CircularProgress,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  Typography,
  Zoom,
  TextField,
  Select,
  MenuItem,
  Chip,
  Popover,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// ** Icons Imports
import { Icon } from '@iconify/react';

// ** React Colorful Import
import { HexColorPicker } from 'react-colorful';

// ** Axios Import
import axios from 'axios';

// ** React Hot Toast Import
import { toast } from 'react-hot-toast';

export interface NewTaskData {
  title: string;
  description: string;
  priority: string;
  assignee: string;
  dueDate: string;
  tags: string[];
}

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: NewTaskData) => void;
  teamMembers: string[];
}

// Define Priority type
interface Priority {
  id: string;
  name: string;
  colorCode: string;
}

export function NewTaskDialog({
  open,
  onOpenChange,
  onSubmit,
  teamMembers,
}: NewTaskDialogProps) {
  const [formData, setFormData] = useState<NewTaskData>({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    assignee?: string;
  }>({});
  
  // Priority states
  const [priorityAnchorEl, setPriorityAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tempPriorityName, setTempPriorityName] = useState<string>('');
  const [tempColor, setTempColor] = useState<string>('#FF9800');
  const [isCreatingPriority, setIsCreatingPriority] = useState<boolean>(false);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  
  // Edit/Delete states
  const [contextMenuAnchorEl, setContextMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);
  const [isEditingPriority, setIsEditingPriority] = useState<boolean>(false);
  const [editingPriority, setEditingPriority] = useState<Priority | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isDeletingPriority, setIsDeletingPriority] = useState<boolean>(false);
  
  // Login user ID
  const [loginUserId, setLoginUserId] = useState<string>('76');

  // Fetch priorities when dialog opens
  useEffect(() => {
    fetchPriorities();
  }, []);

  // Fetch priorities from API
  const fetchPriorities = async () => {
    try {
      const apiUrl = `https://uat.ppmbackend.projectpulse360.com/GetBoardPriorityList?LoginuserID=${loginUserId}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        let prioritiesData = response.data;
        
        if (prioritiesData && typeof prioritiesData === 'object' && !Array.isArray(prioritiesData)) {
          if (prioritiesData.data && Array.isArray(prioritiesData.data)) {
            prioritiesData = prioritiesData.data;
          }
          else if (prioritiesData.response && Array.isArray(prioritiesData.response)) {
            prioritiesData = prioritiesData.response;
          }
          else if (prioritiesData.result && Array.isArray(prioritiesData.result)) {
            prioritiesData = prioritiesData.result;
          }
          else if (prioritiesData.priorities && Array.isArray(prioritiesData.priorities)) {
            prioritiesData = prioritiesData.priorities;
          }
        }

        if (Array.isArray(prioritiesData) && prioritiesData.length > 0) {
          const apiPriorities = prioritiesData.map((item: any) => {
            let priorityId = '';
            if (item.priorityID !== undefined && item.priorityID !== null) {
              priorityId = item.priorityID.toString();
            } else if (item.PriorityID !== undefined && item.PriorityID !== null) {
              priorityId = item.PriorityID.toString();
            } else if (item.id !== undefined && item.id !== null) {
              priorityId = item.id.toString();
            } else if (item.ID !== undefined && item.ID !== null) {
              priorityId = item.ID.toString();
            } else {
              const name = item.priorityname || item.priorityName || item.name || item.PriorityName || 'Unknown';
              priorityId = name.toLowerCase().replace(/\s+/g, '_');
            }

            const priorityName = item.priorityname || 
                               item.priorityName || 
                               item.name || 
                               item.PriorityName || 
                               'Unknown Priority';

            const colorCode = item.colorcode || 
                             item.colorCode || 
                             item.ColorCode || 
                             '#FF9800';

            return {
              id: priorityId,
              name: priorityName,
              colorCode: colorCode
            };
          });

          setPriorities(apiPriorities);

          const mediumPriority = apiPriorities.find((p: Priority) => 
            p.name.toLowerCase() === 'medium'
          );
          
          if (mediumPriority) {
            setFormData(prev => ({
              ...prev,
              priority: mediumPriority.id
            }));
          } else if (apiPriorities.length > 0) {
            setFormData(prev => ({
              ...prev,
              priority: apiPriorities[0].id
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching priorities:', error);
    }
  };

  // Handle priority icon click
  const handlePriorityIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTempPriorityName('');
    setTempColor('#FF9800');
    setIsEditingPriority(false);
    setEditingPriority(null);
    setPriorityAnchorEl(event.currentTarget);
  };

  // Handle priority popup close
  const handlePriorityPopupClose = () => {
    setPriorityAnchorEl(null);
    setIsEditingPriority(false);
    setEditingPriority(null);
    setTempPriorityName('');
    setTempColor('#FF9800');
  };

  // Handle priority save
  const handlePrioritySave = async () => {
    if (!tempPriorityName.trim()) {
      toast.error('Please enter a priority name');
      return;
    }

    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!colorRegex.test(tempColor)) {
      toast.error('Please enter a valid hex color code (e.g., #FFFFFF)');
      return;
    }

    if (isEditingPriority && editingPriority) {
      await updatePriority();
    } else {
      await createPriority();
    }
  };

  // Create new priority
  const createPriority = async () => {
    setIsCreatingPriority(true);
    
    try {
      const apiUrl = `https://uat.ppmbackend.projectpulse360.com/CreateBoardPriority`;
      
      const params = {
        Priorityname: tempPriorityName.trim(),
        ColorCode: tempColor,
        LoginuserID: loginUserId
      };

      const response = await axios.post(apiUrl, null, { params });

      if (response.status === 200) {
        toast.success('Priority created successfully!');
        fetchPriorities();
        handlePriorityPopupClose();
      }
    } catch (error) {
      console.error('Error creating priority:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`Error: ${error.response.status} - ${error.response.data?.message || 'Failed to create priority'}`);
        }
      }
    } finally {
      setIsCreatingPriority(false);
    }
  };

  // Update existing priority
  const updatePriority = async () => {
    if (!editingPriority) return;
    
    setIsCreatingPriority(true);
    
    try {
      const apiUrl = `https://uat.ppmbackend.projectpulse360.com/UpdateBoardPriority`;
      
      const params = {
        Name: tempPriorityName.trim(),
        ColorCode: tempColor,
        PriorityID: editingPriority.id,
        LoginuserID: loginUserId
      };

      const response = await axios.post(apiUrl, null, { params });

      if (response.status === 200) {
        toast.success('Priority updated successfully!');
        fetchPriorities();
        handlePriorityPopupClose();
      }
    } catch (error) {
      console.error('Error updating priority:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`Error: ${error.response.status} - ${error.response.data?.message || 'Failed to update priority'}`);
        }
      }
    } finally {
      setIsCreatingPriority(false);
    }
  };

  // Delete priority
  const deletePriority = async () => {
    if (!selectedPriority) return;
    
    setIsDeletingPriority(true);
    
    try {
      const apiUrl = `https://uat.ppmbackend.projectpulse360.com/RemoveBoardPriority`;
      
      const params = {
        LoginuserID: loginUserId,
        PriorityID: selectedPriority.id
      };

      const response = await axios.post(apiUrl, null, { params });

      if (response.status === 200) {
        toast.success('Priority deleted successfully!');
        fetchPriorities();
        
        if (formData.priority === selectedPriority.id && priorities.length > 0) {
          const firstPriority = priorities.find(p => p.id !== selectedPriority.id);
          if (firstPriority) {
            setFormData(prev => ({
              ...prev,
              priority: firstPriority.id
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error deleting priority:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`Error: ${error.response.status} - ${error.response.data?.message || 'Failed to delete priority'}`);
        }
      }
    } finally {
      setIsDeletingPriority(false);
      setDeleteDialogOpen(false);
      setSelectedPriority(null);
      setContextMenuAnchorEl(null);
    }
  };

  // Handle context menu open
  const handleContextMenuOpen = (event: React.MouseEvent<HTMLElement>, priority: Priority) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuAnchorEl(event.currentTarget);
    setSelectedPriority(priority);
  };

  // Handle context menu close
  const handleContextMenuClose = () => {
    setContextMenuAnchorEl(null);
    setSelectedPriority(null);
  };

  // Handle edit priority
  const handleEditPriority = () => {
    if (!selectedPriority) return;
    
    setEditingPriority(selectedPriority);
    setTempPriorityName(selectedPriority.name);
    setTempColor(selectedPriority.colorCode);
    setIsEditingPriority(true);
    
    setPriorityAnchorEl(document.querySelector('#priority-button') as HTMLButtonElement);
    handleContextMenuClose();
  };

  // Handle delete priority click
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setContextMenuAnchorEl(null);
  };

  // Close delete dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedPriority(null);
  };

  // Get priority color for display
  const getPriorityColor = (priorityId: string) => {
    const priority = priorities.find(p => p.id === priorityId);
    return priority ? priority.colorCode : '#FF9800';
  };

  // Get priority name for display
  const getPriorityName = (priorityId: string) => {
    const priority = priorities.find(p => p.id === priorityId);
    return priority ? priority.name : 'Medium';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { title?: string; assignee?: string } = {};
    if (!formData.title) {
      newErrors.title = 'Please enter a task title';
    }
    if (!formData.assignee) {
      newErrors.assignee = 'Please select an assignee';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignee: '',
        dueDate: '',
        tags: [],
      });
      setTagInput('');
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const onCloseModal = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      tags: [],
    });
    setTagInput('');
    setErrors({});
    setPriorityAnchorEl(null);
    onOpenChange(false);
  };

  const priorityOpen = Boolean(priorityAnchorEl);
  const priorityPopupId = priorityOpen ? 'priority-popup' : undefined;
  const contextMenuOpen = Boolean(contextMenuAnchorEl);

  return (
    <>
      {/* MAIN DIALOG */}
      <Dialog
        open={open}
        style={{
          padding: 0,
        }}
        onClose={onCloseModal}
        TransitionComponent={Zoom}
        fullWidth
        maxWidth="lg"
      >
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingX: 5,
            paddingY: 2,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '18px' }}>
            Create New Task
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onCloseModal}
            style={{
              height: 35,
              width: 35,
              border: '1px solid ',
              borderRadius: 4,
            }}
          >
            <Icon icon="mdi:close" fontSize={24} />
          </IconButton>
        </Box>
        <Divider />

        <Box py={2}>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            {/* Task Title */}
            <FormControl
              fullWidth
              sx={{
                paddingX: 5,
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '12px', marginBottom: 3 }}>
                Task Title <span style={{ color: 'red' }}>*</span>
              </Typography>

              <TextField
                autoFocus
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) {
                    setErrors({ ...errors, title: undefined });
                  }
                }}
                error={Boolean(errors?.title)}
                helperText={Boolean(errors?.title) && errors?.title}
                fullWidth
                id="TaskTitle"
                placeholder="Enter task title"
                sx={{ marginBottom: 4 }}
              />
            </FormControl>

            {/* Description */}
            <FormControl
              fullWidth
              sx={{
                paddingX: 5,
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '12px', marginBottom: 3 }}>
                Description
              </Typography>

              <TextField
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                multiline
                rows={3}
                fullWidth
                id="TaskDescription"
                placeholder="Describe the task..."
                sx={{ marginBottom: 4 }}
              />
            </FormControl>

            {/* Priority and Assignee Row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                paddingX: 5,
                marginBottom: 4,
              }}
            >
              {/* Priority */}
              <FormControl fullWidth>
                <Typography sx={{ fontWeight: 700, fontSize: '12px', marginBottom: 1 }}>
                  Priority
                  <IconButton
                    id="priority-button"
                    size="small"
                    onClick={handlePriorityIconClick}
                    sx={{
                      padding: 0,
                      marginLeft: 1,
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <Icon icon="mdi:plus-circle" fontSize={16} />
                  </IconButton>
                </Typography>
                <Select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value,
                    })
                  }
                  fullWidth
                  renderValue={(selected) => {
                    const priority = priorities.find(p => p.id === selected);
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: priority?.colorCode || '#FF9800',
                          }}
                        />
                        <span>{priority?.name || getPriorityName(selected)}</span>
                      </Box>
                    );
                  }}
                >
                  {priorities.map((priority) => (
                    <MenuItem 
                      key={priority.id} 
                      value={priority.id}
                      onContextMenu={(e) => handleContextMenuOpen(e, priority)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: priority.colorCode,
                          }}
                        />
                        <span>{priority.name}</span>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleContextMenuOpen(e, priority)}
                        sx={{
                          padding: '4px',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                          },
                        }}
                      >
                        <Icon icon="mdi:dots-vertical" fontSize={16} />
                      </IconButton>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Assignee */}
              <FormControl fullWidth>
                <Typography sx={{ fontWeight: 700, fontSize: '12px', marginBottom: 1 }}>
                  Assign To <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Select
                  value={formData.assignee}
                  onChange={(e) => {
                    setFormData({ ...formData, assignee: e.target.value });
                    if (errors.assignee) {
                      setErrors({ ...errors, assignee: undefined });
                    }
                  }}
                  fullWidth
                  displayEmpty
                  error={Boolean(errors?.assignee)}
                >
                  <MenuItem value="" disabled>
                    Select member
                  </MenuItem>
                  {teamMembers.map((member) => (
                    <MenuItem key={member} value={member}>
                      {member}
                    </MenuItem>
                  ))}
                </Select>
                {Boolean(errors?.assignee) && (
                  <Typography
                    sx={{
                      color: 'error.main',
                      fontSize: '0.75rem',
                      marginTop: '3px',
                      marginLeft: '14px',
                    }}
                  >
                    {errors?.assignee}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Due Date */}
            <FormControl
              fullWidth
              sx={{
                paddingX: 5,
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '12px', marginBottom: 1 }}>
                Due Date
              </Typography>

              <TextField
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                fullWidth
                id="TaskDueDate"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ marginBottom: 4 }}
              />
            </FormControl>

            {/* Tags */}
            <FormControl
              fullWidth
              sx={{
                paddingX: 5,
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '12px', marginBottom: 1 }}>
                Tags
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, marginBottom: 2 }}>
                <TextField
                  placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  fullWidth
                />
                <Button
                  variant="outlined"
                  onClick={addTag}
                  sx={{
                    minWidth: 80,
                    borderRadius: 30,
                    textTransform: 'capitalize',
                    fontWeight: 400,
                    fontSize: '14px',
                  }}
                >
                  Add
                </Button>
              </Box>
              {formData.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      deleteIcon={<Icon icon="mdi:close" />}
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </FormControl>

            <Divider sx={{ marginTop: 4 }} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 2,
                px: 5,
              }}
            >
              <Button
                sx={{
                  borderRadius: 30,
                  fontWeight: 400,
                  fontSize: '14px',
                  textTransform: 'capitalize',
                }}
                variant="outlined"
                size="small"
                onClick={onCloseModal}
              >
                Cancel
              </Button>

              <Button
                sx={{
                  borderRadius: 30,
                  fontWeight: 400,
                  fontSize: '14px',
                  textTransform: 'capitalize',
                }}
                variant="contained"
                size="large"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={15} color="inherit" />
                ) : (
                  'Create Task'
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Dialog>

      {/* PRIORITY POPUP */}
      <Popover
        id={priorityPopupId}
        open={priorityOpen}
        anchorEl={priorityAnchorEl}
        onClose={handlePriorityPopupClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            padding: 3,
            minWidth: 280,
          },
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: '14px', marginBottom: 2 }}>
          {isEditingPriority ? 'Edit Priority' : 'Create New Priority'}
        </Typography>
        
        <Box sx={{ marginBottom: 3 }}>
          <Typography sx={{ fontSize: '12px', marginBottom: 1, color: 'text.secondary' }}>
            Priority Name
          </Typography>
          <TextField
            value={tempPriorityName}
            onChange={(e) => setTempPriorityName(e.target.value)}
            fullWidth
            size="small"
            placeholder="Enter priority name"
            disabled={isCreatingPriority}
          />
        </Box>
        
        <Box sx={{ marginBottom: 3 }}>
          <Typography sx={{ fontSize: '12px', marginBottom: 1, color: 'text.secondary' }}>
            Color
          </Typography>
          
          <Box sx={{ marginBottom: 2 }}>
            <HexColorPicker
              color={tempColor}
              onChange={setTempColor}
              style={{ width: '100%' }}
              disabled={isCreatingPriority}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '4px',
                backgroundColor: tempColor,
                border: '1px solid #ccc',
              }}
            />
            <TextField
              value={tempColor}
              onChange={(e) => setTempColor(e.target.value)}
              size="small"
              placeholder="#RRGGBB"
              sx={{ flexGrow: 1 }}
              disabled={isCreatingPriority}
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={handlePriorityPopupClose}
            disabled={isCreatingPriority}
            sx={{ textTransform: 'capitalize' }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handlePrioritySave}
            disabled={!tempPriorityName.trim() || isCreatingPriority}
            sx={{ textTransform: 'capitalize' }}
          >
            {isCreatingPriority ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEditingPriority ? (
              'Update'
            ) : (
              'Save'
            )}
          </Button>
        </Box>
      </Popover>

      {/* CONTEXT MENU */}
      <Popover
        open={contextMenuOpen}
        anchorEl={contextMenuAnchorEl}
        onClose={handleContextMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ padding: 1 }}>
          <MenuItem onClick={handleEditPriority}>
            <Icon icon="mdi:pencil" fontSize={16} style={{ marginRight: 8 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <Icon icon="mdi:delete" fontSize={16} style={{ marginRight: 8 }} />
            Delete
          </MenuItem>
        </Box>
      </Popover>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Priority
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the priority "{selectedPriority?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} disabled={isDeletingPriority}>
            Cancel
          </Button>
          <Button 
            onClick={deletePriority} 
            variant="contained" 
            color="error"
            disabled={isDeletingPriority}
            startIcon={isDeletingPriority ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isDeletingPriority ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
