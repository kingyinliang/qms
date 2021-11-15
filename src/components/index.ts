import { App } from 'vue'
import MdsCard from './package/mds-card'
import TableTreeColumn from './package/TableTreeColumn'
import OrgView from './package/OrgView'
import TreePage from './package/TreePage'
import TreeDialog from './package/TreeDialog'
import CooperativeEditing from './package/CooperativeEditing'

import { ElNotification } from 'element-plus'
import { isAuth } from '@/utils'

const components = [
  MdsCard,
  TableTreeColumn,
  OrgView,
  TreePage,
  TreeDialog,
  CooperativeEditing
]

const install = function (app: App):void {
  app.config.globalProperties.isAuth = isAuth
  app.config.globalProperties.$warningToast = (str:string) => {
    ElNotification({ title: '警告', message: str, type: 'warning' })
  }
  app.config.globalProperties.$errorToast = (str:string) => {
    ElNotification({ title: '错误', message: str, type: 'error', duration: 0 })
  }
  app.config.globalProperties.$successToast = (str:string) => {
    ElNotification({ title: '成功', message: str, type: 'success' })
  }
  app.config.globalProperties.$infoToast = (str:string) => {
    ElNotification({ title: '提示', message: str, type: 'info' })
  }

  components.forEach(component => {
    app.component(component.name as string, component)
  })
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    isAuth: (ctx: string) => boolean,
    $warningToast: (ctx: string) => void
    $errorToast: (ctx: string) => void
    $successToast: (ctx: string) => void
    $infoToast: (ctx: string) => void
  }
}
export default {
  install,
  MdsCard,
  TableTreeColumn,
  OrgView,
  TreePage,
  CooperativeEditing
}
