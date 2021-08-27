<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-08 11:25:52
 * @LastEditors: Telliex
 * @LastEditTime: 2021-08-27 18:21:02
-->
<template>
    <dialogDevice :dialogVisible="dialogVisible" :title="title" @on-confirm="onConfirm" @on-close="onClose" width="70%">
      <template #default>
        <div style="display:flex;">
          <div style="width: 250px;margin-right:15px">
            <el-card style="height: 303px; overflow-y: scroll;" class="property" shadow="never">
                <div class="property-title">
                    属性
                </div>
                <ul class="category">
                  <li :class="{'item-focus-status':currentIndex===index}" v-for="(item, index) in materialTreeData" v-bind:key="item"><el-button type="text" @click="clickGategoryToChangeData(item.inspectProperty,index)">{{item.inspectPropertyName}}</el-button></li>
                </ul>
            </el-card>
          </div>
          <el-transfer
            v-model="treeValueSelected"
            filterable
            :titles="['未分配指标', '已分配指标']"
            filter-placeholder="搜索指标"
            :data="treeFrameworkData"
          />
        </div>
      </template>
    </dialogDevice>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, reactive, toRefs, getCurrentInstance, ComponentInternalInstance } from 'vue'
import dialogDevice from '../../components/SHDialog.vue'

interface TreeData {
  id: string
  inspect: string
  inspectGroups: TreeData[]
  inspectIndexId: string
  inspectMethodId: string
  inspectProperty: string
  inspectPropertyName: string
}
interface MainData {
  inspectGroups?: TreeData[]
  [propName:string]: any
}

interface TransferAreaData{
  key: string
  label: string
}

interface SelectedItem{
  id: string
  name: string
}
interface Props {
    title: string
    dialogVisible: boolean
    dialogData: TreeData[],
    importData: SelectedItem[]
}

interface State {
    isDialogShow: boolean
    treeFrameworkData: TransferAreaData[]
    treeValueSelected: string[]
    materialTreeData: TreeData[]
    mainData: MainData
    currentIndex: number
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
      currentIndex: 0
    })
    const parent = { ...context }
    const { dialogVisible, dialogData, importData } = toRefs(props as Props)
    const materialInspectionTree = ref()

    const onConfirm = () => {
      if (state.treeValueSelected.length !== 0) {
        const selectedItems: SelectedItem[] = []
        state.materialTreeData.forEach(item => {
          item.inspectGroups.forEach(subItem => {
            state.treeValueSelected.forEach(element => {
              if (subItem.inspectIndexId === element) {
                selectedItems.push({ id: element, name: subItem.inspect })
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

    const onClose = () => {
      parent.emit('actReset')
      parent.emit('update:dialogVisible', false)
    }

    const clickGategoryToChangeData = (val:string, index = 0) => {
      const tempTreeData:TreeData[] = state.mainData[val]
      state.currentIndex = index
      state.treeFrameworkData = []
      for (let i = 0; i < tempTreeData.length; i++) {
        state.treeFrameworkData.push({
          key: tempTreeData[i].inspectIndexId,
          label: tempTreeData[i].inspect
        })
      }
    }

    onMounted(() => {
      //
    })

    watch(
      dialogVisible,
      newValue => {
        state.isDialogShow = newValue
      },
      { immediate: true }
    )

    watch(
      importData,
      newValue => {
        if (newValue.length !== 0) {
          newValue.forEach((item) => {
            state.treeValueSelected.push(item.id)
          })
        }
      },
      { immediate: true }
    )

    watch(
      dialogData,
      newValue => {
        state.materialTreeData = newValue
        state.treeValueSelected = [] // 进页面 elected items init
        state.treeFrameworkData = [] // 进页面 data structure init
        if (Object.keys(state.mainData).length === 0) {
          // state.mainData = {}
          state.materialTreeData.forEach((item:TreeData) => {
            if (item.inspectProperty === 'PHYSICAL') {
              item.inspectPropertyName = '理化类'
            }
            if (item.inspectProperty === 'MICROBE') {
              item.inspectPropertyName = '微生物类'
            }

            state.mainData[item.inspectProperty] = JSON.parse(JSON.stringify(item.inspectGroups))
          })
        }

        if (state.materialTreeData.length >= 1) {
          clickGategoryToChangeData(state.materialTreeData[0].inspectProperty)
        }
        console.log('data 架构')
        console.log(state.mainData)
      },
      { immediate: true }
    )

    return {
      ...toRefs(state),
      materialInspectionTree,
      onConfirm,
      onClose,
      clickGategoryToChangeData
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
</style>
<style scoped>
.el-card.property >>> .el-card__body{
  padding: 0;
  font-size: 16px;
}

.el-button >>> span{
  color:#606266;
}
.el-button >>> span:hover{
  color:#487bff;
}
</style>
