<template>
  <tree-page
    :title="pageMainTitle"
    :leftTitle="pageLeftColumnTitle"
    :rightTitle="pageLightColumnTitle"
    :treeData="treeData"
    :treeProps="{ label: 'inspectItem',children:'inspectGroups' }"
    @treeNodeContextMenu="treeNodeContextMenuHandle"
  >
    <template #context--menu>
      <ul>
        <li @click="handleAsignt">分配{{show}}</li>
      </ul>
    </template>
    <template #view>
      <div style="display:flex;justify-content: flex-end; padding-right:10px;line-height:1.7em;">
      <el-input
        placeholder="物料编码/描述"
        v-model="materialDetailText"
        size="small"
        clearable
        style="margin-bottom:10px; width:200px; height:35px;">
        <template #suffix>
              <em class="el-input__icon el-icon-search" />
        </template>
      </el-input>
      <el-button type="primary" size="mini" style="height:32px; margin-left:5px">查询</el-button>
      </div>
     <el-table :data="tableDataW"
        style="width: 100%"
        max-height="500"
        border tooltip-effect="dark">
        <el-table-column type="index" :index="indexMethod" label="序号" width="55" fixed align="center" size="small" />
        <el-table-column label="物料编码" prop="inspectMaterialCode" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="物料描述" prop="inspectMaterialName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="所属物料组" prop="inspectGroupName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column fixed="right" label="操作" header-align="left" align="left" width="100">
            <template #default>
                <el-button size="mini" @click="handleAsignt">
                    分配
                </el-button>
            </template>
        </el-table-column>
      </el-table>

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalItems">
    </el-pagination>
    </template>
  </tree-page>
  <material-inspection-asign v-model:dialogVisible="isDialogShow" ref="functionManage" :title="'分配检验类别'"  />
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, reactive, onMounted } from 'vue'
// import { INSPECT_MATERIAL_QUERY_SYS_MATERIAL_ITEM_API } from '@/api/api'
import MaterialInspectionAsign from './MaterialInspectionAsign.vue'

interface TableData {
  inspectMaterialCode: string
  inspectMaterialName: string
  inspectGroupName: string
}

interface State {
    isDialogShow: boolean
    pageMainTitle: string
    pageLeftColumnTitle: string
    pageLightColumnTitle: string
    materialDetailText: string // 物料明细查找
    totalItems: number
    currentPage: number
    pageSize: number
    tableDataW: Array<TableData>
}

export default defineComponent({
  name: 'MaterialInspection',
  components: {
    MaterialInspectionAsign
  },
  props: {
  },
  setup () {
    const state = reactive<State>({
      isDialogShow: false,
      pageMainTitle: '物料分类',
      pageLeftColumnTitle: '物料分类',
      pageLightColumnTitle: '物料明细',
      materialDetailText: '',
      totalItems: 0,
      currentPage: 1,
      pageSize: 10,
      tableDataW: []
    })
    const functionManage = ref()

    // API data
    const treeData = ref([
      {
        id: 1,
        inspectItem: '大米 111',
        inspectGroups: [
          { inspectItem: '小米 222' }
        ]
      }
    ])

    const tableData:TableData[] = [{
      inspectMaterialCode: 'a11',
      inspectMaterialName: '玉米',
      inspectGroupName: '杂粮组'
    }, {
      inspectMaterialCode: 'a12',
      inspectMaterialName: '番薯',
      inspectGroupName: '杂粮组'
    },
    {
      inspectMaterialCode: 'a12',
      inspectMaterialName: '番薯',
      inspectGroupName: '杂粮组'
    },
    {
      inspectMaterialCode: 'a12',
      inspectMaterialName: '番薯',
      inspectGroupName: '杂粮组'
    },
    {
      inspectMaterialCode: 'a12',
      inspectMaterialName: '番薯',
      inspectGroupName: '杂粮组'
    },
    {
      inspectMaterialCode: 'a12',
      inspectMaterialName: '番薯',
      inspectGroupName: '杂粮组'
    },
    {
      inspectMaterialCode: 'a12',
      inspectMaterialName: '番薯',
      inspectGroupName: '杂粮组'
    },
    {
      inspectMaterialCode: 'a12',
      inspectMaterialName: '番薯',
      inspectGroupName: '杂粮组'
    },
    {
      inspectMaterialCode: 'a12',
      inspectMaterialName: '番薯',
      inspectGroupName: '杂粮组'
    },
    {
      inspectMaterialCode: 'a12',
      inspectMaterialName: '番薯',
      inspectGroupName: '杂粮组'
    },
    {
      inspectMaterialCode: 'a12',
      inspectMaterialName: '番薯',
      inspectGroupName: '杂粮组'
    },
    {
      inspectMaterialCode: 'a12',
      inspectMaterialName: '番薯',
      inspectGroupName: '杂粮组'
    }
    ]

    // action to go
    const handleAsignt = () => {
      state.isDialogShow = true
    }

    const treeNodeContextMenuHandle = () => {
      console.log('888888')
      // console.log(val)
    }

    const handleSizeChange = (pageSize: number) => { // 每页条数切换
      state.pageSize = pageSize
      handleCurrentChange(state.currentPage)
    }
    const handleCurrentChange = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      currentChangePage(tableData, currentPage)
    }

    // 分页方法（重点）
    const currentChangePage = (list:TableData[], currentPage: number) => {
      let from = (currentPage - 1) * state.pageSize
      const to = currentPage * state.pageSize
      state.tableDataW = []
      for (; from < to; from++) {
        if (list[from]) {
          state.tableDataW.push(list[from])
        }
      }
    }

    // get material detail data
    const getMaterialDetailData = () => {
      state.totalItems = tableData.length
      currentChangePage(tableData, 1)
      // INSPECT_MATERIAL_QUERY_SYS_MATERIAL_ITEM_API({
      // }).then((res) => {
      //   console.log(res.data.data)
      // })
    }

    onMounted(() => {
      getMaterialDetailData()
    })

    return {
      ...toRefs(state),
      treeData,
      tableData,
      functionManage,
      handleAsignt,
      treeNodeContextMenuHandle,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style scoped>

</style>
