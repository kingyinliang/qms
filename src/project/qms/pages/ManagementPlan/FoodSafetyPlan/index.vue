<template>
  <mds-card class="test_method" title="食安计划管理" :pack-up="false" style="margin-bottom: 0; background: #fff; over-flow:scroll">
    <template #titleBtn>
      <div style="display: flex; justify-content: flex-end;">
        <el-input size="small" style="margin-bottom:10px; width:200px; height:35px;margin-right:10px" clearable  v-model="plantList.textSearch" placeholder="版本号" @keyup.enter="btnGetTopicMainData" />
        <div>
          <el-button icon="el-icon-search" size="small" class="topic-button" @click="btnGetTopicMainData">查询</el-button>
          <el-button icon="el-icon-plus" type="primary" class="topic-button" size="small" @click="btnAddItemOfTopicMainData">新增</el-button>        </div>
      </div>
    </template>
    <el-table border ref="multipleTable" :cell-style="{'text-align':'center'}" :data="dataTopicMainData" tooltip-effect="dark" style="width: 100%" max-height="500">
      <el-table-column type="index" label="序号" :index="(index) => index + 1 + (currentPage - 1) * pageSize" width="50" />
      <el-table-column label="版本号" show-overflow-tooltip prop="planVersion" >
        <template #default="scope">
         <el-button type="text" class="role__btn" @click="btnConfigulationReadOnly(scope.row)">
            <em>{{scope.row.planVersion}}</em>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="执行开始日期" show-overflow-tooltip prop="beginDate" />
      <el-table-column label="操作人员" show-overflow-tooltip prop="changer" />
      <el-table-column label="操作时间" show-overflow-tooltip prop="changed" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="btnEditItemOfTopicMainData(scope.row)" :disabled="scope.row.isDisabled">
            <em>编辑</em>
          </el-button>
          <el-button type="text" icon="el-icon-setting" class="role__btn" @click="btnConfigulation(scope.row)" :disabled="scope.row.isDisabled">
            <em>配置</em>
          </el-button>
          <!-- <el-button type="text" icon="el-icon-remove-outline" class="role__btn" @click="btnDeleteItemData(scope.row)" :disabled="scope.row.isDisabled">
            <em>删除</em>
          </el-button> -->
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
        <el-form-item label="版本号："  prop="planVersion" :label-width="cssForformLabelWidth">
          <el-input v-model="addAndEditItemForm.planVersion" maxlength="10" class="inputWidth" placeholder="请输入" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="执行开始日：" prop="beginDate" :label-width="cssForformLabelWidth">
           <el-date-picker
            v-model="addAndEditItemForm.beginDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选选择日期"
            :disabled-date="pickerOptions"
            style="width:100%"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="复制上一版：" prop="paramCode"  :label-width="cssForformLabelWidth">
           <div>
              <el-radio v-model="addAndEditItemForm.copyVersion" label="1">是</el-radio>
              <el-radio v-model="addAndEditItemForm.copyVersion" label="0">否</el-radio>
            </div>
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
  MANAGEMENT_INSPECTION_PLAN_QUERY_API, // 查询
  MANAGEMENT_INSPECTION_PLAN_INSERT_API, // 新增
  MANAGEMENT_INSPECTION_PLAN_DELETE_API, // 删除
  MANAGEMENT_INSPECTION_PLAN_UPDATE_API // 编辑
} from '@/api/api'
import layoutTs from '@/components/layout/layoutTs'

interface TopicMainData {
  beginDate:string
  changed:string
  changer: string
  currentFlag: string
  id: string
  inspectScene: string
  planVersion: string
  isDisabled: boolean
  copyVersion: string
}

interface PlantList{
  textSearch: string
}

// interface Props {}

interface State {
  currentInspectScene: string
  dialogTitle: string
  isAddItemDialogShow: boolean
  currentPage: number
  pageSize: number
  totalItems: number
  dataTopicMainData: TopicMainData[]
  plantList: PlantList
  cssForformLabelWidth: string
  addAndEditItemForm: TopicMainData
  multipleSelection: string[]
}

export default defineComponent({
  name: 'ProcessInspectionPlanIndex',
  components: {
    MdsCard
  },

  setup () {
    const { gotoPage } = layoutTs()
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any

    /**  == 变量 ==  **/
    // const { } = toRefs(props as Props)
    const state = reactive<State>({
      currentInspectScene: 'SAFETY', // 食安计划
      dialogTitle: '',
      isAddItemDialogShow: false,
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      dataTopicMainData: [],
      plantList: {
        textSearch: ''
      },
      cssForformLabelWidth: '150px',
      addAndEditItemForm: {
        beginDate: '',
        changed: '',
        changer: '',
        currentFlag: 'N',
        id: '',
        inspectScene: 'PROCESS',
        planVersion: '',
        isDisabled: false,
        copyVersion: '0'
      },
      multipleSelection: []
    })
    const refAddAndEditItemDialog = ref()
    const dataRule = {
      planVersion: [
        {
          required: true,
          message: '请输入版本号',
          trigger: 'blur'
        }
      ],
      beginDate: [
        {
          required: true,
          message: '请输入执行开始日期',
          trigger: 'blur'
        }
      ]
    }
    const props = { multiple: true }

    /**  == 函数 ==  **/
    // 检验计划列表数据
    const btnGetTopicMainData = async () => {
      const res = await MANAGEMENT_INSPECTION_PLAN_QUERY_API({
        current: state.currentPage,
        planVersion: state.plantList.textSearch,
        inspectScene: state.currentInspectScene,
        size: state.pageSize
      })
      console.log('检验计划列表数据')
      console.log(res.data.data)
      state.dataTopicMainData = res.data.data.records
      state.dataTopicMainData.forEach((item:TopicMainData) => {
        item.copyVersion = '0'
        if ((new Date(item.beginDate).getTime() - new Date(formatDate()).getTime()) <= 0) {
          item.isDisabled = true
        } else {
          item.isDisabled = false
        }
      })
      state.totalItems = res.data.data.total
    }
    // [BTN:编辑] 编辑 item
    const btnEditItemOfTopicMainData = async (row: TopicMainData) => {
      state.dialogTitle = '过程参数-编辑'
      state.isAddItemDialogShow = true
      await nextTick()
      refAddAndEditItemDialog.value.resetFields()
      state.addAndEditItemForm = { ...row }
    }

    // [BTN:配置]
    const btnConfigulation = async (row:TopicMainData) => {
      console.log(row)
      gotoPage({
        path: 'qms-pages-ManagementPlan-FoodSafetyPlan-PlanConfiguration',
        query: {
          versionID: row.id
        }
      })
    }
    // [BTN:只读]
    const btnConfigulationReadOnly = async (row:TopicMainData) => {
      console.log(row)
      gotoPage({
        path: 'qms-pages-ManagementPlan-FoodSafetyPlan-PlanConfigurationOnlyRead',
        query: {
          versionID: row.id
        }
      })
    }

    // [BTN:删除] 删除 item
    const btnDeleteItemData = (val:TopicMainData) => {
      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await MANAGEMENT_INSPECTION_PLAN_DELETE_API({
          id: val.id
        })
        proxy.$successToast('操作成功')
        await btnGetTopicMainData()
      })
    }

    // [BTN:新增] 新增
    const btnAddItemOfTopicMainData = async () => {
      state.dialogTitle = '过程参数-新增'
      state.isAddItemDialogShow = true
      await nextTick()
      refAddAndEditItemDialog.value.resetFields()

      state.addAndEditItemForm = {
        beginDate: '',
        changed: '',
        changer: '',
        currentFlag: 'N',
        id: '',
        inspectScene: state.currentInspectScene,
        planVersion: '',
        isDisabled: false,
        copyVersion: '0'
      }
    }
    // [弹窗][BTN:确定]
    const btnAddItemToConfirm = () => {
      refAddAndEditItemDialog.value.validate(async (valid: boolean) => {
        if (valid) {
          if (state.addAndEditItemForm.id) {
            await MANAGEMENT_INSPECTION_PLAN_UPDATE_API(state.addAndEditItemForm)
          } else {
            await MANAGEMENT_INSPECTION_PLAN_INSERT_API(state.addAndEditItemForm)
          }
          proxy.$successToast('操作成功')
          state.isAddItemDialogShow = false
          await btnGetTopicMainData()
        }
      })
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

    // 时间选取限制
    const pickerOptions = (time:any) => {
      return time.getTime() < Date.now()
    }

    const formatDateTransfer = (date:any) => {
      var d = new Date(date)
      var month = '' + (d.getMonth() + 1)
      var day = '' + d.getDate()
      var year = d.getFullYear()

      if (month.length < 2) { month = '0' + month }
      if (day.length < 2) { day = '0' + day }
      return [year, month, day].join('-')
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

    /**  == 生命周期 ==  **/
    onMounted(async () => {
      btnGetTopicMainData()
    })

    return {
      ...toRefs(state),
      refAddAndEditItemDialog,
      btnEditItemOfTopicMainData,
      btnAddItemOfTopicMainData,
      btnAddItemToConfirm,
      btnGetTopicMainData,
      dataRule,
      props,
      handleSizeChange,
      handleCurrentChange,
      formatDateTransfer,
      btnDeleteItemData,
      formatDate,
      pickerOptions,
      btnConfigulation,
      btnConfigulationReadOnly
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  min-height: 550px;
  height: calc(100vh - 117px);
}
.topforms {
  display: flex;
  .el-date-editor.el-input {
    width: auto;
  }
  .formtextarea {
    .el-form-item__content {
      width: 500px;
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.el-form::v-deep(.inputWidth) {
  width: 100%;
}

</style>
