<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-30 11:24:46
 * @LastEditors: Telliex
 * @LastEditTime: 2021-08-06 16:27:30
-->
<template>
  <mds-card class="test_method" title="标准值明细" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
        <div style="float: right;display: flex; margin-bottom:10px;">
          <el-button v-if="!controlBtnCanDo" type="primary" icon="el-icon-edit" size="small" class="role__btn" @click="btnEditItemData">编辑</el-button>
          <el-button v-if="controlBtnCanDo" icon="el-icon-circle-plus-outline" type="primary" size="small" @click="btnAddItemData">新增</el-button>
          <el-button v-if="controlBtnCanDo" icon="el-icon-circle-check" type="primary" size="small" @click="btnSaveItemData">保存</el-button>
          <el-button v-if="controlBtnCanDo" icon="el-icon-circle-close" type="primary" size="small" @click="btnLeaveItemData">取消</el-button>
        </div>
    </template>
    <!-- :row-class-name="rowDelFlagOfTable" -->
    <el-table ref="multipleTable"  :cell-style="{'text-align':'center'}" :data="topicMainData"  tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="标定标准值" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          <!-- <el-tooltip effect="dark" :disabled="scope.row.indexStandard===''" :content="scope.row.indexStandard" placement="top-start"> -->
              <el-input v-model.trim="scope.row.indexStandard" size="small" type="number" placeholder="请输入" :disabled="!isRedact" />
          <!-- </el-tooltip> -->
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
            <!-- <el-tooltip effect="dark" :disabled="scope.row.indexUp===''" :content="scope.row.indexUp" placement="top-start"> -->
                <el-input v-model.trim="scope.row.indexUp" size="small" type="number" placeholder="请输入" :disabled="!isRedact||scope.row.upSymbol===''" />
            <!-- </el-tooltip> -->
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
            <!-- <el-tooltip effect="dark" :disabled="scope.row.indexDown===''" :content="scope.row.indexDown" placement="top-start"> -->
                <el-input v-model.trim="scope.row.indexDown" size="small" placeholder="请输入" :disabled="!isRedact||scope.row.downSymbol===''" />
            <!-- </el-tooltip> -->
          </template>
         </el-table-column>
      </el-table-column>
      <el-table-column label="内控标準值" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          <!-- <el-tooltip effect="dark" :disabled="scope.row.indexInnerStandard===''" :content="scope.row.indexInnerStandard" placement="top-start"> -->
              <el-input v-model.trim="scope.row.indexInnerStandard" type="number" size="small" placeholder="请输入" :disabled="!isRedact" />
          <!-- </el-tooltip> -->
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
            <!-- <el-tooltip effect="dark" :disabled="scope.row.indexInnerUp===''" :content="scope.row.indexInnerUp" placement="top-start"> -->
                <el-input v-model.trim="scope.row.indexInnerUp" size="small" type="number" placeholder="请输入" :disabled="!isRedact||scope.row.innerUpSymbol===''" />
            <!-- </el-tooltip> -->
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
                <el-input v-model.trim="scope.row.indexInnerDown" size="small" type="number" placeholder="请输入" :disabled="!isRedact||scope.row.innerDownSymbol===''" />
            <!-- </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="执行月份" width="160" prop="standardMonth" show-overflow-tooltip>
        <template #default="scope">
            <el-select v-model="scope.row.standardMonthList" size="small" :disabled="!isRedact" multiple clearable>
                <el-option :label="'1'" :value="'1'" />
                <el-option :label="'2'" :value="'2'" />
                <el-option :label="'3'" :value="'3'" />
                <el-option :label="'4'" :value="'4'" />
                <el-option :label="'5'" :value="'5'" />
                <el-option :label="'6'" :value="'6'" />
                <el-option :label="'7'" :value="'7'" />
                <el-option :label="'8'" :value="'8'" />
                <el-option :label="'9'" :value="'9'" />
                <el-option :label="'10'" :value="'10'" />
                <el-option :label="'11'" :value="'11'" />
                <el-option :label="'12'" :value="'12'" />
            </el-select>
          </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope" >
          <el-button type="text" icon="el-icon-remove-outline" class="role__btn" @click="btnDeleteItemData(scope.$index,scope.row)" :disabled="!isRedact">
           删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </mds-card>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, toRefs, ComponentInternalInstance, getCurrentInstance, watch } from 'vue'
import MdsCard from '@/components/package/mds-card/src/mds-card.vue'
import {
  INSPECT_INDEX_VERSION_VALUE_QUERY_API, // 基础数据-[指标版本管理][标准值明细]- 查询
  INSPECT_INDEX_VERSION_VALUE_DELETE_API, // 基础数据-[指标版本管理][标准值明细]- 删除
  INSPECT_INDEX_VERSION_VALUE_MODIFY_API

} from '@/api/api'

interface TopicMainData {
  id: string
  indexStandard: string // 标定-标准值
  upSymbol: string // 标定-上限符号
  indexUp: string // 标定-上限
  downSymbol: string // 标定-下限符号
  indexDown: string // 标定-下限
  indexInnerStandard: string // 内控-标准值
  innerUpSymbol: string // 内控-上限符号
  indexInnerUp: string // 内控-上限
  innerDownSymbol: string // 内控-下限符号
  indexInnerDown: string // 内控-下限
  standardMonth: string // 执行月份
  standardMonthList: string[] // 执行月份
  delFlag: number,
  inspectVersionId: string
  // isRedact: boolean
}

interface Props{
  target:string
}

interface State {
  isDialogShow: boolean
  controlBtnCanDo: boolean
  topicMainData: TopicMainData[]
  targetId: string
  isRedact: boolean
}

export default defineComponent({
  name: 'TestIndexValueDetailIndex',
  components: {
    MdsCard
  },
  emits: ['update:dialogVisible'],
  props: {
    target: {
      type: String,
      default: ''
    }
  },
  setup (props, context) {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const parent = { ...context }
    const { target } = toRefs(props as Props)
    const state = reactive<State>({
      isDialogShow: false,
      controlBtnCanDo: false,
      topicMainData: [],
      targetId: '',
      isRedact: false
    })

    // 函数

    // [ACTION:load] 获取标准值明细数据
    const btnGetMainData = async () => {
      const res = await INSPECT_INDEX_VERSION_VALUE_QUERY_API({
        inspectVersionId: state.targetId
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
    }

    // [BTN:删除] 删除 item
    const btnDeleteItemData = (index: number, val:TopicMainData) => {
      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (val.id === '') {
          // val.delFlag = 1
          state.topicMainData.splice(index, 1)
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
        indexStandard: '',
        upSymbol: '',
        indexUp: '',
        downSymbol: '',
        indexDown: '',
        indexInnerStandard: '',
        innerUpSymbol: '',
        indexInnerUp: '',
        innerDownSymbol: '',
        indexInnerDown: '',
        standardMonth: '',
        standardMonthList: [],
        delFlag: 0,
        inspectVersionId: state.targetId
        // isRedact: true
      })
    }

    // [BTN:保存]
    const btnSaveItemData = async () => {
      const tempAdd:TopicMainData[] = []
      const tempEdit:TopicMainData[] = []
      state.topicMainData.forEach(item => {
        item.standardMonth = item.standardMonthList.join(',')
        if (item.id === '') {
          tempAdd.push(item)
        } else {
          tempEdit.push(item)
        }
      })
      console.log('tempAdd')
      console.log(tempAdd)
      console.log('tempEdit')
      console.log(tempEdit)

      await INSPECT_INDEX_VERSION_VALUE_MODIFY_API(
        {
          insertList: tempAdd,
          updateList: tempEdit
        }
      )
      state.controlBtnCanDo = false
      state.isRedact = false
      btnGetMainData()
      parent.emit('update:dialogVisible', false)
    }

    // [BTN:取消]
    const btnLeaveItemData = () => {
      state.controlBtnCanDo = false
      state.isRedact = false
      btnGetMainData()
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

    watch(
      target,
      newValue => {
        if (newValue !== '') {
          state.targetId = newValue
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
      btnEditItemData
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  height: calc(100vh - 117px);
}
</style>
