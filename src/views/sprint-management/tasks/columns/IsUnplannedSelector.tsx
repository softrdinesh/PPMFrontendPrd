import { useState, useEffect } from 'react';
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';

interface IsUnplannedSelectorProps {
  value: boolean;
  canEdit: boolean;
  onUpdate: (value: boolean) => Promise<void>;
}

export const IsUnplannedSelector = ({ value, canEdit, onUpdate }: IsUnplannedSelectorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedValue, setSelectedValue] = useState<boolean>(value);
const roleData = localStorage.getItem('Role');
const parsedData = JSON.parse((roleData)as any);
// const rolename = parsedData.rolename;
const rolename = parsedData?.rolename;
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleChange = async (newValue: boolean) => {
    setSelectedValue(newValue);
    if (onUpdate) {
      await onUpdate(newValue);
    }
    setIsEditing(false);
  };

  const handleClick = () => {
    if (canEdit) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <FormControl size="small" sx={{ minWidth: 100 }}>
        {rolename !== 'Viewer' ?(
 <Select
          value={selectedValue ? 'true' : 'false'}
          onChange={(e) => handleChange(e.target.value === 'true')}
          onBlur={handleBlur}
          autoFocus
          size="small"
          sx={{
            backgroundColor: 'white',
            '& .MuiSelect-select': {
              py: 0.5,
              px: 1
            }
          }}
        >
          <MenuItem value={'true'}>Yes</MenuItem>
          <MenuItem value={'false'}>No</MenuItem>
        </Select>
        ): (
<Typography variant='body2' style={{cursor:'not-allowed'}}>
  {selectedValue ? "Yes" : "No"}
</Typography>        )}
       
      </FormControl>
    );
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: canEdit ? 'pointer' : 'default',
        minHeight: 32,
        display: 'flex',
        alignItems: 'center',
        '&:hover': canEdit ? {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderRadius: 1
        } : {}
      }}
    >
      <Typography variant="body2">
        {selectedValue ? 'Yes' : 'No'}
      </Typography>
    </Box>
  );
};
