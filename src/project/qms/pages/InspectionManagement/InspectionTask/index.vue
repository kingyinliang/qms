<template>
  <mds-card class="task" title="待办任务" :pack-up="false">
    <template #titleBtn>
      <div style="float: right; color: #333333;font-size: 14px;font-weight: bold;cursor: pointer" @click="goHistory"><i class="qmsIconfont qms-lishirenwu1" style="color: #487BFF"/> 历史任务</div>
    </template>
    <el-row :gutter="16">
      <el-col :span="4" style="min-width: 255px" v-for="(item, index) in taskList" :key="index">
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
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">{{ item.execute }}</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>待完成</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">{{ item.progressing }}</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-jinrushiyan"/>进行中</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
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
          <el-input v-model="queryForm.sampleCode" placeholder="请输入" style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item label="检验内容：">
          <el-input v-model="queryForm.inspectContent" placeholder="请输入" style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item label="取样信息：">
          <el-input v-model="queryForm.inspectContent" placeholder="请输入" style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="() => {queryForm.current = 1; query()}">查询</el-button>
          <el-button @click="goInspect()"><i class="qmsIconfont qms-jianyan"/> 检验</el-button>
          <el-button type="primary" @click="goPrint()"><i class="qmsIconfont qms-dayin" /> 打印</el-button>
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
      <el-table-column v-if="task === 'PROCESS'" label="生产物料" min-width="165" :show-overflow-tooltip="true">
        <template #default="scope">{{ `${scope.row.inspectMaterialCode} ${scope.row.inspectMaterialName}` }}</template>
      </el-table-column>
      <el-table-column v-if="task === 'PROCESS'" label="订单" prop="itemName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'PROCESS'" label="品项" prop="itemName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'PROCESS'" label="取样信息" prop="itemName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'ASSIST'" label="取样说明" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'ASSIST'" label="检验频次" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="取样部门" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="送达时间" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="收样时间" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="scope">
          <el-button v-if="task !== 'TEMP'" type="text" icon="qmsIconfont qms-jianyan3" class="role__btn" @click="retentionSample(scope.row)">
            留样
          </el-button>
          <el-button type="text" icon="qmsIconfont qms-binglike" class="role__btn" @click="goInspect(scope.row)">
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
        @size-change="val => {queryForm.size = val;query()}"
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
import layoutTs from '@/components/layout/layoutTs'
interface TableData{
  id?: string
  taskStatus?: string
}

export default defineComponent({
  name: 'inspectionTask',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const { gotoPage } = layoutTs()
    const task = ref('PROCESS') // 选择任务
    const taskList = ref<any[]>([]) // 任务汇总
    const queryForm = reactive({
      taskSampleClassify: '',
      inspectContent: '',
      taskStatus: '',
      sampleCode: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据
    const tableData = ref<TableData[]>([]) // 表格数据
    const selectionData = ref<TableData[]>([]) // 选中数据

    // 获取任务数
    const getTask = async () => {
      taskList.value = [{
        inspectClassify: 'PROCESS',
        inspectClassifyName: '制程检验',
        execute: '1',
        progressing: '1',
        completed: '1'
      }, {
        inspectClassify: 'ASSIST',
        inspectClassifyName: '生产辅助检验',
        execute: '2',
        progressing: '2',
        completed: '2'
      }, {
        inspectClassify: 'TEMP',
        inspectClassifyName: '临时检验',
        execute: '3',
        progressing: '3',
        completed: '3'
      }]
    }
    // 跳转历史任务
    const goHistory = () => {
      gotoPage({
        path: 'qms-pages-InspectionManagement-InspectionTask-historyTask'
      })
    }
    // 查询
    const query = async () => {
      console.log(1)
    }
    // 切换任务分类
    const changeTask = (val: string) => {
      task.value = val
      queryForm.current = 1
      query()
    }
    // 检验
    const goInspect = (row?: TableData) => {
      console.log(row)
      gotoPage({
        path: 'qms-pages-InspectionManagement-PhysicochemicalInspect-index'
      })
    }
    // 打印
    const goPrint = () => {
      console.log(1)
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
    // 留样
    const retentionSample = (row: TableData) => {
      proxy.$confirm('是否留样，请确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log(1)
      })
    }

    onMounted(() => {
      getTask()
    })

    return {
      task,
      taskList,
      queryForm,
      tableData,
      goHistory,
      changeTask,
      query,
      goInspect,
      goPrint,
      checkDate,
      selectionChange,
      retentionSample
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
