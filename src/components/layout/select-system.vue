<template>
  <div v-if="modelValue" class="select_system">
    <em class="select_system--close el-icon-circle-close" @click="closeDialog"/>
    <div class="select_system_main">
      <div
        v-for="item in system"
        :key="item.id"
        class="select_system_item"
        @click="goSystem(item)"
      >
        <div class="select_system_item_main">
          <p class="select_system_item_main_title">{{ item.deptShort }}</p>
          <img v-if="item.deptCode === '9999-xn'" src="./img/factory7.png" alt="">
          <img v-else-if="item.deptCode === '8888-xn'" src="./img/factory8.png" alt="">
          <img v-else-if="item.deptCode === '6010'" src="./img/factory0.png" alt="">
          <img v-else-if="item.deptCode === '7100'" src="./img/factory1.png" alt="">
          <img v-else-if="item.deptCode === '7101'" src="./img/factory2.png" alt="">
          <img v-else-if="item.deptCode === '8500'" src="./img/factory3.png" alt="">
          <img v-else-if="item.deptCode === '8300'" src="./img/factory4.png" alt="">
          <img v-else src="./img/factory4.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  watch,
  toRefs,
  ref
} from 'vue'
import SSOLogin from '@/utils/SSOLogin'
import VueCookies from '@/components/cookie/vue-cookies'
// import { GET_TENANT_BY_USER_ID, UPDATE_TENANT } from '@/api/api'

export default defineComponent({
  name: 'select-system',
  props: {
    modelValue: Boolean
  },
  setup (props, { emit }) {
    // const ctx = getCurrentInstance()
    // const proxy = ctx.proxy

    const { modelValue } = toRefs(props)
    const system = ref([])

    const goSystem = (system) => {
      if (system.deptCode === '9999-xn') {
        window.location.href = `${process.env.VUE_APP_MSS_HOST}?clientId=${SSOLogin.option.clientId}&responseType=client&token=${VueCookies.get('token')}&tenant=QMS`
      } else {
        localStorage.setItem('vuex', '')
        sessionStorage.setItem('system', JSON.stringify(system || ''))
        window.location.href = '/qms'
      }
    }

    const closeDialog = () => {
      emit('update:modelValue', false)
    }

    watch(modelValue, (val) => {
      if (!val) {
        return
      }
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
      console.log(userInfo)
      system.value = userInfo.userFactory
      // GET_TENANT_BY_USER_ID({
      //   userId: userInfo.id
      // }).then((res) => {
      //   system.value = res.data.data
      // })
    })

    return {
      system,
      goSystem,
      closeDialog
    }
  }
})
</script>

<style lang="scss" scoped>
.select_system{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  background: url("~@/assets/img/layout/dialog_bg.png") no-repeat;
  background-size: 100% 100%;
  &--close{
    position: absolute;
    font-size: 32px;
    color: white;
    top: 30px;
    right: 30px;
    cursor: pointer;
  }
  &_main{
    width: 80%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  &_item {
    flex: 1;
    padding: 10px 30px;
    width: 310px;
    &_main{
      padding: 16px;
      width: 250px;
      border-radius: 8px;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.09);
      overflow: hidden;
      margin: auto;
      background: white;
      &_title{
        margin: 0 0 30px 0;
        font-weight: bold;
        font-size: 16px;
      }
      img{
        cursor: pointer;
        display: block;
        width: 150px;
        height: 103px;
        margin: auto;
      }
    }
  }
}
</style>
