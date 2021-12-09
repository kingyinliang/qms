<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-16 09:59:02
 * @LastEditors: Telliex
 * @LastEditTime: 2021-12-09 15:21:40
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
          <el-button icon="el-icon-search" type="primary" size="small" class="topic-button" @click="actGetInspectDetail()" :disabled="!dataTableOfTopicMain.filter(element=>element.taskStatus !== 'COMPLETED').length">检验</el-button>
        </div>
    </template>
    <el-table border ref="refTableOfTopicMain" :cell-style="{'text-align':'center'}" :data="dataTableOfTopicMain" :row-class-name="markRowWithDelFlag" tooltip-effect="dark" style="width: 100%" max-height="500" highlight-current-row @row-click="handleCurrentChange" @selection-change="actHandleSelectionChange" @select="btnHandleOneSelectionChange">
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

  <instection-dialog v-model="dialogVisible" :targetObj="targetObjList" :mainType="mainType" :subType="subType"  @on-close="dialogVisible=false" @openHandle="returnFromDialogAndOpenAgainHandle" />

</template>

<script lang="ts">
import {
  defineComponent, toRefs, reactive, onMounted, ComponentInternalInstance, getCurrentInstance, ref
} from 'vue'
import { useRouter } from 'vue-router'
import MdsArea from '@/components/package/mds-area/src/mds-area.vue'
import {
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_QUERY_BY_SAMPLE_CODE_API, // 检验管理-[检验任务]- 根据样品码查询检验任务
  MANAGEMENT_INSPECTION_TASK_INSPECT_QUERY_BY_ID_API, // 检验管理-[检验任务]- 分析是否有合并检 /taskInspect/queryTaskInspectByIds
  // MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_INSPECT_QUERY_API,
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_FORM_QUERY_API
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
  currentObj: any
  dataTableOfTopicMain: DataTableOfTopicMain[]
  searchFilter: SearchFilter
  applyStatusNameObj: any
  // applyStatusOptions: any
  selectedListOfTopicMainData: DataTableOfTopicMain[]
  formForTaskAdd: any
  cssForformLabelWidth: string
  correntWayInto: boolean
  scanMergeType: boolean
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
    const router = useRouter()

    const refTableOfTopicMain = ref()

    /**  == 变量 ==  **/
    const state = reactive<State>({
      correntWayInto: false,
      scanMergeType: false,
      indexOfCurrentRowOnFocus: 0,
      dialogVisible: false,
      currentGlobalActOgj: {},
      mainType: '',
      subType: '',
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
      const tempInspectContent = val[0].inspectContent
      const tempInspectProperty = val[0].inspectProperty
      return val.every(item => item.taskInspectClassify === 'PROCESS' && item.inspectMaterialCode === tempInspectMaterialCode && item.inspectContent === tempInspectContent && item.inspectProperty === tempInspectProperty)
    }

    const checkIfMergeByClassify = (val:DataTableOfTopicMain[]) => {
      return val.some(item => item.taskInspectClassify !== 'PROCESS')
    }

    // 临时检验列表数据

    // TODO
    const actGetInspectDetail = () => {
      state.targetObjList = []
      if (state.searchFilter.merge && state.selectedListOfTopicMainData.length > 1) { // 勾选 2 个以上， 视为合并检
        if (checkIfMergeByClassify(state.selectedListOfTopicMainData)) {
          proxy.$warningToast('存在临时检验任务，无法合并检验')
          return
        }

        if (!checkIfMergeByMaterialCode(state.selectedListOfTopicMainData)) {
          proxy.$warningToast('存在不同物料、属性或检验内容，无法合并检验')
          return
        }
        console.log('merge')
        state.mainType = state.selectedListOfTopicMainData[0].taskInspectClassify
        state.subType = 'merge'
        state.targetObjList = JSON.parse(JSON.stringify(state.selectedListOfTopicMainData))
      } else if (state.searchFilter.merge && state.selectedListOfTopicMainData.length === 1) { // 勾选 1 个， 视为一般检
        console.log(state.selectedListOfTopicMainData[0].taskInspectClassify)
        console.log('normal1')

        if (state.selectedListOfTopicMainData[0].taskStatus === 'COMPLETED') {
          proxy.$warningToast('已完成状态无法检验')
          return
        }
        state.mainType = state.selectedListOfTopicMainData[0].taskInspectClassify
        state.subType = 'normal'

        if (state.selectedListOfTopicMainData[0].mergeBatch === '') {
          state.targetObjList = JSON.parse(JSON.stringify(state.selectedListOfTopicMainData))
        } else { // 该条是合并样品
          state.subType = 'merge'
          state.targetObjList = state.dataTableOfTopicMain.filter((element:any) => element.mergeBatch === state.selectedListOfTopicMainData[0].mergeBatch)
          refTableOfTopicMain.value.toggleRowSelection(state.targetObjList, true)
          console.log('state.selectedListOfTopicMainData')
          console.log(state.selectedListOfTopicMainData)
        }
      } else {
        console.log('normal2')
        console.log(state.currentGlobalActOgj.taskInspectClassify)

        if (state.currentGlobalActOgj.taskStatus === 'COMPLETED') {
          proxy.$warningToast('已完成状态无法检验')
          return
        }

        state.mainType = state.currentGlobalActOgj.taskInspectClassify
        state.subType = 'normal'

        if (Object.keys(state.currentGlobalActOgj).length !== 0) {
          if (state.currentGlobalActOgj.mergeBatch === '') {
            state.targetObjList = [JSON.parse(JSON.stringify(state.currentGlobalActOgj))]
          } else { // 该条是合并样品
            state.subType = 'merge'
            state.targetObjList = state.dataTableOfTopicMain.filter((element:any) => element.mergeBatch === state.currentGlobalActOgj.mergeBatch)
            refTableOfTopicMain.value.toggleRowSelection(state.targetObjList, true)
            console.log('state.selectedListOfTopicMainData')
            console.log(state.selectedListOfTopicMainData)
          }
        } else {
          proxy.$infoToast('请选取任务')
        }
      }

      // 有传送物件才开 Dialog
      if (state.targetObjList.length) {
        state.dialogVisible = true
      }
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
                if (state.searchFilter.merge) {
                  // setTimeout(() => {
                  console.log('有勾选哦')

                  if (item.taskInspectClassify === 'TEMP') {
                    proxy.$warningToast('临时检验任务，无法勾选合并')
                  } else {
                    refTableOfTopicMain.value.toggleRowSelection(item, true)
                  }

                  // }, 500)
                }
              }
            } else {
              proxy.$warningToast('列表中已存在相同检验码')
            }
          })
          // 提示所查找的样品码没有所要查找的状态 （RECEIVED、CHECKING、COMPLETED）
          if (res.data.data.some((item:any) => item.taskStatus !== 'RECEIVED' && item.taskStatus !== 'CHECKING' && item.taskStatus !== 'COMPLETED')) {
            proxy.$warningToast('查询结果含有非[已收样][检验中][已完成]状态数据')
          }

          state.searchFilter.sampleCode = ''

          if (state.selectedListOfTopicMainData.length) {
            setCurrentRowOnFocus({})
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
      state.scanMergeType = true
      proxy.$successToast('表单已清空')
      // store.commit('common/updateSampleObjToInspect', { type: 'EMPTY', obj: [] })
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
        val ? setCurrentRowOnFocus({}) : setCurrentRowOnFocus(state.dataTableOfTopicMain[state.indexOfCurrentRowOnFocus])
      }
    }

    // [ACT][Table] 选框选择後的处理
    const actHandleSelectionChange = (val: DataTableOfTopicMain[]) => {
      console.log('选框选择後的处理')
      console.log(val)
      setCurrentRowOnFocus({})
      state.selectedListOfTopicMainData = val
    }

    // [SELECT][Table] 选框选择 // 全选/全不选操作不触发此
    const btnHandleOneSelectionChange = (val: DataTableOfTopicMain[]) => {
      console.log('选框选择')
      console.log(val)
      if (val.length && val[val.length - 1].taskInspectClassify !== 'PROCESS') {
        proxy.$warningToast('临时检验任务，无法勾选合并')
        setTimeout(() => {
          refTableOfTopicMain.value.toggleRowSelection(val[val.length - 1], false)
        }, 500)
        return
      }

      if (val.length >= 2) {
        let tempTaskStatus = val[0].taskStatus
        val.forEach((item:any, index:number) => {
          if (index >= 1) {
            if (val[0].inspectMaterialCode === item.inspectMaterialCode && val[0].inspectContent === item.inspectContent && val[0].inspectProperty === item.inspectProperty) {
              console.log('4444444')
              if (tempTaskStatus === 'COMPLETED') {
                tempTaskStatus = val[index].taskStatus
              } else if (tempTaskStatus === 'RECEIVED') {
                if (val[index].taskStatus === 'CHECKING') {
                  proxy.$warningToast('不符合的状态，无法勾选合并')
                  setTimeout(() => {
                    refTableOfTopicMain.value.toggleRowSelection(val[index], false)
                  }, 500)
                }
              } else if (tempTaskStatus === 'CHECKING') {
                if (val[index].taskStatus === 'RECEIVED') {
                  proxy.$warningToast('不符合的状态，无法勾选合并')
                  setTimeout(() => {
                    refTableOfTopicMain.value.toggleRowSelection(val[index], false)
                  }, 500)
                }
              }
            } else {
              proxy.$warningToast('不同物料内容属性，无法勾选合并')
              setTimeout(() => {
                refTableOfTopicMain.value.toggleRowSelection(val[index], false)
              }, 500)
            }
          }
        })
      }
    }

    // dialog close and return to act
    const returnFromDialogAndOpenAgainHandle = (val:any) => {
      console.log('.............')
      console.log(val)
      // val.act==='save && val.target === '' => 保存 没有复检
      // val.act==='submit && val.target === '' => 提交 没有复检
      // val.act==='submit && val.target === 'ORIGINAL_RECHECK' => 提交 原样复检
      // val.act==='submit && val.target === 'RESAMOLING' => 提交 取样复检
      setTimeout(async () => {
        // 1. 是否刷新 list
        if (val.act === 'save') { // 不刷新
          // if (state.subType === 'normal') { // 一般

          // } else if (state.subType === 'merge') { // 合并
          state.targetObjList.forEach((item:any) => {
            if (item.taskStatus === 'RECEIVED') {
              item.taskStatus = 'CHECKING'
              item.taskStatusName = '检验中'
            }
          })
          // }
        } else { // 刷新
          const tempContainer:any[] = []
          let isOpenCopy = false
          // 将原来的 list 提取
          state.dataTableOfTopicMain.forEach(item => {
            tempContainer.push({
              id: item.id,
              mergeFlag: item.mergeFlag
            })
          })

          // 后来复检提交会返 string[] =>id
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
          console.log('state.dataTableOfTopicMain')
          console.log(state.dataTableOfTopicMain)

          const totalItemsNumber = state.dataTableOfTopicMain.length // 3 status
          let nowItemIndex = -1
          let nexItemIndex = null

          if (isOpenCopy) { // run 复检
            console.log('$$$$$$$$$$复检$$$$$$$$$$$')
            state.dataTableOfTopicMain.forEach((item:any, index:number) => {
            // 找出原先的 sample
              if (item.id === state.currentGlobalActOgj.id) {
                nowItemIndex = index
              }
              // 复检 copy 出来的 sample
              if (item.id === val.obj.taskInspectIdList[0]) {
                nexItemIndex = index
              }

              if (item.taskStatus === 'COMPLETED') {
                item.delFlag = 1
              }
            })
          } else { // run 非复检
            console.log('$$$$$$$$$$非复检$$$$$$$$$$$')
            state.dataTableOfTopicMain.forEach((item:any, index:number) => {
              if (item.id === state.currentGlobalActOgj.id) {
                nowItemIndex = index
                let tempNexItemIndex = nowItemIndex + 1

                console.log('nowItemIndex:' + nowItemIndex)

                while (tempNexItemIndex < state.dataTableOfTopicMain.length) {
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
          }

          // 3.跑再开启
          if (val.act === 'save') {
            console.log('$$$$$$$$$$save$$$$$$$$$$$')
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
          } else if (val.act === 'submit') {
            console.log('$$$$$$$$$$submit$$$$$$$$$$$')
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
          }
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
      // state.mainType = store.state.common.sampleObj.type //  TEMP | PROCESS
      state.mainType = ''
      // state.currentObj = store.state.common.sampleObj.obj
      state.currentObj = null

      if (router.currentRoute.value.params.wayInto) {
        state.correntWayInto = true
        const temp:any = JSON.parse(router.currentRoute.value.params.transferObj as string)
        console.log('temp')
        console.log(temp)
        state.currentObj = temp.obj
        state.mainType = temp.type
      }
      console.log('==TYPE===========')
      console.log(state.mainType)
      console.log(state.currentObj)
      console.log('==OBJ============')

      console.log('state.correntWayInto')
      console.log(state.correntWayInto)
      console.log('state.currentObj')
      console.log(state.currentObj)

      // if (!state.mainType) {
      //   tabsCloseCurrentHandle()
      //   proxy.$warningToast('操作过时，请重新选择！')
      //   gotoPage({
      //     path: 'qms-pages-InspectionManagement-InspectionTask-index'
      //   })
      // } else {
      // 清空重整
      state.dataTableOfTopicMain = []
      if (state.correntWayInto && state.currentObj.length) {
        state.scanMergeType = false
        await MANAGEMENT_INSPECTION_TASK_INSPECT_QUERY_BY_ID_API(state.currentObj).then((res) => { // /taskInspect/queryTaskInspectByIds
          console.log('==转进来的数据加工后==')
          console.log(res.data.data)
          res.data.data.forEach((item:DataTableOfTopicMain) => {
            // 只收 'RECEIVED' & 'CHECKING' & 'COMPLETED' 状态
            if (item.taskStatus === 'RECEIVED' || item.taskStatus === 'CHECKING' || item.taskStatus === 'COMPLETED') {
              state.dataTableOfTopicMain.push(item)
            }
          })
        })
      } else {
        state.scanMergeType = true
      }

      // 没勾选合并检下，focus 第一条 (其实一进来默认不会勾选 state.searchFilter.merge ===false)
      if (!state.searchFilter.merge) {
        state.indexOfCurrentRowOnFocus = 0
        state.dataTableOfTopicMain.length >= 1 && setCurrentRowOnFocus(state.dataTableOfTopicMain[state.indexOfCurrentRowOnFocus])
      }
      // }
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
      // btnHandleAllSelectionChange,
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
::v-deep(.el-table__header-wrapper .el-checkbox){
  display: none
}
</style>
