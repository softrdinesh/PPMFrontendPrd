// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import { routes } from '@routes'
import { authConfig } from '@configs/auth'

const AuthGuard = props => {
  const { children, fallback } = props

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (router.route === '/') {
        const homeRoute = routes.dashboard
        router.replace(homeRoute)
      }

      if ((router?.route === routes.login || router?.route === routes.register) && auth?.user) {
        router.replace(routes.dashboard)
      }

      if (!router.isReady) {
        return
      }

      if (
        auth.user === null &&
        !window.localStorage.getItem(authConfig.storageLoginUserData) &&
        !window.localStorage.getItem(authConfig.loginWithGoogle)
      ) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: routes.login,
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace(routes.login)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
