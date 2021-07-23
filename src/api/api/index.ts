/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-08 09:53:20
 * @LastEditors: Telliex
 * @LastEditTime: 2021-07-22 18:14:36
 */
import { AxiosResponse } from 'axios'
import Http from '../http/axios'

export function GET_TENANT_BY_USER_ID (params = {}):Promise<AxiosResponse> {
  return Http.post('/mock/test', params, { baseURL: '' })
}

export function UPDATE_TENANT (params = {}):Promise<AxiosResponse> {
  return Http.post('/mock/test', params, { baseURL: '' })
}

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
  return Http.get('/sysDept/dropDown', params)
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
// 基础数据-物料分类 - 查询
export function INSPECT_MATERIAL_QUERY_SYS_MATERIAL_ITEM_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectMaterial/querySysMaterialItem', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-物料明细 - 查询
export function INSPECT_MATERIAL_QUERY_SYS_MATERIAL_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectMaterial/querySysMaterial', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-检验类别查询
export function INSPECT_TYPE_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectType/queryInspectType', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-物料明细 - 分配
export function INSPECT_MATERIAL_DISTRIBUTION_INSPECT_MATERIAL_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectMaterial/distributionInspectMaterial', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-类别组织查询
export function INSPECT_MATERIAL_INSPECT_TYPE_MATERIAL_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectType/queryInspectTypeMaterial', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-已分配物料明细查询
export function INSPECT_MATERIAL_INSPECT_MATERIAL_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectMaterial/queryInspectMaterial', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-已分配分配检验类别 - 查询
export function INSPECT_MATERIAL_CHECKED_INSPECT_TYPE_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectType/queryCheckedInspectType', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-物料明细 - 重新分配
export function INSPECT_MATERIAL_CHECKED_INSPECT_TYPE_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectMaterial/updateCheckedInspectMaterial', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
