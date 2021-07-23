<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-08 11:25:52
 * @LastEditors: Telliex
 * @LastEditTime: 2021-07-23 14:36:28
-->
<template>
    <dialogDevice :dialogVisible="dialogVisible" :title="title" @on-confirm="onConfirm" @on-close="onClose">
      <template #default>
        <div class="filter-input">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          size="small"
          clearable
          style="margin-bottom:10px;">
          <template #suffix>
                <em class="el-input__icon el-icon-search" />
          </template>
        </el-input>
        </div>
        <div style="max-height: 53vh; overflow: auto;">
            <el-tree
                ref="materialInspectionTree"
                :data="treeData"
                :props="{ label: 'inspectTypeName',children:'children' }"
                node-key="id"
                highlight-current
                default-expand-all
                :filter-node-method="filterNode"
                show-checkbox
                @check-change="handleCheckedChoose"
            />
        </div>
      </template>
    </dialogDevice>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, reactive, toRefs } from 'vue'
import dialogDevice from '../../components/SHDialog.vue'

interface MaterialTreeData {
  id: string; // 主键
  parentId: string; // "上级类别":
  inspectTypeName: string; // 类别名称
}

interface Props {
    title: string
    dialogVisible: boolean
    treeData: MaterialTreeData[]
    treeCheckedKeysGroup: string[]
}
interface State {
    isDialogShow: boolean
    inspectCategoryList:string[]
    // filterText: string
}

export default defineComponent({
  name: 'MaterialInspectionEdit',
  components: {
    dialogDevice
  },
  emits: ['reset', 'inspectCategoryList', 'update:dialogVisible'],
  props: {
    title: {
      type: String,
      default: '弹框'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    treeCheckedKeysGroup: {
      type: Array,
      default: () => {
        return []
      }
    }

  },
  setup (props, context) {
    const state = reactive<State>({
      isDialogShow: false,
      inspectCategoryList: []
      // filterText: ''
    })
    const parent = { ...context }
    const { dialogVisible, treeCheckedKeysGroup } = toRefs(props as Props)
    const materialInspectionTree = ref()
    const filterText = ref('')

    const onConfirm = () => {
      parent.emit('update:dialogVisible', false)
      parent.emit('inspectCategoryList', state.inspectCategoryList)
    }

    const onClose = () => {
      filterText.value = ''
      state.inspectCategoryList = []
      parent.emit('update:dialogVisible', false)
      parent.emit('reset')
    }

    // 搜索
    // eslint-disable-next-line
    const filterNode = (value:string, data: any) => {
      if (!value) return true
      return data.inspectTypeName.indexOf(value) !== -1
    }

    const handleCheckedChoose = () => {
      state.inspectCategoryList = materialInspectionTree.value.getCheckedKeys(true)
    }

    onMounted(() => {
      //
    })

    watch(filterText, (val) => {
      materialInspectionTree.value.filter(val)
    })

    watch(
      dialogVisible,
      newValue => {
        state.isDialogShow = newValue
      },
      { immediate: true }
    )

    watch(
      treeCheckedKeysGroup,
      newValue => {
        if (newValue.length !== 0) {
          materialInspectionTree.value.setCheckedKeys(newValue)
        }
      },
      { immediate: true }
    )
    return {
      ...toRefs(state),
      materialInspectionTree,
      filterText,
      filterNode,
      handleCheckedChoose,
      onConfirm,
      onClose
    }
  }
})

</script>

<style scoped></style>
