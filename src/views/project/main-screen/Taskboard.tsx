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
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// ** Icons Imports
import { Icon } from '@iconify/react';

export interface NewTaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
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
      // Reset form
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
    onOpenChange(false);
  };

  return (
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
              </Typography>
              <Select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as 'low' | 'medium' | 'high',
                  })
                }
                fullWidth
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
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
  );
}
