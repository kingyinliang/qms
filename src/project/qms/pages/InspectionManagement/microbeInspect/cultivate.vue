<template>
  <commonPage
    type="CULTIVATE"
    :indexName="indexName"
    :taskInspectIdList="taskInspectIdList"
  />
</template>

<script>
import { defineComponent, onBeforeUnmount } from 'vue'
import commonPage from './commonPage'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'cultivate',
  components: {
    commonPage
  },
  setup () {
    const store = useStore()
    const indexName = store.state.inspection.microbeInspectCultivate.indexName || '菌落总数'
    const taskInspectIdList = store.state.inspection.microbeInspectCultivate.taskInspectIdList || []

    onBeforeUnmount(() => {
      store.commit('inspection/updateMicrobeInspectCultivate', {})
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
