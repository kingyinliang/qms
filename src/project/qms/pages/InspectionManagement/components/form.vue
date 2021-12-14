<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-11 16:30:07
 * @LastEditors: Telliex
 * @LastEditTime: 2021-12-13 18:23:46
-->
<template>
  <mds-area class="info" >
    <h2 class="title"><img  src="~@/assets/img/layout/logo-shinho.svg" alt="logo">{{subTitle}}</h2>
    <!-- 历史任务表单 -->
    <mds-area :title="infoSubTitle" :name="'org'" class="info">
        <el-form :inline="true" ref="refFormOfSampleInfo" :model="dataFormOfSampleInfo" :label-width="cssForformLabelWidth" class="orgBox">
          <el-form-item label="任务单号："  prop="tempApplyNo" v-if="currentType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.tempApplyNo" placement="top-start" :disabled="!dataFormOfSampleInfo.tempApplyNo">
              <el-input v-model="dataFormOfSampleInfo.tempApplyNo" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="样品码："  prop="sampleCode" v-if="currentType==='HISTORY'||currentType==='PROCESS'||currentType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleCode" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleCode">
              <el-input v-model="dataFormOfSampleInfo.sampleCode" size="mini"  class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="物料："  prop="inspectMaterial" v-if="currentType==='HISTORY'||currentType==='PROCESS'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectMaterial" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectMaterial">
              <el-input v-model="dataFormOfSampleInfo.inspectMaterial" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="生产订单："  prop="orderNo" v-if="currentType==='HISTORY'||currentType==='PROCESS'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.orderNo" placement="top-start" :disabled="!dataFormOfSampleInfo.orderNo">
              <el-input v-model="dataFormOfSampleInfo.orderNo" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="品项："  prop="itemName" v-if="currentType==='HISTORY'||currentType==='PROCESS'">
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.itemName" placement="top-start" :disabled="!dataFormOfSampleInfo.itemName">
              <el-input v-model="dataFormOfSampleInfo.itemName" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="需求部门："  prop="needDeptName" v-if="currentType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.needDeptName" placement="top-start" :disabled="!dataFormOfSampleInfo.needDeptName">
              <el-input v-model="dataFormOfSampleInfo.needDeptName" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="取样单位："  prop="sampleDeptName" v-if="currentType==='HISTORY'||currentType==='PROCESS'||currentType==='TEMP'">
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleDeptName" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleDeptName">
              <el-input v-model="dataFormOfSampleInfo.sampleDeptName" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="取样信息："  prop="inspectSiteName" v-if="currentType==='HISTORY'||currentType==='PROCESS'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectSiteName" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectSiteName">
              <el-input v-model="dataFormOfSampleInfo.inspectSiteName" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="取样日期："  prop="sampleEndDate" v-if="currentType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleEndDate" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleEndDate">
              <el-input v-model="dataFormOfSampleInfo.sampleEndDate" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead"  :disabled="disable"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="检验开始："  prop="inspectStartDate" v-if="currentType==='PROCESS'||currentType==='TEMP'">
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectStartDate" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectStartDate">
              <el-input v-model="dataFormOfSampleInfo.inspectStartDate" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="检验结束："  prop="inspectEndDate" v-if="currentType==='PROCESS'||currentType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectEndDate" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectEndDate">
              <el-input v-model="dataFormOfSampleInfo.inspectEndDate" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="取样说明："  prop="sampleExplain" v-if="currentType==='PROCESS'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleExplain" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleExplain">
              <el-input v-model="dataFormOfSampleInfo.sampleExplain" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable" style="width:420px"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="检验内容："  prop="inspectSampleContent" v-if="currentType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectSampleContent" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectSampleContent">
              <el-input v-model="dataFormOfSampleInfo.inspectSampleContent" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable" style="width:420px;"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="内容说明："  prop="handleExplain" v-if="currentType==='TEMP'" >
            <el-tooltip effect="dark" :content="dataFormOfSampleInfo.handleExplain" :disabled="!dataFormOfSampleInfo.handleExplain" placement="top">
              <el-input v-model="dataFormOfSampleInfo.handleExplain" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable" style="width:420px"></el-input>
            </el-tooltip>
          </el-form-item>
        </el-form>
    </mds-area>

      <template v-for="item in dataFormOfSampleItemUnit" :key="item">
        <mds-area :name="'org'" :title="item.recheckNum">
          <div style="padding-bottom:5px">
          <el-form :inline="true" :model="item"  :label-width="cssForformLabelWidth" v-if="currentType==='HISTORY'" class="orgBox">
            <el-form-item label="检验开始："  prop="tempInspectStartDate">
              <el-tooltip class="item" effect="dark" :content="item.tempInspectStartDate" placement="top-start" :disabled="!item.tempInspectStartDate">
                <el-input v-model="item.tempInspectStartDate" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable" style="width:180px;"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="检验结束："  prop="tempInspectEndDate" >
              <el-tooltip class="item" effect="dark" :content="item.tempInspectEndDate" placement="top-start" :disabled="!item.tempInspectEndDate">
              <el-input v-model="item.tempInspectEndDate" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable" style="width:180px;"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="取样说明："  prop="sampleExplain" >
              <el-tooltip class="item" effect="dark" :content="item.sampleExplain" placement="top-start" :disabled="!item.sampleExplain">
                <el-input v-model="item.sampleExplain" size="mini" class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable" style="width:192px;"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-form>
          </div>
          <template v-for="subItem in item.taskInspectIndexList" :key="subItem">
            <mds-area :title="subItem.indexName" :name="'org'" :outline="true">
            <el-form :inline="true" :model="subItem" :label-width="cssForformLabelWidth" class="orgBox">
              <el-form-item label="结果："  prop="inspectResult" >
                <el-input v-model="subItem.inspectResult" size="mini"  class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
              </el-form-item>
              <el-form-item label="依据方法："  prop="indexVersionMethod" >
                <el-tooltip class="item" effect="dark" :content="subItem.indexVersionMethod" placement="top-start"  :disabled="!subItem.indexVersionMethod">
                  <el-input v-model="subItem.indexVersionMethod" size="mini"  class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="判定："  prop="indexJudgeResult" >
                  <el-radio v-model="subItem.indexJudgeResult" label="Y"  :disabled="onlyRead">合格</el-radio>
                  <el-radio v-model="subItem.indexJudgeResult" label="N"  :disabled="onlyRead">不合格</el-radio>
              </el-form-item>
              <el-form-item label="标准："  prop="indexStandardString" >
                  <el-tooltip class="item" effect="dark" :content="subItem.indexStandardString" placement="top-start" :disabled="!subItem.indexStandardString">
                    <el-input v-model="subItem.indexStandardString" size="mini"  class="inputWidth" placeholder="" autocomplete="off" :readonly="onlyRead" :disabled="disable"></el-input>
                  </el-tooltip>
              </el-form-item>
              <el-form-item label="检验时间："  prop="inspectIndexDate" v-if="subItem.inspectIndexDate" >
              <div >{{!subItem.inspectIndexDate?'':subItem.inspectIndexDate}}</div>
              </el-form-item>
              </el-form>
              <el-form  :model="subItem" :label-width="cssForformLabelWidth">
              <el-form-item label="检验过程："  prop="" v-if="subItem.inspectParameterList&& subItem.inspectParameterList.length">
                <div class="fixlocation">
                  <template v-for="pars in subItem.inspectParameterList" :key="pars.id">
                      <div class="subitem" :style="{
                        width:`calc((100%)/${subItem.inspectParameterList.length>=6?6:subItem.inspectParameterList.length})`,
                        minWidth: `calc((100%)/${subItem.inspectParameterList.length>=6?6:subItem.inspectParameterList.length})`,
                        maxWidth:`calc((100%)/${subItem.inspectParameterList.length>=6?6:subItem.inspectParameterList.length})`
                        }">
                        <span style="min-width:50px;overflow: hidden;text-align: right;padding-right:5px;white-space: nowrap;"> {{pars.paramCode?pars.paramCode.split('[')[0]:'?'}}<sub>{{pars.paramCode?pars.paramCode.split('[')[1].replace(']',''):''}}</sub> =</span>
                        <el-tooltip class="item" effect="dark" :content="pars.defaultValue" placement="top-start" :disabled="!pars.defaultValue">
                          <el-input v-model="pars.defaultValue" type="text"  size="mini" placeholder="" style="margin-right:10px;" :readonly="onlyRead" :disabled="disable">
                            <template #suffix>
                              {{pars.paramUnit}}
                            </template>
                          </el-input>
                        </el-tooltip>
                      </div>
                  </template>
                </div>
                </el-form-item>
              </el-form>
            </mds-area>
          </template>
        </mds-area>
        <el-form :inline="true" :model="item"  :label-width="cssForformLabelWidth" v-if="currentType==='PROCESS'|| currentType==='HISTORY'">
          <el-form-item label="综合判定："  prop="indexJudgeResult" >
            <el-radio v-model="indexJudgeResult" label="Y"  :disabled="onlyRead">合格</el-radio>
            <el-radio v-model="indexJudgeResult" label="N"  :disabled="onlyRead">不合格</el-radio>
          </el-form-item>

          <el-form-item label="检验说明："  prop="inspectExplain"  >
            <el-tooltip effect="dark" :content="item.inspectExplain" :disabled="!item.inspectExplain" placement="top">
              <el-input v-model="item.inspectExplain" size="mini" placeholder="" autocomplete="off" :readonly="onlyRead"  :disabled="disable"  style="width:540px"></el-input>
            </el-tooltip>
          </el-form-item>
        </el-form>
       </template>
      <el-form :inline="true"  :model="dataFormOfSampleInfo"  :label-width="cssForformLabelWidth" v-if="currentType==='PROCESS'">
          <el-form-item label="复检方式："  prop="recheckMod" >
            <el-radio-group v-model="dataFormOfSampleInfo.recheckMod">
              <el-radio label="ORIGINAL_RECHECK"  :disabled="onlyRead">原样复检</el-radio>
              <el-radio label="RESAMOLING"  :disabled="onlyRead">取样复检</el-radio>
            </el-radio-group>
          </el-form-item>
              <el-form-item label="取样说明："  prop="sampleExplain">
        <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleExplain" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleExplain">
          <el-input v-model="dataFormOfSampleInfo.sampleExplain" size="mini" class="inputWidth" placeholder="" autocomplete="off" style="width:500px" :readonly="onlyRead" :disabled="disable"></el-input>
        </el-tooltip>
      </el-form-item>
        </el-form>
    <div style="display: flex; margin:20px 0px;justify-content: flex-end;">
      <el-button  icon="el-icon-circle-close" type="primary" size="mini" class="topic-button" @click="btnCancelOfInspect">离开</el-button>
    </div>
  </mds-area>
</template>

<script lang="ts">
// import { defineComponent, toRefs, reactive, onMounted, getCurrentInstance, ComponentInternalInstance, watch } from 'vue'
import { defineComponent, toRefs, ref, reactive, onMounted, getCurrentInstance, ComponentInternalInstance, computed } from 'vue'
import layoutTs from '@/components/layout/layoutTs'
import { useStore } from 'vuex'
import {
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_FORM_QUERY_API,
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_HISTORY_TASK_FORM_QUERY_API, // /taskInspect/queryHistoryFormTaskInspect
  INSPECT_INDEX_PROCESS_PARAMETER_QUERY_FOR_TASK_API
} from '@/api/api'

interface State {
  currentType : string
  currentObj: any
  title: string
  subTitle: string
  infoSubTitle: string
  onlyRead: boolean
  disable: boolean
  cssForformLabelWidth: string
  dataFormOfSampleInfo: any
  dataFormOfSampleItemUnit: any[]
}
export default defineComponent({
  name: 'InspectionManagementFormIndex',
  components: {

  },

  props: {
  },
  setup () {
    const refFormOfSampleInfo = ref()

    const { gotoPage, tabsCloseCurrentHandle } = layoutTs()
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const store = useStore()

    /**  == 变量 ==  **/
    const state = reactive<State>({
      currentType: '',
      currentObj: {},
      title: '样品检验-',
      subTitle: '制取/煮豆/理化检验',
      infoSubTitle: '样品信息',
      onlyRead: true,
      disable: true,
      cssForformLabelWidth: '110px',
      dataFormOfSampleInfo: {},
      dataFormOfSampleItemUnit: []
    })

    // [BTN:取消]
    const btnCancelOfInspect = () => {
      store.commit('common/updateSampleObjForView', { type: '', obj: [] })
      tabsCloseCurrentHandle()
    }

    // Run 判定总结果
    const indexJudgeResult = computed(() => {
      return state.dataFormOfSampleItemUnit[0].taskInspectIndexList.every((item:any) => item.indexJudgeResult === 'Y') ? 'Y' : 'N'
    })
    onMounted(async () => {
      state.currentType = store.state.common.sampleObjForView.type
      state.currentObj = store.state.common.sampleObjForView.obj[0]
      console.log('state.currentType')
      console.log(state.currentType)
      console.log('state.currentObj')
      console.log(state.currentObj)

      if (!state.currentType) {
        tabsCloseCurrentHandle()
        proxy.$warningToast('操作过时，请重新选择！')
        gotoPage({
          path: 'qms-pages-InspectionManagement-InspectionTask-index'
        })
      } else {
        state.subTitle = state.currentType !== 'TEMP' ? state.currentObj.inspectContent : '临时检验单'
        state.dataFormOfSampleInfo = { ...state.currentObj }

        Object.assign(state.dataFormOfSampleInfo, { inspectMaterial: `${state.dataFormOfSampleInfo.inspectMaterialName} ${state.dataFormOfSampleInfo.inspectMaterialCode}` })
        // state.dataFormOfSampleInfo.tempInspectStartDate = state.dataFormOfSampleInfo.inspectStartDate ? state.dataFormOfSampleInfo.inspectStartDate.split(' ')[0] : ''
        // state.dataFormOfSampleInfo.tempInspectEndDate = state.dataFormOfSampleInfo.inspectEndDate ? state.dataFormOfSampleInfo.inspectEndDate.split(' ')[0] : ''

        if (state.currentType === 'HISTORY') {
          state.disable = false
          MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_HISTORY_TASK_FORM_QUERY_API(state.currentObj.sampleCodes).then(async (res) => { // /taskInspect/queryHistoryFormTaskInspect
            console.log('HISTORY VIEW')
            console.log(res.data.data)
            if (res.data.data.length) {
              for (const element of res.data.data) {
                element.tempInspectStartDate = element.inspectStartDate ? element.inspectStartDate.substring(0, 10) : ''
                element.tempInspectEndDate = element.inspectEndDate ? element.inspectEndDate.substring(0, 10) : ''
                for (const item of element.taskInspectIndexList) {
                  const tempIndex = await INSPECT_INDEX_PROCESS_PARAMETER_QUERY_FOR_TASK_API({
                    inspectMaterialCode: state.currentType !== 'TEMP' ? state.dataFormOfSampleInfo.inspectMaterialCode : '',
                    inspectTypeId: state.currentType !== 'TEMP' ? state.dataFormOfSampleInfo.inspectTypeId : '',
                    inspectIndexId: state.currentType !== 'TEMP' ? item.indexId : '',
                    inspectParameterGroupId: state.currentType === 'TEMP' ? item.inspectParameterGroupId : ''
                  })
                  console.log('指标下标准 & 过程参数')
                  console.log(tempIndex.data.data)
                  item.inspectIndexStandard = tempIndex.data.data.inspectIndexStandard

                  if (item.manualStandard !== '') {
                    item.indexStandardString = item.manualStandard
                  } else {
                    if (item.indexInnerStandard) {
                      item.indexStandardString = `S=${item.indexInnerStandard}`
                    } else if ((item.indexInnerDown && item.innerDownSymbol) && (item.innerUpSymbol && item.indexInnerUp)) {
                      item.indexStandardString = `${item.indexInnerDown}${item.innerDownSymbol.replace('>', '<')}S${item.innerUpSymbol}${item.indexInnerUp}`
                      console.log(item.indexStandardString)
                    } else if (item.indexInnerDown && item.innerDownSymbol) {
                      item.indexStandardString = `${item.indexInnerDown}${item.innerDownSymbol.replace('>', '<')}S`
                    } else if (item.innerUpSymbol && item.indexInnerUp) {
                      item.indexStandardString = `S${item.innerUpSymbol}${item.indexInnerUp}`
                    } else if (item.indexStandard) {
                      item.indexStandardString = `S=${item.indexStandard}`
                    } else if ((item.indexDown && item.downSymbol) && (item.upSymbol && item.indexUp)) {
                      item.indexStandardString = `${item.indexDown}${item.downSymbol.replace('>', '<')}S${item.upSymbol}${item.indexUp}`
                    } else if (item.indexDown && item.downSymbol) {
                      item.indexStandardString = `${item.indexDown}${item.downSymbol.replace('>', '<')}S`
                    } else if (item.upSymbol && item.indexUp) {
                      item.indexStandardString = `S${item.upSymbol}${item.indexUp}`
                    } else {
                      if (item.inspectIndexStandard) {
                        if (item.inspectIndexStandard.indexInnerStandard) {
                          item.indexStandardString = `S=${item.inspectIndexStandard.indexInnerStandard}`
                        } else if ((item.inspectIndexStandard.indexInnerDown && item.inspectIndexStandard.innerDownSymbol) && (item.inspectIndexStandard.innerUpSymbol && item.inspectIndexStandard.indexInnerUp)) {
                          item.indexStandardString = `${item.inspectIndexStandard.indexInnerDown}${item.inspectIndexStandard.innerDownSymbol.replace('>', '<')}S${item.inspectIndexStandard.innerUpSymbol}${item.inspectIndexStandard.indexInnerUp}`
                        } else if (item.inspectIndexStandard.indexInnerDown && item.inspectIndexStandard.innerDownSymbol) {
                          item.indexStandardString = `${item.inspectIndexStandard.indexInnerDown}${item.inspectIndexStandard.innerDownSymbol.replace('>', '<')}S`
                        } else if (item.inspectIndexStandard.innerUpSymbol && item.inspectIndexStandard.indexInnerUp) {
                          item.indexStandardString = `S${item.inspectIndexStandard.innerUpSymbol}${item.inspectIndexStandard.indexInnerUp}`
                        } else if (item.inspectIndexStandard.indexStandard) {
                          item.indexStandardString = `S=${item.inspectIndexStandard.indexStandard}`
                        } else if ((item.inspectIndexStandard.indexDown && item.inspectIndexStandard.downSymbol) && (item.inspectIndexStandard.upSymbol && item.inspectIndexStandard.indexUp)) {
                          item.indexStandardString = `${item.inspectIndexStandard.indexDown}${item.inspectIndexStandard.downSymbol.replace('>', '<')}S${item.inspectIndexStandard.upSymbol}${item.inspectIndexStandard.indexUp}`
                        } else if (item.inspectIndexStandard.indexDown && item.inspectIndexStandard.downSymbol) {
                          item.indexStandardString = `${item.inspectIndexStandard.indexDown}${item.inspectIndexStandard.downSymbol.replace('>', '<')}S`
                        } else if (item.inspectIndexStandard.upSymbol && item.inspectIndexStandard.indexUp) {
                          item.indexStandardString = `S${item.inspectIndexStandard.upSymbol}${item.inspectIndexStandard.indexUp}`
                        } else {
                          item.indexStandardString = ''
                        }
                      } else {
                        item.indexStandardString = ''
                      }
                    }
                  }

                  item.inspectParameterList = []
                  if (tempIndex.data.data.inspectMethodNameList.length) {
                    tempIndex.data.data.inspectMethodNameList.forEach((element:any) => {
                      if (element.inspectMethodCode === item.inspectMethodCode) {
                        item.inspectParameterList = element.inspectParameterList.filter((subElement:any) => subElement.id !== '' && subElement.paramType === 'SHOW')
                      }
                    })
                  }
                }
              }
              state.dataFormOfSampleItemUnit = res.data.data
            }

            setTimeout(() => {
              state.dataFormOfSampleItemUnit = res.data.data
            }, 5000)
          })
        } else {
          MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_FORM_QUERY_API({ // /taskInspect/formTaskInspect
            id: state.currentObj.id,
            recheckBatch: state.currentObj.recheckBatch,
            taskStatus: ''
          }).then(async (res) => {
            console.log('PROCESS or TEMP VIEW')
            console.log(res.data.data)
            res.data.data.forEach((item:any, index:number) => {
              if (index === res.data.data.length - 1) {
                item.recheckNum = '初检'
              } else {
                item.recheckNum = `复检${res.data.data.length - index - 1}`
              }
            })

            for (const element of res.data.data) {
              for (const item of element.taskInspectIndexList) {
                const tempIndex = await INSPECT_INDEX_PROCESS_PARAMETER_QUERY_FOR_TASK_API({
                  inspectMaterialCode: state.currentType !== 'TEMP' ? state.dataFormOfSampleInfo.inspectMaterialCode : '',
                  inspectTypeId: state.currentType !== 'TEMP' ? state.dataFormOfSampleInfo.inspectTypeId : '',
                  inspectIndexId: state.currentType !== 'TEMP' ? item.indexId : '',
                  inspectParameterGroupId: state.currentType === 'TEMP' ? item.inspectParameterGroupId : ''
                })
                console.log('指标下标准 & 过程参数')
                console.log(tempIndex.data.data)
                item.inspectIndexStandard = tempIndex.data.data.inspectIndexStandard

                if (item.manualStandard !== '') {
                  item.indexStandardString = item.manualStandard
                } else {
                  if (item.indexInnerStandard) {
                    item.indexStandardString = `S=${item.indexInnerStandard}`
                  } else if ((item.indexInnerDown && item.innerDownSymbol) && (item.innerUpSymbol && item.indexInnerUp)) {
                    item.indexStandardString = `${item.indexInnerDown}${item.innerDownSymbol.replace('>', '<')}S${item.innerUpSymbol}${item.indexInnerUp}`
                  } else if (item.indexInnerDown && item.innerDownSymbol) {
                    item.indexStandardString = `${item.indexInnerDown}${item.innerDownSymbol.replace('>', '<')}S`
                  } else if (item.innerUpSymbol && item.indexInnerUp) {
                    item.indexStandardString = `S${item.innerUpSymbol}${item.indexInnerUp}`
                  } else if (item.indexStandard) {
                    item.indexStandardString = `S=${item.indexStandard}`
                  } else if ((item.indexDown && item.downSymbol) && (item.upSymbol && item.indexUp)) {
                    item.indexStandardString = `${item.indexDown}${item.downSymbol.replace('>', '<')}S${item.upSymbol}${item.indexUp}`
                  } else if (item.indexDown && item.downSymbol) {
                    item.indexStandardString = `${item.indexDown}${item.downSymbol.replace('>', '<')}S`
                  } else if (item.upSymbol && item.indexUp) {
                    item.indexStandardString = `S${item.upSymbol}${item.indexUp}`
                  } else {
                    if (item.inspectIndexStandard) {
                      if (item.inspectIndexStandard.indexInnerStandard) {
                        item.indexStandardString = `S=${item.inspectIndexStandard.indexInnerStandard}`
                      } else if ((item.inspectIndexStandard.indexInnerDown && item.inspectIndexStandard.innerDownSymbol) && (item.inspectIndexStandard.innerUpSymbol && item.inspectIndexStandard.indexInnerUp)) {
                        item.indexStandardString = `${item.inspectIndexStandard.indexInnerDown}${item.inspectIndexStandard.innerDownSymbol.replace('>', '<')}S${item.inspectIndexStandard.innerUpSymbol}${item.inspectIndexStandard.indexInnerUp}`
                      } else if (item.inspectIndexStandard.indexInnerDown && item.inspectIndexStandard.innerDownSymbol) {
                        item.indexStandardString = `${item.inspectIndexStandard.indexInnerDown}${item.inspectIndexStandard.innerDownSymbol.replace('>', '<')}S`
                      } else if (item.inspectIndexStandard.innerUpSymbol && item.inspectIndexStandard.indexInnerUp) {
                        item.indexStandardString = `S${item.inspectIndexStandard.innerUpSymbol}${item.inspectIndexStandard.indexInnerUp}`
                      } else if (item.inspectIndexStandard.indexStandard) {
                        item.indexStandardString = `S=${item.inspectIndexStandard.indexStandard}`
                      } else if ((item.inspectIndexStandard.indexDown && item.inspectIndexStandard.downSymbol) && (item.inspectIndexStandard.upSymbol && item.inspectIndexStandard.indexUp)) {
                        item.indexStandardString = `${item.inspectIndexStandard.indexDown}${item.inspectIndexStandard.downSymbol.replace('>', '<')}S${item.inspectIndexStandard.upSymbol}${item.inspectIndexStandard.indexUp}`
                      } else if (item.inspectIndexStandard.indexDown && item.inspectIndexStandard.downSymbol) {
                        item.indexStandardString = `${item.inspectIndexStandard.indexDown}${item.inspectIndexStandard.downSymbol.replace('>', '<')}S`
                      } else if (item.inspectIndexStandard.upSymbol && item.inspectIndexStandard.indexUp) {
                        item.indexStandardString = `S${item.inspectIndexStandard.upSymbol}${item.inspectIndexStandard.indexUp}`
                      } else {
                        item.indexStandardString = ''
                      }
                    } else {
                      item.indexStandardString = ''
                    }
                  }
                }

                item.inspectParameterList = []
                if (tempIndex.data.data.inspectMethodNameList.length) {
                  tempIndex.data.data.inspectMethodNameList.forEach((element:any) => {
                    if (element.inspectMethodCode === item.inspectMethodCode) {
                      item.inspectParameterList = element.inspectParameterList.filter((subElement:any) => subElement.id !== '' && subElement.paramType === 'SHOW')
                    }
                  })
                }
              }
            }

            state.dataFormOfSampleItemUnit = res.data.data
          })
        }
      }
    })

    return {
      ...toRefs(state),
      // btn
      btnCancelOfInspect,
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

h2.title{
    font-size: 24px;
    text-align: center;
    margin-top: 20px;
    border-bottom: 1px dashed rgb(102, 102, 102);
    clear: both;
    height: 70px;
    line-height: 70px;
    font-weight: 600;
    img{
      width: 90px;
      float:left;
      margin-top:5px
    }
}
.el-form-item {
    margin-bottom: 0px;
}
.inputWidth{
  width:150px;
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
}
.t-box-area {
  margin-bottom: 5px;
}

.orgBox{
  margin-top:-10px
}

</style>
