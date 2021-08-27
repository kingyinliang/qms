<template>
  <tree-page
    ref="treeModule"
    :title="pageMainTitle"
    :leftTitle="pageLeftColumnTitle"
    :rightTitle="pageRightColumnTitle"
    :treeData="treeData"
    :treeProps="{ label: 'inspectMaterialType',children:'inspectGroups' }"
    @treeNodeClick="getMaterialDetail"
    @treeNodeContextMenu="treeNodeContextMenuHandle"
  >
    <template #context--menu >
      <ul class="sub-menu">
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
        style="margin-bottom:10px; width:200px; height:35px;"
        @keyup.enter="apiMaterialDetail(currentMaterialString,currentMaterialGroupString,materialDetailText,'searchBar')">
      </el-input>
      <el-button icon="el-icon-search" size="mini" style="height:32px; margin-left:5px" @click="apiMaterialDetail(currentMaterialString,currentMaterialGroupString,materialDetailText,'searchBar')">查询</el-button>
      </div>
     <el-table :data="topicMainData"
        style="width: 100%"
        max-height="500"
        border
        tooltip-effect="dark"
        >
        <el-table-column type="index" :index="index => index + 1 + (Number(currentPage) - 1) * (Number(pageSize))" label="序号" width="55" fixed align="center" size="small" />
        <el-table-column label="物料编码" prop="inspectMaterialCode" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="物料描述" prop="inspectMaterialName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="所属物料组" prop="inspectGroupName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column fixed="right" label="操作" header-align="left" align="left" width="100">
            <template #default="scope">
                <el-button type="text" @click="handleSingleAsign(scope.row)" icon="el-icon-tickets">
                    分配
                </el-button>
            </template>
        </el-table-column>
      </el-table>

      <el-pagination
      v-if="topicMainData.length!==0"
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
  <material-inspection-asign v-model:dialogVisible="isDialogShow" ref="refFunctionDialog" :title="'分配检验类别'"  :treeData="materialTreeData" @inspectCategoryList="inspectCategoryListAsignToGo" @reset="reset"  />
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, reactive, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { INSPECT_MATERIAL_QUERY_SYS_MATERIAL_ITEM_API, INSPECT_MATERIAL_QUERY_SYS_MATERIAL_API, INSPECT_TYPE_QUERY_API, INSPECT_MATERIAL_DISTRIBUTION_INSPECT_MATERIAL_API } from '@/api/api'
import MaterialInspectionAsign from './MaterialInspectionAsign.vue'

interface TreeItemData { // 物料分类 API
  inspectMaterialType: string
  inspectGroup: string
  inspectGroups: TreeItemData[]
}

interface TreeData { // 物料分类 API
  id: string
  inspectGroups: TreeItemData[]
  inspectMaterialType: string
  notShowContextMenuOnThisNode?:boolean
}

interface TopicMainData { // 物料明细 API
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
    pageRightColumnTitle: string
    materialDetailText: string // 物料明细查找
    totalItems: number
    currentPage: number
    pageSize: number
    tableDataW: TopicMainData[]
    topicMainData: TopicMainData[]
    treeData: TreeData[]
    materialTreeData: MaterialTreeData[]
    currentMaterialString: string
    currentMaterialGroupString: string
    globleItem:TopicMainData
    globleItemGroup: TopicMainData[]
    globleSearchString: string
    whoAsign: string
}

export default defineComponent({
  name: 'MaterialInspection',
  components: {
    MaterialInspectionAsign
  },
  props: {
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const state = reactive<State>({
      isDialogShow: false,
      pageMainTitle: '物料分类',
      pageLeftColumnTitle: '物料分类',
      pageRightColumnTitle: '物料明细',
      materialDetailText: '',
      totalItems: 0,
      currentPage: 1,
      pageSize: 10,
      tableDataW: [],
      topicMainData: [],
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
      globleSearchString: '',
      globleItemGroup: [],
      whoAsign: ''
    })
    const refFunctionDialog = ref()
    const treeModule = ref()

    // [BTN:分配] single action to go
    const handleSingleAsign = (row:TopicMainData) => {
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

      if (state.topicMainData.length !== 0) {
        state.isDialogShow = true
        apiAsignMaterial()
      } else {
        proxy.$infoToast('此物料组下无可分配物料，请选择其它物料组')
      }
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

    const treeNodeContextMenuHandle = (val:TreeItemData) => {
      getMaterialDetail(val)
      INSPECT_MATERIAL_QUERY_SYS_MATERIAL_API({
        // inspectMaterialType: '欣和无估价的物料 ZUNB',
        inspectMaterialType: val.inspectGroup,
        inspectGroup: val.inspectMaterialType,
        // inspectMaterialType: val.inspectMaterialType,
        // inspectGroup: val.inspectGroup,
        inspectMaterialNameOrCode: ''
      }).then((res) => {
        console.log('state.globleItemGroup')
        console.log(state.globleItemGroup)
        state.globleItemGroup = JSON.parse(JSON.stringify(res.data.data))
      })
    }

    const getMaterialDetail = (val:TreeItemData) => {
      state.materialDetailText = ''
      state.globleSearchString = ''
      state.currentPage = 1
      state.pageSize = 10
      state.totalItems = 0

      // 此处命名有些问题, 需留意
      if (val.inspectGroups.length === 0) {
        state.currentMaterialGroupString = val.inspectMaterialType
        state.currentMaterialString = val.inspectGroup
      } else {
        state.currentMaterialGroupString = ''
        state.currentMaterialString = val.inspectMaterialType
      }

      apiMaterialDetail(state.currentMaterialString, state.currentMaterialGroupString, '')
    }

    const apiMaterialDetail = (currentMaterialString:string, currentMaterialGroupString:string, searchString = '', where = '') => {
      state.globleSearchString = searchString
      INSPECT_MATERIAL_QUERY_SYS_MATERIAL_API({
        inspectMaterialType: currentMaterialString,
        inspectGroup: currentMaterialGroupString,
        inspectMaterialNameOrCode: searchString
      }).then((res) => {
        console.log('物料明细')
        console.log(res.data.data)
        state.totalItems = res.data.data.length
        state.tableDataW = JSON.parse(JSON.stringify(res.data.data))
        currentChangePage(state.tableDataW, 1)
        if (where === 'searchBar' && res.data.data.length === 0) {
          proxy.$infoToast('暂无数据')
        }
      })
    }

    // [tan]分配检验类别
    const apiAsignMaterial = () => {
      INSPECT_TYPE_QUERY_API({
      }).then((res) => {
        state.materialTreeData = treeDataTranslater(res.data.data, 'id', 'parentId')
      })
    }

    const handleSizeChange = (pageSize: number) => { // 每页条数切换
      state.currentPage = 1
      state.pageSize = pageSize
      handleCurrentChange(state.currentPage)
    }
    const handleCurrentChange = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      currentChangePage(state.tableDataW, currentPage)
    }

    // 分页方法（重点）
    const currentChangePage = (list:TopicMainData[], currentPage: number) => {
      let from = (currentPage - 1) * state.pageSize
      const to = currentPage * state.pageSize
      state.topicMainData = []
      for (; from < to; from++) {
        if (list[from]) {
          state.topicMainData.push(list[from])
        }
      }
    }

    // get material detail data
    const getMaterialCatagoryData = () => {
      state.materialDetailText = ''
      state.globleSearchString = ''
      state.currentPage = 1
      state.pageSize = 10
      state.totalItems = 0

      INSPECT_MATERIAL_QUERY_SYS_MATERIAL_ITEM_API({
      }).then((res) => {
        console.log('tree-data')
        console.log(res.data.data)
        res.data.data.forEach((item:TreeData) => {
          item.notShowContextMenuOnThisNode = true
          item.id = item.inspectMaterialType
          item.inspectGroups.forEach((subItem:TreeItemData) => {
            subItem.inspectGroup = item.inspectMaterialType
          })
        })
        state.treeData = res.data.data
        // 一进页面默认跑第一笔
        if (state.currentMaterialString === '') {
          state.currentMaterialString = state.treeData[0].inspectMaterialType
          treeModule.value.focusCurrentNodeNumber = state.treeData[0].inspectMaterialType
          apiMaterialDetail(state.currentMaterialString, '', '')
        }
      })
    }

    const inspectCategoryListAsignToGo = (val:string[]) => {
      let dataTemp:TopicMainData[] = []
      if (state.whoAsign === 'single') { // 右边 column 单条分配
        dataTemp.push(state.globleItem)
      } else if (state.whoAsign === 'multi') { // 左边 column 批量分配
        dataTemp = state.globleItemGroup
      }

      INSPECT_MATERIAL_DISTRIBUTION_INSPECT_MATERIAL_API({
        inspectMaterialDetails: dataTemp,
        inspectTypeIdList: val // 检验类id数组
      }).then(() => {
        proxy.$successToast('操作成功')
        // reload page
        // if (state.whoAsign === 'single') {
        //   INSPECT_MATERIAL_QUERY_SYS_MATERIAL_API({
        //     inspectMaterialType: state.currentMaterialString,
        //     inspectGroup: state.currentMaterialGroupString,
        //     inspectMaterialNameOrCode: state.globleSearchString
        //   }).then((res) => {
        //     state.totalItems = res.data.data.length
        //     if (res.data.data.length === 0) {
        //       state.currentMaterialString = ''
        //       getMaterialCatagoryData()
        //     } else {
        //       state.tableDataW = JSON.parse(JSON.stringify(res.data.data))
        //       currentChangePage(state.tableDataW, 1)
        //     }
        //   })
        // } else if (state.whoAsign === 'multi') {
        //   state.currentMaterialString = ''
        //   getMaterialCatagoryData()
        // }
        state.currentMaterialString = ''
        getMaterialCatagoryData()
      })
    }

    const treeDataTranslater = (data: any[], id: string, pid: string): any[] => {
      const res: any[] = []
      const temp: any = {}
      for (let i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i]
      }
      for (let k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
          if (!temp[data[k][pid]].children) {
            temp[data[k][pid]].children = []
          }
          if (!temp[data[k][pid]]._level) {
            temp[data[k][pid]]._level = 1
          }
          data[k]._level = temp[data[k][pid]]._level + 1
          temp[data[k][pid]].children.push(data[k])
          if (data[k].assistFlag === 'Y') {
            data[k].disabled = true
          }
        } else {
          if (data[k].assistFlag === 'Y') {
            data[k].disabled = true
          }
          res.push(data[k])
        }
      }
      return res
    }

    onMounted(() => {
      // 获取
      getMaterialCatagoryData()
    })

    return {
      ...toRefs(state),
      refFunctionDialog,
      handleSingleAsign,
      treeNodeContextMenuHandle,
      handleSizeChange,
      handleCurrentChange,
      getMaterialDetail,
      apiMaterialDetail,
      apiAsignMaterial,
      inspectCategoryListAsignToGo,
      reset,
      handleMultiAsign,
      treeModule,
      treeDataTranslater
    }
  }
})
</script>

<style scoped>
.sub-menu{
  font-size: 14px;
  line-height: 28px;
}
</style>
