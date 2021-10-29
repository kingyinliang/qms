import { AxiosResponse } from 'axios'
import Http from '../http/axios'

const baseURL = (process.env.VUE_APP_API_HOST as string) + '/df-quality-task' + (process.env.VUE_APP_API_V as string)

export function GET_SAMPLE_SAMPLING_TASK_LIST (params = {}):Promise<AxiosResponse> {
  return Http.get('/taskSample/queryUpcomingTaskSample', params, { baseURL })
}
export function SAMPLE_SAMPLING_TASK_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('/sample/sampling/taskAdd', params, { baseURL: '' })
}
export function SAMPLE_SAMPLING_TASK_LIST (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskSample/queryTaskSample', params, { baseURL })
}
export function SAMPLE_SAMPLING_TASK_HISTORY_LIST (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskSample/queryHistoryTaskSample', params, { baseURL })
}
export function SAMPLE_SAMPLING_TASK_ASSIST_UPDATE (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskSample/updateAssistTaskSample', params, { baseURL })
}
export function SAMPLE_SAMPLING_TASK_PROCESS_UPDATE (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskSample/updateProcessTaskSample', params, { baseURL })
}
export function SAMPLE_SAMPLING_TASK_DEL (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskSample/deleteTaskSample', params, { baseURL })
}
export function SAMPLE_SAMPLING_TASK_SAMPLING (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskSample/sampleTaskSample', params, { baseURL })
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
