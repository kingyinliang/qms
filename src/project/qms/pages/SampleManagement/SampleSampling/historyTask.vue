<template>
  <el-card class="box-card">
    <el-form inline :model="queryForm" size="small" label-suffix="：">
      <el-form-item label="取样码">
        <el-input v-model="queryForm.itemCodeOrName" style="width: 140px"></el-input>
      </el-form-item>
      <el-form-item label="批次">
        <el-input v-model="queryForm.itemCodeOrName" style="width: 140px"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="queryForm.beginDate"
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
    <el-tab-pane label="来料检验" name="1"/>
    <el-tab-pane label="制程检验" name="2" />
    <el-tab-pane label="生产辅助" name="3" />
    <el-tab-pane label="临时检验" name="4" />
    <div class="k-box-card-title clearfix">
      <h3> <em class="title-icon" />任务列表</h3>
    </div>
    <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" fixed="left" :index="(index) => index + 1 + (queryForm.current - 1) * queryForm.size" label="序号" width="50" />
      <el-table-column label="样品码" prop="itemCode" :show-overflow-tooltip="true" />
      <el-table-column label="状态" prop="itemName" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="检验内容" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === '2'" label="订单" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === '1' || task === '2'" label="物料信息" prop="created" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === '2'" label="品项" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === '2'" label="取样信息" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === '2' || task === '3'" label="取样说明" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === '1'" label="物料批次" prop="changer" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === '1'" label="供应商" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === '1' || task === '3'" label="任务触发时间" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === '3'" label="取样截至时间" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === '4'" label="发布人" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === '4'" label="发布时间" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="qmsIconfont qms-guanlian" class="role__btn" @click="updateMaterial(scope.row)">
            关联物料
          </el-button>
          <el-button type="text" icon="iconfont factory-luru" class="role__btn">
            编辑
          </el-button>
          <el-button style="color: #EF4632" type="text" icon="el-icon-delete" class="role__btn">
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
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'

interface TableData{
  id?: string
}
export default defineComponent({
  name: 'historyTask',
  setup () {
    const task = ref('1')
    const queryForm = reactive({
      itemCodeOrName: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据
    const tableData = ref<TableData[]>([]) // 表格数据

    const query = () => {
      console.log(1)
    }
    const tabClick = (tab: any) => {
      task.value = tab.props.name
    }

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
