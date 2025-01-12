import { deleteColumn, updateColumn } from '@api/task-group'
import DeleteDialog from '@custom-components/delete-dialog'
import { Icon } from '@iconify/react'
import { Box, ClickAwayListener, Grow, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material'
import React, { memo, useEffect, useMemo, useState } from 'react'

const DynamicTableHeader = ({ column, refetch }) => {
  // ** Memo
  const initialValue = useMemo(() => column?.ColumnName, [column?.ColumnName])

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const [editOpen, setEditOpen] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleMenuOpen = e => {
    setAnchorEl(e?.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const onEditClick = () => {
    setAnchorEl(null)
    setEditOpen(true)
  }

  const updateColumnFn = async () => {
    try {
      const updateColumnBody = { columnName: value, projectID: column?.ProjectID }

      await updateColumn({ id: column?.AdditionalColumnID, body: updateColumnBody })
      setEditOpen(false)

      refetch()
    } catch (error) {
      console.log('error :', error)
    }
  }

  const onBlur = async () => {
    await updateColumnFn()
    setEditOpen(false)
    handleMenuClose()
  }

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      onBlur()
    }
  }

  const handleDelete = async () => {
    try {
      await deleteColumn(column?.AdditionalColumnID)
      refetch()
    } catch (error) {
      console.log('error :', error)
    }
  }

  const onDeleteClick = () => {
    setDeleteOpen(true)
    handleMenuClose()
  }

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <Box display={'flex'} alignItems={'center'} width={'100%'} justifyContent={'space-between'}>
      {editOpen ? (
        <ClickAwayListener onClickAway={onBlur}>
          <TextField
            size='small'
            fullWidth
            inputProps={{ maxLength: 50 }}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </ClickAwayListener>
      ) : (
        <p style={{ whiteSpace: 'nowrap', marginRight: 15 }}>{column?.ColumnName}</p>
      )}
      <IconButton size='small' onClick={handleMenuOpen}>
        <Icon icon={'lets-icons:meatballs-menu'} rotate={45} />
      </IconButton>
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleMenuClose} TransitionComponent={Grow}>
        <MenuItem onClick={onEditClick}>
          <Box display={'flex'} alignItems={'center'} gap={3}>
            <Icon icon={'mdi:edit-outline'} fontSize={17} />
            <Typography fontSize={13}>Edit</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={onDeleteClick}>
          <Box display={'flex'} alignItems={'center'} gap={3}>
            <Icon icon={'mdi:delete-outline'} fontSize={17} />
            <Typography fontSize={13}>Delete</Typography>
          </Box>
        </MenuItem>
      </Menu>

      <DeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        title={`Delete '${column?.ColumnName}' column ?`}
        onConfirm={handleDelete}
        description={'You wont be able to revert this action'}
      />
    </Box>
  )
}

export default memo(DynamicTableHeader)
