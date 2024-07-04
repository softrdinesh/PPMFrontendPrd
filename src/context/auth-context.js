// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import { authentication } from 'src/utils/endpoints/authentication'

// import toast from 'react-hot-toast'
import toast from 'react-hot-toast'
import { userLogin } from 'src/services/login'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: false,
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

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
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
              setUser({ ...responseData, role: responseData.role_id })
            })
            .catch(() => {
              setLoading(false)
              handleLogout()
            })
        } else {
          removeLocalStorageData()
          setUser(null)
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params, errorCallback) => {
    try {
      const res = await userLogin(params)
      let responseData = res?.data

      setUser({ ...responseData, role: responseData?.role_id })

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

  const removeLocalStorageData = () => {
    localStorage.removeItem(authConfig.storageLoginUserData)
    localStorage.removeItem(authConfig.storageTokenKeyName)
    localStorage.removeItem(authConfig.storageUId)
    localStorage.removeItem(authConfig.storageRoleName)
  }

  const handleLogout = () => {
    setUser(null)
    setLoading(false)
    window.localStorage.removeItem(authConfig.storageLoginUserData)
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.storageUId)
    window.localStorage.removeItem(authConfig.storageRoleName)
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
