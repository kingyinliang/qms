<template>
  <mds-card class="time_unit" title="时间单位" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="float: right;">
        <el-input size="small" style="margin-bottom:10px; width:200px; height:35px;margin-right:10px" suffix-icon="el-icon-search" v-model="queryForm.cycleCodeOrName" placeholder="时间单位/编码" @keyup.enter="() => {queryForm.current = 1; query()}" />
        <div style="float: right;">
          <el-button icon="el-icon-search" size="small" @click="() => {queryForm.current = 1; query()}">查询</el-button>
          <el-button icon="el-icon-plus" type="primary" @click="addData" size="small">新增</el-button>
          <el-button icon="el-icon-delete" type="danger" size="small" @click="selectDelete">批量删除</el-button>
        </div>
      </div>
    </template>
    <el-table ref="multipleTable" border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" :index="(index) => index + 1 + (queryForm.current - 1) * queryForm.size" width="50" />
      <el-table-column label="编码" prop="cycleCode" />
      <el-table-column label="时间单位" prop="dateUnit" />
      <el-table-column label="计算单位" prop="calculateUnit" />
      <el-table-column label="计算开始" prop="calculateStart">
        <template #default="scope">
          {{ scope.row.calculateStart }}
        </template>
      </el-table-column>
      <el-table-column label="时间长度" prop="dateDelay" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="iconfont factory-luru" class="role__btn" @click="editItem(scope.row)">
            编辑
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
  <el-dialog v-model="addOrUpdateDialog" title="时间单位" width="30%">
    <el-form ref="addOrUpdateRef" :model="addOrUpdateForm" :rules="addOrUpdateFormRule" label-width="120px">
      <el-form-item v-if="addOrUpdateForm.id" label="编码：">
        <el-input v-model="addOrUpdateForm.cycleCode" :disabled="true" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="时间单位：" prop="dateUnit">
        <el-input v-model="addOrUpdateForm.dateUnit" maxlength="10" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="计算单位：" prop="calculateUnit">
        <el-select v-model="addOrUpdateForm.calculateUnit" class="inputWidth" placeholder="请选择" @change="addOrUpdateForm.calculateStarts = ['']">
          <el-option v-for="item in calculateUnit" :key="item.dictCode" :label="item.dictValue" :value="item.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间：" prop="calculateStarts">
        <div class="flex" v-for="(item, index) in addOrUpdateForm.calculateStarts" :key="index">
          <el-date-picker
            v-if="addOrUpdateForm.calculateUnit==='月'"
            v-model="addOrUpdateForm.calculateStarts[index]"
            class="inputWidth"
            popper-class="noneHeader"
            type="month"
            value-format="MM"
            format="MM"
          />
          <el-select
            v-if="addOrUpdateForm.calculateUnit==='周'"
            v-model="addOrUpdateForm.calculateStarts[index]"
            class="inputWidth"
          >
            <el-option label="周一" value="周一"/>
            <el-option label="周二" value="周二"/>
            <el-option label="周三" value="周三"/>
            <el-option label="周四" value="周四"/>
            <el-option label="周五" value="周五"/>
            <el-option label="周六" value="周六"/>
            <el-option label="周日" value="周日"/>
          </el-select>
          <el-date-picker
            v-if="addOrUpdateForm.calculateUnit==='天'"
            v-model="addOrUpdateForm.calculateStarts[index]"
            class="inputWidth"
            popper-class="noneHeader"
            type="date"
            value-format="DD"
            format="DD"
          />
          <el-time-select
            v-if="addOrUpdateForm.calculateUnit==='小时'"
            v-model="addOrUpdateForm.calculateStarts[index]"
            class="inputWidth"
            start='00:00'
            end='24:00'
            step='01:00'
          />
          <el-button icon="el-icon-plus" v-if="index === 0" :disabled="!addOrUpdateForm.calculateUnit" size="small" @click="() => addOrUpdateForm.calculateStarts.push('')" />
          <el-button type="danger" icon="el-icon-delete" v-if="index !== 0" size="small" @click="() => addOrUpdateForm.calculateStarts.splice(index, 1)" />
        </div>
      </el-form-item>
      <el-form-item label="时间长度：" prop="dateDelay">
        <el-input v-model="addOrUpdateForm.dateDelay" maxlength='2' @input="e => addOrUpdateForm.dateDelay = e.replace(/[^0-9]/gi, '')" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button size="small" icon="el-icon-circle-close" @click="addOrUpdateDialog = false">取消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="addOrUpdateFormSubmit">确定</el-button>
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
  TIME_QUERY,
  TIME_ADD,
  TIME_UPDATE,
  TIME_DEL,
  DICT_DROPDOWN,
  Dict
} from '@/api/api'

interface TimeData {
  id: string;
  cycleCode: string;
  dateUnit: string;
  calculateUnit: string;
  calculateUnitName: string;
  calculateStarts: string[];
  dateDelay: string;
}
const addOrUpdateFormRule = {
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
  calculateStarts: [
    {
      required: true,
      message: '请输入开始时间',
      trigger: 'blur'
    },
    {
      trigger: 'blur',
      validator: (rule: string, value: string[], callback: (ctx?: Error) => void) => {
        if (!value.length) {
          return callback(new Error('请输入开始时间'))
        }
        return callback()
      }
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
  name: 'TimeUnit',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any

    const addOrUpdateRef = ref() // 新增修改表单节点
    const queryForm = reactive({
      cycleCodeOrName: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据
    const a = ref('')
    const tableData = ref<TimeData[]>([]) // 表格数据
    const multipleSelection = ref<string[]>([]) // 复选数据
    const addOrUpdateDialog = ref(false) // 新增修改弹窗
    const addOrUpdateForm = ref<TimeData>({
      id: '',
      cycleCode: '',
      dateUnit: '',
      calculateUnit: '',
      calculateUnitName: '',
      calculateStarts: [''],
      dateDelay: ''
    }) // 新增修改表单数据
    const calculateUnit = ref<Dict[]>([]) // 下拉

    const query = async () => {
      const res = await TIME_QUERY(queryForm)
      tableData.value = res.data.data.records
      queryForm.size = res.data.data.size
      queryForm.current = res.data.data.current
      queryForm.total = res.data.data.total
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
        await TIME_DEL(multipleSelection.value)
        proxy.$successToast('操作成功')
        await query()
      })
    }
    // 新增
    const addData = async () => {
      addOrUpdateDialog.value = true
      await nextTick()
      addOrUpdateRef.value.resetFields()
      addOrUpdateForm.value = {
        id: '',
        cycleCode: '',
        dateUnit: '',
        calculateUnit: '',
        calculateUnitName: '',
        calculateStarts: [''],
        dateDelay: ''
      }
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
        if (!addOrUpdateForm.value.calculateStarts.length) {
          proxy.$warningToast('请输入开始时间')
          return
        }
        for (const item of addOrUpdateForm.value.calculateStarts) {
          if (!item) {
            proxy.$warningToast('请输入开始时间')
            return
          }
        }
        const arr = addOrUpdateForm.value.calculateStarts
        const newArr = [...new Set(arr)]
        if (arr.length !== newArr.length) {
          proxy.$warningToast('开始时间不可重复')
          return
        }
        if (valid) {
          const form: any = { ...addOrUpdateForm.value }
          // form.calculateStart = form.calculateStart.join(',')
          if (form.id) {
            await TIME_UPDATE(form)
          } else {
            await TIME_ADD(form)
          }
          proxy.$successToast('操作成功')
          addOrUpdateDialog.value = false
          await query()
        }
      })
    }
    const calculateUnitChange = (val: string) => {
      (addOrUpdateForm.value as TimeData).calculateStarts = [''];
      (addOrUpdateForm.value as TimeData).calculateUnitName = (calculateUnit.value.find(it => it.dictCode === val) as Dict).dictValue
    }
    const getA = () => {
      console.log(a.value)
    }

    onMounted(async () => {
      query()
      const res = await DICT_DROPDOWN({ dictType: 'TIME_UNIT' })
      calculateUnit.value = res.data.data
    })

    return {
      a,
      getA,
      addOrUpdateRef,
      queryForm,
      tableData,
      addOrUpdateDialog,
      addOrUpdateForm,
      addOrUpdateFormRule,
      calculateUnit,
      query,
      addData,
      calculateUnitChange,
      selectDelete,
      handleSelectionChange,
      editItem,
      addOrUpdateFormSubmit
    }
  }
})
</script>

<style lang="scss">
  .noneHeader .el-date-picker__header{
    display: none;
  }
</style>
<style lang="scss" scoped>
  .time_unit{
    min-height: calc(100vh - 117px);
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
