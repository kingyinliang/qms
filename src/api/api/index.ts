import { AxiosResponse } from 'axios'
import Http from '../http/axios'

export * from './basicData'

export * from './sample'

export * from './inspect'

export interface Dict {
  dictCode: string;
  dictValue: string;
}

export function GET_TENANT_BY_USER_ID (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysTenant/queryUserTenant', params, {
    baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string)
  })
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
// 组织架构-按工厂和类型查询组织机构
export function DEPT_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysDept/getTypeDept', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function DICT_DROPDOWN (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysDictItem/dropDown', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function GET_WORKSHOP (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysDept/queryWorkShopById', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function GET_HOLDER (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysHolder/list/query', params, { baseURL: (process.env.VUE_APP_API_HOST as string) + '/df-data' + (process.env.VUE_APP_API_V as string) })
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

// 基础数据-[检验指标标准]- 物料指标数据 - 复制
export function INSPECT_INDEX_MATERIAL_ITEM_COPY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexMaterial/copyInspectIndexMaterial', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验指标标准]- 物料指标数据 - 复制项下拉
export function INSPECT_INDEX_MATERIAL_ITEM_COPY_DROPDOWN_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectIndexMaterial/queryInspectIndexMaterialCodeDropDown', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
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

// 基础数据-[指标版本管理]- 编辑
export function INSPECT_INDEX_VERSION_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexVersion/updateInspectIndexVersion', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
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

// 基础数据-[指标检验方法明细][Tree]- 查询
export function INSPECT_INDEX_METHOD_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectIndex/queryInspectIndexMethodTree', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][Tree]- 新增
export function INSPECT_INDEX_METHOD_ADD_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexMethod/insertInspectIndexMethod', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][Tree]- 删除
export function INSPECT_INDEX_METHOD_REMOVE_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectIndexMethod/removeInspectIndexMethod', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][Tree]- 编辑
export function INSPECT_INDEX_METHOD_EDIT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexMethod/updateInspectIndexMethod', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][Tree]- 下拉查询
export function INSPECT_INDEX_METHOD_DROPDOWN_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectMethod/queryInspectMethodByPropertyOrId', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][参数组]- 查询
export function INSPECT_INDEX_PARAMETER_GROUP_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectParameterGroup/queryInspectParameterGroup', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][参数组]- 删除
export function INSPECT_INDEX_PARAMETER_GROUP_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectParameterGroup/deleteInspectParameterGroup', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][参数组]- 新增
export function INSPECT_INDEX_PARAMETER_GROUP_INSERT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectParameterGroup/insertInspectParameterGroup', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][参数组]- 编辑
export function INSPECT_INDEX_PARAMETER_GROUP_EDIT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectParameterGroup/updateInspectParameterGroup', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][过程参数]- 新增&编辑
export function INSPECT_INDEX_PARAMETER_RELATIVE_ITEM_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectType/queryInspectTypeMaterialAll', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][过程参数]- 查询
export function INSPECT_INDEX_PROCESS_PARAMETER_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectParameter/queryInspectParameter', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][过程参数]- 删除
export function INSPECT_INDEX_PROCESS_PARAMETER_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectParameter/deleteInspectParameter', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][过程参数]- 新增&编辑
export function INSPECT_INDEX_PROCESS_PARAMETER_MODIFY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectParameter/modifyInspectParameter', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][过程参数]- 过程参数下拉
export function INSPECT_INDEX_PROCESS_PARAMETER_DROPDOWN_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectParameterManage/queryInspectParameterManageDropDown', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][过程参数]- 查询过程参数数据
export function INSPECT_INDEX_PROCESS_PARAMETER_QUERY_FOR_TASK_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectParameter/queryInspectParameterTask', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][过程参数]- 检验编辑
export function INSPECT_INDEX_PROCESS_PARAMETER_UPDATE_FOR_TASK_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectParameter/updateInspectParameter', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][关联参数]- 查詢
export function INSPECT_INDEX_RELATED_PARAMETER_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectAssociate/queryInspectAssociate', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][关联参数]- 新增
export function INSPECT_INDEX_RELATED_PARAMETER_INSERT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectAssociate/insertInspectAssociate', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][关联参数]- 编辑
export function INSPECT_INDEX_RELATED_PARAMETER_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectAssociate/modifyInspectAssociate', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[指标检验方法明细][关联参数]- 删除
export function INSPECT_INDEX_RELATED_PARAMETER_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectAssociate/deleteInspectAssociate', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[过程参数管理]- 查询
export function INSPECT_PROCESS_PARAMETER_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectParameterManage/queryInspectParameterManage', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[过程参数管理]- 新增
export function INSPECT_PROCESS_PARAMETER_INSERT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectParameterManage/insertInspectParameterManage', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[过程参数管理]- 删除
export function INSPECT_PROCESS_PARAMETER_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectParameterManage/deleteInspectParameterManage', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[过程参数管理]- 编辑
export function INSPECT_PROCESS_PARAMETER_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectParameterManage/updateInspectParameterManage', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验频次]- 查询
export function INSPECT_INSPECT_FREQUENCY_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectFrequency/queryInspectFrequency', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验频次]- 新增
export function INSPECT_INSPECT_FREQUENCY_INSERT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectFrequency/insertInspectFrequency', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验频次]- 下拉
export function INSPECT_INSPECT_FREQUENCY_QUERY_DROPDOWN_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectFrequency/queryInspectFrequencyDropDown', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验频次]- 编辑
export function INSPECT_INSPECT_FREQUENCY_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectFrequency/updateInspectFrequency', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验频次]- 删除
export function INSPECT_INSPECT_FREQUENCY_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectFrequency/deleteInspectFrequency', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验频次附加项]- 查询
export function INSPECT_INSPECT_ADDITION_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectAdditional/queryInspectAdditional', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验频次附加项]- 查询 下拉
export function INSPECT_INSPECT_ADDITION_QUERY_DROPDOWN_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectAdditional/queryInspectAdditionalDropDown', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验频次附加项]- 新增
export function INSPECT_INSPECT_ADDITION_INSERT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectAdditional/insertInspectAdditional', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验频次附加项]- 编辑
export function INSPECT_INSPECT_ADDITION_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectAdditional/updateInspectAdditional', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验频次附加项]- 删除
export function INSPECT_INSPECT_ADDITION_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectAdditional/deleteInspectAdditional', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 基础数据-[检验时间单位]- 查询 下拉
export function INSPECT_CYCLE_QUERY_DROPDOWN_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectCycle/queryInspectCycleDropDown', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 计划管理-[检验计划]- 查询
export function MANAGEMENT_INSPECTION_PLAN_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/planVersion/queryPlanVersion', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 计划管理-[检验计划]- 新增
export function MANAGEMENT_INSPECTION_PLAN_INSERT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/planVersion/insertPlanVersion', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 计划管理-[检验计划]- 编辑
export function MANAGEMENT_INSPECTION_PLAN_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/planVersion/updatePlanVersion', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 计划管理-[检验计划]- 删除
export function MANAGEMENT_INSPECTION_PLAN_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/planVersion/deletePlanVersion', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[过程检验任务]- 检验计划-下拉 获取版本
export function MANAGEMENT_INSPECTION_PLAN_VERSION_DROP_DOWN_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/planVersion/queryPlanVersionDropDown', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 计划管理-[检验计划配置]- 查询
export function MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/planConfigure/queryPlanConfigure', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 计划管理-[检验计划配置]- 新增
export function MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_INSERT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/planConfigure/insertPlanConfigure', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 计划管理-[检验计划配置]- 编辑
export function MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/planConfigure/updatePlanConfigure', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 计划管理-[检验计划配置]- 批次编辑
export function MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_BATCH_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/planConfigure/updatePlanConfigures', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 计划管理-[检验计划配置]- 删除
export function MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/planConfigure/deletePlanConfigure', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 计划管理-[检验计划配置]- 生成
export function MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_GENERATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/planConfigure/generatePlanConfigure', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 计划管理-[检验计划配置]- 物料指标数据-下拉
export function MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_INDEX_MATERIAL_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/inspectIndexMaterial/queryInspectIndexMaterialDropDown', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 计划管理-[检验计划配置]- 检验计划配置-检验类信息查询
export function MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_INDEX_RELATION_TYPE_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/planConfigure/queryPlanConfigureRelationType', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[过程检验任务]- 该版本下的取样部门下拉
export function MANAGEMENT_PROCESS_INSPECTION_TASK_SAMPLE_DEPARTMENT_DROP_DOWN_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/planConfigure/queryPlanConfigureDept', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[过程检验任务]- 过程检验任务-查询
export function MANAGEMENT_PROCESS_INSPECTION_TASK_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskManage/queryTaskManage ', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[过程检验任务]- 过程检验任务 取样单位下拉
export function MANAGEMENT_PROCESS_INSPECTION_TASK_INSPECT_MATERIAL_DROP_DOWN_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectType/getInspectTypeByInspectMaterialId', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[过程检验任务]- 过程检验任务-编辑
export function MANAGEMENT_PROCESS_INSPECTION_TASK_UPDATE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskSample/updateTaskSample', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[过程检验任务]- 过程检验任务-取消
export function MANAGEMENT_PROCESS_INSPECTION_TASK_CANCEL_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/taskManage/cancelTaskManage', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[临时检验任务]- 临时检验任务-查询
export function MANAGEMENT_PROCESS_INSPECTION_TASK_STATUS_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskTempApply/queryTaskTempApply', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[临时检验任务]- 临时检验任务-删除
export function MANAGEMENT_PROCESS_INSPECTION_TASK_STATUS_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/taskTempApply/deleteTaskTempApply', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[临时检验任务]- 临时检验任务-下拉
export function MANAGEMENT_PROCESS_INSPECTION_TASK_METHOD_DROPDOWN_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/inspectMethod/queryInspectMethodDropDown', params, { baseURL: (process.env.VUE_APP_QMS_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[临时检验任务]- [新增][编辑]- 保存
export function MANAGEMENT_PROCESS_INSPECTION_TASK_ADD_AND_EDIT_SAVE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskTempApply/modifyTaskTempApply', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[临时检验任务]- [新增][编辑]- 提交
export function MANAGEMENT_PROCESS_INSPECTION_TASK_ADD_AND_EDIT_SUBMIT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskTempApply/saveSubmitTaskTempApply', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[临时检验任务]- [分配]- 查询
export function MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/taskTempIndex/queryTaskTempIndex', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[临时检验任务]- [分配]- 提交
export function MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_SUBMIT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskTempApply/distributeSubmitTaskTempApply', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[临时检验任务]- [分配]- 保存
export function MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_SAVE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskTempIndex/modifyTaskTempIndex', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 任务管理-[临时检验任务]- [分配]- 删除
export function MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_DELETE_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/taskTempIndex/deleteTaskTempIndex', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 检验管理-[检验任务]- 检验表单查询
export function MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_FORM_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskInspect/formTaskInspect', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 检验管理-[检验任务]- 检验表单查询
export function MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_HISTORY_TASK_FORM_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskInspect/queryHistoryFormTaskInspect', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 检验管理-[检验任务]- 根据样品码查询检验任务
export function MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_QUERY_BY_SAMPLE_CODE_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskInspect/queryTaskInspectBySampleCode', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 检验管理-[检验任务]- 检验检验保存
export function MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_RECHECK_TASK_INSPECT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskInspect/recheckTaskInspect', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 检验管理-[检验任务]- 理化检验保存x
export function MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_MODIFY_INSPECT_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskInspectIndex/modifyTnspectIndex', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 检验管理-[检验任务]- 检验指标查询
export function MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_INSPECT_QUERY_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskInspectIndex/queryTaskInspectIndex', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// 检验管理-[检验任务]- 分析是否有合并检
export function MANAGEMENT_INSPECTION_TASK_INSPECT_QUERY_BY_ID_API (params = {}):Promise<AxiosResponse> {
  return Http.post('/taskInspect/queryTaskInspectByIds', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
}

// // 检验管理-[检验任务]- 分析
// export function MANAGEMENT_INSPECTION_TASK_INSPECT_INDEX_QUERY_API (params = {}):Promise<AxiosResponse> {
//   return Http.post('/taskInspectIndex/queryTaskInspectIndex', params, { baseURL: (process.env.VUE_APP_QMS_TASK_API as string) + (process.env.VUE_APP_API_V as string) })
// }
