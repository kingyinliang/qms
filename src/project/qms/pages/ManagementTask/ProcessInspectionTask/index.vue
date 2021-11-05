<template>
  <tree-page
    ref="refTreeModule"
    :title="pageMainTitle"
    :leftTitle="pageLeftColumnTitle"
    :rightTitle="pageRightColumnTitle"
    :defaultExtend="false"
    :treeData="treeData"
    :treeProps="{ label: 'inspectTypeName',children:'children' }"
    :defaultFilterNodeProps="{ prop: 'existConfiguration',value:'Y' }"
    @treeNodeClick="actGetTaskDetailOfTree"
    :floatMenu="false"
  >
  <template #out-header>
    <span style="font-size:14px;">版本：</span>
    <el-select v-model="versionValue" placeholder="请选择" size="small" @change="handleChangeSelectVersion">
      <el-option
        v-for="item in versionnValueOptions"
        :key="item.id"
        :label="item.planVersion"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </template>

    <template #view>
      <el-form label-position="right" :model="dataFormOfSearchFilter" class="demo-form-inline" style="display:flex;justify-content: flex-end; padding-right:10px;line-height:1.7em;">
        <el-form-item label="样品码：" label-width="80px">
          <el-input
            placeholder="请输入"
            v-model="dataFormOfSearchFilter.sampleCode"
            size="small"
            clearable
            style="margin-bottom:10px; width:200px; height:35px;"
            @keydown.enter="actGetTaskDetailForTable(currentCategoryId,dataFormOfSearchFilter,1,10)"
            >
          </el-input>
        </el-form-item>
        <el-form-item label="取样部门：" label-width="100px">
          <el-select v-model="dataFormOfSearchFilter.sampleDeptId" placeholder="请选择" size="small" clearable>
            <el-option
              v-for="item in sampleDeptIdOptions"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" label-width="70px">
          <el-select v-model="dataFormOfSearchFilter.taskStatus" placeholder="请选择" size="small" style="width:100px" clearable>
            <el-option
              v-for="item in taskStatusOptions"
              :key="item.dictCode"
              :label="item.dictValue"
              :value="item.dictCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:10px;">
            <el-button icon="el-icon-search" class="topic-button" size="small" @click="actGetTaskDetailForTable(currentCategoryId,dataFormOfSearchFilter,1,10)" :disabled="versionValue===''">查询</el-button>
        </el-form-item>
      </el-form>
     <el-table
        :data="dataTableOfTopicMain"
        height="500"
        border
        tooltip-effect="dark"
        class="bueatyScroll"
        style="width: 100%;"
       >
        <el-table-column type="index" label="序号"  width="55"  align="center" size="small" fixed />
        <el-table-column label="样品码" prop="sampleCode" :show-overflow-tooltip="true" min-width="180" />
        <el-table-column label="状态" prop="taskStatusName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="检验内容" prop="inspectContent" :show-overflow-tooltip="true" min-width="180" />
        <el-table-column label="取样部门" prop="sampleDeptName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="取样信息" prop="inspectSiteName" :show-overflow-tooltip="true" min-width="220" />
        <el-table-column label="物料信息" prop="" :show-overflow-tooltip="true" min-width="100" >
          <template #default="scope">
            <span>{{`${scope.row.inspectMaterialName} ${scope.row.inspectMaterialCode}`}}</span>
          </template>
        </el-table-column>
        <el-table-column label="批次" prop="inspectBatch" :show-overflow-tooltip="true" min-width="220" />
        <el-table-column label="品项" prop="itemName" :show-overflow-tooltip="true" min-width="108" />
        <el-table-column label="供应商" prop="supplier" :show-overflow-tooltip="true" min-width="108" />
        <el-table-column label="触发时间" prop="triggerDate" :show-overflow-tooltip="true" min-width="200" />
        <el-table-column label="触发方" prop="triggerBy" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column fixed="right" label="操作" header-align="left" align="left" width="150">
            <template #default="scope">
                <!-- <el-button  type="text" icon="el-icon-edit" @click="btnClickItemEditOfTopicMainData(scope.row)" :disabled="!(scope.row.taskStatus==='UNSAMPLED'&&scope.row.loopFlag==='Y')" class="role__btn">
                    <em>编辑</em>
                </el-button> -->
                <el-button  type="text" icon="el-icon-edit" @click="btnClickItemEditOfTopicMainData(scope.row)" class="role__btn">
                    <em>编辑</em>
                </el-button>
                <el-button  type="text" icon="el-icon-delete" @click="btnClickItemCancelOfTopicMainData(scope.row)" :disabled="scope.row.taskStatus!=='UNSAMPLED'" class="role__btn">
                    <em>取消</em>
                </el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="dataTableOfTopicMain.length!==0"
        @size-change="handleChangeDataSize"
        @current-change="handleChangeCurrentPage"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalItems">
      </el-pagination>
    </template>

  </tree-page>
  <!--编辑-->
  <el-dialog :title="'任务修改'" v-model="isDialogVisibleForGlobleItem" width="40%" >
    <el-form ref="refGlobleItem" :model="formGlobleItem" :rules="ruleGlobleItem" class="dialogForm">
      <el-form-item label="样品码：" prop="sampleCode" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.sampleCode" class="140px" autocomplete="off"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="检验内容：" prop="inspectContent" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.inspectContent" class="140px" autocomplete="off"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="取样单位：" :label-width="cssForformLabelWidth" prop="sampleDeptId">
        <el-select v-model="formGlobleItem.sampleDeptId" placeholder="请选择" style="width:100%" filterable clearable @change="actChangeSampleUnitOfFormGlobleItem">
          <el-option v-for="opt in sampleUnitptions" :key="opt.deptId" :label="opt.deptName" :value="opt.deptId" />
        </el-select>
      </el-form-item>
      <el-form-item label="物料信息：" prop="materialInfo" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.materialInfo" class="140px" autocomplete="off"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="取样信息：" prop="inspectSiteName" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.inspectSiteName" class="140px" autocomplete="off"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="批次：" prop="inspectBatch" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.inspectBatch" class="140px" autocomplete="off"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="品项：" prop="itemName" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.itemName" class="140px" autocomplete="off"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="供应商：" prop="supplier" :label-width="cssForformLabelWidth">
          <el-input v-model="formGlobleItem.supplier" class="140px" autocomplete="off" maxlength="10" :disabled="true" placeholder="暂无内容"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" class="topic-button" icon="el-icon-circle-close" @click="btnCancelItemEditOfDialog">取消</el-button>
        <el-button size="small" class="topic-button" icon="el-icon-circle-check" type="primary" @click="btnConfirmItemOfDialog">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, reactive, onMounted, getCurrentInstance, ComponentInternalInstance, nextTick } from 'vue'
import {
  MANAGEMENT_PROCESS_INSPECTION_TASK_INSPECT_MATERIAL_DROP_DOWN_API,
  INSPECT_INDEX_PARAMETER_RELATIVE_ITEM_API,
  MANAGEMENT_PROCESS_INSPECTION_TASK_QUERY_API,
  MANAGEMENT_PROCESS_INSPECTION_TASK_UPDATE_API,
  MANAGEMENT_INSPECTION_PLAN_VERSION_DROP_DOWN_API, // 任务管理-[过程检验任务]- 检验计划-下拉 获取版本
  MANAGEMENT_PROCESS_INSPECTION_TASK_SAMPLE_DEPARTMENT_DROP_DOWN_API, // 任务管理-[过程检验任务]- 该版本下的取样部门下拉
  DICTIONARY_QUERY_API, // 数据字典
  MANAGEMENT_PROCESS_INSPECTION_TASK_CANCEL_API // 任务管理-[过程检验任务]- 过程检验任务-取消
} from '@/api/api'

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
  existConfiguration :string
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

interface VersionOption{
  id: string
  planVersion: string
}

interface SampleDeptIdOptions{
  deptName: string
  deptId: string
}

interface DictOptions{
  dictCode: string
  dictId: string
  dictValue: string
}

interface FormGlobleItem{
  id: string
  sampleCode: string
  taskStatus: string
  inspectContent: string
  sampleDeptId: string
  sampleDeptName: string
  inspectSiteName: string
  materialInfo: string
  inspectBatch: string
  itemName: string
  supplier: string
}

interface State {
    versionValue: string,
    versionLabel: string,
    versionnValueOptions: VersionOption[],
    dataFormOfSearchFilter:{
      sampleCode: string
      sampleDeptId: string
      taskStatus: string
    }
    sampleDeptIdOptions: SampleDeptIdOptions[]
    taskStatusOptions: DictOptions[]
    cssForformLabelWidth: string
    isDialogVisibleForGlobleItem: boolean
    currentInspectScene: string
    pageMainTitle: string
    pageLeftColumnTitle: string
    pageRightColumnTitle: string
    totalItems: number
    currentPage: number
    pageSize: number
    dataTableOfTopicMain: TopicMainData[] // 右边 table
    treeData: TreeData[]
    formGlobleItem: FormGlobleItem // TopicMainDataItem
    currentCategoryId: string
    sampleUnitptions: SampleDeptIdOptions[]
    currentFocusTargetObj:any
}

export default defineComponent({
  name: 'ProcessInspectionTaskIndex',
  components: {
  },
  props: {
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const state = reactive<State>({
      versionValue: '',
      versionLabel: '',
      versionnValueOptions: [],
      dataFormOfSearchFilter: {
        sampleCode: '',
        sampleDeptId: '',
        taskStatus: ''
      },
      sampleDeptIdOptions: [],
      isDialogVisibleForGlobleItem: false,
      currentInspectScene: 'PROCESS', // 过程检验计划
      pageMainTitle: '过程检验任务',
      pageLeftColumnTitle: '检验类别',
      pageRightColumnTitle: '任务列表',
      cssForformLabelWidth: '120px',
      totalItems: 0,
      currentPage: 1,
      pageSize: 10,
      dataTableOfTopicMain: [],
      treeData: [],
      currentCategoryId: '',
      formGlobleItem: {
        id: '',
        sampleCode: '',
        taskStatus: '',
        inspectContent: '',
        sampleDeptId: '',
        sampleDeptName: '',
        inspectSiteName: '',
        materialInfo: '',
        inspectBatch: '',
        itemName: '',
        supplier: ''
      },
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
      taskStatusOptions: [],
      sampleUnitptions: []
    })
    const refTreeModule = ref()
    const refGlobleItem = ref()
    const ruleGlobleItem = {
      sampleDeptName: [
        {
          required: true,
          message: '请选择取样单位',
          trigger: 'blur'
        }
      ]
    }
    // [dataTableOfTopicMain][BTN:编辑]
    const btnClickItemEditOfTopicMainData = async (row:any) => {
      state.isDialogVisibleForGlobleItem = true
      await getDropDownOptions(row.inspectTypeId) // 获取下拉
      await nextTick()
      refGlobleItem.value.resetFields()
      state.formGlobleItem = {
        id: row.id,
        sampleCode: row.sampleCode,
        taskStatus: row.taskStatus,
        inspectContent: row.inspectContent,
        sampleDeptId: row.sampleDeptId,
        sampleDeptName: row.sampleDeptName,
        inspectSiteName: row.inspectSiteName,
        materialInfo: `${row.inspectMaterialName} ${row.inspectMaterialCode}`,
        inspectBatch: row.inspectBatch,
        itemName: row.itemName,
        supplier: row.supplier
      }
    }

    // [dataTableOfTopicMain][BTN:取消]
    const btnClickItemCancelOfTopicMainData = async (row:any) => {
      proxy.$confirm('确认取消该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await MANAGEMENT_PROCESS_INSPECTION_TASK_CANCEL_API({
          id: row.id,
          taskSampleId: row.taskSampleId
        })
        proxy.$successToast('操作成功')
        actGetTaskDetailOfTree(state.currentFocusTargetObj)
      })
    }

    // [@treeNodeClick] 获取任务列表 data
    const actGetTaskDetailOfTree = (val:TreeData) => {
      state.currentFocusTargetObj = JSON.parse(JSON.stringify(val))

      state.dataFormOfSearchFilter = {
        sampleCode: '',
        sampleDeptId: '',
        taskStatus: ''
      }
      state.currentPage = 1
      state.pageSize = 10
      state.totalItems = 0
      state.currentCategoryId = val.id
      actGetTaskDetailForTable(val.id, state.dataFormOfSearchFilter, state.currentPage, state.pageSize)
    }

    const getEndNodeItems = (menuTreeList:any, container:any) => {
      if (menuTreeList.children.length) {
        for (const item of menuTreeList.children) {
          container.push(item)
          if (!item.isFinalNode && item.children && item.children.length > 0) {
            getEndNodeItems(item.children, container)
          }
        }
      }
    }

    // [ACT] 获取任务列表 data
    const actGetTaskDetailForTable = (currentCategoryId:string, searchString:any, currentPage:number, pageSize:number) => {
      const tempList:any[] = []
      // if (!state.currentFocusTargetObj.isFinalNode && state.currentFocusTargetObj.children.length !== 0) {
      //   getEndNodeItems(state.currentFocusTargetObj.children, tempList)
      // }
      if (state.currentFocusTargetObj.isFinalNode === false) {
        getEndNodeItems(state.currentFocusTargetObj, tempList)
      }
      MANAGEMENT_PROCESS_INSPECTION_TASK_QUERY_API({
        taskType: state.currentInspectScene,
        taskStatus: searchString.taskStatus,
        sampleCode: searchString.sampleCode,
        sampleDeptId: searchString.sampleDeptId,
        inspectTypeIds: state.currentFocusTargetObj.isFinalNode === false ? tempList.map((item:any) => item.id) : [currentCategoryId],
        // inspectTypeIds: tempList.map((item:any) => item.id),
        planVersion: state.versionLabel,
        current: currentPage,
        size: pageSize,
        inspectMaterialCode: !state.currentFocusTargetObj.isFinalNode ? '' : state.currentFocusTargetObj.inspectMaterialCode
      }).then((res) => {
        console.log('任务列表')
        console.log(res)
        state.dataTableOfTopicMain = res.data.data.records
        state.currentPage = res.data.data.current
        state.pageSize = res.data.data.size
        state.totalItems = res.data.data.total
      })
    }

    const handleChangeDataSize = (pageSize: number) => { // 每页条数切换
      state.currentPage = 1
      state.pageSize = pageSize
      actGetTaskDetailForTable(state.currentCategoryId, state.dataFormOfSearchFilter, state.currentPage, state.pageSize)
    }
    const handleChangeCurrentPage = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      actGetTaskDetailForTable(state.currentCategoryId, state.dataFormOfSearchFilter, state.currentPage, state.pageSize)
    }

    // [ACT:define] 获取 tree-data
    const getBaseData = () => {
      INSPECT_INDEX_PARAMETER_RELATIVE_ITEM_API({
        planVersionId: state.versionValue
      }).then((res) => {
        state.dataFormOfSearchFilter = {
          sampleCode: '',
          sampleDeptId: '',
          taskStatus: ''
        }
        state.treeData = treeDataTranslater(JSON.parse(JSON.stringify(res.data.data)), 'id', 'parentId')
        // 一进页面默认跑第一笔
        if (state.currentCategoryId === '') {
          refTreeModule.value.focusCurrentNodeNumber = state.treeData[0].id
          actGetTaskDetailOfTree(state.treeData[0])
        } else {
          refTreeModule.value.focusCurrentNodeNumber = state.currentCategoryId
          actGetTaskDetailOfTree(state.currentFocusTargetObj)
        }
      })
    }

    // TODO tree-data
    // [ACT:trans] 获取组织架构
    // 叶子节点是(类别) final node
    const treeDataTranslater = (data: any[], id: string, pid: string) => {
      const res: any[] = []
      const temp: any = {}
      for (let i = 0; i < data.length; i++) {
        // 追加叶子结点  data[i].assistFlag !== 'Y'
        if (data[i].assistFlag === 'N') {
          Object.assign(data[i], { children: [], isFinalNode: true })
          data[i].inspectMaterialAlls.forEach((item:TreeDataItem) => {
            data[i].children.push({
              inspectTypeName: item.inspectTypeName,
              inspectMaterialCode: item.inspectMaterialCode,
              inspectMaterialName: item.inspectMaterialName,
              markParentId: data[i].id,
              id: item.id,
              inspectMaterialAlls: [],

              projectLocation: '',
              canClick: data[i].assistFlag !== 'Y',
              canEdit: true,
              canDelete: true,
              canAdd: true,
              canGenerate: true,
              disabled: data[i].assistFlag !== 'Y',
              existConfiguration: item.existConfiguration
            })
            if (item.existConfiguration === 'Y') {
              data[i].existConfiguration = 'Y'
            }
          })
        } else {
          // 生产辅助 smell
          if (data[i].parentId !== '0') {
            Object.assign(data[i], { isFinalNode: true })
          } else {
            Object.assign(data[i], { isFinalNode: false })
          }
        }

        if (data[i].parentId === '0') { // 第一级
          data[i]._level = 1
          data[i].canEdit = false // 是否可编辑
          data[i].canDelete = false // 是否可删除
          data[i].canAdd = false // 是否可新增
          data[i].canGenerate = false // 是否可生成
          data[i].disabled = true
          data[i].projectLocation = data[i].inspectTypeName
        } else { // 第一级以外
          data[i].canEdit = true
          data[i].canDelete = true
          data[i].canAdd = true
          data[i].canGenerate = true
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
          if (data[k].existConfiguration === 'Y') {
            temp[data[k][pid]].existConfiguration = 'Y'
          }
          if (!data[k]._level) {
            data[k]._level = temp[data[k][pid]]._level + 1
          }
          if (data[k]._level !== 1) {
            data[k].projectLocation = temp[data[k][pid]].projectLocation + '-' + data[k].inspectTypeName
          }
          if (data[k].inspectMaterialAlls.length) {
            data[k].inspectMaterialAlls.forEach((subItem:TreeDataItem, index:number) => {
              subItem.projectLocation = data[k].projectLocation + '-' + subItem.inspectMaterialName
              data[k].children[index].projectLocation = data[k].projectLocation + '-' + subItem.inspectMaterialName
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

    // [ACT:define] 获取指标编码下拉
    const getDropDownOptions = async (id:string) => {
      // 获取检验类下的取样单位
      await MANAGEMENT_PROCESS_INSPECTION_TASK_INSPECT_MATERIAL_DROP_DOWN_API({
        id
      }).then((res) => {
        state.sampleUnitptions = res.data.data
      })
    }

    // [Dialog][BTN:取消]
    const btnCancelItemEditOfDialog = () => {
      reset()
      state.isDialogVisibleForGlobleItem = false
    }

    // [Dialog][ACTION:取消]
    const reset = () => {
      state.formGlobleItem = {
        id: '',
        sampleCode: '',
        taskStatus: '',
        inspectContent: '',
        sampleDeptId: '',
        sampleDeptName: '',
        inspectSiteName: '',
        materialInfo: '',
        inspectBatch: '',
        itemName: '',
        supplier: ''
      }
    }

    // [Dialog][BTN:确认]
    const btnConfirmItemOfDialog = async () => {
      refGlobleItem.value.validate(async (valid: boolean) => {
        if (valid) {
          await MANAGEMENT_PROCESS_INSPECTION_TASK_UPDATE_API({
            ...state.formGlobleItem
          })

          proxy.$successToast('操作成功')
          getBaseData() // reload
          btnCancelItemEditOfDialog()
        }
      })
    }

    const actChangeSampleUnitOfFormGlobleItem = (val:string) => {
      state.sampleUnitptions.forEach(item => {
        if (item.deptId === val) {
          state.formGlobleItem.sampleDeptName = item.deptName
        }
      })
    }

    // [FORM:select][EVENT:change] 版本
    const handleChangeSelectVersion = (val:string) => {
      state.dataFormOfSearchFilter = {
        sampleCode: '',
        sampleDeptId: '',
        taskStatus: ''
      }
      state.versionnValueOptions.forEach(item => {
        if (item.id === val) {
          state.versionLabel = item.planVersion
        }
      })

      val && resetTaskSearchFilter(val)

      // [ACT:get] 获取 tree-data
      state.currentCategoryId = '' // 初始化
      refTreeModule.value.focusCurrentNodeNumber = '' // 初始化
      getBaseData()
    }

    // [FROM:SearchBar] 获取取样部门下拉
    const resetTaskSearchFilter = (val:string) => {
      MANAGEMENT_PROCESS_INSPECTION_TASK_SAMPLE_DEPARTMENT_DROP_DOWN_API({
        planVersionId: val
      }).then((res) => {
        state.sampleDeptIdOptions = res.data.data
      })
    }

    // [ACT:] 获取版本下拉
    const getVersionOptions = async () => {
      await MANAGEMENT_INSPECTION_PLAN_VERSION_DROP_DOWN_API({
        inspectScene: state.currentInspectScene
      }).then((res) => {
        console.log('获取版本下拉')
        console.log(res.data.data)
        state.versionnValueOptions = res.data.data
      })
    }

    onMounted(async () => {
      // 获取状态下拉
      DICTIONARY_QUERY_API({ dictType: 'TASK_STATUS' }).then((res) => {
        state.taskStatusOptions = res.data.data.filter((item:DictOptions) => item.dictCode !== 'SAVED' && item.dictCode !== 'OUT_STORAGE') // 除去已保存、已出库
      })

      // 获取版本讯息
      await getVersionOptions()

      // 预设带入第一笔版本
      if (state.versionnValueOptions[0]) {
        state.versionLabel = state.versionnValueOptions[0].planVersion
        state.versionValue = state.versionnValueOptions[0].id
        handleChangeSelectVersion(state.versionValue)
      }
    })

    return {
      ...toRefs(state),
      // EVENT
      handleChangeDataSize,
      handleChangeCurrentPage,
      handleChangeSelectVersion,
      // BTN
      btnClickItemEditOfTopicMainData,
      btnClickItemCancelOfTopicMainData,
      btnCancelItemEditOfDialog,
      btnConfirmItemOfDialog,
      // ACT
      actGetTaskDetailOfTree,
      actGetTaskDetailForTable,
      actChangeSampleUnitOfFormGlobleItem,
      reset,
      // REF
      refTreeModule,
      ruleGlobleItem,
      refGlobleItem
    }
  }
})
</script>

<style scoped>
.el-form-item {
    margin-bottom: 0px;
}
.dialogForm .el-form-item {
    margin-bottom: 20px;
}
</style>
