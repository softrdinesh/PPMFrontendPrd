import React, { useMemo, useState } from 'react'

import { Icon } from '@iconify/react'

import { Box, Checkbox, Divider, FormControlLabel, Grow, Menu, Typography } from '@mui/material'

import CustomButton from '@components/button'

import { useSprintTaskManagement } from 'src/context/sprint-tast-context' // Update the import path as needed

const FilterMenuItem = ({ menuID, name }: { menuID: string; name: string }) => {
  const { columnVisibility, setColumnVisibility, toggleColumnVisibility } = useSprintTaskManagement()

  const handleChange = () => {
    // Use either setColumnVisibility or toggleColumnVisibility
    // Option 1: Using toggleColumnVisibility (more direct)
    toggleColumnVisibility(menuID as keyof typeof columnVisibility)
    
    // Option 2: Using setColumnVisibility (if you prefer this approach)
    // setColumnVisibility({ ...columnVisibility, [menuID]: !columnVisibility[menuID] })
  }

  return (
    <Box px={4} py={2} sx={{ minWidth: 200 }}>
      <FormControlLabel
        label={name}
        control={<Checkbox checked={columnVisibility[menuID]} onChange={handleChange} />}
      />
    </Box>
  )
}

const SprintFilterButton = () => {
  // Hooks - use sprint context instead of project context
  const { columnVisibility, setColumnVisibility, visibleColumns } = useSprintTaskManagement()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = (e: any) => setAnchorEl(e?.currentTarget)
  const handleClose = () => setAnchorEl(null)

  // Custom seeAllColumns function for sprint context
  const seeAllColumns = () => {
    const allVisible: typeof columnVisibility = {
      Taskname: true,
      ActualSP: true,
      IsUnplanned: true,
      EstimatedSP: true
    }
    setColumnVisibility(allVisible)
  }

  const allSelected = useMemo(() => {
    return Object.keys(columnVisibility)?.every(key => columnVisibility[key])
  }, [columnVisibility])

  const selectedCount = useMemo(() => {
    return visibleColumns?.length
  }, [visibleColumns])

  return (
    <>
      <CustomButton
        variant='outlined'
        startIcon={<Icon icon={'hugeicons:filter'} style={{ marginInline: 2 }} />}
        endIcon={<Icon icon={'akar-icons:chevron-down'} style={{ marginInline: 5 }} />}
        sx={{ px: 3.5 }}
        onClick={handleOpen}
      >
        Filter
      </CustomButton>
      <Menu
        sx={{ maxHeight: 400 }}
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        onClose={handleClose}
        TransitionComponent={Grow}
      >
        <Box px={4} py={2} sx={{ minWidth: 200 }}>
          <FormControlLabel
            label={`All - ${selectedCount} selected`}
            control={<Checkbox checked={allSelected} onClick={seeAllColumns} />}
          />
        </Box>
        <Divider />
        <Box px={2} py={2}>
          <Typography fontWeight={600} fontSize={15}>
            SPRINT COLUMNS
          </Typography>
        </Box>
        <FilterMenuItem menuID='Taskname' name={'Task'} />
        <FilterMenuItem menuID='ActualSP' name='Actual SP' />
        <FilterMenuItem menuID='IsUnplanned' name='Unplanned' />
        <FilterMenuItem menuID='EstimatedSP' name='Estimated SP' />
      </Menu>
    </>
  )
}

export default SprintFilterButton
