<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-11 16:30:07
 * @LastEditors: Telliex
 * @LastEditTime: 2021-12-13 16:03:30
-->
<template>
  <el-dialog :title="title" v-model="isDialogShow" width="90%" @close="onClose">
  <h2 style="font-size:20px;text-align:center;">{{subTitle}}</h2>
  <mds-area class="info" style="height:60vh;overflow:auto">
    <mds-area :title="infoSubTitle" :name="'org'" class="info" style="margin-bottom:0">
        <el-form :inline="true" ref="refFormOfSampleInfo" :model="dataFormOfSampleInfo" :label-width="cssForformLabelWidth">
          <el-form-item label="检验任务："  prop="inspectContent" v-if="currentMainType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectContent" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectContent">
              <el-input v-model="dataFormOfSampleInfo.inspectContent" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="取样部门："  prop="sampleDeptName" v-if="currentMainType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleDeptName" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleDeptName">
              <el-input v-model="dataFormOfSampleInfo.sampleDeptName" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="检验物料："  prop="inspectMaterialNameString" v-if="currentMainType==='PROCESS'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectMaterialNameString" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectMaterialNameString">
              <el-input v-model="dataFormOfSampleInfo.inspectMaterialNameString" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="取样信息："  prop="inspectSiteNameString" v-if="currentMainType==='PROCESS'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectSiteNameString" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectSiteNameString">
              <el-input v-model="dataFormOfSampleInfo.inspectSiteNameString" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <!-- <el-form-item label="取样消息："  prop="sampleExplain" >
            <el-input v-model="dataFormOfSampleInfo.sampleExplain" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" ></el-input>
          </el-form-item> -->
        </el-form>
    </mds-area>

    <mds-area :title="'检验录入'" :name="'org'" >
      <template v-for="subItem in dataFormOfSampleItemUnit" :key="subItem">
        <mds-area :title="subItem.moreThan1Index? subItem.indexName+' ('+subItem.sampleCode+')': subItem.indexName " :name="'org'" :outline="true">
          <!-- <template #titleBtn v-if="subItem.inspectMethodCodeWhichIndex!==null|| subItem.inspectMethodCodeWhichIndex!==100 || subItem.inspectMethodNameList.length==2"> -->
          <template #titleBtn v-if="subItem.inspectMethodNameList?.length==2">
            <div class="btn-group">
                <template v-for="(btnItem,index) in subItem.inspectMethodNameList" :key="btnItem.inspectMethodCode">
                    <button   size="mini" class="btn-titm" :class="{focus:subItem.inspectMethodCode===btnItem.inspectMethodCode}" @click="btnChangeMethodOfIndex(index,subItem)">{{btnItem.inspectMethodName.substring(0,btnItem.inspectMethodName.length-1)}}</button>
                </template>
            </div>
          </template>
          <el-form :inline="true" :model="subItem" :label-width="cssForformLabelWidth">
            <el-form-item label="结果："  prop="inspectResult" label-width="70px">
              <el-tooltip class="item" effect="dark" :content="subItem.inspectResult" placement="top-start" :disabled="!subItem.inspectResult">
                <el-input v-model="subItem.inspectResult" size="small"   class="inputWidth" placeholder="请输入" autocomplete="off" :disabled="!subItem.canEditInspectResult" @change="actHandleIndexJudgeResult(subItem)" ></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="依据方法："  prop="indexVersionMethod" >
              <el-tooltip class="item" effect="dark" :content="subItem.indexVersionMethod" placement="top-start" :disabled="!subItem.indexVersionMethod">
                <el-input v-model="subItem.indexVersionMethod" size="small"  class="inputWidth" placeholder="" autocomplete="off" :disabled="true"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="判定："  prop="indexJudgeResult" label-width="70px" >
               <el-radio-group v-model="subItem.indexJudgeResult" :disabled="!subItem.canEditIndexStandardString">
                  <el-radio label="Y">合格</el-radio>
                  <el-radio label="N">不合格</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="标准："  prop="indexStandardString" label-width="70px" >
              <el-tooltip class="item" effect="dark" :content="subItem.indexStandardString" placement="top-start" :disabled="!subItem.indexStandardString">
                <el-input v-model="subItem.indexStandardString" size="small"  class="inputWidth" placeholder="请输入" autocomplete="off" :disabled="!subItem.canEditIndexStandardString" ></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="检验时间："  prop="inspectIndexDate" v-if="subItem.inspectIndexDate">
              <div ><span>检验时间:</span>{{!subItem.inspectIndexDate?'':subItem.inspectIndexDate}}</div>
            </el-form-item>
          </el-form>
          <el-form  :model="subItem" :label-width="cssForformLabelWidth">
            <el-form-item label="检验过程："  prop="" v-if="subItem.canShowParameterList" style="margin-top:10px">
              <div class="fixlocation">
                <template v-if="subItem.inspectMethodNameList">
                  <template v-for="(para,index) in subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow" :key="index">
                    <div class="subitem" v-if="para.paramDataType==='INTEGER'" :style="{
                      width:`calc((100%)/${subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length>=6?6:subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length})`,
                      minWidth: `calc((100%)/${subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length>=6?6:subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length})`,
                      maxWidth:`calc((100%)/${subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length>=6?6:subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length})`
                      }">
                      <span style="min-width:50px;overflow: hidden;text-align: right;padding-right:5px;white-space: nowrap;">{{para.paramCode?para.paramCode.split('[')[0]:'?'}}<sub>{{para.paramCode?para.paramCode.split('[')[1].replace(']',''):''}}</sub> </span>=
                      <el-tooltip  class="item" effect="dark" :content="para.defaultValue" placement="top-start" :disabled="!para.defaultValue">
                        <el-input  v-model="para.defaultValue" type="text" :maxlength="para.paramStandard" size="small"  placeholder="" oninput="value=value.replace(/[^\d]/g,'')"  style="margin-right:10px;margin-left:5px;" @blur="actHandleInspectResult(subItem)">
                          <template #suffix>
                            {{para.paramUnit}}
                          </template>
                        </el-input>
                      </el-tooltip>
                    </div>
                    <div class="subitem" v-else-if="para.paramDataType==='FLOAT_POINT'" :style="{
                      width:`calc((100%)/${subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length>=6?6:subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length})`,
                      minWidth: `calc((100%)/${subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length>=6?6:subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length})`,
                      maxWidth:`calc((100%)/${subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length>=6?6:subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length})`
                      }">
                      <span style="min-width:50px;overflow: hidden;text-align: right;padding-right:5px;white-space: nowrap;"> {{para.paramCode?para.paramCode.split('[')[0]:'?'}}<sub>{{para.paramCode?para.paramCode.split('[')[1].replace(']',''):''}}</sub> </span>=
                      <el-tooltip  class="item" effect="dark" :content="para.defaultValue" placement="top-start" :disabled="!para.defaultValue">
                        <el-input v-model="para.defaultValue" type="text" size="small" placeholder="" oninput ="value=value.replace(/[^\-\d.]/g, '').replace(/^(\d+)\.(\d+).*$/, '$1.$2')"  style="margin-right:10px;margin-left:5px;" @blur="actHandleInspectResult(subItem)">
                          <template #suffix>
                            {{para.paramUnit}}
                          </template>
                        </el-input>
                      </el-tooltip>
                    </div>
                    <div class="subitem" v-else :style="{
                      width:`calc((100%)/${subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length>=6?6:subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length})`,
                      minWidth: `calc((100%)/${subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length>=6?6:subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length})`,
                      maxWidth:`calc((100%)/${subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length>=6?6:subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length})`
                      }">
                      <span style="min-width:50px;overflow: hidden;text-align: right;padding-right:5px;white-space: nowrap;">{{para.paramCode?para.paramCode.split('[')[0]:'?'}}<sub>{{para.paramCode?para.paramCode.split('[')[1].replace(']',''):''}}</sub> </span>=
                      <el-tooltip  class="item" effect="dark" :content="para.defaultValue" placement="top-start" :disabled="!para.defaultValue">
                        <el-input  v-model="para.defaultValue" size="small" placeholder=""  type="text" style="margin-right:10px;margin-left:5px;" @blur="actHandleInspectResult(subItem)">
                          <template #suffix>
                            {{para.paramUnit}}
                          </template>
                        </el-input>
                      </el-tooltip>
                    </div>
                  </template>
                </template>
              </div>
            </el-form-item>
          </el-form>
        </mds-area>
      </template>
    </mds-area>
    <el-form :inline="true" :model="dataFormOfSampleInfo"  :label-width="cssForformLabelWidth" >
      <el-form-item label="综合判定："  prop="indexJudgeResult" >
        <el-radio-group v-model="indexJudgeResult">
          <el-radio label="Y" :disabled="true">合格</el-radio>
          <el-radio label="N" :disabled="true">不合格</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="检验说明："  prop="inspectExplain" >
        <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectExplain" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectExplain">
          <el-input v-model="dataFormOfSampleInfo.inspectExplain" size="small"  class="inputWidth" placeholder="请输入" autocomplete="off" style="width:540px"></el-input>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-form :inline="true"  :model="dataFormOfSampleInfo"  :label-width="cssForformLabelWidth" >
      <el-form-item label="复检方式："  prop="recheckMod" >
        <el-radio-group v-model="dataFormOfSampleInfo.recheckMod">
          <el-radio label="ORIGINAL_RECHECK" @click.prevent="actChangeByRecheckMod('ORIGINAL_RECHECK')" >原样复检</el-radio>
          <el-radio label="RESAMOLING" @click.prevent="actChangeByRecheckMod('RESAMOLING')">取样复检</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="取样说明："  prop="sampleExplain">
        <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleExplain" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleExplain">
          <el-input v-model="dataFormOfSampleInfo.sampleExplain" size="small" class="inputWidth" placeholder="请输入" autocomplete="off" style="width:500px"></el-input>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <mds-area :title="'检验记录'" :name="'org'" class="info" v-if="timeLineDataForRecheck.length">
      <div class="block" style="padding-top:10px">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in timeLineDataForRecheck"
            :key="index"
            :size="'large'"
            :color="'#467BFF'"
            :hide-timestamp="true"
          >
          <h4 style="margin-bottom:10px;">检验说明 : </h4>
            <div class="time-log">
              <ul class="fixlocation">
                <!-- <li v-for="(element, index) in item.indexList" :key="index"><div>> <span>指标：</span><em>{{element.indexName}}</em></div><div><span>样品码：</span><em>{{element.sampleCode}}</em></div><div><span>结果：</span><em :style="{color:element.indexJudgeResult==='N'?'#ff0000':'inherit'}">{{element.inspectResult}}</em></div></li> -->
                <li v-for="(element, index) in item.indexList" :key="index" class="subelement" ><div>{{`${element.indexName} (${element.sampleCode})`}}<em :style="{marginLeft:'10px',color:element.indexJudgeResult==='N'?'#ff0000':'inherit'}">{{element.inspectResult}}</em></div></li>

              </ul>
            </div>
            <template #dot>
              <div class="dot">
                {{timeLineDataForRecheck.length-index}}
              </div>
            </template>
          </el-timeline-item>
        </el-timeline>
      </div>
    </mds-area>
    <mds-area :title="'检验记录'" :name="'org'" class="info" v-if="timeLineDataForGroup.length">
      <div class="block" style="padding-top:10px">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in timeLineDataForGroup"
            :key="index"
            :size="'large'"
            :color="'#467BFF'"
            :hide-timestamp="true"
          >
          <h4 style="margin-bottom:10px;">检验说明 : </h4>
            <div class="time-log">
              <ul class="fixlocation">
                <!-- <li v-for="(element, index) in item.indexList" :key="index"><div>> <span>指标：</span><em>{{element.indexName}}</em></div><div><span>样品码：</span><em>{{element.sampleCode}}</em></div><div><span>结果：</span><em :style="{color:element.indexJudgeResult==='N'?'#ff0000':'inherit'}">{{element.inspectResult}}</em></div></li> -->
                <li v-for="(element, index) in item.indexList" :key="index" class="subelement" ><div>{{`${element.indexName} (${element.sampleCode})`}}<em :style="{marginLeft:'10px',color:element.indexJudgeResult==='N'?'#ff0000':'inherit'}">{{element.inspectResult}}</em></div></li>

              </ul>
            </div>
            <template #dot>
              <div class="dot">
                {{timeLineDataForGroup.length-index}}
              </div>
            </template>
          </el-timeline-item>
        </el-timeline>
      </div>
    </mds-area>
    <div style="display: flex; margin:0;justify-content: flex-end;">
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
  INSPECT_INDEX_PROCESS_PARAMETER_UPDATE_FOR_TASK_API, // 基础数据-[指标检验方法明细][过程参数]- 检验编辑 /inspectParameter/updateInspectParameter
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_FORM_QUERY_API // 检验管理-[检验任务]- 检验表单查询 /taskInspect/formTaskInspect
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
  timeLineDataForRecheck: any[]
  timeLineDataForGroup: any[]
  idToSampleCode: any
  mainObj:any[]
  formForTaskAdd: any
  currentOrderStyle: string
  tempRecheckMod: string
}

interface Props{
  dialogVisible: boolean
  targetObj: any
  subType: string
  mainType: string
}

export default defineComponent({
  name: 'InspectionManagementDialogIndex',
  emits: ['on-close', 'on-confirm', 'openHandle'],
  components: {
  },

  props: {
    targetObj: {
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
    const { targetObj, dialogVisible, subType, mainType } = toRefs(props as Props)
    const parent = { ...context }

    // const { gotoPage, tabsCloseCurrentHandle } = layoutTs()

    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any

    const refFormOfSampleInfo = ref()

    const Parser = expreval.Parser
    const parser = new Parser()

    /**  == 变量 ==
    / currentSubType: 标示 一般检 or 合并检
    **/
    const state = reactive<State>({
      isDialogShow: dialogVisible.value,
      title: '样品检验',
      subTitle: '',
      currentMainType: '',
      currentSubType: 'normal', // normal, merge
      currentOrderStyle: 'first',
      currentObj: {},
      infoSubTitle: '样品信息',
      onlyRead: true,
      cssForformLabelWidth: '100px',
      dataFormOfSampleInfo: {},
      idToSampleCode: {},
      mainObj: [],
      formForTaskAdd: {},
      dataFormOfSampleItemUnit: [],
      tempRecheckMod: '',
      timeLineDataForRecheck: [],
      timeLineDataForGroup: []
    })

    // Run 判定总结果
    const indexJudgeResult = computed(() => state.dataFormOfSampleItemUnit.every(item => item.indexJudgeResult === 'Y') ? 'Y' : 'N')

    // [BTN:取消]
    const onClose = () => {
      parent.emit('on-close')
    }

    // TODO
    // [BTN:保存][BTN:提交] transfor
    const btnSaveOrSubmitDataOfInspect = _.debounce(async (type:string) => {
      // 综合判定
      state.dataFormOfSampleInfo.indexJudgeResult = indexJudgeResult.value
      state.dataFormOfSampleInfo.judgeResult = indexJudgeResult.value

      const tempTaskInspectList = JSON.parse(JSON.stringify(state.mainObj))
      const tempTaskInspectIndexList = JSON.parse(JSON.stringify(state.dataFormOfSampleItemUnit))

      tempTaskInspectIndexList.forEach((item:any) => {
        console.log('every item')
        console.log(item)
        const tempTaskInspectPhysicalList: any[] = []
        const tempUpdateInspectParameter: any[] = []

        if (item.canEditInspectResult) {
          item.manualFlag = 'Y'
          // item.canChangeAgainWithProcessParameter = false // 标示是否过程参数改变触发
        }

        // 处理不等式
        if (item.indexStandardString !== '') {
          if (item.manualStandard !== '') {
            item.manualStandard = item.indexStandardString
          } else {
            if (item.indexInnerStandard) {
              //
            } else if ((item.indexInnerDown && item.innerDownSymbol) && (item.innerUpSymbol && item.indexInnerUp)) {
              //
            } else if (item.indexInnerDown && item.innerDownSymbol) {
              //
            } else if (item.innerUpSymbol && item.indexInnerUp) {
              //
            } else if (item.indexStandard) {
              //
            } else if ((item.indexDown && item.downSymbol) && (item.upSymbol && item.indexUp)) {
              //
            } else if (item.indexDown && item.downSymbol) {
              //
            } else if (item.upSymbol && item.indexUp) {
              //
            } else {
              if (item.inspectIndexStandard) {
                item.indexInnerStandard = item.inspectIndexStandard.indexInnerStandard
                item.indexInnerDown = item.inspectIndexStandard.indexInnerDown
                item.innerDownSymbol = item.inspectIndexStandard.innerDownSymbol
                item.innerUpSymbol = item.inspectIndexStandard.innerUpSymbol
                item.indexInnerUp = item.inspectIndexStandard.indexInnerUp
                item.upSymbol = item.inspectIndexStandard.upSymbol
                item.indexDown = item.inspectIndexStandard.indexDown
                item.downSymbol = item.inspectIndexStandard.downSymbol
                item.indexUp = item.inspectIndexStandard.indexUp
                item.indexStandard = item.inspectIndexStandard.indexStandard
              } else {
                item.manualStandard = item.indexStandardString
              }
            }
          }
        }

        // 处理过程参数
        if (item.inspectMethodNameList.length) {
          item.inspectMethodNameList[item.inspectMethodCodeWhichIndex].inspectParameterList.forEach((subItem:any) => {
            if (subItem.paramType !== '') {
              tempTaskInspectPhysicalList.push({
                id: item.taskInspectPhysicalList.filter((element:any) => element.paramCode === subItem.paramCode).length ? item.taskInspectPhysicalList.filter((element:any) => element.paramCode === subItem.paramCode)[0].id : '',
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

      const tempRes:any[] = []
      tempTaskInspectIndexList.forEach((element:any) => {
        element.taskInspectIndexIdList.forEach((subElement:any, subElementIndex:number) => {
          const copyItem = JSON.parse(JSON.stringify(element))
          copyItem.id = subElement
          copyItem.taskInspectId = element.taskInspectIdList[subElementIndex]
          copyItem.sampleCode = state.idToSampleCode[copyItem.taskInspectId]
          tempRes.push(copyItem)
        })
      })

      // 处理合并检标示
      tempTaskInspectList.forEach((item:any, index:number) => {
        item.taskStatus = type === 'save' ? 'CHECKING' : 'COMPLETED'
        item.taskStatusName = type === 'save' ? '检验中' : '已完成'
        item.taskInspectIndexList = tempRes.filter((element:any) => element.sampleCode === item.sampleCode)
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
        if (state.dataFormOfSampleInfo.indexJudgeResult === 'N' && state.dataFormOfSampleInfo.recheckMod === '') {
          console.log('22222222')
          console.log('state.dataFormOfSampleInfo.indexJudgeResult')
          console.log(state.dataFormOfSampleInfo.indexJudgeResult)
          console.log('state.dataFormOfSampleInfo.recheckMod')
          console.log(state.dataFormOfSampleInfo.recheckMod)
          proxy.$confirm('此样品检验不合格，未执行复检，请确认是否继续校验？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(async (val:string) => {
            if (val === 'confirm') {
              // 需校验
              if (checkRequiredData(state.dataFormOfSampleItemUnit)) { // check the required
                finalRunCheck(state.dataFormOfSampleItemUnit) // run count one time
                console.log('pass')
                handleSaveData('submit', obj)
              }
            }
          // onClose()
          }).catch(() => {
          //
          })
        } else {
          proxy.$confirm('确认是否继续校验？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async (val:string) => {
            if (val === 'confirm') {
              // 需校验
              if (checkRequiredData(state.dataFormOfSampleItemUnit)) { // check the required
                finalRunCheck(state.dataFormOfSampleItemUnit) // run count one time
                handleSaveData('submit', obj)
              }
            } else {
              handleSaveData('save', obj)
            }
          // onClose()
          }).catch(() => {
          //
          })
        }
      } else { // 保存行为
        // 不校验
        handleSaveData('save', obj)
      }
    }, 1000)

    // 必填校验操作（初检，复检）
    const checkRequiredData = (obj:any) => {
      let tempReturn = true

      if (state.currentOrderStyle === 'first') { // 初检
        console.log('first')
        obj.forEach((item:any) => {
          if (item.inspectResult === '' || item.indexJudgeResult === '' || item.indexStandardString === '') {
            tempReturn = false
          }
          if (item.inspectMethodNameList.length && item.inspectMethodNameList[item.inspectMethodCodeWhichIndex].inspectParameterListShow.length) {
            const temp = item.inspectMethodNameList[item.inspectMethodCodeWhichIndex].inspectParameterListShow.every((subItem:any) => subItem.defaultValue !== '')

            if (!temp) {
              tempReturn = false
            }
          }
        })
      } else { // 复检,校验指标录入的完整性
        console.log('repeat')
        console.log(obj)
        // obj.taskInspectList.forEach((item:any) => {
        obj.forEach((item:any) => {
          let tempResult = 0
          let needResult = 0
          if (item.inspectResult === '') {
            tempResult += 1
            needResult += 1
          }
          if (item.indexStandardString === '') {
            tempResult += 1
            needResult += 1
          }
          if (item.inspectMethodNameList[item.inspectMethodCodeWhichIndex]?.length && item.inspectMethodNameList[item.inspectMethodCodeWhichIndex]?.inspectParameterListShow.length) {
            item.inspectMethodNameList[item.inspectMethodCodeWhichIndex].inspectParameterListShow.forEach((subItem:any) => {
              needResult += 1
              if (subItem.defaultValue === '') {
                tempResult += 1
              }
            })
          }
          if (tempResult !== needResult) {
            tempReturn = false
          }
        })
      }

      if (!tempReturn) {
        proxy.$warningToast('检验还未完成不可操作')
      }

      return tempReturn
    }

    const finalRunCheck = (obj:any) => {
      obj.forEach((item:any) => {
        if (item.canEditInspectResult) {
          checkIndexStandardString(item)
        } else {
          actHandleInspectResult(item)
          checkIndexStandardString(item)
        }
      })
    }

    //  保存操作
    const handleSaveData = async (type:string, obj:any) => {
      const back = await MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_RECHECK_TASK_INSPECT_API(obj) // /taskInspect/recheckTaskInspect
      let tempList:any[] = []
      obj.taskInspectList.forEach((item:any) => {
        item.taskInspectIndexList.forEach(async (subItem:any) => {
          // tempList.push(subItem.updateInspectParameter)
          tempList = tempList.concat(subItem.updateInspectParameter)
        })
      })
      await INSPECT_INDEX_PROCESS_PARAMETER_UPDATE_FOR_TASK_API(tempList)

      if (type !== 'save') {
        proxy.$successToast('检验已完成')
        parent.emit('openHandle', { act: 'submit', target: obj.recheckMod, obj: back.data.data })
      } else {
        proxy.$successToast('保存成功')
        parent.emit('openHandle', { act: 'save', target: '', obj: null }) //  因为成功回返 null
      }
      onClose()
    }

    // 改变 指标-结果 时触发
    const actHandleIndexJudgeResult = (val:any) => {
      if (val.inspectResult === '') {
        val.indexJudgeResult = 'N'
      } else {
        if (val.indexStandardString !== '') {
          checkIndexStandardString(val)
        }
      }
    }

    // const actHandleIndexStandardString = (val:any) => {
    //   if (val.indexStandardString === '') {
    //     val.indexJudgeResult = 'N'
    //   } else {
    //     if (val.inspectResult !== '') {
    //       checkIndexStandardString(val)
    //     }
    //   }
    // }

    // 标准值栏位处理
    const checkIndexStandardString = (val:any) => {
      if (val.inspectResult !== '' && val.indexStandardString !== '') {
        if (val.manualStandard === '') {
          let center = ''
          let leftResult = ''
          let rightResult = ''

          if (val.indexStandardString.substring(0, 2) === 'S=') {
            center = val.indexStandardString.split('S=')[1]
          } else {
            const result = /(.*)S(.*)/.exec(val.indexStandardString)
            if (result === null) {
              center = val.indexStandardString
            }

            if (result && result[1]) {
              leftResult = result[1]
            }

            if (result && result[2]) {
              rightResult = result[2]
            }
          }

          if (val.indexStandardString) {
            try {
              if (leftResult !== '' && rightResult !== '') {
                if (evil(`${leftResult}${val.inspectResult}`) && evil(`${val.inspectResult}${rightResult}`)) {
                  val.indexJudgeResult = 'Y'
                } else {
                  val.indexJudgeResult = 'N'
                }
              } else if (leftResult === '' && rightResult !== '') {
                if (evil(`${val.inspectResult}${rightResult}`)) {
                  val.indexJudgeResult = 'Y'
                } else {
                  val.indexJudgeResult = 'N'
                }
              } else if (leftResult !== '' && rightResult === '') {
                if (evil(`${leftResult}${val.inspectResult}`)) {
                  val.indexJudgeResult = 'Y'
                } else {
                  val.indexJudgeResult = 'N'
                }
              } else {
              // 对等比对直接比即可
                if (center.toString() === val.inspectResult.toString()) {
                  val.indexJudgeResult = 'Y'
                } else {
                  val.indexJudgeResult = 'N'
                }
              }
            } catch (err) {
              val.indexJudgeResult = 'N'
            }
          }
        } else {
          if (val.indexStandardString.toString() === val.inspectResult.toString()) {
            val.indexJudgeResult = 'Y'
          } else {
            val.indexJudgeResult = 'N'
          }
        }
      }
    }

    // 处理不等式正确与否
    const evil = (str:string) => {
      var Fn = Function
      return new Fn('return ' + str)()
    }

    // 切换检验方法
    const btnChangeMethodOfIndex = (index: number, target: any) => {
      proxy.$confirm('切换检验方法后，当前维护数据将被清空，请确认是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async (val:string) => {
        if (val === 'confirm') {
          actChangeMethodOfIndex(index, target)
        }
        // onClose()
      }).catch(() => {
        //
      })
    }

    const actChangeMethodOfIndex = (index: number, target: any) => {
      console.log('target')
      console.log(target)
      // 1. 该方法下一定要有过程参数 data
      // 2. 同方法不做再点击
      if (target.inspectMethodNameList && target.inspectMethodNameList.length) { // 1.
        if (target.inspectMethodCodeWhichIndex !== index) { // 2.
          const prevIndex = target.inspectMethodCodeWhichIndex
          target.inspectMethodCodeWhichIndex = index
          target.inspectMethodCode = target.inspectMethodNameList[index].inspectMethodCode
          target.inspectMethodName = target.inspectMethodNameList[index].inspectMethodName
          target.canShowParameterList = target.inspectMethodNameList[index].inspectParameterListShow.length !== 0
          // 切换 tab 时，将退出的 tab 复原
          if (prevIndex !== 100) {
            const prevParameterObj = JSON.parse(JSON.stringify(target.inspectMethodNameListTemp[prevIndex]))
            target.inspectMethodNameList[prevIndex] = prevParameterObj
          }

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

    // [ACT]拼接不等式
    const joint = (obj:any) => {
      let indexStandardString = ''

      // if (obj.indexInnerStandard) {
      //   indexStandardString = 'S=obj.indexInnerStandard'
      // } else if ((obj.indexInnerDown && obj.innerDownSymbol || obj.innerDownSymbol && obj.indexInnerUp){}
      //

      if (obj.indexInnerStandard !== '') {
        indexStandardString = `${!obj.indexInnerDown ? '' : obj.indexInnerDown}${!obj.innerDownSymbol ? '' : obj.innerDownSymbol.replace('>', '<')}S${!obj.innerUpSymbol ? '' : obj.innerUpSymbol}${!obj.indexInnerUp ? '' : obj.indexInnerUp}`
      } else if (obj.indexStandard !== '') {
        indexStandardString = `${!obj.indexDown ? '' : obj.indexDown}${!obj.downSymbol ? '' : obj.downSymbol.replace('>', '<')}S${!obj.upSymbol ? '' : obj.upSymbol}${!obj.indexUp ? '' : obj.indexUp}`
      } else {
        indexStandardString = ''
      }

      return indexStandardString
    }

    // 查看
    const chechCanEditInspectResultOfData = (subItem:any) => { // 此 function 不包含公式错误
      // 没有【展示】过程参数
      if (subItem.inspectParameterListShow.length === 0) {
        return true
      }

      // 没有【结果】过程参数
      if (!subItem.inspectParameterListResult.length) {
        return true
      }

      // 有【结果】过程参数，公式为空
      if (subItem.inspectParameterListResult.length && subItem.inspectParameterListResult[0].formula === '') {
        return true
      }
      return false
    }

    // 判断是否公式可行
    const chechCanEditInspectResultOfFormula = (formulaString:string, args:string) => {
      if (formulaString === '') { // 公式不能為空
        return false
      }
      const transList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      const tempDepend = args.split(',')
      for (let i = 0; i < tempDepend.length; i++) {
        const re = new RegExp(tempDepend[i].replace('[', '\\[').replace(']', '\\]'), 'g')
        formulaString = formulaString.replace(re, transList[i])
      }

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

    // 解析未解码之公式
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

    // key in trigger 过程参数栏位出来的结果
    const actHandleInspectResult = (subItem:any) => {
      if (!subItem.canEditInspectResult && subItem.canChangeAgainWithProcessParameter) { // 判定是否依靠过程参数计算
        if (subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.every((item:any) => item.defaultValue !== '')) { // 过程参数都不为空才触发
          const result = runFormula(subItem.filnalFormula,
            subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex].inspectParameterListResult[0].formula,
            subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex].inspectParameterListShow,
            subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex].inspectParameterListHidden)

          if (!result) {
            proxy.$warningToast(`指标 [${subItem.indexName}] 公式或参数值有错误，无法计算。请手动输入结果进行判定。`)
            subItem.inspectResult = ''
            subItem.canEditInspectResult = true
          } else {
            subItem.inspectResult = result.toString()
            checkIndexStandardString(subItem)
          }
        } else {
          subItem.inspectResult = ''
        }
      }
    }

    // 根据公式计算结果
    const runFormula = (formula:string, depend:string, showValue:any[], hiddenValue:any[]) => {
      const transList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      const tempDepend = depend.split(',')

      let tempFormula = formula

      const valueList = new Array(tempDepend.length)
      const importValue:any = {}
      tempDepend.forEach((item, index) => {
        const re = new RegExp(item.replace('[', '\\[').replace(']', '\\]'), 'g')

        tempFormula = tempFormula.replace(re, transList[index])

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
              const thisIndex = tempDepend.indexOf(subItem.parentParamCode)
              const value = importValue[transList[thisIndex]]
              let canFindIt = false
              subItem.inspectAssociateList.forEach((element:any) => {
                if (element.associate === value) {
                  canFindIt = true
                  importValue[transList[index]] = !element.value ? 0 : Number(element.value)
                  valueList[index] = !element.value ? 0 : Number(element.value)
                }
              })
              if (!canFindIt) {
                proxy.$warningToast('没有相关参数内没找到对映的值')
              }
            }
          })
        }
      })

      let expr:any
      let result:any

      if (depend.split(',').length === 1 && depend.split(',')[0].trim().toString() === formula.trim().toString()) { // 仅一个展示的过程参数且 S=该过程参数
        showValue.forEach((item) => {
          if (item.paramCode === depend.split(',')[0].trim().toString()) {
            result = item.defaultValue
          }
        })
      } else {
        if (showValue.some(item => item.paramDataType === '')) { // 多个过程参数没类型
          result = null
        } else {
          try {
            // 加入字串形态
            expr = parser.parse(tempFormula)
            result = expr.evaluate(importValue)
          } catch (err) {
            console.log(err)
            result = null
          }
        }
      }

      return result
    }

    const actChangeByRecheckMod = (val:string) => {
      if (state.dataFormOfSampleInfo.recheckMod === val) {
        state.dataFormOfSampleInfo.recheckMod = ''
      } else {
        state.dataFormOfSampleInfo.recheckMod = val
      }

      console.log(state.dataFormOfSampleInfo.recheckMod)
    }

    // TODO watch
    watch(targetObj, (val) => {
      console.log('=== import object to dialog ===')
      console.log(val)

      state.currentMainType = mainType.value !== 'ASSIST' ? mainType.value : 'PROCESS' // ASSIST 也归于 PROCESS
      console.log('=== state.currentMainType ===')
      console.log(state.currentMainType)
      state.mainObj = []

      if (val.length) {
        const groupContainer:string[] = []
        const recheckContainer:string[] = []
        state.timeLineDataForRecheck = [] // 复检
        state.timeLineDataForGroup = [] // 组合

        // 走一遍要检验 item
        val.forEach((item:any) => {
          state.idToSampleCode[item.id] = item.sampleCode
          state.mainObj.push(item)

          // add 复检讯息于最下方
          if (item.recheckBatch !== '' && item.taskStatus === 'COMPLETED') {
            if (!recheckContainer.includes(item.recheckBatch)) {
              recheckContainer.push(item.recheckBatch)
              MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_FORM_QUERY_API({ // /taskInspect/formTaskInspect
                id: item.id,
                recheckBatch: item.recheckBatch,
                taskStatus: 'COMPLETED'
              }).then((rep) => {
                console.log('== 复检讯息 ==')
                console.log(rep.data.data)
                rep.data.data.forEach((element:any) => {
                  const tempIndexList:any[] = []
                  element.taskInspectIndexList.forEach((subElement:any) => {
                    tempIndexList.push({
                      indexName: subElement.indexName,
                      sampleCode: element.sampleCode,
                      inspectResult: subElement.inspectResult,
                      indexJudgeResult: subElement.indexJudgeResult
                    })
                  })
                  state.timeLineDataForRecheck.push({
                    indexName: element.indexName,
                    indexList: tempIndexList
                  })
                })
              })
            }
          }

          // add 组合讯息于最下方
          if (item.groupBatch !== '' && item.taskStatus === 'COMPLETED') {
            if (!groupContainer.includes(item.groupBatch)) {
              groupContainer.push(item.groupBatch)

              MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_FORM_QUERY_API({ // /taskInspect/formTaskInspect
                id: item.id,
                recheckBatch: item.recheckBatch,
                taskStatus: 'COMPLETED'
              }).then((rep) => {
                console.log('== 组合讯息 ==')
                console.log(rep.data.data)
                rep.data.data.forEach((element:any) => {
                  const tempIndexList:any[] = []
                  element.taskInspectIndexList.forEach((subElement:any) => {
                    tempIndexList.push({
                      indexName: subElement.indexName,
                      sampleCode: element.sampleCode,
                      inspectResult: subElement.inspectResult,
                      indexJudgeResult: subElement.indexJudgeResult
                    })
                  })
                  state.timeLineDataForGroup.push({
                    indexName: element.indexName,
                    indexList: tempIndexList
                  })
                })
              })
            }
          }
        })

        state.currentSubType = val.length === 1 ? 'normal' : 'merge' // 一般检 or 合并检组合检
        // 加入标题
        state.subTitle = val[0].inspectContent
        state.dataFormOfSampleInfo = val[0]
        state.dataFormOfSampleInfo.inspectMaterialNameString = val[0].inspectMaterialName
        state.dataFormOfSampleInfo.inspectSiteNameString = val.map((item:any) => item.inspectSiteName).join(',')
        state.currentOrderStyle = val[0].recheckFlag === 'N' ? 'first' : 'repeat'

        // add id2sampleCode obj 获取进来的 items 综合指标
        MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_INSPECT_QUERY_API( // /taskInspectIndex/queryTaskInspectIndex
          val.filter((item:any) => item.taskStatus !== 'COMPLETED').map((item:any) => item.id)
        ).then(async (res) => {
          console.log('=== query dialog data ===')
          console.log(JSON.parse(JSON.stringify(res.data.data)))

          state.timeLineDataForGroup = []

          state.dataFormOfSampleItemUnit = JSON.parse(JSON.stringify(res.data.data))
          // 获取指标
          await state.dataFormOfSampleItemUnit.forEach(async (item) => {
            // 区分1临时、2其他
            const tempIndex = await INSPECT_INDEX_PROCESS_PARAMETER_QUERY_FOR_TASK_API({
              inspectMaterialCode: state.dataFormOfSampleInfo.taskInspectClassify !== 'TEMP' ? state.dataFormOfSampleInfo.inspectMaterialCode : '',
              inspectTypeId: state.dataFormOfSampleInfo.taskInspectClassify !== 'TEMP' ? state.dataFormOfSampleInfo.inspectTypeId : '',
              inspectIndexId: state.dataFormOfSampleInfo.taskInspectClassify !== 'TEMP' ? item.indexId : '',
              inspectParameterGroupId: state.dataFormOfSampleInfo.taskInspectClassify === 'TEMP' ? item.inspectParameterGroupId : ''
            })
            console.log('指标下标准 & 过程参数')
            console.log(tempIndex.data.data)

            // 指标栏位初始化
            Object.assign(item, {
              canShowParameterList: false, // 过程参数是否显示
              canEditInspectResult: false, // 结果是否可编辑
              canChangeAgainWithProcessParameter: true, // 可再改值过程参数触发结果
              filnalFormula: '', // 公式值
              inspectMethodCodeWhichIndex: 100, // 预设的方法 index
              moreThan1Index: state.dataFormOfSampleItemUnit.filter(element => element.indexId === item.indexId).length >= 2
            })

            if (item.manualFlag === 'Y') {
              item.canEditInspectResult = true
              item.canChangeAgainWithProcessParameter = false // 标示是否过程参数改变触发
            }
            if (!tempIndex.data.data.inspectMethodNameList || tempIndex.data.data.inspectMethodNameList.length === 0) {
              item.canShowParameterList = false // 没有任何过程参数讯息
              item.canEditInspectResult = true
            } else {
              tempIndex.data.data.inspectMethodNameList.forEach((subItem:any, index:number) => {
                Object.assign(subItem, { // 滤掉 id 为空
                  inspectParameterListShow: subItem.inspectParameterList.filter((element:any) => element.id !== '' && element.paramType === 'SHOW'),
                  inspectParameterListHidden: subItem.inspectParameterList.filter((element:any) => element.id !== '' && element.paramType === 'HIDDEN'),
                  inspectParameterListResult: subItem.inspectParameterList.filter((element:any) => element.id !== '' && element.paramType === 'RESULT')
                })

                if (item.inspectMethodCode === subItem.inspectMethodCode) { // 带出预设的方法与过程参数
                  if (subItem.inspectParameterListResult.length && subItem.inspectParameterListResult[0].formulaDisplay) {
                    item.filnalFormula = string2Formula(subItem.inspectParameterListResult[0].formulaDisplay)
                  } else {
                    item.filnalFormula = ''
                  }

                  //  查看并设定【结果】栏位， 是否可编辑
                  if (item.manualFlag === 'N' || item.manualFlag === '') {
                    item.canEditInspectResult = chechCanEditInspectResultOfData(subItem) || chechCanEditInspectResultOfFormula(item.filnalFormula, subItem.inspectParameterListResult[0].formula) // [结果]是否可编辑
                  }
                  item.canShowParameterList = subItem.inspectParameterListShow.length !== 0
                  item.inspectMethodCodeWhichIndex = index
                }
              })
            }

            Object.assign(item, {
              inspectIndexStandard: tempIndex.data.data.inspectIndexStandard,
              inspectMethodNameList: tempIndex.data.data.inspectMethodNameList,
              inspectMethodNameListTemp: JSON.parse(JSON.stringify(tempIndex.data.data.inspectMethodNameList)),
              sampleCode: state.idToSampleCode[item.taskInspectId]
            })

            // 拼标准不等式 (需先有inspectIndexStandard)
            // 1.有【字串】参数时，可自由编辑
            // 2.有标准值时，带出标准值 ，不可自由编辑
            // 3.有不等式时，带出不等式 ，不可自由编辑

            if (item.manualStandard !== '') {
              item.indexStandardString = item.manualStandard
              item.canEditIndexStandardString = true
            } else {
              // =》 先看外层
              if (item.indexInnerStandard) {
                item.indexStandardString = `S=${item.indexInnerStandard}`
                item.canEditIndexStandardString = false
              } else if ((item.indexInnerDown && item.innerDownSymbol) && (item.innerUpSymbol && item.indexInnerUp)) {
                item.indexStandardString = `${item.indexInnerDown}${item.innerDownSymbol.replace('>', '<')}S${item.innerUpSymbol}${item.indexInnerUp}`
                item.canEditIndexStandardString = false
              } else if (item.indexInnerDown && item.innerDownSymbol) {
                item.indexStandardString = `${item.indexInnerDown}${item.innerDownSymbol.replace('>', '<')}S`
                item.canEditIndexStandardString = false
              } else if (item.innerUpSymbol && item.indexInnerUp) {
                item.indexStandardString = `S${item.innerUpSymbol}${item.indexInnerUp}`
                item.canEditIndexStandardString = false
              } else if (item.indexStandard) {
                item.indexStandardString = `S=${item.indexStandard}`
                item.canEditIndexStandardString = false
              } else if ((item.indexDown && item.downSymbol) && (item.upSymbol && item.indexUp)) {
                item.indexStandardString = `${item.indexDown}${item.downSymbol.replace('>', '<')}S${item.upSymbol}${item.indexUp}`
                item.canEditIndexStandardString = false
              } else if (item.indexDown && item.downSymbol) {
                item.indexStandardString = `${item.indexDown}${item.downSymbol.replace('>', '<')}S`
                item.canEditIndexStandardString = false
              } else if (item.upSymbol && item.indexUp) {
                item.indexStandardString = `S${item.upSymbol}${item.indexUp}`
                item.canEditIndexStandardString = false
              } else {
                // =》 先看内层
                if (item.inspectIndexStandard) {
                  if (item.inspectIndexStandard.indexInnerStandard) {
                    item.indexStandardString = `S=${item.inspectIndexStandard.indexInnerStandard}`
                    item.canEditIndexStandardString = false
                  } else if ((item.inspectIndexStandard.indexInnerDown && item.inspectIndexStandard.innerDownSymbol) && (item.inspectIndexStandard.innerUpSymbol && item.inspectIndexStandard.indexInnerUp)) {
                    item.indexStandardString = `${item.inspectIndexStandard.indexInnerDown}${item.inspectIndexStandard.innerDownSymbol.replace('>', '<')}S${item.inspectIndexStandard.innerUpSymbol}${item.inspectIndexStandard.indexInnerUp}`
                    item.canEditIndexStandardString = false
                  } else if (item.inspectIndexStandard.indexInnerDown && item.inspectIndexStandard.innerDownSymbol) {
                    item.indexStandardString = `${item.inspectIndexStandard.indexInnerDown}${item.inspectIndexStandard.innerDownSymbol.replace('>', '<')}S`
                    item.canEditIndexStandardString = false
                  } else if (item.inspectIndexStandard.innerUpSymbol && item.inspectIndexStandard.indexInnerUp) {
                    item.indexStandardString = `S${item.inspectIndexStandard.innerUpSymbol}${item.inspectIndexStandard.indexInnerUp}`
                    item.canEditIndexStandardString = false
                  } else if (item.inspectIndexStandard.indexStandard) {
                    item.indexStandardString = `S=${item.inspectIndexStandard.indexStandard}`
                    item.canEditIndexStandardString = false
                  } else if ((item.inspectIndexStandard.indexDown && item.inspectIndexStandard.downSymbol) && (item.inspectIndexStandard.upSymbol && item.inspectIndexStandard.indexUp)) {
                    item.indexStandardString = `${item.inspectIndexStandard.indexDown}${item.inspectIndexStandard.downSymbol.replace('>', '<')}S${item.inspectIndexStandard.upSymbol}${item.inspectIndexStandard.indexUp}`
                    item.canEditIndexStandardString = false
                  } else if (item.inspectIndexStandard.indexDown && item.inspectIndexStandard.downSymbol) {
                    item.indexStandardString = `${item.inspectIndexStandard.indexDown}${item.inspectIndexStandard.downSymbol.replace('>', '<')}S`
                    item.canEditIndexStandardString = false
                  } else if (item.inspectIndexStandard.upSymbol && item.inspectIndexStandard.indexUp) {
                    item.indexStandardString = `S${item.inspectIndexStandard.upSymbol}${item.inspectIndexStandard.indexUp}`
                    item.canEditIndexStandardString = false
                  } else {
                    item.indexStandardString = ''
                    item.canEditIndexStandardString = true
                  }
                } else {
                  item.indexStandardString = ''
                  item.canEditIndexStandardString = true
                }
              }
            }

            // 指标预设没有方法时，预设套入第一笔
            if (item.inspectMethodCode === '' && tempIndex.data.data.inspectMethodNameList) {
              actChangeMethodOfIndex(0, item)
            }

            // 走一遍运算
            if (!item.canEditInspectResult && !item.canEditIndexStandardString) {
              actHandleInspectResult(item)
            }
          })
          console.log('state.dataFormOfSampleItemUnit')
          console.log(state.dataFormOfSampleItemUnit)
        })
      } else {
        onClose()
      }
    })

    watch(subType, (val) => {
      if (val) {
        state.currentSubType = val
      }
    })

    onMounted(async () => {
      //
    })

    return {
      ...toRefs(state),
      // btn
      onClose,
      btnSaveOrSubmitDataOfInspect,
      btnChangeMethodOfIndex,
      actHandleIndexJudgeResult,
      // actHandleIndexStandardString,
      actHandleInspectResult,
      // act
      actChangeByRecheckMod,
      actChangeMethodOfIndex,
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

.el-form-item {
    margin-bottom: 0px;
}

.el-form-item__label {
    padding: 0 6px 0 0;
}
.t-box-area {
    padding: 12px 16px 6px 16px !important;
    border-radius: 8px;
    margin-bottom: 5px;
    background: #fff;
}
.fixlocation{
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;

  .subitem{
    display: flex;
    align-items: center;
    flex:1;

  }
  .subelement{
    width:calc(90%/3);
    min-width:calc(90%/3);
    max-width:calc(90%/3);
    flex:1;
       margin-bottom: 10px;
      margin-right:10px;

  }
}

</style>
