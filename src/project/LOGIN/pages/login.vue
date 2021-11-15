<template>
  <SelectSystem ref="selectSystem" v-model="systemVisible"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import loginTs from './login'
import SelectSystem from '@/components/layout/select-system.vue'

export default defineComponent({
  name: 'login',
  components: {
    SelectSystem
  },
  created (): void {
    this.init()
  },
  setup () {
    const { init, systemVisible, selectSystem } = loginTs()

    return {
      init,
      systemVisible,
      selectSystem
    }
  }
})
</script>

<style scoped>

</style>
