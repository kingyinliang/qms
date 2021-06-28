<template>
  <tree-page
    :treeData="treeData"
    :treeProps="{ label: 'name' }"
  >
    <template #context--menu>
      <li style="color: red;">新增同级</li>
      <li>新增下级</li>
    </template>
  </tree-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'InspectionCategory',
  setup () {
    const treeData = ref([
      {
        id: 1,
        name: 'sb',
        children: [
          { id: 1, name: 'yyds' }
        ]
      }
    ])

    return {
      treeData
    }
  }
})
</script>

<style scoped>

</style>
