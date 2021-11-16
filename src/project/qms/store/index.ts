import { createStore } from 'vuex'
import common from './modules/common'
import inspection from './modules/inspection'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default createStore({
  modules: {
    common,
    inspection
  },
  plugins: [vuexLocal.plugin]
})
