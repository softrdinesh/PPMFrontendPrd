// ** React Imports
import type { FC, ReactNode } from 'react'
import { createContext, useCallback, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/navigation'

import axios from 'axios'

import toast from 'react-hot-toast'

import type { ApiResponse } from '@/types/api-response'

// ** Config
import { routes } from '@/constants/routes'

import { clearCookies, userLogin, userRegister } from '@/services/auth'
import type { User } from '@/types/auth'

export interface LoginParams {
  email: string
  password: string
  latitude: number
  longitude: number
}

interface AuthContextProps {
  user: User | null
  loading: boolean

  // eslint-disable-next-line no-unused-vars
  setUser: (user: User | null) => void
  verifyToken: () => void
  // eslint-disable-next-line no-unused-vars
  setLoading: (loading: boolean) => void
  // eslint-disable-next-line no-unused-vars
  login: (params: LoginParams, errorCallback?: (err: any) => ApiResponse) => Promise<void>
  register: (params: any, errorCallback?: (err: any) => ApiResponse) => Promise<void>
  logout: () => Promise<void>
}

// ** Defaults
const defaultProvider: AuthContextProps = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => null,

  verifyToken: () => Promise.resolve(),
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext<AuthContextProps>(defaultProvider)

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  // ** States
  const [user, setUser] = useState<User | null>(defaultProvider.user)

  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      await fetch('/api/logout')
      await clearCookies()
      window.location.href = routes.login
    } catch (error) {
      console.error(error)
    } finally {
      setUser(null)
      window.location.href = routes.login
    }
  }, [])

  const checkVerifyToken = useCallback(async () => {
    setLoading(true)

    try {
      const hasCookies = await axios.get('/api/check-cookies')

      if (hasCookies?.data?.status) {
        try {
          const response = await axios.get('/api/verify-token')

          if (response?.data?.status) {
            setUser(response?.data?.data)
          }
        } catch (error) {
          handleLogout()
        }
      }
    } catch {
      setLoading(false)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    checkVerifyToken()
  }, [checkVerifyToken])

  // eslint-disable-next-line no-unused-vars
  const handleLogin = async (params: LoginParams, errorCallback?: (err: any) => void): Promise<void> => {
    try {
      const response = await userLogin(params)

      setLoading(true)

      const responseData = response.data

      setUser({ ...responseData })

      response?.status && router.replace(routes.dashboard)
    } catch (err) {
      setLoading(false)

      if (errorCallback) errorCallback(err)
    }
  }

  // ** USER REGISTER
  const handleRegister = async (params: any, errorCallback?: (err: any) => void): Promise<void> => {
    try {
      const res = await userRegister(params)
      const responseData = res?.data

      setUser(responseData?.userData)

      res?.status && router.replace(routes.dashboard)
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? err?.message ?? 'Registeration Failed')
      if (errorCallback) errorCallback(err)
    }
  }

  const values: AuthContextProps = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    register: handleRegister,
    verifyToken: checkVerifyToken,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
