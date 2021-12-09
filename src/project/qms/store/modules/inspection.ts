import { MutationTree } from 'vuex'

const state = {
  inspectionTask: [],
  microbeInspectCount: {},
  microbeInspectCultivate: {},
  microbeInspectCultivateForm: {},
  microbeInspectFive: {},
  microbeInspectFiveForm: {},
  microbeInspectTask: {}
}
const mutations: MutationTree<any> = {
  updateInspectionTask (state, inspectionTask):void {
    state.inspectionTask = inspectionTask
  },
  updateMicrobeInspectionTask (state, payload):void{
    state.microbeInspectTask = payload
  },
  updateMicrobeInspectCount (state, payload):void{
    state.microbeInspectCount = payload
  },
  updateMicrobeInspectCultivate (state, payload):void{
    state.microbeInspectCultivate = payload
  },
  updateMicrobeInspectCultivateForm (state, payload):void{
    state.microbeInspectCultivateForm = payload
  },
  updateMicrobeInspectFive (state, payload):void{
    state.microbeInspectFive = payload
  },
  updateMicrobeInspectFiveForm (state, payload):void{
    state.microbeInspectFiveForm = payload
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
