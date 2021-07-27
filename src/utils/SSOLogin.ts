import SSOLogin from '@shinho-fe/ssologin'

export default new SSOLogin({
  NODE_ENV: process.env.NODE_ENV,
  host: process.env.VUE_APP_SYSTEM_API as string + process.env.VUE_APP_API_V as string,
  tenant: 'QMS',
  clientId: '9403a3886cb3450e9cd19ed719e3e381',
  clientSecret: '015a78406d73478ebac30f8d0a6948d7'
})
