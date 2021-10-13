<template>
  <div style="padding: 20px">
    <mds-card class="task-list" title="任务列表" :pack-up="false">
      <template #titleBtn>
        <el-button type="text" size="small" icon="el-icon-arrow-left" @click="$router.go(-1)"> 返回</el-button>
        <el-form :inline="true" size="small" style="float: right;display: flex" @keyup.enter="query" @submit.prevent>
          <el-form-item label="请扫描样品码：">
            <el-input ref="sampleCodeRef" v-model="sampleCode" style="width: 150px" autofocus></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"><i class="qmsIconfont qms-shouyang1" /> 送达</el-button>
          </el-form-item>
        </el-form>
      </template>
      <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark">
        <el-table-column type="index" fixed="left" label="序号" width="50" />
        <el-table-column label="样品码" prop="itemCode" :show-overflow-tooltip="true" />
        <el-table-column label="状态" prop="itemName" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="检验内容" prop="creator" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="送样部门" prop="creator" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="取样人" prop="creator" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="取样时间" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      </el-table>
    </mds-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue'

interface TableData{
  id?: string
  }
export default defineComponent({
  name: 'sampleDelivery',
  setup () {
    const sampleCodeRef = ref()
    const sampleCode = ref('')
    const tableData = ref<TableData[]>([]) // 表格数据

    const query = () => {
      console.log(1)
    }

    onMounted(async () => {
      await nextTick()
      sampleCodeRef.value.focus()
    })

    return {
      sampleCodeRef,
      sampleCode,
      tableData,
      query
    }
  }
})
</script>

<style lang="scss" scoped>
.task-list{
  /deep/.k-box-card-title h3{
    display: none;
  }
}
</style>
