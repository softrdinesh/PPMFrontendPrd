// ** React Imports
import type { ReactNode } from 'react'
import { useEffect } from 'react'

// ** Next Import

// ** Hooks Import
import { usePathname, useRouter } from 'next/navigation'

import { authConfig } from '@/configs/authConfig'

import { routes } from '@/constants/routes'

import { useAuth } from 'src/hooks/useAuth'

type AuthGuardProps = {
  children: ReactNode
  fallback: any
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  const pathname = usePathname()

  useEffect(
    () => {
      if (pathname === '/') {
        const homeRoute = routes.dashboard

        router.replace(homeRoute)
      }

      if ((pathname === routes.login || pathname === routes.register) && auth?.user) {
        router.replace(routes.dashboard)
      }

      if (
        auth.user === null &&
        !window.localStorage.getItem(authConfig.loginUserData) &&
        !window.localStorage.getItem(authConfig.loginWithGoogle)
      ) {
        if (pathname !== '/') {
          router.replace(routes.login)
        } else {
          router.replace(routes.login)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  )

  if (auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
