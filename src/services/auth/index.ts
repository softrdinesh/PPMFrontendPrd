// ** API ,Redux Imports
import axios from 'axios'
import { useRouter } from 'next/navigation'

import toast from 'react-hot-toast'

import type { ApiResponse } from '@/types/api-response'

// ** API Imports
import { authentication } from './endpoint'

import { callApi } from '@api-utils'
import { routes } from '@/constants/routes'

type LoginBody = {
  email: string
  password: string
  latitude: number
  longitude: number
}
export const userLogin = async (body: LoginBody) => {
  return callApi({ uriEndPoint: authentication?.login, body, nextUrl: true })
    .then((res: ApiResponse) => {
      if (res.status) {
        localStorage.setItem('userData', JSON.stringify(res.data))
        toast.success(res.message ?? '')

        paymentcheck(res.data?.userID || res.data?.id)
Rolecheck(res.data?.userID || res.data?.id)
        return res
      } else {
        throw res
      }
    })
    .catch(err => {
      toast.error(err?.message)
      throw err
    })
}
const paymentcheck = async (userId: number) => {
  const Baseurl = process.env.NEXT_PUBLIC_API_URL1
  try {
    const res = await axios.post(`${Baseurl}/CheckAccountExpiry/${userId}`)
    
    if (res.data && res.data.length > 0) {
      const paymentData = {
       isExpired: res.data[0].isExpired,
       projectCount:res.data[0].projectCount,
       workspaceCount:res.data[0].workspaceCount,
       taskGroupCount:res.data[0].taskGroupCount,
       boardCount:res.data[0].boardCount,
       boardsectionCount:res.data[0].boardsectionCount,
       boardTaskCount:res.data[0].boardTaskCount,
       amount:res.data[0].amount
            //  isExpired: true
      }
      // localStorage.setItem('paymentStatus', JSON.stringify(paymentData))
            localStorage.setItem('paymentStatus', JSON.stringify(paymentData))


    }
  } catch (error) {
<<<<<<< HEAD
    console.error('Payment check error:', error)
=======
  //  console.error('Payment check error:', error)
>>>>>>> source-link/main
  }
}
const Rolecheck = async (userId: number) => {
  const Baseurl = process.env.NEXT_PUBLIC_API_URL1
  try {
    const res = await axios.get(`${Baseurl}/GetUserInfo?UserID=${userId}`)
    
   // if (res.data && res.data.length > 0) {
     if (res.data && res.data.length > 0) {
      const roledata = {
       userID: res.data[0].userID,
       name:res.data[0].name,
       email:res.data[0].email,
       profilepicture:res.data[0].profilepicture,
       roleID:res.data[0].roleID,
       rolename:res.data[0].rolename,
       organizationName:res.data[0].organizationName,
       amouorganizationIDnt:res.data[0].organizationID,
       organizationSize:res.data[0].organizationSize
            //  isExpired: true
      }



   
      // localStorage.setItem('paymentStatus', JSON.stringify(paymentData))
            localStorage.setItem('Role', JSON.stringify(roledata))


     }
  } catch (error) {
<<<<<<< HEAD
    console.error('Payment check error:', error)
=======
   // console.error('Payment check error:', error)
>>>>>>> source-link/main
  }
}



export const userRegister = async (body: any) => {
  return callApi({ uriEndPoint: authentication.register, body, nextUrl: true })
    .then(res => {
      if (res.statusCode === 201) {
    getUserInfoByEmail(res.data.email)

   localStorage.setItem('userData', JSON.stringify(res.data))
   
toast.success("User Registered Successfully!")
setTimeout(() => {
  window.location.href = routes.login
}, 3000);
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

const getUserInfoByEmail= async(email: any)=>{
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL1}/GetUserInfobyemail?Email=${email}` );

    const userId = response?.data?.[0]?.userID || response?.data?.[0]?.id
    Rolecheck(userId)
    paymentcheck(userId)

<<<<<<< HEAD
    console.log('User info:', response.data);
=======
    // console.log('User info:', response.data);
>>>>>>> source-link/main
    return response.data;

  } catch (error) {
   
    throw error; // re-throw if the caller needs to handle it too
  }
}
export const userLogout = (id: string) => {
  return callApi({
    uriEndPoint: authentication.logout,
    pathParams: { u_id: id },
    nextUrl: true
  })
    .then((res: ApiResponse) => {
      toast.success(res?.message)

      return res
    })
    .catch(err => {
      throw err
    })
}

export const verifyEmail = async (body: { email: string }): Promise<ApiResponse> => {
  return callApi({
    uriEndPoint: authentication.emailVerification,
    body
  })
    .then(res => {
      toast.success(res.message)

      return res
    })
    .catch(err => {
      toast.error(err.message)

      return err
    })
}

export const refreshToken = async (body: any) => {
  return axios({
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

export const clearCookies = async () => {
  return callApi({ uriEndPoint: authentication.clearCookies, nextUrl: true })
    .then((res: ApiResponse) => {
      return res
    })
    .catch(err => {
      return err
    })
}

export const verifyOtp = async (body: any): Promise<ApiResponse> => {
  return callApi({
    uriEndPoint: authentication.otpVerification,
    body
  })
    .then(res => {
      toast.success(res.message)

      return res
    })
    .catch(err => {
      toast.error(err.message)

      return err as ApiResponse
    })
}

export const resetPassword = async (body: any) => {
  return callApi({
    uriEndPoint: authentication.resetPassword,
    body
  })
    .then(res => {
      toast.success(res.message)

      return res
    })
    .catch(err => {
      throw err
    })
}
