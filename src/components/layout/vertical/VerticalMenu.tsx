// MUI Imports
import { useMemo, useState, useEffect } from 'react'

import { useTheme } from '@mui/material/styles'
import { usePathname, useRouter } from 'next/navigation'
// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import { Icon } from '@iconify/react'

import { Divider,Box,Typography } from '@mui/material'

import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { routes } from '@/constants/routes'
// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'

import { useWorkspace } from '@/context/workspace-context'
import { useAuth } from '@/hooks/useAuth'
import CreateWorkspace from '@/views/sidebar/create-workspace'
import ListProjects from '@/views/sidebar/list-projects'
import ListWorkspaces from '@/views/sidebar/list-workspace'
import ListBoards from '@views/sidebar/list-boards'
import SprintNavItemsList from '@/views/sidebar/sprint-nav-items'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { profile } = useAuth()
  const { selected } = useWorkspace()
  const pathname = usePathname()
  const router = useRouter()
  const isDark = useMemo(() => theme.palette.mode === 'dark', [theme.palette.mode])
  const [boardSelected, setBoardSelected] = useState(false)
  const roleData = localStorage.getItem('Role');
  const parsedData = JSON.parse((roleData)as any);
  // const rolename = parsedData.rolename;
  const rolename = parsedData?.rolename;

  useEffect(() => {
    setBoardSelected(false)
  }, [JSON.stringify(selected)])

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar
  const handleOpenProject = () => {
    router.push(`${routes.profile}`)
  }

  const handleBoardClick = (boardId: string) => {
    setBoardSelected(true)
    router.push(routes.boardsview)
  }

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: `bs-full overflow-y-auto overflow-x-hidden ${isDark ? 'bg-backgroundPaper' : 'bg-primary'}`,
            onScroll: container => scrollMenu(container, false)
          }
        : {
            className: isDark ? 'bg-backgroundPaper' : 'bg-primary',
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        className='py-3'
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href='/dashboard' icon={<Icon icon={'mage:dashboard-2'} className='h-6 w-6 text-white' />}>
          Dashboard
        </MenuItem>
        <MenuItem
          href='/recent-activity'
          icon={<Icon icon={'hugeicons:shopping-bag-02'} className='h-6 w-6 text-white' />}
        >
          Recent Activity
        </MenuItem>
<<<<<<< HEAD
        {profile == 'projects' && rolename !== 'Viewer' &&
          <MenuItem
            href='/super-admin'
            icon={<Icon icon={'mage:dashboard-4'} className='h-6 w-6 text-white' />}
=======
        {profile == 'projects' && rolename !== 'Viewer' && rolename !== 'Member'&&
          <MenuItem
            href='/super-admin'
icon={<Icon icon={'mage:security-shield'} className='h-6 w-6 text-white' />}
>>>>>>> source-link/main
          >
            Admin
          </MenuItem>
        }
        {profile == 'projects' &&
          <MenuItem
            href='/feedback'
<<<<<<< HEAD
            icon={<Icon icon={'mage:dashboard-4'} className='h-6 w-6 text-white' />}
          >
            Feed Back
=======
icon={<Icon icon={'solar:clipboard-check-outline'} className='h-6 w-6 text-white' />}
          >
            Feedback
>>>>>>> source-link/main
          </MenuItem>
        }
        <Divider className='my-4 bg-white dark:bg-actionHover' />
        <CreateWorkspace icon={<Icon icon={'f7:plus-app'} className='h-6 w-6 text-white' />} />

        <ListWorkspaces />
        <Box sx={{ px: 2.25, py: 2 }}>
          {profile == 'projects' && rolename !== 'Viewer' &&
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              <Typography 
                variant='caption' 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  px: 1,
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  transition: 'opacity .25s ease-in-out'
                }}
              >
                Boards
              </Typography>
            </Divider>
          }
        </Box>
        
        {profile == 'projects' && rolename !== 'Viewer' &&
          <ListBoards onBoardClick={handleBoardClick} />
        }
        
        {/* FIX: Conditionally hide projects based on boardSelected */}
        {profile == 'projects' && !boardSelected && (
          <ListProjects hideAddProject={boardSelected} />
        )}
        
        {profile != 'projects' && selected && (
          <SprintNavItemsList />
        )}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
