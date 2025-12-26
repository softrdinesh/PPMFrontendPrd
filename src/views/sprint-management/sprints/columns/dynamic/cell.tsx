import { useMemo } from 'react'

import type { Getter } from '@tanstack/react-table'

import type { AdditionalColumn } from '@/services/modules/sprint-item/types'
import type { SprintItem } from '@/services/modules/sprint-item/types'
import TaskPeople from '../people'
import TaskStatus from '../status'
import DynamicDate from './date-type'
import DynamicDropdown from './dropdown'
import DynamicFiles from './file-upload'
import TaskTextValues from './text-value'

interface DynamicColumnCellProps {
  getValue: Getter<unknown>
  index: number
  row: SprintItem 
  id: string
  columnItem: AdditionalColumn
  table: any
  value: any
  refetch: () => void
}

const DynamicColumnCell = (props: DynamicColumnCellProps) => {
  // ** PROPS
  const { getValue, index, row, id, table, columnItem, value, refetch } = props

  const getColumnTypeName = useMemo(() => columnItem?.ColumnType.Keyname, [columnItem?.ColumnType.Keyname])

  // ** "DATE" TYPE COLUMN
  if (getColumnTypeName === 'DPK')
    return <DynamicDate canEdit={true} refetch={refetch} rowData={row} dynamicValue={value} columnData={columnItem} />

  // ** "USER" TYPE COLUMN
  if (getColumnTypeName === 'USR') {
    const usersList = row?.additionalValues?.filter(
      addVal => addVal?.AdditionalColumnID === columnItem?.AdditionalColumnID
    )

    return (
      <TaskPeople
        refetch={refetch}
        rowData={row}
        dynamicValue={usersList}
        columnData={columnItem}
        canEdit={true}
      />
    )
  }

  // ** "STATUS" TYPE COLUMN
  if (getColumnTypeName === 'LBL')
    return (
      <TaskStatus
        canEdit={true}
        refetch={refetch}
        row={row}
        dynamicValue={value}
        columnData={columnItem}
      />
    )

  // ** "DROPDOWN" TYPE COLUMN
  if (getColumnTypeName === 'DDL') {
    const taskRow = row as SprintItem

    const dropdownList = taskRow?.additionalValues?.filter(
      addVal => addVal?.AdditionalColumnID === columnItem?.AdditionalColumnID
    )

    return (
      <DynamicDropdown
        canEdit={true}
        refetch={refetch}
        rowData={row}
        dynamicValue={dropdownList}
        columnData={columnItem}
      />
    )
  }

  // ** "FILE" TYPE COLUMN
  if (getColumnTypeName === 'FLE')
    return (
      <DynamicFiles
        canEdit={true}
        refetch={refetch}
        rowData={row}
        dynamicValue={value}
        columnData={columnItem}
      />
    )

  // ** "TextField" TYPE COLUMN
  return (
    <TaskTextValues
      canEdit={true}
      columnData={columnItem}
      dynamicValue={value}
      getValue={getValue}
      id={id}
      index={index}
      table={table}
    />
  )
}

export default DynamicColumnCell
