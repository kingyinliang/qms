<template>
  <mds-card class="time_unit" title="时间单位" :pack-up="false" style="margin-bottom: 0; background: #fff;">
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
          <el-button icon="el-icon-delete" type="danger" size="small" @click="selectDelete">批量删除</el-button>
        </div>
      </div>
    </template>
    <el-table ref="multipleTable" :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="编码" prop="inspectMethodCode" />
      <el-table-column label="时间单位" prop="inspectMethodName" />
      <el-table-column label="计算单位" prop="inspectPropertyName" />
      <el-table-column label="计算开始" prop="inspectPropertyName" />
      <el-table-column label="时间长度" prop="inspectPropertyName" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="editItem(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </mds-card>
  <el-dialog v-model="addOrUpdateDialog" title="时间单位" width="30%">
    <el-form ref="addOrUpdateRef" :model="addOrUpdateForm" :rules="addOrUpdateFormRule" label-width="120px">
      <el-form-item label="编码：" prop="cycleCode">
        <el-input v-model="addOrUpdateForm.cycleCode" :disabled="true" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="时间单位：" prop="dateUnit">
        <el-input v-model="addOrUpdateForm.dateUnit" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="计算单位：" prop="calculateUnit">
        <el-select v-model="addOrUpdateForm.calculateUnit" class="inputWidth" placeholder="请选择" @change="val => addOrUpdateForm.calculateUnit = addOrUpdateForm.find(it => it.dictCode === val).dictValue">
          <el-option v-for="item in calculateUnit" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间：" prop="calculateStart">
        <div class="flex" v-for="(item, index) in addOrUpdateForm.calculateStart" :key="index">
          <el-date-picker v-model="addOrUpdateForm.calculateStart[index]" class="inputWidth" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" />
          <el-button v-if="index + 1 === addOrUpdateForm.calculateStart.length" size="small" @click="() => addOrUpdateForm.calculateStart.push('')">+</el-button>
        </div>
      </el-form-item>
      <el-form-item label="时间长度：" prop="dateDelay">
        <el-input v-model="addOrUpdateForm.dateDelay" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button size="small" icon="el-icon-circle-close" @click="addOrUpdateDialog = false">取 消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="addOrUpdateFormSubmit">确 定</el-button>
    </div>
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

interface TimeData {
  id: string;
  cycleCode: string;
  dateUnit: string;
  calculateUnit: string;
  calculateStart: string[];
  dateDelay: string;
}
const addOrUpdateFormRule = {
  cycleCode: [
    {
      required: true,
      message: '编码自动带出',
      trigger: 'blur'
    }
  ],
  dateUnit: [
    {
      required: true,
      message: '请输入时间单位',
      trigger: 'blur'
    }
  ],
  calculateUnit: [
    {
      required: true,
      message: '请输入计算单位',
      trigger: 'blur'
    }
  ],
  calculateStart: [
    {
      required: true,
      message: '请输入开始时间',
      trigger: 'blur'
    }
  ],
  dateDelay: [
    {
      required: true,
      message: '请输入时间长度',
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
    const tableData = ref<TimeData[]>([]) // 表格数据
    const multipleSelection = ref<string[]>([]) // 复选数据
    const addOrUpdateDialog = ref(false) // 新增修改弹窗
    const addOrUpdateForm = ref<TimeData>() // 新增修改表单数据
    const calculateUnit = ref<Dict[]>([]) // 下拉

    const query = () => {
    //  a
    }
    // 表格复选
    const handleSelectionChange = (val:TimeData[]) => {
      multipleSelection.value = val.map((item: TimeData) => item.id)
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
        cycleCode = tableData.value.reduce((previousValue: number, currentValue: TimeData) => {
          const currentCode = Number(currentValue.cycleCode.replace(/T/g, ''))
          return previousValue < currentCode ? currentCode : previousValue
        }, 0)
      }
      cycleCode++
      addOrUpdateForm.value = {
        id: '',
        cycleCode: `T${cycleCode < 10 ? '0' + cycleCode : cycleCode}`,
        dateUnit: '',
        calculateUnit: '',
        calculateStart: [''],
        dateDelay: ''
      }
      addOrUpdateDialog.value = true
      await nextTick()
      addOrUpdateRef.value.resetFields()
      // addOrUpdateRef.value.clearValidate()
    }
    // 修改
    const editItem = async (row: TimeData) => {
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
      addOrUpdateForm,
      addOrUpdateFormRule,
      calculateUnit,
      query,
      addData,
      selectDelete,
      handleSelectionChange,
      editItem,
      addOrUpdateFormSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
  .time_unit{
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
