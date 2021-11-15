<template>
  <el-card class="box-card">
    <el-form inline :model="queryForm" size="small" label-suffix="：" @keyup.enter="() => {queryForm.current = 1; query()}" @submit.prevent>
      <el-form-item label="取样码">
        <el-input v-model="queryForm.sampleCode" placeholder="请输入" style="width: 140px"></el-input>
      </el-form-item>
      <el-form-item label="批次">
        <el-input v-model="queryForm.inspectBatch" placeholder="请输入" style="width: 140px"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="queryForm.triggerDate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选选择日期"
          style="width: 140px"
        />
      </el-form-item>
    </el-form>
    <el-button type="primary" size="small" icon="el-icon-search" style="float: right" @click="() => {queryForm.current = 1; query()}">查询</el-button>
  </el-card>
  <el-tabs :model-value="task" type="border-card" class="NewDaatTtabs tabsPages" @tab-click="tabClick">
    <el-tab-pane label="来料检验" name="INCOMING"/>
    <el-tab-pane label="制程检验" name="PROCESS" />
    <el-tab-pane label="生产辅助" name="ASSIST" />
    <el-tab-pane label="临时检验" name="TEMP" />
    <div class="k-box-card-title clearfix">
      <h3> <em class="title-icon" />任务列表</h3>
    </div>
    <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" fixed="left" :index="(index) => index + 1 + (queryForm.current - 1) * queryForm.size" label="序号" width="50" />
      <el-table-column label="样品码" prop="sampleCode" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="检验内容" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task !== 'TEMP'" label="物料信息" min-width="165" :show-overflow-tooltip="true">
        <template #default="scope">{{ `${scope.row.inspectMaterialName} ${scope.row.inspectMaterialCode}` }}</template>
      </el-table-column>
      <el-table-column v-if="task !== 'TEMP'" label="物料批次" prop="inspectBatch" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'PROCESS'||task === 'ASSIST'" label="品项" prop="itemName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'PROCESS'||task === 'ASSIST'" label="订单" prop="orderNo" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'PROCESS'" label="取样信息" prop="inspectSiteName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="触发时间" prop="triggerDate" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="送达时间" prop="deliveryDate" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="完成时间" prop="finishDate" min-width="165" :show-overflow-tooltip="true" />
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
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { SAMPLE_SAMPLING_TASK_HISTORY_LIST } from '@/api/api'

interface TableData{
  id?: string
}
export default defineComponent({
  name: 'historyTask',
  setup () {
    const task = ref('INCOMING')
    const queryForm = reactive({
      taskSampleClassify: '',
      sampleCode: '',
      inspectBatch: '',
      triggerDate: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据
    const tableData = ref<TableData[]>([]) // 表格数据

    const query = async () => {
      queryForm.taskSampleClassify = task.value
      const { data } = await SAMPLE_SAMPLING_TASK_HISTORY_LIST(queryForm)
      tableData.value = data.data.records
      queryForm.size = data.data.size
      queryForm.current = data.data.current
      queryForm.total = data.data.total
    }
    const tabClick = (tab: any) => {
      task.value = tab.props.name
      query()
    }
    onMounted(() => {
      query()
    })

    return {
      task,
      queryForm,
      tableData,
      tabClick,
      query
    }
  }
})
</script>

<style lang="scss" scoped>
.box-card{
  /deep/.el-card__body{
    display: flex;
    padding: 15px;
  }
  .el-form{
    display: flex;
    flex: 1;
  }
}
.el-form-item{
  margin-bottom: 0;
}
</style>
