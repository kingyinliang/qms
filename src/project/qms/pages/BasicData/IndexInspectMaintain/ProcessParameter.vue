<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-30 11:24:46
 * @LastEditors: Telliex
 * @LastEditTime: 2021-08-20 19:46:44
-->
<template>
  <mds-card class="test_method" :title="title" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
        <div style="float: right;display: flex; margin-bottom:10px;">
          <el-button v-if="!controlBtnCanDo" type="primary" icon="el-icon-edit" size="small" class="role__btn" @click="btnEditItemData">编辑</el-button>
          <el-button v-if="controlBtnCanDo" icon="el-icon-circle-plus-outline" type="primary" size="small" @click="btnAddItemData">新增</el-button>
          <el-button v-if="controlBtnCanDo" icon="el-icon-circle-check" type="primary" size="small" @click="btnSaveItemData">保存</el-button>
          <el-button v-if="controlBtnCanDo" icon="el-icon-circle-close" type="primary" size="small" @click="btnLeaveItemData">取消</el-button>
        </div>
    </template>
    <el-table
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
            <el-select v-model="scope.row.paramSubscriptCodeWithParamSubscript" size="small" :disabled="!isRedact" clearable @change="val=>changeParamSubscriptOptions(val,scope.row)">
              <el-option
                v-for="item in paramSubscriptOptions"
                :key="item.paramSubscriptCode"
                :label="item.paramSubscriptCode+' '+item.paramSubscript"
                :value="item.paramSubscriptCode+' '+item.paramSubscript">
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
          <el-select v-model="scope.row.paramUnit" size="small" :disabled="!isRedact" clearable>
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
          <el-select v-model="scope.row.paramDataType" size="small" :disabled="!isRedact" clearable>
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
            <el-input v-model.number="scope.row.paramStandard" size="small" type="number" placeholder="请输入" :disabled="!isRedact" />
          </template>
        </el-table-column>
        <el-table-column  min-width="110" show-overflow-tooltip>
          <template #default="scope">
            <el-select v-model="scope.row.paramStandardType" size="small" :disabled="!isRedact" clearable>
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
          <el-input v-model.number="scope.row.paramUp" type="number" size="small" placeholder="请输入" :disabled="!isRedact" />
        </template>
      </el-table-column>
      <el-table-column label="下限" min-width="110" show-overflow-tooltip>
        <template #default="scope">
          <el-input v-model.number="scope.row.paramDown" type="number" size="small" placeholder="请输入" :disabled="!isRedact" />
        </template>
      </el-table-column>
      <el-table-column label="参数类型" min-width="110" show-overflow-tooltip>
        <template #header>
          <span class="required">参数类型</span>
        </template>
        <template #default="scope">
          <el-select v-model="scope.row.paramType" size="small" :disabled="!isRedact" clearable>
            <el-option
              v-for="item in paramTypeOptions"
              :key="item.dictCode"
              :label="item.dictValue"
              :value="item.dictCode">
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
            <el-select v-model="scope.row.defaultType" size="small" :disabled="!isRedact" clearable>
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
            <el-input v-model.number="scope.row.defaultValue" size="small" type="number" placeholder="请输入" :disabled="!isRedact||scope.row.innerUpSymbol===''" />
          </template>
         </el-table-column>
      </el-table-column>
         <el-table-column label="关联参数" min-width="110" show-overflow-tooltip>
        <template #default="scope">
          <el-select v-model="scope.row.parentParamSubscriptCodeWithParentParamSubscript" size="small" :disabled="!isRedact" clearable @change="val=>changeParentParamSubscriptOptions(val,scope.row)">
                <el-option
                  v-for="item in parentParamSubscriptOptions.filter(item=>item.paramCode!==scope.row.paramCode)"
                  :key="item.paramSubscriptCode"
                  :label="item.paramSubscriptCode+' '+item.paramSubscript"
                  :value="item.paramSubscriptCode+' '+item.paramSubscript">
                <span >{{ item.paramSubscriptCode }}<sub>{{item.paramSubscript}}</sub></span>
              </el-option>
            </el-select>
        </template>
      </el-table-column>
      <el-table-column label="公式" min-width="80" show-overflow-tooltip>
        <template #default="scope">
          <span>{{scope.row.formula}}</span>
          <el-button size="mini"  icon="el-icon-aim" v-if="scope.row.paramType === 'HIDDEN' || scope.row.paramType === 'RESULT'" @click="editFormula(scope.row)"></el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope" >
          <el-button type="text" icon="el-icon-remove-outline" class="role__btn" @click="btnDeleteItemData(scope.$index,scope.row)" :disabled="!isRedact">
           删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </mds-card>
  <dialogDevice :dialogVisible="isResultFormulaDialogShow" :title="'结果公式'" @on-confirm="onResultFormulaConfirm" @on-close="onResultFormulaClose">
      <template #default>
        <h3>公式维护</h3>
        <!-- <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="="
          v-model="textFormula"
          readonly=''
          style="font-size:20px">
        </el-input> -->
        <div class="formulaText">
          <!-- ={{textFormula}} -->
          =<p v-html="htmlFormula.join('')"></p>
        </div>
        <h3>变量</h3>
          <template v-for="item in topicMainData" :key="item.paramSubscriptCode">
            <el-button-group>
              <el-button  v-if="item.paramSubscriptCode!==''" type="primary" @click="spellFormula(textFormulaList,item.paramSubscriptCode+'['+item.paramSubscript+']')">{{ item.paramSubscriptCode }}<sub>{{item.paramSubscript}}</sub></el-button>
            </el-button-group>
          </template>
           <el-button-group>
              <el-button type="primary" @click="spellFormula(textFormulaList,'1')">1</el-button>
              <el-button type="primary" @click="spellFormula(textFormulaList,'2')">2</el-button>
              <el-button type="primary" @click="spellFormula(textFormulaList,'3')">3</el-button>
              <el-button type="primary" @click="spellFormula(textFormulaList,'4')">4</el-button>
              <el-button type="primary" @click="spellFormula(textFormulaList,'5')">5</el-button>
              <el-button type="primary" @click="spellFormula(textFormulaList,'6')">6</el-button>
              <el-button type="primary" @click="spellFormula(textFormulaList,'7')">7</el-button>
              <el-button type="primary" @click="spellFormula(textFormulaList,'8')">8</el-button>
              <el-button type="primary" @click="spellFormula(textFormulaList,'9')">9</el-button>
              <el-button type="primary" @click="spellFormula(textFormulaList,'0')">0</el-button>
            </el-button-group>
        <h3>公式</h3>
        <el-button-group>
        <el-button type="primary" @click="spellFormula(textFormulaList,'+')">+</el-button>
        <el-button type="primary" @click="spellFormula(textFormulaList,'-')">-</el-button>
        <el-button type="primary" @click="spellFormula(textFormulaList,'*')">*</el-button>
        <el-button type="primary" @click="spellFormula(textFormulaList,'/')">/</el-button>
        <el-button type="primary" @click="spellFormula(textFormulaList,'(')">(</el-button>
        <el-button type="primary" @click="spellFormula(textFormulaList,')')">)</el-button>
        <el-button type="primary" @click="spellFormula(textFormulaList,'Del')">Del</el-button>
        </el-button-group>
      </template>
    </dialogDevice>
    <dialogDevice :dialogVisible="isRelatedeFormulaDialogShow" :title="'关联公式'" @on-confirm="onRelatedFormulaConfirm" @on-close="onRelatedFormulaClose">
      <template #default>
        <div style="display:flex; justify-content: flex-end;margin-bottom:5px;">
          <el-button  type="primary" size="mini" @click="addItemOfrelatedeFormula">新增</el-button>
          <el-button  type="danger" size="mini"  @click="deleteItemOfrelatedeFormula">批量删除</el-button>
        </div>
        <el-table ref="multipleTable" type="mini"  :cell-style="{'text-align':'center'}" :data="relatedeFormulaData"  tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column label="关联参数" min-width="110" show-overflow-tooltip>
            <template #default="scope">
              <el-input v-model.number="scope.row.associate" type="number" size="small"  placeholder="请输入" :disabled="scope.row.id!==''" />
            </template>
          </el-table-column>
          <el-table-column label="结果值" min-width="110" show-overflow-tooltip>
            <template #default="scope">
              <el-input v-model.number="scope.row.value" type="number" size="small" placeholder="请输入" :disabled="scope.row.id!==''" />
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
  INSPECT_INDEX_RELATED_PARAMETER_QUERY_API,
  INSPECT_INDEX_RELATED_PARAMETER_DELETE_API,
  INSPECT_INDEX_RELATED_PARAMETER_INSERT_API

} from '@/api/api'
import _ from 'lodash'

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
  // importData: ImportData[]
  title:string
}

interface ParamSubscriptOptions{
  id: string;
  paramCode: string;
  paramName: string;
  paramSubscript: string;
  paramSubscriptCode: string;
}

interface DictionaryReturnOptions {
    dictCode: string;
    dictId: string;
    dictOrder: string;
    dictValue: string;
    factoryName: string;
    id: string;
}

interface RelatedeFormulaData{
  associate: number | null
  id: string
  inspectParameterId: string
  value: string
}

interface State {
  isResultFormulaDialogShow: boolean
  isRelatedeFormulaDialogShow: boolean
  isDialogShow: boolean
  controlBtnCanDo: boolean
  topicMainData: ImportData[]
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
  textFormula: string
  textFormulaList: string[]
  relatedeFormulaData: RelatedeFormulaData[]
  selectedListOfRelatedeFormulaData: RelatedeFormulaData[]
  htmlFormula: string[]
}

export default defineComponent({
  name: 'ProcessParameterIndex',
  components: {
    MdsCard,
    dialogDevice
  },
  emits: ['update:dialogVisible'],
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
    // importData: {
    //   type: Array,
    //   default: () => {
    //     return []
    //   }
    // }
  },
  setup (props, context) {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const parent = { ...context }
    const { importObj } = toRefs(props as Props)
    const state = reactive<State>({
      isResultFormulaDialogShow: false,
      isRelatedeFormulaDialogShow: false,
      isDialogShow: false,
      controlBtnCanDo: false,
      topicMainData: [],
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
      textFormula: '',
      textFormulaList: [],
      relatedeFormulaData: [],
      selectedListOfRelatedeFormulaData: [],
      inspectParameterIdOfRelatedParameter: '',
      htmlFormula: []
    })

    // 函数

    // [ACTION:load] 获取标准值明细数据
    const btnGetMainData = async () => {
      const res = await INSPECT_INDEX_PROCESS_PARAMETER_QUERY_API({
        inspectParameterGroupId: state.targetId
      })
      console.log('获取过程参数数据')
      console.log(res.data.data)
      res.data.data.forEach((item:ImportData) => {
        item.paramSubscriptCodeWithParamSubscript = item.paramSubscriptCode + ' ' + item.paramSubscript
        item.parentParamSubscriptCodeWithParentParamSubscript = item.parentParamSubscriptCode + ' ' + item.parentParamSubscript
        // item.isRedact = false
      })

      state.topicMainData = res.data.data

      // 关联参数附值
      state.parentParamSubscriptOptions = []
      res.data.data.forEach((item:ImportData) => {
        state.paramSubscriptOptions.forEach((subItem:ParamSubscriptOptions) => {
          if (item.paramCode === subItem.paramCode) {
            state.parentParamSubscriptOptions.push(subItem)
          }
        })
      })

      state.orgTopicMainData = JSON.parse(JSON.stringify(res.data.data))
    }

    // [BTN:删除] 删除 item
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

    // [BTN:新增]
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
        parentParamSubscriptCodeWithParentParamSubscript: ''
        // isRedact: true
      })
    }

    // [BTN:保存]
    const btnSaveItemData = async () => {
      const tempAdd:ImportData[] = []
      const tempEdit:ImportData[] = []
      state.topicMainData.forEach((item, index) => {
        if (item.id === '') {
          // item.standardMonth = item.standardMonthList.join(',')

          item.parentInspectParameterId = item.id
          delete item.paramSubscriptCodeWithParamSubscript
          delete item.parentParamSubscriptCodeWithParentParamSubscript
          tempAdd.push(item)
        } else {
          if (!_.isEqual(state.orgTopicMainData[index], item)) {
            item.parentInspectParameterId = item.id
            delete item.paramSubscriptCodeWithParamSubscript
            delete item.parentParamSubscriptCodeWithParentParamSubscript
            tempEdit.push(item)
          }
        }
      })
      console.log(tempAdd)
      console.log(tempEdit)

      if (ruleSubmit() && !(tempAdd.length === 0 && tempEdit.length === 0)) {
        await INSPECT_INDEX_PROCESS_PARAMETER_MODIFY_API(
          {
            insertList: tempAdd,
            updateList: tempEdit
          }
        )
        proxy.$successToast('操作成功')
        // reload
        btnGetMainData()
      }
      // 关闭标准值明细 card
      closeStandardValueInfoArea()
    }

    // [BTN:取消]
    const btnLeaveItemData = () => {
      closeStandardValueInfoArea()
    }

    // 关闭标准值明细 card
    const closeStandardValueInfoArea = () => {
      state.controlBtnCanDo = false
      state.isRedact = false
      parent.emit('update:dialogVisible', false)
    }

    // [BTN:编辑]
    const btnEditItemData = () => {
      state.controlBtnCanDo = true
      state.isRedact = true
    }

    // const rowDelFlagOfTable = ({ row }) => {
    //   if (row.delFlag === 1) {
    //     return 'rowDel'
    //   }
    //   return ''
    // }

    // 验证标准值明细 data
    const ruleSubmit = () => {
      for (const item of state.topicMainData) {
        if (item.paramSubscriptCode === '' || item.paramUnit === '' || item.paramType === '' || (item.paramDataType === 'FLOAT_POINT' && item.paramStandard === null)) {
          proxy.$warningToast('请完整录入栏位')
          return false
        }
      }
      return true
    }

    const onResultFormulaConfirm = () => {
      // parent.emit('update:dialogVisible', false)
      // parent.emit('inspectCategoryList', state.inspectCategoryList)
    }
    const onRelatedFormulaConfirm = () => {
      INSPECT_INDEX_RELATED_PARAMETER_INSERT_API(
        state.relatedeFormulaData.filter(item => item.id === '')
      ).then(() => {
        onRelatedFormulaClose()
      })
    }

    const onResultFormulaClose = () => {
      state.isResultFormulaDialogShow = false
      // filterText.value = ''
      // state.inspectCategoryList = []
      // parent.emit('update:dialogVisible', false)
      // parent.emit('reset')
    }
    const onRelatedFormulaClose = () => {
      state.isRelatedeFormulaDialogShow = false
    }

    const spellFormula = (orgTextList:string[], addText:string) => {
      console.log('addText')
      console.log(addText)
      // let str = ''
      if (addText === 'Del') {
        // state.textFormula = orgText.substr(0, orgText.length - 1)
        if (orgTextList.length !== 0) {
          orgTextList.pop()
          state.htmlFormula.pop()
        }
      } else {
        orgTextList.push(addText)
        if (addText.indexOf('[') !== -1) {
          state.htmlFormula.push(`<span style="padding:2px 4px;">${addText.split('[')[0]}<sub>${addText.split('[')[1].replace(']', '')}</sub></span>`)
        } else {
          state.htmlFormula.push(`<span style="padding:2px 4px;">${addText}</span>`)
        }

        // str = str + addText
        // state.textFormula = str
      }
      state.textFormula = orgTextList.join('')
      console.log(state.htmlFormula)
    }

    const editFormula = (row:ImportData) => {
      if (row.paramType === 'HIDDEN') {
        state.isRelatedeFormulaDialogShow = true
        state.inspectParameterIdOfRelatedParameter = row.id as string
        getRelatedParameter(state.inspectParameterIdOfRelatedParameter)
        onResultFormulaClose()
      } else if (row.paramType === 'RESULT') {
        state.isResultFormulaDialogShow = true
        onRelatedFormulaClose()
      }
    }

    const changeParamSubscriptOptions = (val:string, row:ImportData) => {
      console.log(val)
      const temp:string[] = val.split(' ')
      row.paramSubscriptCode = temp[0]
      row.paramSubscript = temp[1]
      row.paramCode = temp[0] + '[' + temp[1] + ']'
    }

    const changeParentParamSubscriptOptions = (val:string, row:ImportData) => {
      console.log(val)
      const temp:string[] = val.split(' ')
      row.parentParamSubscriptCode = temp[0]
      row.parentParamSubscript = temp[1]
    }

    watch(
      importObj,
      newValue => {
        if (newValue !== null) {
          console.log('importObj')
          console.log(newValue)
          state.targetId = newValue.id
          btnGetMainData()
        }
      },
      { immediate: true }
    )

    const getRelatedParameter = (id:string) => {
      INSPECT_INDEX_RELATED_PARAMETER_QUERY_API({
        inspectParameterId: id
      }).then((res) => {
        console.log('关联参数')
        console.log(res.data.data)
        state.relatedeFormulaData = res.data.data
      })
    }

    const addItemOfrelatedeFormula = () => {
      state.relatedeFormulaData.push({
        associate: null,
        id: '',
        inspectParameterId: state.inspectParameterIdOfRelatedParameter,
        value: ''
      })
    }

    // [table] 选框选择
    const handleSelectionChange = (val: RelatedeFormulaData[]) => {
      state.selectedListOfRelatedeFormulaData = val
    }

    // [BTN:批次删除]
    const deleteItemOfrelatedeFormula = () => {
      if (state.selectedListOfRelatedeFormulaData.length === 0) {
        return
      }
      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const tempDeleteList: string[] = []
        state.selectedListOfRelatedeFormulaData.forEach((item, index) => {
          if (item.id !== '') {
            tempDeleteList.push(item.id)
          } else {
            state.selectedListOfRelatedeFormulaData.slice(index)
          }
        })
        const res = await INSPECT_INDEX_RELATED_PARAMETER_DELETE_API(tempDeleteList)
        if (res.data.code === 200) {
          proxy.$successToast('操作成功')
          await getRelatedParameter(state.inspectParameterIdOfRelatedParameter)
        }
      })
    }
    // 表格 header 合并
    const headerMerge = (result:any) => {
      if (result.rowIndex === 1) {
        return { display: 'none' }
      }
    }

    onMounted(async () => {
      // 过程参数下拉
      INSPECT_INDEX_PROCESS_PARAMETER_DROPDOWN_API().then((res) => {
        state.paramSubscriptOptions = res.data.data
        console.log('过程参数下拉')
        console.log(state.paramSubscriptOptions)
      })

      // 单位下拉
      DICTIONARY_QUERY_API({ dictType: 'INDEX_UNIT' }).then((res) => {
        state.paramUnitOptions = res.data.data
      })

      // 数据类型
      DICTIONARY_QUERY_API({ dictType: 'PROC_PARAM_DATA_TYPE' }).then((res) => {
        state.paramDataTypeOptions = res.data.data
      })

      // 数据标准单位
      DICTIONARY_QUERY_API({ dictType: 'PROC_PARAM_STANDARD' }).then((res) => {
        state.paramStandardTypeOptions = res.data.data
      })

      // 过程参数默认值类型
      DICTIONARY_QUERY_API({ dictType: 'PROC_DEFAULT_TYPE' }).then((res) => {
        state.defaultTypeOptions = res.data.data
      })

      // 过程参数类型
      DICTIONARY_QUERY_API({ dictType: 'PROC_PARAM_TYPE' }).then((res) => {
        state.paramTypeOptions = res.data.data
      })

      // btnGetMainData()
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
      headerMerge
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  height: calc(100vh - 117px);
}

.required::before{
  content: '*';
  color: #f00;
  margin-right: 5px;
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
