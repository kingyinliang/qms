import { AxiosResponse } from 'axios'
import Http from '../http/axios'

const baseURL = (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string)

export function TIME_QUERY (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectCycle/queryInspectCycle', params, { baseURL })
}
// 组织架构平铺数据
export function ORG_ALL (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysDept/dropDown', params)
}
export function TIME_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectCycle/insertInspectCycle', params, { baseURL })
}
export function TIME_UPDATE (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectCycle/updateInspectCycle', params, { baseURL })
}
export function TIME_DEL (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectCycle/deleteInspectCycle', params, { baseURL })
}
export function PHASE_QUERY (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectItem/queryInspectItem', params, { baseURL })
}
export function PHASE_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectItem/insertInspectItem', params, { baseURL })
}
export function PHASE_UPDATE (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectItem/updateInspectItem', params, { baseURL })
}
export function PHASE_DEL (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectItem/deleteInspectItem', params, { baseURL })
}
export function MATERIAL_DROPDOWN (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectMaterial/queryInspectMaterialDropDown', params, { baseURL })
}
export function POINT_QUERY (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectSite/queryInspectSite', params, { baseURL })
}
export function POINT_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectSite/insertInspectSite', params, { baseURL })
}
export function POINT_UPDATE (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectSite/updateInspectSite', params, { baseURL })
}
export function POINT_DEL (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectSite/deleteInspectSite', params, { baseURL })
}
