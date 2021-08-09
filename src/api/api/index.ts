import { AxiosResponse } from 'axios'
import Http from '../http/axios'

export interface Dict {
  dictCode: string;
  dictValue: string;
}

export function GET_TENANT_BY_USER_ID (params = {}):Promise<AxiosResponse> {
  return Http.post('/mock/test', params, { baseURL: '' })
}

export function UPDATE_TENANT (params = {}):Promise<AxiosResponse> {
  return Http.post('/mock/test', params, { baseURL: '' })
}

// 系统管理-文件上传
export function UPLOAD_FILE_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysFile/upload', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 系统管理-文件下载
export function DOWNLOAD_FILE_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysFile/download', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
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
  return Http.get('/sysDept/dropDown', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function DICT_DROPDOWN (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysDictItem/dropDown', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 数据字典根据类型获取详情
export function DICTIONARY_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysDictItem/dropDown', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}

export function INSPECT_TYPE_LIST_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectType/queryInspectType', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function INSPECT_TYPE_DETAIL_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectType/getInspectTypeById', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function INSPECT_TYPE_MATERIAL_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectMaterial/queryInspectMaterialByInspectTypeId', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function INSPECT_TYPE_ADD_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectType/insertInspectType', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function INSPECT_TYPE_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectType/updateInspectType', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function INSPECT_TYPE_DEL_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectType/removeInspectType', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function TEST_METHOD_LIST_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectMethod/queryInspectMethod', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function TEST_METHOD_ADD_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectMethod/insertInspectMethod', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function TEST_METHOD_DEL_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectMethod/removeInspectMethod', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function TEST_METHOD_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectMethod/updateInspectMethod', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
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

// 基础数据-检验指标库-查询
export function INSPECT_INDEX_LIBRARY_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectIndex/queryInspectIndex', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-检验指标编辑-查询
export function INSPECT_INDEX_LIBRARY_ITEM_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectIndex/queryInspectIndexMethodTree', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-通过id查询检验指标数据
export function INSPECT_INDEX_LIBRARY_ITEM_BY_ID_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectIndex/queryInspectIndexById', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-检验指标编辑-更新
export function INSPECT_INDEX_LIBRARY_ITEM_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndex/updateInspectIndex', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验指标标准]-类别组织数据 - 查询
export function INSPECT_INDEX_STANDARD_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectIndexMaterial/queryInspectIndexMaterial', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验指标标准]-物料指标数据 - 删除
export function INSPECT_INDEX_STANDARD_BATCH_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexMaterial/deleteInspectIndexMaterial', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验指标标准]-检验类及物料下拉数据查询
export function INSPECT_INDEX_MATERIAL_ASSIST_TYPE_DROPDOWN_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectType/queryInspectMaterialAndAssistType', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验指标标准]- 物料指标数据 - 新增
export function INSPECT_INDEX_MATERIAL_ITEM_ADD_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexMaterial/insertInspectIndexMaterial', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验指标标准]- 物料指标数据 - 编辑
export function INSPECT_INDEX_MATERIAL_ITEM_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexMaterial/updateInspectIndexMaterial', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验指标标准]- 指标库按属性 - 查询
export function INSPECT_INDEX_MATERIAL_BY_CATEGORY_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectIndex/queryInspectIndexTree', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验指标标准]- 指标下拉查询
export function INSPECT_INDEX_DROPDOWN_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectIndex/queryInspectIndexDropDown', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标版本管理]- 查询
export function INSPECT_INDEX_VERSION_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectIndexVersion/queryInspectIndexVersion', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标版本管理]- 新增
export function INSPECT_INDEX_VERSION_ADD_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexVersion/insertInspectIndexVersion', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标版本管理]- 删除
export function INSPECT_INDEX_VERSION_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexVersion/deleteInspectIndexVersion', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标版本管理][标准值明细]- 查询
export function INSPECT_INDEX_VERSION_VALUE_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectIndexStandard/queryInspectIndexStandard', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标版本管理][标准值明细]- 新增
export function INSPECT_INDEX_VERSION_VALUE_ADD_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexStandard/insertInspectIndexStandard', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标版本管理][标准值明细]- 删除
export function INSPECT_INDEX_VERSION_VALUE_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectIndexStandard/deleteInspectIndexStandard', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标版本管理][标准值明细]- 编辑
export function INSPECT_INDEX_VERSION_VALUE_EDIT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexStandard/updateInspectIndexStandard', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标版本管理][标准值明细]- 编辑+新增
export function INSPECT_INDEX_VERSION_VALUE_MODIFY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexStandard/modifyInspectIndexStandard', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}
