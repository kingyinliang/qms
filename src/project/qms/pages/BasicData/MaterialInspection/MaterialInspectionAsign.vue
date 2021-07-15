<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-08 11:25:52
 * @LastEditors: Telliex
 * @LastEditTime: 2021-07-15 17:51:14
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
                :props="defaultProps"
                node-key="id"
                highlight-current
                default-expand-all
                :filter-node-method="filterNode"
                show-checkbox
                @check-change="handleCheckChange"
            />
        </div>
      </template>
    </dialogDevice>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, reactive, toRefs } from 'vue'
import dialogDevice from './SHDialog.vue'

interface Props {
    title: string
    dialogVisible: boolean
}
interface State {
    isDialogShow: boolean
    // filterText: string
}

export default defineComponent({
  name: 'MaterialInspectionAsign',
  components: {
    dialogDevice
  },
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
    const state = reactive<State>({
      isDialogShow: false
      // filterText: ''
    })
    const parent = { ...context }
    const { dialogVisible } = toRefs(props as Props)
    const materialInspectionTree = ref()
    const filterText = ref('')
    const treeData = ref([{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }])
    const defaultProps = ref({
      children: 'children',
      label: 'label'
    })

    const treeDataTemp = ref([{
      id: '2',
      parentId: '0',
      inspectTypeName: '外购'
    },
    {
      id: '3',
      parentId: '0',
      inspectTypeName: '制曲'
    },
    {
      id: '4',
      parentId: '0',
      inspectTypeName: '发酵'
    },
    {
      id: '5',
      parentId: '0',
      inspectTypeName: '杀菌'
    },
    {
      id: '1',
      parentId: '2',
      inspectTypeName: '大豆'
    },
    {
      id: '6',
      parentId: '2',
      inspectTypeName: '小麦'
    },
    {
      id: '7',
      parentId: '3',
      inspectTypeName: '煮豆1'
    },
    {
      id: '8',
      parentId: '3',
      inspectTypeName: '煮豆2'
    },
    {
      id: '9',
      parentId: '3',
      inspectTypeName: '煮豆3'
    },
    {
      id: '10',
      parentId: '4',
      inspectTypeName: '发酵汁1'
    },
    {
      id: '11',
      parentId: '4',
      inspectTypeName: '发酵汁2'
    }
    ])

    const onConfirm = () => {
      console.log('父组件打印:')
      // console.log('父组件打印:', value)
    }

    const onClose = () => {
      parent.emit('update:dialogVisible', false)
    }

    // 搜索
    // eslint-disable-next-line
    const filterNode = (value:string, data: any) => {
      console.log(data)
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }

    const handleCheckChange = () => {
      // console.log(data, checked, indeterminate)
      console.log(materialInspectionTree.value.getCheckedKeys())
    }

    onMounted(() => {
      //
    })

    watch(filterText, (val) => {
      console.log(val)
      materialInspectionTree.value.filter(val)
    })

    watch(
      dialogVisible,
      newValue => {
        state.isDialogShow = newValue
      },
      { immediate: true }
    )

    return {
      ...toRefs(state),
      materialInspectionTree,
      treeDataTemp,
      treeData,
      filterText,
      filterNode,
      handleCheckChange,
      onConfirm,
      onClose,
      defaultProps
    }
  }
})

</script>

<style scoped></style>
