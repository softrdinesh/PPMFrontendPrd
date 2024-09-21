import { TextField } from '@mui/material'
import { pattern } from '@patterns'
import React, { useEffect, useMemo, useState } from 'react'

const TaskTextValues = ({ table, getValue, index, id, columnData, dynamicValue }) => {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue ?? '-')

  const isNumber = useMemo(() => {
    return columnData?.ColumnType.Keyname === 'NUM'
  }, [columnData?.ColumnType.Keyname])

  const onBlur = () => {
    const body = {
      DynamicID: dynamicValue?.DynamicID ?? null,
      AdditionalColumnID: columnData?.AdditionalColumnID,
      value
    }
    table.options.meta?.updateData(index, id, body)
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
      placeholder='Please enter a value'
      fullWidth
      value={value}
      inputProps={{ maxLength: 50 }}
      onChange={e => {
        if (isNumber) {
          if (e?.target?.value === '' || pattern.numbersAllowed?.test(e?.target?.value)) {
            setValue(e.target.value)
          }
        } else {
          setValue(e.target.value)
        }
      }}
      onBlur={onBlur}
    />
  )
}

export default TaskTextValues
