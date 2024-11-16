// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

// ** Configs
import Image from 'next/image'
import themeConfig from 'src/configs/themeConfig'

import logo from '@images/logos/logo-pp-small.png'
import logoMain from '@images/logos/logo-pp.png'
import logoMainDark from '@images/logos/logo-pp-dark.png'

// ** Styled Components
const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingRight: theme.spacing(4),
  paddingBlock: theme.spacing(5.5),
  justifyContent: 'space-between',
  backgroundColor: 'background.default',
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const LinkStyled = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  transition: 'all 200ms linear'
})

const VerticalNavHeader = props => {
  // ** Props
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    navMenuBranding: userNavMenuBranding
  } = props

  // ** Hooks & Vars
  const theme = useTheme()
  const { direction, navCollapsed } = settings

  const menuCollapsedStyles =
    navCollapsed && !navHover ? { opacity: 0 } : { transform: 'translateX(-10px)', opacity: 1 }

  const menuCollapsedImageStyle =
    navCollapsed && !navHover ? { marginLeft: 2 } : { transform: 'translateX(-70px)', opacity: 0 }

  const svgFillSecondary = () => {
    return theme.palette.text.secondary
  }

  const svgFillDisabled = () => {
    return theme.palette.text.disabled
  }

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 40) / 8
      }
    } else {
      return 5.5
    }
  }

  const svgRotationDeg = () => {
    if (navCollapsed) {
      if (direction === 'rtl') {
        if (navHover) {
          return 0
        } else {
          return 180
        }
      } else {
        if (navHover) {
          return 180
        } else {
          return 0
        }
      }
    } else {
      if (direction === 'rtl') {
        return 180
      } else {
        return 0
      }
    }
  }

  return (
    <MenuHeaderWrapper sx={{ pl: menuHeaderPaddingLeft(), backgroundColor: 'background.default' }}>
      {userNavMenuBranding ? (
        userNavMenuBranding(props)
      ) : (
        <Box display={'flex'} alignItems={'center'} gap={'5px'}>
          <Image
            src={logo}
            alt={themeConfig.templateName}
            width={40}
            height={40}
            style={{ ...menuCollapsedImageStyle, transition: 'all 300ms linear' }}
          />
          <LinkStyled href='/'>
            <Image
              src={theme?.palette.mode === 'dark' ? logoMainDark : logoMain}
              alt={themeConfig.templateName}
              height={theme?.palette.mode === 'dark' ? 60 : 40}
              style={{
                ...menuCollapsedStyles,
                ...(navCollapsed && !navHover ? {} : { marginLeft: 2 }),
                transition: 'all 400ms linear'
              }}
            />
          </LinkStyled>
        </Box>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{ p: 0, backgroundColor: 'transparent !important' }}
        >
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      ) : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
          sx={{ ...menuCollapsedStyles, p: 0, color: 'text.primary', backgroundColor: 'transparent !important' }}
        >
          <Box
            width={22}
            fill='none'
            height={22}
            component='svg'
            viewBox='0 0 22 22'
            xmlns='http://www.w3.org/2000/svg'
            sx={{
              transform: `rotate(${svgRotationDeg()}deg)`,
              transition: 'transform .25s ease-in-out .35s'
            }}
          >
            <path
              fill={svgFillSecondary()}
              d='M11.4854 4.88844C11.0082 4.41121 10.2344 4.41121 9.75716 4.88844L4.51029 10.1353C4.03299 10.6126 4.03299 11.3865 4.51029 11.8638L9.75716 17.1107C10.2344 17.5879 11.0082 17.5879 11.4854 17.1107C11.9626 16.6334 11.9626 15.8597 11.4854 15.3824L7.96674 11.8638C7.48943 11.3865 7.48943 10.6126 7.96674 10.1353L11.4854 6.61667C11.9626 6.13943 11.9626 5.36568 11.4854 4.88844Z'
            />
            <path
              fill={svgFillDisabled()}
              d='M15.8683 4.88844L10.6214 10.1353C10.1441 10.6126 10.1441 11.3865 10.6214 11.8638L15.8683 17.1107C16.3455 17.5879 17.1193 17.5879 17.5965 17.1107C18.0737 16.6334 18.0737 15.8597 17.5965 15.3824L14.0779 11.8638C13.6005 11.3865 13.6005 10.6126 14.0779 10.1353L17.5965 6.61667C18.0737 6.13943 18.0737 5.36568 17.5965 4.88844C17.1193 4.41121 16.3455 4.41121 15.8683 4.88844Z'
            />
          </Box>
        </IconButton>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
