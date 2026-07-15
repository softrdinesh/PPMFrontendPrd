import { useEffect, useMemo, useState } from 'react'

import { TextField, Typography } from '@mui/material'

import type { Getter } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import type { AdditionalColumn } from '@/services/modules/project/types'
import { pattern } from '@/constants/patterns'
  import { viewProject } from '@/services/modules/project'
  import { useParams } from 'next/navigation'
  import { useQuery } from '@tanstack/react-query'
interface TaskTextValuesProps {
  table: any
  getValue: Getter<string>
  index: number
  id: string
  columnData: AdditionalColumn
  dynamicValue: any
  canEdit: boolean
}

const TaskTextValues = ({ table, getValue, index, id, columnData, dynamicValue, canEdit }: TaskTextValuesProps) => {
  const initialValue = getValue()
  const [value, setValue] = useState<string>(initialValue ?? '-')
const router = useRouter()
     const params = useParams()
  const projectId = Number(params.id)
  const { data, isLoading, } = useQuery({
    queryKey: ['project-view', projectId],
    queryFn: () =>
      viewProject((projectId).toString()).then(res => {
        if (res?.statusCode === 403) {
          router.replace('/401')
          return undefined
        } else {
          return res?.data
        }
      })
  })
    const role1 = useMemo(() => data?.userProjects?.Role, [data?.userProjects?.Role])
  console.log(role1?.RoleName);

const isViewer= role1?.RoleName


  const isNumber = useMemo(() => {
    return columnData?.ColumnType.Keyname === 'NUM'
  }, [columnData?.ColumnType.Keyname])

  const onBlur = () => {
    const body = {
      DynamicID: dynamicValue?.DynamicID ?? null,
      AdditionalColumnID: columnData?.AdditionalColumnID,
      value,
      Title: `Column '${columnData?.ColumnName}' was updated`,
      PreviousState: initialValue,
      NewState: value
    }

    table.options.meta?.updateData(index, id, body)
  }

  useEffect(() => {
 setValue(initialValue ?? '-')
  }, [initialValue])

  return canEdit ? (
//     <TextField
// style={{width:300}}
// disabled={isViewer == 'Viewer'}
//       variant='standard'
//       sx={{
//         border: 0,
//         '& .MuiInputBase-root::before': {
//           borderBottom: 0
//         },
//         '& .MuiInputBase-root:hover::before': {
//           borderBottom: 0
//         }
//       }}
      
//       placeholder='Please enter a value'
//       fullWidth
//       value={value}
//       inputProps={{ maxLength: 50 }}
//       onChange={e => {
//         if (isNumber) {
//           if (e?.target?.value === '' || pattern.numbersAllowed?.test(e?.target?.value)) {
//             setValue(e.target.value)
//           }
//         } else {
//           setValue(e.target.value)
//         }
//       }}
//       onBlur={onBlur}
//     />
<TextField
  style={{ width: 300 }}
  disabled={isViewer === 'Viewer'}
  variant='standard'
  sx={{
    border: 0,
    '& .MuiInputBase-root::before': {
      borderBottom: 0
    },
    '& .MuiInputBase-root:hover::before': {
      borderBottom: 0
    },
    '& .MuiInputBase-input': {
      color: '#1a1a1a' // normal text color
    },
    '& .MuiInputBase-input.Mui-disabled': {
      color: '#1a1a1a', // color when disabled (overrides MUI's default gray)
      WebkitTextFillColor: '#1a1a1a' // needed because MUI uses -webkit-text-fill-color for disabled inputs
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
  ) : (
    <Typography>{value ?? '-'}</Typography>
  )
}

export default TaskTextValues
