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
import { userLogin, userRegister } from 'src/services/login'
import { routes } from '@routes'

// ** Defaults
const defaultProvider = {
  user: null,
  registrationData: null,
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
  const [registrationData, setRegistrationData] = useState(defaultProvider.registrationData)

  // ** Hooks
  const router = useRouter()

  const verifyToken = async storedToken => {
    try {
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
            setUser(responseData?.userData)
          })
          .catch(() => {
            setLoading(false)
            handleLogout()
          })
      } else {
        clearStorageAndValues()
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const googleLogin = async () => {
    console.log('HRE')
    try {
      setLoading(true)
      axios
        .get(process.env.NEXT_PUBLIC_API_URL + authentication.googleLoginSuccess.uri, {
          withCredentials: true
        })
        .then(res => {
          const responseValue = res?.data
          console.log('responseValue :', responseValue)
          if (responseValue?.status && responseValue.data?.isVerified) {
            localStorage.setItem(authConfig.storageLoginUserData, JSON.stringify(responseValue.data.userData))
            setUser(responseValue?.data?.userData)
            router.replace(routes.dashboard)
            setLoading(false)
          } else {
            setRegistrationData(responseValue.data.userData)
            router.replace(routes.register)
            setLoading(false)
          }
        })
        .catch(err => {
          console.log('err :', err)
          verifyToken()
        })
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    const isLoggedInWithGoogle = localStorage.getItem(authConfig.loginWithGoogle)
    console.log('isLoggedInWithGoogle :', isLoggedInWithGoogle)
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    if (isLoggedInWithGoogle && !storedToken) {
      googleLogin()
    } else {
      verifyToken(storedToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ** USER LOGIN
  const handleLogin = async (params, errorCallback) => {
    try {
      const res = await userLogin(params)
      let responseData = res?.data

      setUser(responseData)

      // ** redirection based on previous path
      const returnUrl = router.query.returnUrl
      const redirectURL = returnUrl && returnUrl !== routes.login ? returnUrl : '/dashboard'
      router.replace(redirectURL)

      return res
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Login Failed')
      if (errorCallback) errorCallback(err)
    }
  }

  // ** USER REGISTER
  const handleRegister = async (params, errorCallback) => {
    try {
      const res = await userRegister(params)
      let responseData = res?.data

      setUser(responseData?.userData)

      // ** redirection based on previous path
      const returnUrl = router.query.returnUrl
      const redirectURL = returnUrl && returnUrl !== routes.register ? returnUrl : '/dashboard'
      toast.success(res?.message ?? 'Registered Successfully')

      router.replace(redirectURL)

      return res
    } catch (err) {
      console.log('err :', err)
      toast.error(err?.response?.data?.message ?? 'Registeration Failed')
      if (errorCallback) errorCallback(err)
    }
  }

  // ** CLEARING CONTEXTS AND VALUES
  const clearStorageAndValues = async () => {
    setUser(null)
    setLoading(false)
    window.localStorage.removeItem(authConfig.loginWithGoogle)
    window.localStorage.removeItem(authConfig.storageLoginUserData)
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.storageUId)
  }

  const handleLogout = async () => {
    clearStorageAndValues()
    router.push(routes.login)
  }

  const values = {
    user,
    loading,
    registrationData,
    setUser,
    setLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
