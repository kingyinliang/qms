<template>
  <el-card class="box-card">
    <el-form inline :model="queryForm" size="small" label-suffix="：" @keyup.enter="() => {queryForm.current = 1; query()}" @submit.prevent>
      <el-form-item label="取样码">
        <el-input v-model="queryForm.sampleCode" placeholder="请输入" style="width: 140px"></el-input>
      </el-form-item>
      <el-form-item label="检验内容">
        <el-input v-model="queryForm.inspectContent" placeholder="请输入" style="width: 140px"></el-input>
      </el-form-item>
      <!-- <el-form-item label="取样信息">
        <el-input v-model="queryForm.inspectSiteName" placeholder="请输入" style="width: 140px"></el-input>
      </el-form-item> -->
      <el-form-item label="日期">
        <el-date-picker
          v-model="queryForm.inspectStartDateBegin"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选选择日期"
          style="width: 140px"
        />
        -
        <el-date-picker
          v-model="queryForm.inspectStartDateEnd"
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
    <el-tab-pane label="菌落总数" name="COLONYNUM"/>
    <el-tab-pane label="大肠菌群" name="COLIFORMGROUP" />
    <el-tab-pane label="酵母菌" name="YEAST" />
    <div class="k-box-card-title clearfix">
      <h3> <em class="title-icon" />任务列表</h3>
    </div>
    <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" fixed="left" :index="(index) => index + 1 + (queryForm.current - 1) * queryForm.size" label="序号" width="50" />
      <el-table-column label="样品码" prop="sampleCode" min-width="120" :show-overflow-tooltip="true">
        <template #default="scope">
         <div type="text" class="role__btn" @click="btnConfigulationReadOnly(scope.row)">
            <em>{{scope.row.sampleCode}}</em>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="检验内容" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="物料信息" min-width="165" :show-overflow-tooltip="true">
        <template #default="scope">{{ `${scope.row.inspectMaterialCode} ${scope.row.inspectMaterialName}` }}</template>
      </el-table-column>
      <el-table-column label="批次"  min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="取样信息" prop="inspectSiteName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="取样部门" prop="coSampleDeptName" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="收样时间" prop="receiveDate" min-width="150" :show-overflow-tooltip="true" />

      <el-table-column label="检验人" prop="" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="培养日期" prop="inspectDate" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="检验完成" prop="inspectEndDate" min-width="165" :show-overflow-tooltip="true" />
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
      // inspectSiteName: '',
      inspectStartDateBegin: '',
      inspectStartDateEnd: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据
    const inspectClassifyObj = reactive({
      inspectClassifyName: '菌落总数',
      inspectClassify: 'COLONYNUM'
    })
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
      // inspectClassifyObj.inspectClassifyName = inspectClassifyName
      // inspectClassifyObj.inspectClassify = inspectClassify
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
