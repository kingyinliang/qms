<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-08 11:25:52
 * @LastEditors: Telliex
 * @LastEditTime: 2021-11-20 15:59:22
-->
<template>
    <dialogDevice :dialogVisible="dialogVisible" :title="title" @on-confirm="onConfirm" @on-close="onClose" width="70%">
      <template #default>
        <div style="display:flex;">
          <div style="width: 26%;margin-right:15px">
            <el-card style="height: 303px; overflow-y: scroll;" class="property" shadow="never">
                <div class="property-title">
                    属性
                </div>
                <ul class="category">
                  <li :class="{'item-focus-status':currentIndex===index}" v-for="(item, index) in materialTreeData" :key="item">
                    <el-tooltip class="item" effect="dark" :content="item.inspectPropertyName" placement="top-end" :disabled="item.inspectPropertyName===''">
                      <el-button type="text" @click="clickGategoryToChangeData(item.inspectProperty,index)">{{item.inspectPropertyName}}</el-button>
                    </el-tooltip>
                  </li>
                </ul>
            </el-card>
          </div>
          <el-transfer
            ref="refTreeFrameworkData"
            v-model="treeValueSelected"
            filterable
            filter-placeholder="搜索指标"
            :titles="['未分配指标', '已分配指标']"
            :data="treeFrameworkData"
            class="transferWrap"
            @change="handleChange"
          >
            <template #default="{option}">
            <el-tooltip class="item" effect="dark" :content="option.label" placement="top-end" :disabled="option.label===''">
              <span>{{ option.label }}</span>
            </el-tooltip>
          </template>
          </el-transfer>
        </div>
      </template>
    </dialogDevice>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, reactive, toRefs, getCurrentInstance, ComponentInternalInstance } from 'vue'
import dialogDevice from '../../components/SHDialog.vue'
import { DICTIONARY_QUERY_API } from '@/api/api'

interface TreeData {
  id: string
  inspect: string
  inspectGroups: TreeData[]
  inspectIndexId: string
  inspectMethodId: string
  inspectProperty: string
  inspectPropertyName: string
  indexMethod: string
  indexName: string
  indexUnit: string
  indexCode: string
}
interface MainData {
  inspectGroups?: TreeData[]
  [propName:string]: any
}

interface TransferAreaData{
  key: string
  label: string
  disabled?:boolean
}

interface SelectedItem{
    indexMethod: string
    indexName: string
    indexUnit: string
    indexCode: string
    inspectProperty: string
    inspectIndexId: string
}
interface Props {
    title: string
    dialogVisible: boolean
    dialogData: TreeData[],
    disableItems: string[]
    // importData: SelectedItem[]
}

interface State {
    isDialogShow: boolean
    treeFrameworkData: TransferAreaData[]
    treeValueSelected: string[]
    materialTreeData: TreeData[]
    mainData: MainData
    currentIndex: number
    inspectPropertyOptions: any
}

export default defineComponent({
  name: 'MaterialInspectionAsign',
  components: {
    dialogDevice
  },
  emits: ['actReset', 'actConfirm', 'update:dialogVisible'],
  props: {
    title: {
      type: String,
      default: '弹框'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogData: {
      type: Array,
      default: () => {
        return []
      }
    },
    disableItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    importData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup (props, context) {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const state = reactive<State>({
      isDialogShow: false,
      treeFrameworkData: [],
      materialTreeData: [],
      mainData: {},
      treeValueSelected: [],
      currentIndex: 0,
      inspectPropertyOptions: {}
    })
    const parent = { ...context }
    const { dialogVisible, dialogData, disableItems } = toRefs(props as Props)
    const materialInspectionTree = ref()
    const refTreeFrameworkData = ref()

    const onConfirm = () => {
      if (state.treeValueSelected.length !== 0) {
        const selectedItems: SelectedItem[] = []
        state.materialTreeData.forEach(item => {
          item.inspectGroups.forEach(subItem => {
            state.treeValueSelected.forEach(element => {
              if (subItem.inspectIndexId === element) {
                // selectedItems.push({ id: element, name: subItem.inspect })
                selectedItems.push({
                  inspectIndexId: element,
                  indexMethod: subItem.indexMethod,
                  indexName: subItem.indexName,
                  indexUnit: subItem.indexUnit,
                  indexCode: subItem.indexCode,
                  inspectProperty: subItem.inspectProperty
                })
              }
            })
          })
        })
        parent.emit('actConfirm', selectedItems)
        parent.emit('update:dialogVisible', false)
      } else {
        proxy.$infoToast('请分配所需指标')
      }
    }

    const onClose = async () => {
      // await nextTick()
      // refTreeFrameworkData.value.clearQuery('left')
      state.treeFrameworkData = []
      parent.emit('actReset')
      parent.emit('update:dialogVisible', false)
    }

    const clickGategoryToChangeData = (val:string, index = 0) => {
      const tempTreeData:TreeData[] = state.mainData[val]
      state.currentIndex = index
      state.treeFrameworkData = []
      if (disableItems.value.length !== 0) {
        for (let i = 0; i < tempTreeData.length; i++) {
          let isDisabled = false
          disableItems.value.forEach(item => {
            if (item === tempTreeData[i].inspectIndexId) {
              isDisabled = true
            }
          })
          state.treeFrameworkData.push({
            key: tempTreeData[i].inspectIndexId,
            label: tempTreeData[i].inspect,
            disabled: isDisabled
          })
        }
      } else {
        for (let i = 0; i < tempTreeData.length; i++) {
          state.treeFrameworkData.push({
            key: tempTreeData[i].inspectIndexId,
            label: tempTreeData[i].inspect,
            disabled: false
          })
        }
      }
    }

    const handleChange = (value:any, direction:any, movedKeys:any) => {
      console.log(value, direction, movedKeys)
    }

    onMounted(async () => {
      // 检验属性下拉
      DICTIONARY_QUERY_API({ dictType: 'INSPECT_PROPERTY' }).then((res) => {
        res.data.data.forEach((item:any) => {
          state.inspectPropertyOptions[item.dictCode] = item.dictValue
        })
      })
    })

    watch(
      dialogVisible,
      newValue => {
        state.isDialogShow = newValue
      },
      { immediate: true }
    )

    watch(
      dialogData,
      newValue => {
        state.materialTreeData = newValue
        state.treeValueSelected = [] // 进页面 elected items init
        state.treeFrameworkData = [] // 进页面 data structure init

        state.materialTreeData.forEach((item:TreeData) => {
          item.inspectPropertyName = state.inspectPropertyOptions[item.inspectProperty]
          state.mainData[item.inspectProperty] = JSON.parse(JSON.stringify(item.inspectGroups))
        })
        // }

        if (state.materialTreeData.length >= 1) {
          clickGategoryToChangeData(state.materialTreeData[0].inspectProperty)
        }
      },
      { immediate: true }
    )

    return {
      ...toRefs(state),
      materialInspectionTree,
      onConfirm,
      onClose,
      clickGategoryToChangeData,
      refTreeFrameworkData,
      handleChange
    }
  }
})

</script>

<style lang="scss" scoped>
.category{
  list-style: none;
  padding: 10px ;
  li{
    margin-bottom: 3px;
    color: black;
    padding: 4px 10px;
  }
}

.property-title{
  height: 40px;
  line-height: 40px;
  background: #f5f7fa;
  margin: 0;
  padding-left: 15px;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-bottom: 10px;
  color: #000000;
  font-size: 16px;
}

.item-focus-status{
  background-color: #ecf5ff;

}

.transferWrap ::v-deep(.el-transfer-panel){
  width: 40%;
}

</style>
<style scoped>
.el-card.property ::v-deep(.el-card__body){
  padding: 0;
  font-size: 16px;
}

.el-button ::v-deep(span){
  color:#606266;
}
.el-button ::v-deep(span:hover){
  color:#487bff;
}
</style>
