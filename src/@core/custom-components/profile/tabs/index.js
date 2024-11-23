// MUI Imports
import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import ChangePasswordProfile from './change-password'

const ProfileTabs = ({ data, refetch }) => {
  // States
  const [value, setValue] = useState('change-password')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='profile tabs'>
        <Tab
          value='change-password'
          label='Change Password'
          icon={<Icon icon={'solar:lock-password-broken'} fontSize={20} />}
          iconPosition='start'
        />
      </TabList>
      <TabPanel value='change-password'>
        <ChangePasswordProfile data={data} refetch={refetch} />
      </TabPanel>
    </TabContext>
  )
}

export default ProfileTabs
