<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-11 16:30:07
 * @LastEditors: Telliex
 * @LastEditTime: 2021-12-08 08:41:50
-->
<template>
  <mds-area class="info" :title="subTitle">
    <!-- 历史任务表单 -->
    <mds-area :title="infoSubTitle" :name="'org'" class="info">
        <el-form :inline="true" ref="refFormOfSampleInfo" :model="dataFormOfSampleInfo" :label-width="cssForformLabelWidth">
          <el-form-item label="任务单号："  prop="tempApplyNo" v-if="currentType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.tempApplyNo" placement="top-start" :disabled="!dataFormOfSampleInfo.tempApplyNo">
              <el-input v-model="dataFormOfSampleInfo.tempApplyNo" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="样品码："  prop="sampleCode" v-if="currentType==='HISTORY'||currentType==='PROCESS'||currentType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleCode" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleCode">
              <el-input v-model="dataFormOfSampleInfo.sampleCode" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="物料："  prop="inspectMaterial" v-if="currentType==='HISTORY'||currentType==='PROCESS'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectMaterial" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectMaterial">
              <el-input v-model="dataFormOfSampleInfo.inspectMaterial" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="生产订单："  prop="orderNo" v-if="currentType==='HISTORY'||currentType==='PROCESS'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.orderNo" placement="top-start" :disabled="!dataFormOfSampleInfo.orderNo">
              <el-input v-model="dataFormOfSampleInfo.orderNo" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="品项："  prop="itemName" v-if="currentType==='HISTORY'||currentType==='PROCESS'">
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.itemName" placement="top-start" :disabled="!dataFormOfSampleInfo.itemName">
              <el-input v-model="dataFormOfSampleInfo.itemName" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="需求部门："  prop="needDeptName" v-if="currentType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.needDeptName" placement="top-start" :disabled="!dataFormOfSampleInfo.needDeptName">
              <el-input v-model="dataFormOfSampleInfo.needDeptName" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="取样单位："  prop="sampleDeptName" v-if="currentType==='HISTORY'||currentType==='PROCESS'||currentType==='TEMP'">
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleDeptName" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleDeptName">
              <el-input v-model="dataFormOfSampleInfo.sampleDeptName" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="取样信息："  prop="inspectSiteName" v-if="currentType==='HISTORY'||currentType==='PROCESS'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectSiteName" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectSiteName">
              <el-input v-model="dataFormOfSampleInfo.inspectSiteName" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="取样日期："  prop="sampleEndDate" v-if="currentType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleEndDate" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleEndDate">
              <el-input v-model="dataFormOfSampleInfo.sampleEndDate" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"  :disabled="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="检验开始："  prop="inspectStartDate" v-if="currentType==='PROCESS'||currentType==='TEMP'">
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectStartDate" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectStartDate">
              <el-input v-model="dataFormOfSampleInfo.inspectStartDate" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="检验结束："  prop="inspectEndDate" v-if="currentType==='PROCESS'||currentType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectEndDate" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectEndDate">
              <el-input v-model="dataFormOfSampleInfo.inspectEndDate" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="取样说明："  prop="sampleExplain" v-if="currentType==='PROCESS'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleExplain" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleExplain">
              <el-input v-model="dataFormOfSampleInfo.sampleExplain" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead" style="width:420px"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="检验内容："  prop="inspectSampleContent" v-if="currentType==='TEMP'" >
            <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectSampleContent" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectSampleContent">
              <el-input v-model="dataFormOfSampleInfo.inspectSampleContent" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead" style="width:420px;"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="内容说明："  prop="handleExplain" v-if="currentType==='TEMP'" >
            <el-tooltip effect="dark" :content="dataFormOfSampleInfo.handleExplain" :disabled="!dataFormOfSampleInfo.handleExplain" placement="top">
              <el-input v-model="dataFormOfSampleInfo.handleExplain" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead" style="width:420px"></el-input>
            </el-tooltip>
          </el-form-item>
        </el-form>
    </mds-area>

      <template v-for="item in dataFormOfSampleItemUnit" :key="item">
        <mds-area :name="'org'" style="margin-top:-30px">
          <div style="padding-bottom:10px">
          <el-form :inline="true" :model="item"  :label-width="cssForformLabelWidth" v-if="currentType==='HISTORY'">
            <el-form-item label="检验开始："  prop="inspectStartDate">
              <el-tooltip class="item" effect="dark" :content="item.inspectStartDate" placement="top-start" :disabled="!item.inspectStartDate">
                <el-input v-model="item.inspectStartDate" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :disabled="onlyRead"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="检验结束："  prop="inspectEndDate" >
              <el-tooltip class="item" effect="dark" :content="item.inspectEndDate" placement="top-start" :disabled="!item.inspectEndDate">
              <el-input v-model="item.inspectEndDate" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :disabled="onlyRead"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="取样说明："  prop="sampleExplain" >
              <el-tooltip class="item" effect="dark" :content="item.sampleExplain" placement="top-start" :disabled="!item.sampleExplain">
                <el-input v-model="item.sampleExplain" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :disabled="onlyRead"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-form>
          </div>
          <template v-for="subItem in item.taskInspectIndexList" :key="subItem">
            <mds-area :title="subItem.indexName" :name="'org'" :outline="true">
            <el-form :inline="true" :model="subItem" :label-width="cssForformLabelWidth">
              <el-form-item label="结果："  prop="inspectResult" >
                <el-input v-model="subItem.inspectResult" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :disabled="onlyRead"></el-input>
              </el-form-item>
              <el-form-item label="依据方法："  prop="indexVersionMethod" >
                <el-tooltip class="item" effect="dark" :content="subItem.indexVersionMethod" placement="top-start" :disabled="!subItem.indexVersionMethod">
                  <el-input v-model="subItem.indexVersionMethod" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :disabled="onlyRead"></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="判定："  prop="indexJudgeResult" >
                  <el-radio v-model="subItem.indexJudgeResult" label="Y" :disabled="onlyRead">合格</el-radio>
                  <el-radio v-model="subItem.indexJudgeResult" label="N" :disabled="onlyRead">不合格</el-radio>
              </el-form-item>
              <el-form-item label="标准："  prop="indexStandardString" >
                  <el-tooltip class="item" effect="dark" :content="subItem.indexStandardString" placement="top-start" :disabled="!subItem.indexStandardString">
                    <el-input v-model="subItem.indexStandardString" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
                  </el-tooltip>
              </el-form-item>
              <el-form-item label="检验时间："  prop="finishDate" v-if="subItem.finishDate" >
              <div >{{!subItem.finishDate?'':subItem.finishDate}}</div>
              </el-form-item>
              </el-form>
              <el-form  :model="subItem" :label-width="cssForformLabelWidth">
              <el-form-item label="检验过程："  prop="" v-if="subItem.inspectParameterList.length">
                <div class="fixlocation">
                  <template v-for="pars in subItem.inspectParameterList" :key="pars.id">
                      <div class="subitem" :style="{
                        width:`calc((100%)/${subItem.inspectParameterList.length>=6?6:subItem.inspectParameterList.length})`,
                        minWidth: `calc((100%)/${subItem.inspectParameterList.length>=6?6:subItem.inspectParameterList.length})`,
                        maxWidth:`calc((100%)/${subItem.inspectParameterList.length>=6?6:subItem.inspectParameterList.length})`
                        }">
                        <span style="min-width:50px;overflow: hidden;text-align: right;padding-right:5px;white-space: nowrap;"> {{pars.paramCode?pars.paramCode.split('[')[0]:'?'}}<sub>{{pars.paramCode?pars.paramCode.split('[')[1].replace(']',''):''}}</sub> =</span>
                        <el-tooltip class="item" effect="dark" :content="pars.defaultValue" placement="top-start" :disabled="!pars.defaultValue">
                          <el-input v-model="pars.defaultValue" type="text"  size="small" placeholder="" style="margin-right:10px;" :disabled="onlyRead">
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
          <el-form-item label="综合判定："  prop="judgeResult" >
            <el-radio v-model="item.judgeResult" label="Y" :disabled="onlyRead">合格</el-radio>
            <el-radio v-model="item.judgeResult" label="N" :disabled="onlyRead">不合格</el-radio>
          </el-form-item>

          <el-form-item label="检验说明："  prop="inspectExplain"  >
            <el-tooltip effect="dark" :content="item.inspectExplain" :disabled="!item.inspectExplain" placement="top">
              <el-input v-model="item.inspectExplain" size="small" placeholder="自动带入" autocomplete="off"  :disabled="onlyRead"  style="width:540px"></el-input>
            </el-tooltip>
          </el-form-item>
        </el-form>
       </template>
      <el-form :inline="true"  :model="dataFormOfSampleInfo"  :label-width="cssForformLabelWidth" v-if="currentType==='PROCESS'">
          <el-form-item label="复检方式："  prop="recheckMod" >
            <el-radio-group v-model="dataFormOfSampleInfo.recheckMod">
              <el-radio label="ORIGINAL_RECHECK" :disabled="onlyRead">原样复检</el-radio>
              <el-radio label="RESAMOLING" :disabled="onlyRead">取样复检</el-radio>
            </el-radio-group>
          </el-form-item>
              <el-form-item label="取样说明："  prop="sampleExplain">
        <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleExplain" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleExplain">
          <el-input v-model="dataFormOfSampleInfo.sampleExplain" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" style="width:500px" :disabled="onlyRead"></el-input>
        </el-tooltip>
      </el-form-item>
        </el-form>
    <div style="display: flex; margin:20px 0px;justify-content: flex-end;">
      <el-button  icon="el-icon-circle-close" type="primary" size="small" class="topic-button" @click="btnCancelOfInspect">离开</el-button>
    </div>
  </mds-area>
</template>

<script lang="ts">
// import { defineComponent, toRefs, reactive, onMounted, getCurrentInstance, ComponentInternalInstance, watch } from 'vue'
import { defineComponent, toRefs, ref, reactive, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue'
import layoutTs from '@/components/layout/layoutTs'
import { useStore } from 'vuex'
import {
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_FORM_QUERY_API,
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_HISTORY_TASK_FORM_QUERY_API,
  INSPECT_INDEX_PROCESS_PARAMETER_QUERY_FOR_TASK_API
} from '@/api/api'

interface State {
  currentType : string
  currentObj: any
  title: string
  subTitle: string
  infoSubTitle: string
  onlyRead: boolean
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
      cssForformLabelWidth: '110px',
      dataFormOfSampleInfo: {},
      dataFormOfSampleItemUnit: []
    })

    // [BTN:取消]
    const btnCancelOfInspect = () => {
      store.commit('common/updateSampleObjForView', { type: '', obj: [] })
      tabsCloseCurrentHandle()
    }

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

        if (state.currentType === 'HISTORY') {
          MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_HISTORY_TASK_FORM_QUERY_API([state.currentObj.sampleCode]).then(async (res) => {
            console.log('HISTORY VIEW')
            console.log(res.data.data)
            for (const item of res.data.data[0].taskInspectIndexList) {
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
                item.manualStandard = item.indexStandardString
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
            state.dataFormOfSampleItemUnit = res.data.data
          })
        } else {
          MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_FORM_QUERY_API({ // /taskInspect/formTaskInspect
            id: state.currentObj.id,
            recheckBatch: ''
          }).then(async (res) => {
            console.log('PROCESS or TEMP VIEW')
            console.log(res.data.data)
            for (const item of res.data.data[0].taskInspectIndexList) {
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
                item.manualStandard = item.indexStandardString
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
      refFormOfSampleInfo
      // other
    }
  }
})
</script>

<style lang="scss" scoped>
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

</style>
