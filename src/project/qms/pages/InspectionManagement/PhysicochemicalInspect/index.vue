<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-16 09:59:02
 * @LastEditors: Telliex
 * @LastEditTime: 2021-12-01 19:29:50
-->
<template>
  <mds-area class="test_method" title="已选中样品" :pack-up="false" style="margin-bottom: 0; background: #fff; overflow:scroll">
    <template #titleBtn>
        <div style="padding-right: 12px;font-size:14px;">
          <el-checkbox v-model="searchFilter.merge" size="small" label="合并检" @change="btnCheckOfMergeOrNot"></el-checkbox>
        </div>
        <div style="padding-left: 12px;font-size:14px;"><span>取样码：</span>
          <el-input size="small" style="margin-bottom:10px; width:200px;" clearable @keydown.enter="btnGetInspectList(searchFilter.sampleCode)"  v-model="searchFilter.sampleCode" placeholder="请输入" autofocus />
        </div>
        <div style="padding-left: 12px;">
          <el-button icon="el-icon-search" size="small" class="topic-button" @click="btnReset" :disabled="!dataTableOfTopicMain.filter(element=>element.taskStatus !== 'COMPLETED').length">重置</el-button>
          <el-button icon="el-icon-search" size="small" class="topic-button" @click="actGetInspectDetail()" :disabled="!dataTableOfTopicMain.filter(element=>element.taskStatus !== 'COMPLETED').length">检验</el-button>
        </div>
    </template>
    <el-table border ref="refTableOfTopicMain" :cell-style="{'text-align':'center'}" :data="dataTableOfTopicMain" :row-class-name="markRowWithDelFlag" tooltip-effect="dark" style="width: 100%" max-height="500" highlight-current-row @row-click="handleCurrentChange" @selection-change="actHandleSelectionChange" @select="btnHandleOneSelectionChange" @select-all="btnHandleAllSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column label="样品码" show-overflow-tooltip prop="sampleCode" />
      <el-table-column label="状态" show-overflow-tooltip prop="taskStatusName">
      <template #default="scope">
        <span>{{scope.row.taskStatusName}}</span>
      </template>
      </el-table-column>
      <el-table-column label="检验内容" show-overflow-tooltip prop="inspectContent" />
    </el-table>
  </mds-area>

  <instection-dialog v-model="dialogVisible" :targetObj="targetObjList" :mainType="mainType" :subType="subType" :orderStyle="orderStyle" @on-close="dialogVisible=false" @openHandle="returnFromDialogAndOpenAgainHandle" />

</template>

<script lang="ts">
import {
  defineComponent, toRefs, reactive, onMounted, ComponentInternalInstance, getCurrentInstance, ref
} from 'vue'
import MdsArea from '@/components/package/mds-area/src/mds-area.vue'
import {
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_QUERY_BY_SAMPLE_CODE_API, // 检验管理-[检验任务]- 根据样品码查询检验任务
  MANAGEMENT_INSPECTION_TASK_INSPECT_QUERY_BY_ID_API, // 检验管理-[检验任务]- 分析是否有合并检 /taskInspect/queryTaskInspectByIds
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_INSPECT_QUERY_API
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
  delFlag: number
  mergeFlag: string
}

interface State {
  indexOfCurrentRowOnFocus: number
  targetObjList: any[] // 检验物件
  currentGlobalActOgj: any
  dialogVisible: boolean
  mainType: string
  subType: string
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
      indexOfCurrentRowOnFocus: 0,
      dialogVisible: false,
      currentGlobalActOgj: {},
      mainType: '',
      subType: '',
      orderStyle: '',
      currentObj: {},
      searchFilter: {
        sampleCode: '',
        merge: false
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
    const checkIfMergeByMaterialCode = (val:DataTableOfTopicMain[]) => {
      const tempInspectMaterialCode = val[0].inspectMaterialCode
      return val.every(item => item.taskInspectClassify === 'PROCESS' && item.inspectMaterialCode === tempInspectMaterialCode)
    }

    const checkIfMergeByClassify = (val:DataTableOfTopicMain[]) => {
      return val.some(item => item.taskInspectClassify !== 'PROCESS')
    }

    // 临时检验列表数据

    // TODO
    const actGetInspectDetail = () => {
      if (state.searchFilter.merge && state.selectedListOfTopicMainData.length > 1) { // 勾选 2 个以上， 视为合并检
        if (checkIfMergeByClassify(state.selectedListOfTopicMainData)) {
          proxy.$warningToast('存在临时检验任务，无法合并检验')
          return
        }

        if (!checkIfMergeByMaterialCode(state.selectedListOfTopicMainData)) {
          proxy.$warningToast('存在不同物料，无法合并检验')
          return
        }
        console.log('merge')
        state.mainType = 'PROCESS'
        state.subType = 'merge'
        state.targetObjList = state.selectedListOfTopicMainData
      } else if (state.searchFilter.merge && state.selectedListOfTopicMainData.length === 1) { // 勾选 1 个， 视为一般检
        console.log('normal1')
        state.mainType = 'PROCESS'
        state.subType = 'normal'
        // state.orderStyle = 'first'
        state.targetObjList = state.selectedListOfTopicMainData
      } else {
        console.log('normal2')
        console.log(state.mainType)
        state.mainType = store.state.common.sampleObj.type
        state.subType = 'normal'
        // state.orderStyle = 'first'
        if (Object.keys(state.currentGlobalActOgj).length !== 0) {
          state.targetObjList = [state.currentGlobalActOgj]
        } else {
          proxy.$warningToast('请选取任务')
        }
      }

      state.dialogVisible = true
    }

    const actReGetInspectDetail = () => {
      state.dialogVisible = true
    }

    // 根据取样码添加任务
    const btnGetInspectList = (str:string) => {
      str && MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_QUERY_BY_SAMPLE_CODE_API(
        [str]
      ).then(res => {
        console.log('根据样品码查询检验任务')
        console.log(res.data.data)
        if (!res.data.data.length) {
          proxy.$infoToast('无任何数据')
        } else {
          // push 前去重
          let tempLength = 0
          const temp = state.dataTableOfTopicMain.map(item => item.id)
          res.data.data.forEach((item:any) => {
            if (!temp.includes(item.id)) {
              if (item.taskStatus === 'RECEIVED' || item.taskStatus === 'CHECKING' || item.taskStatus === 'COMPLETED') {
                // if (item.taskStatus === 'COMPLETED') {
                //   item.delFlag = 1
                // } else {
                //   item.delFlag = 0
                // }
                state.dataTableOfTopicMain.push(item)
                tempLength += 1
              }
            } else {
              proxy.$warningToast('列表中已存在欲添加的检验码')
            }
          })
          proxy.$infoToast('已滤掉非[已收样][检验中]及[已完成]状态任务')

          state.searchFilter.merge = false
          state.searchFilter.sampleCode = ''

          setCurrentRowOnFocus({})
          // R:highlight row
          if (!state.searchFilter.merge) {
            state.dataTableOfTopicMain.filter(element => element.taskStatus !== 'COMPLETED').length >= 1 && setCurrentRowOnFocus(state.dataTableOfTopicMain.filter(element => element.taskStatus !== 'COMPLETED')[0])
            state.currentGlobalActOgj = state.dataTableOfTopicMain.filter(element => element.taskStatus !== 'COMPLETED')[0]
          } else {
          // R:合併檢掃碼新增時帶上勾選
            for (let i = 1; i <= tempLength; i++) {
              refTableOfTopicMain.value.toggleRowSelection(state.dataTableOfTopicMain.filter(element => element.taskStatus !== 'COMPLETED')[state.dataTableOfTopicMain.filter(element => element.taskStatus !== 'COMPLETED').length - i])
            }
          }
        }
      }).catch(() => {
        proxy.$infoToast('您无权限执行此样品检验，请选择其它样品')
      })
    }

    // reload 任务表单
    const btnGetInspectListReload = (val: DataTableOfTopicMain[]) => {
      // val.length && MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_QUERY_BY_SAMPLE_CODE_API(
      //   val.map(item => item.sampleCode)
      val.length && MANAGEMENT_INSPECTION_TASK_INSPECT_QUERY_BY_ID_API( // /taskInspect/queryTaskInspectByIds
        val
      ).then(res => {
        state.dataTableOfTopicMain = []
        res.data.data.forEach((item:any) => {
          if (item.taskStatus === 'RECEIVED' || item.taskStatus === 'CHECKING' || item.taskStatus === 'COMPLETED') {
            if (item.taskStatus === 'COMPLETED') {
              item.delFlag = 1
            } else {
              item.delFlag = 0
            }
            state.dataTableOfTopicMain.push(item)
          }
        })
        // setCurrentRowOnFocus({})
        state.searchFilter.sampleCode = ''
        state.searchFilter.merge = false
      })
    }

    // 重置 table data
    const btnReset = () => {
      state.dataTableOfTopicMain = []
      proxy.$infoToast('表单已清空')
      store.commit('common/updateSampleObjToInspect', { type: 'EMPTY', obj: [] })
    }

    // focus or remove focus
    const setCurrentRowOnFocus = (row:any) => {
      Object.keys(row).length === 0 ? refTableOfTopicMain.value.setCurrentRow() : refTableOfTopicMain.value.setCurrentRow(row)
      state.currentGlobalActOgj = row
    }

    // assign global index & focus row obj
    const handleCurrentChange = (row:DataTableOfTopicMain) => {
      state.currentGlobalActOgj = row
      state.dataTableOfTopicMain.forEach((item, index) => {
        if (item.id === row.id) {
          state.indexOfCurrentRowOnFocus = index
        }
      })
    }

    //  click 合并检 button 后行为：取消 row's focus
    const btnCheckOfMergeOrNot = (val:boolean) => {
      if (state.dataTableOfTopicMain.filter(element => element.taskStatus !== 'COMPLETED').length !== 0) {
        val ? setCurrentRowOnFocus({}) : setCurrentRowOnFocus(state.dataTableOfTopicMain[state.indexOfCurrentRowOnFocus]) // TODO
      }
    }

    // [ACT][Table] 选框选择後的处理
    const actHandleSelectionChange = (val: DataTableOfTopicMain[]) => {
      state.selectedListOfTopicMainData = val
    }

    // [SELECT][Table] 选框选择
    const btnHandleOneSelectionChange = (val: DataTableOfTopicMain[]) => {
      if (val.length && val[val.length - 1].taskInspectClassify !== 'PROCESS') {
        proxy.$warningToast('临时检验任务，无法勾选合并')
        refTableOfTopicMain.value.toggleRowSelection(val[val.length - 1], false)
      }
    }
    // [SELECT][Table] 选框 ALL 选择
    const btnHandleAllSelectionChange = (val: DataTableOfTopicMain[]) => {
      if (val.length && state.selectedListOfTopicMainData.some(item => item.taskInspectClassify !== 'PROCESS')) {
        proxy.$warningToast('临时检验任务，无法勾选合并')
        refTableOfTopicMain.value.clearSelection()
      }
    }

    // dialog close and return to act
    const returnFromDialogAndOpenAgainHandle = (val:any) => {
      console.log('.............')
      console.log(val)

      setTimeout(async () => {
        const tempContainer:any[] = []
        let isOpenCopy = false
        state.dataTableOfTopicMain.forEach(item => {
          tempContainer.push({
            id: item.id,
            mergeFlag: item.mergeFlag
          })
        })

        if (val.obj && val.obj.taskInspectIdList.length) {
          console.log(val.obj.taskInspectIdList)
          isOpenCopy = true
          tempContainer.push({
            id: val.obj.taskInspectIdList[0],
            mergeFlag: ''
          })
        }

        // 重新加载后 list
        await btnGetInspectListReload(tempContainer)
        const totalItemsNumber = state.dataTableOfTopicMain.length // 3 status
        let nowItemIndex = -1
        let nexItemIndex = null
        console.log('state.dataTableOfTopicMain======')
        console.log(state.dataTableOfTopicMain)
        console.log('state.currentGlobalActOgj=====')
        console.log(state.currentGlobalActOgj)
        state.dataTableOfTopicMain.forEach((item:any, index:number) => {
          console.log('iininininin')
          if (item.id === state.currentGlobalActOgj.id) {
            console.log('iininininin again')
            nowItemIndex = index
            let tempNexItemIndex = nowItemIndex + 1

            console.log('nowItemIndex:' + nowItemIndex)

            while (tempNexItemIndex < state.dataTableOfTopicMain.length) {
              console.log('kokokokokokokookok')
              console.log(tempNexItemIndex)
              console.log(state.dataTableOfTopicMain[tempNexItemIndex])

              if (state.dataTableOfTopicMain[tempNexItemIndex].taskStatus !== 'COMPLETED') {
                nexItemIndex = tempNexItemIndex
                break
              } else {
                tempNexItemIndex = tempNexItemIndex + 1
              }
            }
          }

          if (item.taskStatus === 'COMPLETED') {
            item.delFlag = 1
          }
        })
        console.log(state.dataTableOfTopicMain)

        if (val.act === 'save') {
          if (state.subType !== 'merge') { // 只有保存会重开
            console.log(state.dataTableOfTopicMain)
            if (nexItemIndex !== null && nexItemIndex < totalItemsNumber) { // 剩多笔
              console.log('还有可开')
              state.indexOfCurrentRowOnFocus = nexItemIndex
              setTimeout(() => {
                setCurrentRowOnFocus(state.dataTableOfTopicMain[state.indexOfCurrentRowOnFocus])
                actGetInspectDetail()
              }, 500)
            } else if (totalItemsNumber === 1) { // 只剩一笔
              state.indexOfCurrentRowOnFocus = nowItemIndex
              setTimeout(() => {
                setCurrentRowOnFocus(state.dataTableOfTopicMain[state.indexOfCurrentRowOnFocus])
              }, 500)
              console.log('没有可再开')
            } else { // 到底
              state.indexOfCurrentRowOnFocus = nowItemIndex
              setTimeout(() => {
                setCurrentRowOnFocus(state.dataTableOfTopicMain[state.indexOfCurrentRowOnFocus])
              }, 500)
              console.log('到底，没有可开')
            }
          }
        } else if (val.act === 'submit') {
          if (state.subType !== 'merge') { // 只有保存会重开
            if (nexItemIndex !== null && nexItemIndex < totalItemsNumber) { // 剩多笔
              console.log('还有可开')
              state.indexOfCurrentRowOnFocus = nexItemIndex
              setTimeout(() => {
                setCurrentRowOnFocus(state.dataTableOfTopicMain[state.indexOfCurrentRowOnFocus])
                actGetInspectDetail()
              }, 500)
            } else if (totalItemsNumber === 1) { // 只剩一笔
              state.indexOfCurrentRowOnFocus = nowItemIndex
              setTimeout(() => {
                setCurrentRowOnFocus(state.dataTableOfTopicMain[state.indexOfCurrentRowOnFocus])
              }, 500)
              console.log('没有可再开')
            } else { // 到底
              state.indexOfCurrentRowOnFocus = nowItemIndex
              setTimeout(() => {
                setCurrentRowOnFocus(state.dataTableOfTopicMain[state.indexOfCurrentRowOnFocus])
              }, 500)
              console.log('到底，没有可开')
            }
          }

          // if (val.target === 'ORIGINAL_RECHECK') { // 原样复检
          //   console.log('原样复检')
          //   state.orderStyle = 'again'
          //   state.targetObjList = val.obj
          //   state.dialogVisible = true
          // } else if (val.target === 'RESAMOLING') { // 重新取样
          //   console.log('重新取样')
          //   state.orderStyle = 'again'
          //   state.targetObjList = val.obj
          //   state.dialogVisible = true
          //   // } else if (val.target === 'OTHER_SAMPLING') { // 其它取样
          // } else { // not chose

          // }
        }
      }, 1000)
    }

    // 隐掉 COMPLETED
    const markRowWithDelFlag = (obj:any) => {
      if (obj.row.delFlag === 1) {
        return 'rowDel'
      }
      return ''
    }

    /**  == 生命周期 ==  **/
    onMounted(async () => {
      state.mainType = store.state.common.sampleObj.type //  TEMP | PROCESS
      state.currentObj = store.state.common.sampleObj.obj
      console.log('==TYPE===========')
      console.log(store.state.common.sampleObj.type)
      console.log(store.state.common.sampleObj.obj)
      console.log('==OBJ============')

      if (!state.mainType) {
        tabsCloseCurrentHandle()
        proxy.$warningToast('操作过时，请重新选择！')
        gotoPage({
          path: 'qms-pages-InspectionManagement-InspectionTask-index'
        })
      } else {
        // 除去非已收样或检验中状态任务3
        state.dataTableOfTopicMain = []
        await MANAGEMENT_INSPECTION_TASK_INSPECT_QUERY_BY_ID_API(store.state.common.sampleObj.obj).then((res) => { // /taskInspect/queryTaskInspectByIds
          res.data.data.forEach((item:DataTableOfTopicMain) => {
            // 只收 'RECEIVED' & 'CHECKING' 状态
            if (item.taskStatus === 'RECEIVED' || item.taskStatus === 'CHECKING') {
              state.dataTableOfTopicMain.push(item)
            }
          })
        })

        // 没勾选合并检下，focus 第一条 (其实一进来默认不会勾选 state.searchFilter.merge ===false)
        if (!state.searchFilter.merge) {
          state.indexOfCurrentRowOnFocus = 0
          state.dataTableOfTopicMain.length >= 1 && setCurrentRowOnFocus(state.dataTableOfTopicMain[state.indexOfCurrentRowOnFocus])
        }
      }
    })

    return {
      ...toRefs(state),
      // btn
      actGetInspectDetail,
      btnGetInspectList,
      btnReset,
      handleCurrentChange,
      btnCheckOfMergeOrNot,
      actHandleSelectionChange,
      btnHandleOneSelectionChange,
      btnHandleAllSelectionChange,
      returnFromDialogAndOpenAgainHandle,
      btnGetInspectListReload,
      actReGetInspectDetail,
      markRowWithDelFlag,
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
