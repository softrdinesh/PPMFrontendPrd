// MUI Imports
import { useMemo } from 'react'

import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import { Icon } from '@iconify/react'

import { Divider } from '@mui/material'

import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'

import { useWorkspace } from '@/context/workspace-context'
import { useAuth } from '@/hooks/useAuth'
import CreateWorkspace from '@/views/sidebar/create-workspace'
import ListProjects from '@/views/sidebar/list-projects'
import ListWorkspaces from '@/views/sidebar/list-workspace'
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

  const isDark = useMemo(() => theme.palette.mode === 'dark', [theme.palette.mode])

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
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
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
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

        <Divider className='my-4 bg-white dark:bg-actionHover' />
        <CreateWorkspace icon={<Icon icon={'f7:plus-app'} className='h-6 w-6 text-white' />} />

        <ListWorkspaces />

        {profile === 'projects' ? <ListProjects /> : selected && <SprintNavItemsList />}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
