<template>
  <mds-card class="phaseData" title="品项主数据" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="float: right;">
        <el-input size="small" suffix-icon="el-icon-search" v-model="queryForm.itemCodeOrName" placeholder="品项名称/编码" style="margin-bottom:10px; width:200px; height:35px;margin-right:10px" @keyup.enter="() => { queryForm.current = 1; query() }" />
        <div style="float: right;">
          <el-button icon="el-icon-search" size="small" @click="() => {queryForm.current = 1; query()}">查询</el-button>
          <el-button icon="el-icon-plus" type="primary" @click="addData" size="small">新增</el-button>
        </div>
      </div>
    </template>
    <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" :index="(index) => index + 1 + (queryForm.current - 1) * queryForm.size" label="序号" width="50" />
      <el-table-column label="品项编码" prop="itemCode" :show-overflow-tooltip="true" />
      <el-table-column label="品项名称" prop="itemName" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="创建人员" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" prop="created" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="修改人员" prop="changer" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="修改时间" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="qmsIconfont qms-guanlian" class="role__btn" @click="updateMaterial(scope.row)">
            关联物料
          </el-button>
          <el-button type="text" icon="iconfont factory-luru" class="role__btn" @click="editItem(scope.row)">
            编辑
          </el-button>
          <el-button style="color: #EF4632" type="text" icon="el-icon-delete" class="role__btn" @click="selectDelete(scope.row)">
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
  </mds-card>
  <el-dialog v-model="addOrUpdateDialog" title="品项主数据" width="30%">
    <el-form ref="addOrUpdateRef" :model="addOrUpdateForm" :rules="addOrUpdateFormRule" label-width="120px">
      <el-form-item v-if="addOrUpdateForm.id" label="品项编码：">
        <el-input v-model="addOrUpdateForm.itemCode" disabled autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="品项名称：" prop="itemName">
        <el-input v-model="addOrUpdateForm.itemName" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button size="small" icon="el-icon-circle-close" @click="addOrUpdateDialog = false">取消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="addOrUpdateFormSubmit">确定</el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="materialDialog" title="关联物料" width="536px">
    <el-transfer
      v-if="transfer"
      v-model="itemPhaseData"
      :data="materialData"
      :props="{ key: 'inspectMaterialCode', label: 'inspectMaterialName' }"
      filterable
      :filter-method="filterMethod"
      :titles="['未关联物料', '已关联物料']"
    >
      <template #default="{option}">
        <el-tooltip class="item" effect="dark" :content="`${option.inspectMaterialName} ${option.inspectMaterialCode}`" placement="top-end">
          <span>{{ option.inspectMaterialName }} {{ option.inspectMaterialCode }}</span>
        </el-tooltip>
      </template>
    </el-transfer>
    <div class="dialog-footer" style="margin-top: 10px;">
      <el-button size="small" icon="el-icon-circle-close" @click="materialDialog = false">取消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="updateFormSubmit">确定</el-button>
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
  PHASE_QUERY,
  PHASE_ADD,
  PHASE_UPDATE,
  PHASE_DEL,
  MATERIAL_DROPDOWN
} from '@/api/api'

interface PhaseData {
  id: string;
  itemCode: string;
  itemName: string;
  inspectMaterialCodeLists: string[];
}
const addOrUpdateFormRule = {
  itemName: [
    {
      required: true,
      message: '请输入品项名称',
      trigger: 'blur'
    }
  ]
}

export default defineComponent({
  name: 'PhaseData',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any

    const transfer = ref(false) // 穿梭框
    const addOrUpdateRef = ref() // 新增修改表单节点
    const queryForm = reactive({
      itemCodeOrName: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据
    const tableData = ref<PhaseData[]>([]) // 表格数据
    const addOrUpdateDialog = ref(false) // 新增修改弹窗
    const materialDialog = ref(false) // 关联物流弹窗
    const addOrUpdateForm = ref<PhaseData>({
      id: '',
      itemCode: '',
      itemName: '',
      inspectMaterialCodeLists: []
    }) // 新增修改表单数据
    const materialData = ref([]) // 下拉
    const itemPhaseData = ref<string[]>([]) // 下拉
    let tmp:PhaseData = { id: '', itemCode: '', itemName: '', inspectMaterialCodeLists: [] }

    const query = async () => {
      const res = await PHASE_QUERY(queryForm)
      tableData.value = res.data.data.records
      queryForm.size = res.data.data.size
      queryForm.current = res.data.data.current
      queryForm.total = res.data.data.total
    }
    // 删除确认
    const selectDelete = (row: PhaseData) => {
      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await PHASE_DEL([row.id])
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
        itemCode: '',
        itemName: '',
        inspectMaterialCodeLists: []
      }
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
          if (addOrUpdateForm.value.id) {
            await PHASE_UPDATE(addOrUpdateForm.value)
          } else {
            await PHASE_ADD(addOrUpdateForm.value)
          }
          proxy.$successToast('操作成功')
          addOrUpdateDialog.value = false
          await query()
        }
      })
    }
    const filterMethod = (query:string, item:any) => {
      return item.inspectMaterialName.indexOf(query) > -1 || item.inspectMaterialCode.indexOf(query) > -1
    }
    // 关联物料弹窗
    const updateMaterial = async (row: PhaseData) => {
      tmp = { ...row }
      itemPhaseData.value = row.inspectMaterialCodeLists
      await getMaterial()
      materialDialog.value = true
      await nextTick()
      transfer.value = false
      await nextTick()
      transfer.value = true
    }
    const updateFormSubmit = async () => {
      tmp.inspectMaterialCodeLists = itemPhaseData.value
      await PHASE_UPDATE(tmp)
      proxy.$successToast('操作成功')
      materialDialog.value = false
      await query()
      await getMaterial()
    }
    const getMaterial = async () => {
      const res = await MATERIAL_DROPDOWN()
      res.data.data.forEach((item: any) => {
        if (item.inspectItemId) {
          if (itemPhaseData.value.filter((it: any) => it === item.inspectMaterialCode).length) {
            item.disabled = false
          } else {
            item.disabled = true
          }
        } else {
          item.disabled = false
        }
      })
      materialData.value = res.data.data
    }

    onMounted(() => {
      query()
    })

    return {
      transfer,
      addOrUpdateRef,
      queryForm,
      tableData,
      addOrUpdateDialog,
      materialDialog,
      addOrUpdateForm,
      addOrUpdateFormRule,
      materialData,
      itemPhaseData,
      query,
      addData,
      selectDelete,
      editItem,
      filterMethod,
      updateMaterial,
      addOrUpdateFormSubmit,
      updateFormSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
  .phaseData{
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
