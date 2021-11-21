/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-08-09 13:43:49
 * @LastEditors: Telliex
 * @LastEditTime: 2021-11-23 19:12:25
 */
import { MutationTree } from 'vuex'

const state = {
  sidebarFold: true,
  menuActiveName: 'home',
  mainTabsActiveName: '',
  userInfo: {},
  menuList: [],
  dynamicMenuRoutes: [],
  mainTabs: [],
  inspectIndexMaterialId: '', // 版本管理页面跳转用 versionID
  planProcessVersion: '', // 计划配置页面跳转用 versionID
  planProcessVersionReadOnly: '', // 计划配置页面跳转用 versionID
  planFoodVersion: '', // 计划配置页面跳转用 versionID
  planFoodVersionReadOnly: '', // 计划配置页面跳转用 versionID
  instantInspectionTask: { // 临时检验任务页面跳转用 type and id
    type: '',
    id: ''
  },
  instantInspectionTaskObj: { // 临时检验任务页面跳转用 存 object
  },
  sampleObj: {}, // 理化检验任务-检验 obj   type
  sampleObjForView: {} // 理化检验任务-检验 obj   type
}
// eslint-disable-next-line
const mutations: MutationTree<any> = {
  updateSidebarFold (state, sidebarFold):void {
    state.sidebarFold = sidebarFold
  },
  updateMainTabsActiveName (state, mainTabsActiveName):void {
    state.mainTabsActiveName = mainTabsActiveName
  },
  updateUserInfo (state, userInfo):void {
    state.userInfo = userInfo
  },
  updateMenuList (state, menuList):void {
    state.menuList = menuList
  },
  updateMenuActiveName (state, menuActiveName):void {
    state.menuActiveName = menuActiveName
  },
  updateDynamicMenuRoutes (state, dynamicMenuRoutes):void {
    state.dynamicMenuRoutes = dynamicMenuRoutes
  },
  updateMainTabs (state, mainTabs):void {
    state.mainTabs = mainTabs
  },
  updateInspectIndexMaterialId (state, id):void {
    state.inspectIndexMaterialId = id
  },
  updatePlanProcessVersion (state, id):void {
    state.planProcessVersion = id
  },
  updatePlanProcessVersionReadOnly (state, id):void {
    state.planProcessVersionReadOnly = id
  },
  updatePlanFoodVersion (state, id):void {
    state.planFoodVersion = id
  },
  updatePlanFoodVersionReadOnly (state, id):void {
    state.planFoodVersionReadOnly = id
  },
  updateInstantInspectionTask (state, obj):void {
    state.instantInspectionTask.type = obj.type
    state.instantInspectionTask.id = obj.id
  },
  updateInstantInspectionTaskObj (state, obj):void {
    state.instantInspectionTaskObj = obj
  },
  updateSampleObjToInspect (state, obj):void {
    state.sampleObj = obj // type: '', obj: {}
  },
  updateSampleObjForView (state, obj):void {
    state.sampleObjForView = obj // type: '', obj: {}
  }

}

export default {
  namespaced: true,
  state,
  mutations
}
