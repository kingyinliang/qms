<template>
  <mds-card class="task" title="待办任务" :pack-up="false">
    <template #titleBtn>
      <div style="float: right; color: #333333;font-size: 14px;font-weight: bold;cursor: pointer" @click="goHistory"><i class="qmsIconfont qms-lishirenwu1" style="color: #487BFF"/> 历史任务</div>
    </template>
    <el-row :gutter="16">
      <el-col :span="6" style="min-width: 255px" v-for="(item, index) in taskList" :key="index">
        <div class="task__item" :class="{active: task === item.inspectClassify}"  @click="changeTask(item.inspectClassify, 'null')">
          <p class="task__item--title">
            <svg class="qmsIconfont" aria-hidden="true">
              <use xlink:href="#qms-colonynum" v-if="item.inspectClassify === 'COLONYNUM'"></use>
              <use xlink:href="#qms-coliformgroup" v-if="item.inspectClassify === 'COLIFORMGROUP'"></use>
              <use xlink:href="#qms-yeast" v-if="item.inspectClassify === 'YEAST'"></use>
            </svg>
            <span>
              {{ item.inspectClassifyName }}
            </span>
          </p>
          <div class="task__item__flex">
            <div class="task__item__flex__item" @click.stop="changeTask(item.inspectClassify, 'execute')">
              <p class="task__item__flex__item--big"><span>{{ item.execute }}</span><span style="font-size: 18px;margin-left: 3px">/{{ item.executeInvisible }}</span></p>
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
      <el-form :inline="true" size="small" style="float: right;display: flex" @keyup.enter="() => {queryForm.current = 1; query(); getTask()}" @submit.prevent>
        <el-form-item label="样品码：">
          <el-input v-model="queryForm.sampleCode" placeholder="请输入" style="width: 120px" clearable></el-input>
        </el-form-item>
        <el-form-item label="检验内容：">
          <el-input v-model="queryForm.inspectContent" placeholder="请输入" style="width: 120px" clearable></el-input>
        </el-form-item>
        <el-form-item :label="task !== 'COLONYNUM'?'检验开始日期':'培养日期'">
        <el-date-picker
          v-model="queryForm.inspectDateBegin"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选选择日期"
          style="width: 140px"
        />
        -
        <el-date-picker
          v-model="queryForm.inspectDateEnd"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选选择日期"
          style="width: 140px"
        />
      </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="() => {queryForm.current = 1; query(); getTask()}">查询</el-button>
          <el-button @click="goCultivate()"><i class="qmsIconfont qms-jianyan"/> 培养</el-button>
          <el-button type="primary" @click="goCount()"><i class="qmsIconfont qms-dayin" /> 计数</el-button>
          <el-button v-if="task !== 'COLONYNUM'" type="primary" @click="goFive()"><i class="qmsIconfont qms-dayin" /> 检验</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="selectionChange">
      <el-table-column type="selection" width="45" :selectable="checkDate" />
      <el-table-column type="index" fixed="left" :index="(index) => index + 1 + (queryForm.current - 1) * queryForm.size" label="序号" width="50" />
      <el-table-column label="样品码" prop="sampleCode" min-width="120" :show-overflow-tooltip="true" >
        <template #default="scope">
         <div type="text" class="text_btn" @click="goForm(scope.row)">
            <em>{{scope.row.sampleCode}}</em>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="taskStatusName" min-width="120" :show-overflow-tooltip="true">
        <template #default="scope">
          <span class="status"
                :class="{
                yellow: scope.row.taskStatusName === '已收样',
                green: scope.row.taskStatusName === '已完成',
                blue: scope.row.taskStatusName === '检验中',
                silver: scope.row.taskStatusName ==='待取样' || scope.row.taskStatusName ==='取样中' || scope.row.taskStatusName === '已送达' || scope.row.taskStatusName === '已取消'
             }"
          v-if="scope.row.taskStatusName!==''">{{ scope.row.taskStatusName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检验内容" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column  label="订单" prop="orderNo" v-if="task !== 'COLONYNUM'" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="物料信息" min-width="165" :show-overflow-tooltip="true">
        <template #default="scope">{{ `${scope.row.inspectMaterialCode} ${scope.row.inspectMaterialName}` }}</template>
      </el-table-column>
      <el-table-column  label="批次" prop="inspectBatch" v-if="task === 'COLONYNUM'" min-width="150"  :show-overflow-tooltip="true" />
      <el-table-column  label="品项" prop="itemName"  v-if="task !== 'COLONYNUM'" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column  label="取样信息" prop="inspectSiteName"  min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="取样说明" prop="sampleExplain" v-if="task !== 'COLONYNUM'"  min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="检验频次" prop="inspectFrequency" v-if="task !== 'COLONYNUM'"  min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="培养日期" prop="inspectDate" v-if="task === 'COLONYNUM'"  min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="取样单位" prop="sampleDeptName" v-if="task !== 'COLONYNUM'" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task !== 'COLONYNUM'" label="检验开始时间" prop="inspectStartDate" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="送样时间" prop="deliveryDate" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="收样时间" prop="receiveDate" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="scope">
          <el-button v-if="scope.row.inspectMethodGroupNameList.includes('培养法')"  type="text" icon="qmsIconfont qms-jianyan3" class="role__btn" @click="goCultivate(scope.row)">
            培养
          </el-button>
          <el-button v-if="scope.row.inspectMethodGroupNameList.includes('五管法')" type="text" icon="qmsIconfont qms-jianyan3" class="role__btn" @click="goFive(scope.row)">
            检验
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
        @size-change="val => {queryForm.current = 1; queryForm.size = val;query()}"
        @current-change="val => {queryForm.current = val; query()}"
      />
    </el-row>
  </mds-card>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref
} from 'vue'
import { TASK_INSPECT_MICROBE_TODO_LIST_QUERY, TASK_INSPECT_MICROBE_INSPECT_TASK_LIST_QUERY, TASK_INSPECT_MICROBE_INSPECT_MICROBE_PARAMETER_QUERY } from '@/api/api'
import layoutTs from '@/components/layout/layoutTs'
import { useStore } from 'vuex'
interface TableData{
  id?: string
  taskStatus?: string
  inspectContent?: string
  itemName?: string
  inspectSiteName?: string
  sampleCode?: string
  taskStatusName?: string
  inspectMethodGroupNameList: string[]
}

export default defineComponent({
  name: 'MicrobeInspectionTask',
  components: {
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const store = useStore()
    const { gotoPage, removeTabHandle } = layoutTs()

    const task = ref('COLONYNUM') // 选择任务
    const taskList = ref<any[]>([]) // 任务汇总
    const queryForm = reactive({
      sampleQuantityStatus: '',
      sampleCode: '',
      inspectContent: '',
      indexName: '',
      statusHistory: '',
      inspectDateBegin: '',
      inspectDateEnd: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据
    const inspectClassifyObj = reactive({
      inspectClassifyName: '菌落总数',
      inspectClassify: 'COLONYNUM'
    })
    const tableData = ref<TableData[]>([]) // 表格数据
    const selectionData = ref<TableData[]>([]) // 选中数据

    // 获取代办任务类别
    const getTask = async () => {
      const { data } = await TASK_INSPECT_MICROBE_TODO_LIST_QUERY()
      taskList.value = []
      for (const key in data.data) {
        if (data.data[key]) {
          switch (key.toString().toUpperCase()) {
            case 'COLONYNUM': data.data[key].inspectClassifyName = '菌落总数'; data.data[key].inspectClassify = key.toString().toUpperCase(); break
            case 'COLIFORMGROUP': data.data[key].inspectClassifyName = '大肠菌群'; data.data[key].inspectClassify = key.toString().toUpperCase(); break
            case 'YEAST': data.data[key].inspectClassifyName = '酵母菌'; data.data[key].inspectClassify = key.toString().toUpperCase(); break
          }
          taskList.value.push(data.data[key])
        }
      }
    }
    // 跳转历史任务
    const goHistory = () => {
      gotoPage({
        path: 'qms-pages-InspectionManagement-microbeInspectTask-historyTask'
      })
    }
    // 查询
    const query = async (status?: string) => {
      let tempTableData:any[] = []
      queryForm.indexName = inspectClassifyObj.inspectClassifyName
      if (status) {
        queryForm.sampleQuantityStatus = status
      }
      if (status === 'null') {
        queryForm.sampleQuantityStatus = ''
      }
      const { data } = await TASK_INSPECT_MICROBE_INSPECT_TASK_LIST_QUERY(queryForm)
      tempTableData = data.data.records

      queryForm.size = data.data.size
      queryForm.current = data.data.current
      queryForm.total = data.data.total

      const temp = await TASK_INSPECT_MICROBE_INSPECT_MICROBE_PARAMETER_QUERY(data.data.records)
      tempTableData.forEach((item:any, index:number) => {
        item.inspectMethodGroupNameList = temp.data.data[index].inspectMethodGroupNameList.map((element:any) => element.inspectMethodName)
      })
      tableData.value = tempTableData
    }
    // 切换任务分类
    const changeTask = (inspectClassify: string, status: string) => {
      task.value = inspectClassify
      inspectClassifyObj.inspectClassifyName = taskList.value.find(it => it.inspectClassify === inspectClassify).inspectClassifyName
      inspectClassifyObj.inspectClassify = inspectClassify
      queryForm.current = 1
      query(status)
    }

    // 培养
    const goCultivate = (row?:TableData) => {
      if (!row && !selectionData.value.length) {
        proxy.$warningToast('请选择数据')
        return
      }

      if (!row && !selectionData.value.filter(it => it.inspectMethodGroupNameList.includes('培养法')).length) {
        proxy.$warningToast('请选择培养法数据')
        return
      }

      removeTabHandle('qms-pages-InspectionManagement-microbeInspect-cultivate')

      setTimeout(() => {
        store.commit('inspection/updateMicrobeInspectCultivate', {
          indexName: inspectClassifyObj.inspectClassifyName,
          taskInspectIdList: row ? [row.id] : selectionData.value.filter(it => it.inspectMethodGroupNameList.includes('培养法')).map(it => it.id)
        })

        gotoPage({
          name: 'qms-pages-InspectionManagement-microbeInspect-cultivate'
        })
      }, 100)
    }
    // 计数
    const goCount = () => {
      if (!selectionData.value.length) {
        proxy.$warningToast('请选择数据')
        return
      }

      if (!selectionData.value.filter(it => it.inspectMethodGroupNameList.includes('培养法')).length) {
        proxy.$warningToast('请选择培养法数据')
        return
      }

      removeTabHandle('qms-pages-InspectionManagement-microbeInspect-count')

      setTimeout(() => {
        store.commit('inspection/updateMicrobeInspectCount', {
          indexName: inspectClassifyObj.inspectClassifyName,
          taskInspectIdList: selectionData.value.filter(it => it.inspectMethodGroupNameList.includes('培养法')).map(it => it.id)
        })

        gotoPage({
          name: 'qms-pages-InspectionManagement-microbeInspect-count'
        })
      }, 100)
    }
    const goFive = (row?:TableData) => {
      if (!row && !selectionData.value.length) {
        proxy.$warningToast('请选择数据')
        return
      }

      if (!row && !selectionData.value.filter(it => it.inspectMethodGroupNameList.includes('五管法')).length) {
        proxy.$warningToast('请选择五管法数据')
        return
      }

      removeTabHandle('qms-pages-InspectionManagement-microbeInspect-five')

      setTimeout(() => {
        store.commit('inspection/updateMicrobeInspectFive', {
          indexName: inspectClassifyObj.inspectClassifyName,
          taskInspectIdList: row ? [row.id] : selectionData.value.filter(it => it.inspectMethodGroupNameList.includes('五管法')).map(it => it.id)
        })

        gotoPage({
          name: 'qms-pages-InspectionManagement-microbeInspect-five'
        })
      }, 100)
    }
    // 表格复选框能否被选中逻辑
    const checkDate = (row:TableData) => {
      if (row.taskStatusName === '已完成') {
        return false
      }
      return true
    }
    // 表格复选框改变
    const selectionChange = (val: TableData[]) => {
      selectionData.value = val
    }

    const goInspect = () => {
      //
    }

    const goForm = async (row:TableData) => {
      if (row.inspectMethodGroupNameList.includes('培养法')) {
        store.commit('inspection/updateMicrobeInspectCultivateForm', row)
        gotoPage({
          path: 'qms-pages-InspectionManagement-microbeInspect-countForm'
        })
      }
      if (row.inspectMethodGroupNameList.includes('五管法')) {
        store.commit('inspection/updateMicrobeInspectFiveForm', row)
        gotoPage({
          path: 'qms-pages-InspectionManagement-microbeInspect-fiveForm'
        })
      }
    }

    onMounted(async () => {
      await getTask()
      if (taskList.value.length) {
        task.value = taskList.value[0].inspectClassify
        inspectClassifyObj.inspectClassifyName = taskList.value[0].inspectClassifyName
        inspectClassifyObj.inspectClassify = taskList.value[0].inspectClassify
      }
      query()
    })

    return {
      task,
      taskList,
      queryForm,
      tableData,
      goHistory,
      changeTask,
      query,
      goCultivate,
      goCount,
      goFive,
      checkDate,
      selectionChange,
      goForm,
      goInspect
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
      min-width: 255px;
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
  .silver::before{
    background: #AAA;
  }
</style>
