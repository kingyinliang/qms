<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-11 16:30:07
 * @LastEditors: Telliex
 * @LastEditTime: 2021-11-27 11:32:03
-->
<template>
  <mds-area class="info" :title="subTitle">
    <!-- 历史任务表单 -->
    <mds-area :title="infoSubTitle" :name="'org'" class="info">
        <el-form :inline="true" ref="refFormOfSampleInfo" :model="dataFormOfSampleInfo" :label-width="cssForformLabelWidth">
          <el-form-item label="任务单号："  prop="tempApplyNo" v-if="currentType==='TEMP'" >
            <el-input v-model="dataFormOfSampleInfo.tempApplyNo" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="检验内容："  prop="inspectSampleContent" v-if="currentType==='TEMP'" >
            <el-input v-model="dataFormOfSampleInfo.inspectSampleContent" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="样品码："  prop="sampleCode" v-if="currentType==='HISTORY'||currentType==='PROCESS'||currentType==='TEMP'" >
            <el-input v-model="dataFormOfSampleInfo.sampleCode" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="物料："  prop="inspectMaterial" v-if="currentType==='HISTORY'||currentType==='PROCESS'" >
            <el-input v-model="dataFormOfSampleInfo.inspectMaterial" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="生产订单："  prop="orderNo" v-if="currentType==='HISTORY'||currentType==='PROCESS'" >
            <el-input v-model="dataFormOfSampleInfo.orderNo" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="品项："  prop="itemName" v-if="currentType==='HISTORY'||currentType==='PROCESS'">
            <el-input v-model="dataFormOfSampleInfo.itemName" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="需求部门："  prop="needDeptName" v-if="currentType==='TEMP'" >
            <el-input v-model="dataFormOfSampleInfo.needDeptName" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="取样部门："  prop="sampleDeptName" v-if="currentType==='HISTORY'||currentType==='PROCESS'||currentType==='TEMP'">
            <el-input v-model="dataFormOfSampleInfo.sampleDeptName" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="取样信息："  prop="inspectSiteName" v-if="currentType==='HISTORY'||currentType==='PROCESS'" >
            <el-input v-model="dataFormOfSampleInfo.inspectSiteName" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="取样日期："  prop="sampleEndDate" v-if="currentType==='TEMP'" >
            <el-input v-model="dataFormOfSampleInfo.sampleEndDate" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"  :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="检验开始："  prop="inspectStartDate" v-if="currentType==='PROCESS'||currentType==='TEMP'">
            <el-input v-model="dataFormOfSampleInfo.inspectStartDate" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="检验结束："  prop="inspectEndDate" v-if="currentType==='PROCESS'||currentType==='TEMP'" >
            <el-input v-model="dataFormOfSampleInfo.inspectEndDate" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="取样说明："  prop="sampleExplain" v-if="currentType==='PROCESS'" >
            <el-input v-model="dataFormOfSampleInfo.sampleExplain" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="内容说明："  prop="handleExplain" v-if="currentType==='TEMP'" >
            <el-input v-model="dataFormOfSampleInfo.handleExplain" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
          </el-form-item>
        </el-form>
    </mds-area>

      <template v-for="item in dataFormOfSampleItemUnit" :key="item">
        <mds-area :name="'org'" >
          <el-form :inline="true" :model="item"  :label-width="cssForformLabelWidth" v-if="currentType==='HISTORY'">
            <el-form-item label="检验开始："  prop="inspectStartDate">
              <el-input v-model="item.inspectStartDate" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :disabled="onlyRead"></el-input>
            </el-form-item>
            <el-form-item label="检验结束："  prop="inspectEndDate" >
              <el-input v-model="item.inspectEndDate" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :disabled="onlyRead"></el-input>
            </el-form-item>
            <el-form-item label="取样说明："  prop="sampleExplain" >
              <el-input v-model="item.sampleExplain" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :disabled="onlyRead"></el-input>
            </el-form-item>
          </el-form>
          <template v-for="subItem in item.taskInspectIndexList" :key="subItem">
            <mds-area :title="subItem.indexName" :name="'org'" :outline="true">
            <el-form :inline="true" :model="subItem" :label-width="cssForformLabelWidth">
              <el-form-item label="结果："  prop="inspectResult" >
                <el-input v-model="subItem.inspectResult" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :disabled="onlyRead"></el-input>
              </el-form-item>
              <el-form-item label="依据方法："  prop="indexVersionMethod" >
                <el-input v-model="subItem.indexVersionMethod" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :disabled="onlyRead"></el-input>
              </el-form-item>
              <el-form-item label="判定："  prop="indexJudgeResult" >
                  <el-radio v-model="subItem.indexJudgeResult" label="Y" :disabled="onlyRead">合格</el-radio>
                  <el-radio v-model="subItem.indexJudgeResult" label="N" :disabled="onlyRead">不合格</el-radio>
              </el-form-item>
              <el-form-item label="标准："  prop="indexStandardString" >
                  <el-input v-model="subItem.indexStandardString" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input>
              </el-form-item>
              <el-form-item label="检验过程："  prop="" v-if="subItem.taskInspectPhysicalList.length">
                <!-- <el-input v-model="subItem.taskInspectPhysical" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" :disabled="onlyRead"></el-input> -->
                <template v-for="pars in subItem.taskInspectPhysicalList" :key="pars.id">
                    {{pars.paramCode?pars.paramCode.split('[')[0]:'?'}}<sub>{{pars.paramCode?pars.paramCode.split('[')[1].replace(']',''):''}}</sub> =
                      <el-input v-model="pars.paramValue" type="text"  size="small" placeholder="" style="width:100px;margin-right:10px" :disabled="onlyRead">
                        <template #suffix>
                          {{pars.paramUnit}}
                        </template>
                      </el-input>
                </template>
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
          <el-form-item label="检验说明："  prop="inspectExplain" >
            <!-- <el-tooltip effect="dark" :content="item.inspectExplain" :disabled="false" placement="top"> -->
              <el-input v-model="item.inspectExplain" size="small" placeholder="自动带入" autocomplete="off" :disabled="onlyRead"  style="width:400px"></el-input>
            <!-- </el-tooltip> -->
          </el-form-item>
        </el-form>
       </template>
      <el-form :inline="true"  :model="dataFormOfSampleInfo"  :label-width="cssForformLabelWidth" v-if="currentType==='PROCESS'">
          <el-form-item label="复检综合判定："  prop="recheckMod" >
            <el-radio v-model="dataFormOfSampleInfo.recheckMod" label="ORIGINAL_RECHECK" :disabled="onlyRead">原样复检</el-radio>
            <el-radio v-model="dataFormOfSampleInfo.recheckMod" label="RESAMOLING" :disabled="onlyRead">重新取样</el-radio>
            <el-radio v-model="dataFormOfSampleInfo.recheckMod" label="OTHER_SAMPLING" :disabled="onlyRead">其他取样</el-radio>
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
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_HISTORY_TASK_FORM_QUERY_API
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
          MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_HISTORY_TASK_FORM_QUERY_API([state.currentObj.sampleCode]).then(res => {
            console.log('HISTORY VIEW')
            console.log(res.data.data)
            state.dataFormOfSampleItemUnit = res.data.data
            state.dataFormOfSampleItemUnit[0].taskInspectIndexList.forEach((item:any) => {
              if (item.indexInnerStandard !== '') {
                item.indexStandardString = `${!item.indexInnerDown ? '' : item.indexInnerDown}${!item.innerDownSymbol ? '' : item.innerDownSymbol.replace('>', '<')}S${!item.innerUpSymbol ? '' : item.innerUpSymbol}${!item.indexInnerUp ? '' : item.indexInnerUp}`
              } else if (item.indexStandard !== '') {
                item.indexStandardString = `${!item.indexDown ? '' : item.indexDown}${!item.downSymbol ? '' : item.downSymbol.replace('>', '<')}S${!item.upSymbol ? '' : item.upSymbol}${!item.indexUp ? '' : item.indexUp}`
              } else {
                item.indexStandardString = ''
              }
            })
          })
        } else {
          MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_FORM_QUERY_API({
            id: state.currentObj.id,
            recheckBatch: ''
          }).then(res => {
            console.log('PROCESS or TEMP VIEW')
            console.log(res.data.data)
            state.dataFormOfSampleItemUnit = res.data.data
            state.dataFormOfSampleItemUnit[0].taskInspectIndexList.forEach((item:any) => {
              if (item.indexInnerStandard !== '') {
                item.indexStandardString = `${!item.indexInnerDown ? '' : item.indexInnerDown}${!item.innerDownSymbol ? '' : item.innerDownSymbol.replace('>', '<')}S${!item.innerUpSymbol ? '' : item.innerUpSymbol}${!item.indexInnerUp ? '' : item.indexInnerUp}`
              } else if (item.indexStandard !== '') {
                item.indexStandardString = `${!item.indexDown ? '' : item.indexDown}${!item.downSymbol ? '' : item.downSymbol.replace('>', '<')}S${!item.upSymbol ? '' : item.upSymbol}${!item.indexUp ? '' : item.indexUp}`
              } else {
                item.indexStandardString = ''
              }
            })
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
</style>
