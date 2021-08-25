<template>
  <tree-page
    ref="treeModule"
    :title="pageMainTitle"
    :leftTitle="pageLeftColumnTitle"
    :rightTitle="pageRightColumnTitle"
    :treeData="treeData"
    :treeProps="{ label: 'inspectTypeName',children:'children' }"
    @treeNodeClick="getMaterialDetail"
    :floatMenu="false"
  >
    <template #view>
      <div style="display:flex;justify-content: flex-end; padding-right:10px;line-height:1.7em;">
        <template v-if="isShowSearchBar">
          <el-input
            placeholder="物料编码/描述"
            v-model="materialDetailText"
            size="small"
            clearable
            style="margin-bottom:10px; width:200px; height:35px;"
            @keyup.enter="apiMaterialDetail(currentCategoryId,materialDetailText,1,10)">
          </el-input>
          <el-button icon="el-icon-search" size="mini" style="height:32px; margin-left:5px"  @click="apiMaterialDetail(currentCategoryId,materialDetailText,1,10)">查询</el-button>
        </template>
      </div>
     <el-table
        :data="topicMainData"
        style="width: 100%"
        max-height="500"
        border tooltip-effect="dark">
        <el-table-column type="index" :index="index => index + 1 + (Number(currentPage) - 1) * (Number(pageSize))" label="序号"  width="55" fixed align="center" size="small" />
        <el-table-column label="物料编码" prop="inspectMaterialCode" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="物料描述" prop="inspectMaterialName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="归属上级" prop="inspectGroupName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="品项" prop="itemName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column fixed="right" label="操作" header-align="left" align="left" width="100">
            <template #default="scope">
                <el-button  type="text" icon="el-icon-edit" @click="handleSingleEdit(scope.row)" class="role__btn">
                    编辑
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
  <material-inspection-edit v-model:dialogVisible="isDialogShow" ref="refFunctionDialog" :title="'分配检验类别'"  :treeData="materialTreeData" @inspectCategoryList="updateInspectCategoryList" @reset="reset" :treeCheckedKeysGroup="inspectTypeIds" />
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, reactive, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { INSPECT_MATERIAL_INSPECT_TYPE_MATERIAL_API, INSPECT_MATERIAL_INSPECT_MATERIAL_QUERY_API, INSPECT_MATERIAL_CHECKED_INSPECT_TYPE_QUERY_API, INSPECT_MATERIAL_CHECKED_INSPECT_TYPE_UPDATE_API } from '@/api/api'
import MaterialInspectionEdit from './MaterialInspectionEdit.vue'

interface TreeItemData { // 物料分类 API
  id: string
  inspectTypeName: string
  notShowContextMenuOnThisNode: string
  isFinalNode: boolean,
  itemId: string,
  markParentId: string
}

interface TreeData { // 物料分类 API
  id: string
  inspectTypeCode: string
  inspectTypeName: string
  children:TreeData[]
}

interface TopicMainData { // 物料明细 API
  id:string
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
    topicMainData: TopicMainData[]
    treeData: TreeData[]
    materialTreeData: MaterialTreeData[]
    currentCategoryId: string
    globleItem: TopicMainData
    isShowSearchBar: boolean
    globleSearchString: string
    inspectTypeIds: string[]
    initFocusNode: string
}

export default defineComponent({
  name: 'InspectionCategoryDetail',
  components: {
    MaterialInspectionEdit
  },
  props: {
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const state = reactive<State>({
      isDialogShow: false,
      pageMainTitle: '检验类别',
      pageLeftColumnTitle: '类别组织',
      pageRightColumnTitle: '物料明细',
      materialDetailText: '',
      totalItems: 0,
      currentPage: 1,
      pageSize: 10,
      topicMainData: [],
      treeData: [],
      materialTreeData: [],
      currentCategoryId: '',
      globleItem: {
        id: '',
        inspectGroupCode: '',
        inspectGroupName: '',
        inspectMaterialType: '',
        inspectMaterialCode: '',
        inspectMaterialName: ''
      },
      globleSearchString: '', // 点击过 search bar , keep resulte  or 点最末节点
      isShowSearchBar: true,
      inspectTypeIds: [],
      initFocusNode: ''
    })
    const refFunctionDialog = ref()
    const treeModule = ref()

    // single action to go
    const handleSingleEdit = (row:TopicMainData) => {
      state.globleItem = {
        id: row.id,
        inspectGroupCode: row.inspectGroupCode,
        inspectGroupName: row.inspectGroupName,
        inspectMaterialType: row.inspectMaterialType,
        inspectMaterialCode: row.inspectMaterialCode,
        inspectMaterialName: row.inspectMaterialName
      }
      state.isDialogShow = true
      INSPECT_MATERIAL_CHECKED_INSPECT_TYPE_QUERY_API({
        inspectMaterialCode: row.inspectMaterialCode
      }).then((res) => {
        state.inspectTypeIds = res.data.data.inspectTypeIds
        state.materialTreeData = treeDataTranslater('default', res.data.data.inspectTypes, 'id', 'parentId')
      })
    }

    const reset = () => {
      state.inspectTypeIds = []
      state.materialTreeData = []
      state.globleItem = {
        id: '',
        inspectGroupCode: '',
        inspectGroupName: '',
        inspectMaterialType: '',
        inspectMaterialCode: '',
        inspectMaterialName: ''
      }
    }

    const getMaterialDetail = (val:TreeItemData) => {
      state.globleSearchString = ''
      state.materialDetailText = ''
      state.currentPage = 1
      state.pageSize = 10
      state.totalItems = 0
      // if (!val.notShowContextMenuOnThisNode) {
      if (val.isFinalNode === true) {
        state.currentCategoryId = ''
        state.isShowSearchBar = false
        apiMaterialDetail(val.markParentId, val.itemId, state.currentPage, state.pageSize)
      } else {
        state.currentCategoryId = val.id
        state.isShowSearchBar = true
        apiMaterialDetail(val.id, '', state.currentPage, state.pageSize)
      }
      // }
    }
    const apiMaterialDetail = (currentCategoryId:string, searchString = '', currentPage:number, pageSize:number) => {
      state.globleSearchString = searchString
      INSPECT_MATERIAL_INSPECT_MATERIAL_QUERY_API({
        inspectTypeId: currentCategoryId,
        inspectMaterialNameOrCode: searchString,
        current: currentPage,
        size: pageSize
      }).then((res) => {
        console.log('物料明细')
        console.log(res.data.data)
        state.topicMainData = res.data.data.records
        state.currentPage = res.data.data.current
        state.pageSize = res.data.data.size
        state.totalItems = res.data.data.total
      })
    }

    const handleSizeChange = (pageSize: number) => { // 每页条数切换
      state.pageSize = pageSize
      apiMaterialDetail(state.currentCategoryId, state.globleSearchString, state.currentPage, state.pageSize)
    }
    const handleCurrentChange = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      apiMaterialDetail(state.currentCategoryId, state.globleSearchString, state.currentPage, state.pageSize)
    }

    // get material detail data
    const getMaterialCatagoryData = () => {
      INSPECT_MATERIAL_INSPECT_TYPE_MATERIAL_API({
      }).then((res) => {
        state.materialDetailText = ''
        state.isShowSearchBar = true
        state.treeData = treeDataTranslater('category', JSON.parse(JSON.stringify(res.data.data)), 'id', 'parentId')
        // 一进页面默认跑第一笔
        if (state.currentCategoryId === '') {
          state.currentCategoryId = state.treeData[0].id
          state.initFocusNode = state.treeData[0].id

          // '619922389037592576'
          treeModule.value.focusCurrentNodeNumber = state.treeData[0].id
          apiMaterialDetail(state.currentCategoryId, '', state.currentPage, state.pageSize)
        }
      })
    }

    const updateInspectCategoryList = (val:string[]) => {
      const dataTemp:TopicMainData[] = []
      dataTemp.push(state.globleItem)

      INSPECT_MATERIAL_CHECKED_INSPECT_TYPE_UPDATE_API({
        inspectMaterialDetails: dataTemp,
        inspectTypeIdList: val // 检验类id数组
      }).then(async () => {
        proxy.$successToast('操作成功')
        // reload page
        await getMaterialCatagoryData()
        state.topicMainData = []
      })
    }

    const treeDataTranslater = (who:string, data: any[], id: string, pid: string) => {
      const res: any[] = []
      const temp: any = {}
      for (let i = 0; i < data.length; i++) {
        if (who === 'category') {
          if (data[i].inspectMaterials.length !== 0 && data[i].assistFlag !== 'Y') {
            data[i].children = []
            data[i].inspectMaterials.forEach((item: string) => {
              data[i].children.push({ inspectTypeName: item, isFinalNode: true, markParentId: data[i].id, itemId: item.slice(item.lastIndexOf(' ') + 1) })
            })
          } else {
            data[i].notShowContextMenuOnThisNode = true
          }
        }
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
      handleSingleEdit,
      handleSizeChange,
      handleCurrentChange,
      getMaterialDetail,
      apiMaterialDetail,
      updateInspectCategoryList,
      reset,
      treeModule
    }
  }
})
</script>

<style scoped>

</style>
