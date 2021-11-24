<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-11 16:30:07
 * @LastEditors: Telliex
 * @LastEditTime: 2021-11-24 16:21:19
-->
<template>
  <el-dialog :title="title+subTitle" v-model="isDialogShow" width="90%" @close="onClose">
  <mds-area class="info">
    <mds-area :title="infoSubTitle" :name="'org'" class="info">
        <el-form :inline="true" ref="refFormOfSampleInfo" :model="dataFormOfSampleInfo" :label-width="cssForformLabelWidth">
          <el-form-item label="检验任务："  prop="taskSampleId" v-if="currentSubType==='temp'" >
            <el-input v-model="dataFormOfSampleInfo.taskSampleId" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="取样部门："  prop="sampleDeptName" v-if="currentSubType==='temp'" >
            <el-input v-model="dataFormOfSampleInfo.sampleDeptName" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="检验物料："  prop="inspectMaterialName" v-if="currentSubType==='normal' ||currentSubType==='checkagain' || currentSubType==='merge'" >
            <el-input v-model="dataFormOfSampleInfo.inspectMaterialName" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="取样信息："  prop="inspectSiteName" v-if="currentSubType==='normal' ||currentSubType==='merge' || currentSubType==='checkagain'" >
            <el-input v-model="dataFormOfSampleInfo.inspectSiteName" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="取样消息："  prop="sampleExplain" v-if="currentSubType==='normal' ||currentSubType==='merge' || currentSubType==='checkagain'" >
            <el-input v-model="dataFormOfSampleInfo.sampleExplain" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" ></el-input>
          </el-form-item>
        </el-form>
    </mds-area>

        <mds-area :title="'检验录入'" :name="'org'" >
          <template v-for="subItem in dataFormOfSampleItemUnit" :key="subItem">
            <mds-area :title="subItem.indexName+' ('+subItem.sampleCode+')'" :name="'org'" :outline="true">
              <template #titleBtn v-if="subItem.inspectMethodCodeWhichIndex!==null">
                <div class="btn-group">
                    <template v-for="(btnItem,index) in subItem.inspectMethodNameList" :key="btnItem.inspectMethodCode">
                        <button   size="mini" class="btn-titm" :class="{focus:subItem.inspectMethodCode===btnItem.inspectMethodCode}" @click="btnChangeMethodOfIndex(index,subItem)">{{btnItem.inspectMethodName.substring(0,btnItem.inspectMethodName.length-1)}}</button>
                    </template>
                </div>
              </template>
              <el-form :inline="true" :model="subItem" :label-width="cssForformLabelWidth">
                <el-form-item label="结果："  prop="inspectResult" >
                  <el-input v-model="subItem.inspectResult" size="small" oninput ="value=value.replace(/[^\-\d.]/g, '')"   class="inputWidth" placeholder="请输入" autocomplete="off" :disabled="!subItem.canEditInspectResult" @blur="actHandleIndexJudgeResult(subItem)" ></el-input>
                </el-form-item>
                <el-form-item label="依据方法："  prop="indexVersionMethod" >
                  <el-input v-model="subItem.indexVersionMethod" size="small"  class="inputWidth" placeholder="" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="判定："  prop="indexJudgeResult" >
                    <el-radio v-model="subItem.indexJudgeResult" label="Y" :disabled="true">合格</el-radio>
                    <el-radio v-model="subItem.indexJudgeResult" label="N" :disabled="true">不合格</el-radio>
                </el-form-item>
                <el-form-item label="标准："  prop="indexStandardString" >
                    <el-input v-model="subItem.indexStandardString" size="small"  class="inputWidth" placeholder="e.x.1<S<10" autocomplete="off" oninput ="value=value.replace(/[^0-9S><=]/g, '')"   @blur="actHandleIndexJudgeResult(subItem)"></el-input>
                </el-form-item>
                <div>
                <el-form-item label="检验过程："  prop="" v-if="subItem.canShowParameterList">
                  <template v-if="subItem.inspectMethodNameList">
                    <template v-for="(para,index) in subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterList" :key="index">
                      {{para.paramCode?para.paramCode.split('[')[0]:'?'}}<sub>{{para.paramCode?para.paramCode.split('[')[1].replace(']',''):''}}</sub> =
                      <el-input v-model="para.defaultValue" type="text"  size="small" placeholder=""  style="width:140px;margin-right:10px">
                        <template #suffix>
                          {{para.paramUnit}}
                        </template>
                      </el-input>
                    </template>
                  </template>
                </el-form-item>
                </div>
                <!-- <el-form-item label="检验过程："  prop="" v-if="subItem.inspectMethodCodeWhichIndex===null">
                    <el-input v-model="subItem.inspectParameterOnlyText" type="text"  size="small" placeholder=""  style="width:300px;margin-right:10px"/>
                </el-form-item> -->
              </el-form>
            </mds-area>
          </template>
        </mds-area>
        <el-form :inline="true" :model="dataFormOfSampleInfo"  :label-width="cssForformLabelWidth" >
          <el-form-item label="综合判定："  prop="indexJudgeResult" >
            <el-radio v-model="indexJudgeResult" label="Y" :disabled="true">合格</el-radio>
            <el-radio v-model="indexJudgeResult" label="N" :disabled="true">不合格</el-radio>
          </el-form-item>

          <el-form-item label="检验说明："  prop="inspectExplain" >
            <el-input v-model="dataFormOfSampleInfo.inspectExplain" size="small" placeholder="自动带入" autocomplete="off" style="width:300px"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true"  :model="dataFormOfSampleInfo"  :label-width="cssForformLabelWidth" >
          <el-form-item label="复检综合判定："  prop="recheckMod" >
            <el-radio v-model="dataFormOfSampleInfo.recheckMod" label="ORIGINAL_RECHECK">原样复检</el-radio>
            <el-radio v-model="dataFormOfSampleInfo.recheckMod" label="RESAMOLING">重新取样</el-radio>
            <el-radio v-model="dataFormOfSampleInfo.recheckMod" label="OTHER_SAMPLING">其他取样</el-radio>
          </el-form-item>
        </el-form>
        <div><span>检验时间:</span>{{!dataFormOfSampleInfo.finishDate?'':dataFormOfSampleInfo.finishDate}}</div>
      <mds-area :title="'检验记录'" :name="'org'" class="info" v-if="currentSubType==='checkagain'">
        <div class="block">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :size="'large'"
              :timestamp="activity.timestamp"
              :color="'#467BFF'"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </mds-area>
    <div style="display: flex; margin:20px 0px;justify-content: flex-end;">
      <el-button  icon="el-icon-circle-close" type="primary" size="small" class="topic-button" @click="onClose">取消</el-button>
      <el-button  icon="el-icon-circle-check" type="primary" size="small" class="topic-button"  @click="btnSaveOrSubmitDataOfInspect('save')">保存</el-button>
      <el-button  type="primary" icon="el-icon-circle-check" size="small" class="role__btn topic-button"  @click="btnSaveOrSubmitDataOfInspect('submit')">完成</el-button>
    </div>
  </mds-area>
  </el-dialog>

</template>

<script lang="ts">
import { defineComponent, toRefs, ref, reactive, onMounted, getCurrentInstance, ComponentInternalInstance, watch, computed } from 'vue'
import layoutTs from '@/components/layout/layoutTs'
import _ from 'lodash'
import {
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_INSPECT_QUERY_API,
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_RECHECK_TASK_INSPECT_API, // 理化检验保存 /taskInspectIndex/modifyTnspectIndex
  INSPECT_INDEX_PROCESS_PARAMETER_QUERY_FOR_TASK_API, // 查询过程参数数据 INSPECT_INDEX_PROCESS_PARAMETER_QUERY_FOR_TASK_API
  INSPECT_INDEX_PROCESS_PARAMETER_UPDATE_FOR_TASK_API // 基础数据-[指标检验方法明细][过程参数]- 检验编辑 /inspectParameter/updateInspectParameter
} from '@/api/api'

interface State {
  isDialogShow: boolean
  currentSubType : string
  currentMainType : string
  currentObj: any
  title: string
  subTitle: string
  infoSubTitle: string
  onlyRead: boolean
  cssForformLabelWidth: string
  dataFormOfSampleInfo: any
  dataFormOfSampleItemUnit: any[]
  activities: any[]
  idToSampleCode: any
  mainObj:any[]
  formForTaskAdd: any
}

interface Props{
  dialogVisible: boolean
  targetOgj: any
  subType: string
  mainType: string
}

export default defineComponent({
  name: 'InspectionManagementDialogIndex',
  emits: ['on-close', 'on-confirm', 'openHandle'],
  components: {
  },

  props: {
    targetOgj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    subType: {
      type: String,
      default: ''
    },
    mainType: {
      type: String,
      default: ''
    }
  },
  setup (props, context) {
    const { targetOgj, dialogVisible, subType, mainType } = toRefs(props as Props)
    const parent = { ...context }

    const { gotoPage, tabsCloseCurrentHandle } = layoutTs()

    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any

    const refFormOfSampleInfo = ref()

    /**  == 变量 ==  **/
    const state = reactive<State>({
      isDialogShow: dialogVisible.value,
      title: '样品检验-',
      subTitle: '',
      currentMainType: '',
      currentSubType: 'normal', // normal, temp , checkagain, merge
      currentObj: {},
      infoSubTitle: '样品信息',
      onlyRead: true,
      cssForformLabelWidth: '110px',
      dataFormOfSampleInfo: {},
      idToSampleCode: {},
      mainObj: [],
      formForTaskAdd: {},
      dataFormOfSampleItemUnit: [],
      activities: [
        {
          content: 'Custom icon',
          timestamp: '2018-04-12 20:46'
        },
        {
          content: 'Custom color',
          timestamp: '2018-04-03 20:46'
        },
        {
          content: 'Custom size',
          timestamp: '2018-04-03 20:46'
        },
        {
          content: 'Custom hollow',
          timestamp: '2018-04-03 20:46'
        },
        {
          content: 'Default node',
          timestamp: '2018-04-03 20:46'
        }
      ]
    })

    const indexJudgeResult = computed(() => {
      // state.dataFormOfSampleInfo.indexJudgeResult = temp
      return state.dataFormOfSampleItemUnit.every(item => item.indexJudgeResult === 'Y') ? 'Y' : 'N'
    })

    // [BTN:取消]
    const onClose = () => {
      parent.emit('on-close')
    }

    // TODO
    // [BTN:保存][BTN:提交] transfor
    const btnSaveOrSubmitDataOfInspect = _.debounce(async (type:string) => {
      // 综合判定
      state.dataFormOfSampleInfo.indexJudgeResult = indexJudgeResult.value

      const tempTaskInspectList = JSON.parse(JSON.stringify(state.mainObj))
      const tempTaskInspectIndexList = JSON.parse(JSON.stringify(state.dataFormOfSampleItemUnit))

      tempTaskInspectIndexList.forEach((item:any) => {
        const tempTaskInspectPhysicalList: any[] = []
        const tempUpdateInspectParameter: any[] = []
        // if (item.inspectParameterTaskList.inspectMethodNameList[item.inspectMethodCodeWhichIndex].inspectParameterList) {
        item.inspectMethodNameList[item.inspectMethodCodeWhichIndex].inspectParameterList.forEach((subItem:any) => {
          tempTaskInspectPhysicalList.push({
            id: subItem.id,
            taskInspectIndexId: item.taskInspectIndexIdList[0], // ?? 是否應是 [] 形式
            paramCode: subItem.paramCode,
            paramName: subItem.paramName,
            paramValue: subItem.defaultValue,
            paramUnit: subItem.paramUnit,
            hiddenValue: null, // ??
            formula: subItem.formula
          })
          tempUpdateInspectParameter.push(subItem)
        })
        // }
        item.updateInspectParameter = tempUpdateInspectParameter
        item.taskInspectPhysicalList = tempTaskInspectPhysicalList
      })

      tempTaskInspectList.forEach((item:any) => {
        item.taskInspectIndexList = tempTaskInspectIndexList.filter((subItem:any) => item.sampleCode === subItem.sampleCode)
      })

      const obj = {
        isFinish: type === 'save' ? 'CHECKING' : 'COMPLETED', // 点完成的时候传COMPLETED   点击保存的时候CHECKING
        inspectExplain: state.dataFormOfSampleInfo.inspectExplain,
        recheckMod: state.dataFormOfSampleInfo.recheckMod, // ORIGINAL_RECHECK 原样复检 | RESAMOLING 重新取样 | OTHER_SAMPLING 其他取样
        mergeFlag: state.currentSubType === 'normal' ? 'N' : 'Y',
        taskInspectList: tempTaskInspectList // 需注意一般检或是复合检
      }
      console.log('=====Save or Submit======')
      console.log(obj)

      if (type !== 'save') { // 完成提交行为
        proxy.$confirm('确认是否继续校验？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 需校验
          checkRequiredData()
          // handleSaveData('submit', obj)

          if (state.dataFormOfSampleInfo.recheckMod === 'ORIGINAL_RECHECK') { // 原样复检
            parent.emit('openHandle', { target: 'ORIGINAL_RECHECK', obj: obj })
          } else if (state.dataFormOfSampleInfo.recheckMod === 'RESAMOLING') { // 重新取样
            parent.emit('openHandle', { target: 'RESAMOLING', obj: obj })
          } else if (state.dataFormOfSampleInfo.recheckMod === 'OTHER_SAMPLING') { // 其它取样
            parent.emit('openHandle', { target: 'OTHER_SAMPLING', obj: obj })
          } else { // not chose

          }
          onClose()
        }).catch(() => {
          //
        })
      } else { // 保存行为
        // 不校验
        handleSaveData('save', obj)
      }
    }, 1000)

    // 校验操作
    const checkRequiredData = () => {
      return true
    }

    //  保存操作
    const handleSaveData = async (type:string, obj:any) => {
      const back = await MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_RECHECK_TASK_INSPECT_API(obj)
      obj.taskInspectList.forEach((item:any) => {
        item.taskInspectIndexList.forEach(async (subItem:any) => {
          await INSPECT_INDEX_PROCESS_PARAMETER_UPDATE_FOR_TASK_API(subItem.updateInspectParameter)
        })
      })
      if (type !== 'save') {
        proxy.$successToast('完成提交！')
        parent.emit('openHandle', { act: 'submit', target: obj.recheckMod, obj: back })
      } else {
        proxy.$successToast('保存成功！')
        parent.emit('openHandle', { act: 'save', target: '', obj: back })
      }
      onClose()
    }

    const actHandleIndexJudgeResult = (val:any) => {
      console.log(val.inspectResult)
      console.log(val.indexStandardString)

      // const reg = /(.*)([><]=?)S([><]=?)(.*)/

      const result = /(.*)S(.*)/.exec(val.indexStandardString)
      console.log(result)
      if (result === null) {
        proxy.$warningToast('标准栏位式子错误')
        val.indexStandardString = ''
        return
      }
      if (result[1] === '' && result[2] === '') {
        proxy.$warningToast('标准栏位式子错误')
        val.indexStandardString = ''
        return
      }
      const leftResult = /(.*)([><]=?)/.exec(result[1])
      const rightResult = /([><]=?)(.*)/.exec(result[2])

      if (!leftResult) {
        val.indexInnerDown = ''
        val.innerDownSymbol = ''
      } else {
        val.indexInnerDown = leftResult[1]
        val.innerDownSymbol = leftResult[2]
      }

      if (!rightResult) {
        val.indexInnerUp = ''
        val.innerUpSymbol = ''
      } else {
        val.indexInnerUp = rightResult[2]
        val.innerUpSymbol = rightResult[1]
      }
      console.log(val)

      if (val.inspectResult && val.indexStandardString) {
        try {
          if (evil(`${result[1]}${val.inspectResult}`) && evil(`${val.inspectResult}${result[2]}`)) {
            val.indexJudgeResult = 'Y'
          } else {
            val.indexJudgeResult = 'N'
          }
        } catch (err) {
          console.log(err)
          val.indexJudgeResult = 'N'
        }
      }
    }

    const evil = (str:string) => {
      var Fn = Function
      return new Fn('return ' + str)()
    }

    const btnChangeMethodOfIndex = (index: number, target: any) => {
      target.inspectMethodCodeWhichIndex = index
      target.canShowParameterList = target.inspectMethodNameList[target.inspectMethodCodeWhichIndex].inspectParameterList.length !== 0
      target.inspectMethodCode = target.inspectMethodNameList[index].inspectMethodCode
      target.inspectMethodName = target.inspectMethodNameList[index].inspectMethodName
    }
    watch(targetOgj, (val) => {
      console.log('=== import object to dialog ===')
      console.log(val)
      state.mainObj = []
      if (val.length) {
        // 加入标题
        if (val.length === 1) {
          state.subTitle = val[0].inspectContent
          state.currentSubType = 'normal' // 一般检
        } else {
          state.subTitle = '合并'
          state.currentSubType = 'merge' // 合并检
        }
        // TODO [EB]？ 待确认 data 格式是否合并检时通用
        state.dataFormOfSampleInfo = val[0]
        console.log('state.dataFormOfSampleInfo')
        console.log(state.dataFormOfSampleInfo)
        // add id2sampleCode obj
        val.forEach((item:any) => {
          state.idToSampleCode[item.id] = item.sampleCode
          state.mainObj.push(item)
        })

        // TODO [BE]?
        MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_INSPECT_QUERY_API( // /taskInspectIndex/queryTaskInspectIndex
          val.map((item:any) => item.id)
        ).then(async (res) => {
          console.log('=== query dialog data ===')
          console.log(JSON.parse(JSON.stringify(res.data.data)))
          console.log('=== query dialog data ===')
          console.log(res.data.data)
          state.dataFormOfSampleItemUnit = res.data.data
          await state.dataFormOfSampleItemUnit.forEach(async (item) => {
            // Object.assign(item, {
            //   canEditInspectResult: item.inspectResult === ''
            // })

            if (item.indexInnerStandard !== '') {
              item.indexStandardString = `${!item.indexInnerDown ? '' : item.indexInnerDown}${!item.innerDownSymbol ? '' : item.innerDownSymbol}S${!item.innerUpSymbol ? '' : item.innerUpSymbol}${!item.indexInnerUp ? '' : item.indexInnerUp}`
            } else if (item.indexStandard !== '') {
              item.indexStandardString = `${!item.indexDown ? '' : item.indexDown}${!item.downSymbol ? '' : item.downSymbol}S${!item.upSymbol ? '' : item.upSymbol}${!item.indexUp ? '' : item.indexUp}`
            } else {
              item.indexStandardString = `${!item.indexInnerDown ? '' : item.indexInnerDown}${!item.innerDownSymbol ? '' : item.innerDownSymbol}S${!item.innerUpSymbol ? '' : item.innerUpSymbol}${!item.indexInnerUp ? '' : item.indexInnerUp}`
            }
            const temp = await INSPECT_INDEX_PROCESS_PARAMETER_QUERY_FOR_TASK_API({
              inspectMaterialCode: state.dataFormOfSampleInfo.taskInspectClassify !== 'TEMP' ? state.dataFormOfSampleInfo.inspectMaterialCode : '',
              inspectTypeId: state.dataFormOfSampleInfo.taskInspectClassify !== 'TEMP' ? state.dataFormOfSampleInfo.inspectTypeId : '',
              inspectIndexId: state.dataFormOfSampleInfo.taskInspectClassify !== 'TEMP' ? item.indexId : '',
              inspectParameterGroupId: state.dataFormOfSampleInfo.taskInspectClassify === 'TEMP' ? item.inspectParameterGroupId : ''
              // inspectMaterialCode: 'SS02050003', inspectTypeId: '659445268915179520', inspectIndexId: '1000009957', inspectParameterGroupId: ''
            })
            console.log('指标')
            console.log(temp.data.data)

            // 滤掉掉过程函数 id 是空的
            item.canShowParameterList = true
            temp.data.data.inspectMethodNameList.forEach((subItem:any) => {
              subItem.inspectParameterList = subItem.inspectParameterList.filter((element:any) => element.id !== '' && element.paramType === 'SHOW')
              if (item.inspectMethodCode === subItem.inspectMethodCode) {
                item.canEditInspectResult = subItem.inspectParameterList.length === 0 || subItem.inspectParameterList // [结果]是否可编辑
                item.canShowParameterList = subItem.inspectParameterList.length !== 0
              }
            })

            Object.assign(item, { inspectIndexStandard: temp.data.data.inspectIndexStandard, inspectMethodNameList: temp.data.data.inspectMethodNameList, inspectParameterOnlyText: '', sampleCode: state.idToSampleCode[item.taskInspectId] })

            // assign 标准值
            // if (temp.data.data.inspectIndexStandard) {
            //   if (temp.data.data.inspectIndexStandard.indexInnerStandard === '' && temp.data.data.inspectIndexStandard.indexStandard === '') {
            //     item.indexStandardString = ''
            //     item.canEditIndexStandardString = true // [标准]是否可编辑
            //   } else if (temp.data.data.inspectIndexStandard.indexInnerStandard === '') {
            //     item.indexStandardString = `${temp.data.data.inspectIndexStandard.indexUp} ${temp.data.data.inspectIndexStandard.upSymbol} S ${temp.data.data.inspectIndexStandard.downSymbol} ${temp.data.data.inspectIndexStandard.indexDown}`
            //     item.canEditIndexStandardString = false // [标准]是否可编辑
            //   } else {
            //     item.indexStandardString = `${temp.data.data.inspectIndexStandard.indexInnerUp} ${temp.data.data.inspectIndexStandard.innerUpSymbol} S ${temp.data.data.inspectIndexStandard.innerDownSymbol} ${temp.data.data.inspectIndexStandard.indexInnerDown}`
            //     item.canEditIndexStandardString = false // [标准]是否可编辑
            //   }
            // } else {
            //   item.indexStandardString = ''
            //   item.canEditIndexStandardString = true // [标准]是否可编辑
            // }

            Object.assign(item, { inspectMethodCodeWhichIndex: 0 })
            temp.data.data.inspectMethodNameList.forEach((subItem:any, index:number) => {
              if (item.inspectMethodCode === subItem.inspectMethodCode) {
                item.inspectMethodCodeWhichIndex = index
              }
            })
          })
        })
      }
    })

    watch(subType, (val) => {
      if (val) {
        state.currentSubType = val
      }
    })

    watch(mainType, (val) => {
      if (val) {
        state.currentMainType = val
      }
    })

    onMounted(async () => {
      // state.currentSubType = store.state.common.sampleObj.type
      // state.currentObj = store.state.common.sampleObj.obj

      if (!state.currentSubType) {
        tabsCloseCurrentHandle()
        proxy.$warningToast('操作过时，请重新选择！')
        gotoPage({
          path: 'qms-pages-InspectionManagement-InspectionTask-index'
        })
      } else {
      }
    })

    return {
      ...toRefs(state),
      // btn
      onClose,
      btnSaveOrSubmitDataOfInspect,
      btnChangeMethodOfIndex,
      actHandleIndexJudgeResult,
      // act
      // ref
      refFormOfSampleInfo,
      // other
      indexJudgeResult
    }
  }
})
</script>

<style lang="scss" scoped>
.btn-group {
    font-size: 12px;
    border-radius: 4px;
    border:#dcdfe6 1px solid;
    overflow: hidden;
  .btn-titm{
    background: #fff;
    min-height: 28px;
    padding: 0px 7px;
    border:none;
    box-sizing: content-box;
    color:#A5A2A5;
  }
  .btn-titm.focus{
    background: #4C7BFC;
    color:#fff;
  }
}
</style>
