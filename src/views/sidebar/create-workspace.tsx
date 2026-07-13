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
import SubscriptionExpiredDialog from '@/views/paymentpopup/SubscriptionExpiredDialog'
import { useRazorpayPayment } from '../paymentpopup/useRazorpayPayment'
import { useWorkspace } from '@/context/workspace-context'
import { useAuth } from '@/hooks/useAuth'

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
  const [shouldOpenDialog, setShouldOpenDialog] = useState(false)

  // Hooks
  const pathname = usePathname()
  const { profile, user } = useAuth()
  const { refetchWorkspaces, workspace, projects } = useWorkspace() // <-- added `projects` here, swap the field name if your context uses a different key
  const { menuItemStyles, renderExpandedMenuItemIcon, textTruncate } = useVerticalMenu()
  const { isCollapsed, isPopoutWhenCollapsed, isBreakpointReached } = useVerticalNav()
  const [showPaymentExpiredDialog, setShowPaymentExpiredDialog] = useState(false)

  // Get the styles for the specified element.
  const getMenuItemStyles = (element: MenuItemElement): CSSObject | undefined => {
    if (menuItemStyles) {
      const params = { level, disabled, active, isSubmenu: false }

      const styleFunction = menuItemStyles[element]

      if (styleFunction) {
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
  }, [pathname])

  useUpdateEffect(() => {
    onActiveChange?.(active)
  }, [active])


  useUpdateEffect(() => {
    if (shouldOpenDialog) {
      setIsModalOpen(true)
      setShouldOpenDialog(false)
    }
  }, [shouldOpenDialog])

  const handleCreateWorkspaceClick = () => {
       setIsModalOpen(true)
//     const workspaceCount = workspace?.length ?? 0
//     const projectCount = projects?.length ?? 0
// console.log(workspaceCount,projectCount);
//     if (workspaceCount > 0) {

//       const canOpen = checkPaymentStatus()

//       if (canOpen) {
//         setIsModalOpen(true)
//       }
//     } else {
//       setIsModalOpen(true)
//     }
  }

  const { isLoading, razorpayLoaded, generateRazorPayOrder } = useRazorpayPayment({
    userId: Number(user?.id),
    onPaymentSuccess: () => {
      const canOpen = checkPaymentStatus()

      setShouldOpenDialog(canOpen)
      setShowPaymentExpiredDialog(false)
    },
    onPaymentFailure: () => {
      const canOpen = checkPaymentStatus()

      setShouldOpenDialog(canOpen)
      setShowPaymentExpiredDialog(true)
    }
  })

  const checkPaymentStatus = () => {
    const paymentStatus = localStorage.getItem('paymentStatus')

    const workspaceCount = workspace?.length ?? 0
    const projectCount = projects?.length ?? 0

    // If either the workspace count or project count is greater than 0, block and show the payment popup.
    // Only when BOTH are 0 is the user allowed through without payment.
    if (workspaceCount > 0 || projectCount > 0) {
      setShowPaymentExpiredDialog(true)
      return false
    }

    try {
      if (paymentStatus) {
        const parsed = JSON.parse(paymentStatus)

        // If parsed explicitly says expired, show payment dialog and disallow opening the Task Group dialog
        if (parsed.isExpired == true) {
          setShowPaymentExpiredDialog(true)
          return false
        }
        // If parsed explicitly says not expired, ensure payment dialog is hidden and allow opening Task Group dialog
        if (parsed.isExpired == false) {
          setShowPaymentExpiredDialog(false)
          return true
        }
        // In case parsed.isExpired is missing or unexpected, be conservative: treat as expired
        setShowPaymentExpiredDialog(true)
        return false
      }
      // No stored status, but both workspaceCount and projectCount are 0, so allow the first creation
      setShowPaymentExpiredDialog(false)
      return true
    } catch (error) {
      console.error('Error parsing payment status:', error)
      // On parse error, treat as expired to be safe
      setShowPaymentExpiredDialog(true)
      return false
    }
  }

  const handleClosePaymentDialog = () => {
    setShowPaymentExpiredDialog(false)
  }

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
          onClick={handleCreateWorkspaceClick}
        >
          {/* Menu Item Label */}
          <StyledMenuLabel
            className={`text-white text-sm uppercase leading-1 ${active ? 'font-semibold' : 'font-normal'}`}
            rootStyles={getMenuItemStyles('label')}
            textTruncate={textTruncate}
          >
            {'Create Workspaces'}
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
      <SubscriptionExpiredDialog
        open={showPaymentExpiredDialog}
        onClose={handleClosePaymentDialog}
        onRenew={generateRazorPayOrder}
        isLoading={isLoading}
        razorpayLoaded={razorpayLoaded}
      />
    </>
  )
}

export default forwardRef(CreateWorkspace)
