'use client'

// React Imports
import type { AnchorHTMLAttributes, ForwardRefRenderFunction, ReactElement, ReactNode } from 'react'
import { forwardRef, useEffect, useState } from 'react'

// Next Imports
import { usePathname } from 'next/navigation'

// Third-party Imports
import type { CSSObject } from '@emotion/styled'
import classnames from 'classnames'
import { useUpdateEffect } from 'react-use'

// Type Imports
import MenuButton from '@/@menu/components/vertical-menu/MenuButton'
import useVerticalMenu from '@/@menu/hooks/useVerticalMenu'
import useVerticalNav from '@/@menu/hooks/useVerticalNav'
import StyledMenuLabel from '@/@menu/styles/StyledMenuLabel'
import StyledVerticalMenuItem from '@/@menu/styles/vertical/StyledVerticalMenuItem'
import type { MenuItemElement, MenuItemExactMatchUrlProps, RootStylesType } from '@/@menu/types'
import { menuClasses } from '@/@menu/utils/menuClasses'
import { renderMenuIcon } from '@/@menu/utils/menuUtils'
import CreateWorkspaceDialog from './create-workspace-dialog'
import { useWorkspace } from '@/context/workspace-context'

export type MenuItemProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'prefix'> &
  RootStylesType &
  MenuItemExactMatchUrlProps & {
    icon?: ReactElement
    prefix?: ReactNode
    suffix?: ReactNode
    disabled?: boolean
    target?: string
    rel?: string
    component?: string | ReactElement
    onActiveChange?: (active: boolean) => void

    /**
     * @ignore
     */
    level?: number
  }

const CreateWorkspace: ForwardRefRenderFunction<HTMLLIElement, MenuItemProps> = (props, ref) => {
  // Props
  const {
    icon,
    level = 0,
    disabled = false,
    exactMatch = true,
    activeUrl,
    component,
    onActiveChange,
    rootStyles,
    ...rest
  } = props

  // States
  const [active, setActive] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Hooks
  const pathname = usePathname()
  const { refetchWorkspaces } = useWorkspace()
  const { menuItemStyles, renderExpandedMenuItemIcon, textTruncate } = useVerticalMenu()

  const { isCollapsed, isPopoutWhenCollapsed, isBreakpointReached } = useVerticalNav()

  // Get the styles for the specified element.
  const getMenuItemStyles = (element: MenuItemElement): CSSObject | undefined => {
    // If the menuItemStyles prop is provided, get the styles for the specified element.
    if (menuItemStyles) {
      // Define the parameters that are passed to the style functions.
      const params = { level, disabled, active, isSubmenu: false }

      // Get the style function for the specified element.
      const styleFunction = menuItemStyles[element]

      if (styleFunction) {
        // If the style function is a function, call it and return the result.
        // Otherwise, return the style function itself.
        return typeof styleFunction === 'function' ? styleFunction(params) : styleFunction
      }
    }
  }

  // Change active state when the url changes
  useEffect(() => {
    const href = rest.href || (component && typeof component !== 'string' && component.props.href)

    if (href) {
      // Check if the current url matches any of the children urls
      if (exactMatch ? pathname === href : activeUrl && pathname.includes(activeUrl)) {
        setActive(true)
      } else {
        setActive(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Call the onActiveChange callback when the active state changes.
  useUpdateEffect(() => {
    onActiveChange?.(active)
  }, [active])

  return (
    <>
      <StyledVerticalMenuItem
        ref={ref}
        level={level}
        isCollapsed={isCollapsed}
        isPopoutWhenCollapsed={isPopoutWhenCollapsed}
        disabled={disabled}
        buttonStyles={getMenuItemStyles('button')}
        menuItemStyles={getMenuItemStyles('root')}
        rootStyles={rootStyles}
      >
        <MenuButton
          className={classnames(menuClasses.button, { [menuClasses.active]: active }, !isCollapsed && 'gap-2')}
          component={component}
          tabIndex={disabled ? -1 : 0}
          onClick={() => {
            setIsModalOpen(true)
          }}
        >
          {/* Menu Item Label */}
          <StyledMenuLabel
            className={`text-white text-sm uppercase leading-1 ${active ? 'font-semibold' : 'font-normal'}`}
            rootStyles={getMenuItemStyles('label')}
            textTruncate={textTruncate}
          >
            {'Create Workspace'}
          </StyledMenuLabel>

          {/* Menu Item Icon */}
          {renderMenuIcon({
            icon,
            level,
            active,
            disabled,
            renderExpandedMenuItemIcon,
            isBreakpointReached
          })}
        </MenuButton>
      </StyledVerticalMenuItem>
      <CreateWorkspaceDialog
        open={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
        refetchWorkspaces={refetchWorkspaces}
      />
    </>
  )
}

export default forwardRef(CreateWorkspace)
