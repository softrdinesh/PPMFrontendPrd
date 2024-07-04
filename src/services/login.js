/* eslint-disable no-console */
import Axios from 'axios'
import { callApi } from '../utils/api-utils'
import { authentication } from '../utils/endpoints/authentication'
import { authConfig } from '@configs/auth'

export const userLogin = async body => {
  return callApi({ uriEndPoint: authentication.login, body })
    .then(res => {
      if (res.statusCode === 200) {
        localStorage.setItem(authConfig.storageTokenKeyName, res.data.token)
        localStorage.setItem(authConfig.storageUId, res?.data?.userData?.UserID)
        localStorage.setItem('userData', JSON.stringify(res.data))

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
