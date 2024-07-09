// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// ** Third Party Components

// ** Theme Config
import themeConfig from 'src/configs/themeConfig'

// ** Util Import
import { ListItem, ListItemButton, ListItemIcon, Typography } from '@mui/material'
import UserIcon from 'src/layouts/components/UserIcon'
import CreateWorkspace from '../../modals/CreateWorkspace'
import { useContext, useState } from 'react'
import { WorkspaceContext } from 'src/context/workspace-context'

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
function CreateWorkshop(props) {
  const { refetchWorkspaces } = useContext(WorkspaceContext)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  return (
    <ListItem
      disablePadding
      sx={{
        mt: 1.5,
        transition: 'padding .25s ease-in-out',
        px: theme =>
          props?.parent
            ? '0 !important'
            : `${theme.spacing(props?.navCollapsed && !props?.navHover ? 2 : 3)} !important`
      }}
    >
      <MenuNavLink
        sx={{
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
        onClick={() => {
          handleModalOpen()
        }}
      >
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
            {'Create Workspace'}
          </Typography>
        </MenuItemTextMetaWrapper>

        {props.isSubToSub ? null : (
          <ListItemIcon
            sx={{
              minWidth: 30,
              justifyContent: props?.navCollapsed && !props?.navHover ? 'flex-end' : 'flex-start',
              transition: 'margin .25s ease-in-out',
              color: 'white',
              '& svg': {
                ...(!props?.parent ? { fontSize: '1.5rem' } : { fontSize: '0.5rem' })
              }
            }}
          >
            <UserIcon icon={'f7:plus-app'} />
          </ListItemIcon>
        )}
      </MenuNavLink>
      <CreateWorkspace
        open={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
        refetchWorkspaces={refetchWorkspaces}
      />
    </ListItem>
  )
}

export default CreateWorkshop
