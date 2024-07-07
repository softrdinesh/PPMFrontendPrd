import { useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

// ** style import
import * as styles from '@styles-page/app-bar-content/styles'
import { useAuth } from 'src/hooks/useAuth'

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, toggleNavVisibility, saveSettings } = props

  // ** Hooks
  const auth = useAuth()

  const ref = useRef(null)

  return (
    <>
      <Box sx={styles.mainBox()} ref={ref}>
        <Box className='actions-left' sx={styles.mainSubBox()}>
          {hidden ? (
            <IconButton color='inherit' sx={styles.toggleButtonStyle()} onMouseDown={toggleNavVisibility}>
              <Icon icon='mdi:menu' />
            </IconButton>
          ) : null}
        </Box>

        <Box className='actions-right' sx={styles.rightBoxStyle()}>
          <ModeToggler settings={settings} saveSettings={saveSettings} />

          <NotificationDropdown settings={settings} id='notify' />

          {auth.user && <UserDropdown settings={settings} user={auth?.user} />}
        </Box>
      </Box>
    </>
  )
}

export default AppBarContent
