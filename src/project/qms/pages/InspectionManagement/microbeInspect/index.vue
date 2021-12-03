<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-16 09:59:02
 * @LastEditors: Telliex
 * @LastEditTime: 2021-12-03 09:14:11
-->
<template>
  <mds-area class="test_method" title="检验列表" :pack-up="false" style="margin-bottom: 0; background: #fff; overflow:scroll">
    <template #titleBtn>
        <div style="padding-right: 60px;font-size:14px;">
        <el-radio-group v-model="searchFilter.inspectClassify" @change="actChangeInspectClassify">
          <el-radio label="COLONYNUM">菌落总数</el-radio>
          <el-radio label="COLIFORMGROUP">大肠菌群</el-radio>
          <el-radio label="YEAST">酵母菌</el-radio>
        </el-radio-group>
        </div>
        <div v-if="mainType==='CALCULATE'"><span style="font-size:14px;">培养日期：</span>
          <el-date-picker
          v-model="searchFilter.inspectDate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选选择日期"
          style="width: 140px"
          size="small"
        />
        </div>
        <div style="padding-left: 12px;font-size:14px;"><span>取样码：</span>
          <el-input size="small" style="margin-bottom:10px; width:200px;" clearable @keydown.enter="btnGetInspectList()"  v-model="searchFilter.sampleCode" placeholder="请输入" autofocus />
        </div>
        <div style="padding-left: 12px;">
          <el-button icon="el-icon-search" type="primary" size="small" class="topic-button" v-if="mainType==='CALCULATE'" @click="actViewSampleDetail()" >预览</el-button>
          <el-button icon="el-icon-search" type="primary" size="small" class="topic-button" v-if="mainType==='CULTIVATE'" @click="actCultivate()" >培养</el-button>
        </div>
    </template>
    <el-table border ref="refTableOfTopicMain" :cell-style="{'text-align':'center'}" :data="dataTableOfTopicMain" tooltip-effect="dark" style="width: 100%" max-height="500" highlight-current-row @row-click="handleCurrentChange" @selection-change="actHandleSelectionChange" @select="btnHandleOneSelectionChange" @select-all="btnHandleAllSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column label="样品码" show-overflow-tooltip prop="sampleCode" />
      <el-table-column label="检验内容" show-overflow-tooltip prop="inspectContent" />
      <el-table-column label="操作" width="140" fixed="right" v-if="mainType==='CALCULATE'">
        <template #default="scope">
          <el-button  type="text" icon="qmsIconfont qms-jianyan3" class="role__btn" @click="btnCount(scope.row)">
            计数
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </mds-area>

</template>

<script lang="ts">
import {
  defineComponent, toRefs, reactive, onMounted, ComponentInternalInstance, getCurrentInstance, ref
} from 'vue'
import MdsArea from '@/components/package/mds-area/src/mds-area.vue'
import {

} from '@/api/api'
import layoutTs from '@/components/layout/layoutTs'
import { useStore } from 'vuex'
// import InstectionDialog from '../components/InspectionDialog.vue'

interface SearchFilter{
  inspectClassify: string;
  sampleCode: string;
  inspectDate: string;
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
  delFlag: number
  mergeFlag: string
}

interface State {
  indexOfCurrentRowOnFocus: number
  targetObjList: any[] // 检验物件
  currentGlobalActOgj: any
  dialogVisible: boolean
  mainType: string
  mainClass: string
  orderStyle: string
  currentObj:any
  dataTableOfTopicMain: DataTableOfTopicMain[]
  searchFilter: SearchFilter
  applyStatusNameObj: any
  // applyStatusOptions: any
  selectedListOfTopicMainData: DataTableOfTopicMain[]
  formForTaskAdd: any
  cssForformLabelWidth: string
}

export default defineComponent({
  name: 'MicrobeInspectInspect',
  components: {
    MdsArea
  },

  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const store = useStore()
    const { gotoPage, tabsCloseCurrentHandle } = layoutTs()
    const refTableOfTopicMain = ref()

    /**  == 变量 ==  **/
    const state = reactive<State>({
      indexOfCurrentRowOnFocus: 0,
      dialogVisible: false,
      currentGlobalActOgj: {},
      mainType: '', // CULTIVATE, CALCULATE
      mainClass: '',
      orderStyle: '',
      currentObj: {},
      searchFilter: {
        inspectClassify: '',
        sampleCode: '',
        inspectDate: ''
      },
      dataTableOfTopicMain: [],
      applyStatusNameObj: {},
      // applyStatusOptions: {},
      selectedListOfTopicMainData: [],
      targetObjList: [],
      formForTaskAdd: {},
      cssForformLabelWidth: '110px'
    })

    /**  == 函数 ==  **/
    //

    const actViewSampleDetail = () => {
      //
    }

    const btnCount = (row:any) => {
      //
    }
    const actCultivate = () => {
      //
    }

    const btnGetInspectList = () => {
      //
    }

    const handleCurrentChange = () => {
      //
    }

    const actHandleSelectionChange = () => {
      //
    }

    const btnHandleOneSelectionChange = () => {
      //
    }

    const btnHandleAllSelectionChange = () => {
      //
    }
    const actChangeInspectClassify = (val:string) => {
      proxy.$confirm('指标切换后检验列表数据将清空，请确认是否切换？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async (res:string) => {
        if (res === 'confirm') {
          state.mainClass = val
          state.dataTableOfTopicMain = []
        } else {

        }
        // onClose()
      }).catch(() => {
        //
      })
    }
    /**  == 生命周期 ==  **/
    onMounted(async () => {
      state.mainType = store.state.inspection.microbeInspectTask.type //
      state.currentObj = store.state.inspection.microbeInspectTask.obj
      state.mainClass = store.state.inspection.microbeInspectTask.class
      console.log('==TYPE===========')
      console.log(state.mainType)
      console.log(state.currentObj)
      console.log(state.mainClass)
      console.log('==OBJ============')

      if (!state.mainType) {
        tabsCloseCurrentHandle()
        proxy.$warningToast('操作过时，请重新选择！')
        gotoPage({
          path: 'qms-pages-InspectionManagement-microbeInspectTask-index'
        })
      } else {
        // 除去非已收样或检验中状态任务3
        state.dataTableOfTopicMain = state.currentObj.length ? state.currentObj.length : []
        state.searchFilter.inspectClassify = state.mainClass
        // await MANAGEMENT_INSPECTION_TASK_INSPECT_QUERY_BY_ID_API(store.state.common.sampleObj.obj).then((res) => { // /taskInspect/queryTaskInspectByIds
        //   console.log('99999==999999')
        //   console.log(res.data.data)
        //   res.data.data.forEach((item:DataTableOfTopicMain) => {
        //     // 只收 'RECEIVED' & 'CHECKING' 状态
        //     if (item.taskStatus === 'RECEIVED' || item.taskStatus === 'CHECKING') {
        //       state.dataTableOfTopicMain.push(item)
        //     }
        //   })
        // })
      }
    })

    return {
      ...toRefs(state),
      // btn
      actViewSampleDetail,
      btnCount,
      actCultivate,
      btnGetInspectList,
      handleCurrentChange,
      actHandleSelectionChange,
      btnHandleOneSelectionChange,
      btnHandleAllSelectionChange,
      actChangeInspectClassify,
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
