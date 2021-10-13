<template>
  <el-card class="box-card">
    <el-form inline :model="queryForm" size="small" label-suffix="：">
      <el-form-item label="样品码">
        <el-input v-model="queryForm.itemCodeOrName" style="width: 140px"></el-input>
      </el-form-item>
      <el-form-item label="送样单位">
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
        -
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
  <mds-card class="SampleStay" title="样品列表" :pack-up="false">
    <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" fixed="left" :index="(index) => index + 1 + (queryForm.current - 1) * queryForm.size" label="序号" width="50" />
      <el-table-column label="留样码" prop="itemCode" :show-overflow-tooltip="true" />
      <el-table-column label="检验内容" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="送样部门" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="取样点" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="送样时间" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="收样时间" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="qmsIconfont qms-guanlian" class="role__btn" @click="updateMaterial(scope.row)">
            移动
          </el-button>
          <el-button type="text" icon="iconfont factory-luru" class="role__btn">
            明细
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
import { defineComponent, reactive, ref } from 'vue'

interface TableData{
  id?: string
}
export default defineComponent({
  name: 'SampleStay',
  setup () {
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

    return {
      queryForm,
      tableData,
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
  .SampleStay{
    min-height: calc(100vh - 72px - 72px - 57px);
    background: white;
    margin-top: 10px;
  }
</style>
