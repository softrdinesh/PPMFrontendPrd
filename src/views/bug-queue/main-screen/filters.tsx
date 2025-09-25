import React, { useMemo, useState } from 'react'

import { Icon } from '@iconify/react'

import { Box, Checkbox, Divider, FormControlLabel, Grow, Menu, Typography } from '@mui/material'

import CustomButton from '@components/button'

import { useProject } from 'src/context/project-context'
import { useBugQueue } from 'src/context/bug-queue-context'
const FilterMenuItem = ({ menuID, name }: { menuID: string; name: string }) => {
  // const { columnVisibility, setColumnVisibility } = useProject()
  const { columnVisibility, setColumnVisibility, toggleColumnVisibility } = useBugQueue()

 
   const handleChange = () => {
    // Use either setColumnVisibility or toggleColumnVisibility
    // Option 1: Using toggleColumnVisibility (more direct)
    toggleColumnVisibility(menuID as keyof typeof columnVisibility)
    
    // Option 2: Using setColumnVisibility (if you prefer this approach)
    // setColumnVisibility({ ...columnVisibility, [menuID]: !columnVisibility[menuID] })
  }
  // const handleChange = () => {
  //   setColumnVisibility({ ...columnVisibility, [menuID]: !columnVisibility[menuID] })
  // }

  return (
    <Box px={4} py={2} sx={{ minWidth: 200 }}>
      <FormControlLabel
        label={name}
        control={<Checkbox checked={columnVisibility[menuID]} onChange={handleChange} />}
      />
    </Box>
  )
}

const ProjectFilterButton = () => {
  // Hooks
  const { columnVisibility, setColumnVisibility, visibleColumns } = useBugQueue()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = (e: any) => setAnchorEl(e?.currentTarget)

  const handleClose = () => setAnchorEl(null)
  const seeAllColumns = () => {
    const allVisible: typeof columnVisibility = {
      BugID:true,
  Reporter: true,
  BugDescription: true,
  TimeResolution: true,
  Priority: true
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
            ITEMS COLUMNS
          </Typography>
        </Box>
        <FilterMenuItem menuID='BugID' name={'Bug ID'} />
        <FilterMenuItem menuID='Reporter' name='Reporter' />
        <FilterMenuItem menuID='BugDescription' name='Bug Details' />
        <FilterMenuItem menuID='TimeResolution' name='Time Resolution' />
        <FilterMenuItem menuID='Priority' name='Priority' />
   
      </Menu>
    </>
  )
}

export default ProjectFilterButton
