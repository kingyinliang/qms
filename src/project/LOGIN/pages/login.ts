import { ref, Ref } from 'vue'
import SSOLogin from '@/utils/SSOLogin'

interface LoginTs {
  systemVisible: Ref
  selectSystem: Ref
  init: () => void
}
export default function (): LoginTs {
  const systemVisible = ref(false)
  const selectSystem = ref()
  const init = () => {
    SSOLogin.getUserInfo().then(({ data }) => {
      sessionStorage.setItem('userInfo', JSON.stringify(data.data || {}))
      if (data.data.defaultFactory && data.data.userFactory.filter((item: any) => item.deptCode === data.data.defaultFactory).length) {
        const dfFa = data.data.userFactory.filter((item: any) => item.deptCode === data.data.defaultFactory)[0]
        selectSystem.value.goSystem(dfFa)
      } else {
        systemVisible.value = true
      }
    })
  }

  return {
    init,
    selectSystem,
    systemVisible
  }
}
