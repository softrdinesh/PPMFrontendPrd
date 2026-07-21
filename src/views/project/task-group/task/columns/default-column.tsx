import { useEffect, useState } from 'react'

import { TextField, Typography } from '@mui/material'
import type { Getter } from '@tanstack/react-table'

interface ColumnTextFieldProps {
  table: any
  getValue: Getter<string>
  index: number
  id: string
  canEdit: boolean
}

export const ColumnTextField = ({ table, getValue, index, id, canEdit = true }: ColumnTextFieldProps) => {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue || '')

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    table.options.meta?.updateData(index, id, value)
  }
const roleData = localStorage.getItem('Role');
const parsedData = JSON.parse((roleData)as any);
// const rolename = parsedData.rolename;
const rolename = parsedData?.rolename;
  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  return canEdit ? (
    <TextField
      variant='standard'
    //   sx={{
    //     border: 0,
    //     '& .MuiInputBase-root::before': {
    //       borderBottom: 0
    //     },
    //     '& .MuiInputBase-root:hover::before': {
    //       borderBottom: 0
    //     },
    //      '& .MuiInputBase-root.Mui-disabled': {
    //   color: '#000000', // Dark mode color
    //   '&:before': {
    //     borderBottom: 0
    //   }
    // },
    // '& .MuiInputBase-input.Mui-disabled': {
    //   WebkitTextFillColor: '#000000', // Dark mode color
    //   color: '#000000'
    // },
    // // Dark mode overrides
    // '@media (prefers-color-scheme: dark)': {
    //   '& .MuiInputBase-root.Mui-disabled': {
    //     color: 'red', // Light mode color for dark background
    //   },
    //   '& .MuiInputBase-input.Mui-disabled': {
    //     WebkitTextFillColor: '#fafafa',
    //     color: '#fafafa'
    //   }
    // }
    //   }}
    sx={{
  border: 0,
  '& .MuiInputBase-root::before': {
    borderBottom: 0
  },
  '& .MuiInputBase-root:hover::before': {
    borderBottom: 0
  },
  // Using theme for better dark/light mode support
  '& .MuiInputBase-root.Mui-disabled': {
    color: theme => theme.palette.mode === 'dark' ? '#fafafa' : '#000000',
    '&:before': {
      borderBottom: 0
    }
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: theme => theme.palette.mode === 'dark' ? '#fafafa' : '#000000',
    color: theme => theme.palette.mode === 'dark' ? '#fafafa' : '#000000'
  }
}}
        multiline
        minRows={3}
        maxRows={6}
      // style={{width:300}}
        //  disabled={rolename !=='Viewer'}
disabled={rolename =='Viewer'}
      className='min-w-44'
      value={value  ?? "-"}
      slotProps={{ htmlInput: { maxLength: 50 } }}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
    />
  ) : (
    <Typography className='w-full min-w-20' width={'100%'}>
      {value ?? '-'}
    </Typography>
  )
}

type DefaultColumnType = {
  getValue: Getter<string>
  row: { index: number }
  column: { id: string }
  table: any
}

// Give our default column cell renderer editing superpowers!
export const defaultColumn: any = (canEdit: boolean) => ({
  cell: ({ getValue, row: { index }, column: { id }, table }: DefaultColumnType) => {
    return <ColumnTextField getValue={getValue} index={index} id={id} table={table} canEdit={canEdit} />
  }
})
