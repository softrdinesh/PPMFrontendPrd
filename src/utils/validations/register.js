import { pattern } from '@patterns'

export const registerRules = () => {
  return {
    defaultValues: {
      name: '',
      email: '',
      password: '',
      countryID: '',
      address: '',
      organizationName: '',
      organizationSize: ''
    },

    name: { required: { value: true, message: `Please enter your name` } },
    email: {
      required: { value: true, message: `Please enter your name` },
      pattern: { value: pattern.email, message: `Please enter a valid email` }
    },
    password: {
      required: { value: true, message: `Please enter a password` },
      pattern: {
        value: pattern.passwordPattern,
        message: `Password must contain atleast : 1 uppercase, 1 lowercase, 1 special character and 1 Number`
      },
      minLength: {
        value: 8,
        message: `Password must contain atleast 8 characters`
      }
    },
    countryID: { required: { value: true, message: `Please select your country` } },
    organizationName: { required: { value: true, message: `Please enter your organization name` } },
    organizationSize: { required: { value: true, message: `Please select your organization size` } }
  }
}
