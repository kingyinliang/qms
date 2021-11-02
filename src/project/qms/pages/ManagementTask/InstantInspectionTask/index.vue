<template>
  <mds-card class="test_method" title="临时检验任务" :pack-up="false" style="margin-bottom: 0; background: #fff; overflow:scroll">
    <template #titleBtn>
      <div style="display: flex; justify-content: flex-end;">
        <div><span style="font-size:12px;padding-left: 10px;">检验单：</span>
          <el-input size="small" style="margin-bottom:10px; width:200px; height:35px;margin-right:10px" clearable @keydown.enter="btnGetTopicMainData('init')"  v-model="searchFilter.tempApplyNo" placeholder="请输入" />
        </div>
        <div><span style="font-size:12px;padding-left: 10px;">检验内容：</span>
          <el-input size="small" style="margin-bottom:10px; width:200px; height:35px;margin-right:10px" clearable @keydown.enter="btnGetTopicMainData('init')"  v-model="searchFilter.inspectContent" placeholder="请输入" />
        </div>
        <div>
          <span style="font-size:12px;padding-left: 10px;">状态：</span>
          <el-select v-model="searchFilter.applyStatus" placeholder="请选择" size="small" style="width:100px" clearable>
            <el-option
              v-for="item in applyStatusOptions"
              :key="item.dictCode"
              :label="item.dictValue"
              :value="item.dictCode"
            >
            </el-option>
          </el-select>
        </div>
        <div style="font-size:12px;padding-left: 10px;">
          <el-button icon="el-icon-search" size="small" class="topic-button" @click="btnGetTopicMainData('init')">查询</el-button>
          <el-button icon="el-icon-plus" type="primary" class="topic-button" size="small" @click="btnAddItemOfTopicMainData">新增</el-button>        </div>
      </div>
    </template>
    <el-table border ref="refTableOfTopicMain" :cell-style="{'text-align':'center'}" :data="dataTableOfTopicMain" tooltip-effect="dark" style="width: 100%" max-height="500">
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column label="检验单" show-overflow-tooltip prop="tempApplyNo" >
        <template #default="scope">
         <el-button type="text" class="role__btn" @click="btnConfigulationReadOnly(scope.row)">
            <em>{{scope.row.tempApplyNo}}</em>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" show-overflow-tooltip prop="applyStatus">
      <template #default="scope">
        <span>{{applyStatusNameObj[scope.row.applyStatus]}}</span>
      </template>
      </el-table-column>
      <el-table-column label="检验内容" show-overflow-tooltip prop="inspectContent" />
      <el-table-column label="取样单位" show-overflow-tooltip prop="sampleDeptName" />
      <el-table-column label="检验单位" show-overflow-tooltip prop="inspectDeptName" />
      <el-table-column label="发布人" show-overflow-tooltip prop="deployMan" />
      <el-table-column label="发布时间" show-overflow-tooltip prop="deployDate" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="btnEditItemOfTopicMainData(scope.row)" :disabled="scope.row.applyStatus!=='SAVED'">
            <em>编辑</em>
          </el-button>
          <el-button type="text" icon="el-icon-delete" class="delete-btn" @click="btnDeleteItemData(scope.row)" :disabled="scope.row.applyStatus!=='SAVED'">
            <em>删除</em>
          </el-button>
          <el-button type="text" icon="el-icon-finished" class="role__btn" @click="btnConfigulation(scope.row)" :disabled="(scope.row.applyStatus==='SAMPLING' || scope.row.applyStatus==='UNSAMPLED' || scope.row.applyStatus==='ARRIVED' || scope.row.applyStatus==='RECEIVED')&&scope.row.processFlag==='Y' ">
           <!-- <el-button type="text" icon="el-icon-finished" class="role__btn" @click="btnConfigulation(scope.row)" > -->
            <em>处理</em>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end;">
      <el-pagination
        :page-size="pageSize"
        :current-page="currentPage"
        :total="totalItems"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleChangeDataSize"
        @current-change="handleChangeCurrentPage"
      />
    </div>
  </mds-card>

</template>

<script lang="ts">
import {
  defineComponent, ref, toRefs, reactive, onMounted, ComponentInternalInstance, getCurrentInstance, onUpdated
} from 'vue'
import MdsCard from '@/components/package/mds-card/src/mds-card.vue'
import { useRouter } from 'vue-router'
import {
  MANAGEMENT_PROCESS_INSPECTION_TASK_STATUS_QUERY_API, // 查询
  MANAGEMENT_PROCESS_INSPECTION_TASK_STATUS_DELETE_API, // 删除
  DICTIONARY_QUERY_API
} from '@/api/api'
import layoutTs from '@/components/layout/layoutTs'
import { useStore } from 'vuex'

interface TopicMainData {
  applyStatus: string
  deployDate: string
  deployMan: string
  handleExplain: string
  id: string
  inspectContent: string
  inspectDeptId: string
  inspectDeptName: string
  needDeptCode: string
  needDeptId: string
  needDeptName: string
  processFlag: string
  sampleDeptId: string
  sampleDeptName: string
  tempApplyNo: string
}

interface SearchFilter{
  tempApplyNo: string
  inspectContent: string
  applyStatus: string
}

// interface Props {}

interface DictOptions{
  dictCode: string
  dictId: string
  dictValue: string
}

interface State {
  currentInspectScene: string
  dialogTitle: string
  isDialogVisibleOfAddItem: boolean
  currentPage: number
  pageSize: number
  totalItems: number
  dataTableOfTopicMain: TopicMainData[]
  searchFilter: SearchFilter
  cssForformLabelWidth: string
  dataFormOfAddAndEditItem: TopicMainData
  multipleSelection: string[]
  applyStatusOptions: DictOptions[]
  applyStatusNameObj: any
}

export default defineComponent({
  name: 'InstantInspectionTaskIndex',
  components: {
    MdsCard
  },

  setup () {
    const { gotoPage } = layoutTs()
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const store = useStore()
    const router = useRouter()

    /**  == 变量 ==  **/
    const state = reactive<State>({
      currentInspectScene: 'PROCESS', // 过程检验计划
      dialogTitle: '',
      isDialogVisibleOfAddItem: false,
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      dataTableOfTopicMain: [],
      searchFilter: {
        tempApplyNo: '',
        inspectContent: '',
        applyStatus: ''
      },
      cssForformLabelWidth: '150px',
      dataFormOfAddAndEditItem: {
        applyStatus: '',
        deployDate: '',
        deployMan: '',
        handleExplain: '',
        id: '',
        inspectContent: '',
        inspectDeptId: '',
        inspectDeptName: '',
        needDeptCode: '',
        needDeptId: '',
        needDeptName: '',
        processFlag: '',
        sampleDeptId: '',
        sampleDeptName: '',
        tempApplyNo: ''
      },
      multipleSelection: [],
      applyStatusOptions: [],
      applyStatusNameObj: {}
    })

    /**  == 函数 ==  **/
    // 临时检验列表数据
    const btnGetTopicMainData = async (type = '') => {
      if (type === 'init') {
        state.currentPage = 1
        state.pageSize = 10
      }
      const res = await MANAGEMENT_PROCESS_INSPECTION_TASK_STATUS_QUERY_API({
        current: state.currentPage,
        // inspectContent: state.searchFilter.inspectContent,
        // tempApplyNo: state.searchFilter.inspectContent,
        // applyStatus: state.searchFilter.applyStatus,
        size: state.pageSize,
        ...state.searchFilter
      })
      console.log('临时检验列表数据')
      console.log(res.data.data)
      state.dataTableOfTopicMain = res.data.data.records
      state.totalItems = res.data.data.total
      state.pageSize = res.data.data.size
      state.currentPage = res.data.data.current
    }

    // [BTN:配置]
    const btnConfigulation = async (row:TopicMainData) => {
      store.commit('common/updateInstantInspectionTaskObj', row)
      gotoPage({
        path: 'qms-pages-ManagementTask-InstantInspectionTask-InstantInspectionTaskDeal',
        query: {
          type: 'assign',
          id: row.id
        }
      })
    }
    // [BTN:只读]
    const btnConfigulationReadOnly = async (row:TopicMainData) => {
      store.commit('common/updateInstantInspectionTaskObj', row)
      gotoPage({
        path: 'qms-pages-ManagementTask-InstantInspectionTask-InstantInspectionTaskDeal',
        query: {
          type: 'show',
          id: row.id
        }
      })
    }

    // [BTN:删除] 删除 item
    const btnDeleteItemData = (val:TopicMainData) => {
      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await MANAGEMENT_PROCESS_INSPECTION_TASK_STATUS_DELETE_API({
          id: val.id
        })
        proxy.$successToast('操作成功')
        await btnGetTopicMainData()
      })
    }

    // [BTN:新增] 新增
    const btnAddItemOfTopicMainData = async () => {
      store.commit('common/updateInstantInspectionTaskObj', {})
      gotoPage({
        path: 'qms-pages-ManagementTask-InstantInspectionTask-InstantInspectionTaskDeal',
        query: {
          type: 'add',
          id: ''
        }
      })
    }

    // [BTN:编辑] 编辑 item
    const btnEditItemOfTopicMainData = async (row: TopicMainData) => {
      store.commit('common/updateInstantInspectionTaskObj', row)
      gotoPage({
        path: 'qms-pages-ManagementTask-InstantInspectionTask-InstantInspectionTaskDeal',
        query: {
          type: 'edit',
          id: row.id
        }
      })
    }

    const handleChangeDataSize = (pageSize: number) => { // 每页条数切换
      state.currentPage = 1
      state.pageSize = pageSize
      btnGetTopicMainData()
    }

    const handleChangeCurrentPage = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      btnGetTopicMainData()
    }

    /**  == 生命周期 ==  **/
    onMounted(async () => {
      // 获取状态下拉
      await DICTIONARY_QUERY_API({ dictType: 'TASK_STATUS' }).then((res) => {
        state.applyStatusOptions = res.data.data.filter((item:DictOptions) => item.dictCode !== 'OUT_STORAGE') // 除去已出库
        state.applyStatusNameObj = {}
        state.applyStatusOptions.forEach(item => {
          state.applyStatusNameObj[item.dictCode] = item.dictValue
        })
      })
      // 载入临时检验任务 adata
      btnGetTopicMainData()
    })

    onUpdated(() => {
      // 新增 or 编辑 item 后返回，reload page
      if (router.currentRoute.value.query.type === 'back') {
        btnGetTopicMainData()
      }
    })

    return {
      ...toRefs(state),
      // btn
      btnEditItemOfTopicMainData,
      btnAddItemOfTopicMainData,
      btnGetTopicMainData,
      // data
      handleChangeDataSize,
      handleChangeCurrentPage,
      btnDeleteItemData,
      btnConfigulation,
      btnConfigulationReadOnly
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  min-height: 550px;
  height: calc(100vh - 117px);
}
</style>
