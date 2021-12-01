/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-26 14:30:22
 * @LastEditors: Telliex
 * @LastEditTime: 2021-11-30 14:58:27
 */
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

// 检验管理-[微生物检验] 任务待办任务查询
export function TASK_INSPECT_MICROBE_TODO_LIST_QUERY (params = {}):Promise<AxiosResponse> {
  return Http.get('/taskInspect/queryMicrobeUpcomingTaskInspect', params, { baseURL })
}

// 检验管理-[微生物检验] 微生物检验任务查询
export function TASK_INSPECT_MICROBE_INSPECT_TASK_LIST_QUERY (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskInspect/queryMicrobeTaskInspect', params, { baseURL })
}
