import { AxiosResponse } from 'axios'
import Http from '../http/axios'

const baseURL = (process.env.VUE_APP_BFF_API as string) + (process.env.VUE_APP_API_V as string)

export function GET_SAMPLE_SAMPLING_TASK_LIST (params = {}):Promise<AxiosResponse> {
  return Http.get('/sample/sampling/task', params, { baseURL: '' })
}
export function SAMPLE_SAMPLING_TASK_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('/sample/sampling/taskAdd', params, { baseURL: '' })
}
export function SAMPLE_SAMPLING_TASK_LIST (params = {}):Promise<AxiosResponse> {
  return Http.post('/sample/sampling/list', params, { baseURL: '' })
}
export function SAMPLE_HANDOVER_QUERY (params = {}):Promise<AxiosResponse> {
  return Http.get('/taskSample/queryTaskSampleBySampleCode', params, { baseURL })
}
