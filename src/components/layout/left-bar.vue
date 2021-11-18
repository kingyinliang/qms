<template>
  <aside
    class="SystemLayout__sidebar sidebar--"
    :style="{width: sidebarFold? '64px' : '170px'}"
    @mouseenter="showMenu"
    @mouseleave="() => { showOrHide = false; closeMenu() }"
  >
<!--    <el-popover-->
<!--      popper-class="tenant"-->
<!--      placement="bottom"-->
<!--      trigger="click"-->
<!--    >-->
<!--      <div v-for="(item, index) in tenant" :key="index" class="tenant__item" :style='"background-image: url(" + item.backgroundImgUrl + ")"' @click="goTenant(item)">-->
<!--        <img :src="item.logoImgUrl" alt="">-->
<!--      </div>-->
<!--      <template #reference>-->
<!--        <div class="SystemLayout__sidebar__logo">-->
<!--          <img v-if="sidebarFold" class="SystemLayout__sidebar__logo&#45;&#45;small" src="~@/assets/img/layout/logoHead2.png" alt="logo" style="width: 28px">-->
<!--          <img v-else class="SystemLayout__sidebar__logo&#45;&#45;big" src="~@/assets/img/layout/logoHead1.png" alt="logo" >-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-popover>-->
    <div class="SystemLayout__sidebar__logo" @click="() => showOrHide = !showOrHide">
      <img v-if="sidebarFold" class="SystemLayout__sidebar__logo--small" src="~@/assets/img/layout/logoHead2.png" alt="logo" style="width: 28px">
      <img v-else class="SystemLayout__sidebar__logo--big" src="~@/assets/img/layout/logoHead1.png" alt="logo" >
    </div>
    <div v-if="showOrHide">
      <div v-for="(item, index) in tenant" :key="index" class="tenant__item">
        <img :src="item.logoImgUrl" alt="">
      </div>
    </div>
    <el-menu
      :class="{'SystemLayout__sidebar--flold': !sidebarFold}"
      :style="{width: sidebarFold? '64px' : '170px'}"
      :default-active="menuActiveName"
      :collapse="sidebarFold"
      :collapse-transition="false"
    >
      <el-menu-item
        index="home"
        @click="goHome"
      >
        <em class="iconfont factory-shouye" />
        <span>首页</span>
      </el-menu-item>
      <LeftSubMenu v-for="menu in menuList" :key="menu.id" :menu="menu" />
    </el-menu>
  </aside>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import LeftSubMenu from './left-sub-menu.vue'
import layoutTs from '@/components/layout/layoutTs'

export default defineComponent({
  name: 'LeftBar',
  components: {
    LeftSubMenu
  },
  props: {
    menuList: Array
  },
  setup () {
    const showOrHide = ref(false)
    const { menuActiveName, sidebarFold, goHome, showMenu, closeMenu, getTenant, tenant } = layoutTs()

    const goTenant = (item) => {
      window.location.href = item.redirectUri
    }
    onMounted(getTenant)

    return {
      tenant,
      showOrHide,
      menuActiveName,
      sidebarFold,
      goHome,
      showMenu,
      closeMenu,
      goTenant
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
