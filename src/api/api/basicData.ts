import { AxiosResponse } from 'axios'
import Http from '../http/axios'

const baseURL = (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string)

export function TIME_QUERY (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectCycle/queryInspectCycle', params, { baseURL })
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
