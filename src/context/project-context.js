// ** React Imports
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// ** Defaults
const defaultProvider = {
  project: null,
  role: null,
  columnVisibility: {
    Taskname: true,
    owner: true,
    Priority: true,
    Status: true,
    Timeline: true
  },
  setColumnVisibility: () => null,
  additionalColumns: [],
  seeAllColumns: () => null,
  refetchProject: () => null,
  taskGroups: [],
  refetchTaskGroup: () => null
}
const ProjectContext = createContext(defaultProvider)

const ProjectProvider = ({ project, refetchProject, taskGroups, refetchTaskGroup, role, children }) => {
  const [columnVisibility, setColumnVisibility] = useState({ ...defaultProvider?.columnVisibility })

  const generateVisibility = useCallback(() => {
    const additionalVisiblity = {}
    for (let k = 0; k < project?.additionalColumns.length; k++) {
      const element = project?.additionalColumns[k]
      additionalVisiblity[element?.AdditionalColumnID] = true
    }

    setColumnVisibility({ ...defaultProvider?.columnVisibility, ...additionalVisiblity })
  }, [project?.additionalColumns])

  useEffect(() => {
    generateVisibility()
  }, [generateVisibility])

  const values = {
    project,
    role,
    columnVisibility,
    setColumnVisibility,
    additionalColumns: project?.additionalColumns,
    seeAllColumns: generateVisibility,
    refetchProject,
    taskGroups,
    refetchTaskGroup
  }

  return <ProjectContext.Provider value={values}>{children}</ProjectContext.Provider>
}

export { ProjectContext, ProjectProvider }

export const useProject = () => {
  const value = useContext(ProjectContext)
  if (value === undefined) throw new Error('Tried to use context without a provider')

  return value
}
