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
            @keyup.enter="doPlanDetailGet(currentCategoryId,textForSearch,1,10)">
          </el-input>
          <el-button icon="el-icon-search" class="topic-button" size="small" @click="doPlanDetailGet(currentCategoryId,textForSearch,1,10)">查询</el-button>
          <el-button icon="el-icon-plus" class="topic-button" type="primary" size="small" @click="btnClickItemAddOrEditForTopicMainData('add',{})" :disabled="!currentFocusTargetObj.canAdd" >新增</el-button>
          <el-button icon="el-icon-delete" class="topic-button" type="danger" size="small"  @click="btnClickItemsDeleteForTopicMainData" :disabled="!currentFocusTargetObj.canDelete">批量删除</el-button>
          <el-button icon="el-icon-news" class="topic-button" type="primary" size="small" @click="btnClickGenerateForTopicMainData" :disabled="!currentFocusTargetObj.canGenerate">生成</el-button>
          <el-button icon="el-icon-edit" class="topic-button" type="primary" size="small" @click="btnClickItemBatchEditForTopicMainData" :disabled="!currentFocusTargetObj.canEdit">编辑</el-button>
        </template>
      </div>
     <el-table
        :data="topicMainData"
        height="500"
        border
        tooltip-effect="dark"
        class="bueatyScroll"
        style="width: 100%;"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" :index="index => index + 1 + (Number(currentPage) - 1) * (Number(pageSize))" label="序号"  width="55"  align="center" size="small" fixed />
        <el-table-column label="物料" prop="inspectMaterialTypeName" :show-overflow-tooltip="true" min-width="180" />
        <el-table-column label="指标" prop="indexCode" :show-overflow-tooltip="false" min-width="240" >
          <template #default="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.indexMethod"
              placement="top-end"
            ><div style="white-space: nowrap;">{{scope.row.indexCode}} {{scope.row.indexName}} {{scope.row.indexUnit}}</div></el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="检验频次" prop="frequencyName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="轮循否" prop="loopFlag" :show-overflow-tooltip="true" min-width="100" >
          <template #default="scope">
            {{scope.row.loopFlag==='Y'?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column label="检验部门" prop="inspect.deptName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="配合检验" prop="coInspect.deptName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="取样部门" prop="sample" :show-overflow-tooltip="true" min-width="100" >
          <template #default="scope">
            {{scope.row.sample}}
          </template>
        </el-table-column>
        <el-table-column label="配合取样" prop="cooperate" :show-overflow-tooltip="true" min-width="108" >
          <template #default="scope">
            {{scope.row.cooperate}}
          </template>
        </el-table-column>
        <el-table-column label="定时触发" prop="timingFlag" :show-overflow-tooltip="true" min-width="100" >
          <template #default="scope">
            {{scope.row.timingFlag==='Y'?'是':'否'}}
          </template>
        </el-table-column>

        <el-table-column label="留样" prop="sampleAmount" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="关键指标" prop="keyIndexFlag" :show-overflow-tooltip="true" min-width="100" >
          <template #default="scope">
            {{scope.row.keyIndexFlag==='Y'?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column label="合并指标" prop="mergeFlag" :show-overflow-tooltip="true" min-width="100" >
          <template #default="scope">
            {{scope.row.mergeFlag==='Y'?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" header-align="left" align="left" width="80">
            <template #default="scope">
                <el-button  type="text" icon="el-icon-edit" @click="btnClickItemAddOrEditForTopicMainData('edit',scope.row)" class="role__btn">
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
  <!--新增/编辑-->
  <el-dialog :title="formGlobleItem.title" v-model="isDialogShow" width="40%" >
    <el-form ref="refGlobleItem" :model="formGlobleItem" :rules="ruleGlobleItem">
      <el-form-item label="项目位置：" prop="projectLocation" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.projectLocation" class="140px" autocomplete="off" maxlength="10" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="指标编码：" :label-width="cssForformLabelWidth" prop="indexCode">
        <!-- <el-input v-model="formGlobleItem.indexCode" class="140px" autocomplete="off" maxlength="10" readonly></el-input> -->
        <el-select v-model="formGlobleItem.indexCode" placeholder="请选择" style="width:100%" filterable @change="handleSelectInspectMaterialChange" clearable>
          <el-option v-for="(opt, optIndex) in indexCodeOptions" :key="optIndex" :label="opt.indexNameUnitMethod" :value="opt.indexCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="指标名称：" prop="indexName" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.indexName" class="140px" autocomplete="off" maxlength="10" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="单位：" prop="indexUnit" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.indexUnit" class="140px" autocomplete="off" maxlength="10" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="方法：" prop="indexMethod" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.indexMethod" class="140px" autocomplete="off" maxlength="10" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="检验部门：" prop="inspectList" :label-width="cssForformLabelWidth">
          <tree-dialog
            ref="refInspect"
            v-model="formGlobleItem.inspectList"
            :tree-data="orgTreeDataOptions"
            :leafOnly="false"
            :checkStrictly="true"
            :returnObj="true"
            :multiChecked="false"
            :tree-props="{ label: 'deptName', children: 'children' }"
          />
      </el-form-item>
      <el-form-item label="配合检验：" prop="coInspectList" :label-width="cssForformLabelWidth">
          <tree-dialog
            ref="refCoInspect"
            v-model="formGlobleItem.coInspectList"
            :tree-data="orgTreeDataOptions"
            :leafOnly="false"
            :checkStrictly="true"
            :returnObj="true"
            :multiChecked="false"
            :tree-props="{ label: 'deptName', children: 'children' }"
          />
      </el-form-item>
       <el-form-item label="取样部门：" prop="sample" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.sample" class="140px" autocomplete="off" maxlength="10" :disabled="true"  placeholder="暂无内容"></el-input>
        </el-form-item>
      <el-form-item label="配合取样：" prop="cooperate" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.cooperate" class="140px" autocomplete="off" maxlength="10" :disabled="true" placeholder="暂无内容"></el-input>
      </el-form-item>
      <el-form-item label="检验频次：" prop="frequencyId" :label-width="cssForformLabelWidth">
        <el-select v-model="formGlobleItem.frequencyId" placeholder="请选择" style="width:100%" filterable @change="handleSelectFrequencyChange" clearable>
          <el-option v-for="(opt, optIndex) in frequencyIdOptions" :key="optIndex" :label="opt.frequencyName" :value="opt.id" />
        </el-select>
      </el-form-item>
       <el-form-item label="定时触发：" prop="timingFlag"  :label-width="cssForformLabelWidth">
          <div>
            <el-radio v-model="formGlobleItem.timingFlag" label="Y">是</el-radio>
            <el-radio v-model="formGlobleItem.timingFlag" label="N">否</el-radio>
          </div>
      </el-form-item>
      <el-form-item label="关键指标：" prop="keyIndexFlag"  :label-width="cssForformLabelWidth">
          <div>
            <el-radio v-model="formGlobleItem.keyIndexFlag" label="Y">是</el-radio>
            <el-radio v-model="formGlobleItem.keyIndexFlag" label="N">否</el-radio>
          </div>
      </el-form-item>
            <el-form-item label="合并属性：" prop="mergeFlag"  :label-width="cssForformLabelWidth">
          <div>
            <el-radio v-model="formGlobleItem.mergeFlag" label="Y">是</el-radio>
            <el-radio v-model="formGlobleItem.mergeFlag" label="N">否</el-radio>
          </div>
      </el-form-item>

      <el-form-item label="轮循：" prop="loopFlag"  :label-width="cssForformLabelWidth">
          <div>
            <el-radio v-model="formGlobleItem.loopFlag" label="Y">是</el-radio>
            <el-radio v-model="formGlobleItem.loopFlag" label="N">否</el-radio>
          </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" class="topic-button" icon="el-icon-circle-close" @click="btnClickItemClearForDialog('refGlobleItem')">取消</el-button>
        <el-button size="small" class="topic-button" icon="el-icon-circle-check" type="primary" @click="btnClickItemConfirmForDialog">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!--批次编辑-->
   <el-dialog :title="formBatchEditItems.title" v-model="isBatchEditDialogShow" width="40%" >
    <el-form ref="refBatchEditItems" :model="formBatchEditItems" class="batch-edit-form" >
      <el-form-item label="项目位置：" prop="projectLocation" :label-width="cssForformLabelWidth">
          <el-input v-model="formBatchEditItems.projectLocation" class="140px" autocomplete="off" maxlength="10" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="检验部门：" prop="inspectList" :label-width="cssForformLabelWidth">
        <el-checkbox v-model="formBatchEditItems.inspectListChecked" label="" class="checkbox-position" @change="val=>changeChechBox(val,'inspectList')"></el-checkbox>
        <tree-dialog
          ref="refInspectOfBatchEdit"
          v-model="formBatchEditItems.inspectList"
          :tree-data="orgTreeDataOptions"
          :leafOnly="false"
          :checkStrictly="true"
          :returnObj="true"
          :multiChecked="false"
          :tree-props="{ label: 'deptName', children: 'children' }"
          :disabled="!formBatchEditItems.inspectListChecked"
        />
      </el-form-item>
      <el-form-item label="配合检验：" prop="coInspectList" :label-width="cssForformLabelWidth">
          <el-checkbox v-model="formBatchEditItems.coInspectListChecked" label="" class="checkbox-position" @change="val=>changeChechBox(val,'coInspectList')"></el-checkbox>
          <tree-dialog
            ref="refCoInspectOfBatchEdit"
            v-model="formBatchEditItems.coInspectList"
            :tree-data="orgTreeDataOptions"
            :leafOnly="false"
            :checkStrictly="true"
            :returnObj="true"
            :multiChecked="false"
            :tree-props="{ label: 'deptName', children: 'children' }"
            :disabled="!formBatchEditItems.coInspectListChecked"
          />
      </el-form-item>

      <el-form-item label="检验频次：" prop="frequencyId" :label-width="cssForformLabelWidth">
        <el-checkbox v-model="formBatchEditItems.frequencyIdChecked" label="" class="checkbox-position" @change="val=>changeChechBox(val,'frequencyId')"></el-checkbox>
        <el-select v-model="formBatchEditItems.frequencyId" placeholder="请选择" style="width:100%" filterable @change="handleSelectFrequencyChange" clearable :disabled="!formBatchEditItems.frequencyIdChecked">
          <el-option v-for="(opt, optIndex) in frequencyIdOptions" :key="optIndex" :label="opt.frequencyName" :value="opt.id" />
        </el-select>
      </el-form-item>
       <el-form-item label="定时触发：" prop="timingFlag"  :label-width="cssForformLabelWidth">
          <el-checkbox v-model="formBatchEditItems.timingFlagChecked" label="" class="checkbox-position" @change="val=>changeChechBox(val,'timingFlag')"></el-checkbox>
          <div>
            <el-radio v-model="formBatchEditItems.timingFlag" :disabled="!formBatchEditItems.timingFlagChecked" label="Y">是</el-radio>
            <el-radio v-model="formBatchEditItems.timingFlag" :disabled="!formBatchEditItems.timingFlagChecked" label="N">否</el-radio>
          </div>
      </el-form-item>
      <el-form-item label="关键指标：" prop="keyIndexFlag"  :label-width="cssForformLabelWidth">
          <el-checkbox v-model="formBatchEditItems.keyIndexFlagChecked" label="" class="checkbox-position" @change="val=>changeChechBox(val,'keyIndexFlag')"></el-checkbox>
          <div>
            <el-radio v-model="formBatchEditItems.keyIndexFlag" :disabled="!formBatchEditItems.keyIndexFlagChecked" label="Y">是</el-radio>
            <el-radio v-model="formBatchEditItems.keyIndexFlag" :disabled="!formBatchEditItems.keyIndexFlagChecked" label="N">否</el-radio>
          </div>
      </el-form-item>
      <el-form-item label="合并属性：" prop="mergeFlag"  :label-width="cssForformLabelWidth">
        <el-checkbox v-model="formBatchEditItems.mergeFlagChecked" label="" class="checkbox-position"  @change="val=>changeChechBox(val,'mergeFlag')"></el-checkbox>
        <div>
          <el-radio v-model="formBatchEditItems.mergeFlag" :disabled="!formBatchEditItems.mergeFlagChecked" label="Y">是</el-radio>
          <el-radio v-model="formBatchEditItems.mergeFlag" :disabled="!formBatchEditItems.mergeFlagChecked" label="N">否</el-radio>
        </div>
      </el-form-item>
      <el-form-item label="轮循：" prop="loopFlag"  :label-width="cssForformLabelWidth">
        <el-checkbox v-model="formBatchEditItems.loopFlagChecked" label="" class="checkbox-position" @change="val=>changeChechBox(val,'loopFlag')"></el-checkbox>
        <div>
          <el-radio v-model="formBatchEditItems.loopFlag" :disabled="!formBatchEditItems.loopFlagChecked" label="Y">是</el-radio>
          <el-radio v-model="formBatchEditItems.loopFlag" :disabled="!formBatchEditItems.loopFlagChecked" label="N">否</el-radio>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" class="topic-button" icon="el-icon-circle-close" @click="btnClickItemClearForDialog('refBatchEditItems')">取消</el-button>
        <el-button size="small" class="topic-button" icon="el-icon-circle-check" type="primary" @click="btnClickBatchCopyItemConfirmForDialog">确定</el-button>
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
  MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_BATCH_UPDATE_API, // 批次编辑
  MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_DELETE_API,
  MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_GENERATE_API,
  INSPECT_TYPE_DETAIL_API,
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

// interface FormBatchEditItems{
//         title: string
//         projectLocation: string
//         frequencyIdChecked: boolean
//         frequencyId: string
//         keyIndexFlagChecked: boolean
//         keyIndexFlag: string
//         mergeFlagChecked: boolean
//         mergeFlag: string
//         loopFlagChecked: boolean
//         loopFlag: string
//         timingFlagChecked: boolean
//         timingFlag: string
//         coInspectListChecked: boolean
//         coInspectList: [],
//         coInspect: {
//           deptId: string
//           deptName: string
//         },
//         inspectListChecked: boolean
//         inspectList: [],
//         inspect: {
//           deptId: string
//           deptName: string
//         },
//         planConfigureIds: string[]
// }

interface State {
    cssForformLabelWidth: string
    isDialogShow: boolean
    isBatchEditDialogShow: boolean
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
    formBatchEditItems:any
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
    const refInspect = ref()
    const refCoInspect = ref()
    const refCoInspectOfBatchEdit = ref()
    const refInspectOfBatchEdit = ref()
    const state = reactive<State>({
      isDialogShow: false,
      isBatchEditDialogShow: false,
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
        sample: '', // x取样部门
        cooperate: '', // x配合取样
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
      formBatchEditItems: {
        title: '',
        projectLocation: '', // 项目位置
        frequencyIdChecked: false,
        frequencyId: '',
        keyIndexFlagChecked: false,
        keyIndexFlag: '',
        mergeFlagChecked: false,
        mergeFlag: '',
        loopFlagChecked: false,
        loopFlag: '',
        timingFlagChecked: false,
        timingFlag: '',
        coInspectListChecked: false,
        coInspectList: [],
        coInspect: {
          deptId: '',
          deptName: ''
        },
        inspectListChecked: false,
        inspectList: [],
        inspect: {
          deptId: '',
          deptName: ''
        },
        planConfigureIds: []
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
    const refBatchEditItems = ref()
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
    // [BTN:新增|编辑] 新增
    const btnClickItemAddOrEditForTopicMainData = async (act:string, row:any) => {
      if (act === 'add') {
        state.currentFocusItem = {}
      } else {
        state.currentFocusItem = row
      }
      state.isDialogShow = true
      await getDropDownOptions() // 获取下拉
      await nextTick()
      refGlobleItem.value.resetFields()

      if (act === 'add') {
        state.formGlobleItem = {
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
          sample: '', // x取样部门
          cooperate: '', // x配合取样
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
          inspectMaterialAlls: state.currentFocusTargetObj.inspectMaterialAlls.length ? state.currentFocusTargetObj.inspectMaterialAlls : [state.currentFocusTargetObj]
        }
      } else {
        state.formGlobleItem = {
          title: '计划明细-编辑',
          id: row.id,
          inspectIndexMaterialIds: row.inspectIndexMaterialId,
          inspectMaterialCodes: '',
          planVersionId: state.currentVersion,
          // projectLocation: state.currentFocusTargetObj.projectLocation, // 项目位置
          projectLocation: row.projectLocation, // 项目位置
          indexCode: row.indexCode, // 指标编码
          indexName: row.indexName, // 指标名称
          indexUnit: row.indexUnit, // 单位
          indexMethod: row.indexMethod, // 方法
          sample: row.sample, // x取样部门
          cooperate: row.cooperate, // x配合取样
          sampleAmount: 0, // 留样数量 // v
          frequencyName: row.frequencyName, // 检验频次
          frequencyId: row.frequencyId,
          timingFlag: row.timingFlag, // 定时触发
          keyIndexFlag: row.keyIndexFlag, // 关键指标 // v
          mergeFlag: row.mergeFlag, // 合并属性 // v
          loopFlag: row.loopFlag, // 轮循否
          coInspect: row.coInspect,
          inspectMaterialId: row.inspectMaterialId,
          coInspectList: row.coInspect ? setOrGetData([row.coInspect], 'set') : [],
          inspect: row.inspect,
          inspectList: row.inspect ? setOrGetData([row.inspect], 'set') : [],
          inspectMaterialAlls: state.currentFocusTargetObj.inspectMaterialAlls.length ? state.currentFocusTargetObj.inspectMaterialAlls : [state.currentFocusTargetObj]
        }
      }
      await rewriteFormData(act) // 获取下拉与改值
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
        sample: '', // x取样部门
        cooperate: '', // x配合取样
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
        // inspectMaterialIds: tempList,
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
      // 混乱版本，勿取用
      const res: any[] = []
      const temp: any = {}
      for (let i = 0; i < data.length; i++) {
        // 追加叶子结点  data[i].assistFlag !== 'Y'
        if (data[i].inspectMaterialAlls.length !== 0) {
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
          data[i].canDelete = true
          data[i].canAdd = true
          data[i].canGenerate = true
          data[i].canEdit = true
        } else {
          // 生产辅助 smell
          if (data[i].assistFlag === 'Y' && data[i].parentId !== '0') {
            data[i].isFinalNode = true
            data[i].canDelete = true
            data[i].canAdd = true
            data[i].canGenerate = true
            data[i].canEdit = true
          } else {
            data[i].isFinalNode = false
          }
        }

        if (data[i].parentId === '0') { // 第一级
          data[i].canEdit = false // 是否可编辑
          data[i].canDelete = false // 是否可删除
          data[i].canAdd = false // 是否可新增
          data[i].canGenerate = false // 是否可生成
          data[i].disabled = true
          data[i]._level = 1
          data[i].projectLocation = data[i].inspectTypeName
        } else { // 第一级以外
          // data[i].canEdit = true
          // data[i].canDelete = true
          // data[i].canAdd = true
          // data[i].canGenerate = true
          data[i].disabled = false
          data[i].projectLocation = ''
        }

        data[i].canClick = true
        temp[data[i][id]] = data[i]
      }

      for (let k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
          if (!temp[data[k][pid]].children) {
            temp[data[k][pid]].children = []
          }

          if (!data[k]._level) {
            data[k]._level = temp[data[k][pid]]._level + 1
          }

          if (data[k]._level !== 1) {
            data[k].projectLocation = temp[data[k][pid]].projectLocation + '-' + data[k].inspectTypeName
          }

          if (data[k].inspectMaterialAlls.length) {
            data[k].inspectMaterialAlls.forEach((subItem:TreeDataItem, index:number) => {
              subItem.projectLocation = data[k].projectLocation
              data[k].children[index].projectLocation = data[k].projectLocation
            })
          }
          temp[data[k][pid]].children.push(data[k])
        } else {
          if (data[k].inspectMaterialAlls.length) {
            data[k].inspectMaterialAlls.forEach((subItem:TreeDataItem, index:number) => {
              subItem.projectLocation = data[k].projectLocation + '-' + subItem.inspectMaterialName
              data[k].children[index].projectLocation = data[k].projectLocation + '-' + subItem.inspectMaterialName
            })
          }
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
    const btnClickItemsDeleteForTopicMainData = () => {
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
        btnClickItemClearForDialog('refGlobleItem')
      })
    }

    // [BTN:生成]
    const btnClickGenerateForTopicMainData = async () => {
      // hint: 生产辅助的格式特例
      let tempInspectMaterialAlls:any[] = []
      let tempInspectTypeId = state.currentFocusTargetObj.id
      if (state.currentFocusTargetObj.assistFlag === 'Y' && state.currentFocusTargetObj._level === 1) { // 生產輔助 非子節點
        state.currentFocusTargetObj.children.forEach((item:any) => {
          tempInspectMaterialAlls.push({
            id: item.id,
            inspectMaterialCode: item.inspectTypeCode,
            inspectMaterialName: item.inspectTypeName,
            inspectTypeName: `${item.inspectTypeName} ${item.inspectTypeCode}`
          })
        })
      } else if (state.currentFocusTargetObj.assistFlag === 'Y' && state.currentFocusTargetObj._level === 2) { // 生產輔助 子節點
        tempInspectMaterialAlls = [{
          id: state.currentFocusTargetObj.id,
          inspectMaterialCode: state.currentFocusTargetObj.inspectTypeCode,
          inspectMaterialName: state.currentFocusTargetObj.inspectTypeName,
          inspectTypeName: `${state.currentFocusTargetObj.inspectTypeName} ${state.currentFocusTargetObj.inspectTypeCode}`
        }]
      } else if (!state.currentFocusTargetObj.isFinalNode) { // 生產輔助外 非子節點
        tempInspectMaterialAlls = state.currentFocusTargetObj.inspectMaterialAlls
      } else { // 生產輔助外 子節點
        tempInspectMaterialAlls.push(state.currentFocusTargetObj)
        tempInspectTypeId = state.currentFocusTargetObj.markParentId
      }

      await MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_GENERATE_API({
        inspectMaterialAlls: tempInspectMaterialAlls,
        inspectScene: state.currentInspectScene,
        planVersionId: state.currentVersion,
        projectLocation: state.currentFocusTargetObj.projectLocation,
        inspectTypeId: tempInspectTypeId
      })
      proxy.$successToast('操作成功')
      getPlanDetail(state.currentFocusTargetObj)
    }

    // [BTN:批次编辑]
    const btnClickItemBatchEditForTopicMainData = async () => {
      // if (!state.multipleSelection.length) {
      //   proxy.$warningToast('请选择数据')
      //   return
      // }

      state.isBatchEditDialogShow = true
      await getDropDownOptions() // 获取下拉
      await nextTick()
      refBatchEditItems.value.resetFields()

      state.formBatchEditItems = {
        title: '批量编辑',
        projectLocation: state.currentFocusTargetObj.projectLocation, // 项目位置
        frequencyIdChecked: false,
        frequencyId: '',
        keyIndexFlagChecked: false,
        keyIndexFlag: '',
        mergeFlagChecked: false,
        mergeFlag: '',
        loopFlagChecked: false,
        loopFlag: '',
        timingFlagChecked: false,
        timingFlag: '',
        coInspectListChecked: false,
        coInspectList: [],
        coInspect: {
          deptId: '',
          deptName: ''
        },
        inspectListChecked: false,
        inspectList: [],
        inspect: {
          deptId: '',
          deptName: ''
        },
        planConfigureIds: state.multipleSelection.length ? state.multipleSelection : state.topicMainData.map(item => item.id)
      }
      // await rewriteFormData(act) // 获取下拉与改值
    }

    // [ACT:define] 获取指标编码下拉
    const getDropDownOptions = async () => {
      // 获取检验频次下拉
      state.frequencyIdOptions = []
      await INSPECT_INSPECT_FREQUENCY_QUERY_DROPDOWN_API().then((res) => {
        state.frequencyIdOptions = res.data.data
      })
    }
    const rewriteFormData = async (act:string) => {
      // 获取取样部门下拉
      let tempId = state.currentFocusTargetObj.id
      if (act === 'add') {
        if (state.currentFocusTargetObj.isFinalNode && state.currentFocusTargetObj.assistFlag !== 'Y') {
          tempId = state.currentFocusTargetObj.markParentId
        }
      } else {
        tempId = state.currentFocusItem.inspectTypeIds
      }
      await INSPECT_TYPE_DETAIL_API({ id: tempId }).then((res) => {
        state.formGlobleItem.cooperate = res.data.data.cooperate.map((item:any) => item.deptName).join(',')
        state.formGlobleItem.sample = res.data.data.sample.map((item:any) => item.deptName).join(',')
        state.formGlobleItem.sampleAmount = res.data.data.sampleAmount
      })

      // 获取指标编码下拉
      let temp:any[] = []
      if (act === 'add') {
        if (!state.currentFocusTargetObj.isFinalNode && state.currentFocusTargetObj.assistFlag !== 'Y') {
          temp = state.currentFocusTargetObj.inspectMaterialAlls
        } else {
          // 生产辅料新增时处理
          if (state.currentFocusTargetObj.assistFlag === 'Y') {
            state.currentFocusTargetObj.inspectMaterialCode = state.currentFocusTargetObj.inspectTypeCode
          }
          temp = [state.currentFocusTargetObj]
        }
      } else {
        // 生产辅料新增时处理
        if (!state.currentFocusItem.inspectMaterialCode) {
          state.currentFocusItem.inspectMaterialCode = state.currentFocusItem.inspectMaterialTypeCode
        }
        temp = [state.currentFocusItem]
      }

      await MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_INDEX_MATERIAL_QUERY_API({
        inspectMaterialAlls: temp,
        inspectScene: state.currentInspectScene
      }).then((res) => {
        state.indexCodeOptions = res.data.data
      })
    }

    // [BTN:取消][float]
    const btnClickItemClearForDialog = (who:string) => {
      // uploadOfRemoveFile()
      if (who === 'refGlobleItem') {
        reset()
        state.isDialogShow = false
      } else if (who === 'refBatchEditItems') { // 批次编辑初始化
        state.formBatchEditItems = {
          title: '批次编辑',
          projectLocation: state.currentFocusTargetObj.projectLocation, // 项目位置
          frequencyIdChecked: false,
          frequencyId: '',
          keyIndexFlagChecked: false,
          keyIndexFlag: '',
          mergeFlagChecked: false,
          mergeFlag: '',
          loopFlagChecked: false,
          loopFlag: '',
          timingFlagChecked: false,
          timingFlag: 'N',
          coInspectListChecked: false,
          coInspectList: [],
          coInspect: {
            deptId: '',
            deptName: ''
          },
          inspectListChecked: false,
          inspectList: [],
          inspect: {
            deptId: '',
            deptName: ''
          },
          planConfigureIds: []
        }
        state.isBatchEditDialogShow = false
      }
    }

    // [BTN:确认][float] 新增&编辑
    const btnClickItemConfirmForDialog = async () => {
      if (state.formGlobleItem.indexCode === '') {
        proxy.$warningToast('指标编码必填字段未填写，请填写完整')
        return
      }

      if (state.formGlobleItem.inspectList.length === 0) {
        proxy.$warningToast('检验部门必填字段未填写，请填写完整')
        return
      }

      if (state.formGlobleItem.cooperate === '') {
        proxy.$warningToast('取样部门必填字段未填写，请填写完整')
        return
      }

      if (state.formGlobleItem.frequencyName === '') {
        proxy.$warningToast('检验频次必填字段未填写，请填写完整')
        return
      }
      refGlobleItem.value.validate(async (valid: boolean) => {
        if (valid) {
          if (state.formGlobleItem.title === '计划明细-新增') { // 新增
            const tempCoInspectObj = await refCoInspect.value.getCheckedNodes()
            state.formGlobleItem.coInspect = tempCoInspectObj.length ? {
              deptId: tempCoInspectObj[0].id,
              deptName: tempCoInspectObj[0].deptName
            } : null
            const tempinspectObj = await refInspect.value.getCheckedNodes()
            state.formGlobleItem.inspect = tempinspectObj.length ? {
              deptId: tempinspectObj[0].id,
              deptName: tempinspectObj[0].deptName
            } : null
            // 生产辅料新增时处理
            if (state.formGlobleItem.assistFlag === 'Y' && !state.formGlobleItem.inspectMaterialCode) {
              state.formGlobleItem.inspectMaterialCode = state.formGlobleItem.inspectTypeCode
            }
            await MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_INSERT_API({
              ...state.formGlobleItem
            })
          } else { // 编辑
            const tempCoInspectObj = await refCoInspect.value.getCheckedNodes()
            state.formGlobleItem.coInspect = tempCoInspectObj.length ? {
              deptId: tempCoInspectObj[0].id,
              deptName: tempCoInspectObj[0].deptName
            } : null
            const tempinspectObj = await refInspect.value.getCheckedNodes()
            state.formGlobleItem.inspect = tempinspectObj.length ? {
              deptId: tempinspectObj[0].id,
              deptName: tempinspectObj[0].deptName
            } : null
            await MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_UPDATE_API({
              ...state.formGlobleItem
            })
          }

          proxy.$successToast('操作成功')
          getBaseData() // reload
          btnClickItemClearForDialog('refGlobleItem')
        }
      })
    }

    // [BTN:确认][float] 批次编辑
    const btnClickBatchCopyItemConfirmForDialog = async () => {
      if (!state.formBatchEditItems.frequencyIdChecked) {
        state.formBatchEditItems.frequencyId = ''
      }
      if (!state.formBatchEditItems.keyIndexFlagChecked) {
        state.formBatchEditItems.keyIndexFlag = ''
      }
      if (!state.formBatchEditItems.mergeFlagChecked) {
        state.formBatchEditItems.mergeFlag = ''
      }
      if (!state.formBatchEditItems.loopFlagChecked) {
        state.formBatchEditItems.loopFlag = ''
      }
      if (!state.formBatchEditItems.timingFlagChecked) {
        state.formBatchEditItems.timingFlag = ''
      }
      if (!state.formBatchEditItems.inspectListChecked) {
        state.formBatchEditItems.inspectList = []
        state.formBatchEditItems.inspect = null
      }
      if (!state.formBatchEditItems.coInspectListChecked) {
        state.formBatchEditItems.coInspectList = []
        state.formBatchEditItems.coInspect = null
      }

      if (state.formBatchEditItems.coInspectListChecked) {
        const tempCoInspectObj = await refCoInspectOfBatchEdit.value.getCheckedNodes()
        state.formBatchEditItems.coInspect = tempCoInspectObj.length ? {
          deptId: tempCoInspectObj[0].id,
          deptName: tempCoInspectObj[0].deptName
        } : null
      }

      if (state.formBatchEditItems.inspectListChecked) {
        const tempinspectObj = await refInspectOfBatchEdit.value.getCheckedNodes()

        state.formBatchEditItems.inspect = tempinspectObj.length ? {
          deptId: tempinspectObj[0].id,
          deptName: tempinspectObj[0].deptName
        } : null
      }
      if (state.formBatchEditItems.frequencyIdChecked || state.formBatchEditItems.keyIndexFlagChecked || state.formBatchEditItems.mergeFlagChecked || state.formBatchEditItems.loopFlagChecked || state.formBatchEditItems.timingFlagChecked || state.formBatchEditItems.inspectListChecked || state.formBatchEditItems.coInspectListChecked) {
        await MANAGEMENT_INSPECTION_PLAN_CONFIGURATION_PLAN_BATCH_UPDATE_API({
          ...state.formBatchEditItems
        })

        proxy.$successToast('操作成功')
        getBaseData() // reload
      }
      btnClickItemClearForDialog('refBatchEditItems')
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
        } else if (item.children && item.children.length > 0) {
          getEndNodeItems(item.children, container)
        }
      }
    }

    const changeChechBox = (val:boolean, target:string) => {
      if (!val) {
        if (target === 'inspectList' || target === 'coInspectList') {
          state.formBatchEditItems[target] = []
        } else {
          state.formBatchEditItems[target] = ''
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
      handleSelectionChange,
      changeChechBox,
      // BTN
      btnClickItemsDeleteForTopicMainData,
      btnClickItemAddOrEditForTopicMainData,
      btnClickGenerateForTopicMainData,
      btnClickItemBatchEditForTopicMainData,
      btnClickItemClearForDialog,
      btnClickItemConfirmForDialog,
      btnClickBatchCopyItemConfirmForDialog,
      // ACT
      getDropDownOptions,
      getOrgStructure,
      getPlanDetail,
      doPlanDetailGet,
      rewriteFormData,
      reset,
      // REF
      refInspect,
      refCoInspect,
      refCoInspectOfBatchEdit,
      refInspectOfBatchEdit,
      refTreeModule,
      ruleGlobleItem,
      refGlobleItem,
      refBatchEditItems,
      setOrGetData,
      getEndNodeItems
    }
  }
})
</script>

<style scoped>
.checkbox-position{
  position: absolute;
  left: -110px;
}

.batch-edit-form ::v-deep(.el-checkbox .el-checkbox__label){
  display:none

}
</style>
