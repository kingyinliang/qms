<template>
  <nav class="SystemLayout__header">
    <div class="SystemLayout__header__item" style="position: absolute;left: 10px" @click="sidebarFold = !sidebarFold">
      <em class="iconfont factory-shouqicaidan switching" :class="{ open: sidebarFold, packup: !sidebarFold }" style="font-size: 25px;" />
    </div>
    <!--    消息    -->
<!--    <div class="SystemLayout__header__item">-->
<!--      <el-badge class="SystemLayout__header__badge" :value="messageNum" :max="99" type="danger" :hidden="messageNum === 0">-->
<!--        <em class="iconfont factory-bell" style="font-size: 18px;color: #00a2d4;" />-->
<!--      </el-badge>-->
<!--    </div>-->
    <!--    个人信息下拉    -->
    <el-dropdown>
      <div class="SystemLayout__header__item">
        <img v-if="userInfo.sex === 'M'" src="~@/assets/img/layout/avatarM.png" :alt="userInfo.userName" style="float: left">
        <img v-else src="~@/assets/img/layout/avatarF.png" :alt="userInfo.userName" style="">
        {{ `${userInfo.realName || ''}(${userInfo.userName || ''})` }}
      </div>
      <template #dropdown>
        <el-dropdown-menu>
<!--          <el-dropdown-item >-->
<!--            修改密码-->
<!--          </el-dropdown-item>-->
          <el-dropdown-item @click="quit">
            退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!--    分割线     -->
    <div class="SystemLayout__header__item--line"/>
    <!--    工厂      -->
    <div class="SystemLayout__header__item" style="color: #00a2d4;" @click="systemVisible = true"><em class="iconfont factory-gongchang" style="margin-right: 5px;" />{{ systemName }}</div>
    <!--    分割线    -->
    <div class="SystemLayout__header__item--line"/>
    <!--    设置      -->
    <div class="SystemLayout__header__item" style="color: #00a2d4;" @click="system = true">
      <em class="iconfont factory-shezhi" />
    </div>
  </nav>
  <el-dialog v-model="system" title="修改主题">
    <System />
  </el-dialog>
  <SelectSystem v-model="systemVisible"/>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import layoutTs from '@/components/layout/layoutTs'
import SelectSystem from '@/components/layout/select-system.vue'
import System from '@/components/layout/system.vue'

export default defineComponent({
  name: 'TopBar',
  components: {
    System,
    SelectSystem
  },
  props: {
    userInfo: Object
  },
  setup () {
    const { router, sidebarFold, quit, systemVisible } = layoutTs()
    const system = ref(false)
    const systemName = ref('')
    onMounted(() => {
      systemName.value = JSON.parse(sessionStorage.getItem('system') || '{}').deptShort || ''
      if (!JSON.parse(sessionStorage.getItem('system') || '{}').deptShort) {
        systemVisible.value = true
      }
    })

    return {
      system,
      systemVisible,
      quit,
      router,
      sidebarFold,
      systemName
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
