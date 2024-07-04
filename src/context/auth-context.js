// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import { authConfig } from '@configs/auth'
import { authentication } from 'src/utils/endpoints/authentication'

// import toast from 'react-hot-toast'
import toast from 'react-hot-toast'
import { userLogin } from 'src/services/login'
import { routes } from '@routes'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  console.log('loading :', loading)

  // ** Hooks
  const router = useRouter()

  const verifyToken = async () => {
    try {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        await axios
          .get(process.env.NEXT_PUBLIC_API_URL + authentication.verifyToken.uri, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          .then(async res => {
            let responseData = res?.data?.data

            setLoading(false)
            setUser(responseData)
          })
          .catch(() => {
            setLoading(false)
            handleLogout()
          })
      } else {
        handleLogout()
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const googleLogin = async () => {
    try {
      setLoading(true)
      axios
        .get(process.env.NEXT_PUBLIC_API_URL + authentication.googleLoginSuccess.uri, {
          withCredentials: true
        })
        .then(res => {
          const responseValue = res?.data
          if (responseValue?.status) {
            window.localStorage.removeItem(authConfig.loginWithGoogle)
            localStorage.setItem(authConfig.storageTokenKeyName, responseValue.data.token)
            localStorage.setItem(authConfig.storageUId, responseValue.data.id)
            localStorage.setItem('userData', JSON.stringify(responseValue.data))
            setUser(responseValue?.data)
            router.replace(routes.dashboard)
            setLoading(false)
          } else {
            throw Error('Failed to verify google login')
          }
        })
        .catch(err => {
          console.error('err :', err)
          verifyToken()
        })
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    const isLoggedInWithGoogle = localStorage.getItem(authConfig.loginWithGoogle)
    if (isLoggedInWithGoogle) {
      googleLogin()
    } else {
      verifyToken()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params, errorCallback) => {
    try {
      const res = await userLogin(params)
      let responseData = res?.data

      setUser(responseData)

      // ** redirection based on previous path
      const returnUrl = router.query.returnUrl
      const redirectURL = returnUrl && returnUrl !== '/login' ? returnUrl : '/dashboard'
      router.replace(redirectURL)
      return res
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Login Failed')
      if (errorCallback) errorCallback(err)
    }
  }

  const handleLogout = async () => {
    setUser(null)
    setLoading(false)
    window.localStorage.removeItem(authConfig.loginWithGoogle)
    window.localStorage.removeItem(authConfig.storageLoginUserData)
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.storageUId)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
