<template>
  <mds-card class="task" title="待办任务" :pack-up="false">
    <template #titleBtn>
      <div style="float: right; color: #333333;font-size: 14px;font-weight: bold;cursor: pointer" @click="goHistory"><i class="qmsIconfont qms-lishirenwu1" style="color: #487BFF"/> 历史任务</div>
    </template>
    <el-row :gutter="16">
      <el-col :span="6" v-for="(item, index) in taskList" :key="index">
        <div class="task__item" :class="{active: task === index + 1}"  @click="changeTask(index + 1)">
          <p class="task__item--title">
            <i class="qmsIconfont" :class="{'qms-lailiaofujian': index === 0, 'qms-zhichengjianyan1': index === 1, 'qms-shengchanfuzhujiancha': index === 2, 'qms-linjian': index === 3 }" style="font-size: 20px;color: #487BFF"/>
            {{ item.inspectClassify }}
          </p>
          <div class="task__item__flex">
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">{{ item.unSampled }}</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>待完成</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">{{ item.sampling }}</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>进行中</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">{{ item.completed }}</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>已完成</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </mds-card>
  <mds-card class="task-list" title="任务列表" :pack-up="false">
    <template #titleBtn>
      <el-form :inline="true" size="small" style="float: right;display: flex">
        <el-form-item label="取样码：">
          <el-input v-model="queryForm.sampleCode" style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item label="检验内容：">
          <el-input v-model="queryForm.inspectContent" style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-input v-model="queryForm.taskStatus" style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="() => {queryForm.current = 1; query()}">查询</el-button>
          <el-button v-if="task !== 4" icon="el-icon-plus" @click="addOrUpdate()">新建</el-button>
          <el-button type="primary"><i class="qmsIconfont qms-jianyan3" /> 取样</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="selectionChange">
      <el-table-column type="selection" width="45" :selectable="checkDate" />
      <el-table-column type="index" fixed="left" :index="(index) => index + 1 + (queryForm.current - 1) * queryForm.size" label="序号" width="50" />
      <el-table-column label="样品码" prop="sampleCode" :show-overflow-tooltip="true" />
      <el-table-column label="状态" prop="taskStatus" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="检验内容" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 2" label="订单" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 1 || task === 2" label="物料信息" min-width="165" :show-overflow-tooltip="true">
        <template #default="scope">{{ `${scope.row.inspectMaterialCode} ${scope.row.inspectMaterialName}` }}</template>
      </el-table-column>
      <el-table-column v-if="task === 2" label="品项" prop="itemName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 2" label="取样信息" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 2 || task === 3" label="取样说明" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 1" label="物料批次" prop="batch" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 1" label="供应商" prop="supplier" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 1 || task === 3" label="任务触发时间" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 3" label="取样截至时间" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 4" label="发布人" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 4" label="发布时间" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="scope">
          <el-button v-if="task === 1" type="text" icon="qmsIconfont qms-binglike" class="role__btn" @click="inspectClick(scope.row)">
            检验
          </el-button>
          <el-button v-if="task !== 1 && task !== 4" type="text" icon="iconfont factory-luru" class="role__btn" @click="addOrUpdate(scope.row)">
            编辑
          </el-button>
          <el-button type="text" icon="qmsIconfont qms-jianyan3" class="role__btn" >
            取样
          </el-button>
          <el-button v-if="task !== 4" style="color: #EF4632" type="text" icon="el-icon-delete" class="role__btn">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="float: right">
      <el-pagination
        :page-size="queryForm.size"
        :current-page="queryForm.current"
        :total="queryForm.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="val => {queryForm.size = val;query()}"
        @current-change="val => {queryForm.current = val; query()}"
      />
    </el-row>
  </mds-card>
  <el-dialog v-model="addOrUpdateDialog" title="任务" width="30%">
    <el-form size="small" :model="addOrUpdateForm" label-width="85px">
      <el-form-item label="检验类：">
        <el-select v-model="addOrUpdateForm.inspectTypeId" filterable placeholder="请选择" @change="id => inspectChange(id)" style="width: 100%">
          <el-option v-for="item in inspect" :key="item.id" :label="item.inspectTypeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="物料信息：" v-if="task === 1 || task === 2">
        <el-select v-model="addOrUpdateForm.inspectMaterialCode" filterable placeholder="请选择" @change="val => materialChange(val)" style="width: 100%">
          <el-option v-for="item in material" :key="item.id" :label="item.inspectGroupName" :value="item.inspectGroupCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="批次：" v-if="task === 1">
        <!--<el-input v-model="addOrUpdateForm.inspectBatch"></el-input>-->
        <el-select v-model="addOrUpdateForm.inspectBatch" filterable placeholder="请选择" style="width: 100%">
          <el-option v-for="item in batch" :key="item.id" :label="item.batch" :value="item.batch" />
        </el-select>
      </el-form-item>
      <el-form-item label="生产订单：" v-if="task === 2">
        <el-select v-model="addOrUpdateForm.order" filterable placeholder="请选择" style="width: 100%">
          <el-option v-for="item in order" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="品项：" v-if="task === 1 || task === 2">
        <el-input v-model="addOrUpdateForm.itemName" disabled></el-input>
      </el-form-item>
      <el-form-item label="供应商：" v-if="task === 1">
        <el-input v-model="addOrUpdateForm.supplier" disabled></el-input>
      </el-form-item>
      <el-form-item label="取样信息：" v-if="task === 2 || task === 3">
        <el-select v-model="addOrUpdateForm.samplingMessage" filterable placeholder="请选择" style="width: 100%">
          <el-option v-for="item in samplingMessage" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
      <el-button size="small" icon="el-icon-circle-close" @click="addOrUpdateDialog = false">取消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="updateFormSubmit">确定</el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="sampleInspectDialog" title="取样检查" width="30%">
    <el-form size="small" :model="addOrUpdateForm" label-width="85px">
      <el-form-item label="车辆检查:">
        <el-radio-group v-model="addOrUpdateForm.vehicleStatus">
          <el-radio label="无异常">无异常</el-radio>
          <el-radio label="有异常">有异常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="抽样量：">
        <el-input v-model="addOrUpdateForm.sampleAmount" ></el-input>
      </el-form-item>
      <el-form-item label="包装规格:">
        <el-radio-group v-model="addOrUpdateForm.packing">
          <el-radio label="散装">散装</el-radio>
          <el-radio label="袋装">袋装</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="处理方式:">
        <el-radio-group v-model="addOrUpdateForm.handleMod">
          <el-radio label="合格允收">合格允收</el-radio>
          <el-radio label="让步接收">让步接收</el-radio>
          <el-radio label="特收处理">特收处理</el-radio>
          <el-radio label="退货处理">退货处理</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
      <el-button size="small" icon="el-icon-circle-close" @click="sampleInspectDialog = false">取消</el-button>
      <el-button size="small" icon="qmsIconfont qms-attendanceequipment" type="primary" @click="updateFormSubmit">保存</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="updateFormSubmit">确定</el-button>
    </div>
  </el-dialog>
  <printModuleThree :multipleSelection="selectionData" />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue'
import layoutTs from '@/components/layout/layoutTs'
import {
  GET_SAMPLE_SAMPLING_TASK_LIST,
  SAMPLE_SAMPLING_TASK_ADD,
  SAMPLE_SAMPLING_TASK_LIST
} from '@/api/api'
import printModuleThree from '@/project/qms/pages/common/printModuleTwo.vue'

interface MaterialObj{
  id: string
  inspectGroupCode: string
  inspectGroupName: string
}
interface TableData{
  id?: string
  sampleCode?: string
  inspectClassify?: string
  taskStatus?: string
  inspectTypeId?: string
  inspectBatch?: string
  inspectMaterialCode?: string
  inspectMaterialName?: string
  itemId?: string
  itemName?: string
  supplierCode?: string
  supplier?: string
  order?: string
  samplingMessage?: string
  vehicleStatus?: string
  sampleAmount?: string
  packing?: string
  handleMod?: string
}
export default defineComponent({
  name: 'SampleSampling',
  components: {
    printModuleThree
  },
  setup () {
    const { gotoPage } = layoutTs()
    const task = ref(1) // 选择任务
    const taskList = ref([]) // 任务汇总
    const addOrUpdateDialog = ref(false)
    const sampleInspectDialog = ref(false)
    const queryForm = reactive({
      inspectClassify: '',
      inspectContent: '',
      taskStatus: '',
      sampleCode: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据
    const tableData = ref<TableData[]>([]) // 表格数据
    const addOrUpdateForm = ref<TableData>({})
    const sampleInspectForm = ref({
      taskSampleId: '',
      vehicleStatus: '',
      sampleAmount: '',
      packing: '',
      handleMod: ''
    })

    const inspect = ref<any[]>([])
    const material = ref<MaterialObj[]>([])
    const batch = ref([])
    const order = ref([])
    const samplingMessage = ref([])

    const selectionData = ref<TableData[]>([])

    // 获取任务数
    const getTask = async () => {
      const { data } = await GET_SAMPLE_SAMPLING_TASK_LIST()
      console.log(data)
      taskList.value = data.list
    }
    // 查询
    const query = async () => {
      switch (task.value) {
        case 1: queryForm.inspectClassify = '来料检验'; break
        case 2: queryForm.inspectClassify = '制程检验'; break
        case 3: queryForm.inspectClassify = '生产辅助检验'; break
        case 4: queryForm.inspectClassify = '临时检验'; break
      }
      const res = await SAMPLE_SAMPLING_TASK_LIST(queryForm)
      console.log(res.data.data)
      tableData.value = res.data.data.records
      queryForm.size = res.data.data.size
      queryForm.current = res.data.data.current
      queryForm.total = res.data.data.total
    }
    // 切换任务分类
    const changeTask = (val: number) => {
      task.value = val
      queryForm.current = 1
      query()
    }
    // 跳转历史任务
    const goHistory = () => {
      gotoPage({
        path: 'qms-pages-SampleManagement-SampleSampling-historyTask'
      })
    }
    // 新建修改
    const addOrUpdate = (row?: TableData) => {
      console.log(row)
      if (row) {
        addOrUpdateForm.value = { ...row }
      } else {
        addOrUpdateForm.value = {
          id: '',
          inspectTypeId: '',
          inspectMaterialCode: '',
          inspectMaterialName: '',
          inspectBatch: '',
          itemId: '',
          itemName: '',
          supplier: '',
          supplierCode: '',
          order: '',
          samplingMessage: '',
          vehicleStatus: '',
          sampleAmount: '',
          packing: '',
          handleMod: ''
        }
        switch (task.value) {
          case 1: addOrUpdateForm.value.inspectClassify = '来料检验'; break
          case 2: addOrUpdateForm.value.inspectClassify = '制程检验'; break
          case 3: addOrUpdateForm.value.inspectClassify = '生产辅助检验'; break
          case 4: addOrUpdateForm.value.inspectClassify = '临时检验'; break
        }
      }
      console.log(addOrUpdateForm.value)
      addOrUpdateDialog.value = true
    }
    // 检验
    const inspectClick = (row: TableData) => {
      addOrUpdateForm.value = { ...row }
      sampleInspectDialog.value = true
    }
    // 新建修改确认
    const updateFormSubmit = async () => {
      addOrUpdateDialog.value = false
      sampleInspectDialog.value = false
      await SAMPLE_SAMPLING_TASK_ADD(addOrUpdateForm.value)
      query()
      getTask()
    }

    // 获取检验类、取样信息、生产订单下拉
    const getSelect = () => {
      inspect.value = [{
        id: '11',
        inspectTypeName: '检验类名'
      }]
      order.value = []
      samplingMessage.value = []
    }
    // 检验类下拉改变获取对应物料信息
    const inspectChange = (id: string) => {
      console.log(id)
      material.value = [{
        id: '22',
        inspectGroupName: '物料名',
        inspectGroupCode: '物料编码'
      }]
    }
    // 物料信息改变获取批次、品项、供应商
    const materialChange = (code: string) => {
      console.log(code)
      addOrUpdateForm.value.inspectMaterialName = (material.value.find(item => item.inspectGroupCode === code) as MaterialObj).inspectGroupName
      batch.value = []
      addOrUpdateForm.value.itemId = '33'
      addOrUpdateForm.value.itemName = '品项'
      addOrUpdateForm.value.supplier = '供应商'
      addOrUpdateForm.value.supplierCode = '供应商编码'
    }
    const checkDate = (row: TableData) => {
      if (!row.taskStatus) {
        return false
      }
      return true
    }
    const selectionChange = (val: TableData[]) => {
      selectionData.value = val
    }

    onMounted(() => {
      getSelect()
      query()
      getTask()
    })

    return {
      task,
      taskList,
      addOrUpdateDialog,
      sampleInspectDialog,
      queryForm,
      tableData,
      addOrUpdateForm,
      sampleInspectForm,
      inspect,
      material,
      batch,
      order,
      samplingMessage,
      selectionData,
      checkDate,
      selectionChange,
      changeTask,
      goHistory,
      query,
      inspectChange,
      materialChange,
      addOrUpdate,
      inspectClick,
      updateFormSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.task{
  border: none;
  box-shadow: none;
  padding: 0!important;
  &__item{
    cursor: pointer;
    height: 140px;
    background: white;
    padding: 14px 10px;
    box-shadow: 3px 3px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(171, 171, 171, 0.5);
    &--title{
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    &__flex{
      display: flex;
      align-items: center;
      margin-top: 23px;
      &__item{
        flex: 1;
        text-align: center;
        &--big{
          font-size: 32px;
          font-weight: bold;
        }
        &--small{
          font-size: 14px;
        }
        &--border{
          width: 2px;
          height: 30px;
          background: #999999;
        }
        i{
          color: #487BFF;
          margin-right: 4px;
        }
      }
    }
  }
  .active{
    border: 1px solid #487BFF
  }
}
.task-list{
  background: white;
  .el-form-item{
    margin-bottom: 11px;
  }
}
</style>
