<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-10-15 20:07:53
 * @LastEditors: Telliex
 * @LastEditTime: 2021-11-24 14:55:29
-->
<template>
<div class="k-box-card" style="padding:20px 0;">
  <mds-card title="检验需求" :name="'org'" :pack-up="false" style="margin-bottom: 20px; background: #fff;">
    <el-form ref="refFormOfInspectRequest" :model="dataFormOfInspectRequest" :rules="ruleFormOfInspectRequest" :label-width="cssForformLabelWidth">
        <div style="display:flex; justify-content:flex-start;">
          <el-form-item label="任务单号："  prop="tempApplyNo" v-if="pageType!=='add'">
            <el-input v-model="dataFormOfInspectRequest.tempApplyNo"  class="inputWidth" placeholder="请输入" :disabled="true" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="需求部门："  prop="needDeptList" class="required">
             <tree-dialog
                  ref="refNeedDep"
                  v-model="dataFormOfInspectRequest.needDeptList"
                  :tree-data="options"
                  :leafOnly="false"
                  :checkStrictly="true"
                  :multiChecked="false"
                  :placeholder="'请选择'"
                  :tree-props="{ label: 'deptName', children: 'children' }"
                  :disabled="dataFormDisabled"
                />
          </el-form-item>
          <el-form-item label="取样部门："  prop="sampleDeptIdList" class="required">
            <tree-dialog
                  ref="refTaskTempDeptList"
                  v-model="dataFormOfInspectRequest.sampleDeptIdList"
                  :tree-data="options"
                  :leafOnly="false"
                  :checkStrictly="true"
                  :placeholder="'请选择'"
                  :tree-props="{ label: 'deptName', children: 'children' }"
                  :disabled="dataFormDisabled"
                />
          </el-form-item>
          <el-form-item label="发布人员："  prop="deployMan">
            <el-input v-model="dataFormOfInspectRequest.deployMan"  class="inputWidth" placeholder="请输入" :disabled="true" autocomplete="off" ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="检验内容："  prop="inspectContent" class="required" >
          <el-input v-model="dataFormOfInspectRequest.inspectContent"  class="inputWidth" placeholder="请输入" autocomplete="off" :disabled="dataFormDisabled" ></el-input>
        </el-form-item>
        <el-form-item label="内容说明："  prop="handleExplain" >
          <el-input v-model="dataFormOfInspectRequest.handleExplain" class="inputWidth" maxlength="150" type="textarea" placeholder="请输入" autocomplete="off" :disabled="dataFormDisabled"></el-input>
        </el-form-item>
      </el-form>
  </mds-card>
  <!-- 新增/编辑 -->
  <mds-card v-if="pageType==='add'||pageType==='edit'" title="检验指标" :name="'org'" :pack-up="false" style="margin-bottom: 0; background: #fff;padding:10px 0;">
    <div style="font-size:12px;padding: 10px 5px; display: flex;justify-content: flex-end;">
      <el-button icon="el-icon-plus" type="primary" class="topic-button" size="small" @click="btnAddOrEditItemOfTopicMainData">新增</el-button>
    </div>
    <el-table border ref="inspectIndexTopicMainData" :cell-style="{'text-align':'center'}" :data="dataTableOfInspectIndexBuild" tooltip-effect="dark" style="width: 100%" max-height="500">
      <el-table-column type="index" label="序号"  width="50" align="center" />
      <el-table-column label="指标编码" show-overflow-tooltip prop="indexCode" width="200" >
        <template #header>
          <span class="required">指标编码</span>
        </template>
        <template #default="scope">
          <el-select v-model="scope.row.indexCode" placeholder="请选择" style="width:100%" filterable @change="val=>actChangeInspectIndexOptions(val,scope.row)" @clear="actClearInspectIndexOptions(scope.row)" clearable>
            <el-option v-for="(opt, optIndex) in indexCodeOptions" :key="optIndex" :label="opt.indexNameUnitMethod" :value="opt.indexCode" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="指标名称" show-overflow-tooltip prop="indexName" width="100" >
        <template #header>
          <span class="required">指标名称</span>
        </template>
        <template #default="scope">
            <em>{{scope.row.indexName}}</em>
        </template>
      </el-table-column>
      <el-table-column label="单位" show-overflow-tooltip prop="indexUnit" width="80" >
        <template #header>
          <span >单位</span>
        </template>
        <template #default="scope">
            <em>{{scope.row.indexUnit}}</em>
        </template>
      </el-table-column>
      <el-table-column label="方法" show-overflow-tooltip prop="indexMethod" width="260">
        <template #header>
          <span class="required">方法</span>
        </template>
        <template #default="scope">
            <em>{{scope.row.indexMethod}}</em>
        </template>
      </el-table-column>
      <el-table-column label="检验方法" show-overflow-tooltip prop="inspectMethodName" min-width="150">
        <template #default="scope">
          <el-select v-model="scope.row.inspectMethodName" placeholder="请选择" size="small" clearable @visible-change="val=>actFocusGetInspectMethodOptions(val,scope.row)" @change="val=>actChangeGetInspectMethodOptions(val,scope.row)">
            <el-option
              v-for="item in scope.row.inspectMethodOptions"
              :key="item.id"
              :label="item.inspectMethodGroupName"
              :value="item.inspectMethodName"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="检验说明" show-overflow-tooltip prop="inspectExplain" min-width="220">
        <template #default="scope">
          <el-input v-model="scope.row.inspectExplain" class="140px" maxlength="150" autocomplete="off" size="small" ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="el-icon-delete" class="delete-btn" @click="btnDeleteItemData(scope.row,scope.$index)" :disabled="scope.row.isDisabled">
            <em>删除</em>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </mds-card>
  <!-- 分配 -->
  <mds-card v-if="pageType==='assign'" title="检验指标" :name="'org'" :pack-up="false" style="margin-bottom: 0; background: #fff;padding:10px 0;">
    <div style="font-size:12px;padding: 10px 5px; display: flex;justify-content: flex-end;">
      <el-popover v-model:visible="isDialogVisibleForGlobleItem" placement="left" :width="350">
          <div class="treeDialog__filter-input">
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText"
              size="small"
              clearable
              style="margin-bottom:10px;">
              <template #suffix>
                <em class="el-input__icon el-icon-search" />
              </template>
            </el-input>
          </div>
          <div style="height: 300px; overflow: scroll;">
            <el-tree
              ref="treeRef"
              :data="options"
              :props="{ label: 'deptName', children: 'children' }"
              :default-checked-keys="defaultCheckedKeys"
              node-key="id"
              show-checkbox
              :check-strictly="true"
              highlight-current
              default-expand-all
              :filter-node-method="filterNode"
              @check-change="handleCheckedChange"
            />
          </div>
          <div style="text-align: right; margin: 20px 0 0">
            <el-button size="small" class="topic-button" icon="el-icon-circle-close" @click="btnCancelItemEditOfDialog">取消</el-button>
            <el-button size="small" class="topic-button" icon="el-icon-circle-check" type="primary" @click="btnConfirmItemOfDialog">确定</el-button>
          </div>
          <template #reference>
            <el-button icon="el-icon-tickets" type="primary" class="topic-button" size="small" @click="btnAssignOfTopicMainData" :disabled="!multipleAssignSelection.length">分配</el-button>
        </template>
      </el-popover>
    </div>
    <el-table border ref="refTableOfInspectIndexAssign" :cell-style="{'text-align':'center'}" :data="dataTableOfInspectIndexAssign" tooltip-effect="dark" style="width: 100%" max-height="500" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号"  width="50" align="center" />
      <el-table-column label="指标编码" show-overflow-tooltip prop="indexCode" width="100" />
      <el-table-column label="指标名称" show-overflow-tooltip prop="indexName" width="100" />
      <el-table-column label="单位" show-overflow-tooltip prop="indexUnit" width="80" />
      <el-table-column label="方法" show-overflow-tooltip prop="indexMethod" width="260" />
      <el-table-column label="检验方法" show-overflow-tooltip prop="inspectMethodName" min-width="150">
        <template #header>
          <span class="required">检验方法</span>
        </template>
        <template #default="scope">
          <el-select v-model="scope.row.inspectMethodName" placeholder="请选择" size="small" clearable @visible-change="val=>actFocusGetInspectMethodOptions(val,scope.row)" @change="val=>actChangeGetInspectMethodOptions(val,scope.row)">
            <el-option
              v-for="item in scope.row.inspectMethodOptions"
              :key="item.id"
              :label="item.inspectMethodGroupName"
              :value="item.inspectMethodName"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="检验说明" show-overflow-tooltip prop="inspectExplain" min-width="220" >
        <template #default="scope">
          <el-input v-model="scope.row.inspectExplain" class="140px" autocomplete="off" size="small" ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="检验部门" show-overflow-tooltip prop="inspectDeptIdList" width="220">
        <template #header>
          <span class="required">检验部门</span>
        </template>
        <template #default="scope">
          <el-popover v-model:visible="scope.row.isDialogVisibleForGlobleItem" trigger="click" placement="left" :width="350" @show="actOpenItemOfPopover(scope.$index)" @hide="actConfirmItemOfPopover(scope.$index,scope.row)">
          <div class="treeDialog__filter-input">
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText"
              size="small"
              clearable
              style="margin-bottom:10px;">
              <template #suffix>
                <em class="el-input__icon el-icon-search" />
              </template>
            </el-input>
          </div>
          <div style="height: 300px; overflow: scroll;">
            <el-tree
              :ref="setItemRef"
              :data="options"
              :props="{ label: 'deptName', children: 'children' }"
              :default-checked-keys="defaultCheckedKeys"
              node-key="id"
              show-checkbox
              :check-strictly="true"
              highlight-current
              default-expand-all
              :filter-node-method="filterNode"
              @check-change="handleCheckedItemChange(scope.$index)"
            />
          </div>
          <template #reference>
            <el-input v-model="scope.row.inspectDeptName" class="140px" autocomplete="off" size="small" placeholder="请选择" readonly ></el-input>
          </template>
      </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </mds-card>
  <!-- 展示 -->
  <mds-card v-if="pageType==='show'" title="检验指标" :name="'org'" :pack-up="false" style="margin-bottom: 0; background: #fff;padding:10px 0;">
    <el-table border ref="refTableOfInspectIndexShow" :cell-style="{'text-align':'center'}" :data="dataTableOfInspectIndexShow" tooltip-effect="dark" style="width: 100%" max-height="500" :span-method="objectSpanMethod">
      <el-table-column label="取样部门" show-overflow-tooltip prop="taskTempDept" width="100" />
      <el-table-column label="序号"  prop="order" width="50" align="center" />
      <el-table-column label="指标编码" show-overflow-tooltip prop="indexCode" width="100" />
      <el-table-column label="指标名称" show-overflow-tooltip prop="indexName" width="100" />
      <el-table-column label="单位" show-overflow-tooltip prop="indexUnit" width="80" />
      <el-table-column label="检验说明" show-overflow-tooltip prop="inspectExplain" min-width="220" />
      <el-table-column label="检验结果" show-overflow-tooltip prop="inspectResult" min-width="220" />
    </el-table>
  </mds-card>
  <div style="display: flex; margin:20px 0px;justify-content: flex-end;">
    <el-button  icon="el-icon-circle-close" type="primary" size="small" class="topic-button" @click="btnCancelOfInspect">取消</el-button>
    <el-button  icon="el-icon-circle-check" type="primary" size="small" class="topic-button" v-if="pageType !=='show'" @click="btnSaveDataOfInspect">保存</el-button>
    <el-button  type="primary" icon="el-icon-circle-check" size="small" class="role__btn topic-button" v-if="pageType !=='show'" @click="btnSubmitDataOfInspect">提交</el-button>
  </div>
  </div>
  <!--指标分配弹窗-->
  <category-organization-tree v-model:dialogVisible="isDialogVisibleForAssignIndex" ref="refCategoryOrganizationTree" :title="'指标分配'"  :dialogData="dialogMainDataImport" :disableItems="itemsDisabled"  @actConfirm="actConfirm" @actReset="actReset"  />
</template>

<script lang="ts">
// import { defineComponent, toRefs, reactive, onMounted, getCurrentInstance, ComponentInternalInstance, watch } from 'vue'
import { defineComponent, toRefs, ref, reactive, onMounted, getCurrentInstance, ComponentInternalInstance, watch, onBeforeUpdate } from 'vue'
import {
  INSPECT_INDEX_MATERIAL_BY_CATEGORY_QUERY_API,
  DICTIONARY_QUERY_API,
  ORG_TREE_API,
  MANAGEMENT_PROCESS_INSPECTION_TASK_METHOD_DROPDOWN_API, // 检验方法下拉
  MANAGEMENT_PROCESS_INSPECTION_TASK_ADD_AND_EDIT_SAVE_API, // 新增&编辑-保存
  MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_QUERY_API,
  MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_DELETE_API, // 检验指标-删除
  MANAGEMENT_PROCESS_INSPECTION_TASK_ADD_AND_EDIT_SUBMIT_API, // 新增&编辑-提交
  MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_SUBMIT_API, // 分配-提交
  MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_SAVE_API, // 分配-保存
  INSPECT_INDEX_DROPDOWN_API // 获取指标编码下拉
} from '@/api/api'
import CategoryOrganizationTree from './CategoryOrganizationTree.vue'
import layoutTs from '@/components/layout/layoutTs'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import _ from 'lodash'

interface DictionaryReturnOptions {
    dictCode: string;
    dictId: string;
    dictOrder: string;
    dictValue: string;
    factoryName: string;
    id: string;
}
interface DialogMainDataImport{
  id: string;
  inspect: string;
  inspectIndexId: string;
  inspectMethodId: string;
  inspectProperty: string;
  inspectPropertyName: string;
  inspectGroups: DialogMainDataImport[]
}

interface Options {
    [propName: string]: any;
}

interface SelectedItem{
    indexMethod: string
    indexName: string
    indexUnit: string
    indexCode: string
    inspectProperty: string
    inspectIndexId: string
}

interface TransferAreaData{
  key: string
  label: string
}

interface InspectMethodOptions{
  id: string
  inspectMethodCode: string
  inspectMethodName: string
  inspectProperty: string
  inspectPropertyName: string
}

interface State {
  title: string
  isDialogVisibleForGlobleItem: boolean
  dataFormOfInspectRequest: {
    tempApplyNo: string
    needDeptId: string
    needDeptCode: string
    needDeptName: string
    needDeptList: any[]
    taskTempDeptList: any[]
    deployMan: string
    inspectContent: string
    handleExplain: string
    applyStatus: string
    deployDate: string
    id: string
    inspectDeptId: string
    inspectDeptName?: string
    processFlag?: string
    sampleDeptId: string
    sampleDeptName?: string
    sampleDeptIdList: string[]
  }
  dataFormDisabled: boolean
  dataOrgFormOfInspectRequest: any
  ruleFormOfInspectRequest: any
  cssForformLabelWidth: string
  inspectIndexTopicMainData: any[]
  isDialogVisibleForInspectIndex: boolean
  isDialogVisibleForAssignIndex: boolean
  dialogMainDataImport: DialogMainDataImport[]
  inspectPropertyObject: Options
  // multiSelected:SelectedItem[]
  tempMultiSelected:SelectedItem[]
  dataTableOfInspectIndexBuild: any[] // add and edit
  dataTableOfInspectIndexAssign: any[] // assign
  dataTableOfInspectIndexShow: any [] // show
  dataOrgTableOfInspectIndexBuild: any[]
  dataOrgTableOfInspectIndexAssign: any[]
  pageType: string
  pageId: string
  dataFormInspectIndexItem: any
  options:any[]
  indexUnitOptions: any[]
  inspectMethodOptions: InspectMethodOptions[]
  indexCodeOptions: any[]
  currentInspectScene: string
  multipleAssignSelection: any[]
  assignDeptList: any[]
  itemsDisabled: string[] // 指标分配弹窗 disabled items
  inspectIndexItemSize: number
  defaultCheckedKeys: string[]
  itemRefs: any[]
  treeRefC: string
  currentItemRefsIndex: number
}
export default defineComponent({
  name: 'InstantInspectionTaskDealIndex',
  components: {
    CategoryOrganizationTree
  },

  props: {
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const refFormOfInspectRequest = ref()
    const refCategoryOrganizationTree = ref()
    const refNeedDep = ref()
    const filterText = ref('')
    const refTaskTempDeptList = ref()
    const treeRef = ref()
    const refTableOfInspectIndexAssign = ref()
    const router = useRouter()
    const { gotoPage, tabsCloseCurrentHandle, tabsChangeCurrentTitleHandle } = layoutTs()
    const store = useStore()

    /**  == 变量 ==  **/
    const state = reactive<State>({
      title: '',
      pageType: 'add',
      pageId: '',
      isDialogVisibleForGlobleItem: false,
      currentInspectScene: 'PROCESS', // 过程检验
      dataFormDisabled: false,
      dataFormOfInspectRequest: {
        id: '',
        tempApplyNo: '',
        needDeptId: '',
        needDeptCode: '',
        needDeptName: '',
        needDeptList: [],
        sampleDeptId: '',
        taskTempDeptList: [],
        deployMan: '',
        inspectContent: '',
        handleExplain: '',
        applyStatus: '',
        deployDate: '',
        inspectDeptId: '',
        sampleDeptIdList: []
      },
      dataOrgFormOfInspectRequest: {},
      ruleFormOfInspectRequest: {
      },
      cssForformLabelWidth: '110px',
      inspectIndexTopicMainData: [],
      isDialogVisibleForInspectIndex: false,
      isDialogVisibleForAssignIndex: false,
      dialogMainDataImport: [],
      inspectPropertyObject: {},
      // multiSelected: [],
      tempMultiSelected: [],
      dataTableOfInspectIndexBuild: [],
      dataTableOfInspectIndexAssign: [],
      dataTableOfInspectIndexShow: [],
      dataOrgTableOfInspectIndexBuild: [],
      dataOrgTableOfInspectIndexAssign: [],
      dataFormInspectIndexItem: {},
      options: [],
      indexUnitOptions: [],
      inspectMethodOptions: [],
      indexCodeOptions: [],
      multipleAssignSelection: [], // assign selected
      assignDeptList: [],
      itemsDisabled: [],
      inspectIndexItemSize: 0,
      defaultCheckedKeys: [],
      itemRefs: [],
      treeRefC: 'treeRef',
      currentItemRefsIndex: 0
    })

    // [BTN:新增]
    const btnAddOrEditItemOfTopicMainData = () => {
      // 指标代码清空
      state.tempMultiSelected = []
      actAddIndexId()
    }
    // [BTN:分配]
    const btnAssignOfTopicMainData = () => {
      state.isDialogVisibleForGlobleItem = true
      filterText.value = ''
      state.defaultCheckedKeys = []
      treeRef.value.setCheckedNodes([])
    }

    //  [参数明细] 勾选欲删除选项
    const handleSelectionChange = (val:any[]) => {
      state.multipleAssignSelection = []
      val.forEach((item:any) => {
        state.multipleAssignSelection.push(item.id)
      })
    }

    // 触发指标选择弹窗
    const actAddIndexId = async () => {
      state.itemsDisabled = state.dataTableOfInspectIndexBuild.map(item => item.indexId) || []
      const res = await INSPECT_INDEX_MATERIAL_BY_CATEGORY_QUERY_API()
      // 为 inspectPropertyName 附值 （后端无法返回）
      res.data.data.forEach((item:DialogMainDataImport) => {
        item.inspectPropertyName = state.inspectPropertyObject[item.inspectProperty]
      })
      // 指标弹窗架构
      state.dialogMainDataImport = JSON.parse(JSON.stringify(res.data.data))
      state.isDialogVisibleForAssignIndex = true
    }

    // [弹窗:指标分配]确认
    const actConfirm = async (data:TransferAreaData[]) => {
      state.tempMultiSelected = JSON.parse(JSON.stringify(data))
      if (state.tempMultiSelected.length === 0) {
        return
      }
      state.tempMultiSelected.forEach((item: SelectedItem) => {
        state.dataTableOfInspectIndexBuild.push({
          id: '',
          indexCode: item.indexCode,
          indexMethod: item.indexMethod,
          indexName: item.indexName,
          indexUnit: item.indexUnit,
          inspectProperty: item.inspectProperty,
          inspectExplain: '',
          inspectMethod: '',
          inspectMethodOptions: [],
          indexId: item.inspectIndexId,
          isRedact: true
        })
      })
      proxy.$successToast('操作成功')
    }

    // [弹窗:指标分配]取消关闭弹窗后的 reset
    const actReset = () => {
      //
    }

    // [BTN:删除][检验指标]
    const btnDeleteItemData = (row:any, index:number) => {
      let check = false
      if (row.id) {
        check = state.dataTableOfInspectIndexBuild.find(item => item.id === '') !== -1
      }
      const hintString = check ? '有新增数据，避免数据遗失，请先保存。' : ''

      proxy.$confirm(hintString + '确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (!row.id) {
          state.dataTableOfInspectIndexBuild.splice(index, 1)
          proxy.$successToast('操作成功')
          return
        }
        await MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_DELETE_API({
          id: row.id
        })
        proxy.$successToast('操作成功')
        getInspectIndexDataForEdit()
      })
    }

    // 去掉children
    const cascaderTranslate = (data: any) => {
      data.forEach((item: any) => {
        if (item.children.length) {
          cascaderTranslate(item.children)
        } else {
          delete item.children
        }
      })
    }

    const getOrg = async () => {
      const res = await ORG_TREE_API({ factory: JSON.parse(sessionStorage.getItem('system') || '{}').id || '' })
      cascaderTranslate(res.data.data)
      state.options = res.data.data
    }
    // [BTN:取消]
    const btnCancelOfInspect = () => {
      tabsCloseCurrentHandle()
    }

    // [BTN:保存] transfor
    const btnSaveDataOfInspect = () => {
      if (state.pageType === 'edit' || state.pageType === 'add') {
        btnSaveDataOfInspectEdit()
      } else if (state.pageType === 'assign') {
        btnSaveDataOfInspectAssign()
      }
    }
    // [BTN:保存][ACT:编辑]
    const btnSaveDataOfInspectEdit = async (isSubmit = false) => {
      let isChangeDataFormOfInspectRequest = false // 检验需求 area 是否有异动
      let isChangeDataTopicMainData = false // 检验指标 area 是否有异动

      const tempNeedDept = refNeedDep.value.getCheckedNodes(false)
      const tempRefTaskTempDeptList: any[] = []

      // refTaskTempDeptList.value.getCheckedNodes(false).forEach((item:any) => {
      //   tempRefTaskTempDeptList.push({
      //     id: '',
      //     sampleDeptId: item.id,
      //     sampleDeptName: item.deptName,
      //     taskTempApplyId: state.pageId
      //   })
      // })

      let temp:any
      let tempAdd: any[] = []
      const tempEdit: any[] = []
      if (state.pageType === 'add') { // 新增 action
        isChangeDataFormOfInspectRequest = true
        isChangeDataTopicMainData = true

        refTaskTempDeptList.value.getCheckedNodes(false).forEach((item:any) => {
          tempRefTaskTempDeptList.push({
            id: '',
            sampleDeptId: item.id,
            sampleDeptName: item.deptName,
            taskTempApplyId: state.pageId
          })
        })

        tempAdd = state.dataTableOfInspectIndexBuild
        temp = {
          deployMan: state.dataFormOfInspectRequest.deployMan,
          tempApplyNo: '', // 任务单号
          applyStatus: '', // 申请状态
          id: '',
          needDeptId: tempNeedDept.length ? tempNeedDept[0].id : '', // 需求单位
          needDeptCode: tempNeedDept.length ? tempNeedDept[0].deptCode : '',
          needDeptName: tempNeedDept.length ? tempNeedDept[0].deptName : '',
          taskTempDeptList: tempRefTaskTempDeptList, // 取样部门
          inspectContent: state.dataFormOfInspectRequest.inspectContent, // 检验内容
          handleExplain: state.dataFormOfInspectRequest.handleExplain, // 内容说明
          updateList: tempEdit,
          insertList: tempAdd // 新增
        }
      } else { // 编辑 action
        refTaskTempDeptList.value.getCheckedNodes(false).forEach((item:any) => {
          tempRefTaskTempDeptList.push({
            id: item.id,
            sampleDeptId: item.id,
            sampleDeptName: item.deptName,
            taskTempApplyId: state.pageId
          })
        })

        if (!_.isEqual(state.dataFormOfInspectRequest, state.dataOrgFormOfInspectRequest)) {
          isChangeDataFormOfInspectRequest = true
        }

        state.dataTableOfInspectIndexBuild.forEach((item, index) => {
          if (item.id === '') { // 新增
            tempAdd.push(item)
          } else {
            const tempItem = JSON.parse(JSON.stringify(item))
            delete tempItem.isRedact
            if (!_.isEqual(state.dataOrgTableOfInspectIndexBuild[index], tempItem)) {
              tempEdit.push(tempItem)
            }
          }
        })

        temp = {
          deployMan: `${JSON.parse(sessionStorage.getItem('userInfo') || '{}').realName || ''}(${JSON.parse(sessionStorage.getItem('userInfo') || '{}').userName || ''})`,
          tempApplyNo: state.dataFormOfInspectRequest.tempApplyNo, // 任务单号
          applyStatus: state.dataFormOfInspectRequest.applyStatus, // 申请状态
          id: state.pageId,
          needDeptId: tempNeedDept.length ? tempNeedDept[0].id : '', // 需求单位
          needDeptCode: tempNeedDept.length ? tempNeedDept[0].deptCode : '',
          needDeptName: tempNeedDept.length ? tempNeedDept[0].deptName : '',
          taskTempDeptList: tempRefTaskTempDeptList, // 取样部门
          inspectContent: state.dataFormOfInspectRequest.inspectContent, // 检验内容
          handleExplain: state.dataFormOfInspectRequest.handleExplain, // 内容说明
          updateList: tempEdit,
          insertList: tempAdd // 新增
        }
        if (!(tempAdd.length === 0 && tempEdit.length === 0)) {
          isChangeDataTopicMainData = true
        }
      }

      if (isChangeDataTopicMainData || isChangeDataFormOfInspectRequest) { // 有异动，呼叫 API 后，跳转
        if (!isSubmit) {
          await MANAGEMENT_PROCESS_INSPECTION_TASK_ADD_AND_EDIT_SAVE_API(temp).then(() => {
            proxy.$successToast('操作成功！')
            tabsCloseCurrentHandle()
            gotoPage({
              path: 'qms-pages-ManagementTask-InstantInspectionTask-index',
              query: {
                type: 'back'
              }
            })
          })
        } else {
          return temp
        }
      } else if (isSubmit) { // 无任何异动，直接跳转 ，提交
        return temp
      } else { // 无任何异动，直接跳转 ，且非提交
        tabsCloseCurrentHandle()
        gotoPage({
          path: 'qms-pages-ManagementTask-InstantInspectionTask-index',
          query: {
            type: ''
          }
        })
      }
    }

    // [BTN:保存][ACT:分配]
    const btnSaveDataOfInspectAssign = async (isSubmit = false) => {
      let isChangeDataTopicMainData = false // 检验指标 area 是否有异动
      const tempRefTaskTempDeptList: any[] = []

      const tempEdit: any[] = []

      refTaskTempDeptList.value.getCheckedNodes(false).forEach((item:any) => {
        tempRefTaskTempDeptList.push({
          id: item.id,
          sampleDeptId: item.id,
          sampleDeptName: item.deptName,
          taskTempApplyId: state.pageId
        })
      })
      state.dataTableOfInspectIndexAssign.forEach((item, index) => {
        const tempItem = JSON.parse(JSON.stringify(item))
        item.inspectDeptId = !item.inspectDeptIdList.length ? '' : item.inspectDeptIdList[0]
        item.isDialogVisibleForGlobleItem = false

        if (!_.isEqual(state.dataOrgTableOfInspectIndexAssign[index], tempItem)) {
          tempEdit.push(tempItem)
        }
      })

      const temp = {
        deployMan: `${JSON.parse(sessionStorage.getItem('userInfo') || '{}').realName || ''}(${JSON.parse(sessionStorage.getItem('userInfo') || '{}').userName || ''})`,
        tempApplyNo: state.dataFormOfInspectRequest.tempApplyNo, // 任务单号
        applyStatus: state.dataFormOfInspectRequest.applyStatus, // 申请状态
        id: state.pageId,
        needDeptId: state.dataFormOfInspectRequest.needDeptId, // 需求单位
        needDeptCode: state.dataFormOfInspectRequest.needDeptCode,
        needDeptName: state.dataFormOfInspectRequest.needDeptName,
        taskTempDeptList: tempRefTaskTempDeptList, // 取样部门
        inspectContent: state.dataFormOfInspectRequest.inspectContent, // 检验内容
        handleExplain: state.dataFormOfInspectRequest.handleExplain, // 内容说明
        updateList: tempEdit,
        insertList: [] // 新增
      }
      if (tempEdit.length !== 0) {
        isChangeDataTopicMainData = true
      }

      if (isChangeDataTopicMainData) {
        await MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_SAVE_API(temp).then(() => { // 有异动，呼叫 API 后，跳转
          if (!isSubmit) {
            proxy.$successToast('操作成功！')
            tabsCloseCurrentHandle()
            gotoPage({
              path: 'qms-pages-ManagementTask-InstantInspectionTask-index',
              query: {
                type: 'back'
              }
            })
          }
        })

        if (isSubmit) {
          return temp
        }
      } else if (isSubmit) {
        return temp
      } else { // 无任何异动，直接跳转
        tabsCloseCurrentHandle()
        gotoPage({
          path: 'qms-pages-ManagementTask-InstantInspectionTask-index',
          query: {
            type: ''
          }
        })
      }
    }

    // TODO
    // [BTN:提交]
    const btnSubmitDataOfInspect = async () => {
      if (state.pageType === 'add' || state.pageType === 'edit') {
        if (!state.dataTableOfInspectIndexBuild.length) {
          proxy.$warningToast('未填写检验指标')
          return
        }

        // 检验需求 area 校验必填
        if (state.dataFormOfInspectRequest.needDeptList.length === 0) {
          proxy.$warningToast('请选择需求部门')
          return
        }
        if (!state.dataFormOfInspectRequest.inspectContent) {
          proxy.$warningToast('请输入检验内容')
          return
        }
        if (!state.dataFormOfInspectRequest.sampleDeptIdList.length) {
          proxy.$warningToast('请输入取样部门')
          return
        }

        if (state.dataTableOfInspectIndexBuild.length !== 0 && (state.dataTableOfInspectIndexBuild.length !== new Set(state.dataTableOfInspectIndexBuild.map(item => item.indexCode)).size)) {
          proxy.$warningToast('有重复指标编码')
          return
        }

        const temp:any = await btnSaveDataOfInspectEdit(true)

        if (temp) {
          temp.allList = state.dataTableOfInspectIndexBuild
          // temp.updateList = []
          // temp.insertList = []
          MANAGEMENT_PROCESS_INSPECTION_TASK_ADD_AND_EDIT_SUBMIT_API(temp).then(() => {
            proxy.$successToast('操作成功！')
            tabsCloseCurrentHandle()
            gotoPage({
              path: 'qms-pages-ManagementTask-InstantInspectionTask-index',
              query: {
                type: 'back'
              }
            })
          })
        }
      } else if (state.pageType === 'assign') {
        let required = true
        state.dataTableOfInspectIndexAssign.forEach((item) => {
          if (!item.inspectMethodName || !item.inspectDeptName) {
            required = false
          }
        })
        if (!required) {
          proxy.$warningToast('请选择必填栏位')
          return
        }

        const temp:any = await btnSaveDataOfInspectAssign(true)

        if (temp) {
          temp.allList = state.dataTableOfInspectIndexAssign
          temp.updateList = []
          temp.insertList = []
          MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_SUBMIT_API(temp).then(() => {
            proxy.$successToast('操作成功！')
            tabsCloseCurrentHandle()
            gotoPage({
              path: 'qms-pages-ManagementTask-InstantInspectionTask-index',
              query: {
                type: 'back'
              }
            })
          })
        }
      }
    }

    const actChangeInspectIndexOptions = (val:any, row: any) => {
      state.indexCodeOptions.forEach(item => {
        if (item.indexCode === val) {
          row.indexName = item.indexName
          row.indexUnit = item.indexUnit
          row.indexMethod = item.indexMethod
          row.inspectMethod = ''
          row.inspectMethodName = ''
          row.inspectExplain = ''
          row.indexId = item.id
        }
      })
    }

    const actFocusGetInspectMethodOptions = (val:boolean, row: any) => {
      row.inspectMethodOptions = []
      // 检验方法下拉
      if (val && row.indexCode !== '') {
        MANAGEMENT_PROCESS_INSPECTION_TASK_METHOD_DROPDOWN_API({
          inspectIndexId: row.indexId
        }).then((res) => {
        // state.inspectMethodOptions = res.data.data
          row.inspectMethodOptions = res.data.data
        })
      }
    }

    const actChangeGetInspectMethodOptions = (val:string, row:any) => {
      row.inspectMethodOptions.forEach((item:any) => {
        if (val === item.inspectMethodName) {
          row.inspectMethodCode = item.inspectMethodCode
          row.inspectParameterGroupId = item.inspectParameterGroupId
          // row.inspectMethodName = item.inspectMethodName
        }
      })
    }

    // TODO
    const actClearInspectIndexOptions = (row:any) => {
      row.indexName = ''
      row.indexUnit = ''
      row.indexMethod = ''
      row.inspectMethodName = ''
      row.inspectExplain = ''
    }

    // [ACT:编辑：检验指标 table 加载]
    const getInspectIndexDataForEdit = () => {
      MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_QUERY_API({
        taskTempApplyId: state.pageId
      }).then((res) => {
        console.log('编辑-检验指标 table 加载')
        console.log(res.data.data)
        state.dataTableOfInspectIndexBuild = res.data.data
        state.inspectIndexItemSize = res.data.data.length
        state.dataOrgTableOfInspectIndexBuild = JSON.parse(JSON.stringify(res.data.data))
        state.dataTableOfInspectIndexBuild.forEach((item) => {
          item.isRedact = false
        })
      })
    }

    // [ACT:分配：检验指标 table 加载]
    const getInspectIndexDataForAssign = () => {
      MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_QUERY_API({
        taskTempApplyId: state.pageId
      }).then((res) => {
        console.log('分配-检验指标 table 加载')
        console.log(res.data.data)
        state.dataTableOfInspectIndexAssign = res.data.data
        state.dataTableOfInspectIndexAssign.forEach(item => {
          item.inspectDeptIdList = [item.inspectDeptId]
          item.isDialogVisibleForGlobleItem = false
        })

        state.inspectIndexItemSize = res.data.data.length
        state.dataOrgTableOfInspectIndexAssign = JSON.parse(JSON.stringify(res.data.data))
      })
    }

    // [ACT:展示：检验指标 table 加载]
    const getInspectIndexDataForShow = () => {
      MANAGEMENT_PROCESS_INSPECTION_TASK_ASSIGN_QUERY_API({
        taskTempApplyId: state.pageId
      }).then((res) => {
        console.log('展示-检验指标 table 加载')
        console.log(res.data.data)
        const tempSampleDeptNameList = state.dataFormOfInspectRequest.sampleDeptName?.split(',') || []
        state.inspectIndexItemSize = res.data.data.length
        if (tempSampleDeptNameList.length !== 0 && res.data.data.length !== 0) {
          state.dataTableOfInspectIndexShow = []
          for (let i = 0; i < tempSampleDeptNameList.length; i++) {
            const temp = JSON.parse(JSON.stringify(res.data.data))
            temp.forEach((item:any, index:number) => {
              item.taskTempDept = tempSampleDeptNameList[i]
              item.order = index + 1
              state.dataTableOfInspectIndexShow.push(item)
            })
          }
        }
      })
    }

    const objectSpanMethod = (obj:any) => {
      if (obj.columnIndex === 0) {
        if (obj.rowIndex % state.inspectIndexItemSize === 0) {
          return {
            rowspan: state.inspectIndexItemSize,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }

    // [Dialog][BTN:确认]
    const btnConfirmItemOfDialog = async () => {
      const checkNodes = treeRef.value.getCheckedNodes()
      state.multipleAssignSelection.forEach((item) => {
        state.dataTableOfInspectIndexAssign.forEach(subItem => {
          if (item === subItem.id) {
            subItem.inspectDeptId = checkNodes[0].id
            subItem.inspectDeptName = checkNodes[0].deptName
            subItem.inspectDeptIdList = [checkNodes[0].id]
          }
        })
      })
      state.isDialogVisibleForGlobleItem = false
    }

    // [Dialog][BTN:取消]
    const btnCancelItemEditOfDialog = () => {
      state.isDialogVisibleForGlobleItem = false
    }

    watch(filterText, (val) => {
      treeRef.value.filter(val)
      state.itemRefs[state.currentItemRefsIndex].filter(val)
    })

    const filterNode = (value:string, data: any) => {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }

    const handleCheckedChange = () => {
      const checkNodes = treeRef.value.getCheckedNodes()
      if (checkNodes.length > 1) {
        const temp = JSON.parse(JSON.stringify(checkNodes.slice(1, 2)))
        state.defaultCheckedKeys = [temp[0].id]
        treeRef.value.setCheckedNodes([temp[0]])
      }
    }

    const actOpenItemOfPopover = (index:number) => {
      filterText.value = ''
      state.currentItemRefsIndex = index
    }

    const actConfirmItemOfPopover = (index:number, row:any) => {
      const checkNodes = state.itemRefs[index].getCheckedNodes()
      if (checkNodes.length) {
        row.inspectDeptId = checkNodes[0].id
        row.inspectDeptName = checkNodes[0].deptName
        row.inspectDeptIdList = [checkNodes[0].id]
      }
    }

    const handleCheckedItemChange = (index:number) => {
      const checkNodes = state.itemRefs[index].getCheckedNodes()
      if (checkNodes.length > 1) {
        const temp = JSON.parse(JSON.stringify(checkNodes.slice(1, 2)))
        state.defaultCheckedKeys = [temp[0].id]
        state.itemRefs[index].setCheckedNodes([temp[0]])
      }
    }

    const setItemRef = (el:any) => {
      if (el) {
        state.itemRefs.push(el)
      }
    }

    onBeforeUpdate(() => {
      state.itemRefs = []
    })

    onMounted(async () => {
      if (!router.currentRoute.value.query.type) {
        tabsCloseCurrentHandle()
        proxy.$warningToast('操作过时，请重新选择！')
        gotoPage({
          path: 'qms-pages-ManagementTask-InstantInspectionTask-index'
        })
        return
      }

      if (!store.state.common.instantInspectionTask.type) {
        store.commit('common/updateInstantInspectionTask', { type: router.currentRoute.value.query.type as string, id: router.currentRoute.value.query.id })
      }

      // 指标编码下拉
      const resIndexOptions = await INSPECT_INDEX_DROPDOWN_API()
      state.indexCodeOptions = resIndexOptions.data.data

      // 获取组织架构
      await getOrg()
      state.pageType = router.currentRoute.value.query.type ? router.currentRoute.value.query.type as string : store.state.common.instantInspectionTask.type

      if (state.pageType === 'edit') { // 编辑
        console.log('我是编辑！！')
        // 更新 tab title
        tabsChangeCurrentTitleHandle('临时检验任务编辑')
        state.dataFormDisabled = false
        state.pageId = router.currentRoute.value.query.id ? router.currentRoute.value.query.id as string : store.state.common.instantInspectionTask.id

        state.dataFormOfInspectRequest = JSON.parse(JSON.stringify(store.state.common.instantInspectionTaskObj))
        state.dataFormOfInspectRequest.needDeptList = [state.dataFormOfInspectRequest.needDeptId]

        state.dataOrgFormOfInspectRequest = JSON.parse(JSON.stringify(state.dataFormOfInspectRequest))
        // 载入检验指标 data
        getInspectIndexDataForEdit()
      } else if (state.pageType === 'add') { // 新增
        // 更新 tab title
        tabsChangeCurrentTitleHandle('临时检验任务新增')
        console.log('我是新增！！')
        state.dataFormDisabled = false
        state.pageId = ''
        state.dataTableOfInspectIndexBuild = []
        state.dataFormOfInspectRequest = {
          id: '',
          tempApplyNo: '',
          needDeptId: '',
          needDeptCode: '',
          needDeptName: '',
          needDeptList: [],
          sampleDeptId: '',
          taskTempDeptList: [],
          deployMan: `${JSON.parse(sessionStorage.getItem('userInfo') || '{}').realName || ''}(${JSON.parse(sessionStorage.getItem('userInfo') || '{}').userName || ''})`,
          inspectContent: '',
          handleExplain: '',
          applyStatus: '',
          deployDate: '',
          inspectDeptId: '',
          sampleDeptIdList: []
        }
      } else if (state.pageType === 'assign') { // 分配
        console.log('我是分配！！')
        // 更新 tab title
        tabsChangeCurrentTitleHandle('临时检验任务处理')
        state.pageId = router.currentRoute.value.query.id ? router.currentRoute.value.query.id as string : store.state.common.instantInspectionTask.id

        state.dataFormDisabled = true
        state.dataFormOfInspectRequest = JSON.parse(JSON.stringify(store.state.common.instantInspectionTaskObj))
        state.dataFormOfInspectRequest.needDeptList = [state.dataFormOfInspectRequest.needDeptId]
        state.dataOrgFormOfInspectRequest = JSON.parse(JSON.stringify(state.dataFormOfInspectRequest))
        // 载入检验指标 data
        getInspectIndexDataForAssign()
      } else {
        console.log('我是展示！！')
        // 更新 tab title
        tabsChangeCurrentTitleHandle('临时检验任务展示')
        state.pageId = router.currentRoute.value.query.id ? router.currentRoute.value.query.id as string : store.state.common.instantInspectionTask.id

        state.dataFormDisabled = true
        state.dataFormOfInspectRequest = JSON.parse(JSON.stringify(store.state.common.instantInspectionTaskObj))
        state.dataFormOfInspectRequest.needDeptList = [state.dataFormOfInspectRequest.needDeptId]
        state.dataOrgFormOfInspectRequest = JSON.parse(JSON.stringify(state.dataFormOfInspectRequest))
        getInspectIndexDataForShow()
      }

      // 数据字典查找
      const resPropertyObject = await DICTIONARY_QUERY_API({ dictType: 'INSPECT_PROPERTY' })
      state.inspectPropertyObject = {}
      resPropertyObject.data.data.forEach((item:DictionaryReturnOptions) => {
        state.inspectPropertyObject[item.dictCode] = item.dictValue
      })

      // 获取指标编码下拉
    })

    return {
      ...toRefs(state),
      // btn
      btnAddOrEditItemOfTopicMainData,
      btnAssignOfTopicMainData,
      btnDeleteItemData,
      handleSelectionChange,
      btnCancelOfInspect,
      btnSaveDataOfInspect,
      btnSubmitDataOfInspect,
      btnCancelItemEditOfDialog,
      btnConfirmItemOfDialog,
      actFocusGetInspectMethodOptions,
      actChangeInspectIndexOptions,
      actChangeGetInspectMethodOptions,
      actClearInspectIndexOptions,
      // act
      actReset,
      actConfirm,
      // ref
      refCategoryOrganizationTree,
      refFormOfInspectRequest,
      refNeedDep,
      refTaskTempDeptList,
      refTableOfInspectIndexAssign,
      // other
      objectSpanMethod,
      treeRef,
      filterText,
      filterNode,
      handleCheckedChange,
      actConfirmItemOfPopover,
      actOpenItemOfPopover,
      handleCheckedItemChange,
      setItemRef
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
