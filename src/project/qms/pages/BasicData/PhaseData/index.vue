<template>
  <mds-card class="phaseData" title="品项主数据" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="float: right;">
        <el-form :model="queryForm" class="queryForm" size="small" :inline="true" label-position="right" label-width="82px" style=" float: left;">
          <el-form-item label="">
            <el-input suffix-icon="el-icon-search" v-model="queryForm.inspectMethodCodeOrName" placeholder="名称" style="width: 160px;" />
          </el-form-item>
        </el-form>
        <div style="float: right;">
          <el-button icon="el-icon-search" size="small" @click="query">查询</el-button>
          <el-button icon="el-icon-circle-check" type="primary" @click="addData" size="small">新增</el-button>
<!--          <el-button icon="el-icon-delete" type="danger" size="small" @click="selectDelete">批量删除</el-button>-->
        </div>
      </div>
    </template>
    <el-table ref="multipleTable" :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="品项编码" prop="inspectMethodCode" />
      <el-table-column label="品项名称" prop="inspectMethodName" />
      <el-table-column label="创建人员" prop="inspectMethodName" />
      <el-table-column label="创建时间" prop="inspectMethodName" />
      <el-table-column label="修改人员" prop="inspectMethodName" />
      <el-table-column label="修改时间" prop="inspectMethodName" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="updateMaterial(scope.row)">
            关联物料
          </el-button>
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="editItem(scope.row)">
            编辑
          </el-button>
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="selectDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </mds-card>
  <el-dialog v-model="addOrUpdateDialog" title="品项主数据" width="30%">
    <el-form ref="addOrUpdateRef" :model="addOrUpdateForm" :rules="addOrUpdateFormRule" label-width="120px">
      <el-form-item label="品项编码：" prop="itemCode">
        <el-input v-model="addOrUpdateForm.itemCode" :disabled="true" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="品项名称：" prop="itemName">
        <el-input v-model="addOrUpdateForm.itemName" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button size="small" icon="el-icon-circle-close" @click="addOrUpdateDialog = false">取 消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="addOrUpdateFormSubmit">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="materialDialog" title="关联物料" width="536px">
    <el-transfer
      v-model="itemPhaseData"
      :data="phaseData"
      filterable
      :titles="['未关联物料', '已关联物料']"
    />
  </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  nextTick,
  onMounted,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'
import {
  DICT_DROPDOWN,
  Dict
} from '@/api/api'

interface PhaseData {
  id: string;
  itemCode: string;
  itemName: string;
}
const addOrUpdateFormRule = {
  itemCode: [
    {
      required: true,
      message: '编码自动带出',
      trigger: 'blur'
    }
  ],
  itemName: [
    {
      required: true,
      message: '请输入品项名称',
      trigger: 'blur'
    }
  ]
}

export default defineComponent({
  name: 'index',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any

    const addOrUpdateRef = ref() // 新增修改表单节点
    const queryForm = reactive({}) // 查询表单数据
    const tableData = ref<PhaseData[]>([{ id: '0', itemCode: '0002', itemName: 'aaa' }]) // 表格数据
    const multipleSelection = ref<string[]>([]) // 复选数据
    const addOrUpdateDialog = ref(false) // 新增修改弹窗
    const materialDialog = ref(false) // 关联物流弹窗
    const addOrUpdateForm = ref<PhaseData>() // 新增修改表单数据
    const calculateUnit = ref<Dict[]>([]) // 下拉
    const itemPhaseData = ref([]) // 下拉
    const phaseData = ref([]) // 下拉

    const query = () => {
      //  a
    }
    // 表格复选
    const handleSelectionChange = (val:PhaseData[]) => {
      multipleSelection.value = val.map((item: PhaseData) => item.id)
    }
    // 删除确认
    const selectDelete = () => {
      if (!multipleSelection.value.length) {
        proxy.$warningToast('请选择数据')
        return
      }
      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        //  a
      })
    }
    // 新增
    const addData = async () => {
      let cycleCode = 0
      if (tableData.value.length) {
        cycleCode = tableData.value.reduce((previousValue: number, currentValue: PhaseData) => {
          const currentCode = Number(currentValue.itemCode)
          return previousValue < currentCode ? currentCode : previousValue
        }, 0)
      }
      cycleCode++
      let itemCode = ''
      if (String(cycleCode).length > 3) itemCode = String(cycleCode)
      itemCode = ('0000' + cycleCode).slice(-4)
      addOrUpdateForm.value = {
        id: '',
        itemCode,
        itemName: ''
      }
      addOrUpdateDialog.value = true
      await nextTick()
      addOrUpdateRef.value.resetFields()
      // addOrUpdateRef.value.clearValidate()
    }
    // 修改
    const editItem = async (row: PhaseData) => {
      addOrUpdateForm.value = { ...row }
      addOrUpdateDialog.value = true
      await nextTick()
      addOrUpdateRef.value.clearValidate()
    }
    // 新增修改确认
    const addOrUpdateFormSubmit = () => {
      addOrUpdateRef.value.validate(async (valid: boolean) => {
        if (valid) {
          //  a
        }
      })
    }
    const updateMaterial = (row: PhaseData) => {
      materialDialog.value = true
    }

    onMounted(async () => {
      query()
      const res = await DICT_DROPDOWN({ dictType: 'inspect_property' })
      calculateUnit.value = res.data.data
    })

    return {
      addOrUpdateRef,
      queryForm,
      tableData,
      addOrUpdateDialog,
      materialDialog,
      addOrUpdateForm,
      addOrUpdateFormRule,
      calculateUnit,
      itemPhaseData,
      phaseData,
      query,
      addData,
      selectDelete,
      handleSelectionChange,
      editItem,
      updateMaterial,
      addOrUpdateFormSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
  .phaseData{
    height: calc(100vh - 117px);
  }
  .el-form /deep/.inputWidth {
    width: 100%;
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
  .flex{
    display: flex;
    margin-bottom: 4px;
  }
</style>
