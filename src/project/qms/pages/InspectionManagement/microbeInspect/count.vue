<template>
  <commonPage
    type="CALCULATE"
    :indexName="indexName"
    :taskInspectIdList="taskInspectIdList"
  />
</template>

<script>
import { defineComponent, onBeforeUnmount } from 'vue'
import commonPage from './commonPage'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'count',
  components: {
    commonPage
  },
  setup () {
    const store = useStore()
    const indexName = store.state.inspection.microbeInspectCount.indexName || '菌落总数'
    const taskInspectIdList = store.state.inspection.microbeInspectCount.taskInspectIdList || []

    onBeforeUnmount(() => {
      store.commit('inspection/updateMicrobeInspectCount', {})
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
