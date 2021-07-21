<template>
  <tree-page
    :title="pageMainTitle"
    :leftTitle="pageLeftColumnTitle"
    :rightTitle="pageLightColumnTitle"
    :treeData="treeData"
    :treeProps="{ label: 'inspectMaterialType',children:'inspectGroups' }"
    @treeNodeClick="getMaterialDetail"
    @treeNodeContextMenu="treeNodeContextMenuHandle"
  >
    <template #context--menu >
      <ul>
        <li @click="handleMultiAsign">分配</li>
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
      <el-button type="primary" size="mini" style="height:32px; margin-left:5px" @click="apiMaterialDetail(currentMaterialString,currentMaterialGroupString,materialDetailText)">查询</el-button>
      </div>
     <el-table :data="tableData"
        style="width: 100%"
        max-height="500"
        border tooltip-effect="dark">
        <el-table-column type="index" :index="index => index + 1 + (Number(currentPage) - 1) * (Number(pageSize))" label="序号" width="55" fixed align="center" size="small" />
        <el-table-column label="物料编码" prop="inspectMaterialCode" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="物料描述" prop="inspectMaterialName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="所属物料组" prop="inspectGroupName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column fixed="right" label="操作" header-align="left" align="left" width="100">
            <template #default="scope">
                <el-button size="mini" @click="handleSingleAsign(scope.row)">
                    分配
                </el-button>
            </template>
        </el-table-column>
      </el-table>

      <el-pagination
      v-if="tableData.length!==0"
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
  <material-inspection-asign v-model:dialogVisible="isDialogShow" ref="functionManage" :title="'分配检验类别'"  :treeData="materialTreeData" @inspectCategoryList="inspectCategoryList" @reset="reset"  />
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, reactive, onMounted } from 'vue'
import { treeDataTranslate } from '@/utils/index'
import { INSPECT_MATERIAL_QUERY_SYS_MATERIAL_ITEM_API, INSPECT_MATERIAL_QUERY_SYS_MATERIAL_API, INSPECT_TYPE_QUERY_API, INSPECT_MATERIAL_DISTRIBUTION_INSPECT_MATERIAL_API } from '@/api/api'
import MaterialInspectionAsign from './MaterialInspectionAsign.vue'

interface TreeItemData { // 物料分类 API
  inspectMaterialType: string
  inspectGroup: string
  inspectGroups: TreeItemData[]
}

interface TreeData { // 物料分类 API
  inspectGroups: TreeItemData[]
  inspectMaterialType: string
  notShowContextMenuOnThisNode?:boolean
}

interface TableData { // 物料明细 API
  inspectGroupCode: string
  inspectGroupName: string
  inspectMaterialType: string
  inspectMaterialCode: string
  inspectMaterialName: string
}

interface MaterialTreeData {
  id: string; // 主键
  parentId: string; // "上级类别":
  inspectTypeName: string; // 类别名称
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
    tableData: Array<TableData>
    treeData: Array<TreeData>
    materialTreeData: Array<MaterialTreeData>
    currentMaterialString: string
    currentMaterialGroupString: string
    globleItem:TableData
    globleItemGroup: TableData[]
    whoAsign:string
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
      tableDataW: [],
      tableData: [],
      treeData: [],
      materialTreeData: [],
      currentMaterialString: '',
      currentMaterialGroupString: '',
      globleItem: {
        inspectGroupCode: '',
        inspectGroupName: '',
        inspectMaterialType: '',
        inspectMaterialCode: '',
        inspectMaterialName: ''
      },
      globleItemGroup: [],
      whoAsign: ''
    })
    const functionManage = ref()

    // single action to go
    const handleSingleAsign = (row:TableData) => {
      state.whoAsign = 'single'
      state.globleItem = {
        inspectGroupCode: row.inspectGroupCode,
        inspectGroupName: row.inspectGroupName,
        inspectMaterialType: row.inspectMaterialType,
        inspectMaterialCode: row.inspectMaterialCode,
        inspectMaterialName: row.inspectMaterialName
      }
      state.isDialogShow = true
      apiAsignMaterial()
    }

    // multiaction to go
    const handleMultiAsign = () => {
      state.whoAsign = 'multi'
      state.isDialogShow = true
      apiAsignMaterial()
    }

    const reset = () => {
      if (state.whoAsign === 'single') {
        state.globleItem = {
          inspectGroupCode: '',
          inspectGroupName: '',
          inspectMaterialType: '',
          inspectMaterialCode: '',
          inspectMaterialName: ''
        }
      } else if (state.whoAsign === 'multi') {
        state.globleItemGroup = []
      }
    }

    // TODO
    const treeNodeContextMenuHandle = (val:TreeItemData) => {
      console.log(val.inspectMaterialType)

      INSPECT_MATERIAL_QUERY_SYS_MATERIAL_API({
        // inspectMaterialType: '欣和无估价的物料 ZUNB',
        inspectMaterialType: val.inspectMaterialType,
        inspectGroup: '',
        inspectMaterialNameOrCode: ''
      }).then((res) => {
        state.globleItemGroup = JSON.parse(JSON.stringify(res.data.data))
      })
    }

    const getMaterialDetail = (val:TreeItemData) => {
      console.log('22222222')
      console.log(val)
      if (val.inspectGroups.length === 0) {
        console.log('我是子结点')
        state.currentMaterialGroupString = val.inspectMaterialType
        state.currentMaterialString = val.inspectGroup
      } else {
        console.log('我是结点')
        state.currentMaterialGroupString = ''
        state.currentMaterialString = val.inspectMaterialType
      }

      apiMaterialDetail(state.currentMaterialString, state.currentMaterialGroupString)
    }

    // TODO
    const apiMaterialDetail = (currentMaterialString:string, currentMaterialGroupString:string, searchString = '') => {
      INSPECT_MATERIAL_QUERY_SYS_MATERIAL_API({
        // inspectMaterialType: '欣和无估价的物料 ZUNB',
        inspectMaterialType: currentMaterialString,
        inspectGroup: currentMaterialGroupString,
        inspectMaterialNameOrCode: searchString
      }).then((res) => {
        console.log('物料明细')
        console.log(res.data.data)
        state.totalItems = res.data.data.length
        state.tableDataW = JSON.parse(JSON.stringify(res.data.data))
        currentChangePage(state.tableDataW, 1)
      })
    }

    const apiAsignMaterial = () => {
      INSPECT_TYPE_QUERY_API({
      }).then((res) => {
        state.materialTreeData = treeDataTranslate(res.data.data, 'id', 'parentId')
      })
    }

    const handleSizeChange = (pageSize: number) => { // 每页条数切换
      state.pageSize = pageSize
      handleCurrentChange(state.currentPage)
    }
    const handleCurrentChange = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      currentChangePage(state.tableDataW, currentPage)
    }

    // 分页方法（重点）
    const currentChangePage = (list:TableData[], currentPage: number) => {
      let from = (currentPage - 1) * state.pageSize
      const to = currentPage * state.pageSize
      state.tableData = []
      for (; from < to; from++) {
        if (list[from]) {
          state.tableData.push(list[from])
        }
      }
    }

    // get material detail data
    const getMaterialCatagoryData = () => {
      INSPECT_MATERIAL_QUERY_SYS_MATERIAL_ITEM_API({
      }).then((res) => {
        console.log('tree-data')
        console.log(res.data.data)
        res.data.data.forEach((item:TreeData) => {
          item.notShowContextMenuOnThisNode = true
          item.inspectGroups.forEach((subItem:TreeItemData) => {
            subItem.inspectGroup = item.inspectMaterialType
          })
        })
        state.treeData = res.data.data
        console.log('state.treeData')
        console.log(state.treeData)
      })
    }

    const inspectCategoryList = (val:string[]) => {
      let dataTemp:TableData[] = []
      if (state.whoAsign === 'single') {
        dataTemp.push(state.globleItem)
      } else if (state.whoAsign === 'multi') {
        dataTemp = state.globleItemGroup
      }

      INSPECT_MATERIAL_DISTRIBUTION_INSPECT_MATERIAL_API({
        inspectMaterialDetails: dataTemp,
        inspectTypeIdList: val // 检验类id数组
      }).then((res) => {
        console.log(res)
        // reload page
        if (state.whoAsign === 'single') {
          apiMaterialDetail(state.currentMaterialString, state.currentMaterialGroupString, state.materialDetailText) // 1todo
        } else if (state.whoAsign === 'multi') {
          getMaterialCatagoryData()
        }
      })
    }

    onMounted(() => {
      // 获取
      getMaterialCatagoryData()
    })

    return {
      ...toRefs(state),
      functionManage,
      handleSingleAsign,
      treeNodeContextMenuHandle,
      handleSizeChange,
      handleCurrentChange,
      getMaterialDetail,
      apiMaterialDetail,
      apiAsignMaterial,
      inspectCategoryList,
      reset,
      handleMultiAsign
    }
  }
})
</script>

<style scoped>

</style>
