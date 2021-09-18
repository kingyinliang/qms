<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-30 11:24:46
 * @LastEditors: Telliex
 * @LastEditTime: 2021-09-18 15:41:33
-->
<template>
  <mds-card class="test_method" :title="title" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
        <div style="float: right;display: flex; margin-bottom:10px;">
          <el-button v-if="!controlBtnCanDo" type="primary" icon="el-icon-edit" size="small" class="role__btn topic-button" @click="btnEditItemData" :disabled="!canEdit" >编辑</el-button>
          <el-button v-if="controlBtnCanDo" icon="el-icon-plus" type="primary" size="small" class="topic-button" @click="btnAddItemData">新增</el-button>
          <el-button v-if="controlBtnCanDo" icon="el-icon-circle-check" type="primary" size="small" class="topic-button" @click="btnSaveItemData">保存</el-button>
          <el-button v-if="controlBtnCanDo" icon="el-icon-circle-close" type="primary" size="small" class="topic-button" @click="btnLeaveItemData">取消</el-button>
        </div>
    </template>
    <el-table
      border
      :header-cell-style="headerMerge"
      ref="multipleTable"
      :cell-style="{'text-align':'center'}"
      :data="topicMainData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="过程参数" min-width="110" show-overflow-tooltip>
        <template #header>
          <span class="required">过程参数</span>
        </template>
        <template #default="scope">
            <el-select v-model="scope.row.paramSubscriptCodeWithParamSubscript" size="small" :disabled="!isRedact" :placeholder="!isRedact?'':'请选择'" clearable @change="val=>changeParamSubscriptOptions(val,scope.row)">
              <el-option
                v-for="item in paramSubscriptOptions"
                :key="item.paramSubscriptCode"
                :label="item.paramSubscriptCode+' '+item.paramSubscript"
                :value="item.paramSubscriptCode+' '+item.paramSubscript"
                :disabled="item.disabled"
                >
                <span >{{ item.paramSubscriptCode }}<sub>{{item.paramSubscript}}</sub></span>
              </el-option>
            </el-select>
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="110" show-overflow-tooltip>
        <template #header>
          <span class="required">单位</span>
        </template>
        <template #default="scope">
          <el-select v-model="scope.row.paramUnit" size="small" :disabled="!isRedact" :placeholder="!isRedact?'':'请选择'" clearable>
                <el-option
                v-for="item in paramUnitOptions"
                :key="item.dictCode"
                :label="item.dictValue"
                :value="item.dictCode">
              </el-option>
            </el-select>
        </template>
      </el-table-column>
      <el-table-column label="数据类型" min-width="110" show-overflow-tooltip>
        <template #default="scope">
          <el-select v-model="scope.row.paramDataType" size="small" :disabled="!isRedact" :placeholder="!isRedact?'':'请选择'" clearable>
              <el-option
                v-for="item in paramDataTypeOptions"
                :key="item.dictCode"
                :label="item.dictValue"
                :value="item.dictCode">
              </el-option>
            </el-select>
        </template>
      </el-table-column>
      <el-table-column label="数据标准">
        <el-table-column  min-width="120" show-overflow-tooltip>
          <template #default="scope">
            <el-input v-model.number="scope.row.paramStandard" size="small" :placeholder="!isRedact?'':'请输入'" :disabled="!isRedact" />
          </template>
        </el-table-column>
        <el-table-column  min-width="110" show-overflow-tooltip>
          <template #default="scope">
            <el-select v-model="scope.row.paramStandardType" size="small" :disabled="!isRedact" :placeholder="!isRedact?'':'请选择'" clearable>
              <el-option
                v-for="item in paramStandardTypeOptions"
                :key="item.dictCode"
                :label="item.dictValue"
                :value="item.dictCode">
              </el-option>
              </el-select>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="上限" min-width="110" show-overflow-tooltip>
        <template #default="scope">
          <el-input v-model="scope.row.paramUp" size="small" maxlength="5" :placeholder="!isRedact?'':'请输入'" :disabled="!isRedact" oninput="value=value.replace(/[^\d.]/g, '')" />
        </template>
      </el-table-column>
      <el-table-column label="下限" min-width="110" show-overflow-tooltip>
        <template #default="scope">
          <el-input v-model="scope.row.paramDown" size="small" maxlength="5"  :placeholder="!isRedact?'':'请输入'" :disabled="!isRedact" oninput="value=value.replace(/[^\d.]/g, '')"  />
        </template>
      </el-table-column>
      <el-table-column label="参数类型" min-width="110" show-overflow-tooltip>
        <template #header>
          <span class="required">参数类型</span>
        </template>
        <template #default="scope">
          <el-select v-model="scope.row.paramType" size="small" :disabled="!isRedact||scope.row.paramType === 'RESULT'" :placeholder="!isRedact?'':'请选择'" clearable @change="val=>changeParamTypeOptions(val,scope.row)" @focus="val=>focusParamTypeOptions(val,scope.row)">
            <el-option
              v-for="item in paramTypeOptions"
              :key="item.dictCode"
              :label="item.dictValue"
              :value="item.dictCode"
              :disabled="item.disabled"
              >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="默认值">
        <el-table-column
          width="120"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-select v-model="scope.row.defaultType" size="small" :disabled="!isRedact" :placeholder="!isRedact?'':'请选择'" clearable>
              <el-option
                v-for="item in defaultTypeOptions"
                :key="item.dictCode"
                :label="item.dictValue"
                :value="item.dictCode">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
         <el-table-column
          width="120"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-input v-model.number="scope.row.defaultValue" size="small" :placeholder="!isRedact?'':'请输入'" :disabled="!isRedact||scope.row.defaultType===''||scope.row.defaultType==='CURRENT'" />
          </template>
         </el-table-column>
      </el-table-column>
         <el-table-column label="关联参数" min-width="110" show-overflow-tooltip>
        <template #default="scope">
          <el-select v-model="scope.row.parentParamSubscriptCodeWithParentParamSubscript" size="small" :disabled="!isRedact ||  scope.row.paramType === 'SHOW' || scope.row.paramType === 'RESULT'" :placeholder="!isRedact?'':'请选择'" clearable @change="val=>changeParentParamSubscriptOptions(val,scope.row)" @focus="val=>focusParentParamSubscriptOptions(val,scope.row)">
                <el-option
                  v-for="item in parentParamSubscriptOptions"
                  :key="item.paramSubscriptCode"
                  :label="item.paramSubscriptCode+' '+item.paramSubscript"
                  :value="item.paramSubscriptCode+' '+item.paramSubscript"
                  :disabled="item.disabled">
                <span >{{ item.paramSubscriptCode }}<sub>{{item.paramSubscript}}</sub></span>
              </el-option>
            </el-select>
        </template>
      </el-table-column>
      <el-table-column label="公式" min-width="80" show-overflow-tooltip>
        <template #default="scope">
          <el-button size="mini"  icon="el-icon-aim" v-if="scope.row.paramType === 'HIDDEN' || scope.row.paramType === 'RESULT'" @click="editFormula(scope.row)" :disabled="!isRedact"></el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope" >
          <el-button type="text" icon="el-icon-remove-outline" class="role__btn" @click="btnDeleteItemData(scope.$index,scope.row)" :disabled="!isRedact">
           <span>删除</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </mds-card>
  <dialogDevice :dialogVisible="isResultFormulaDialogShow" :title="'结果公式'" @on-confirm="onResultFormulaConfirm" @on-close="onResultFormulaClose">
      <template #default>
        <h3>公式维护</h3>

        <div class="formulaText">
          =<span v-html="htmlFormula.join('')"></span>
        </div>
        <h3>变量</h3>
          <el-button-group>
            <template v-for="item in fomulaList" :key="item.paramSubscriptCode">
            <el-button size="small" class="topic-button"  v-if="item.paramSubscriptCode!==''&item.id!==''" type="primary" @click="spellFormula('variable',item.paramSubscriptCode,item.paramSubscript)">{{ item.paramSubscriptCode }}<sub v-if="item.paramSubscript!==''">{{item.paramSubscript}}</sub></el-button>
            </template>
          </el-button-group>
           <el-button-group>
              <el-button size="small" class="topic-button" type="primary" v-for="item in ['1','2','3','4','5','6','7','8','9','0']" :key="item" @click="spellFormula('value',item)">{{item}}</el-button>
          </el-button-group>
        <h3>公式</h3>
        <el-button-group>
          <el-button size="small" class="topic-button" type="primary" v-for="item in ['+','-','*','/','(',')']" :key="item" @click="spellFormula('operator',item)">{{item}}</el-button>
          <el-button size="small" class="topic-button" type="primary" @click="spellFormula('del','Del')"><em class="qmsIconfont qms-jisuanqishanchu" style="font-size:20px" /></el-button>
        </el-button-group>
      </template>
    </dialogDevice>
    <dialogDevice :dialogVisible="isRelatedeFormulaDialogShow" :title="'关联公式'" @on-confirm="onRelatedFormulaConfirm" @on-close="onRelatedFormulaClose">
      <template #default>
        <div style="display:flex; justify-content: flex-end;margin-bottom:5px;">
          <el-button  type="primary" size="small" icon="el-icon-plus" class="topic-button" @click="addItemOfrelatedeFormula">新增</el-button>
          <el-button  type="danger" size="small" icon="el-icon-delete"  class="topic-button" @click="deleteItemOfrelatedeFormula">批量删除</el-button>
        </div>
        <el-table ref="multipleTable" type="mini"  :cell-style="{'text-align':'center'}" :data="relatedeFormulaData"  tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column label="关联参数" min-width="110" show-overflow-tooltip>
            <template #default="scope">
              <el-input v-model="scope.row.associate" size="small"  placeholder="请输入" oninput="value=value.replace(/[^\d]/g,'')"  />
            </template>
          </el-table-column>
          <el-table-column label="结果值" min-width="110" show-overflow-tooltip>
            <template #default="scope">
              <el-input v-model="scope.row.value" size="small" placeholder="请输入" oninput="value=value.replace(/[^\d]/g,'')"  />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </dialogDevice>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, toRefs, ComponentInternalInstance, getCurrentInstance, watch } from 'vue'
import MdsCard from '@/components/package/mds-card/src/mds-card.vue'
import dialogDevice from '../../components/SHDialog.vue'
import {
  INSPECT_INDEX_PROCESS_PARAMETER_QUERY_API, // 基础数据-[指标版本管理][标准值明细]- 查询
  INSPECT_INDEX_PROCESS_PARAMETER_DELETE_API, // 基础数据-[指标版本管理][标准值明细]- 删除
  INSPECT_INDEX_PROCESS_PARAMETER_MODIFY_API, // 基础数据-[指标版本管理][标准值明细]- 编辑
  INSPECT_INDEX_PROCESS_PARAMETER_DROPDOWN_API, // 基础数据-[指标版本管理][标准值明细]- 下拉
  DICTIONARY_QUERY_API,
  INSPECT_INDEX_RELATED_PARAMETER_QUERY_API, // 基础数据-[指标检验方法明细][关联参数]- 查詢
  INSPECT_INDEX_RELATED_PARAMETER_DELETE_API, // 基础数据-[指标检验方法明细][关联参数]- 删除
  // INSPECT_INDEX_RELATED_PARAMETER_INSERT_API, // 基础数据-[指标检验方法明细][关联参数]- 新增
  INSPECT_INDEX_RELATED_PARAMETER_UPDATE_API // 基础数据-[指标检验方法明细][关联参数]- 编辑

} from '@/api/api'
import _ from 'lodash'

interface RelatedeFormulaData{
  associate: number | null
  id: string
  inspectParameterId: string
  value: string
  indexNum: number | null
}
interface RelatedeFormulaDataNoId{
  insertList?: RelatedeFormulaData[]
}

interface ImportData {
  defaultDate?: string
  defaultType?: string
  defaultValue?: string
  downSymbol?: string
  formula?: string
  id?: string
  inspectParameterGroupId?: string
  parentInspectParameterId?: string
  paramCode?: string
  paramDataType?: string
  paramDown?: number | null
  paramName?: string
  paramStandard?: number | null
  paramStandardType?: string
  paramSubscript?: string
  paramSubscriptCode?: string
  paramSubscriptCodeWithParamSubscript?: string
  paramType?: string
  paramUnit?: string
  paramUp?: number | null
  parentParamCode?: string
  parentParamSubscript?: string
  parentParamSubscriptCode?: string
  parentParamSubscriptCodeWithParentParamSubscript?: string
  upSymbol?: string
  delFlag?: number
  formulaDisplay?: string
  unHtmlFormula?: string
  relatedFormulaForNoId?: RelatedeFormulaData[]
  inspectAssciateAll?: RelatedeFormulaDataNoId
}

interface ImportObj { // 参数组 API
  groupMaterialName: string;
  id:string;
  inspectIndexMethodId: string;
  inspectMaterialId: string;
  inspectMaterialIds: string[]
  parameterDetails:string;
  parameterGroupCode: string;
  parameterGroupName: string;
}

interface Props{
  importObj: ImportObj
  title:string
}

interface ParamSubscriptOptions{
  id: string;
  paramCode: string;
  paramName: string;
  paramSubscript: string;
  paramSubscriptCode: string;
  disabled?: boolean
}

interface DictionaryReturnOptions {
    dictCode: string
    dictId: string
    dictOrder: string
    dictValue: string
    factoryName: string
    id: string
    disabled?: boolean
}

interface State {
  canEdit: boolean
  isResultFormulaDialogShow: boolean
  isRelatedeFormulaDialogShow: boolean
  isDialogShow: boolean
  controlBtnCanDo: boolean
  topicMainData: ImportData[]
  fomulaList: ImportData[]
  orgTopicMainData: ImportData[]
  inspectParameterIdOfRelatedParameter: string
  targetId: string
  isRedact: boolean
  paramSubscriptOptions: ParamSubscriptOptions[]
  parentParamSubscriptOptions: ParamSubscriptOptions[]
  paramUnitOptions: DictionaryReturnOptions[]
  paramDataTypeOptions: DictionaryReturnOptions[]
  paramStandardTypeOptions: DictionaryReturnOptions[]
  paramTypeOptions: DictionaryReturnOptions[]
  defaultTypeOptions: DictionaryReturnOptions[]
  relatedeFormulaData: RelatedeFormulaData[]
  selectedListOfRelatedeFormulaData: RelatedeFormulaData[]
  htmlFormula: string[]
  unHtmlFormula: string[]
  tempItemObj: ImportData
  tempValueForOptions: string
}

export default defineComponent({
  name: 'ProcessParameterIndex',
  components: {
    MdsCard,
    dialogDevice
  },
  // emits: ['update:dialogVisible', 'reset'],
  props: {
    title: {
      type: String,
      default: ''
    },
    importObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup (props, context) {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const parent = { ...context }
    const { importObj } = toRefs(props as Props)
    const state = reactive<State>({
      canEdit: false, // 过程参数是否可编辑
      isResultFormulaDialogShow: false,
      isRelatedeFormulaDialogShow: false,
      isDialogShow: false,
      controlBtnCanDo: false,
      topicMainData: [],
      fomulaList: [],
      orgTopicMainData: [],
      targetId: '',
      isRedact: false,
      paramSubscriptOptions: [],
      parentParamSubscriptOptions: [],
      paramUnitOptions: [],
      paramDataTypeOptions: [],
      paramStandardTypeOptions: [],
      paramTypeOptions: [],
      defaultTypeOptions: [],
      relatedeFormulaData: [],
      selectedListOfRelatedeFormulaData: [],
      inspectParameterIdOfRelatedParameter: '',
      htmlFormula: [], // to formulaDisplay
      unHtmlFormula: [], // to formula
      tempItemObj: {}, // item 全局变量
      tempValueForOptions: '' // 选单暂存值
    })

    // 函数

    // 预先载入变数值
    const initVariable = async () => {
      // 过程参数下拉
      await INSPECT_INDEX_PROCESS_PARAMETER_DROPDOWN_API().then((res) => {
        state.paramSubscriptOptions = res.data.data
        console.log('1过程参数下拉')
        console.log(state.paramSubscriptOptions)
      })

      // 单位下拉
      await DICTIONARY_QUERY_API({ dictType: 'INDEX_UNIT' }).then((res) => {
        state.paramUnitOptions = res.data.data
        console.log('2单位下拉')
        console.log(state.paramUnitOptions)
      })

      // 数据类型
      await DICTIONARY_QUERY_API({ dictType: 'PROC_PARAM_DATA_TYPE' }).then((res) => {
        state.paramDataTypeOptions = res.data.data
        console.log('3数据类型下拉')
        console.log(state.paramDataTypeOptions)
      })

      // 数据标准单位
      await DICTIONARY_QUERY_API({ dictType: 'PROC_PARAM_STANDARD' }).then((res) => {
        state.paramStandardTypeOptions = res.data.data
        console.log('4数据标准单位下拉')
        console.log(state.paramStandardTypeOptions)
      })

      // 过程参数默认值类型
      await DICTIONARY_QUERY_API({ dictType: 'PROC_DEFAULT_TYPE' }).then((res) => {
        state.defaultTypeOptions = res.data.data
        console.log('5过程参数默认值类型下拉')
        console.log(state.defaultTypeOptions)
      })

      // 过程参数类型
      await DICTIONARY_QUERY_API({ dictType: 'PROC_PARAM_TYPE' }).then((res) => {
        state.paramTypeOptions = res.data.data
        console.log('6过程参数类型')
        console.log(state.paramTypeOptions)
      })

      btnGetMainData()
    }

    // [ACTION:load] 获取标准值明细数据
    const btnGetMainData = async () => {
      const res = await INSPECT_INDEX_PROCESS_PARAMETER_QUERY_API({
        inspectParameterGroupId: state.targetId
      })

      console.log('获取过程参数数据')
      console.log(res.data.data)
      state.parentParamSubscriptOptions = []
      // 对 paramTypeOptions 重置
      state.paramTypeOptions.forEach(subItem => {
        subItem.disabled = false
      })
      res.data.data.forEach((item:ImportData) => {
        // modify
        item.paramSubscriptCodeWithParamSubscript = item.paramSubscriptCode + ' ' + item.paramSubscript
        item.parentParamSubscriptCodeWithParentParamSubscript = item.parentParamSubscriptCode + ' ' + item.parentParamSubscript
        item.formulaDisplay = escape2Html(item.formulaDisplay as string) // 编码还原
        item.relatedFormulaForNoId = []

        // 参数类型选单重置
        // 参数类型已有结果下，不可再选
        if (item.paramType === 'RESULT') {
          state.paramTypeOptions.forEach(subItem => {
            if (subItem.dictCode === 'RESULT') {
              subItem.disabled = true
            } else {
              subItem.disabled = false
            }
          })
        }

        // 关联参数下拉选单附值
        state.paramSubscriptOptions.forEach((subItem:ParamSubscriptOptions) => {
          subItem.disabled = false
          // 需排除已维护参数类型为“结果”的过程参数
          if (item.paramCode === subItem.paramCode && item.paramType !== 'RESULT') {
            state.parentParamSubscriptOptions.push(subItem)
          }
        })
      })

      // 过程参数编辑锁解开，避免误点
      state.canEdit = true
      state.topicMainData = res.data.data

      state.orgTopicMainData = JSON.parse(JSON.stringify(res.data.data))
    }

    // [BTN:删除][过程参数] 删除 item
    const btnDeleteItemData = (mainIndex: number, val:ImportData) => {
      let canPass = false
      state.topicMainData.forEach((item, index) => {
        if (item.id !== '' && mainIndex !== index) {
          if (!_.isEqual(state.orgTopicMainData[index], item)) {
            proxy.$errorToast('删除前，请先对编辑数据进行保存')
            canPass = false
          } else {
            canPass = true
          }
        } else {
          canPass = true
        }
      })
      // 有异动的数据，不进行删除动作
      if (canPass === false) {
        return
      }

      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (val.id === '') {
          // val.delFlag = 1
          state.topicMainData.splice(mainIndex, 1)
          proxy.$successToast('操作成功')
        } else {
          const res = await INSPECT_INDEX_PROCESS_PARAMETER_DELETE_API({ id: val.id })
          if (res.data.code === 200) {
            proxy.$successToast('操作成功')
            await btnGetMainData()
          }
        }
      })
    }

    // [BTN:新增][过程参数]
    const btnAddItemData = async () => {
      state.topicMainData.push({
        id: '',
        inspectParameterGroupId: state.targetId,
        paramSubscript: '', // 过程参数
        paramSubscriptCode: '', // 过程参数下标
        paramSubscriptCodeWithParamSubscript: '',
        paramUnit: '', // 单位
        paramDataType: '',
        paramStandard: null,
        paramStandardType: '',
        paramUp: null,
        paramDown: null,
        paramType: '',
        formula: '',
        paramName: '',
        defaultType: '',
        defaultValue: '',
        delFlag: 0,
        paramCode: '',
        parentInspectParameterId: '',
        parentParamSubscript: '', // 关联参数
        parentParamSubscriptCode: '', // 关联参数下标
        parentParamSubscriptCodeWithParentParamSubscript: '',
        formulaDisplay: '',
        unHtmlFormula: '',
        inspectAssciateAll: {
          insertList: []
        }
        // isRedact: true
      })
    }

    // [BTN:保存][过程参数]
    const btnSaveItemData = () => {
      if (!ruleSubmit()) {
        return
      }

      const tempAdd:ImportData[] = []
      const tempEdit:ImportData[] = []

      state.topicMainData.forEach((item, index) => {
        if (item.id === '') { // 新增
          delete item.paramSubscriptCodeWithParamSubscript
          delete item.parentParamSubscriptCodeWithParentParamSubscript

          const container:string[] = []
          if (item.formulaDisplay !== undefined && item.formulaDisplay !== '') {
            item.formulaDisplay.split(',').forEach(subItem => {
              const temp = subItem.indexOf('<sub>')
              if (temp >= 0) {
                container.push(`${subItem.substring(31, temp)}[${subItem.substring(temp + 5, subItem.indexOf('</sub>'))}]`)
              }
            })
          }

          item.formula = Array.from(new Set(container)).join(',')
          item.formulaDisplay = html2Escape(item.formulaDisplay as string)
          if (item.inspectAssciateAll) {
            item.inspectAssciateAll.insertList = item.relatedFormulaForNoId
          }

          tempAdd.push(item)
        } else { // 编辑
          if (!_.isEqual(state.orgTopicMainData[index], item)) {
            delete item.paramSubscriptCodeWithParamSubscript
            delete item.parentParamSubscriptCodeWithParentParamSubscript

            const container:string[] = []
            if (item.formulaDisplay !== undefined && item.formulaDisplay !== '') {
              item.formulaDisplay.split(',').forEach(subItem => {
                const temp = subItem.indexOf('<sub>')
                if (temp >= 0) {
                  container.push(`${subItem.substring(31, temp)}[${subItem.substring(temp + 5, subItem.indexOf('</sub>'))}]`)
                }
              })
            }

            item.formula = Array.from(new Set(container)).join(',')
            item.formulaDisplay = html2Escape(item.formulaDisplay as string)
            tempEdit.push(item)
          }
        }
      })

      console.log('tempAdd')
      console.log(tempAdd)
      console.log('tempEdit')
      console.log(tempEdit)

      if (!(tempAdd.length === 0 && tempEdit.length === 0)) {
        INSPECT_INDEX_PROCESS_PARAMETER_MODIFY_API(
          {
            insertList: tempAdd,
            updateList: tempEdit
          }
        ).then(() => {
          proxy.$successToast('操作成功')
          // reload
          btnGetMainData()
          // 关闭标准值明细 card
          closeStandardValueInfoArea()
        })
      } else {
        // reload
        btnGetMainData()
        // 关闭标准值明细 card
        closeStandardValueInfoArea()
      }
    }

    // [BTN:取消][过程参数]
    const btnLeaveItemData = () => {
      closeStandardValueInfoArea()
    }

    // [BTN:编辑][过程参数]
    const btnEditItemData = () => {
      state.controlBtnCanDo = true
      state.isRedact = true
    }

    // [ATC] 关闭标准值明细 card
    const closeStandardValueInfoArea = () => {
      state.controlBtnCanDo = false
      state.isRedact = false
      parent.emit('update:dialogVisible', false)
    }

    // [Rule] 验证标准值明细 data
    const ruleSubmit = () => {
      console.log('state.topicMainData')
      console.log(state.topicMainData)
      const tempParentParamSubscriptList:any = []
      const tempParamSubscriptList:any = []
      for (const item of state.topicMainData) {
        if (item.parentParamSubscriptCode !== '' && item.parentParamSubscript !== '') {
          if (tempParentParamSubscriptList.indexOf(item.parentParamSubscriptCode + ' ' + item.parentParamSubscript) === -1) {
            tempParentParamSubscriptList.push(item.parentParamSubscriptCode + ' ' + item.parentParamSubscript)
          } else {
            proxy.$warningToast('有重复关联参数')
            return false
          }
        }
        if (item.paramSubscriptCode === '' || item.paramUnit === '' || item.paramType === '') {
          proxy.$warningToast('请完整录入栏位')
          return false
        }

        if (item.paramSubscriptCode !== '') {
          if (tempParamSubscriptList.indexOf(item.paramSubscriptCode + ' ' + item.paramSubscript) === -1) {
            tempParamSubscriptList.push(item.paramSubscriptCode + ' ' + item.paramSubscript)
          } else {
            proxy.$warningToast('有重复过程参数')
            return false
          }
        }
        if (item.paramType === 'HIDDEN' && item.parentParamSubscriptCodeWithParentParamSubscript === '') {
          proxy.$warningToast('请选择关联参数')
          return false
        }

        if (item.paramDataType === 'FLOAT_POINT' && (!item.paramStandard || item.paramStandardType === '')) {
          proxy.$warningToast('请录入数据标准')
          return false
        }
      }

      return true
    }

    // [BTN:确认][结果公式]
    const onResultFormulaConfirm = () => {
      state.tempItemObj.formulaDisplay = state.htmlFormula.join(',')
      state.isResultFormulaDialogShow = false
    }
    // [BTN:关闭][结果公式]
    const onResultFormulaClose = () => {
      state.htmlFormula = []
      state.unHtmlFormula = []
      state.isResultFormulaDialogShow = false
    }

    // [BTN:确认][关联公式]
    const onRelatedFormulaConfirm = () => {
      console.log('state.tempItemObj')
      console.log(state.tempItemObj)
      if (state.tempItemObj.id !== '') { // 有 id
        INSPECT_INDEX_RELATED_PARAMETER_UPDATE_API({
          insertList: state.relatedeFormulaData.filter(item => item.id === ''),
          updateList: state.relatedeFormulaData.filter(item => item.id !== '')
        }).then(() => {
          onRelatedFormulaClose()
        })
      } else { // 无 id
        state.tempItemObj.relatedFormulaForNoId = JSON.parse(JSON.stringify(state.relatedeFormulaData))
        onRelatedFormulaClose()
      }
    }

    // [BTN:关闭][关联公式]
    const onRelatedFormulaClose = () => {
      state.relatedeFormulaData = []
      state.isRelatedeFormulaDialogShow = false
    }

    // [ACT][结果公式]
    const spellFormula = (type:string, addText1:string, addText2 = '') => {
      if (type === 'del') { // 删除字元操作
        if (state.htmlFormula.length !== 0) {
          const target = state.htmlFormula.pop() as string
          if (target.indexOf('<sub>') >= 0) {
            state.unHtmlFormula.pop()
          }
        }
      } else if (type === 'value') { // 数字
        state.htmlFormula.push(`<span style="padding:2px 4px;">${addText1}</span>`)
      } else if (type === 'operator') { // 运算子
        state.htmlFormula.push(`<span style="padding:2px 4px;">${addText1}</span>`)
      } else if (type === 'variable') { // 变数
        state.htmlFormula.push(`<span style="padding:2px 4px;">${addText1}<sub>${addText2}</sub></span>`)
        state.unHtmlFormula.push(`${addText1}[${addText2}]`)
      }
    }

    // [Click]结果公式按钮后动作
    const editFormula = (row:ImportData) => {
      state.tempItemObj = row
      console.log('state.tempItemObj')
      console.log(state.tempItemObj)
      if (row.paramType === 'HIDDEN') {
        // if (row.id === '') {
        //   proxy.$infoToast('请先保存数据')
        //   return
        // }
        state.isRelatedeFormulaDialogShow = true
        state.inspectParameterIdOfRelatedParameter = row.id as string
        if (state.inspectParameterIdOfRelatedParameter) {
          getRelatedParameter(state.inspectParameterIdOfRelatedParameter)
        } else {
          if (row.relatedFormulaForNoId) { // 可能是未建任何 data ,relatedFormulaForNoId 参数未于一开始建立
            state.relatedeFormulaData = JSON.parse(JSON.stringify(row.relatedFormulaForNoId))
          } else {
            state.relatedeFormulaData = []
          }
        }

        onResultFormulaClose()
      } else if (row.paramType === 'RESULT') {
        state.fomulaList = state.topicMainData.filter(item => item.paramCode !== state.tempItemObj.paramCode)
        console.log('state.fomulaList')
        console.log(state.fomulaList)

        state.isResultFormulaDialogShow = true
        onRelatedFormulaClose()

        state.htmlFormula = !state.tempItemObj.formulaDisplay ? [] : state.tempItemObj.formulaDisplay.split(',')
        state.unHtmlFormula = []
        state.htmlFormula.forEach(item => {
          const temp = item.indexOf('<sub>')
          if (temp >= 0) {
            state.unHtmlFormula.push(`${item.substring(31, temp)}[${item.substring(temp + 5, item.indexOf('</sub>'))}]`)
          }
        })
        // state.unHtmlFormula=
      }
    }

    // [SELECT:过程参数][Event:change]
    const changeParamSubscriptOptions = (val:string, row:ImportData) => {
      const temp:string[] = val.split(' ')
      row.paramSubscriptCode = temp[0]
      row.paramSubscript = temp[1]
      row.paramCode = temp[0] + '[' + temp[1] + ']'
    }

    // [SELECT:关联参数][Event:change]
    const changeParentParamSubscriptOptions = (val:string, row:ImportData) => {
      let temp:string[] = []
      if (val !== '') {
        temp = val.split(' ')
        row.parentParamSubscriptCode = temp[0]
        row.parentParamSubscript = temp[1]
        row.parentParamCode = temp[0] + '[' + temp[1] + ']'
        state.topicMainData.forEach(item => {
          if (item.paramCode === temp[0] + '[' + temp[1] + ']') {
            row.parentInspectParameterId = item.id
          }
        })
      } else {
        row.parentParamCode = ''
        row.parentParamSubscriptCode = ''
        row.parentParamSubscript = ''
        row.parentInspectParameterId = ''
      }
    }

    // [关联公式]dialog 获取 data
    const getRelatedParameter = (id:string) => {
      // PO 不合常理需求，修改时请小心

      INSPECT_INDEX_RELATED_PARAMETER_QUERY_API({
        inspectParameterId: id
      }).then((res) => {
        console.log('关联公式')
        console.log(res.data.data)

        state.relatedeFormulaData = res.data.data
        state.relatedeFormulaData.forEach((item, index) => {
          item.indexNum = index
        })
      })
    }

    // [BTN:新增][关联公式]dialog 新增 data
    const addItemOfrelatedeFormula = () => {
      state.relatedeFormulaData.push({
        associate: null,
        id: '',
        inspectParameterId: state.inspectParameterIdOfRelatedParameter,
        value: '',
        indexNum: state.relatedeFormulaData.length
      })
    }

    // [关联公式]dialog table 选框选择
    const handleSelectionChange = (val: RelatedeFormulaData[]) => {
      state.selectedListOfRelatedeFormulaData = val
    }

    // [BTN:批次删除][关联公式]
    const deleteItemOfrelatedeFormula = () => {
      console.log('state.selectedListOfRelatedeFormulaData')
      console.log(state.selectedListOfRelatedeFormulaData)
      console.log('state.relatedeFormulaData')
      console.log(state.relatedeFormulaData)

      if (state.selectedListOfRelatedeFormulaData.length === 0) {
        return
      }
      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const tempDeleteList: string[] = []
        state.selectedListOfRelatedeFormulaData.forEach((item) => {
          if (item.id !== '') {
            tempDeleteList.push(item.id)
          } else {
            state.relatedeFormulaData.splice(item.indexNum as number, 1)
          }
        })
        if (tempDeleteList.length) {
          const res = await INSPECT_INDEX_RELATED_PARAMETER_DELETE_API(tempDeleteList)
          if (res.data.code === 200) {
            proxy.$successToast('操作成功')
            await getRelatedParameter(state.inspectParameterIdOfRelatedParameter)
          }
        }
      })
    }

    // [过程参数]表格 header 合并
    const headerMerge = (result:any) => {
      if (result.rowIndex === 1) {
        return { display: 'none' }
      }
    }

    /* 用正则表达式实现html编码（转义）（另一种写法） */
    const html2Escape = (str:string) => {
      const arrEntiries:any = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }
      return str.replace(/[<>&"]/g, (c:string) => { return arrEntiries[c] as string })
    }

    /* 用正则表达式实现html解码（反转义）（另一种写法） */
    const escape2Html = (str:string) => {
      const arrEntiries:any = { '&lt;': '<', '&gt;': '>', '&nbsp': ' ', '&amp;': '&', '&quot;': '"' }
      return str.replace(/(&lt|&gt|&nbsp|&amp|&quot);/ig, (c:string) => { return arrEntiries[c] as string })
    }

    // [SELECT:参数类型][Event:change]
    const changeParamTypeOptions = (val:string, row:ImportData) => {
      // 离开 HIDDEN 时的判断
      if (row.id !== '' && state.tempValueForOptions === 'HIDDEN') {
        proxy.$confirm('确认是否切换参数类型？关联公式将会清空', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const target = await INSPECT_INDEX_RELATED_PARAMETER_QUERY_API({
            inspectParameterId: row.id
          })
          const temp:string[] = []
          target.data.data.forEach((item:RelatedeFormulaData) => {
            temp.push(item.id)
          })
          if (temp.length !== 0) {
            await INSPECT_INDEX_RELATED_PARAMETER_DELETE_API(temp)
          }
        }).catch(() => {
          row.paramType = state.tempValueForOptions
        })
      }

      // 选择 RESULT 时行动
      if (val === 'RESULT') {
        state.paramTypeOptions.forEach(item => {
          if (item.dictCode === 'RESULT') {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
    }

    // [SELECT:参数类型][Event:focus]
    const focusParamTypeOptions = (val:any, row:ImportData) => {
      state.tempValueForOptions = row.paramType as string
    }

    // [function] 下拉选单排除该过程参数
    const excludeItemFromMyRow = (target:ParamSubscriptOptions[], row:ImportData) => {
      target.map(subItem => {
        if (subItem.paramCode !== row.paramCode) {
          subItem.disabled = false
        } else {
          subItem.disabled = true
        }
      })
      return target
    }

    // rule: 1.需排除已维护参数类型为“结果”的过程参数
    //       2.排除自己
    const focusParentParamSubscriptOptions = (val:any, row:ImportData) => {
      state.parentParamSubscriptOptions.map(subItem => {
        // 排除自己
        if (subItem.paramCode !== row.paramCode) {
          subItem.disabled = false
        } else {
          subItem.disabled = true
        }
        console.log('state.topicMainData')
        console.log(state.topicMainData)
        // 需排除已维护参数类型为“结果”的过程参数
        state.topicMainData.forEach(item => {
          if (item.paramType === 'RESULT' && subItem.paramCode === item.paramCode) {
            subItem.disabled = true
          }
        })
      })
    }

    watch(
      importObj,
      newValue => {
        if (newValue !== null) {
          console.log('importObj')
          console.log(newValue)
          state.controlBtnCanDo = false
          state.isRedact = false
          state.targetId = newValue.id
          // btnGetMainData()
          initVariable()
        }
      },
      { immediate: true }
    )
    onMounted(() => {
      //
    })

    return {
      // rowDelFlagOfTable,
      ...toRefs(state),
      btnGetMainData,
      btnLeaveItemData,
      btnSaveItemData,
      btnDeleteItemData,
      btnAddItemData,
      btnEditItemData,
      ruleSubmit,
      closeStandardValueInfoArea,
      onResultFormulaConfirm,
      onResultFormulaClose,
      spellFormula,
      editFormula,
      changeParamSubscriptOptions,
      changeParentParamSubscriptOptions,
      onRelatedFormulaClose,
      onRelatedFormulaConfirm,
      getRelatedParameter,
      addItemOfrelatedeFormula,
      handleSelectionChange,
      deleteItemOfrelatedeFormula,
      headerMerge,
      changeParamTypeOptions,
      focusParamTypeOptions,
      initVariable,
      excludeItemFromMyRow,
      focusParentParamSubscriptOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  min-height: 550px;
  min-height: calc(100vh - 117px);
}

h3 {
      line-height: 32px;
      font-size: 14px !important;
      font-weight: 600;
      position: relative;
      &::before{
        display: inline-block;
        margin-right:5px;
        content: "";
        width: 6px;
        height: 8px;
        border-radius: 3px;
        background-color: #487bff;
      }
    }

.formulaText{
    display: block;
    resize: vertical;
    padding: 5px 15px;
    line-height: 1.5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    font-size: inherit;
    color: var(--el-input-font-color,var(--el-text-color-regular));
    background-color: var(--el-input-background-color,var(--el-color-white));
    background-image: none;
    border: var(--el-input-border,var(--el-border-base));
    border-radius: var(--el-input-border-radius,var(--el-border-radius-base));
    -webkit-transition: var(--el-border-transition-base);
    transition: var(--el-border-transition-base);
    height: 100px;
    overflow: scroll;
}
</style>
