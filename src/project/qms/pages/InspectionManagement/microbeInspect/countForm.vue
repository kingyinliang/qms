<template>
  <commonDialog
    ref="dialogRef"
    type="CALCULATE"
    :preview="true"
  />
</template>

<script>
import { defineComponent, ref, reactive, toRefs, onMounted } from 'vue'
import { MICROBE_INSPECT_COUNT_DIALOG_QUERY } from '@/api/api'
import { useStore } from 'vuex'
import commonDialog from './commonDialog'

export default defineComponent({
  name: 'countForm',
  components: {
    commonDialog
  },
  setup () {
    const store = useStore()
    const componentData = reactive({
      dialogRef: ref()
    })

    onMounted(async () => {
      const row = store.state.inspection.microbeInspectCultivateForm
      const { data } = await MICROBE_INSPECT_COUNT_DIALOG_QUERY([row.id])
      componentData.dialogRef.init(data.data[0], row)
    })

    return {
      ...toRefs(componentData)
    }
  }
})
</script>

<style scoped>

</style>
