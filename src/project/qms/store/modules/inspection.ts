/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-18 17:59:50
 * @LastEditors: Telliex
 * @LastEditTime: 2021-12-03 08:38:38
 */
import { MutationTree } from 'vuex'

const state = {
  inspectionTask: [],
  microbeInspectTask: {}
}
const mutations: MutationTree<any> = {
  updateInspectionTask (state, inspectionTask):void {
    state.inspectionTask = inspectionTask
  },
  updateMicrobeInspectionTask (state, payload):void{
    state.microbeInspectTask = payload
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
