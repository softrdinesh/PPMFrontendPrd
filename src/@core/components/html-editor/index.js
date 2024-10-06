import React from 'react'
import dynamic from 'next/dynamic'
import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false
})

const HtmlEditor = ({ placeholder, height }) => {
  return <SunEditor height={height ?? '300'} placeholder={placeholder ?? 'Please enter a project description....'} />
}

export default HtmlEditor
