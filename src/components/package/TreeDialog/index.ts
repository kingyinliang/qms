import { App } from 'vue'
import TreeDialog from './src/index.vue'

TreeDialog.install = function (app: App) {
  app.component(TreeDialog.name as string, TreeDialog)
}

export default TreeDialog
