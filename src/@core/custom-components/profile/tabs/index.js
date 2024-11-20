// MUI Imports
import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Typography } from '@mui/material'
import Tab from '@mui/material/Tab'
import { useState } from 'react'

const ProfileTabs = () => {
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
        <Typography>
          Cake apple pie chupa chups biscuit liquorice tootsie roll liquorice sugar plum. Cotton candy wafer wafer jelly
          cake caramels brownie gummies.
        </Typography>
      </TabPanel>
    </TabContext>
  )
}

export default ProfileTabs
