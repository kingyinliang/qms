/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-12 10:44:24
 * @LastEditors: Telliex
 * @LastEditTime: 2021-11-12 10:45:30
 */
import { App } from 'vue'
import MdsArea from './src/mds-area.vue'

MdsArea.install = function (app: App) {
  app.component(MdsArea.name as string, MdsArea)
}

export default MdsArea
