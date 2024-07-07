// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// ** Third Party Components

// ** Theme Config
import themeConfig from 'src/configs/themeConfig'

// ** Util Import
import { IconButton, ListItem, ListItemButton, ListItemIcon, Typography } from '@mui/material'
import Avatar from '@components/avatar'
import { getInitials } from '@utils/get-initials'
import { Icon } from '@iconify/react'

const MenuNavLink = styled(ListItemButton)(() => ({
  width: '100%',
  borderRadius: 8,
  transition: 'padding-left .25s ease-in-out',
  '& .MuiTypography-root': {
    fontWeight: 300,
    fontSize: '0.9rem'
  }
}))

const MenuItemTextMetaWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
}))

function NavWorkshopLists({ data, ...props }) {
  const isNavLinkActive = () => {
    if (true) {
      return true
    } else {
      return false
    }
  }

  return (
    <ListItem
      disablePadding
      className='nav-link'
      sx={{
        mt: 3,
        transition: 'padding .25s ease-in-out',
        px: theme =>
          props?.parent
            ? '0 !important'
            : `${theme.spacing(props?.navCollapsed && !props?.navHover ? 2 : 3)} !important`
      }}
    >
      <MenuNavLink
        disableTouchRipple
        disableRipple
        className={isNavLinkActive() ? 'active' : ''}
        sx={{
          py: 2.25,
          backgroundColor: isNavLinkActive() ? 'background.paper' : 'inherit',
          '&:hover': {
            backgroundColor: isNavLinkActive() ? 'background.paper' : 'inherit'
          },
          pr:
            props?.navCollapsed && !props?.navHover
              ? (props?.collapsedNavWidth - props?.navigationBorderWidth - 24 - 16) / 8
              : 3,
          pl:
            props?.navCollapsed && !props?.navHover
              ? (props?.collapsedNavWidth - props?.navigationBorderWidth - 24 - 16) / 8
              : 2.25
        }}
      >
        {props?.isSubToSub ? null : (
          <ListItemIcon
            sx={{
              minWidth: 30,
              transition: 'margin .25s ease-in-out',
              color: 'white',
              ...(props?.navCollapsed && !props?.navHover ? { mr: 0 } : { mr: 1 }),
              ...(props?.parent ? { ml: 2, mr: 4 } : {})
            }}
          >
            <Avatar skin='light' color='error' sx={{ width: 25, height: 25, fontSize: '1rem' }}>
              {getInitials(data?.WorkspaceName?.split(' ')?.[0])}
            </Avatar>
          </ListItemIcon>
        )}

        <MenuItemTextMetaWrapper
          sx={{
            ...(props?.isSubToSub ? { ml: 8 } : {}),
            ...(props?.navCollapsed && !props?.navHover ? { opacity: 0 } : { opacity: 1 })
          }}
        >
          <Typography
            {...((themeConfig.menuTextTruncate ||
              (!themeConfig.menuTextTruncate && props?.navCollapsed && !props?.navHover)) && {
              noWrap: true
            })}
          >
            {data?.WorkspaceName}
          </Typography>
          <IconButton sx={{ p: 1 }}>
            <Icon icon={'solar:menu-dots-bold'} fontSize={'1rem'} />
          </IconButton>
        </MenuItemTextMetaWrapper>
      </MenuNavLink>
    </ListItem>
  )
}

export default NavWorkshopLists
