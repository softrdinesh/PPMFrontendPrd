// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// ** Theme Config
import themeConfig from 'src/configs/themeConfig'

// ** Util Import
import { FormControl, IconButton, ListItemButton, ListItemIcon, TextField, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { WorkspaceContext } from 'src/context/workspace-context'
import UserIcon from 'src/layouts/components/UserIcon'
import { Icon } from '@iconify/react'

const MenuNavLink = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  borderRadius: 8,
  transition: 'padding-left .25s ease-in-out',
  '& .MuiTypography-root': {
    fontWeight: 500,
    color: `${theme.palette.common.white} !important`,
    fontSize: '.9rem'
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

function ProjectListNavMenu(props) {
  const { setSelected } = useContext(WorkspaceContext)
  const [name, setName] = useState('')

  const handleCreateWorkspace = () => {
    setSelected(null)
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
          mt: 5
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
          <IconButton sx={{ p: 0 }}>
            <Icon icon={'ph:plus-fill'} color='white' />
          </IconButton>
        </ListItemIcon>
      </MenuItemTextMetaWrapper>

      <MenuNavLink
        sx={{
          mt: 3,
          py: 2.25,
          pr:
            props?.navCollapsed && !props?.navHover
              ? (props?.collapsedNavWidth - props?.navigationBorderWidth - 24 - 16) / 8
              : 3,
          pl:
            props?.navCollapsed && !props?.navHover
              ? (props?.collapsedNavWidth - props?.navigationBorderWidth - 24 - 16) / 8
              : 2.4
        }}
        onClick={handleCreateWorkspace}
      >
        <ListItemIcon
          sx={{
            minWidth: 35,
            justifyContent: props?.navCollapsed && !props?.navHover ? 'flex-end' : 'flex-start',
            transition: 'margin .25s ease-in-out',
            color: 'white',
            '& svg': {
              ...(!props?.parent ? { fontSize: '1.5rem' } : { fontSize: '0.5rem' })
            }
          }}
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
            textTransform={'uppercase'}
          >
            {'Project 1'}
          </Typography>
        </MenuItemTextMetaWrapper>
      </MenuNavLink>
    </Box>
  )
}

export default ProjectListNavMenu
