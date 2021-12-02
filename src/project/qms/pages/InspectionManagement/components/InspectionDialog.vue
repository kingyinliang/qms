<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-11 16:30:07
 * @LastEditors: Telliex
 * @LastEditTime: 2021-12-02 20:35:52
-->
<template>
  <el-dialog :title="title+subTitle" v-model="isDialogShow" width="90%" @close="onClose">
  <mds-area class="info" style="height:60vh;overflow:auto">
    <mds-area :title="infoSubTitle" :name="'org'" class="info">
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
        <mds-area :title="subItem.taskInspectIdList.length===1 ? subItem.indexName:subItem.indexName+' ('+subItem.sampleCode+')'" :name="'org'" :outline="true">
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
              <el-tooltip class="item" effect="dark" :content="subItem.inspectResult" placement="top-start" :disabled="!subItem.inspectResult">
                <el-input v-model="subItem.inspectResult" size="small" oninput ="value=value.replace(/[^\-\d.]/g, '')"   class="inputWidth" placeholder="请输入" autocomplete="off" :disabled="!subItem.canEditInspectResult" @change="actHandleIndexJudgeResult(subItem)" ></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="依据方法："  prop="indexVersionMethod" >
              <el-tooltip class="item" effect="dark" :content="subItem.indexVersionMethod" placement="top-start" :disabled="!subItem.indexVersionMethod">
                <el-input v-model="subItem.indexVersionMethod" size="small"  class="inputWidth" placeholder="" autocomplete="off" :disabled="true"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="判定："  prop="indexJudgeResult" >
                <el-radio v-model="subItem.indexJudgeResult" label="Y" :disabled="subItem.indexStandardString!==''">合格</el-radio>
                <el-radio v-model="subItem.indexJudgeResult" label="N" :disabled="subItem.indexStandardString!==''">不合格</el-radio>
            </el-form-item>
            <el-form-item label="标准："  prop="indexStandardString" >
              <el-tooltip class="item" effect="dark" :content="subItem.indexStandardString" placement="top-start" :disabled="!subItem.indexStandardString">
                <el-input v-model="subItem.indexStandardString" size="small"  class="inputWidth" placeholder="请输入" autocomplete="off" oninput ="value=value.replace(/[^0-9S><=]/g, '')" :disabled="!subItem.canEditIndexStandardString"  @blur="actHandleIndexStandardString(subItem)"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item label="检验过程："  prop="" v-if="subItem.canShowParameterList">
              <template v-if="subItem.inspectMethodNameList">
                <template v-for="(para,index) in subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow" :key="index">
                  {{para.paramCode?para.paramCode.split('[')[0]:'?'}}<sub>{{para.paramCode?para.paramCode.split('[')[1].replace(']',''):''}}</sub> =
                  <el-tooltip class="item" effect="dark" :content="para.defaultValue" placement="top-start" :disabled="!para.defaultValue">
                    <el-input v-model="para.defaultValue" type="text"  size="small" placeholder=""  oninput ="value=value.replace(/[^\d.]/g, '').replace(/^(\d+)\.(\d\d).*$/, '$1.$2')" style="width:180px;margin-right:10px" @blur="actHandleInspectResult(subItem)">
                      <template #suffix>
                        {{para.paramUnit}}
                      </template>
                    </el-input>
                  </el-tooltip>
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
        <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.inspectExplain" placement="top-start" :disabled="!dataFormOfSampleInfo.inspectExplain">
          <el-input v-model="dataFormOfSampleInfo.inspectExplain" size="small" class="text-ellipsis" placeholder="请输入" autocomplete="off" style="width:100px"></el-input>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-form :inline="true"  :model="dataFormOfSampleInfo"  :label-width="cssForformLabelWidth" >
      <el-form-item label="复检方式："  prop="recheckMod" >
        <el-radio-group v-model="dataFormOfSampleInfo.recheckMod">
          <el-radio label="ORIGINAL_RECHECK">原样复检</el-radio>
          <el-radio label="RESAMOLING">取样复检</el-radio>
          <el-radio label="OTHER_SAMPLING">其他取样</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="取样说明："  prop="sampleExplain" >
        <el-tooltip class="item" effect="dark" :content="dataFormOfSampleInfo.sampleExplain" placement="top-start" :disabled="!dataFormOfSampleInfo.sampleExplain">
          <el-input v-model="dataFormOfSampleInfo.sampleExplain" size="small" class="inputWidth" placeholder="请输入" autocomplete="off" style="width:500px" ></el-input>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div v-if="dataFormOfSampleInfo.finishDate"><span>检验时间:</span>{{!dataFormOfSampleInfo.finishDate?'':dataFormOfSampleInfo.finishDate}}</div>
    <mds-area :title="'检验记录'" :name="'org'" class="info" v-if="false" >
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
  currentOrderStyle: string
}

interface Props{
  dialogVisible: boolean
  targetObj: any
  subType: string
  mainType: string
  orderStyle: string
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
    },
    orderStyle: {
      type: String,
      default: 'first'
    }
  },
  setup (props, context) {
    const { targetObj, dialogVisible, subType, mainType, orderStyle } = toRefs(props as Props)
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
      currentOrderStyle: 'first',
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
        console.log('every item')
        console.log(item)
        const tempTaskInspectPhysicalList: any[] = []
        const tempUpdateInspectParameter: any[] = []
        // 处理不等式
        if (item.indexStandardString !== '') {
          if (state.currentMainType === 'TEMP') {
            if (item.indexStandardString.split('=')[0] === 'S') { // e.x. S=1
              item.inspectIndexStandard = item.indexStandardString.split('=')[1]
              item.indexInnerUp = null
              item.innerUpSymbol = ''
              item.indexInnerDown = null
              item.innerDownSymbol = ''
            } else {
              const result = /(.*)S(.*)/.exec(item.indexStandardString)

              if (result !== null) {
                const leftResult = /(.*)([<]=?)/.exec(result[1])
                const rightResult = /([<]=?)(.*)/.exec(result[2])

                item.inspectIndexStandard = ''

                if (!leftResult) {
                  item.indexInnerDown = null
                  item.innerDownSymbol = ''
                } else {
                  item.indexInnerDown = leftResult[1]
                  item.innerDownSymbol = leftResult[2].replace('<', '>')
                }

                if (!rightResult) {
                  item.indexInnerUp = null
                  item.innerUpSymbol = ''
                } else {
                  item.indexInnerUp = rightResult[2]
                  item.innerUpSymbol = rightResult[1]
                }
              } else {
                item.indexInnerUp = null
                item.innerUpSymbol = ''
                item.indexInnerDown = null
                item.innerDownSymbol = ''
                item.indexInnerStandard = ''
              }
            }
          } else {
            if (item.indexStandardString.split('=')[0] === 'S') { // e.x. S=1
              item.inspectIndexStandard = item.indexStandardString.split('=')[1]
              item.indexInnerUp = null
              item.innerUpSymbol = ''
              item.indexInnerDown = null
              item.innerDownSymbol = ''
            } else {
              const result = /(.*)S(.*)/.exec(item.indexStandardString)

              if (result !== null) {
                const leftResult = /(.*)([<]=?)/.exec(result[1])
                const rightResult = /([<]=?)(.*)/.exec(result[2])

                item.inspectIndexStandard = ''

                if (!leftResult) {
                  item.indexInnerDown = null
                  item.innerDownSymbol = ''
                } else {
                  item.indexInnerDown = leftResult[1]
                  item.innerDownSymbol = leftResult[2].replace('<', '>')
                }

                if (!rightResult) {
                  item.indexInnerUp = null
                  item.innerUpSymbol = ''
                } else {
                  item.indexInnerUp = rightResult[2]
                  item.innerUpSymbol = rightResult[1]
                }
              } else {
                item.indexInnerUp = null
                item.innerUpSymbol = ''
                item.indexInnerDown = null
                item.innerDownSymbol = ''
                item.indexInnerStandard = ''
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
      // let  = JSON.parse(JSON.stringify(tempRes))

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
          proxy.$confirm('此样品检验不合格，请确认是否复检？', '提示', {
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

    // TODO
    // 校验操作
    const checkRequiredData = (obj:any) => {
      let tempReturn = true

      if (state.currentOrderStyle === 'first') { // 初检
        console.log('first')
        obj.forEach((item:any) => {
          if (item.inspectResult === '') {
            // proxy.$warningToast('请完成各指标结果')
            // proxy.$warningToast('检验还未完成不可操作')
            tempReturn = false
            // return
          }
          if (item.indexJudgeResult === '') {
            // proxy.$warningToast('请完成各指标判定')
            // proxy.$warningToast('检验还未完成不可操作')
            tempReturn = false
            // return
          }
          if (item.indexStandardString === '') {
            // proxy.$warningToast('请完成各指标标准')
            // proxy.$warningToast('检验还未完成不可操作')
            tempReturn = false
            // return
          }
          if (item.inspectMethodNameList.length && item.inspectMethodNameList[item.inspectMethodCodeWhichIndex].inspectParameterListShow.length) {
            const temp = item.inspectMethodNameList[item.inspectMethodCodeWhichIndex].inspectParameterListShow.every((subItem:any) => subItem.defaultValue !== '')

            if (!temp) {
              // proxy.$warningToast('请输入指标过程参数')
              // proxy.$warningToast('检验还未完成不可操作')
              tempReturn = false
            }
          }
        })
      } else { // 复检,校验指标录入的完整性
        console.log('no first')
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

          if (item.inspectMethodNameList[item.inspectMethodCodeWhichIndex].length && item.inspectMethodNameList[item.inspectMethodCodeWhichIndex].inspectParameterListShow.length) {
            item.inspectMethodNameList[item.inspectMethodCodeWhichIndex].inspectParameterListShow.forEach((subItem:any) => {
              needResult += 1
              if (subItem.defaultValue === '') {
                tempResult += 1
              }
            })
          }

          if (tempResult !== needResult) {
            // proxy.$warningToast('请完整输入指标')
            // proxy.$warningToast('检验还未完成不可操作')
            tempReturn = false
          }
        })
      }

      if (!tempReturn) {
        proxy.$warningToast('检验还未完成不可操作')
      }

      return tempReturn
    }

    // TODO
    const finalRunCheck = (obj:any) => {
      obj.forEach((item:any) => {
        if (item.canEditInspectResult) {
          chechIndexStandardString(item)
        } else {
          actHandleInspectResult(item)
          chechIndexStandardString(item)
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
        proxy.$successToast('检验已完成！')
        parent.emit('openHandle', { act: 'submit', target: obj.recheckMod, obj: back.data.data })
      } else {
        proxy.$successToast('保存成功！')
        parent.emit('openHandle', { act: 'save', target: '', obj: back.data.data })
      }
      onClose()
    }

    const actHandleIndexJudgeResult = (val:any) => {
      if (val.inspectResult === '') {
        val.indexJudgeResult = 'N'
      } else {
        if (val.indexStandardString !== '') {
          chechIndexStandardString(val)
        }
      }
    }

    const actHandleIndexStandardString = (val:any) => {
      if (val.indexStandardString === '') {
        val.indexJudgeResult = 'N'
      } else {
        if (val.inspectResult !== '') {
          chechIndexStandardString(val)
        }
      }
    }

    const chechIndexStandardString = (val:any) => {
      if (val.indexStandardString.indexOf('S') === -1) {
        proxy.$warningToast('缺少变数 S')
      } else if (val.indexStandardString === 'S') {
        if (val.inspectResult !== '') {
          let tempString = ''
          if (val.indexInnerStandard) {
            tempString = val.indexInnerStandard
          } else if (val.indexStandard) {
            tempString = val.indexStandard
          } else {
            proxy.$warningToast('无标准值')
            val.indexJudgeResult = 'N'
            return
          }
          if (evil(`${val.inspectResult}==${tempString}`)) {
            console.log('val.indexJudgeResult = Y')
            val.indexJudgeResult = 'Y'
          } else {
            console.log('val.indexJudgeResult = N')
            val.indexJudgeResult = 'N'
          }
        }
      } else if (val.indexStandardString.split('=')[0] === 'S') {
        if (val.inspectResult !== '') {
          if (evil(`${val.indexStandardString.split('=')[1]}==${val.inspectResult}`)) {
            console.log('val.indexJudgeResult = Y')
            val.indexJudgeResult = 'Y'
          } else {
            console.log('val.indexJudgeResult = N')
            val.indexJudgeResult = 'N'
          }
        }
      } else {
        if (val.inspectResult !== '') {
          const result = /(.*)S(.*)/.exec(val.indexStandardString)
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

          if (val.inspectResult && val.indexStandardString) {
            try {
              console.log('zzzzzzzz')
              console.log(`${result[1]}${val.inspectResult}`)
              console.log(`${val.inspectResult}${result[2]}`)
              if (evil(`${result[1]}${val.inspectResult}`) && evil(`${val.inspectResult}${result[2]}`)) {
                console.log('val.indexJudgeResult = Y')
                val.indexJudgeResult = 'Y'
              } else {
                console.log('val.indexJudgeResult = N')
                val.indexJudgeResult = 'N'
              }
            } catch (err) {
              console.log(err)
              console.log('val.indexJudgeResult = N')
              val.indexJudgeResult = 'N'
            }
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
    watch(targetObj, (val) => {
      console.log('=== import object to dialog ===')
      console.log(val)

      state.currentMainType = mainType.value
      console.log(state.currentMainType)
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
          state.dataFormOfSampleInfo = val[0]
          state.dataFormOfSampleInfo.inspectMaterialNameString = val.map((item:any) => item.inspectMaterialName).join(',')
          state.dataFormOfSampleInfo.inspectSiteNameString = val.map((item:any) => item.inspectSiteName).join(',')
          state.currentOrderStyle = val[0].recheckFlag === 'N' ? 'first' : 'repeat'
        } else {
          state.subTitle = '合并'
          state.currentSubType = 'merge' // 合并检
          state.dataFormOfSampleInfo = val[0]
          state.dataFormOfSampleInfo.inspectMaterialNameString = val.map((item:any) => item.inspectMaterialName).join(',')
          state.dataFormOfSampleInfo.inspectSiteNameString = val.map((item:any) => item.inspectSiteName).join(',')
          state.currentOrderStyle = val[0].recheckFlag === 'N' ? 'first' : 'repeat'
        }

        // add id2sampleCode obj
        // TODO [BE]?
        MANAGEMENT_INSPECTION_PHYSICOCHEMICAL_TASK_INSPECT_QUERY_API( // /taskInspectIndex/queryTaskInspectIndex
          val.map((item:any) => item.id)
        ).then(async (res) => {
          console.log('=== query dialog data ===')
          console.log(res.data.data)

          // // 处理合并，重新组合
          // const tempRes:any[] = []
          // res.data.data.forEach((element:any) => {
          //   element.taskInspectIndexIdList.forEach((subElement:any, subElementIndex:number) => {
          //     const copyItem = JSON.parse(JSON.stringify(element))
          //     copyItem.id = subElement
          //     copyItem.taskInspectId = element.taskInspectIdList[subElementIndex]
          //     tempRes.push(copyItem)
          //   })
          // })
          // state.dataFormOfSampleItemUnit = JSON.parse(JSON.stringify(tempRes))
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
              item.indexStandardString = ''
              item.canEditIndexStandardString = true
            }

            // if (item.indexInnerStandard === '' && item.indexStandard === '') {
            //   if (item.inspectIndexStandard && Object.keys(item.inspectIndexStandard).length) {
            //     item.indexStandardString = joint(item.inspectIndexStandard)
            //   } else { // 可能 inspectIndexStandard 是 null
            //     item.indexStandardString = ''
            //   }
            // } else {
            //   item.indexStandardString = joint(item)
            // }

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
        const re = new RegExp(tempDepend[i].replace('[', '\\[').replace(']', '\\]'), 'g')
        console.log(re)
        console.log(transList[i])
        formulaString = formulaString.replace(re, transList[i])
        console.log(formulaString)
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
      if (subItem.canEditInspectResult === false) { // 判定是否依靠过程参数计算
        if (subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex]?.inspectParameterListShow.every((item:any) => item.defaultValue !== '')) { // 过程参数都不为空才触发
          const result = runFormula(subItem.filnalFormula,
            subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex].inspectParameterListResult[0].formula,
            subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex].inspectParameterListShow,
            subItem.inspectMethodNameList[subItem.inspectMethodCodeWhichIndex].inspectParameterListHidden)
          if (!result) {
            subItem.inspectResult = 0
            // subItem.canEditInspectResult = true
          } else {
            subItem.inspectResult = result
            // subItem.canEditInspectResult = false
          }
        }
      }
    }

    // 根据公式计算结果
    const runFormula = (formula:string, depend:string, showValue:any[], hiddenValue:any[]) => {
      const transList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      const tempDepend = depend.split(',')
      console.log('tempDepend')
      console.log(tempDepend)
      let tempFormula = formula
      console.log('formula')
      console.log(formula)
      const valueList = new Array(tempDepend.length)
      const importValue:any = {}

      console.log('showValue')
      console.log(showValue)
      console.log('hiddenValue')
      console.log(hiddenValue)
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

      console.log('tempFormula=======')
      console.log(tempFormula)

      console.log('valueList=======')
      console.log(valueList)

      console.log('importValue=======')
      console.log(importValue)

      tempDepend.forEach((item, index) => {
        if (hiddenValue.length) {
          hiddenValue.forEach(subItem => {
            if (item === subItem.paramCode) {
              console.log('index:' + index)
              const thisIndex = tempDepend.indexOf(subItem.parentParamCode)
              const value = importValue[transList[thisIndex]]
              console.log(value)
              let canFindIt = false
              subItem.inspectAssociateList.forEach((element:any) => {
                if (element.associate === value) {
                  console.log('lololololol')
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

      console.log('valueList=====4444==')
      console.log(valueList)

      console.log('importValue===4444====')
      console.log(importValue)

      let expr:any
      let result:any

      try {
        console.log('tempFormula')
        console.log(tempFormula)
        console.log('importValue')
        console.log(importValue)
        expr = parser.parse(tempFormula)
        result = expr.evaluate(importValue)
      } catch (err) {
        console.log(err)
        proxy.$warningToast('公式或参数值有错误，无法计算。请改手动输入结果，以进行判定')
        result = null
      }
      return result
    }

    watch(subType, (val) => {
      if (val) {
        state.currentSubType = val
      }
    })

    watch(orderStyle, (val) => {
      if (val) {
        state.currentOrderStyle = val
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

.el-form-item {
    margin-bottom: 5px;
}
</style>
