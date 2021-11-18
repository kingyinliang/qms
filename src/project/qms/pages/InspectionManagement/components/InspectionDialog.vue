<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-11 16:30:07
 * @LastEditors: Telliex
 * @LastEditTime: 2021-11-17 18:51:43
-->
<template>
  <el-dialog :title="title+subTitle" v-model="isDialogShow" width="90%">
  <mds-area class="info">
    <mds-area :title="infoSubTitle" :name="'org'" class="info">
        <el-form :inline="true" ref="refFormOfSampleInfo" :model="dataFormOfSampleInfo" :label-width="cssForformLabelWidth">
          <el-form-item label="检验任务："  prop="sampleExplain" v-if="currentType==='temp'" >
            <el-input v-model="dataFormOfSampleInfo.sampleExplain" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="取样部门："  prop="sampleExplain" v-if="currentType==='temp'" >
            <el-input v-model="dataFormOfSampleInfo.sampleExplain" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="检验物料："  prop="sampleCode" v-if="currentType==='checkagain' || currentType==='merge'" >
            <el-input v-model="dataFormOfSampleInfo.sampleCode" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="取样点："  prop="inspectMaterial" v-if="currentType==='checkagain'" >
            <el-input v-model="dataFormOfSampleInfo.inspectMaterial" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
          </el-form-item>
          <el-form-item label="取样信息："  prop="inspectMaterial" v-if="currentType==='merge'" >
            <el-input v-model="dataFormOfSampleInfo.inspectMaterial" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
          </el-form-item>
        </el-form>
    </mds-area>

      <template v-for="item in dataFormOfSampleItemUnit" :key="item">
        <mds-area :title="item.title" :name="'org'" >
          <el-form :inline="true" :model="item"  :label-width="cssForformLabelWidth" v-if="currentType==='history'">
            <el-form-item label="检验开始："  prop="inspectStartDate">
              <el-input v-model="item.inspectStartDate" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
            </el-form-item>
            <el-form-item label="检验结束："  prop="inspectEndDate" >
              <el-input v-model="item.inspectEndDate" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
            </el-form-item>
            <el-form-item label="取样说明："  prop="sampleExplain" >
              <el-input v-model="item.sampleExplain" size="small" class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
            </el-form-item>
          </el-form>
          <template v-for="subItem in item.dataFormOfSampleItem" :key="subItem">
            <mds-area :title="subItem.subTitle" :name="'org'" :outline="true">
              <template #titleBtn>
                <div class="btn-group">
                  <button size="mini" class="left" :class="{focus:subItem.method==='di'}" @click="btnChangeMethodOfIndex('di',subItem)">滴定</button><button size="mini" class="right" :class="{focus:subItem.method==='li'}" @click="btnChangeMethodOfIndex('li',subItem)">光谱</button>
                </div>
              </template>
            <el-form :inline="true" :model="subItem" :label-width="cssForformLabelWidth">
              <el-form-item label="结果："  prop="inspectContent" >
                <el-input v-model="subItem.column1" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
              </el-form-item>
              <el-form-item label="依据方法："  prop="inspectContent" >
                <el-input v-model="subItem.column2" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
              </el-form-item>
              <el-form-item label="判定："  prop="handleExplain" >
                  <el-radio v-model="subItem.column3" label="Y">合格</el-radio>
                  <el-radio v-model="subItem.column3" label="N">不合格</el-radio>
              </el-form-item>
              <el-form-item label="标准："  prop="column4" >
                  <el-input v-model="subItem.column4" size="small"  class="inputWidth" placeholder="自动带入" autocomplete="off" :readonly="onlyRead"></el-input>
              </el-form-item>
              <el-form-item label="检验过程："  prop="column5">
                <template v-for="(s,index) in subItem.inspectVarable" :key="index">
                  <el-input v-model="s.value" type="text"  size="small" placeholder="自动带入" :readonly="onlyRead" style="width:100px;margin-right:10px">
                    <template #prefix>
                      {{s.key.split('[')[0]}}<sub>{{s.key.split('[')[1].replace(']','')}}</sub>=
                    </template>
                    <template #suffix>
                      {{s.unit}}
                    </template>
                  </el-input>
                </template>
              </el-form-item>
            </el-form>
            </mds-area>
          </template>
        </mds-area>
        <el-form :inline="true" :model="item"  :label-width="cssForformLabelWidth" v-if="currentType==='process'|| currentType==='history'">
          <el-form-item label="综合判定："  prop="column6" >
            <el-radio v-model="item.column6" label="1">合格</el-radio>
            <el-radio v-model="item.column6" label="2">不合格</el-radio>          </el-form-item>
          <el-form-item label="检验说明："  prop="column7" >
            <el-input v-model="item.column7" size="small" placeholder="自动带入" autocomplete="off" :readonly="onlyRead" style="width:300px"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true"  :model="dataFormOfSampleInfo"  :label-width="cssForformLabelWidth" v-if="currentType==='process'">
          <el-form-item label="复检综合判定："  prop="recheckMod" >
            <el-radio v-model="dataFormOfSampleInfo.recheckMod" label="1">原样复检</el-radio>
            <el-radio v-model="dataFormOfSampleInfo.recheckMod" label="2">重新取样</el-radio>
            <el-radio v-model="dataFormOfSampleInfo.recheckMod" label="3">其他取样</el-radio>
          </el-form-item>
        </el-form>
       </template>

      <mds-area :title="'检验记录'" :name="'org'" class="info" v-if="currentType==='checkagain'">
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
      <el-button  icon="el-icon-circle-close" type="primary" size="small" class="topic-button" @click="btnCancelOfInspect">取消</el-button>
      <el-button  icon="el-icon-circle-check" type="primary" size="small" class="topic-button"  @click="btnSaveDataOfInspect">保存</el-button>
      <el-button  type="primary" icon="el-icon-circle-check" size="small" class="role__btn topic-button"  @click="btnSubmitDataOfInspect">提交</el-button>
    </div>
  </mds-area>
  </el-dialog>
</template>

<script lang="ts">
// import { defineComponent, toRefs, reactive, onMounted, getCurrentInstance, ComponentInternalInstance, watch } from 'vue'
import { defineComponent, toRefs, ref, reactive, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue'
import layoutTs from '@/components/layout/layoutTs'
import { useStore } from 'vuex'
import {
  MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_FORM_QUERY_API
} from '@/api/api'

interface State {
  isDialogShow: boolean
  currentType : string
  currentObj: any
  title: string
  subTitle: string
  infoSubTitle: string
  onlyRead: boolean
  cssForformLabelWidth: string
  dataFormOfSampleInfo: any
  dataFormOfSampleItemUnit: any[]
  activities: any[]
}
export default defineComponent({
  name: 'InspectionManagementDialogIndex',
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
      isDialogShow: true,
      title: '样品检验-',
      subTitle: '制取/煮豆/理化检验',
      currentType: 'checkagain', // temp , checkagain, merge
      currentObj: {},
      infoSubTitle: '样品信息',
      onlyRead: true,
      cssForformLabelWidth: '110px',
      dataFormOfSampleInfo: {},
      dataFormOfSampleItemUnit: [{
        title: '检验录入',
        dataFormOfSampleItem: [{
          subTitle: '感官',
          method: 'li',
          inspectVarable: [{
            key: 'v[1]',
            value: '100',
            unit: 'g/ml'
          }, {
            key: 'v[2]',
            value: '200',
            unit: 'g/ml'
          }]
        },
        {
          subTitle: '颗粒',
          method: 'di',
          inspectVarable: [{
            key: 'v[7]',
            value: '400',
            unit: 'g/ml'
          }, {
            key: 'v[5]',
            value: '300',
            unit: 'g/ml'
          }]
        }]
      }],
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

    // [BTN:取消]
    const btnCancelOfInspect = () => {
      tabsCloseCurrentHandle()
    }

    // [BTN:保存] transfor
    const btnSaveDataOfInspect = () => {
      //
    }

    // [BTN:提交]
    const btnSubmitDataOfInspect = async () => {
      //
    }

    const btnChangeMethodOfIndex = (who:string, tagget: any) => {
      tagget.method = who
    }

    onMounted(async () => {
      // state.currentType = store.state.common.sampleObj.type
      // state.currentObj = store.state.common.sampleObj.obj

      if (!state.currentType) {
        tabsCloseCurrentHandle()
        proxy.$warningToast('操作过时，请重新选择！')
        gotoPage({
          path: 'qms-pages-InspectionManagement-InspectionTask-index'
        })
      } else {
        console.log('state.currentObj')
        console.log(state.currentObj)
        MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_FORM_QUERY_API([state.currentObj.id]).then(res => {
          console.log('222222')
          console.log(res.data.data)
        })
      }
    })

    return {
      ...toRefs(state),
      // btn
      btnCancelOfInspect,
      btnSaveDataOfInspect,
      btnSubmitDataOfInspect,
      btnChangeMethodOfIndex,
      // act
      // ref
      refFormOfSampleInfo
      // other
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
  .left,.right{
    background: #fff;
    min-height: 28px;
    padding: 0px 7px;
    border:none;
    box-sizing: content-box;
    color:#A5A2A5;
  }
  .left.focus,.right.focus{
    background: #4C7BFC;
    color:#fff;
  }
}
</style>
