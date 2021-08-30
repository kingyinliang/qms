<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-08 11:25:52
 * @LastEditors: Telliex
 * @LastEditTime: 2021-08-30 14:47:26
-->
<template>
  <el-dialog :title="title" v-model="isDialogShow" width="30%" @close="onClose">
    <slot name="default">
      <p>暂无内容</p>
    </slot>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" icon="el-icon-circle-close" @click="onClose">取 消</el-button>
        <el-button size="small" icon="el-icon-circle-check" type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, watch } from 'vue'

interface Props {
    title: string
    dialogVisible: boolean
}
interface State {
    isDialogShow: boolean
}
export default defineComponent({
  name: 'SHDialog',
  emits: ['on-close', 'on-confirm'],
  props: {
    title: {
      type: String,
      default: '弹框'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  setup (props, context) {
    const { dialogVisible } = toRefs(props as Props)
    const parent = { ...context }
    const state = reactive<State>({
      isDialogShow: dialogVisible.value
    })
    watch(
      dialogVisible,
      newValue => {
        state.isDialogShow = newValue
      },
      { immediate: true }
    )
    const onClose = () => {
      parent.emit('on-close')
    }
    const onConfirm = () => {
      parent.emit('on-confirm')
    }
    return {
      ...toRefs(state),
      onClose,
      onConfirm
    }
  }
})
</script>

<style scoped></style>
