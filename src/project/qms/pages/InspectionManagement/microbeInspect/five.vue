<template>
  <commonPage
    type="FIVETUBES"
    :indexName="indexName"
    :taskInspectIdList="taskInspectIdList"
  />
</template>

<script>
import { defineComponent, onBeforeUnmount } from 'vue'
import commonPage from './commonPage'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'five',
  components: {
    commonPage
  },
  setup () {
    const store = useStore()
    const indexName = store.state.inspection.microbeInspectFive.indexName || '菌落总数'
    const taskInspectIdList = store.state.inspection.microbeInspectFive.taskInspectIdList || []

    onBeforeUnmount(() => {
      store.commit('inspection/updateMicrobeInspectFive', {})
    })

    return {
      indexName,
      taskInspectIdList
    }
  }
})
</script>

<style scoped>

</style>
