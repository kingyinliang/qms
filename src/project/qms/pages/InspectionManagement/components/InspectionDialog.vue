<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-11 16:30:07
 * @LastEditors: Telliex
 * @LastEditTime: 2021-11-26 22:12:37
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
              <!-- <template #titleBtn v-if="subItem.inspectMethodCodeWhichIndex!==null|| subItem.inspectMethodCodeWhichIndex!==100 || subItem.inspectMethodNameList.length==2"> -->
              <template #titleBtn v-if="subItem.inspectMethodNameList?.length==2">
                <div class="btn-group">
                    <template v-for="(btnItem,index) in subItem.inspectMethodNameList" :key="btnItem.inspectMethodCode">
                        <button   size="mini" class="btn-titm" :class="{focus:subItem.inspectMethodCode===btnItem.inspectMethodCode}" @click="btnChangeMethodOfIndex(index,subItem)">{{btnItem.inspectMethodName.substring(0,btnItem.inspectMethodName.length-1)}}</button>
                    </template>
                </div>
              </template>
              <el-form :inline="true" :model="subItem" :label-width="cssForformLabelWidth">
                <el-form-item label="结果："  prop="inspectResult" >
                  <el-input v-model="subItem.inspectResult" size="small" oninput ="value=value.replace(/[^\-\d.]/g, '')"   class="inputWidth" placeholder="请输入" autocomplete="off" :disabled="!subItem.canEditInspectResult" @change="actHandleIndexJudgeResult(subItem)" ></el-input>
                </el-form-item>
                <el-form-item label="依据方法："  prop="indexVersionMethod" >
                  <el-input v-model="subItem.indexVersionMethod" size="small"  class="inputWidth" placeholder="" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="判定："  prop="indexJudgeResult" >
                    <el-radio v-model="subItem.indexJudgeResult" label="Y" :disabled="true">合格</el-radio>
                    <el-radio v-model="subItem.indexJudgeResult" label="N" :disabled="true">不合格</el-radio>
                </el-form-item>
                <el-form-item label="标准："  prop="indexStandardString" >
                    <el-input v-model="subItem.indexStandardString" size="small"  class="inputWidth" placeholder="e.x.1<S<10" autocomplete="off" oninput ="value=value.replace(/[^0-9S><=]/g, '')"   @change="actHandleIndexStandardString(subItem)"></el-input>
                </el-form-item>

                <el-form-item label="检验过程："  prop="" v-if="subItem.canShowParameterList">
                  <template v-if="subItem.inspectMethodNameList">
                    <template v-for="(para,index) in subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow" :key="index">
                      {{para.paramCode?para.paramCode.split('[')[0]:'?'}}<sub>{{para.paramCode?para.paramCode.split('[')[1].replace(']',''):''}}</sub> =
                      <el-input v-model="para.defaultValue" type="text"  size="small" placeholder=""  oninput ="value=value.replace(/[^\d.]/g, '').replace(/^(\d+)\.(\d\d).*$/, '$1.$2')" style="width:140px;margin-right:10px" @blur="actHandleInspectResult(subItem)">
                        <template #suffix>
                          {{para.paramUnit}}
                        </template>
                      </el-input>
                    </template>
                  </template>
                </el-form-item>

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
      <mds-area :title="'检验记录'" :name="'org'" class="info" >
        <div class="block" style="padding-top:10px">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in timeLineData"
              :key="index"
              :size="'large'"
              :color="'#467BFF'"
              :hide-timestamp="true"
            >
              <div class="time-log">
                <ul>
                  <li v-for="(element, index) in item.indexList" :key="index"><div>> <span>指标：</span><em>{{element.indexName}}</em></div><div><span>样品码：</span><em>{{element.sampleCode}}</em></div><div><span>结果：</span><em :style="{color:element.indexJudgeResult==='N'?'#ff0000':'inherit'}">{{element.inspectResult}}</em></div></li>
                </ul>
              </div>
              <template #dot>
                <div class="dot">
                  {{item.indexList.length-index-1}}
                </div>
              </template>
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

import expreval from 'expr-eval'

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
  timeLineData: any[]
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

    const Parser = expreval.Parser
    const parser = new Parser()

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
      timeLineData: [
        {
          indexName: 'Custom icon',
          indexList: [
            {
              indexName: 'Custom icon',
              sampleCode: '2222',
              inspectResult: '33333',
              indexJudgeResult: 'N'
            },
            {
              indexName: 'Custom icon',
              sampleCode: '2222',
              inspectResult: '33333',
              indexJudgeResult: 'N'
            },
            {
              indexName: 'Custom icon',
              sampleCode: '2222',
              inspectResult: '33333',
              indexJudgeResult: 'Y'
            }
          ]
        },
        {
          indexName: 'Custom icon',
          indexList: [
            {
              indexName: 'Custom icon',
              sampleCode: '2222',
              inspectResult: '33333',
              indexJudgeResult: 'N'
            },
            {
              indexName: 'Custom icon',
              sampleCode: '2222',
              inspectResult: '33333',
              indexJudgeResult: 'N'
            },
            {
              indexName: 'Custom icon',
              sampleCode: '2222',
              inspectResult: '33333',
              indexJudgeResult: 'Y'
            }
          ]
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
        console.log('888888888888')
        console.log(item)

        // 处理不等式
        if (item.indexStandardString !== '') {
          const result = /(.*)S(.*)/.exec(item.indexStandardString)
          console.log(result)
          if (result !== null) {
            if (item.inspectIndexStandard.indexInnerStandard === '' && item.inspectIndexStandard.indexStandard === '') {
              // ?????
              item.indexInnerStandard = ''
              item.indexStandard = ''
            } else if (item.inspectIndexStandard.indexStandard !== '') {
              item.indexInnerStandard = ''
              item.indexStandard = item.inspectIndexStandard.indexStandard
            } else {
              item.indexInnerStandard = item.inspectIndexStandard.indexInnerStandard
              item.indexStandard = ''
            }

            const leftResult = /(.*)([<]=?)/.exec(result[1])
            const rightResult = /([<]=?)(.*)/.exec(result[2])

            if (!leftResult) {
              if (item.inspectIndexStandard.indexInnerStandard === '' && item.inspectIndexStandard.indexStandard === '') {
                item.indexInnerDown = null
                item.innerDownSymbol = ''
              } else if (item.inspectIndexStandard.indexStandard !== '') {
                item.indexDown = null
                item.downSymbol = ''
              } else {
                item.indexInnerDown = null
                item.innerDownSymbol = ''
              }
            } else {
              if (item.inspectIndexStandard.indexInnerStandard === '' && item.inspectIndexStandard.indexStandard === '') {
                item.indexInnerDown = leftResult[1]
                item.innerDownSymbol = leftResult[2].replace('<', '>')
              } else if (item.inspectIndexStandard.indexStandard !== '') {
                item.indexDown = leftResult[1]
                item.downSymbol = leftResult[2].replace('<', '>')
              } else {
                item.indexInnerDown = leftResult[1]
                item.innerDownSymbol = leftResult[2].replace('<', '>')
              }
            }
            if (!rightResult) {
              if (item.inspectIndexStandard.indexInnerStandard === '' && item.inspectIndexStandard.indexStandard === '') {
                item.indexInnerUp = null
                item.innerUpSymbol = ''
              } else if (item.indexStandard !== '') {
                item.indexUp = null
                item.upSymbol = ''
              } else {
                item.indexInnerUp = null
                item.innerUpSymbol = ''
              }
            } else {
              if (item.inspectIndexStandard.indexInnerStandard === '' && item.inspectIndexStandard.indexStandard === '') {
                item.indexInnerUp = rightResult[2]
                item.innerUpSymbol = rightResult[1]
              } else if (item.inspectIndexStandard.indexStandard !== '') {
                item.indexUp = rightResult[2]
                item.upSymbol = rightResult[1]
              } else {
                item.indexInnerUp = rightResult[2]
                item.innerUpSymbol = rightResult[1]
              }
            }
          } else {
            item.indexUp = null
            item.upSymbol = ''
            item.indexInnerUp = null
            item.innerUpSymbol = ''
            item.indexDown = null
            item.downSymbol = ''
            item.indexDown = null
            item.downSymbol = ''
            item.indexInnerStandard = ''
            item.indexStandard = ''
          }
        }

        // 处理过程参数
        if (item.inspectMethodNameList.length) {
          item.inspectMethodNameList[item.inspectMethodCodeWhichIndex].inspectParameterList.forEach((subItem:any) => {
            if (subItem.paramType !== '') {
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
            }
          })
        }

        item.updateInspectParameter = tempUpdateInspectParameter
        item.taskInspectPhysicalList = tempTaskInspectPhysicalList
      })

      // 处理合并检
      tempTaskInspectList.forEach((item:any) => {
        item.taskStatus = type === 'save' ? 'CHECKING' : 'COMPLETED'
        item.taskStatusName = type === 'save' ? '检验中' : '已完成'
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
      if (val.inspectResult === '') {
        val.indexJudgeResult = 'N'
      } else {
        if (val.indexStandardString === '' && val.inspectResult !== '') {
          proxy.$infoToast('请输入标准公式')
          return
        }
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
    }

    const actHandleIndexStandardString = (val:any) => {
      if (val.indexStandardString === '') {
        val.indexJudgeResult = 'N'
      } else {
        if (val.inspectResult === '' && val.indexStandardString !== '') {
          proxy.$infoToast('请输入结果栏位')
          return
        }
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
    }

    const evil = (str:string) => {
      var Fn = Function
      return new Fn('return ' + str)()
    }

    // 切换检验方法
    const btnChangeMethodOfIndex = (index: number, target: any) => {
      console.log('target')
      console.log(target)
      // 1. 该方法下一定要有过程参数 data
      // 2. 同方法不做再点击
      if (target.inspectMethodNameList.length) { // 1.
        if (target.inspectMethodCodeWhichIndex !== index) { // 2.
          console.log('come in')
          target.inspectMethodCodeWhichIndex = index
          target.inspectMethodCode = target.inspectMethodNameList[index].inspectMethodCode
          target.inspectMethodName = target.inspectMethodNameList[index].inspectMethodName
          target.canShowParameterList = target.inspectMethodNameList[index].inspectParameterListShow.length !== 0

          if (!target.inspectMethodNameList[index].inspectParameterListShow.length) {
            proxy.$infoToast(`${target.indexName}-${target.inspectMethodName}没有过程参数`)
          }

          // 设定结果值

          if (target.inspectMethodNameList[index].inspectParameterListResult.length) {
            target.filnalFormula = string2Formula(target.inspectMethodNameList[index].inspectParameterListResult[0].formulaDisplay)
          } else {
            target.filnalFormula = ''
          }
          target.canEditInspectResult = chechCanEditInspectResultOfData(target.inspectMethodNameList[target.inspectMethodCodeWhichIndex]) || chechCanEditInspectResultOfFormula(target.filnalFormula, target.inspectMethodNameList[index].inspectParameterListResult[0].formula) // [结果]是否可编辑
        }
      } else {
        target.inspectMethodCodeWhichIndex = 100
        target.inspectMethodCode = ''
        target.inspectMethodName = ''
        target.canShowParameterList = false
      }

      // 设定标准不等式
      // joint
      // if (Object.keys(target.inspectIndexStandard).length) {
      //   target.indexStandardString = joint(target.inspectIndexStandard)
      // }
    }
    watch(targetOgj, (val) => {
      console.log('=== import object to dialog ===')
      console.log(val)
      state.mainObj = []
      val.forEach((item:any) => {
        state.idToSampleCode[item.id] = item.sampleCode
        state.mainObj.push(item)
      })
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
        // add id2sampleCode obj

        // TODO [BE]?
        MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_INSPECT_QUERY_API( // /taskInspectIndex/queryTaskInspectIndex
          val.map((item:any) => item.id)
        ).then(async (res) => {
          console.log('=== query dialog data ===')
          console.log(res.data.data)
          state.dataFormOfSampleItemUnit = JSON.parse(JSON.stringify(res.data.data))

          await state.dataFormOfSampleItemUnit.forEach(async (item) => {
            // 获取指标
            const tempIndex = await INSPECT_INDEX_PROCESS_PARAMETER_QUERY_FOR_TASK_API({
              inspectMaterialCode: state.dataFormOfSampleInfo.taskInspectClassify !== 'TEMP' ? state.dataFormOfSampleInfo.inspectMaterialCode : '',
              inspectTypeId: state.dataFormOfSampleInfo.taskInspectClassify !== 'TEMP' ? state.dataFormOfSampleInfo.inspectTypeId : '',
              inspectIndexId: state.dataFormOfSampleInfo.taskInspectClassify !== 'TEMP' ? item.indexId : '',
              inspectParameterGroupId: state.dataFormOfSampleInfo.taskInspectClassify === 'TEMP' ? item.inspectParameterGroupId : ''
              // inspectMaterialCode: 'SS02050003', inspectTypeId: '659445268915179520', inspectIndexId: '1000009957', inspectParameterGroupId: ''
            })
            console.log('指标')
            console.log(tempIndex.data.data)

            // 指标栏位初始化
            Object.assign(item, {
              canShowParameterList: false, // 过程参数是否显示
              canEditInspectResult: true, // 结果是否可编辑
              filnalFormula: '', // 公式值
              inspectMethodCodeWhichIndex: 100 // 预设的方法的 index
            })
            item.indexJudgeResult = 'N'

            if (tempIndex.data.data.inspectMethodNameList.length === 0) {
              item.canShowParameterList = false
            }

            tempIndex.data.data.inspectMethodNameList.forEach((subItem:any, index:number) => {
              Object.assign(subItem, { // 滤掉 id 为空
                inspectParameterListShow: subItem.inspectParameterList.filter((element:any) => element.id !== '' && element.paramType === 'SHOW'),
                inspectParameterListHidden: subItem.inspectParameterList.filter((element:any) => element.id !== '' && element.paramType === 'HIDDEN'),
                inspectParameterListResult: subItem.inspectParameterList.filter((element:any) => element.id !== '' && element.paramType === 'RESULT')
              })

              if (item.inspectMethodCode === subItem.inspectMethodCode) { // 带出预设的方法与过程参数
                if (subItem.inspectParameterListResult.length) {
                  item.filnalFormula = string2Formula(subItem.inspectParameterListResult[0].formulaDisplay)
                } else {
                  item.filnalFormula = ''
                }

                item.canEditInspectResult = chechCanEditInspectResultOfData(subItem) || chechCanEditInspectResultOfFormula(item.filnalFormula, subItem.inspectParameterListResult[0].formula) // [结果]是否可编辑
                item.canShowParameterList = subItem.inspectParameterListShow.length !== 0
                item.inspectMethodCodeWhichIndex = index
              }
            })

            Object.assign(item, {
              inspectIndexStandard: tempIndex.data.data.inspectIndexStandard,
              inspectMethodNameList: tempIndex.data.data.inspectMethodNameList,
              inspectParameterOnlyText: '',
              sampleCode: state.idToSampleCode[item.taskInspectId]
            })

            // 拼标准不等式 (需先有inspectIndexStandard)
            if (item.indexInnerStandard === '' && item.indexStandard === '') {
              if (item.inspectIndexStandard && Object.keys(item.inspectIndexStandard).length) {
                item.indexStandardString = joint(item.inspectIndexStandard)
              } else { // 可能 inspectIndexStandard 是 null
                item.indexStandardString = ''
              }
            } else {
              item.indexStandardString = joint(item)
            }

            // 指标预设没有方法时，预设套入第一笔
            if (item.inspectMethodCode === '') {
              btnChangeMethodOfIndex(0, item)
            }
          })
          console.log('state.dataFormOfSampleItemUnit')
          console.log(state.dataFormOfSampleItemUnit)
        })
      }
    })

    // [ACT]拼接不等式
    const joint = (obj:any) => {
      let indexStandardString = ''

      if (obj.indexInnerStandard !== '') {
        indexStandardString = `${!obj.indexInnerDown ? '' : obj.indexInnerDown}${!obj.innerDownSymbol ? '' : obj.innerDownSymbol.replace('>', '<')}S${!obj.innerUpSymbol ? '' : obj.innerUpSymbol}${!obj.indexInnerUp ? '' : obj.indexInnerUp}`
      } else if (obj.indexStandard !== '') {
        indexStandardString = `${!obj.indexDown ? '' : obj.indexDown}${!obj.downSymbol ? '' : obj.downSymbol.replace('>', '<')}S${!obj.upSymbol ? '' : obj.upSymbol}${!obj.indexUp ? '' : obj.indexUp}`
      } else {
        indexStandardString = ''
      }

      return indexStandardString
    }

    const chechCanEditInspectResultOfData = (subItem:any) => {
      if (subItem.inspectParameterListShow.length === 0) {
        return true
      }

      if (!subItem.inspectParameterListResult.length) {
        return true
      }

      if (subItem.inspectParameterListResult.length && subItem.inspectParameterListResult[0].formula === '') {
        return true
      }
      return false
    }

    const chechCanEditInspectResultOfFormula = (formulaString:string, args:string) => {
      if (formulaString === '') { // 公式不能為空
        return false
      }
      const transList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      const tempDepend = args.split(',')

      for (let i = 0; i < tempDepend.length; i++) {
        formulaString = formulaString.replace(`/${tempDepend[i]}/ig`, transList[i])
      }
      console.log(formulaString)

      // 公式错误表示可编辑
      let result = false
      try {
        parser.parse(formulaString)
      } catch (err) {
        console.log('error')
        result = true
      }
      return result
    }

    /* 用正则表达式实现html解码（反转义）（另一种写法） */
    const escape2Html = (str:string) => {
      const arrEntiries:any = { '&lt;': '<', '&gt;': '>', '&nbsp': ' ', '&amp;': '&', '&quot;': '"' }
      return str.replace(/(&lt|&gt|&nbsp|&amp|&quot);/ig, (c:string) => { return arrEntiries[c] as string })
    }

    const string2Formula = (str:string) => {
      const formulaList = escape2Html(str).split(',')
      let formulaLine = ''
      formulaList.forEach(item => {
        const result1 = /<span style="padding:2px 4px;">(.*)<sub>(.*)<\/sub><\/span>/.exec(item)
        const result2 = /<span style="padding:2px 4px;">(.*)<\/span>/.exec(item)

        if (item.indexOf('<sub>') === -1) {
          if (result2 !== null) {
            formulaLine += result2[1]
          }
        } else {
          if (result1 !== null) {
            formulaLine += `${result1[1]}[${result1[2]}] `
          }
        }
      })

      return formulaLine
    }

    const actHandleInspectResult = (subItem:any) => {
      console.log(subItem)
      // 1.
      if (subItem.canEditInspectResult === false && chechCanEditInspectResultOfFormula(subItem.filnalFormula, subItem.inspectParameterListResult[0].formula)) {
        const result = runFormula(subItem.filnalFormula,
          subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex].inspectParameterListResult[0].formula,
          subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex].inspectParameterListShow,
          subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex].inspectParameterListHidden)
        if (!result) {
          subItem.inspectResult = 0
          subItem.canEditInspectResult = true
        } else {
          subItem.inspectResult = result
          subItem.canEditInspectResult = false
        }
      }
      // TODO  wait remove
      // runFormula(subItem.filnalFormula,
      //   subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex].inspectParameterListResult[0].formula,
      //   subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex].inspectParameterListShow,
      //   subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex].inspectParameterListHidden)
    }

    // 根据公式计算结果
    const runFormula = (formula:string, depend:string, showValue:any[], hiddenValue:any[]) => {
      const transList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      const tempDepend = depend.split(',')
      let tempFormula = formula
      const valueList = new Array(tempDepend.length)
      console.log(formula)
      console.log(depend)
      console.log(showValue)
      console.log(hiddenValue)

      const importValue:any = {}

      tempDepend.forEach((item, index) => {
        tempFormula = tempFormula.replace(`/${item}/ig`, transList[index])
        showValue.forEach(subItem => {
          if (item === subItem.paramCode) {
            importValue[transList[index]] = !subItem.defaultValue ? 0 : Number(subItem.defaultValue)
            valueList[index] = !subItem.defaultValue ? 0 : Number(subItem.defaultValue)
          }
        })
      })

      tempDepend.forEach((item, index) => {
        if (hiddenValue.length) {
          hiddenValue.forEach(subItem => {
            if (item === subItem.paramCode) {
              const value = importValue[transList[index]]
              subItem.inspectAssociateList.forEach((element:any) => {
                if (element.associate === value) {
                  importValue[transList[index]] = !element.value ? 0 : Number(element.value)
                  valueList[index] = !element.value ? 0 : Number(element.value)
                } else {
                  // 没找到话,提示错误
                  proxy.$warningToast('没有相关的参数，无法计算，请手动输入结果')
                }
              })
            }
          })
        }
      })

      let expr:any
      let result:any

      try {
        expr = parser.parse(formula)
        result = expr.evaluate(importValue)
      } catch (err) {
        proxy.$warningToast('公式错误，无法计算。请改手动输入结果，以进行判定')
        result = null
      }
      return result
    }

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
      actHandleIndexStandardString,
      actHandleInspectResult,
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
.time-log{

  ul{
    list-style: none;
    display: flex;
    flex-direction: row;
    flex-wrap:wrap;
    li{
      display: flex;
      margin-bottom: 10px;
      flex-direction: row;
      margin-right:10px;
      justify-content: space-between;
      div{
        text-align: left;
        width: 150px;
      }
    }
  }

}
.dot{

    border-radius: 10px;
    background: rgb(238, 238, 238);
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-left: -5px;
    margin-top: -4px;
    text-align: center;

}
</style>
