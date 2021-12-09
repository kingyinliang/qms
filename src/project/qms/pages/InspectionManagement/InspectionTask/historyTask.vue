<template>
  <el-card class="box-card">
    <el-form inline :model="queryForm" size="small" label-suffix="：" @keyup.enter="() => {queryForm.current = 1; query()}" @submit.prevent>
      <el-form-item label="取样码">
        <el-input v-model="queryForm.sampleCode" placeholder="请输入" style="width: 140px" clearable></el-input>
      </el-form-item>
      <el-form-item label="检验内容">
        <el-input v-model="queryForm.inspectContent" placeholder="请输入" style="width: 140px" clearable></el-input>
      </el-form-item>
      <el-form-item label="取样信息">
        <el-input v-model="queryForm.inspectSiteName" placeholder="请输入" clearable style="width: 140px"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="queryForm.inspectStartDateBegin"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选选择日期"
          clearable
          style="width: 140px"
        />
        -
        <el-date-picker
          v-model="queryForm.inspectStartDateEnd"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          clearable
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
    <el-tab-pane label="委外" name="SAFETY" />
    <div class="k-box-card-title clearfix">
      <h3> <em class="title-icon" />任务列表</h3>
    </div>
    <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" fixed="left" :index="(index) => index + 1 + (queryForm.current - 1) * queryForm.size" label="序号" width="50" />
      <el-table-column label="样品码" prop="sampleCode" min-width="120" :show-overflow-tooltip="true">
        <template #default="scope">
         <div type="text" class="text_btn" @click="btnConfigulationReadOnly(scope.row)">
            <em>{{scope.row.sampleCode}}</em>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="task === 'INCOMING'||task === 'PROCESS'" label="状态" prop="taskStatusName" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="检验内容" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="物料信息" v-if="task !== 'ASSIST'&&task !== 'TEMP'" min-width="165" :show-overflow-tooltip="true">
        <template #default="scope">{{ `${scope.row.inspectMaterialCode} ${scope.row.inspectMaterialName}` }}</template>
      </el-table-column>
      <el-table-column label="物料批次" v-if="task === 'INCOMING'||task === 'SAFETY'" prop="inspectBatch" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task !== 'ASSIST'&&task !== 'TEMP'" label="品项" prop="itemName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'INCOMING'||task === 'SAFETY'" label="供应商" prop="supplier" min-width="150" :show-overflow-tooltip="true" />

      <el-table-column v-if="task === 'PROCESS'" label="订单" prop="orderNo" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'PROCESS'" label="取样信息" prop="inspectSiteName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'ASSIST'" label="取样说明" prop="sampleExplain" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'ASSIST'" label="检验频次" prop="inspectFrequency" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'TEMP'" label="需求部门" prop="needDeptName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'TEMP'" label="需求日期" prop="inspectSiteName" min-width="150" :show-overflow-tooltip="true" />

      <el-table-column v-if="task === 'SAFETY'" label="送达时间" prop="deliveryDate" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'SAFETY'" label="收样时间" prop="receiveDate" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task !== 'INCOMING'&&task !== 'SAFETY'" label="取样部门" prop="coSampleDeptName" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 'INCOMING' || task === 'SAFETY'" label="检验单位" prop="coInspectDeptName" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task !== 'SAFETY'" label="取样时间" prop="sampleEndDate" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="检验开始" prop="inspectStartDate" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="检验结束" prop="inspectEndDate" min-width="165" :show-overflow-tooltip="true" />
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
import { INSPECT_TASK_HISTORY_LIST } from '@/api/api'
import layoutTs from '@/components/layout/layoutTs'
import { useStore } from 'vuex'

interface TableData{
  id?: string
}
export default defineComponent({
  name: 'inspectHistoryTask',
  setup () {
    const store = useStore()
    const task = ref('INCOMING')
    const queryForm = reactive({
      taskInspectClassify: '',
      sampleCode: '',
      inspectContent: '',
      inspectSiteName: '',
      inspectStartDateBegin: '',
      inspectStartDateEnd: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据
    const tableData = ref<TableData[]>([]) // 表格数据
    const { gotoPage } = layoutTs()
    const query = async () => {
      queryForm.taskInspectClassify = task.value
      const { data } = await INSPECT_TASK_HISTORY_LIST(queryForm)
      tableData.value = data.data.records
      queryForm.size = data.data.size
      queryForm.current = data.data.current
      queryForm.total = data.data.total
    }
    const tabClick = (tab: any) => {
      task.value = tab.props.name
      query()
    }

    // [BTN:只读]
    const btnConfigulationReadOnly = async (row:TableData) => {
      store.commit('common/updateSampleObjForView', { type: 'HISTORY', obj: [row] })
      gotoPage({
        path: 'qms-pages-InspectionManagement-components-form'
      })
    }

    onMounted(() => {
      query()
    })

    return {
      task,
      queryForm,
      tableData,
      tabClick,
      query,
      btnConfigulationReadOnly
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
