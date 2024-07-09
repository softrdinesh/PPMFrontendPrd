// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Avatar from '@components/avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import IconifyIcon from 'src/@core/components/icon'

// ** Context Imports
import { useAuth } from 'src/hooks/useAuth'

const UserDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hooks
  const auth = useAuth()

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    auth?.logout()
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    gap: '7px',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  return (
    <Fragment>
      <Avatar
        alt={auth?.user?.Name ?? 'John Doe'}
        onClick={handleDropdownOpen}
        sx={{ width: 40, height: 40, cursor: 'pointer' }}
        src={auth?.user?.image ?? '/images/avatars/1.png'}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt={auth?.user?.Name ?? 'John Doe'}
              src={auth?.user?.image ?? '/images/avatars/1.png'}
              sx={{ width: '2.5rem', height: '2.5rem' }}
            />

            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{auth?.user?.Name ?? 'John Doe'}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ p: 0 }} onClick={handleDropdownClose}>
          <Box sx={styles}>
            <IconifyIcon icon={'mdi:account-outline'} />
            <Typography>Profile</Typography>
          </Box>
        </MenuItem>

        <MenuItem sx={{ p: 0 }} onClick={handleLogout}>
          <Box sx={styles}>
            <IconifyIcon icon={'ic:round-logout'} />
            <Typography>Logout</Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
