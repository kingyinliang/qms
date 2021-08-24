<template>
  <mds-card class="inspectionPoint" title="检验点维护" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="float: right;">
        <el-form :model="queryForm" class="queryForm" size="small" :inline="true" label-position="right" label-width="82px" style=" float: left;">
          <el-form-item label="">
            <el-input suffix-icon="el-icon-search" v-model="queryForm.deptName" placeholder="生产车间" style="width: 160px;" />
          </el-form-item>
        </el-form>
        <div style="float: right;">
          <el-button icon="el-icon-search" size="small" @click="() => {queryForm.current = 1; query()}">查询</el-button>
          <el-button icon="el-icon-circle-check" type="primary" @click="addData" size="small">新增</el-button>
          <el-button icon="el-icon-delete" type="danger" size="small" @click="selectDelete">批量删除</el-button>
        </div>
      </div>
    </template>
    <el-table ref="multipleTable" border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="生产车间" prop="deptName" />
      <el-table-column label="检验点" prop="siteName" />
      <el-table-column label="建立部门" prop="createDept" />
      <el-table-column label="操作人员" prop="createMan" />
      <el-table-column label="操作时间" prop="createDate" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="editItem(scope.row)">
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
        @size-change="val => {queryForm.size = val;query}"
        @current-change="val => {queryForm.current = val; query}"
      />
    </el-row>
  </mds-card>
  <el-dialog v-model="addOrUpdateDialog" title="检验点维护" width="30%">
    <el-form ref="addOrUpdateRef" :model="addOrUpdateForm" :rules="addOrUpdateFormRule" label-width="120px">
      <el-form-item label="生产车间：" prop="deptId">
        <el-select v-model="addOrUpdateForm.deptId" class="inputWidth" placeholder="请选择" @change="val => addOrUpdateForm.deptName = org.find(it => it.id === val).deptName">
          <el-option v-for="item in org" :key="item.id" :label="item.deptName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="检验点：" prop="siteName">
        <el-input v-model="addOrUpdateForm.siteName" autocomplete="off"></el-input>
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
  DEPT_QUERY_API,
  POINT_QUERY,
  POINT_ADD,
  POINT_UPDATE,
  POINT_DEL
} from '@/api/api'

interface PointData {
  id: string;
  deptId: string;
  deptName: string;
  siteName: string;
}
const addOrUpdateFormRule = {
  deptId: [
    {
      required: true,
      message: '请选择生产车间',
      trigger: 'blur'
    }
  ],
  siteName: [
    {
      required: true,
      message: '请输入检验点',
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
    const queryForm = reactive({
      deptName: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据
    const tableData = ref<PointData[]>([]) // 表格数据
    const multipleSelection = ref<string[]>([]) // 复选数据
    const addOrUpdateDialog = ref(false) // 新增修改弹窗
    const addOrUpdateForm = ref<PointData>({
      id: '',
      deptId: '',
      deptName: '',
      siteName: ''
    }) // 新增修改表单数据
    const org = ref([])

    const query = async () => {
      const res = await POINT_QUERY(queryForm)
      tableData.value = res.data.data.records
      queryForm.size = res.data.data.size
      queryForm.current = res.data.data.current
      queryForm.total = res.data.data.total
    }
    // 表格复选
    const handleSelectionChange = (val:PointData[]) => {
      multipleSelection.value = val.map((item: PointData) => item.id)
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
        await POINT_DEL(multipleSelection.value)
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
        deptId: '',
        deptName: '',
        siteName: ''
      }
    }
    // 修改
    const editItem = async (row: PointData) => {
      addOrUpdateForm.value = { ...row }
      addOrUpdateDialog.value = true
      await nextTick()
      addOrUpdateRef.value.clearValidate()
    }
    // 新增修改确认
    const addOrUpdateFormSubmit = () => {
      addOrUpdateRef.value.validate(async (valid: boolean) => {
        if (valid) {
          if (addOrUpdateForm.value.id) {
            await POINT_UPDATE(addOrUpdateForm.value)
          } else {
            await POINT_ADD(addOrUpdateForm.value)
          }
          proxy.$successToast('操作成功')
          addOrUpdateDialog.value = false
          await query()
        }
      })
    }

    onMounted(async () => {
      query()
      const res = await DEPT_QUERY_API({ factory: JSON.parse(sessionStorage.getItem('system') || '{}').id || '', deptType: ['WORK_SHOP'] })
      org.value = res.data.data
    })

    return {
      addOrUpdateRef,
      queryForm,
      tableData,
      addOrUpdateDialog,
      addOrUpdateForm,
      addOrUpdateFormRule,
      org,
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
  .inspectionPoint{
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
