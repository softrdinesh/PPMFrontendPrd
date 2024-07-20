/* eslint-disable no-console */
/**
 * Utility methods to be used for invoking API methods
 */

import Axios from 'axios'
import queryString from 'querystring'
import { refreshToken } from 'src/services/login'

// ** Moment
import moment from 'moment'
import { authConfig } from '@configs/auth'
import { routes } from '@routes'

const showLogs = false

const checkTokenExpired = async () => {
  let userData = localStorage.getItem(authConfig.storageLoginUserData)
  let loginData = JSON.parse(userData)
  let date = moment().toDate()

  if (loginData.tokenTime > date.getTime() / 1000) {
    return loginData?.token
  } else if (loginData.refreshTokenTime > date.getTime() / 1000) {
    const newRefreshToken = await refreshToken({ refresh_token: loginData.refreshToken })
    localStorage.setItem(authConfig.storageLoginUserData, JSON.stringify(newRefreshToken.data))
    localStorage.setItem(authConfig.storageUId, newRefreshToken.data.u_id)

    return newRefreshToken.data.token
  } else {
    localStorage.removeItem(authConfig.storageLoginUserData)
    localStorage.removeItem(authConfig.storageUId)
    window.location.href = routes.login

    return null
  }
}

export const getDefaultHeaders = async () => {
  let userData = localStorage.getItem(authConfig.storageLoginUserData)
  let loginData = JSON.parse(userData)
  if (loginData) {
    return {
      Authorization: 'Bearer ' + (await checkTokenExpired()),
      'Content-Type': 'application/json',
      'Origin-api': window.location.origin
    }
  } else {
    return { 'Content-Type': 'application/json', 'Origin-api': window.location.origin }
  }
}

export const makeUrl = ({ uri = '', pathParams, query }, host) => {
  return `${host || `${process.env.NEXT_PUBLIC_API_URL}`}${uri
    .split('/')
    .map(param => (param.charAt(0) === ':' ? encodeURI(pathParams[param.slice(1)]) : param))
    .join('/')}${query ? `?${queryString.stringify(query)}` : ''}`
}

const callAxios = async ({ uriEndPoint, pathParams, query, body, apiHostUrl }) => {
  showLogs &&
    console.log('Call AXIOS ==>', {
      method: uriEndPoint.method,
      url: makeUrl({ ...uriEndPoint, pathParams, query }, apiHostUrl),
      headers: {
        ...(await getDefaultHeaders()),
        ...uriEndPoint.headerProps
      },
      data: body || {}
    })

  return Axios({
    method: uriEndPoint.method,
    url: makeUrl({ ...uriEndPoint, pathParams, query }, apiHostUrl),
    headers: {
      ...(await getDefaultHeaders()),
      ...uriEndPoint.headerProps
    },
    data: body || {}
  })
}

export const callApi = props => {
  const { uriEndPoint = { uri: '', method: '', headerProps: {} }, pathParams, query, body, apiHostUrl } = props

  return new Promise((resolve, reject) => {
    callAxios({
      uriEndPoint,
      pathParams,
      query,
      body,
      apiHostUrl
    })
      .then(response => {
        showLogs && console.log('callApi RES ==>', response.data)
        resolve(response.data)
      })
      .catch(err => {
        showLogs && console.log('callApi ERR ==>', err)
        reject(err.response?.data ?? err)
      })
  })
}
