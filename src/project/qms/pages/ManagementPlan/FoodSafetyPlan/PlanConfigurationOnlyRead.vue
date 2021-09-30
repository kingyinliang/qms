<template>
  <tree-page
    ref="refTreeModule"
    :title="pageMainTitle"
    :leftTitle="pageLeftColumnTitle"
    :rightTitle="pageRightColumnTitle"
    :treeData="treeData"
    :treeProps="{ label: 'inspectTypeName',children:'children' }"
    @treeNodeClick="getPlanDetail"
    :floatMenu="false"
  >
    <template #view>
      <div style="display:flex;justify-content: flex-end; padding-right:10px;line-height:1.7em;">
        <template v-if="isShowSearchBar">
          <el-input
            placeholder="指标名称"
            v-model="textForSearch"
            size="small"
            clearable
            style="margin-bottom:10px; width:200px; height:35px;"
            @keyup.enter="apiPlanDetail(currentCategoryId,textForSearch,1,10)">
          </el-input>
          <el-button icon="el-icon-search" size="small" class="topic-button"  @click="apiPlanDetail(currentCategoryId,textForSearch,1,10)">查询</el-button>
        </template>
      </div>
     <el-table
        :data="topicMainData"
        style="width: 100%"
        max-height="500"
        border tooltip-effect="dark"
        class="bueatyScroll"
        >
        <el-table-column type="index" :index="index => index + 1 + (Number(currentPage) - 1) * (Number(pageSize))" label="序号"  width="55" fixed align="center" size="small" />
        <el-table-column label="物料/类别" prop="inspectMaterialTypeName" :show-overflow-tooltip="true" min-width="180" />
        <el-table-column label="指标编码" prop="indexCode" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="指标名称" prop="indexName" :show-overflow-tooltip="true" min-width="180" />
        <el-table-column label="单位" prop="indexUnit" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="方法" prop="indexMethod" :show-overflow-tooltip="true" min-width="220" />
        <el-table-column label="取样部门" prop="cooperate" :show-overflow-tooltip="true" min-width="108" >
          <template #default="scope">
            {{scope.row.cooperate}}
          </template>
        </el-table-column>
        <el-table-column label="配合取样" prop="sample" :show-overflow-tooltip="true" min-width="100" >
          <template #default="scope">
            {{scope.row.sample}}
          </template>
        </el-table-column>
        <el-table-column label="检验部门" prop="inspect.deptName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="配合检验" prop="coInspect.deptName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="留样数量" prop="sampleAmount" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="关键指标" prop="keyIndexFlag" :show-overflow-tooltip="true" min-width="100" >
          <template #default="scope">
            {{scope.row.keyIndexFlag==='Y'?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column label="合并属性" prop="mergeFlag" :show-overflow-tooltip="true" min-width="100" >
          <template #default="scope">
            {{scope.row.mergeFlag==='Y'?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column label="检验频次" prop="frequencyName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="轮循否" prop="loopFlag" :show-overflow-tooltip="true" min-width="100" >
          <template #default="scope">
            {{scope.row.loopFlag==='Y'?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column label="定时触发" prop="timingFlag" :show-overflow-tooltip="true" min-width="100" >
          <template #default="scope">
            {{scope.row.timingFlag==='Y'?'是':'否'}}
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
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { defineComponent, ref, toRefs, reactive, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue'
import {
  INSPECT_INDEX_PARAMETER_RELATIVE_ITEM_API,
  MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_QUERY_API,
  ORG_TREE_API
} from '@/api/api'
import layoutTs from '@/components/layout/layoutTs'

interface TreeDataItem {
  // id: string
  // inspectTypeName: string
  // inspectTypeCode: string
  // isFinalNode: boolean
  // itemId: string
  // markParentId: string
  id: string
  inspectMaterialCode: string
  inspectMaterialName: string
  inspectTypeName: string
  projectLocation: string
}

interface TreeData {
  assistFlag: string
  id: string
  inspectTypeCode: string
  inspectTypeName: string
  children:TreeDataItem[]
  inspectMaterialAlls:TreeDataItem[]
  parentId: string
  parentName: string
  _level: number
  canEdit: boolean
  canDelete: boolean
  canAdd: boolean
  canGenerate: boolean
  canClick: boolean
  projectLocation: string
  isFinalNode: boolean
}

interface CoInspect {
    deptId: string
    deptName: string
    id?: string
    planConfigureId?: string
    relationType?: string
}

interface Inspect {
    deptId: string
    deptName: string
    id?: string
    planConfigureId?: string
    relationType?: string
}

interface IndexCodeOptions{
  assistFlag: string;
  id: string;
  indexCode: string;
  indexMethod: string;
  indexName: string;
  indexNameUnitMethod: string;
  indexType: string;
  indexTypeName: string;
  indexUnit: string;
  inspectIndexId: string;
  inspectIndexMaterialIds: string;
  inspectMaterialCode: string;
  inspectMaterialCodes: string;
  inspectMaterialTypeName: string;
  relationType: string;
}

interface TopicMainData { // 物料明细 API
  coInspect: CoInspect
  cooperate: string
  frequencyId: string
  id: string
  indexCode: string
  indexMethod: string
  indexName: string
  indexUnit: string
  inspect: Inspect
  inspectIndexMaterialId: string
  inspectMaterialId: string
  inspectMaterialTypeCode: string
  inspectMaterialTypeName: string
  inspectTypeIds: string
  keyIndexFlag: string
  loopFlag: string
  mergeFlag: string
  planVersionId: string
  projectLocation: string
  sample: string
  sampleAmount: number | null
  timingFlag: string
  frequencyName: string
}

interface TopicMainDataItem {
  title: string
  id: string
  inspectIndexMaterialIds: string
  inspectMaterialCodes: string
  planVersionId: string
  projectLocation: string
  indexCode: string
  indexName: string
  indexUnit: string
  indexMethod: string
  sample: string
  cooperate: string
  sampleAmount: number | null
  frequencyName: string
  frequencyId: string
  timingFlag: string
  keyIndexFlag: string
  mergeFlag: string
  loopFlag: string
  coInspect: {
    deptId: string
    deptName: string
  }
  coInspectList: any[]
  inspect: {
    deptId: string
    deptName: string
  }
  inspectList: any[]
  inspectMaterialAlls: TreeDataItem[]
}

interface MaterialTreeData {
  id: string // 主键
  parentId: string // "上级类别":
  inspectTypeName: string // 类别名称
}

interface FrequencyIdOptions{
  additionalName: string
  changed: string
  changer: string
  dateUnit: string
  frequency: number
  frequencyName: string
  id: string
  inspectAdditionalId: string
  inspectCycleId: string
}

interface State {
    cssForformLabelWidth: string
    isDialogShow: boolean
    currentInspectScene: string
    pageMainTitle: string
    pageLeftColumnTitle: string
    pageRightColumnTitle: string
    textForSearch: string // 指标名称查找
    totalItems: number
    currentPage: number
    pageSize: number
    topicMainData: TopicMainData[] // 右边 table
    treeData: TreeData[]
    materialTreeData: MaterialTreeData[]
    globleItem: TopicMainDataItem
    isShowSearchBar: boolean
    inspectTypeIds: string[]
    initFocusNode: string
    multipleSelection: string[]
    currentVersion: string
    currentCategoryId: string
    canEditCurrentPage: string
    indexCodeOptions: IndexCodeOptions[]
    currentFocusTargetObj:TreeData
    frequencyIdOptions: FrequencyIdOptions[]
    orgTreeDataOptions: any[]
}

export default defineComponent({
  name: 'ProcessInspectionPlanPlanConfiguration',
  components: {
  },
  props: {
    newsletterPopup: {
      type: String,
      default: '0'
    }
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const router = useRouter()
    const { gotoPage, tabsCloseCurrentHandle } = layoutTs()
    const store = useStore()
    const state = reactive<State>({
      isDialogShow: false,
      currentInspectScene: 'PROCESS', // 过程检验计划
      pageMainTitle: '计划配置',
      pageLeftColumnTitle: '检验类别',
      pageRightColumnTitle: '计划明细',
      cssForformLabelWidth: '160px',
      textForSearch: '',
      totalItems: 0,
      currentPage: 1,
      pageSize: 10,
      topicMainData: [],
      treeData: [],
      materialTreeData: [],
      currentCategoryId: '',
      currentVersion: '',
      globleItem: {
        title: '',
        id: '',
        inspectIndexMaterialIds: '',
        inspectMaterialCodes: '',
        planVersionId: '',
        projectLocation: '',
        indexCode: '', // 指标编码
        indexName: '', // 指标名称
        indexUnit: '', // 单位
        indexMethod: '', // 方法
        sample: '', // x配合取样
        cooperate: '', // x取样单位
        sampleAmount: null, // 留样数量 // v
        frequencyName: '', // 检验频次
        frequencyId: '',
        timingFlag: 'N', // 定时触发
        keyIndexFlag: 'N', // 关键指标 // v
        mergeFlag: 'N', // 合并属性 // v
        loopFlag: 'N', // 轮循否
        coInspect: { // 配合检验
          deptId: '',
          deptName: ''
        },
        coInspectList: [],
        inspect: { // 检验部门
          deptId: '',
          deptName: ''
        },
        inspectList: [],
        inspectMaterialAlls: []
      },
      isShowSearchBar: true,
      inspectTypeIds: [],
      initFocusNode: '',
      multipleSelection: [],
      indexCodeOptions: [],
      canEditCurrentPage: '0',
      currentFocusTargetObj: {
        assistFlag: '',
        id: '',
        inspectTypeCode: '',
        inspectTypeName: '',
        children: [],
        inspectMaterialAlls: [],
        parentId: '',
        parentName: '',
        _level: 0,
        canEdit: false,
        canDelete: false,
        canAdd: false,
        canGenerate: false,
        canClick: true,
        projectLocation: '',
        isFinalNode: false

      },
      frequencyIdOptions: [],
      orgTreeDataOptions: []
    })
    const refTreeModule = ref()
    const reset = () => {
      state.inspectTypeIds = []
      state.materialTreeData = []
      state.globleItem = {
        title: '',
        id: '',
        inspectIndexMaterialIds: '',
        inspectMaterialCodes: '',
        planVersionId: state.currentVersion,
        projectLocation: '', // 1项目位置
        indexCode: '', // 指标编码
        indexName: '', // 指标名称
        indexUnit: '', // 单位
        indexMethod: '', // 方法
        sample: '', // x配合取样
        cooperate: '', // x取样单位
        sampleAmount: 0, // 留样数量 // v
        frequencyName: '', // 检验频次
        frequencyId: '',
        timingFlag: 'N', // 定时触发
        keyIndexFlag: 'N', // 关键指标 // v
        mergeFlag: 'N', // 合并属性 // v
        loopFlag: 'N', // 轮循否
        coInspect: {
          deptId: '',
          deptName: ''
        },
        coInspectList: [],
        inspect: {
          deptId: '',
          deptName: ''
        },
        inspectList: [],
        inspectMaterialAlls: []
      }
    }
    const getPlanDetail = (val:TreeData) => {
      console.log('点击节点')
      console.log(val)
      state.currentFocusTargetObj = JSON.parse(JSON.stringify(val))
      state.textForSearch = ''
      state.currentPage = 1
      state.pageSize = 10
      state.totalItems = 0

      // if (val.isFinalNode === true) {
      //   console.log('物料')
      //   state.currentCategoryId = val.markParentId
      //   state.isShowSearchBar = false
      //   apiPlanDetail(val.markParentId, val.itemId, state.currentPage, state.pageSize)
      // } else {
      // console.log('类')
      state.currentCategoryId = val.id
      state.isShowSearchBar = true
      apiPlanDetail(val.id, '', state.currentPage, state.pageSize)
      // }
    }

    // [ACT] 计划明细
    const apiPlanDetail = (currentCategoryId:string, searchString = '', currentPage:number, pageSize:number) => {
      MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_QUERY_API({
        indexCodeOrName: searchString,
        planVersionId: state.currentVersion,
        inspectMaterialIds: state.currentFocusTargetObj ? state.currentFocusTargetObj.inspectMaterialAlls.map(item => item.id) : [],
        current: currentPage,
        size: pageSize
      }).then((res) => {
        console.log('计划明细明细')
        console.log(res.data.data)
        state.topicMainData = res.data.data.records
        state.currentPage = res.data.data.current
        state.pageSize = res.data.data.size
        state.totalItems = res.data.data.total
      })
    }

    const handleSizeChange = (pageSize: number) => { // 每页条数切换
      state.currentPage = 1
      state.pageSize = pageSize
      apiPlanDetail(state.currentCategoryId, state.textForSearch, state.currentPage, state.pageSize)
    }
    const handleCurrentChange = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      apiPlanDetail(state.currentCategoryId, state.textForSearch, state.currentPage, state.pageSize)
    }

    // [ACT:define] 获取 tree-data
    const getBaseData = () => {
      INSPECT_INDEX_PARAMETER_RELATIVE_ITEM_API({
      }).then((res) => {
        state.textForSearch = ''
        state.isShowSearchBar = true
        console.log('res.data.data')
        console.log(res.data.data)
        state.treeData = treeDataTranslater(JSON.parse(JSON.stringify(res.data.data)), 'id', 'parentId')
        console.log('state.treeData')
        console.log(state.treeData)
        // 一进页面默认跑第一笔
        if (state.currentCategoryId === '') {
          state.initFocusNode = state.treeData[0].id
          refTreeModule.value.focusCurrentNodeNumber = state.treeData[0].id
          getPlanDetail(state.treeData[0])
        } else {
          refTreeModule.value.focusCurrentNodeNumber = state.currentCategoryId
          getPlanDetail(state.currentFocusTargetObj)
        }
      })
    }

    // [ACT:trans] 获取组织架构
    const treeDataTranslater = (data: any[], id: string, pid: string) => {
      const res: any[] = []
      const temp: any = {}
      for (let i = 0; i < data.length; i++) {
        // 追加叶子结点  data[i].assistFlag !== 'Y'
        if (data[i].inspectMaterialAlls.length !== 0) { // 生产辅助
          data[i].children = []
          data[i].inspectMaterialAlls.forEach((item:TreeDataItem) => {
            // data[i].children.push({ inspectTypeName: item, isFinalNode: true, markParentId: data[i].id, itemId: item.slice(item.lastIndexOf(' ') + 1), id: data[i].id + index })
            data[i].children.push({
              inspectTypeName: item.inspectTypeName,
              isFinalNode: true,
              markParentId: data[i].id,
              id: item.id,
              inspectMaterialCode: item.inspectMaterialCode,
              inspectMaterialName: item.inspectMaterialName,
              inspectMaterialAlls: [],
              projectLocation: '',
              canClick: data[i].assistFlag !== 'Y',
              canEdit: true,
              canDelete: true,
              canAdd: true,
              canGenerate: true,
              disabled: data[i].assistFlag !== 'Y'
            })
          })
        } else {
          data[i].isFinalNode = false
        }
        if (data[i].parentId === '0') { // 第一级
          data[i].canEdit = true // 是否可编辑
          data[i].canDelete = false // 是否可删除
          data[i].canAdd = false // 是否可新增
          data[i].canGenerate = false // 是否可生成
          data[i].disabled = true
        } else { // 第一级以外
          data[i].canEdit = true
          data[i].canDelete = true
          data[i].canAdd = true
          data[i].canGenerate = true
          data[i].disabled = false
        }
        data[i].projectLocation = ''
        data[i].canClick = true
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

          if (temp[data[k][pid]]._level === 1) {
            temp[data[k][pid]].projectLocation = temp[data[k][pid]].inspectTypeName
          }
          data[k].projectLocation = temp[data[k][pid]].projectLocation + '-' + data[k].inspectTypeName
          if (data[k].inspectMaterialAlls.length !== 0) {
            data[k].inspectMaterialAlls.forEach((subItem:TreeDataItem, index:number) => {
              subItem.projectLocation = data[k].projectLocation + '-' + subItem.inspectMaterialName
              data[k].children[index].projectLocation = data[k].projectLocation + '-' + subItem.inspectMaterialName
            })
          }
          temp[data[k][pid]].children.push(data[k])
        } else {
          res.push(data[k])
        }
      }
      return res
    }

    // [EVENT:change] 指标编码
    const handleSelectInspectMaterialChange = (val:string) => {
      state.indexCodeOptions.forEach(item => {
        if (item.indexCode === val) {
          state.globleItem.indexName = item.indexName
          state.globleItem.indexUnit = item.indexUnit
          state.globleItem.indexMethod = item.indexMethod
          state.globleItem.inspectMaterialCodes = item.inspectMaterialCodes
          state.globleItem.inspectIndexMaterialIds = item.inspectIndexMaterialIds
        }
      })
    }

    // [ACT:trans] 获取组织架构去掉 children
    const cascaderTranslate = (data: any) => {
      data.forEach((item: any) => {
        if (item.children.length) {
          cascaderTranslate(item.children)
        } else {
          delete item.children
        }
      })
    }

    // [ACT:define] 获取组织架构
    const getOrgStructure = async () => {
      const res = await ORG_TREE_API({ factory: JSON.parse(sessionStorage.getItem('system') || '{}').id || '' })

      cascaderTranslate(res.data.data)
      state.orgTreeDataOptions = res.data.data
      console.log('获取组织架构(处理过)')
      console.log(state.orgTreeDataOptions)
    }

    onMounted(() => {
      console.log('我的版本号是？')
      console.log(router.currentRoute.value.query.versionID)
      if (!router.currentRoute.value.query.versionID) {
        tabsCloseCurrentHandle()
        proxy.$warningToast('版本号无法识别，请重新选择！')
        gotoPage({
          path: 'qms-pages-ManagementPlan-FoodSafetyPlan-index'
        })
        return
      }
      if (store.state.common.planFoodVersionReadOnly === '') {
        store.commit('common/updatePlanFoodVersionReadOnly', router.currentRoute.value.query.versionID as string)
      }
      state.currentVersion = router.currentRoute.value.query.versionID ? router.currentRoute.value.query.versionID as string : store.state.common.planFoodVersionReadOnly

      // [ACT:get] 获取 tree-data
      getBaseData()
      // [ACT:get] 获取组织架构
      getOrgStructure()
    })

    return {
      ...toRefs(state),
      // EVENT
      handleSizeChange,
      handleCurrentChange,
      handleSelectInspectMaterialChange,
      // BTN
      // ACT
      getOrgStructure,
      getPlanDetail,
      apiPlanDetail,
      reset,
      // REF
      refTreeModule
    }
  }
})
</script>

<style scoped>

</style>
