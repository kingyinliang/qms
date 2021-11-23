<template>
  <mds-card class="task" title="待办任务" :pack-up="false">
    <template #titleBtn>
      <div style="float: right; color: #333333;font-size: 14px;font-weight: bold;cursor: pointer" @click="goHistory"><i class="qmsIconfont qms-lishirenwu1" style="color: #487BFF"/> 历史任务</div>
    </template>
    <el-row :gutter="16">
      <el-col :span="6" v-for="(item, index) in taskList" :key="index">
        <div class="task__item" :class="{active: task === item.inspectClassify}"  @click="changeTask(item.inspectClassify)">
          <p class="task__item--title">
            <svg class="qmsIconfont" aria-hidden="true">
              <use xlink:href="#qms-lailiaofujian" v-if="item.inspectClassify === 'INCOMING'"></use>
              <use xlink:href="#qms-zhichengjianyan1" v-if="item.inspectClassify === 'PROCESS'"></use>
              <use xlink:href="#qms-shengchanfuzhujiancha" v-if="item.inspectClassify === 'ASSIST'"></use>
              <use xlink:href="#qms-linjian" v-if="item.inspectClassify === 'TEMP'"></use>
            </svg>
            <span>
              {{ item.inspectClassifyName }}
            </span>
          </p>
          <div class="task__item__flex">
            <div class="task__item__flex__item" @click.stop="changeTask(item.inspectClassify, 'execute')">
              <p class="task__item__flex__item--big">{{ item.execute }}</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>待完成</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item" @click.stop="changeTask(item.inspectClassify, 'progressing')">
              <p class="task__item__flex__item--big">{{ item.progressing }}</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-jinrushiyan"/>进行中</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item" @click.stop="changeTask(item.inspectClassify, 'completed')">
              <p class="task__item__flex__item--big">{{ item.completed }}</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-shenhetongguo"/>已完成</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </mds-card>
  <mds-card class="task-list" title="任务列表" :pack-up="false">
    <template #titleBtn>
      <el-form :inline="true" size="small" style="float: right;display: flex" @keyup.enter="() => {queryForm.current = 1; query()}" @submit.prevent>
        <el-form-item label="取样码：">
          <el-input v-model="queryForm.sampleCode" placeholder="请输入" clearable style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item label="检验内容：">
          <el-input v-model="queryForm.inspectContent" placeholder="请输入" clearable style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="queryForm.taskStatus" placeholder="请选择" clearable style="width: 120px">
            <el-option v-for="item in taskStatus" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="() => {queryForm.current = 1; query(); getTask()}">查询</el-button>
          <el-button v-if="task !== 'TEMP'" icon="el-icon-plus" @click="addOrUpdate()">新建</el-button>
          <el-button type="primary" @click="sampling()"><i class="qmsIconfont qms-jianyan3" /> 取样</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="selectionChange">
      <el-table-column type="selection" width="45" :selectable="checkDate" />
      <el-table-column type="index" fixed="left" :index="(index) => index + 1 + (queryForm.current - 1) * queryForm.size" label="序号" width="50" />
      <el-table-column label="样品码" prop="sampleCode" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="状态" prop="taskStatusName" min-width="120" :show-overflow-tooltip="true">
        <template #default="scope">
          <span class="status"
             :class="{
                yellow: scope.row.taskStatusName === '待取样',
                green: scope.row.taskStatusName === '已收样',
                blue: scope.row.taskStatusName === '取样中' || scope.row.taskStatusName === '已送达',
             }"
          >{{ scope.row.taskStatusName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检验内容" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'PROCESS'" label="订单" prop="orderNo" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'INCOMING' || task === 'PROCESS'" label="物料信息" min-width="165" :show-overflow-tooltip="true">
        <template #default="scope">{{ `${scope.row.inspectMaterialName} ${scope.row.inspectMaterialCode}` }}</template>
      </el-table-column>
      <el-table-column v-if="task === 'PROCESS'" label="品项" prop="itemName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'PROCESS'" label="取样信息" prop="inspectSiteName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'ASSIST'" label="取样说明" prop="sampleExplain" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'INCOMING'" label="物料批次" prop="inspectBatch" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'INCOMING'" label="供应商" prop="supplier" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'INCOMING' || task === 'ASSIST'" label="任务触发时间" prop="triggerDate" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'ASSIST'" label="取样截至时间" prop="sampleDeadlineDate" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'TEMP'" label="发布人" prop="triggerBy" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'TEMP'" label="发布时间" prop="triggerDate" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="scope">
          <el-button v-if="task === 'INCOMING' && (scope.row.taskStatus === 'UNSAMPLED' || scope.row.taskStatus === 'SAMPLING')" type="text" icon="qmsIconfont qms-binglike" class="role__btn" @click="inspectClick(scope.row)">
            检验
          </el-button>
          <el-button v-if="task !== 'INCOMING' && task !== 'TEMP' && scope.row.taskStatus === 'UNSAMPLED'" type="text" icon="iconfont factory-luru" class="role__btn" @click="addOrUpdate(scope.row)">
            编辑
          </el-button>
          <el-button v-if="scope.row.taskStatus === 'UNSAMPLED' || scope.row.taskStatus === 'SAMPLING'" type="text" icon="qmsIconfont qms-jianyan3" class="role__btn" @click="sampling(scope.row)">
            取样
          </el-button>
          <el-button v-if="task !== 'TEMP' && scope.row.taskStatus === 'UNSAMPLED'" style="color: #EF4632" type="text" icon="el-icon-delete" class="role__btn" @click="delRow(scope.row)">
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
    <el-form ref="addOrUpdateRef" size="small" :model="addOrUpdateForm" :rules="addOrUpdateFormRule" label-width="95px">
      <el-form-item label="任务类型:" v-if="task === 'PROCESS'" prop="temporaryFlag">
        <el-radio-group v-model="addOrUpdateForm.temporaryFlag" :disabled="addOrUpdateForm.triggerBy === 'SYSTEM'">
          <el-radio label="N">计划</el-radio>
          <el-radio label="Y">临时</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="检验类：" prop="inspectTypeId">
        <el-select v-model="addOrUpdateForm.inspectTypeId" :disabled="addOrUpdateForm.id !== ''" filterable placeholder="请选择" @change="id => inspectChange(id)" style="width: 100%">
          <el-option v-for="item in inspect" :key="item.id" :label="item.inspectTypeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="取样部门：" v-if="task === 'PROCESS'" prop="sampleDeptId">
        <el-select v-model="addOrUpdateForm.sampleDeptId" :disabled="addOrUpdateForm.triggerBy === 'SYSTEM'" filterable placeholder="请选择" style="width: 100%" @change="id => deptChange(id)">
          <el-option v-for="item in dept" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
        </el-select>
      </el-form-item>
      <el-form-item label="物料信息：" v-if="task === 'INCOMING' || task === 'PROCESS'">
        <el-select v-model="addOrUpdateForm.inspectMaterialCode" :disabled="addOrUpdateForm.id !== ''" filterable placeholder="请选择" @change="val => materialChange(val)" style="width: 100%">
          <el-option v-for="item in material" :key="item.id" :label="item.inspectMaterialCode + ' ' + item.inspectMaterialName" :value="item.inspectMaterialCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="批次：" v-if="task === 'INCOMING'">
        <el-select v-model="addOrUpdateForm.inspectBatch" filterable placeholder="请选择" style="width: 100%">
          <el-option v-for="item in batch" :key="item.id" :label="item.batch" :value="item.batch" />
        </el-select>
      </el-form-item>
      <el-form-item label="生产订单：" v-if="task === 'PROCESS'">
        <el-input v-model="addOrUpdateForm.orderNo" :disabled="addOrUpdateForm.triggerBy === 'SYSTEM'" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="品项：" v-if="task === 'INCOMING' || task === 'PROCESS'">
        <el-input v-model="addOrUpdateForm.itemName" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="供应商：" v-if="task === 'INCOMING'">
        <el-input v-model="addOrUpdateForm.supplier" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="取样信息：" v-if="task === 'PROCESS'">
        <el-select v-model="addOrUpdateForm.inspectSiteId" :disabled="addOrUpdateForm.triggerBy === 'SYSTEM'" filterable placeholder="请选择" style="width: 100%" @change="id => sampleChange(id)">
          <el-option v-for="item in samplingMessage" :key="item.id" :label="item.holderName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="取样说明：" v-if="task === 'PROCESS' || task === 'ASSIST'">
        <el-input v-model="addOrUpdateForm.sampleExplain" placeholder="请输入" ></el-input>
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
  <printModule ref="printModuleRef"/>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, getCurrentInstance, ComponentInternalInstance, nextTick } from 'vue'
import layoutTs from '@/components/layout/layoutTs'
import {
  DICT_DROPDOWN,
  GET_WORKSHOP,
  GET_HOLDER,
  DROPDOWN_INSPECT_TYPE,
  DROPDOWN_INSPECT_TYPE_DEPT,
  DROPDOWN_INSPECT_TYPE_MATERIAL,
  GET_SAMPLE_SAMPLING_TASK_LIST,
  SAMPLE_SAMPLING_TASK_LIST,
  SAMPLE_SAMPLING_TASK_ASSIST_UPDATE,
  SAMPLE_SAMPLING_TASK_PROCESS_UPDATE,
  SAMPLE_SAMPLING_TASK_DEL,
  SAMPLE_SAMPLING_TASK_SAMPLING
} from '@/api/api'
import printModule from './printModule.vue'

interface SamplingMessage{
  id?: string
  holderName?: string
  holderNo?: string
}
interface DeptObj{
  id?: string
  deptName?: string
  deptId?: string
}
interface MaterialObj{
  id: string
  inspectMaterialType: string
  inspectGroupCode: string
  inspectGroupName: string
  inspectMaterialCode: string
  inspectMaterialName: string
  itemName: string
  inspectItemId: string
}
interface TableData{
  id?: string
  triggerBy?: string
  sampleCode?: string
  inspectContent?: string
  taskStatus?: string
  inspectClassify?: string
  taskSampleClassify?: string
  temporaryFlag?: string
  inspectTypeId?: string
  sampleDeptId?: string
  sampleDeptName?: string
  inspectMaterialType?: string
  inspectMaterialCode?: string
  inspectMaterialName?: string
  inspectBatch?: string
  itemId?: string
  itemName?: string
  supplierCode?: string
  supplier?: string
  orderNo?: string
  inspectSiteId?: string
  inspectSiteName?: string
  sampleInformation?: string
  sampleExplain?: string
  vehicleStatus?: string
  sampleAmount?: string
  packing?: string
  handleMod?: string
}
const addOrUpdateFormRule = {
  temporaryFlag: [{
    required: true,
    message: '请选择任务类型',
    trigger: 'blur'
  }],
  inspectTypeId: [{
    required: true,
    message: '请选择检验类',
    trigger: 'blur'
  }],
  sampleDeptId: [{
    required: true,
    message: '请选择取样部门',
    trigger: 'blur'
  }]
}
export default defineComponent({
  name: 'SampleSampling',
  components: {
    printModule
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const { gotoPage } = layoutTs()
    const printModuleRef = ref()
    const addOrUpdateRef = ref()
    const task = ref('INCOMING') // 选择任务
    const taskList = ref<any[]>([]) // 任务汇总
    const addOrUpdateDialog = ref(false)
    const sampleInspectDialog = ref(false)
    const queryForm = reactive({
      taskSampleClassify: '',
      sampleQuantityStatus: '',
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
    const dept = ref<DeptObj[]>([])
    const samplingMessage = ref<SamplingMessage[]>([])
    const taskStatus = ref([])

    const selectionData = ref<TableData[]>([])

    // 获取任务数
    const getTask = async () => {
      const { data } = await GET_SAMPLE_SAMPLING_TASK_LIST()
      taskList.value = []
      for (const key in data.data) {
        if (data.data[key]) {
          switch (key.toString().toUpperCase()) {
            case 'INCOMING': data.data[key].inspectClassifyName = '来料检验'; data.data[key].inspectClassify = key.toString().toUpperCase(); break
            case 'PROCESS': data.data[key].inspectClassifyName = '制程检验'; data.data[key].inspectClassify = key.toString().toUpperCase(); break
            case 'ASSIST': data.data[key].inspectClassifyName = '生产辅助检验'; data.data[key].inspectClassify = key.toString().toUpperCase(); break
            case 'TEMP': data.data[key].inspectClassifyName = '临时检验'; data.data[key].inspectClassify = key.toString().toUpperCase(); break
          }
          taskList.value.push(data.data[key])
        }
      }
    }
    // 查询
    const query = async (status?: string) => {
      selectionData.value = []
      queryForm.taskSampleClassify = task.value
      if (status) {
        queryForm.sampleQuantityStatus = status
      } else {
        queryForm.sampleQuantityStatus = ''
      }
      const res = await SAMPLE_SAMPLING_TASK_LIST(queryForm)
      tableData.value = res.data.data.records
      queryForm.size = res.data.data.size
      queryForm.current = res.data.data.current
      queryForm.total = res.data.data.total
    }
    const changeTask = (val: string, status?: string) => {
      task.value = val
      queryForm.current = 1
      query(status)
    }
    // 跳转历史任务
    const goHistory = () => {
      gotoPage({
        path: 'qms-pages-SampleManagement-SampleSampling-historyTask'
      })
    }
    // 新建修改
    const addOrUpdate = async (row?: TableData) => {
      addOrUpdateDialog.value = true
      await nextTick()
      addOrUpdateRef.value.clearValidate()
      if (row) {
        addOrUpdateForm.value = { ...row }
        getInspect(false)
        await inspectChangeHttp(addOrUpdateForm.value.inspectTypeId)
        if (task.value === 'PROCESS') {
          await deptChangeHttp(addOrUpdateForm.value.sampleDeptId)
          await materialChange(addOrUpdateForm.value.inspectMaterialCode)
        }
      } else {
        getInspect(true)
        addOrUpdateForm.value = {
          id: '',
          taskSampleClassify: task.value,
          temporaryFlag: '',
          inspectTypeId: '',
          sampleDeptId: '',
          sampleDeptName: '',
          inspectMaterialType: '',
          inspectMaterialCode: '',
          inspectMaterialName: '',
          inspectBatch: '',
          itemId: '',
          itemName: '',
          supplier: '',
          supplierCode: '',
          orderNo: '',
          inspectSiteId: '',
          inspectSiteName: '',
          sampleInformation: '',
          sampleExplain: '',
          vehicleStatus: '',
          sampleAmount: '',
          packing: '',
          handleMod: ''
        }
      }
      console.log(addOrUpdateForm.value)
    }
    // 检验
    const inspectClick = (row: TableData) => {
      addOrUpdateForm.value = { ...row }
      sampleInspectDialog.value = true
    }
    // 新建修改确认
    const updateFormSubmit = async () => {
      addOrUpdateRef.value.validate(async (valid: boolean) => {
        if (valid) {
          addOrUpdateDialog.value = false
          sampleInspectDialog.value = false
          if (addOrUpdateForm.value.id && task.value === 'PROCESS') {
            await SAMPLE_SAMPLING_TASK_PROCESS_UPDATE(addOrUpdateForm.value)
          } else if (addOrUpdateForm.value.id && task.value === 'ASSIST') {
            await SAMPLE_SAMPLING_TASK_ASSIST_UPDATE(addOrUpdateForm.value)
          }
          proxy.$successToast('操作成功')
          query()
          getTask()
        }
      })
    }

    // 获取检验类、状态下拉
    const getSelect = async () => {
      try {
        const { data } = await DICT_DROPDOWN({ dictType: 'TASK_STATUS' })
        data.data = data.data.filter((it:any) => it.dictCode === 'UNSAMPLED' || it.dictCode === 'SAMPLING' || it.dictCode === 'ARRIVED' || it.dictCode === 'RECEIVED')
        taskStatus.value = data.data
      } catch (e) {}
    }
    const getInspect = async (st: boolean) => {
      const interfaceData:any = {
        assistFlag: ''
      }
      if (task.value === 'PROCESS') {
        interfaceData.assistFlag = 'N'
      } else if (task.value === 'ASSIST') {
        interfaceData.assistFlag = 'Y'
      }
      if (st) {
        interfaceData.manualFlag = 'Y'
      }
      try {
        const { data } = await DROPDOWN_INSPECT_TYPE(interfaceData)
        inspect.value = data.data
      } catch (e) {}
    }
    // 检验类下拉改变获取对应物料信息
    const inspectChange = async (id: string) => {
      await inspectChangeHttp(id)
      if (task.value === 'PROCESS') {
        addOrUpdateForm.value.sampleDeptId = ''
        addOrUpdateForm.value.sampleDeptName = ''
        addOrUpdateForm.value.inspectMaterialCode = ''
        addOrUpdateForm.value.inspectMaterialName = ''
        addOrUpdateForm.value.inspectMaterialType = ''
        addOrUpdateForm.value.itemId = ''
        addOrUpdateForm.value.itemName = ''
        addOrUpdateForm.value.inspectSiteId = ''
        addOrUpdateForm.value.inspectSiteName = ''
        addOrUpdateForm.value.sampleInformation = ''
      } else if (task.value === 'INCOMING') {
        addOrUpdateForm.value.inspectMaterialCode = ''
        addOrUpdateForm.value.inspectMaterialName = ''
        addOrUpdateForm.value.inspectMaterialType = ''
        addOrUpdateForm.value.itemId = ''
        addOrUpdateForm.value.itemName = ''
        addOrUpdateForm.value.inspectBatch = ''
        addOrUpdateForm.value.supplier = ''
        addOrUpdateForm.value.supplierCode = ''
      }
    }
    const inspectChangeHttp = async (id?: string) => {
      try {
        const { data } = await DROPDOWN_INSPECT_TYPE_DEPT({ inspectTypeId: id })
        dept.value = data.data
      } catch (e) {}
      try {
        const { data } = await DROPDOWN_INSPECT_TYPE_MATERIAL({ inspectTypeId: id })
        material.value = data.data
      } catch (e) {}
    }
    // 取样部门改变获取取样信息
    const deptChange = async (id: string) => {
      const deptObj = (dept.value.find(item => item.deptId === id) as DeptObj)
      addOrUpdateForm.value.sampleDeptName = deptObj.deptName
      addOrUpdateForm.value.inspectSiteId = ''
      addOrUpdateForm.value.inspectSiteName = ''
      addOrUpdateForm.value.sampleInformation = ''
      await deptChangeHttp(id)
    }
    const deptChangeHttp = async (id?: string) => {
      try {
        const { data } = await GET_WORKSHOP({ id: id })
        if (data.data) {
          const res = await GET_HOLDER({ deptId: data.data.id })
          samplingMessage.value = res.data.data
        }
      } catch (e) {}
    }
    // 物料信息改变获取批次、品项、供应商
    const materialChange = (code?: string) => {
      const materialObj = (material.value.find(item => item.inspectMaterialCode === code) as MaterialObj)
      addOrUpdateForm.value.inspectMaterialName = materialObj.inspectGroupName
      addOrUpdateForm.value.inspectMaterialType = materialObj.inspectMaterialType
      addOrUpdateForm.value.itemId = materialObj.inspectItemId
      addOrUpdateForm.value.itemName = materialObj.itemName
      // addOrUpdateForm.value.supplier = '供应商'
      // addOrUpdateForm.value.supplierCode = '供应商编码'
      // addOrUpdateForm.value.inspectBatch = ''
      // batch.value = []
    }
    // 取样信息改变
    const sampleChange = (id: string) => {
      const samplingMessageObj = (samplingMessage.value.find(item => item.id === id) as SamplingMessage)
      addOrUpdateForm.value.inspectSiteName = samplingMessageObj.holderName
    }
    // 表格复选框能否被选中逻辑
    const checkDate = (row: TableData) => {
      if (row.taskStatus !== 'UNSAMPLED' && row.taskStatus !== 'SAMPLING') {
        return false
      }
      return true
    }
    // 表格复选框改变
    const selectionChange = (val: TableData[]) => {
      selectionData.value = val
    }
    // 取样
    const sampling = async (row?:TableData) => {
      if (row) {
        if (row.taskStatus === 'UNSAMPLED') {
          proxy.$confirm('是否确定取样，请确认', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            await SAMPLE_SAMPLING_TASK_SAMPLING([row])
            query()
            getTask()
            printModuleRef.value.print([{
              title: setText(row),
              subtitle: row.inspectSiteName,
              code: row.sampleCode
            }])
          })
        } else {
          printModuleRef.value.print([{
            title: setText(row),
            subtitle: (row.itemName || '') + (row.inspectSiteName || ''),
            code: row.sampleCode
          }])
        }
      } else if (selectionData.value.length) {
        const httpData:TableData[] = []
        selectionData.value.forEach(it => {
          if (it.taskStatus === 'UNSAMPLED') {
            httpData.push(it)
          }
        })
        const data = selectionData.value.map(it => ({
          title: setText(it),
          subtitle: (it.itemName || '') + (it.inspectSiteName || ''),
          code: it.sampleCode
        }))
        if (httpData.length) {
          proxy.$confirm('是否确定取样，请确认', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            await SAMPLE_SAMPLING_TASK_SAMPLING(httpData)
            query()
            getTask()
            printModuleRef.value.print(data)
          })
        } else {
          printModuleRef.value.print(data)
        }
      } else {
        proxy.$warningToast('请选择数据')
      }
    }
    const setText = (row: TableData):string => {
      const inspectContent = (row.inspectContent as string).split('-')
      if (inspectContent.length && inspectContent[1] && inspectContent[2]) {
        let tmp = ''
        inspectContent[2].indexOf('理') >= 0 ? tmp = '理'
          : inspectContent[2].indexOf('微生物') >= 0 ? tmp = '菌' : tmp = ''
        return `${inspectContent[1]}(${tmp})`
      } else {
        return ''
      }
    }
    const delRow = (row:TableData) => {
      proxy.$confirm('是否删除，请确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await SAMPLE_SAMPLING_TASK_DEL(row)
        proxy.$successToast('操作成功')
        await query()
        await getTask()
      })
    }

    onMounted(async () => {
      getSelect()
      await getTask()
      if (taskList.value.length) {
        task.value = taskList.value[0].inspectClassify
      }
      query()
    })

    return {
      addOrUpdateRef,
      printModuleRef,
      task,
      taskList,
      taskStatus,
      addOrUpdateDialog,
      sampleInspectDialog,
      queryForm,
      tableData,
      addOrUpdateForm,
      sampleInspectForm,
      inspect,
      material,
      batch,
      dept,
      samplingMessage,
      selectionData,
      addOrUpdateFormRule,
      delRow,
      sampling,
      checkDate,
      selectionChange,
      changeTask,
      goHistory,
      query,
      inspectChange,
      deptChange,
      materialChange,
      sampleChange,
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
      display: flex;
      line-height: 22px;
      .qmsIconfont{
        width: 22px;
        height: 22px;
        margin-right: 3px;
      }
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
    border: 1px solid #487BFF;
    color: #487BFF;
    transform: scale(1.05);
    .task__item--title{
      color: #487BFF;
    }
  }
}
.task-list{
  background: white;
  .el-form-item{
    margin-bottom: 11px;
  }
}
.status{
  position: relative;
  padding-left: 15px;
  &::before {
    content: "";
    display: block;
    border-radius: 50%;
    position: absolute;
    top: 7px;
    left: 0;
    width: 6px;
    height: 6px;
  }
}
.yellow::before{
  background: #FFBF00;
}
.blue::before{
  background: #487BFF;
}
.grey::before{
  background: #D8D8D8;
}
.green::before{
  background: #7ED321;
}
</style>
