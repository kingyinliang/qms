<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-30 11:24:46
 * @LastEditors: Telliex
 * @LastEditTime: 2021-09-08 16:26:21
-->
<template>
  <div style="padding-top:10px">
        <div style="display: flex; margin-bottom:10px;justify-content: space-between;">
          <h3> <em class="title-icon" />标准值明细 </h3>
          <div>
            <el-button v-if="!controlBtnCanDo" type="primary" icon="el-icon-edit" size="small" class="role__btn topic-button" @click="btnEditItemData" :disabled="targetObj.id===''||(new Date(targetObj.beginDate).getTime() - new Date(formatDate()).getTime()) <= 0">编辑</el-button>
            <el-button v-if="controlBtnCanDo" icon="el-icon-plus" type="primary" size="small" class="topic-button" @click="btnAddItemData" >新增</el-button>
            <el-button v-if="controlBtnCanDo" icon="el-icon-circle-check" type="primary" size="small" class="topic-button" @click="btnSaveItemData">保存</el-button>
            <el-button v-if="controlBtnCanDo" icon="el-icon-circle-close" type="primary" size="small" class="topic-button" @click="btnLeaveItemData">取消</el-button>
          </div>
        </div>
    <el-table border ref="multipleTable"  :cell-style="{'text-align':'center'}" :data="topicMainData"  tooltip-effect="dark" style="width: 100%" :header-cell-style="headerMerge" max-height="300">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="标定标准值" min-width="200" show-overflow-tooltip class="">
        <template #header>
          <span class="required">标定标准值</span>
        </template>
        <template #default="scope">
            <el-input v-model="scope.row.indexStandard" size="small" maxlength="10" placeholder="请输入" :disabled="!isRedact" />
        </template>
      </el-table-column>
      <el-table-column label="标定上限">
        <template #header>
          <span class="required">标定上限</span>
        </template>
        <el-table-column
          width="120"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-select v-model="scope.row.upSymbol" size="small" :disabled="!isRedact" clearable>
              <el-option :label="'<'" :value="'<'" />
              <el-option :label="'<='" :value="'<='" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          show-overflow-tooltip
        >
          <template #default="scope">
              <el-input v-model="scope.row.indexUp"  maxlength="5" size="small" placeholder="请输入" :disabled="!isRedact||scope.row.upSymbol===''" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" @change="val=>checkOnlyNumber(val,scope.row,'indexUp')" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="标定下限">
        <template #header>
          <span class="required">标定下限</span>
        </template>
        <el-table-column
          width="120"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-select v-model="scope.row.downSymbol" size="small" :disabled="!isRedact" clearable>
              <el-option :label="'>'" :value="'>'" />
              <el-option :label="'>='" :value="'>='" />
            </el-select>
          </template>
        </el-table-column>
         <el-table-column
          width="120"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-input v-model="scope.row.indexDown"  maxlength="5" size="small" placeholder="请输入" :disabled="!isRedact||scope.row.downSymbol===''" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" @change="val=>checkOnlyNumber(val,scope.row,'indexDown')" />
          </template>
         </el-table-column>
      </el-table-column>
      <el-table-column label="内控标准值" min-width="200" show-overflow-tooltip>
        <template #header>
          <span class="required">内控标准值</span>
        </template>
        <template #default="scope">
          <el-input v-model="scope.row.indexInnerStandard" maxlength="10" size="small" placeholder="请输入" :disabled="!isRedact" />
        </template>
      </el-table-column>
      <el-table-column label="内控上限">
        <template #header>
          <span class="required">内控上限</span>
        </template>
        <el-table-column
          width="120"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-select v-model="scope.row.innerUpSymbol" size="small" :disabled="!isRedact" clearable>
                <el-option :label="'<'" :value="'<'" />
                <el-option :label="'<='" :value="'<='" />
            </el-select>
          </template>
        </el-table-column>
         <el-table-column
          width="120"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-input v-model="scope.row.indexInnerUp"  maxlength="5" size="small" placeholder="请输入" :disabled="!isRedact||scope.row.innerUpSymbol===''" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" @change="val=>checkOnlyNumber(val,scope.row,'indexInnerUp')"  />
          </template>
         </el-table-column>
      </el-table-column>
      <el-table-column label="内控下限">
        <template #header>
          <span class="required">内控下限</span>
        </template>
        <el-table-column
          width="120"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-select v-model="scope.row.innerDownSymbol" size="small" :disabled="!isRedact" clearable>
                <el-option :label="'>'" :value="'>'" />
                <el-option :label="'>='" :value="'>='" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          show-overflow-tooltip
        >
          <template #default="scope">
            <!-- <el-tooltip effect="dark" :disabled="scope.row.indexInnerDown===''" :content="scope.row.indexInnerDown" placement="top-start"> -->
                <el-input v-model="scope.row.indexInnerDown"  maxlength="5" size="small" placeholder="请输入" :disabled="!isRedact||scope.row.innerDownSymbol===''" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" @change="val=>checkOnlyNumber(val,scope.row,'indexInnerDown')" />
            <!-- </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="执行月份" width="160" prop="standardMonth" show-overflow-tooltip>
        <template #default="scope">
            <el-select v-model="scope.row.standardMonthList" size="small" :disabled="!isRedact" multiple clearable>
                <el-option v-for="item in ['1','2','3','4','5','6','7','8','9','10','11','12']" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template #default="scope" >
          <el-button type="text" icon="el-icon-remove-outline" class="role__btn" @click="btnDeleteItemData(scope.$index,scope.row)" :disabled="!isRedact">
           <em>删除</em>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, toRefs, ComponentInternalInstance, getCurrentInstance, watch } from 'vue'
// import MdsCard from '@/components/package/mds-card/src/mds-card.vue'
import {
  INSPECT_INDEX_VERSION_VALUE_QUERY_API, // 基础数据-[指标版本管理][标准值明细]- 查询
  INSPECT_INDEX_VERSION_VALUE_DELETE_API, // 基础数据-[指标版本管理][标准值明细]- 删除
  INSPECT_INDEX_VERSION_VALUE_MODIFY_API

} from '@/api/api'
import _ from 'lodash'

interface TopicMainData {
  id: string
  indexStandard: number | string | null // 标定-标准值
  upSymbol: string // 标定-上限符号
  indexUp: number | null // 标定-上限 x
  indexDown: number | null // 标定-下限 x
  indexInnerStandard: number | string | null // 内控-标准值 x
  indexInnerUp: number | null // 内控-上限 x
  indexInnerDown: number | null // 内控-下限 x
  downSymbol: string // 标定-下限符号
  innerUpSymbol: string // 内控-上限符号
  innerDownSymbol: string // 内控-下限符号
  standardMonth: string // 执行月份
  standardMonthList: string[] // 执行月份
  delFlag: number,
  inspectVersionId: string
  // isRedact: boolean
}

interface targetObjData{
  beginDate: string
  changeInfo: string
  currentFlag: string
  factory: string
  id: string
  indexCode: string
  indexMethod: string
  indexName: string
  indexUnit: string
  indexVersion: string
  indexVersionMethod: string
  inspectIndexMaterialId: string
  inspectMaterialTypeName: string
}

interface Props{
  target: targetObjData
}

interface State {
  isDialogShow: boolean
  controlBtnCanDo: boolean
  topicMainData: TopicMainData[]
  orgTopicMainData: TopicMainData[]
  targetObj: targetObjData
  isRedact: boolean
  addDissabled: boolean
}

export default defineComponent({
  name: 'TestIndexValueDetailIndex',
  components: {

  },
  emits: ['update:dialogVisible'],
  props: {
    target: {
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
    const { target } = toRefs(props as Props)
    const state = reactive<State>({
      isDialogShow: true,
      controlBtnCanDo: false,
      topicMainData: [],
      orgTopicMainData: [],
      targetObj: {
        beginDate: '',
        changeInfo: '',
        currentFlag: '',
        factory: '',
        id: '',
        indexCode: '',
        indexMethod: '',
        indexName: '',
        indexUnit: '',
        indexVersion: '',
        indexVersionMethod: '',
        inspectIndexMaterialId: '',
        inspectMaterialTypeName: ''
      },
      isRedact: false,
      addDissabled: false
    })

    // 函数

    // [ACTION:load] 获取标准值明细数据
    const btnGetMainData = async () => {
      const res = await INSPECT_INDEX_VERSION_VALUE_QUERY_API({
        inspectVersionId: state.targetObj.id
      })
      console.log('获取标准值明细数据')
      console.log(res.data.data)
      res.data.data.forEach((item:TopicMainData) => {
        if (item.standardMonth !== '') {
          item.standardMonthList = item.standardMonth.split(',')
        } else {
          item.standardMonthList = []
        }

        if (item.standardMonthList.length === 0) {
          state.addDissabled = true
        }
        // item.isRedact = false
      })

      state.topicMainData = res.data.data

      state.orgTopicMainData = JSON.parse(JSON.stringify(res.data.data))
    }

    // [BTN:删除] 删除 item
    const btnDeleteItemData = (mainIndex: number, val:TopicMainData) => {
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
        type: 'warning',
        callback: (action:string) => {
          if (action === 'confirm') {
            if (val.id === '') {
              // val.delFlag = 1
              state.topicMainData.splice(mainIndex, 1)
              proxy.$successToast('操作成功')
            } else {
              INSPECT_INDEX_VERSION_VALUE_DELETE_API({ id: val.id })
              proxy.$successToast('操作成功')
              btnGetMainData()
            }
          }
        }
      })
    }

    // [BTN:新增]
    const btnAddItemData = async () => {
      let isAddItem = true
      state.topicMainData.forEach((item:TopicMainData) => {
        if (item.standardMonthList.length === 0) {
          isAddItem = false
        }
      })

      if (isAddItem === true) {
        state.topicMainData.push({
          id: '',
          indexStandard: null,
          upSymbol: '',
          indexUp: null,
          downSymbol: '',
          indexDown: null,
          indexInnerStandard: null,
          innerUpSymbol: '',
          indexInnerUp: null,
          innerDownSymbol: '',
          indexInnerDown: null,
          standardMonth: '',
          standardMonthList: [],
          delFlag: 0,
          inspectVersionId: state.targetObj.id
        // isRedact: true
        })
      } else {
        proxy.$errorToast('已有数据执行月份为空！')
      }
    }

    // [BTN:保存]
    const btnSaveItemData = async () => {
      const tempAdd:TopicMainData[] = []
      const tempEdit:TopicMainData[] = []
      let nowMonthStatus = 0
      state.topicMainData.forEach((item, index) => {
        if (item.id === '') {
          item.standardMonth = item.standardMonthList.join(',')
          tempAdd.push(item)
        } else {
          if (!_.isEqual(state.orgTopicMainData[index], item)) {
            item.standardMonth = item.standardMonthList.join(',')
            tempEdit.push(item)
          }
        }
        if (item.standardMonthList.length === 0) {
          nowMonthStatus += 1
        }
      })

      if (state.topicMainData.length >= 2 && nowMonthStatus >= 1) {
        proxy.$errorToast('已有数据执行月份为空！')
        return
      }

      if (ruleSubmit()) {
        if (!(tempAdd.length === 0 && tempEdit.length === 0)) {
          await INSPECT_INDEX_VERSION_VALUE_MODIFY_API(
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
    }

    // [BTN:取消]
    const btnLeaveItemData = () => {
      closeStandardValueInfoArea()
    }

    // 关闭标准值明细 card
    const closeStandardValueInfoArea = () => {
      state.controlBtnCanDo = false
      state.isRedact = false
      parent.emit('update:dialogVisible', true)
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
        if (item.indexStandard === null || item.upSymbol === '' || item.downSymbol === '' || item.indexInnerStandard === null || item.innerUpSymbol === '' || item.innerDownSymbol === '' || item.indexInnerDown === null || item.indexInnerUp === null || item.indexUp === null || item.indexDown === null) {
          proxy.$warningToast('请完整录入栏位')
          return false
        }
      }
      return true
    }

    // 表格 header 合并
    const headerMerge = (result:any) => {
      if (result.rowIndex === 1) {
        return { display: 'none' }
      }
    }

    const formatDate = () => {
      var d = new Date()
      var month = '' + (d.getMonth() + 1)
      var day = '' + d.getDate()
      var year = d.getFullYear()

      if (month.length < 2) { month = '0' + month }
      if (day.length < 2) { day = '0' + day }
      return [year, month, day].join('-')
    }

    watch(
      target,
      newValue => {
        if (newValue !== null) {
          state.targetObj = newValue
          btnGetMainData()
        }
      },
      { immediate: true }
    )

    const checkOnlyNumber = (val:string|number, node:any, target:string) => {
      console.log(val)
      let targetStr:string | number = '' + val
      // targetStr = targetStr
      //   .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      //   .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      //   .replace('.', '$#$')
      //   .replace(/\./g, '')
      //   .replace('$#$', '.')
      //   .replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      // console.log(targetStr)
      if (targetStr.indexOf('.') < 0 && targetStr !== '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        targetStr = parseFloat(targetStr)
      }
      node[target] = Number(targetStr)
    }

    onMounted(async () => {
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
      headerMerge,
      formatDate,
      checkOnlyNumber
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  height: calc(100vh - 117px);
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
    width: 4px;
    height: 12px;
    border-radius: 2px;
    background-color: #487bff;
  }
}
</style>
