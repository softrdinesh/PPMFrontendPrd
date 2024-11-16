import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

const TaskEffortCell = ({ table, getValue, index, id }) => {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue ?? '')

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <TextField
      variant='standard'
      sx={{
        border: 0,
        '& .MuiInputBase-root::before': {
          borderBottom: 0
        },
        '& .MuiInputBase-root:hover::before': {
          borderBottom: 0
        }
      }}
      fullWidth
      placeholder='eg. 10 hours'
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
    />
  )
}

export default TaskEffortCell
