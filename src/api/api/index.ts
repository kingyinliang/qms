import { AxiosResponse } from 'axios'
import Http from '../http/axios'

export function TEST_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/mock/test', params, { baseURL: '' })
}
export function GET_NAV_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysUser/userRole/menuQuery', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function USER_QUIT_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysUser/quit', params)
}
export function ORG_TREE_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysDept/dropDown', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function INSPECT_TYPE_LIST_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectType/queryInspectType', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function INSPECT_TYPE_DETAIL_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectType/getInspectTypeById', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function INSPECT_TYPE_ADD_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectType/insertInspectType', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function INSPECT_TYPE_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectType/updateInspectType', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
