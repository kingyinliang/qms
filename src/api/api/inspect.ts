import { AxiosResponse } from 'axios'
import Http from '../http/axios'

const baseURL = (process.env.VUE_APP_API_HOST as string) + '/df-quality-task' + (process.env.VUE_APP_API_V as string)

export function INSPECT_TASK_LIST (params = {}):Promise<AxiosResponse> {
  return Http.get('/taskInspect/queryUpcomingTaskInspect', params, { baseURL })
}
export function INSPECT_TASK_LIST_QUERY (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskInspect/queryTaskInspect', params, { baseURL })
}
export function INSPECT_TASK_RETENTION (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskSample/keepTaskSample', params, { baseURL })
}
export function INSPECT_TASK_HISTORY_LIST (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskInspect/queryHistoryTaskInspect', params, { baseURL })
}
