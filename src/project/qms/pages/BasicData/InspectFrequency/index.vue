<template>
  <mds-card class="test_method" title="检测频率" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="display: flex; justify-content: flex-end;">
        <el-input size="small" style="margin-bottom:10px; width:200px; height:35px;margin-right:10px" clearable  v-model="plantList.textSearch" placeholder="检测频率名称" @keyup.enter="btnGetTopicMainData" />
        <div>
          <el-button icon="el-icon-search" class="topic-button" size="small" @click="btnGetTopicMainData">查询</el-button>
          <el-button icon="el-icon-plus" class="topic-button" type="primary" size="small" @click="btnAddItemOfTopicMainData">新增</el-button>
          <el-button icon="el-icon-delete" class="topic-button" type="danger" size="small"  @click="btnDeleteItemsOfTopicMainData">批量删除</el-button>
        </div>
      </div>
    </template>
    <el-table border ref="multipleTable" :cell-style="{'text-align':'center'}" :data="dataTopicMainData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" max-height="400">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" :index="(index) => index + 1 + (currentPage - 1) * pageSize" width="50" />
      <el-table-column label="检验频率" show-overflow-tooltip prop="frequencyName" min-width="200" />
      <el-table-column label="执行次数" show-overflow-tooltip prop="frequency" width="100" />
      <el-table-column label="执行周期" show-overflow-tooltip prop="dateUnit" width="100" />
      <el-table-column label="频率附加项" show-overflow-tooltip prop="additionalName" width="100" />
      <el-table-column label="操作人员" show-overflow-tooltip prop="changer" min-width="200" />
      <el-table-column label="操作时间" show-overflow-tooltip prop="changed" min-width="200" />
      <el-table-column label="操作" show-overflow-tooltip width="80" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="btnEditItemOfTopicMainData(scope.row)">
            <em>编辑</em>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end;">
      <el-pagination
        :page-size="pageSize"
        :current-page="currentPage"
        :total="totalItems"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </mds-card>

  <el-dialog v-model="isAddItemDialogShow" :title="dialogTitle" width="30%">
      <el-form ref="refAddAndEditItemDialog" :model="addAndEditItemForm" :rules="dataRule">
        <el-form-item label="检验频率：" prop="frequencyName" :label-width="cssForformLabelWidth">
          <div class="fake-input-disabled">
            <!-- <span>{{addAndEditItemForm.frequency}}/{{addAndEditItemForm.inspectIndexId}}</span> -->
            {{addAndEditItemForm.frequency}}<em v-if="addAndEditItemForm.frequency!==null"> 次 </em> <em v-if="addAndEditItemForm.dateUnit!==''"> / </em>{{addAndEditItemForm.dateUnit}} <em v-if="addAndEditItemForm.inspectAdditionalNames.length!==0">/</em> {{addAndEditItemForm.inspectAdditionalNames.join(',')}}
            </div>
        </el-form-item>
        <el-form-item label="执行次数：" prop="frequency" :label-width="cssForformLabelWidth">
          <el-input v-model.number="addAndEditItemForm.frequency" class="inputWidth" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="执行周期：" prop="inspectCycleId"  :label-width="cssForformLabelWidth">
          <el-select  v-model="addAndEditItemForm.inspectCycleId" placeholder="请选择" style="width:100%" clearable @change="changeInspectCycleId">
            <el-option v-for="(opt, optIndex) in dateUnitOptions" :key="optIndex" :label="opt.dateUnit" :value="opt.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="频率附加项：" prop="inspectAdditionalIds"  :label-width="cssForformLabelWidth">
          <el-select  v-model="addAndEditItemForm.inspectAdditionalIds" multiple placeholder="请选择" style="width:100%"  filterable clearable @change="changeInspectAdditionalIds">
            <el-option v-for="(opt, optIndex) in inspectAdditionalIdsOptions" :key="optIndex" :label="opt.additionalName" :value="opt.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button size="small" class="topic-button" icon="el-icon-circle-close" @click="isAddItemDialogShow = false">取 消</el-button>
        <el-button size="small" class="topic-button" icon="el-icon-circle-check" type="primary" @click="btnAddItemToConfirm">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent, ref, toRefs, reactive, onMounted, ComponentInternalInstance, getCurrentInstance, nextTick
} from 'vue'
import MdsCard from '@/components/package/mds-card/src/mds-card.vue'
import {
  INSPECT_INSPECT_FREQUENCY_QUERY_API, // 查询
  INSPECT_INSPECT_FREQUENCY_INSERT_API, // 新增
  INSPECT_INSPECT_FREQUENCY_DELETE_API, // 删除
  INSPECT_INSPECT_FREQUENCY_UPDATE_API, // 编辑
  INSPECT_INSPECT_ADDITION_QUERY_DROPDOWN_API, // 查询
  INSPECT_CYCLE_QUERY_DROPDOWN_API
} from '@/api/api'

interface TopicMainData {
  additionalName: string
  changed: string
  changer: string
  dateUnit: string
  frequency: number
  frequencyName: string
  id: string
  inspectAdditionalId: string
  inspectCycleId: string
}

interface PlantList{
  textSearch: string
}
interface AddItemForma{
  frequency: number | null;
  frequencyName: string
  id: string
  inspectAdditionalIds: string[]
  inspectCycleId: string
  dateUnit: string
  inspectAdditionalNames: string[]
}
interface DateUnitOptions {
    calculateStart: string
    calculateStarts: string[]
    calculateUnit: string
    cycleCode: string
    dateDelay: number
    dateUnit: string
    id: string
}

interface InspectAdditionalIdsOptions {
  additionalCode: string
  additionalName: string
  additionalProperty: string
  additionalTable: string
  changed: string
  changer: string
  factory: string
  id: string
}
// interface Props {}

interface State {
  dialogTitle: string
  isAddItemDialogShow: boolean
  currentPage: number
  pageSize: number
  totalItems: number
  dataTopicMainData: TopicMainData[]
  plantList: PlantList
  cssForformLabelWidth: string
  addAndEditItemForm: AddItemForma
  multipleSelection: string[]
  inspectAdditionalIdsOptions: InspectAdditionalIdsOptions[]
  dateUnitOptions: DateUnitOptions[]
}

export default defineComponent({
  name: 'InspectFrequencyIndex',
  components: {
    MdsCard
  },

  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any

    /**  == 变量 ==  **/
    // const { } = toRefs(props as Props)
    const state = reactive<State>({
      dialogTitle: '',
      isAddItemDialogShow: false,
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      dataTopicMainData: [],
      plantList: {
        textSearch: ''
      },
      cssForformLabelWidth: '140px',
      addAndEditItemForm: {
        id: '',
        inspectAdditionalIds: [],
        inspectAdditionalNames: [],
        inspectCycleId: '',
        frequency: null,
        frequencyName: '',
        dateUnit: ''
      },
      multipleSelection: [],
      inspectAdditionalIdsOptions: [],
      dateUnitOptions: []
    })
    const refAddAndEditItemDialog = ref()
    const dataRule = {
      frequency: [
        {
          required: true,
          message: '请输入执行次数',
          trigger: 'blur'
        }
      ]
    }
    const props = { multiple: true }

    /**  == 函数 ==  **/
    // 过程参数列表数据
    const btnGetTopicMainData = async () => {
      const res = await INSPECT_INSPECT_FREQUENCY_QUERY_API({
        current: state.currentPage,
        frequencyCodeOrName: state.plantList.textSearch,
        size: state.pageSize
      })
      state.dataTopicMainData = res.data.data.records
      state.totalItems = res.data.data.total
    }
    // [BTN:编辑] 编辑 item
    const btnEditItemOfTopicMainData = async (row: TopicMainData) => {
      state.dialogTitle = '检测频率-编辑'
      state.isAddItemDialogShow = true
      getOptions() // 更细 API
      await nextTick()
      refAddAndEditItemDialog.value.resetFields()
      const temp:string[] = []
      if (row.inspectAdditionalId !== '') {
        row.inspectAdditionalId.split(',').forEach(item => {
          temp.push(state.inspectAdditionalIdsOptions.filter(subItem => subItem.id === item)[0].additionalName)
        })
      }

      state.addAndEditItemForm = {
        frequency: row.frequency,
        frequencyName: row.frequencyName,
        id: row.id,
        inspectAdditionalIds: row.inspectAdditionalId === '' ? [] : row.inspectAdditionalId.split(','),
        inspectAdditionalNames: temp,
        inspectCycleId: row.inspectCycleId,
        dateUnit: row.dateUnit
      }
    }
    // [Table] 复选选择
    const handleSelectionChange = (val: TopicMainData[]) => {
      state.multipleSelection = val.map((item: TopicMainData) => item.id)
    }
    // [BTN:批量删除]
    const btnDeleteItemsOfTopicMainData = () => {
      if (!state.multipleSelection.length) {
        proxy.$warningToast('请选择数据')
        return
      }
      proxy.$confirm('是否删除此检测频率，请确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await INSPECT_INSPECT_FREQUENCY_DELETE_API(state.multipleSelection)
        proxy.$successToast('操作成功')
        await btnGetTopicMainData()
      })
    }
    // [BTN:新增] 新增
    const btnAddItemOfTopicMainData = async () => {
      state.dialogTitle = '检测频率-新增'
      state.isAddItemDialogShow = true
      getOptions() // 更细 API
      await nextTick()
      refAddAndEditItemDialog.value.resetFields()

      // let code = state.dataTopicMainData.reduce((previousValue: number, currentValue: TopicMainData) => {
      //   const currentCode = Number(currentValue.inspectMethodCode.replace(/M/g, ''))
      //   return previousValue < currentCode ? currentCode : previousValue
      // }, 0)
      // code++
      state.addAndEditItemForm = {
        // id: '',
        // inspectMethodCode: `M${code < 10 ? '0' + code : code}`,
        // inspectMethodName: '',
        // inspectPropertyName: '',
        // inspectProperty: ''

        id: '',
        inspectAdditionalIds: [],
        inspectAdditionalNames: [],
        inspectCycleId: '',
        frequency: null,
        frequencyName: '',
        dateUnit: ''
      }
    }
    // [弹窗][BTN:确定]
    const btnAddItemToConfirm = () => {
      if (state.addAndEditItemForm.inspectAdditionalIds.length === 0 && state.addAndEditItemForm.inspectCycleId === '') {
        proxy.$warningToast('请选择执行周期或输入频次附加项')
        return
      }

      refAddAndEditItemDialog.value.validate(async (valid: boolean) => {
        if (valid) {
          let tempStr = `${state.addAndEditItemForm.frequency} 次 `

          tempStr += state.addAndEditItemForm.dateUnit !== '' ? '/ ' + state.addAndEditItemForm.dateUnit : ''
          tempStr += state.addAndEditItemForm.inspectAdditionalNames.length !== 0 ? '/ ' + state.addAndEditItemForm.inspectAdditionalNames.join(',') : ''
          // state.addAndEditItemForm.frequencyName = `${state.addAndEditItemForm.frequency} 次 / ${state.addAndEditItemForm.dateUnit} / ${state.addAndEditItemForm.inspectAdditionalNames.join(',')}`

          state.addAndEditItemForm.frequencyName = tempStr
          if (state.addAndEditItemForm.id) {
            await INSPECT_INSPECT_FREQUENCY_UPDATE_API(state.addAndEditItemForm)
          } else {
            await INSPECT_INSPECT_FREQUENCY_INSERT_API(state.addAndEditItemForm)
          }
          proxy.$successToast('操作成功')
          state.isAddItemDialogShow = false
          await btnGetTopicMainData()
        }
      })
    }

    const changeInspectCycleId = (val:string) => {
      state.addAndEditItemForm.dateUnit = val !== '' ? state.dateUnitOptions.filter(item => item.id === val)[0].dateUnit : ''
    }
    const changeInspectAdditionalIds = (val:string[]) => {
      const temp:string[] = []
      val.forEach(item => {
        temp.push(state.inspectAdditionalIdsOptions.filter(subItem => subItem.id === item)[0].additionalName)
      })
      state.addAndEditItemForm.inspectAdditionalNames = temp
    }

    const handleSizeChange = (pageSize: number) => { // 每页条数切换
      state.currentPage = 1
      state.pageSize = pageSize
      btnGetTopicMainData()
    }
    const handleCurrentChange = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      btnGetTopicMainData()
    }

    /**  == 生命周期 ==  **/
    onMounted(async () => {
      await getOptions()
      await btnGetTopicMainData()
    })

    const getOptions = () => {
      // 执行周期下拉
      INSPECT_CYCLE_QUERY_DROPDOWN_API().then((res) => {
        state.dateUnitOptions = res.data.data
      })
      // 频次附加项下拉
      INSPECT_INSPECT_ADDITION_QUERY_DROPDOWN_API().then((res) => {
        state.inspectAdditionalIdsOptions = res.data.data
      })
    }

    return {
      ...toRefs(state),
      refAddAndEditItemDialog,
      btnEditItemOfTopicMainData,
      btnAddItemOfTopicMainData,
      btnAddItemToConfirm,
      btnDeleteItemsOfTopicMainData,
      btnGetTopicMainData,
      handleSelectionChange,
      changeInspectCycleId,
      changeInspectAdditionalIds,
      dataRule,
      props,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  min-height: 550px;
  height: calc(100vh - 117px);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.el-form::v-deep(.inputWidth) {
  width: 100%;
}

</style>
