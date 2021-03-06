<template>
  <mds-card class="task-list" title="任务列表" :pack-up="false">
    <template #titleBtn>
      <el-button type="text" size="small" icon="el-icon-arrow-left" @click="$router.go(-1)"> 返回</el-button>
      <el-form :inline="true" size="small" style="float: right;display: flex" @keyup.enter="query" @submit.prevent>
        <el-form-item label="请扫描样品码：">
          <el-input ref="sampleCodeRef" v-model="sampleCode" placeholder="请扫描/输入" style="width: 150px" autofocus></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="collection"><i class="qmsIconfont qms-shouyang" /> 收样</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table ref="multipleTableRef" border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" />
      <el-table-column type="index" fixed="left" label="序号" width="50" />
      <el-table-column label="样品码" prop="sampleCode" :show-overflow-tooltip="true" />
      <el-table-column label="状态" prop="taskStatusName" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="检验内容" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="取样部门" prop="sampleDeptName" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="取样时间" prop="sampleEndDate" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="送达时间" prop="deliveryDate" min-width="150" :show-overflow-tooltip="true" />
    </el-table>
  </mds-card>
  <el-dialog v-model="userNameDialog" title="请扫描工牌" width="50%">
    <el-form size="small" @keyup.enter="collectionSubmit" @submit.prevent>
      <el-form-item label="请扫描您的工作证：">
        <el-input ref="userNameRef" v-model="userName" autofocus></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
      <el-button size="small" type="primary" @click="collectionSubmit"><i class="qmsIconfont qms-shouyang" /> 收样</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { ComponentInternalInstance, defineComponent, getCurrentInstance, nextTick, onMounted, ref } from 'vue'
import { SAMPLE_HANDOVER_QUERY, SAMPLE_HANDOVER_COLLECTION } from '@/api/api'
import { useStore } from 'vuex'

interface TableData{
  id?: string
}
export default defineComponent({
  name: 'sampleCollection',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const store = useStore()
    const userInfo = store.state.common.userInfo

    const sampleCodeRef = ref()
    const multipleTableRef = ref()
    const userNameRef = ref()
    const userNameDialog = ref(false)
    const sampleCode = ref('')
    const userName = ref('')
    const multipleSelection = ref<TableData[]>([])
    const tableData = ref<TableData[]>([]) // 表格数据

    const query = async () => {
      sampleCodeRef.value.input.select()
      document.execCommand('Copy')
      const { data } = await SAMPLE_HANDOVER_QUERY({ sampleCode: sampleCode.value })
      if (!data.data) {
        proxy.$errorToast('该样品码不存在')
      } else if (tableData.value.filter((it:any) => it.sampleCode === data.data.sampleCode).length) {
        proxy.$errorToast('该样品码已在表格内')
      } else if (data.data.taskStatus === 'ARRIVED') {
        tableData.value.push(data.data)
        multipleTableRef.value.toggleRowSelection(data.data)
      } else {
        proxy.$errorToast('该样品码不是已送达状态')
      }
    }
    const handleSelectionChange = (val: TableData[]) => {
      multipleSelection.value = val.map((item: TableData) => item)
    }
    const collection = async () => {
      const href = proxy.$route.href
      if (multipleSelection.value.length) {
        if (/qms/.test(href)) {
          userName.value = `${userInfo.realName || ''}(${userInfo.userName || ''})`
          collectionSubmit()
        } else {
          userNameDialog.value = true
          userName.value = ''
          await nextTick()
          userNameRef.value.focus()
        }
      } else {
        proxy.$warningToast('请选择数据')
      }
    }
    const collectionSubmit = async () => {
      if (!userName.value) {
        proxy.$warningToast('请扫描工牌')
        return
      }
      await SAMPLE_HANDOVER_COLLECTION({
        taskSamples: multipleSelection.value,
        taskStatus: 'RECEIVED',
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
      collection,
      collectionSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.task-list{
  background: white;
  /deep/.k-box-card-title h3{
    display: none;
  }
}
</style>
