<template>
  <tree-page
    ref="refTreeModule"
    :title="pageMainTitle"
    :leftTitle="pageLeftColumnTitle"
    :rightTitle="pageRightColumnTitle"
    :treeData="treeData"
    :treeProps="{ label: 'inspectTypeName',children:'children' }"
    :defaultFilterNodeProps="{ prop: 'existConfiguration',value:'Y' }"
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
            @keyup.enter="doPlanDetailGet(currentCategoryId,textForSearch,1,10)">
          </el-input>
          <el-button icon="el-icon-search" class="topic-button" size="small" @click="doPlanDetailGet(currentCategoryId,textForSearch,1,10)">查询</el-button>
        </template>
      </div>
     <el-table
        :data="topicMainData"
        max-height="500"
        border
        tooltip-effect="dark"
        class="bueatyScroll"
        style="width: 100%;"
        >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" :index="index => index + 1 + (Number(currentPage) - 1) * (Number(pageSize))" label="序号"  width="55" fixed align="center" size="small" />
        <el-table-column label="物料/类别" prop="inspectMaterialTypeName" :show-overflow-tooltip="true" min-width="180" />
        <el-table-column label="指标编码" prop="indexCode" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="指标名称" prop="indexName" :show-overflow-tooltip="true" min-width="180" />
        <el-table-column label="单位" prop="indexUnit" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="方法" prop="indexMethod" :show-overflow-tooltip="true" min-width="220" />
        <el-table-column label="配合取样" prop="cooperate" :show-overflow-tooltip="true" min-width="108" >
          <template #default="scope">
            {{scope.row.cooperate}}
          </template>
        </el-table-column>
        <el-table-column label="取样部门" prop="sample" :show-overflow-tooltip="true" min-width="100" >
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
  // MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_INDEX_RELATION_TYPE_QUERY_API, // 检验计划配置-检验类信息查询
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
  existConfiguration: string
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
  markParentId: string
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

// interface TopicMainDataItem {
//   title: string
//   id: string
//   inspectIndexMaterialIds: string
//   inspectMaterialCodes: string
//   planVersionId: string
//   projectLocation: string
//   indexCode: string
//   indexName: string
//   indexUnit: string
//   indexMethod: string
//   sample: string
//   cooperate: string
//   sampleAmount: number | null
//   frequencyName: string
//   frequencyId: string
//   timingFlag: string
//   keyIndexFlag: string
//   mergeFlag: string
//   loopFlag: string
//   coInspect: {
//     deptId: string
//     deptName: string
//   }
//   coInspectList: any[]
//   inspect: {
//     deptId: string
//     deptName: string
//   }
//   inspectList: any[]
//   inspectMaterialAlls: TreeDataItem[]
// }

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
    formGlobleItem: any // TopicMainDataItem
    isShowSearchBar: boolean
    inspectTypeIds: string[]
    initFocusNode: string
    multipleSelection: string[]
    currentVersion: string
    currentCategoryId: string
    canEditCurrentPage: string
    indexCodeOptions: IndexCodeOptions[]
    currentFocusTargetObj:any
    currentFocusItem: any
    frequencyIdOptions: FrequencyIdOptions[]
    orgTreeDataOptions: any[]
}

export default defineComponent({
  name: 'ProcessInspectionPlanPlanConfigurationOnlyRead',
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
    const refInspect = ref()
    const refCoInspect = ref()
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
      formGlobleItem: {
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
        cooperate: '', // x取样部门
        sampleAmount: null, // 留样数量
        frequencyName: '', // 检验频次
        frequencyId: '',
        timingFlag: 'N', // 定时触发
        keyIndexFlag: 'N', // 关键指标
        mergeFlag: 'N', // 合并属性
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
        isFinalNode: false,
        markParentId: ''
      },
      currentFocusItem: {},
      frequencyIdOptions: [],
      orgTreeDataOptions: []
    })
    const refTreeModule = ref()
    const refGlobleItem = ref()
    const ruleGlobleItem = {
      indexCode: [
        {
          required: true,
          message: '指标编码',
          trigger: 'blur'
        }
      ],
      inspectList: [
        {
          required: true,
          message: '请选择检验部门',
          trigger: 'blur'
        }
      ],
      cooperate: [
        {
          required: true,
          message: '请选择取样部门',
          trigger: 'blur'
        }
      ],
      frequencyId: [
        {
          required: true,
          message: '检验频次',
          trigger: 'blur'
        }
      ],
      timingFlag: [
        {
          required: true,
          message: '请选择定时触发',
          trigger: 'blur'
        }
      ]
    }
    const reset = () => {
      state.inspectTypeIds = []
      state.materialTreeData = []
      state.formGlobleItem = {
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
        cooperate: '', // x取样部门
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
      state.currentFocusTargetObj = JSON.parse(JSON.stringify(val))
      state.textForSearch = ''
      state.currentPage = 1
      state.pageSize = 10
      state.totalItems = 0
      state.currentCategoryId = val.id
      state.isShowSearchBar = true
      doPlanDetailGet(val.id, '', state.currentPage, state.pageSize)
      // }
    }

    // [ACT] 计划明细
    const doPlanDetailGet = (currentCategoryId:string, searchString = '', currentPage:number, pageSize:number) => {
      const tempList:any[] = []
      if (!state.currentFocusTargetObj.isFinalNode && state.currentFocusTargetObj.children.length !== 0) {
        getEndNodeItems(state.currentFocusTargetObj.children, tempList)
      }

      MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_QUERY_API({
        indexCodeOrName: searchString,
        planVersionId: state.currentVersion,
        inspectMaterialIds: !state.currentFocusTargetObj.isFinalNode ? tempList.map((item:any) => item.id) : [currentCategoryId],
        current: currentPage,
        size: pageSize
      }).then((res) => {
        state.topicMainData = res.data.data.records
        state.currentPage = res.data.data.current
        state.pageSize = res.data.data.size
        state.totalItems = res.data.data.total
      })
    }

    const handleSizeChange = (pageSize: number) => { // 每页条数切换
      state.currentPage = 1
      state.pageSize = pageSize
      doPlanDetailGet(state.currentCategoryId, state.textForSearch, state.currentPage, state.pageSize)
    }
    const handleCurrentChange = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      doPlanDetailGet(state.currentCategoryId, state.textForSearch, state.currentPage, state.pageSize)
    }

    // [ACT:define] 获取 tree-data
    const getBaseData = () => {
      INSPECT_INDEX_PARAMETER_RELATIVE_ITEM_API({
        planVersionId: state.currentVersion
      }).then((res) => {
        state.textForSearch = ''
        state.isShowSearchBar = true
        state.treeData = treeDataTranslater(JSON.parse(JSON.stringify(res.data.data)), 'id', 'parentId')
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
        if (data[i].inspectMaterialAlls.length !== 0) {
          data[i].children = []
          data[i].inspectMaterialAlls.forEach((item:TreeDataItem) => {
            data[i].children.push({
              inspectTypeName: item.inspectTypeName,
              isFinalNode: true,
              markParentId: data[i].id,
              id: item.id,
              inspectMaterialCode: item.inspectMaterialCode,
              inspectMaterialName: item.inspectMaterialName,
              inspectMaterialAlls: [],
              existConfiguration: item.existConfiguration
            })
            if (item.existConfiguration === 'Y') {
              data[i].existConfiguration = 'Y'
            }
          })
        } else {
          // 生产辅助 smell
          if (data[i].assistFlag === 'Y' && data[i].parentId !== '0') {
            data[i].isFinalNode = true
          } else {
            data[i].isFinalNode = false
          }
        }

        if (data[i].parentId === '0') { // 第一级
          data[i]._level = 1
        }
        temp[data[i][id]] = data[i]
      }

      for (let k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
          if (!temp[data[k][pid]].children) {
            temp[data[k][pid]].children = []
          }
          if (data[k].existConfiguration === 'Y') {
            temp[data[k][pid]].existConfiguration = 'Y'
          }

          if (!data[k]._level) {
            data[k]._level = temp[data[k][pid]]._level + 1
          }

          temp[data[k][pid]].children.push(data[k])
        } else {
          res.push(data[k])
        }
      }
      return res
    }

    // [BTN:取消][float]
    const btnClickItemClearForDialog = () => {
      // uploadOfRemoveFile()
      reset()
      state.isDialogShow = false
    }

    // [EVENT:change] 检验频次
    const handleSelectFrequencyChange = (val:string) => {
      state.formGlobleItem.frequencyName = state.frequencyIdOptions.filter(item => item.id === val)[0].frequencyName
    }

    // [EVENT:change] 指标编码
    const handleSelectInspectMaterialChange = (val:string) => {
      state.indexCodeOptions.forEach(item => {
        if (item.indexCode === val) {
          state.formGlobleItem.indexName = item.indexName
          state.formGlobleItem.indexUnit = item.indexUnit
          state.formGlobleItem.indexMethod = item.indexMethod
          state.formGlobleItem.inspectMaterialCodes = item.inspectMaterialCodes
          state.formGlobleItem.inspectIndexMaterialIds = item.inspectIndexMaterialIds
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
    }

    // 下拉框数据变换
    const setOrGetData = (data: any, type = 'get') => {
      if (type === 'get') {
        return data.getCheckedNodes(true).map((it: any) => { return { deptName: it.deptName, deptId: it.id } })
      } else {
        return data.map((it: any) => it.deptId)
      }
    }

    const getEndNodeItems = (menuTreeList:any, container:any) => {
      for (const item of menuTreeList) {
        if (item.isFinalNode === true) {
          container.push(item)
        } else if (item.children.length > 0) {
          getEndNodeItems(item.children, container)
        }
      }
    }

    onMounted(() => {
      if (!router.currentRoute.value.query.versionID) {
        tabsCloseCurrentHandle()
        proxy.$warningToast('版本号无法识别，请重新选择！')
        gotoPage({
          path: 'qms-pages-ManagementPlan-ProcessInspectionPlan-index'
        })
        return
      }
      if (store.state.common.planProcessVersion === '') {
        store.commit('common/updatePlanProcessVersion', router.currentRoute.value.query.versionID as string)
      }
      state.currentVersion = router.currentRoute.value.query.versionID ? router.currentRoute.value.query.versionID as string : store.state.common.planProcessVersion

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
      handleSelectFrequencyChange,
      handleSelectInspectMaterialChange,
      // BTN
      btnClickItemClearForDialog,
      // ACT
      getOrgStructure,
      getPlanDetail,
      doPlanDetailGet,
      reset,
      // REF
      refInspect,
      refCoInspect,
      refTreeModule,
      ruleGlobleItem,
      refGlobleItem,
      setOrGetData,
      getEndNodeItems
    }
  }
})
</script>

<style scoped>

</style>
