<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-16 09:59:02
 * @LastEditors: Telliex
 * @LastEditTime: 2021-11-17 19:01:38
-->
<template>
  <mds-area class="test_method" title="已选中样品" :pack-up="false" style="margin-bottom: 0; background: #fff; overflow:scroll">
    <template #titleBtn>
        <div style="padding-right: 12px;font-size:14px;">
          <el-checkbox v-model="searchFilter.merge" size="small" label="合并检" @change="btnCheckOfMergeOrNot"></el-checkbox>
        </div>
        <div style="padding-left: 12px;font-size:14px;"><span>取样码：</span>
          <el-input size="small" style="margin-bottom:10px; width:200px;" clearable @keydown.enter="btnGetInspectList(searchFilter.sampleCode)"  v-model="searchFilter.sampleCode" placeholder="请输入" />
        </div>
        <div style="padding-left: 12px;">
          <el-button icon="el-icon-search" size="small" class="topic-button" @click="btnReset" :disabled="!dataTableOfTopicMain.length">重置</el-button>
          <el-button icon="el-icon-search" size="small" class="topic-button" @click="btnGetInspectDetail()" :disabled="!dataTableOfTopicMain.length">检验</el-button>
        </div>
    </template>
    <el-table border ref="refTableOfTopicMain" :cell-style="{'text-align':'center'}" :data="dataTableOfTopicMain" tooltip-effect="dark" style="width: 100%" max-height="500" highlight-current-row @row-click="handleCurrentChange" @selection-change="actHandleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column label="样品码" show-overflow-tooltip prop="sampleCode" />
      <el-table-column label="状态" show-overflow-tooltip prop="taskStatus">
      <template #default="scope">
        <span>{{applyStatusNameObj[scope.row.taskStatus]}}</span>
      </template>
      </el-table-column>
      <el-table-column label="检验内容" show-overflow-tooltip prop="inspectContent" />
    </el-table>
  </mds-area>

  <instection-dialog v-if="isShowDialog" />
</template>

<script lang="ts">
import {
  defineComponent, toRefs, reactive, onMounted, ComponentInternalInstance, getCurrentInstance, ref
} from 'vue'
import MdsArea from '@/components/package/mds-area/src/mds-area.vue'
import {
  DICTIONARY_QUERY_API,
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_QUERY_BY_SAMPLE_CODE_API // 检验管理-[检验任务]- 根据样品码查询检验任务
} from '@/api/api'
import layoutTs from '@/components/layout/layoutTs'
import { useStore } from 'vuex'
import InstectionDialog from '../components/InspectionDialog.vue'

interface SearchFilter{
  sampleCode: string
  merge: boolean
}

interface DataTableOfTopicMain {
  coInspectDeptId: string;
  coInspectDeptName: string;
  coSampleDeptId: string;
  coSampleDeptName: string;
  deliveryDate: Date;
  finishDate: Date;
  groupBatch: string;
  handleExplain: string;
  id: string;
  inspectBatch: string;
  inspectContent: string;
  inspectDeptId: string;
  inspectDeptName: string;
  inspectEndDate: Date;
  inspectExplain: string;
  inspectFrequency: string;
  inspectMaterialCode: string;
  inspectMaterialName: string;
  inspectMaterialType: string;
  inspectProperty: string;
  inspectSampleContent: string;
  inspectSiteId: string;
  inspectSiteName: string;
  inspectStartDate: string;
  itemId: string;
  itemName: string;
  judgeResult: string;
  mergeBatch: string;
  needDeptCode: string;
  needDeptId: string;
  needDeptName: string;
  orderNo: string;
  productDate: string;
  receiveDate: string;
  recheckBatch: string;
  recheckFlag: string;
  recheckMod: string;
  sampleAmount: number;
  sampleCode: string;
  sampleDeptId: string;
  sampleDeptName: string;
  sampleEndDate: string;
  sampleExplain: string;
  sampler: string;
  sendSampleDeptId: string;
  sendSampleDeptName: string;
  supplier: string;
  supplierCode: string;
  taskInspectClassify: string;
  taskManageId: string;
  taskManageStatus: string;
  taskSampleClassify: string;
  taskSampleId: string;
  taskSampleStatus: string;
  taskStatus: string;
  tempApplyNo: string;
  temporaryFlag: string;
}

interface State {
  currentOgj: any
  isShowDialog: boolean
  currentType: string
  currentObj:any
  dataTableOfTopicMain: DataTableOfTopicMain[]
  searchFilter: SearchFilter
  applyStatusNameObj: any
  applyStatusOptions: any
  selectedListOfTopicMainData: DataTableOfTopicMain[]
}

export default defineComponent({
  name: 'PhysicochemicalInspect',
  components: {
    MdsArea,
    InstectionDialog
  },

  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const store = useStore()
    const { gotoPage, tabsCloseCurrentHandle } = layoutTs()
    const refTableOfTopicMain = ref()

    /**  == 变量 ==  **/
    const state = reactive<State>({
      isShowDialog: false,
      currentOgj: {},
      currentType: '',
      currentObj: {},
      searchFilter: {
        sampleCode: '',
        merge: false
      },
      dataTableOfTopicMain: [],
      applyStatusNameObj: {},
      applyStatusOptions: {},
      selectedListOfTopicMainData: []
    })

    /**  == 函数 ==  **/
    // 临时检验列表数据

    const btnGetInspectDetail = () => {
      state.isShowDialog = true
    }

    const btnGetInspectList = (str:string) => {
      str && MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_QUERY_BY_SAMPLE_CODE_API({
        sampleCode: str
      }).then(res => {
        console.log('根据样品码查询检验任务')
        console.log(res.data.data)
        if (!res.data.data.length) {
          proxy.$infoToast('无任何数据')
        } else {
          // push 前去重
          const temp = state.dataTableOfTopicMain.map(item => item.sampleCode)
          res.data.data.forEach((item:any) => {
            !temp.includes(item.sampleCode) && state.dataTableOfTopicMain.push(item)
          })

          // remove checked item
          state.selectedListOfTopicMainData = []
          refTableOfTopicMain.value.clearSelection()
          // remove highlight row
          setCurrent({})
          // highlight row
          if (!state.searchFilter.merge) {
            state.dataTableOfTopicMain.length >= 1 && setCurrent(state.dataTableOfTopicMain[0])
            state.currentOgj = state.dataTableOfTopicMain[0]
          }
        }
      }).catch(() => {
        proxy.$infoToast('您无权限执行此样品检验，请选择其它样品')
      })
    }

    // 重置 table data
    const btnReset = () => {
      state.dataTableOfTopicMain = []
    }

    // focus
    const setCurrent = (row:any) => {
      Object.keys(row).length === 0 ? refTableOfTopicMain.value.setCurrentRow() : refTableOfTopicMain.value.setCurrentRow(row)
    }

    //
    const handleCurrentChange = (row:any) => {
      console.log(row)
      state.currentOgj = row
    }

    const btnCheckOfMergeOrNot = (val:boolean) => {
      if (state.dataTableOfTopicMain.length !== 0) {
        val ? setCurrent({}) : setCurrent(state.dataTableOfTopicMain[0])
      }
    }

    // [table] 选框选择
    const actHandleSelectionChange = (val: DataTableOfTopicMain[]) => {
      console.log('9999999')
      console.log(val)
      state.selectedListOfTopicMainData = val
    }

    /**  == 生命周期 ==  **/
    onMounted(async () => {
      state.currentType = store.state.common.sampleObj.type
      state.currentObj = store.state.common.sampleObj.obj
      console.log('=============')
      console.log(store.state.common.sampleObj.type)
      console.log(store.state.common.sampleObj.obj)
      console.log('=============')
      // 获取状态下拉
      await DICTIONARY_QUERY_API({ dictType: 'TASK_STATUS' }).then((res) => {
        state.applyStatusOptions = res.data.data // 除去已出库
        state.applyStatusNameObj = {}
        state.applyStatusOptions.forEach((item:any) => {
          state.applyStatusNameObj[item.dictCode] = item.dictValue
          console.log('state.applyStatusNameObj')
          console.log(state.applyStatusNameObj)
        })
      })

      if (!state.currentType) {
        tabsCloseCurrentHandle()
        proxy.$warningToast('操作过时，请重新选择！')
        gotoPage({
          path: 'qms-pages-InspectionManagement-InspectionTask-index'
        })
      } else {
        console.log('state.currentObj')
        console.log(state.currentObj)
        state.dataTableOfTopicMain = state.currentObj.length ? [state.currentObj[0]] : []
        console.log('state.dataTableOfTopicMain')
        console.log(state.dataTableOfTopicMain)
        if (!state.searchFilter.merge) {
          state.dataTableOfTopicMain.length >= 1 && setCurrent(state.dataTableOfTopicMain[0])
        }
      }
    })

    return {
      ...toRefs(state),
      // btn
      btnGetInspectDetail,
      btnGetInspectList,
      btnReset,
      setCurrent,
      handleCurrentChange,
      btnCheckOfMergeOrNot,
      actHandleSelectionChange,
      // data
      // ref
      refTableOfTopicMain
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  min-height: 550px;
  height: calc(100vh - 117px);
}
</style>
