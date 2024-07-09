// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// ** Theme Config
import themeConfig from 'src/configs/themeConfig'

// ** Util Import
import { Icon } from '@iconify/react'
import {
  FormControl,
  IconButton,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import UserIcon from 'src/layouts/components/UserIcon'
import Router from 'next/router'
import { routes } from '@routes'
import CreateProject from '../../modals/CreateProject'

const MenuNavLink = styled(ListItemButton)(() => ({
  width: '100%',
  borderRadius: 8,

  transition: 'padding-left .25s ease-in-out'
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

function ProjectListNavMenu({ projects, ...props }) {
  // ** States
  const [name, setName] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)

  // ** Router
  const {
    pathname,
    query: { id }
  } = Router

  // ** Functions
  const isNavLinkActive = prID => {
    console.log("pathname?.split('/') :", pathname?.split('/'))
    console.log('prID :', prID)
    if (pathname?.split('/')?.[1] === 'project' && prID == id) {
      return true
    }

    return false
  }

  const handleOpenAnchor = e => setAnchorEl(e.currentTarget)
  const handleCloseAnchor = () => setAnchorEl(null)

  const handleOpen = () => {
    setOpen(true)
    handleCloseAnchor()
  }
  const handleClose = () => setOpen(false)

  const handleOpenProject = id => {
    Router.push(`${routes.project}/${id}`)
  }

  return (
    <Box
      sx={{
        mt: 5,
        transition: 'padding .25s ease-in-out',
        px: theme =>
          props?.parent
            ? '0 !important'
            : `${theme.spacing(props?.navCollapsed && !props?.navHover ? 2 : 3)} !important`
      }}
    >
      <MenuItemTextMetaWrapper
        sx={{
          ...(props?.navCollapsed && !props?.navHover ? { opacity: 0 } : { opacity: 1 }),
          my: 5
        }}
      >
        <Box flex={1}>
          <FormControl fullWidth>
            <TextField
              type='text'
              placeholder='Search'
              autoComplete='off'
              sx={{
                '.css-x2l1vy-MuiInputBase-root-MuiOutlinedInput-root': {
                  color: 'white'
                }
              }}
              InputProps={{
                sx: {
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    border: '2px solid white'
                  },
                  '&:hover': {
                    '.MuiOutlinedInput-notchedOutline': {
                      border: '2px solid white'
                    }
                  }
                },
                endAdornment: <Icon icon={'ion:search'} fontSize={27} />
              }}
              size='small'
              variant='outlined'
              fullWidth
              value={name}
              onChange={e => {
                setName(e.target.value)
              }}
            />
          </FormControl>
        </Box>
        <ListItemIcon
          sx={{
            minWidth: 30,
            justifyContent: props?.navCollapsed && !props?.navHover ? 'flex-end' : 'flex-start',
            transition: 'margin .25s ease-in-out',
            color: 'white',
            '& svg': {
              ...(!props?.parent ? { fontSize: '2.2rem' } : { fontSize: '0.5rem' })
            }
          }}
        >
          <IconButton sx={{ p: 0 }} onClick={handleOpenAnchor}>
            <Icon icon={'ph:plus-fill'} color='white' />
          </IconButton>
          <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleCloseAnchor}>
            <MenuItem sx={{ minWidth: 150 }} onClick={handleOpen}>
              <Box display={'flex'} alignItems={'center'} gap={3}>
                <Typography variant='body2'>New Project</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </ListItemIcon>
        <CreateProject open={open} onCloseModal={handleClose} />
      </MenuItemTextMetaWrapper>

      {/* List of Projects */}
      {projects?.map(item => (
        <MenuNavLink
          key={item?.ID}
          sx={{
            py: 2.25,
            mb: 2,
            backgroundColor: isNavLinkActive(item?.ID) && '#E5E6EA',
            '&:hover': {
              backgroundColor: isNavLinkActive(item?.ID) && '#E5E6EA'
            },
            pr:
              props?.navCollapsed && !props?.navHover
                ? (props?.collapsedNavWidth - props?.navigationBorderWidth - 24 - 16) / 8
                : 3,
            pl:
              props?.navCollapsed && !props?.navHover
                ? (props?.collapsedNavWidth - props?.navigationBorderWidth - 24 - 16) / 8
                : 2.4
          }}
          disableGutters
          disableTouchRipple
          disableRipple
          onClick={() => handleOpenProject(item?.ID)}
        >
          <ListItemIcon
            sx={theme => ({
              minWidth: 35,
              justifyContent: props?.navCollapsed && !props?.navHover ? 'flex-end' : 'flex-start',
              transition: 'margin .25s ease-in-out',
              color: isNavLinkActive(item?.ID) ? theme?.palette?.primary.main : 'white',
              '& svg': {
                ...(!props?.parent ? { fontSize: '1.5rem' } : { fontSize: '0.5rem' })
              }
            })}
          >
            <UserIcon icon={'gravity-ui:list-check'} />
          </ListItemIcon>
          <MenuItemTextMetaWrapper
            sx={{
              ...(props?.navCollapsed && !props?.navHover ? { opacity: 0 } : { opacity: 1 })
            }}
          >
            <Typography
              {...((themeConfig.menuTextTruncate ||
                (!themeConfig.menuTextTruncate && props?.navCollapsed && !props?.navHover)) && {
                noWrap: true
              })}
              variant='body2'
              color={isNavLinkActive(item?.ID) ? 'primary.main' : 'white'}
              fontWeight={isNavLinkActive(item?.ID) ? 500 : 300}
            >
              {item?.ProjectName}
            </Typography>
          </MenuItemTextMetaWrapper>
        </MenuNavLink>
      ))}
    </Box>
  )
}

export default ProjectListNavMenu
