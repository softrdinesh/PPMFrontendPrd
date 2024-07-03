export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageLoginUserData: 'userData',
  storageTokenKeyName: 'accessToken',
  storageUId: 'login_id',
  storageRoleName: 'role',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
