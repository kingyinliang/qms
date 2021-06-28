import { App } from 'vue'
import CooperativeEditing from './src/cooperative-editing.vue'

CooperativeEditing.install = function (app: App) {
  app.component(CooperativeEditing.name as string, CooperativeEditing)
}

export default CooperativeEditing
