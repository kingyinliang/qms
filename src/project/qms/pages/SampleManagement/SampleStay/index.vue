<template>
  <el-card class="box-card">
    <el-form inline :model="queryForm" size="small" label-suffix="：">
      <el-form-item label="样品码">
        <el-input v-model="queryForm.sampleCode" placeholder="请输入" style="width: 140px"></el-input>
      </el-form-item>
      <el-form-item label="送样单位">
        <tree-dialog
          v-model="queryForm.sendDeptArr"
          :tree-data="orgSelect"
          :leafOnly="false"
          :checkStrictly="true"
          :returnObj="true"
          :multiChecked="false"
          :tree-props="{ label: 'deptName', children: 'children' }"
          @update:modelValue="val => queryForm.sendDeptId = val[0] || ''"
        />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="queryForm.receiveDateBegin"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选选择日期"
          style="width: 140px"
        />
        -
        <el-date-picker
          v-model="queryForm.receiveDateEnd"
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
      <el-table-column label="留样码" prop="sampleCode" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="检验内容" prop="inspectContent" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="送样部门" prop="sendDept" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="取样点" prop="sampleSite" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="送样时间" prop="sendDate" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="收样时间" prop="receiveDate" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="qmsIconfont qms-yidong" class="role__btn" @click="moveClick(scope.row, 'add')">
            移动
          </el-button>
          <el-button type="text" icon="iconfont factory-luru" class="role__btn" @click="detailedClick(scope.row)">
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
  <el-dialog v-model="detailedDialog" title="明细" width="50%">
    <el-table border :cell-style="{'text-align':'center'}" :data="detailedTableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" fixed="left" label="序号" width="50" />
      <el-table-column label="移动类型" prop="handleTypeName" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="操作说明" prop="handleExplain" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="操作人" prop="changer" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="操作时间" prop="changed" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="iconfont factory-luru" class="role__btn" @click="moveClick(scope.row, 'update')">
            编辑
          </el-button>
          <el-button style="color: #EF4632" type="text" icon="el-icon-delete" class="role__btn" @click="delDetail(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <el-dialog v-model="moveDialog" title="移动" width="50%">
    <el-form ref="moveFormRef" size="small" :model="moveForm" :rules="rules" label-width="100px">
      <el-form-item label="移动类型：" prop="handleType">
        <el-select v-model="moveForm.handleType" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in moveSelect" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作说明：">
        <el-input v-model="moveForm.handleExplain"></el-input>
      </el-form-item>
      <el-form-item label="操作人：">
        <el-input v-model="moveForm.changer" disabled></el-input>
      </el-form-item>
      <el-form-item label="操作时间：">
        <el-input v-model="moveForm.changed" disabled></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
      <el-button size="small" icon="el-icon-circle-close" @click="moveDialog = false">取消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="moveSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, getCurrentInstance, ComponentInternalInstance, nextTick } from 'vue'
import { dateFormat } from '@/utils'
import {
  ORG_TREE_API,
  DICT_DROPDOWN,
  SAMPLE_STAY_QUERY,
  SAMPLE_STAY_DETAIL_QUERY,
  SAMPLE_STAY_DETAIL_UPDATE,
  SAMPLE_STAY_DETAIL_ADD,
  SAMPLE_STAY_DETAIL_DEL
} from '@/api/api'
import { useStore } from 'vuex'

interface MoveForm{
  id?: string
  sampleKeepId?: string
  handleType?: string
  handleTypeName?: string
  handleExplain?: string
  changed?: string
  changer?: string
}
interface TableData{
  id?: string
}
export default defineComponent({
  name: 'SampleStay',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any

    const store = useStore()
    const userInfo = store.state.common.userInfo

    const moveFormRef = ref()
    const sampleKeepId = ref('')
    const moveDialog = ref(false)
    const detailedDialog = ref(false)
    const orgSelect = ref([])
    const moveSelect = ref([])
    const queryForm = reactive({
      sampleCode: '',
      sendDeptArr: [],
      sendDeptId: '',
      sendDept: '',
      receiveDateBegin: '',
      receiveDateEnd: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据
    const tableData = ref<TableData[]>([]) // 表格数据
    const detailedTableData = ref([])
    const moveForm = ref<MoveForm>({})
    const rules = {
      handleType: [
        { required: true, message: '请选择移动类型', trigger: 'change' }
      ]
    }

    const getSelect = async () => {
      const res = await ORG_TREE_API({ factory: JSON.parse(sessionStorage.getItem('system') || '{}').id || '' })
      orgSelect.value = res.data.data
      const { data } = await DICT_DROPDOWN({ dictType: 'HANDLE_TYPE' })
      moveSelect.value = data.data
    }
    const query = async () => {
      const { data } = await SAMPLE_STAY_QUERY(queryForm)
      tableData.value = data.data.records
      queryForm.size = data.data.size
      queryForm.current = data.data.current
      queryForm.total = data.data.total
    }
    const moveClick = async (row: any, st: string) => {
      moveDialog.value = true
      await nextTick()
      moveFormRef.value.resetFields()
      if (st === 'add') {
        moveForm.value = {
          id: '',
          sampleKeepId: row.id,
          handleType: '',
          handleExplain: '',
          changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          changer: `${userInfo.realName || ''}(${userInfo.userName || ''})`
        }
      } else {
        moveForm.value = { ...row }
      }
    }
    const moveSubmit = async () => {
      moveFormRef.value.validate(async (valid: boolean) => {
        if (!valid) {
          return
        }
        if (moveForm.value.id) {
          await SAMPLE_STAY_DETAIL_UPDATE(moveForm.value)
          getDetail()
        } else {
          await SAMPLE_STAY_DETAIL_ADD(moveForm.value)
        }
        proxy.$successToast('操作成功')
        moveDialog.value = false
      })
    }
    const detailedClick = async (row: any) => {
      sampleKeepId.value = row.id
      await getDetail()
      detailedDialog.value = true
    }
    const getDetail = async () => {
      const { data } = await SAMPLE_STAY_DETAIL_QUERY({ sampleKeepId: sampleKeepId.value })
      detailedTableData.value = data.data
    }
    const delDetail = (row: any) => {
      proxy.$confirm('是否删除此检验类，请确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await SAMPLE_STAY_DETAIL_DEL({ id: row.id })
        proxy.$successToast('操作成功')
        getDetail()
      })
    }

    onMounted(() => {
      getSelect()
      query()
    })

    return {
      moveFormRef,
      rules,
      orgSelect,
      moveSelect,
      queryForm,
      tableData,
      moveDialog,
      detailedTableData,
      detailedDialog,
      moveForm,
      query,
      moveClick,
      moveSubmit,
      delDetail,
      detailedClick
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
    .el-form-item{
      margin-bottom: 0;
    }
  }
  .SampleStay{
    min-height: calc(100vh - 72px - 72px - 57px);
    background: white;
    margin-top: 10px;
  }
</style>
