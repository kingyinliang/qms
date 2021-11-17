import { MutationTree } from 'vuex'

const state = {
  inspectionTask: []
}
const mutations: MutationTree<any> = {
  updateInspectionTask (state, inspectionTask):void {
    state.inspectionTask = inspectionTask
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
