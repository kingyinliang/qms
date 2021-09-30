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
          <el-button icon="el-icon-plus" class="topic-button" type="primary" size="small" @click="btnAddOrEditItemOfTopicMainData('add',{})" :disabled="!currentFocusTargetObj.canAdd" >新增</el-button>
          <el-button icon="el-icon-delete" class="topic-button" type="danger" size="small"  @click="btnDeleteItemsOfTopicMainData" :disabled="!currentFocusTargetObj.canDelete">批量删除</el-button>
          <el-button icon="el-icon-news" class="topic-button" type="primary" size="small" @click="btnGenerateOfTopicMainData" :disabled="!currentFocusTargetObj.canGenerate">生成</el-button>
        </template>
      </div>
     <el-table
        :data="topicMainData"
        style="width: 100%"
        max-height="500"
        border tooltip-effect="dark"
        class="bueatyScroll"
        @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" />
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
        <el-table-column fixed="right" label="操作" header-align="left" align="left" width="80">
            <template #default="scope">
                <el-button  type="text" icon="el-icon-edit" @click="btnAddOrEditItemOfTopicMainData('edit',scope.row)" class="role__btn">
                    <em>编辑</em>
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
  <el-dialog :title="globleItem.title" v-model="isDialogShow" width="40%" >
    <el-form ref="refGlobleItem" :model="globleItem" :rules="ruleGlobleItem">
      <el-form-item label="项目位置：" prop="projectLocation" :label-width="cssForformLabelWidth">
          <el-input v-model="globleItem.projectLocation" class="140px" autocomplete="off" maxlength="10" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="指标编码：" :label-width="cssForformLabelWidth" prop="indexCode">
        <el-select v-model="globleItem.indexCode" placeholder="请选择" style="width:100%" filterable @change="handleSelectInspectMaterialChange" clearable>
          <el-option v-for="(opt, optIndex) in indexCodeOptions" :key="optIndex" :label="opt.indexCode" :value="opt.indexCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="指标名称：" prop="indexName" :label-width="cssForformLabelWidth">
          <el-input v-model="globleItem.indexName" class="140px" autocomplete="off" maxlength="10" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="单位：" prop="indexUnit" :label-width="cssForformLabelWidth">
          <el-input v-model="globleItem.indexUnit" class="140px" autocomplete="off" maxlength="10" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="方法：" prop="indexMethod" :label-width="cssForformLabelWidth">
          <el-input v-model="globleItem.indexMethod" class="140px" autocomplete="off" maxlength="10" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="检验部门：" prop="inspectList" :label-width="cssForformLabelWidth">
          <tree-dialog
            ref="refInspect"
            v-model="globleItem.inspectList"
            :tree-data="orgTreeDataOptions"
            :leafOnly="false"
            :checkStrictly="true"
            :returnObj="true"
            :multiChecked="false"
            :tree-props="{ label: 'deptName', children: 'children' }"
          />
      </el-form-item>

      <el-form-item label="配合检验：" prop="cooperate" :label-width="cssForformLabelWidth">
          <tree-dialog
            ref="refCoInspect"
            v-model="globleItem.coInspectList"
            :tree-data="orgTreeDataOptions"
            :leafOnly="false"
            :checkStrictly="true"
            :returnObj="true"
            :multiChecked="false"
            :tree-props="{ label: 'deptName', children: 'children' }"
          />
      </el-form-item>
      <el-form-item label="取样部门：" prop="cooperate" :label-width="cssForformLabelWidth">
          <el-input v-model="globleItem.cooperate" class="140px" autocomplete="off" maxlength="10" :disabled="true" placeholder="暂无内容"></el-input>
      </el-form-item>
      <el-form-item label="配合取样：" prop="sample" :label-width="cssForformLabelWidth">
          <el-input v-model="globleItem.sample" class="140px" autocomplete="off" maxlength="10" :disabled="true"  placeholder="暂无内容"></el-input>
        </el-form-item>
      <el-form-item label="检验频次：" prop="frequencyId" :label-width="cssForformLabelWidth">
        <el-select v-model="globleItem.frequencyId" placeholder="请选择" style="width:100%" filterable @change="handleSelectFrequencyChange" clearable>
          <el-option v-for="(opt, optIndex) in frequencyIdOptions" :key="optIndex" :label="opt.frequencyName" :value="opt.id" />
        </el-select>
      </el-form-item>
       <el-form-item label="定时触发：" prop="timingFlag"  :label-width="cssForformLabelWidth">
          <div>
            <el-radio v-model="globleItem.timingFlag" label="Y">是</el-radio>
            <el-radio v-model="globleItem.timingFlag" label="N">否</el-radio>
          </div>
      </el-form-item>
      <el-form-item label="关键指标：" prop="keyIndexFlag"  :label-width="cssForformLabelWidth">
          <div>
            <el-radio v-model="globleItem.keyIndexFlag" label="Y">是</el-radio>
            <el-radio v-model="globleItem.keyIndexFlag" label="N">否</el-radio>
          </div>
      </el-form-item>
            <el-form-item label="合并属性：" prop="mergeFlag"  :label-width="cssForformLabelWidth">
          <div>
            <el-radio v-model="globleItem.mergeFlag" label="Y">是</el-radio>
            <el-radio v-model="globleItem.mergeFlag" label="N">否</el-radio>
          </div>
      </el-form-item>

      <el-form-item label="轮循：" prop="loopFlag"  :label-width="cssForformLabelWidth">
          <div>
            <el-radio v-model="globleItem.loopFlag" label="Y">是</el-radio>
            <el-radio v-model="globleItem.loopFlag" label="N">否</el-radio>
          </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" class="topic-button" icon="el-icon-circle-close" @click="btnItemFloatClear">取消</el-button>
        <el-button size="small" class="topic-button" icon="el-icon-circle-check" type="primary" @click="btnItemFloatConfirm(globleItem.title)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { defineComponent, ref, toRefs, reactive, onMounted, getCurrentInstance, ComponentInternalInstance, nextTick } from 'vue'
import {
  MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_INSERT_API,
  INSPECT_INSPECT_FREQUENCY_QUERY_DROPDOWN_API,
  MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_INDEX_MATERIAL_QUERY_API,
  INSPECT_INDEX_PARAMETER_RELATIVE_ITEM_API,
  MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_QUERY_API,
  MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_UPDATE_API,
  MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_DELETE_API,
  MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_GENERATE_API,
  INSPECT_TYPE_DETAIL_API,
  MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_INDEX_RELATION_TYPE_QUERY_API, // 检验计划配置-检验类信息查询
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
    const { gotoPage, tabsCloseCurrentHandle } = layoutTs()
    const router = useRouter()
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
        cooperate: '', // x取样部门
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
    // TODO
    // [BTN:新增&编辑] 新增
    const btnAddOrEditItemOfTopicMainData = async (act:string, row:any) => {
      console.log('点击')
      console.log(row)

      console.log('state.currentFocusTargetObj')
      console.log(state.currentFocusTargetObj)
      state.isDialogShow = true
      await getDropDownOptions()
      await nextTick()
      refGlobleItem.value.resetFields()

      if (act === 'add') {
        console.log('新增')
        state.globleItem = {
          title: '计划明细-新增',
          id: '',
          inspectIndexMaterialIds: '',
          inspectMaterialCodes: '',
          planVersionId: state.currentVersion,
          projectLocation: state.currentFocusTargetObj.projectLocation, // 1项目位置
          indexCode: row.indexCode, // 指标编码
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
          inspectMaterialAlls: state.currentFocusTargetObj.inspectMaterialAlls
        }
      } else {
        console.log('编辑')
        console.log(row.coInspect)
        console.log(row.inspect)
        state.globleItem = {
          title: '计划明细-编辑',
          id: row.id,
          inspectIndexMaterialIds: row.inspectIndexMaterialId,
          inspectMaterialCodes: '',
          planVersionId: state.currentVersion,
          projectLocation: state.currentFocusTargetObj.projectLocation, // 项目位置
          indexCode: row.indexCode, // 指标编码
          indexName: row.indexName, // 指标名称
          indexUnit: row.indexUnit, // 单位
          indexMethod: row.indexMethod, // 方法
          sample: row.sample, // x配合取样
          cooperate: row.cooperate, // x取样部门
          sampleAmount: 0, // 留样数量 // v
          frequencyName: row.frequencyName, // 检验频次
          frequencyId: row.frequencyId,
          timingFlag: row.timingFlag, // 定时触发
          keyIndexFlag: row.keyIndexFlag, // 关键指标 // v
          mergeFlag: row.mergeFlag, // 合并属性 // v
          loopFlag: row.loopFlag, // 轮循否
          coInspect: row.coInspect,
          coInspectList: setOrGetData([row.coInspect], 'set'),
          inspect: row.inspect,
          inspectList: setOrGetData([row.inspect], 'set'),
          inspectMaterialAlls: state.currentFocusTargetObj.inspectMaterialAlls
        }
        // refInspect.value.setSelectValue([row.inspect])
        // refCoInspect.value.setSelectValue([row.coInspect])
        console.log('state.globleItem')
        console.log(state.globleItem)
      }
    }

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

    // [ACT] 批量删除复选选择
    const handleSelectionChange = (val: TopicMainData[]) => {
      state.multipleSelection = val.map((item: TopicMainData) => item.id)
    }

    // [BTN:批量删除]
    const btnDeleteItemsOfTopicMainData = () => {
      if (!state.multipleSelection.length) {
        proxy.$warningToast('请选择数据')
        return
      }
      proxy.$confirm('是否删除此检测频率，请确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_DELETE_API(state.multipleSelection)
        proxy.$successToast('操作成功')
        getBaseData()
        btnItemFloatClear()
      })
    }

    // [BTN:生成]
    const btnGenerateOfTopicMainData = async () => {
      await MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_GENERATE_API({
        inspectMaterialAlls: state.currentFocusTargetObj.inspectMaterialAlls,
        inspectScene: state.currentInspectScene,
        planVersionId: state.currentVersion,
        projectLocation: state.currentFocusTargetObj.projectLocation,
        inspectTypeId: state.currentFocusTargetObj.id
      })
      proxy.$successToast('操作成功')
    }

    // [ACT:define] 获取指标编码下拉
    const getDropDownOptions = async () => {
      let tempInspectMaterialAlls:any[] = []
      if (!state.currentFocusTargetObj.isFinalNode) {
        tempInspectMaterialAlls = state.currentFocusTargetObj.inspectMaterialAlls
      } else {
        tempInspectMaterialAlls.push(state.currentFocusTargetObj)
      }
      state.indexCodeOptions = []

      // 获取指标编码下拉
      await MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_INDEX_MATERIAL_QUERY_API({
        inspectMaterialAlls: tempInspectMaterialAlls,
        inspectScene: state.currentInspectScene
      }).then((res) => {
        console.log('指标编码下拉')
        console.log(res.data.data)
        state.indexCodeOptions = res.data.data
      })

      // 获取检验频次下拉
      state.frequencyIdOptions = []
      await INSPECT_INSPECT_FREQUENCY_QUERY_DROPDOWN_API().then((res) => {
        console.log('检验频次下拉')
        console.log(res.data.data)
        state.frequencyIdOptions = res.data.data
      })

      // 获取取样部门下拉
      await INSPECT_TYPE_DETAIL_API({ id: state.currentFocusTargetObj.id }).then((res) => {
        console.log('取样部门下拉')
        console.log(res.data.data)
      })

      // 检验类信息查询
      await MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_INDEX_RELATION_TYPE_QUERY_API({ inspectTypeId: state.currentFocusTargetObj.id }).then((res) => {
        console.log('检验类信息')
        console.log(res.data.data)
        state.globleItem.cooperate = res.data.data.cooperate ? res.data.data.cooperate : ''
        state.globleItem.sample = res.data.data.sample ? res.data.data.sample : ''
        state.globleItem.inspect = res.data.data.inspect !== null ? res.data.data.inspect : { deptId: '', deptName: '' }
        state.globleItem.coInspect = res.data.data.coInspect !== null ? res.data.data.coInspect : { deptId: '', deptName: '' }
        state.globleItem.sampleAmount = res.data.data.sampleAmount
      })
    }

    // [BTN:取消][float]
    const btnItemFloatClear = () => {
      // uploadOfRemoveFile()
      reset()
      state.isDialogShow = false
    }

    // TODO
    // [BTN:确认][float]
    const btnItemFloatConfirm = async () => {
      refGlobleItem.value.validate(async (valid: boolean) => {
        if (valid) {
          console.log('state.globleItem')
          console.log(JSON.parse(JSON.stringify(state.globleItem)))
          if (state.globleItem.title === '计划明细-新增') { // 新增
            const tempCoInspectObj = refCoInspect.value.getCheckedNodes()
            console.log(tempCoInspectObj)
            state.globleItem.coInspect = {
              deptId: tempCoInspectObj[0].id,
              deptName: tempCoInspectObj[0].deptName
            }
            const tempinspectObj = refInspect.value.getCheckedNodes()
            console.log(tempinspectObj)
            state.globleItem.inspect = {
              deptId: tempinspectObj[0].id,
              deptName: tempinspectObj[0].deptName
            }

            console.log('计划明细-新增')
            console.log(state.globleItem)
            await MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_INSERT_API({
              ...state.globleItem
            })
          } else { // 编辑
            await MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_UPDATE_API({
              ...state.globleItem
            })
          }

          proxy.$successToast('操作成功')
          getBaseData() // reload
          btnItemFloatClear()
        }
      })
    }

    // [EVENT:change] 检验频次
    const handleSelectFrequencyChange = (val:string) => {
      state.globleItem.frequencyName = state.frequencyIdOptions.filter(item => item.id === val)[0].frequencyName
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

    // 下拉框数据变换
    const setOrGetData = (data: any, type = 'get') => {
      if (type === 'get') {
        return data.getCheckedNodes(true).map((it: any) => { return { deptName: it.deptName, deptId: it.id } })
      } else {
        return data.map((it: any) => it.deptId)
      }
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
      if (store.state.common.planFoodVersion === '') {
        store.commit('common/updatePlanFoodVersion', router.currentRoute.value.query.versionID as string)
      }
      state.currentVersion = router.currentRoute.value.query.versionID ? router.currentRoute.value.query.versionID as string : store.state.common.planFoodVersion

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
      handleSelectionChange,
      // BTN
      btnDeleteItemsOfTopicMainData,
      btnAddOrEditItemOfTopicMainData,
      btnGenerateOfTopicMainData,
      btnItemFloatClear,
      btnItemFloatConfirm,
      // ACT
      getDropDownOptions,
      getOrgStructure,
      getPlanDetail,
      apiPlanDetail,
      reset,
      // REF
      refInspect,
      refCoInspect,
      refTreeModule,
      ruleGlobleItem,
      refGlobleItem,
      setOrGetData
    }
  }
})
</script>

<style scoped>

</style>
