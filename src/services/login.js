/* eslint-disable no-console */
import Axios from 'axios'
import { callApi } from '../utils/api-utils'
import { authentication } from '../utils/endpoints/authentication'
import { authConfig } from '@configs/auth'
import toast from 'react-hot-toast'

export const userLogin = async body => {
  return callApi({ uriEndPoint: authentication.login, body })
    .then(res => {
      if (res.statusCode === 200) {
        localStorage.setItem(authConfig.storageUId, res?.data?.userData?.UserID)
        localStorage.setItem(authConfig.storageLoginUserData, JSON.stringify(res.data))

        return res
      } else {
        delete res.data

        return res
      }
    })
    .catch(err => {
      throw err
    })
}

export const userRegister = async body => {
  return callApi({ uriEndPoint: authentication.register, body })
    .then(res => {
      if (res.statusCode === 201) {
        localStorage.setItem(authConfig.storageUId, res?.data?.userData?.UserID)
        localStorage.setItem(authConfig.storageLoginUserData, JSON.stringify(res.data))

        return res
      } else {
        delete res.data

        return res
      }
    })
    .catch(err => {
      throw err
    })
}

export const verifyToken = async () => {
  return callApi({ uriEndPoint: authentication.verifyToken })
    .then(res => {
      return res
    })
    .catch(err => {
      throw err
    })
}

export const refreshToken = async body => {
  return Axios({
    method: authentication.refreshToken.method,
    url: process.env.NEXT_PUBLIC_API_URL + authentication.refreshToken.uri,
    headers: {
      'Content-Type': 'application/json'
    },
    data: body
  })
    .then(res => {
      return res.data
    })
    .catch(err => {
      throw err
    })
}

export const permissionList = async () => {
  return callApi({ uriEndPoint: authentication.getPermissions })
    .then(res => {
      return res
    })
    .catch(err => {
      throw err
    })
}

export const verifyEmail = async body => {
  return callApi({
    uriEndPoint: authentication.emailVerification,
    body
  })
    .then(res => {
      toast.success(res.message)

      return res
    })
    .catch(err => toast.error(err.message))
}

export const resetPassword = async body => {
  return callApi({
    uriEndPoint: authentication.resetPassword,
    body
  })
    .then(res => {
      toast.success(res.message ?? translate('csFrontendResetPasswordSuccess'))

      return res
    })
    .catch(err => {
      throw err
    })
}

export const verifyOtp = async body => {
  return callApi({
    uriEndPoint: authentication.otpVerification,
    body
  })
    .then(res => {
      toast.success(res.message)

      return res
    })
    .catch(err => toast.error(err.message))
}
