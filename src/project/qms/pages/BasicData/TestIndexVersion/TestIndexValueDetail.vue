<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-30 11:24:46
 * @LastEditors: Telliex
 * @LastEditTime: 2021-09-01 15:49:11
-->
<template>
  <div style="padding-top:10px">
        <div style="display: flex; margin-bottom:10px;justify-content: space-between;">
          <h3> <em class="title-icon" />标准值明细 </h3>
          <div>
            <el-button v-if="!controlBtnCanDo" type="primary" icon="el-icon-edit" size="small" class="role__btn" @click="btnEditItemData" :disabled="targetObj.id===''||(new Date(targetObj.beginDate).getTime() - new Date(formatDate()).getTime()) <= 0">编辑</el-button>
            <el-button v-if="controlBtnCanDo" icon="el-icon-plus" type="primary" size="small" @click="btnAddItemData">新增</el-button>
            <el-button v-if="controlBtnCanDo" icon="el-icon-circle-check" type="primary" size="small" @click="btnSaveItemData">保存</el-button>
            <el-button v-if="controlBtnCanDo" icon="el-icon-circle-close" type="primary" size="small" @click="btnLeaveItemData">取消</el-button>
          </div>
        </div>
    <el-table border ref="multipleTable"  :cell-style="{'text-align':'center'}" :data="topicMainData"  tooltip-effect="dark" style="width: 100%" :header-cell-style="headerMerge" max-height="300">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="标定标准值" min-width="200" show-overflow-tooltip>
        <template #default="scope">
            <el-input v-model="scope.row.indexStandard" size="small" placeholder="请输入" :disabled="!isRedact" />
        </template>
      </el-table-column>
      <el-table-column label="标定上限">
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
              <el-input v-model.number="scope.row.indexUp" size="small" placeholder="请输入" :disabled="!isRedact||scope.row.upSymbol===''" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="标定下限">
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
            <el-input v-model.number="scope.row.indexDown" size="small" placeholder="请输入" :disabled="!isRedact||scope.row.downSymbol===''" />
          </template>
         </el-table-column>
      </el-table-column>
      <el-table-column label="内控标準值" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          <el-input v-model="scope.row.indexInnerStandard" size="small" placeholder="请输入" :disabled="!isRedact" />
        </template>
      </el-table-column>
      <el-table-column label="内控上限">
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
            <el-input v-model.number="scope.row.indexInnerUp" size="small" placeholder="请输入" :disabled="!isRedact||scope.row.innerUpSymbol===''" />
          </template>
         </el-table-column>
      </el-table-column>
      <el-table-column label="内控下限">
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
                <el-input v-model.number="scope.row.indexInnerDown" size="small" placeholder="请输入" :disabled="!isRedact||scope.row.innerDownSymbol===''" />
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
      isRedact: false
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
        type: 'warning'
      }).then(async () => {
        if (val.id === '') {
          // val.delFlag = 1
          state.topicMainData.splice(mainIndex, 1)
          proxy.$successToast('操作成功')
        } else {
          const res = await INSPECT_INDEX_VERSION_VALUE_DELETE_API({ id: val.id })
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
    }

    // [BTN:保存]
    const btnSaveItemData = async () => {
      const tempAdd:TopicMainData[] = []
      const tempEdit:TopicMainData[] = []
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
      })

      if (ruleSubmit()) {
        if (!(tempAdd.length === 0 && tempEdit.length === 0)) {
          await INSPECT_INDEX_VERSION_VALUE_MODIFY_API(
            {
              insertList: tempAdd,
              updateList: tempEdit
            }
          )
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
          console.log('newValue')
          console.log(newValue)
          // new Date(row.beginDate).getTime() - new Date(formatDate()).getTime() >= 0
          state.targetObj = newValue
          btnGetMainData()
        }
      },
      { immediate: true }
    )

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
      formatDate
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
