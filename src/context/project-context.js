// ** React Imports
import { createContext, useContext } from 'react'
import { useAuth } from 'src/hooks/useAuth'

// ** Defaults
const defaultProvider = {
  taskGroups: [],
  taskList: []
}
const ProjectContext = createContext(defaultProvider)

const ProjectProvider = ({ children }) => {
  // ** Auth Imports
  const auth = useAuth()
  console.log('auth :', auth)

  const values = {}

  return <ProjectContext.Provider value={values}>{children}</ProjectContext.Provider>
}

export { ProjectContext, ProjectProvider }

export const useProject = () => {
  const value = useContext(ProjectContext)
  if (value === undefined) throw new Error('Tried to use context without a provider')

  return value
}
