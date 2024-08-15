import React from 'react'

const DynamicText = ({ rowData }) => {
  return <div>{rowData?.dynamicValue ?? 'DynamicText'}</div>
}

export default DynamicText
