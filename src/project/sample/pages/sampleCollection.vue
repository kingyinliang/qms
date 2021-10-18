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
            <el-button type="primary" @click="collection"><i class="qmsIconfont qms-shouyang" /> 收样</el-button>
          </el-form-item>
        </el-form>
      </template>
      <el-table ref="multipleTableRef" border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45" />
        <el-table-column type="index" fixed="left" label="序号" width="50" />
        <el-table-column label="样品码" prop="itemCode" :show-overflow-tooltip="true" />
        <el-table-column label="状态" prop="itemName" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="检验内容" prop="creator" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="送样部门" prop="creator" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="送达时间" prop="creator" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="取样时间" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      </el-table>
    </mds-card>
  </div>
  <el-dialog v-model="userNameDialog" title="请扫描工牌" width="50%">
    <el-form size="small" @keyup.enter="query" @submit.prevent>
      <el-form-item label="请扫描您的工作证：">
        <el-input ref="userNameRef" v-model="userName" autofocus></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"><i class="qmsIconfont qms-shouyang" @click="collection"/> 收样</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue'

interface TableData{
  id?: string
}
export default defineComponent({
  name: 'sampleCollection',
  setup () {
    const sampleCodeRef = ref()
    const multipleTableRef = ref()
    const userNameRef = ref()
    const userNameDialog = ref(false)
    const sampleCode = ref('')
    const userName = ref('')
    const multipleSelection = ref<TableData[]>([])
    const tableData = ref<TableData[]>([]) // 表格数据

    const query = () => {
      const data = {}
      tableData.value.push(data)
      multipleTableRef.value.toggleRowSelection(data)
    }
    const handleSelectionChange = (val: TableData[]) => {
      multipleSelection.value = val.map((item: TableData) => item)
    }
    const collection = async () => {
      console.log(1)
      userNameDialog.value = true
      await nextTick()
      userNameRef.value.focus()
    }

    onMounted(async () => {
      await nextTick()
      sampleCodeRef.value.focus()
    })

    return {
      sampleCodeRef,
      userNameRef,
      multipleTableRef,
      sampleCode,
      tableData,
      userNameDialog,
      userName,
      handleSelectionChange,
      query,
      collection
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
