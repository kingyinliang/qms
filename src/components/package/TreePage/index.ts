import { App } from 'vue'
import TreePage from './src/index.vue'

TreePage.install = function (app: App) {
  app.component(TreePage.name as string, TreePage)
}

export default TreePage
