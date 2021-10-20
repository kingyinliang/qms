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
            <el-button type="primary" @click="delivery"><i class="qmsIconfont qms-shouyang1"/> 送达</el-button>
          </el-form-item>
        </el-form>
      </template>
      <el-table ref="multipleTableRef" border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45" />
        <el-table-column type="index" fixed="left" label="序号" width="50" />
        <el-table-column label="样品码" prop="sampleCode" :show-overflow-tooltip="true" />
        <el-table-column label="状态" prop="taskStatus" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="检验内容" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="送样部门" prop="sendSampleDeptName" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="取样人" prop="sampler" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="取样时间" prop="sampleEndDate" min-width="150" :show-overflow-tooltip="true" />
      </el-table>
    </mds-card>
  </div>
  <el-dialog v-model="userNameDialog" title="请扫描工牌" width="50%">
    <el-form size="small" @keyup.enter="deliverySubmit" @submit.prevent>
      <el-form-item label="请扫描您的工作证：">
        <el-input ref="userNameRef" v-model="userName" autofocus></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"><i class="qmsIconfont qms-shouyang" @click="deliverySubmit"/> 收样</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { ComponentInternalInstance, defineComponent, getCurrentInstance, nextTick, onMounted, ref } from 'vue'
import { SAMPLE_HANDOVER_QUERY, SAMPLE_HANDOVER_DELIVERY } from '@/api/api'

interface TableData{
  id?: string
  }
export default defineComponent({
  name: 'sampleDelivery',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any

    const sampleCodeRef = ref()
    const multipleTableRef = ref()
    const userNameRef = ref()
    const userNameDialog = ref(false)
    const sampleCode = ref('')
    const userName = ref('')
    const multipleSelection = ref<TableData[]>([])
    const tableData = ref<TableData[]>([]) // 表格数据

    const query = async () => {
      const { data } = await SAMPLE_HANDOVER_QUERY({ sampleCode: sampleCode.value })
      console.log(data)
      if (data.data.taskStatus === '取样中') {
        tableData.value.push(data.data)
        multipleTableRef.value.toggleRowSelection(data.data)
      } else {
        proxy.$errorToast('该样品码不否存或不是已送达状态')
      }
    }
    const handleSelectionChange = (val: TableData[]) => {
      multipleSelection.value = val.map((item: TableData) => item)
    }
    const delivery = async () => {
      if (multipleSelection.value.length) {
        userNameDialog.value = true
        await nextTick()
        userNameRef.value.focus()
      } else {
        proxy.$warningToast('请选择数据')
      }
    }
    const deliverySubmit = async () => {
      await SAMPLE_HANDOVER_DELIVERY({
        taskSamples: multipleSelection.value,
        taskStatus: '已送达',
        changer: userName.value
      })
      proxy.$successToast('操作成功')
      userNameDialog.value = false
      multipleSelection.value.forEach(item => {
        tableData.value = tableData.value.filter(it => it.id !== item.id)
      })
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
      delivery,
      deliverySubmit
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
