import { AxiosResponse } from 'axios'
import Http from '../http/axios'

const baseURL = (process.env.VUE_APP_API_HOST as string) + '/df-quality-task' + (process.env.VUE_APP_API_V as string)

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
export function SAMPLE_HANDOVER_DELIVERY (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskSample/exchangeTaskSamplesService', params, { baseURL })
}
export function SAMPLE_HANDOVER_COLLECTION (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskSample/exchangeTaskSamplesReceive', params, { baseURL })
}
export function SAMPLE_STAY_QUERY (params = {}):Promise<AxiosResponse> {
  return Http.post('/sampleKeep/querySampleKeep', params, { baseURL })
}
export function SAMPLE_STAY_DETAIL_QUERY (params = {}):Promise<AxiosResponse> {
  return Http.get('/sampleHandle/querySampleHandle', params, { baseURL })
}
export function SAMPLE_STAY_DETAIL_UPDATE (params = {}):Promise<AxiosResponse> {
  return Http.post('/sampleHandle/updateSampleHandle', params, { baseURL })
}
export function SAMPLE_STAY_DETAIL_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('/sampleHandle/moveSampleHandle', params, { baseURL })
}
export function SAMPLE_STAY_DETAIL_DEL (params = {}):Promise<AxiosResponse> {
  return Http.get('/sampleHandle/deleteSampleHandle', params, { baseURL })
}
