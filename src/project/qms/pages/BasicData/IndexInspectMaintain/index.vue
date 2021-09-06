<template>
  <tree-page
    ref="treeModule"
    :title="pageMainTitle"
    :leftTitle="pageLeftColumnTitle"
    :rightTitle="pageRightColumnTitle"
    :treeData="treeData"
    :nodeKey="'inspectMethodId'"
    :treeProps="{ label: 'inspect',children:'inspectGroups' }"
    @treeNodeClick="val=>{return getMaterialDetail('default',val,'')}"
    @treeNodeContextMenu="treeNodeContextMenuHandle"
  >
    <template #context--menu >
      <ul>
        <li class="contextMenu" @click="btnHandleItemOfTreeMenu(globalMainObj)" v-if="isSubMenuAddBNTShow">新增</li>
        <li class="contextMenu" @click="btnHandleItemOfTreeMenu(globalMainObj)" v-if="isSubMenuDeitBNTShow">编辑</li>
        <li class="contextMenu" @click="btnRemoveItemOfTreeMenu(globalMainObj)" v-if="isSubMenuDeitBNTShow">删除</li>
      </ul>
    </template>
    <template #view>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content: flex-end; padding-right:10px;line-height:1.7em;">
            <el-input
              placeholder="过程参数"
              v-model="textParameterGroupSearch"
              size="small"
              clearable
              style="margin-bottom:10px; width:200px; height:35px; margin-right:10px"
              :disabled="Object.keys(globalMainObj).length===0"
              @keyup.enter="btnGetMainData"
              >
            </el-input>
            <div>
              <el-button icon="el-icon-search" class="topic-button" size="small" @click="btnGetMainData" :disabled="Object.keys(globalMainObj).length===0">查询</el-button>
              <el-button icon="el-icon-plus" class="topic-button" type="primary" size="small" @click="handleParameterItem()" :disabled="Object.keys(globalMainObj).length===0">新增</el-button>
              <el-button icon="el-icon-delete" class="topic-button" type="danger" size="small" @click="btnDeleteOfParameterGroupDataDelete" :disabled="multipleSelection.length===0">批量删除</el-button>
            </div>
        </div>
        <el-table :data="topicMainData"
            style="width: 100%"
            max-height="500"
            border tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            @row-dblclick="setProcessParameter"
            :row-style="tableRowFocusStyle"
            >
            <el-table-column type="selection" width="45" />
            <el-table-column type="index" :index="index => index + 1 + (Number(currentPage) - 1) * (Number(pageSize))" label="序号"  width="55" fixed align="center" size="small" />
            <el-table-column label="编码" prop="parameterGroupCode" :show-overflow-tooltip="true" min-width="100" />
            <el-table-column label="过程参数组" prop="parameterGroupName" :show-overflow-tooltip="true" min-width="100" />
            <el-table-column label="关联项" prop="groupMaterialName" :show-overflow-tooltip="true" min-width="100" />
            <!--todo-->
            <el-table-column v-if="globalMainObj.inspectPropertyName === '微生物类'" label="参数明细" prop="parameterDetails" :show-overflow-tooltip="true" min-width="100" />
            <el-table-column fixed="right" label="操作" header-align="left" align="left" width="80">
                <template #default="scope">
                    <el-button  type="text" icon="el-icon-edit" @click="handleParameterItem(scope.row)" class="role__btn">
                        <em>编辑</em>
                    </el-button>
                </template>
            </el-table-column>
          </el-table>

        <el-pagination
          v-if="topicMainData.length!==0"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          >
        </el-pagination>
      </div>
      <process-parameter v-if="isImportTableDataShow" ref="refFunctionDialog" :title="'过程参数'" :importObj="importObj"  />
    <!-- <process-parameter v-model:dialogVisible="isImportTableDataShow" ref="refFunctionDialog" :title="'过程参数'" :importObj="importObj"  @reset="reset" /> -->
    </template>
  </tree-page>

  <el-dialog :title="mainDialog.title" v-model="isDialogVisibleForItemControl" width="40%" >
    <!--检验方法-->
    <template v-if="mainDialog.title==='检验方法'">
      <el-form :model="inspectTypeform">
        <el-form-item :label="mainDialog.title" :label-width="'120px'" class="required">
          <el-select  v-model="inspectTypeform.inspectType" placeholder="请选择" style="width:100%" filterable clearable>
            <el-option v-for="(opt, optIndex) in inspectTypeOptions" :key="optIndex" :label="opt.inspectMethodName" :value="opt.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <!--参数配置-->
    <template v-if="mainDialog.title==='参数配置'">
      <el-form :model="addParameterGroupform">
        <el-form-item v-if="addParameterGroupform.id!==''" label="编码：" prop="parameterGroupCode" :label-width="'140px'" >
          <el-input v-model="addParameterGroupform.parameterGroupCode" class="140px" autocomplete="off" :disabled="true" placeholder="自动带出"></el-input>
        </el-form-item>
        <el-form-item label="过程参数组：" prop="parameterGroupName" :label-width="'140px'" class="required">
          <el-input v-model="addParameterGroupform.parameterGroupName" class="140px" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="关联项：" :label-width="'140px'" class="required" style="position:relative;">
              <div class="selfStyleFormItem">
                <el-popover
                  placement="bottom-start"
                  :width="400"
                  v-model:visible="visible"
                  trigger="click"
                  :show-arrow="false"
                  @hide="popperHide"
                >
                  <template #reference>
                    <div class="el-input el-input--suffix">
                      <input class="el-input__inner" type="botton" readonly="" autocomplete="off" placeholder="请选择" v-model="parameterTreeSelectedString"  >
                      <span class="el-input__suffix">
                        <span class="el-input__suffix-inner">
                          <i v-if="!visible" class="el-select__caret el-input__icon el-icon-arrow-up"></i>
                          <i v-else class="el-select__caret el-input__icon el-icon-arrow-down"></i>
                        </span>
                      </span>
                    </div>
                  </template>
                  <div class="selfStyleFormItem-content">
                    <div class="filter-input" style="margin-bottom:5px;">
                      <el-input v-model="filterText" placeholder="输入名称搜索" size="small">
                        <template #suffix>
                          <em class="el-input__icon el-icon-search" />
                        </template>
                      </el-input>
                    </div>
                    <div class="tree-main SelfScrollbar" style="height:300px;overflow-y:scroll;">
                      <el-tree
                      ref="parameterTreeRef"
                      :data="parameterTreeData"
                      :props="{ label: 'inspectTypeName',children:'children' }"
                      node-key="id"
                      highlight-current
                      show-checkbox
                      :default-expanded-keys="expandedKeys"
                      :default-checked-keys="parameterTreeSslected"
                      :filter-node-method="filterNode"
                      @check-change="parameterTreeNodeClick"
                      />
                    </div>
                </div>
                </el-popover>
              </div>
        </el-form-item>
        <el-form-item v-if="globalMainObj.inspectPropertyName === '微生物类'" label="参数明细：" prop="parameterDetailsList" :label-width="'140px'">
          <div v-for="(item,index) in addParameterGroupform.parameterDetailsList" :key="index">
            <el-input  v-model="addParameterGroupform.parameterDetailsList[index]" maxlength="10"  autocomplete="off" placeholder="请输入" style="margin-bottom:5px; margin-right:5px; width:80% !important"></el-input>
            <el-button icon="el-icon-delete"  size="small" @click="() => addParameterGroupform.parameterDetailsList.splice(index, 1)" v-if="addParameterGroupform.parameterDetailsList.length>=2" />
            <el-button icon="el-icon-plus" v-if="addParameterGroupform.parameterDetailsList.length-1 === index" @click="addParameterDetailsItem" size="small"></el-button>
          </div>
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" class="topic-button" icon="el-icon-circle-close" @click="btnItemFloatClear">取 消</el-button>
        <!--检验方法-->
        <template v-if="mainDialog.title==='检验方法'">
          <el-button size="small" class="topic-button" type="primary" icon="el-icon-circle-check" @click="btnItemFloatConfirm(inspectTypeform.inspectType)">确 定</el-button>

        </template>
        <template v-if="mainDialog.title==='参数配置'">
          <el-button size="small" class="topic-button" type="primary" icon="el-icon-circle-check" @click="btnAddItemFloatConfirm()">确 定</el-button>
        </template>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, reactive, onMounted, getCurrentInstance, ComponentInternalInstance, watch } from 'vue'
import {
  INSPECT_INDEX_METHOD_QUERY_API,
  INSPECT_INDEX_METHOD_DROPDOWN_QUERY_API,
  INSPECT_INDEX_METHOD_EDIT_API,
  INSPECT_INDEX_METHOD_ADD_API,
  INSPECT_INDEX_METHOD_REMOVE_API,
  INSPECT_INDEX_PARAMETER_GROUP_QUERY_API,
  INSPECT_INDEX_PARAMETER_RELATIVE_ITEM_API,
  INSPECT_INDEX_PARAMETER_GROUP_INSERT_API,
  INSPECT_INDEX_PARAMETER_GROUP_EDIT_API,
  INSPECT_INDEX_PARAMETER_GROUP_DELETE_API,
  DICTIONARY_QUERY_API
} from '@/api/api'
import ProcessParameter from './ProcessParameter.vue'

interface TreeItemData { // 物料分类 API
  id?: string
  _level?: number
  canEdit?: boolean
  inspect?: string
  inspectGroups?:TreeItemData[]
  inspectMethodCode?:string
  inspectIndexId?: string
  inspectMethodId?: string
  inspectProperty?: string
  inspectPropertyName?: string
}

interface ParameterTreeData {
    id: string;
    inspectMaterialCode: string;
    inspectMaterialName: string;
    inspectTypeName: string;
}

interface InspectTypeform{
  inspectType: string
}

interface AddParameterGroupform{
  id: string
  inspectIndexMethodId:string
  parameterGroupCode: string
  parameterGroupName: string
  isFormItemContentShow: boolean
  parameterDetails: string
  parameterDetailsList: string[]
}

interface TreeData { // 物料分类 API
  id: string
  inspect: string
  inspectGroups: TreeData[]
  inspectIndexId: string
  inspectMethodId: string
  inspectProperty: string
  inspectPropertyName: string
}

interface TopicMainData { // 参数组 API
  groupMaterialName: string;
  id:string;
  inspectIndexMethodId: string;
  inspectMaterialId: string;
  inspectMaterialIds: string[]
  parameterDetails:string;
  parameterGroupCode: string;
  parameterGroupName: string;
  isCurrentFocusRow: boolean
}

interface InspectTypeOptions {
  id: string
  inspectMethodCode: string
  inspectMethodName: string
  inspectProperty: string
  inspectPropertyName: string
}

interface MainDialog{
  title:string
}

interface State {
  isImportTableDataShow: boolean
  pageMainTitle: string
  pageLeftColumnTitle: string
  pageRightColumnTitle: string
  textParameterGroupSearch: string // 物料明细查找
  totalItems: number
  currentPage: number
  pageSize: number
  topicMainData: TopicMainData[]
  treeData: TreeData[]
  parameterTreeData: ParameterTreeData[]
  isSubMenuAddBNTShow: boolean
  isSubMenuDeitBNTShow: boolean
  isDialogVisibleForItemControl: boolean
  inspectTypeform:InspectTypeform // 检验方法
  addParameterGroupform: AddParameterGroupform //
  globalMainObj:TreeItemData
  inspectTypeOptions:InspectTypeOptions[]
  mainDialog:MainDialog // 弹窗 format object\
  expandedKeys: string []
  parameterTreeSslected: string[]
  parameterTreeCheckNodes: ParameterTreeData[]
  parameterTreeSelectedString: string
  multipleSelection: string[]
  importObj: TopicMainData | null
  inspectPropertyOptions: any
}

export default defineComponent({
  name: 'InspectionCategoryDetail',
  components: {
    ProcessParameter
  },
  props: {
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const filterText = ref('')
    const visible = ref(false)
    /**  == 变量 ==  **/
    const state = reactive<State>({
      globalMainObj: {}, // 点击 Tree node 带出的全局 obj
      isImportTableDataShow: false, // import table show ?
      pageMainTitle: '检验方法明细',
      pageLeftColumnTitle: '指标检验方法明细',
      pageRightColumnTitle: '参数明细',
      textParameterGroupSearch: '',
      totalItems: 0,
      currentPage: 1,
      pageSize: 10,
      topicMainData: [],
      treeData: [],
      parameterTreeData: [],
      isSubMenuAddBNTShow: false,
      isSubMenuDeitBNTShow: false,
      isDialogVisibleForItemControl: false,
      inspectTypeform: { // [form]检验方法
        inspectType: ''
      },
      addParameterGroupform: { // [form]参数配置
        id: '',
        inspectIndexMethodId: '',
        parameterGroupCode: '',
        parameterGroupName: '',
        isFormItemContentShow: false,
        parameterDetails: '',
        parameterDetailsList: []
      },
      inspectTypeOptions: [],
      mainDialog: {
        title: ''
      },
      expandedKeys: [], // 默认展开节点
      parameterTreeSslected: [], // 已选取
      parameterTreeCheckNodes: [],
      parameterTreeSelectedString: '',
      multipleSelection: [],
      importObj: null,
      inspectPropertyOptions: {}
    })
    const refFunctionDialog = ref()
    const treeModule = ref()
    const parameterTreeRef = ref()

    const reset = () => {
      state.isImportTableDataShow = false
    }
    // [ACT: ][参数组] get data
    const getMaterialDetail = (who:string, val:TreeItemData, searchString:string) => {
      console.log('点击物件')
      console.log(val)

      // 仅 方法 可以触发
      if (val.id !== '' && val._level === 3) {
        if (who === 'default') {
          state.globalMainObj = val
        }

        state.textParameterGroupSearch = searchString
        INSPECT_INDEX_PARAMETER_GROUP_QUERY_API({
          inspectIndexMethodId: state.globalMainObj.id,
          parameterGroupCodeOrName: state.textParameterGroupSearch,
          current: state.currentPage,
          size: state.pageSize
        }).then((res) => {
          console.log('获取参数组')
          console.log(res.data.data)
          state.topicMainData = res.data.data.records
          state.topicMainData.forEach((item:TopicMainData) => { item.isCurrentFocusRow = false })
          state.currentPage = res.data.data.current
          state.pageSize = res.data.data.size
          state.totalItems = res.data.data.total
          state.isImportTableDataShow = false // 过程参数区块隐藏
        })
      } else {
        state.globalMainObj = {}
        state.textParameterGroupSearch = ''
      }
    }

    // [参数组] 每页条数切换
    const handleSizeChange = (pageSize: number) => { // 每页条数切换
      state.currentPage = 1
      state.pageSize = pageSize
      getMaterialDetail('', { id: state.globalMainObj.id, _level: state.globalMainObj._level }, state.textParameterGroupSearch)
    }

    // [参数组] 页码切换
    const handleCurrentChange = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      getMaterialDetail('', { id: state.globalMainObj.id, _level: state.globalMainObj._level }, state.textParameterGroupSearch)
    }

    // [ACTION:load][指标检验方法明细] tree - get material detail data
    const getMainTreeData = () => {
      INSPECT_INDEX_METHOD_QUERY_API({
      }).then((res) => {
        state.textParameterGroupSearch = ''
        console.log('res.data.data')
        console.log(res.data.data)
        state.treeData = treeDataTranslater(res.data.data) // 转换结构

        console.log('指标检验方法明细 treeData')
        console.log(state.treeData)
        state.topicMainData = []
        // 默认 Tree-Data 第一笔 给 id
        state.treeData[0].inspectGroups[0].inspectMethodId = 'b'
        treeModule.value.focusCurrentNodeNumber = state.treeData[0].inspectGroups[0].inspectMethodId
      })
    }

    // [指标检验方法明细] Tree data 处理
    const treeDataTranslater = (data: any[]): any[] => {
      for (let i = 0; i < data.length; i++) {
        // 数据缺省 id , 前端赋予 id , 避免 tree 高亮问题
        if (data[i].inspectMethodId === '') {
          data[i].inspectMethodId = 'a'
        }
        data[i].inspect = state.inspectPropertyOptions[data[i].inspect] || '不分类'
        // data[i].inspect = data[i].inspect === 'CHEMISTRY' ? '理化类' : data[i].inspect === 'MICROORGANISM' ? '微生物类' : '不分类'
        data[i].canEdit = false
        data[i]._level = 1
        for (let j = 0; j < data[i].inspectGroups.length; j++) {
          data[i].inspectGroups[j]._level = 2
          data[i].inspectGroups[j].canEdit = true
          // 数据缺省 id , 前端赋予 id , 避免 tree 高亮问题
          if (data[i].inspectGroups[j].inspectMethodId === '') {
            data[i].inspectGroups[j].inspectMethodId = 'a'
          }
          for (let k = 0; k < data[i].inspectGroups[j].inspectGroups.length; k++) {
            data[i].inspectGroups[j].inspectGroups[k]._level = 3
            data[i].inspectGroups[j].inspectGroups[k].canEdit = true
          }
        }
      }
      return JSON.parse(JSON.stringify(data))
    }
    // [指标检验方法明细] 触发
    const treeNodeContextMenuHandle = (val:TreeItemData) => {
      state.globalMainObj = val // 赋予全局当前 node infomation
      if (val.canEdit === true && val._level === 2) { // display 新增 submenu
        state.isSubMenuAddBNTShow = true
        state.isSubMenuDeitBNTShow = false
      } else if (val.canEdit === true && val._level === 3) { // display 编辑 & 删除 submenu
        state.isSubMenuAddBNTShow = false
        state.isSubMenuDeitBNTShow = true
      }
    }

    // [BTN:新增]&[BTN:编辑][指标检验方法明细] TreeMenu
    const btnHandleItemOfTreeMenu = (val:TreeItemData) => {
      if (!val.id) { // 新增
        state.inspectTypeform.inspectType = ''
        state.isDialogVisibleForItemControl = true
      } else { // 编辑
        state.inspectTypeform.inspectType = val.inspectMethodId as string
        state.isDialogVisibleForItemControl = true
      }
      state.mainDialog = {
        title: '检验方法'
      }
      // 呼叫下拉选单
      if (state.inspectTypeOptions.length === 0) { // 加判断,避免多次 API
        INSPECT_INDEX_METHOD_DROPDOWN_QUERY_API({ // get 检验方法
          id: '',
          inspectProperty: val.inspectProperty
        }).then((res) => {
          state.inspectTypeOptions = res.data.data
        })
      }
    }

    // [BTN:删除][指标检验方法明细] Tree submenu
    const btnRemoveItemOfTreeMenu = (val:TreeItemData) => {
      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await INSPECT_INDEX_METHOD_REMOVE_API({
          id: val.id
        })
        if (res.data.code === 200) {
          proxy.$successToast('操作成功')
          // reload
          await getMainTreeData()
        }
      })
    }

    // [BTN:确定][指标检验方法明细] Dialog
    const btnItemFloatConfirm = (val:string) => {
      if (val === '') {
        proxy.$errorToast('请录入必填栏位')
        return
      }

      if (!state.globalMainObj.id) { // 新增
        INSPECT_INDEX_METHOD_ADD_API({
          id: state.globalMainObj.id,
          inspectIndexId: state.globalMainObj.inspectIndexId,
          inspectMethodId: val
        }).then(() => {
          proxy.$successToast('操作成功')
          state.isDialogVisibleForItemControl = false
          getMainTreeData()
        })
      } else {
        INSPECT_INDEX_METHOD_EDIT_API({ // 编辑
          id: state.globalMainObj.id,
          inspectIndexId: state.globalMainObj.inspectIndexId,
          inspectMethodId: val
        }).then(() => {
          proxy.$successToast('操作成功')
          state.isDialogVisibleForItemControl = false
          getMainTreeData()
        })
      }
    }
    // [BTN:取消][指标检验方法明细&参数明细] dialog
    const btnItemFloatClear = () => {
      // 共用弹窗取消后操作
      if (state.mainDialog.title === '检验方法') {
        state.inspectTypeform.inspectType = ''
        state.mainDialog = {
          title: ''
        }
      } else if (state.mainDialog.title === '参数配置') {
        clearParameterDialogFormData()
      }
      state.isDialogVisibleForItemControl = false
    }

    // [BTN:确定][参数明细] 新增+编辑 function dialog
    const btnAddItemFloatConfirm = () => {
      if (state.addParameterGroupform.parameterGroupName === '' || state.parameterTreeSelectedString === '') {
        proxy.$errorToast('请录入必填栏位')
        return
      }

      let temp:string[] = []
      let tempStr = ''
      if (state.globalMainObj.inspectPropertyName === '微生物类') { // 微生物类
        temp = state.addParameterGroupform.parameterDetailsList.filter(item => item !== '')
        tempStr = temp.join()
      }

      if (!state.addParameterGroupform.id) { // 新增
        INSPECT_INDEX_PARAMETER_GROUP_INSERT_API({
          inspectIndexMethodId: state.globalMainObj.id,
          inspectMethodCode: state.globalMainObj.inspectMethodCode,
          parameterGroupCode: state.addParameterGroupform.parameterGroupCode,
          parameterGroupName: state.addParameterGroupform.parameterGroupName,
          inspectMaterialNames: state.parameterTreeCheckNodes,
          parameterDetails: tempStr
        }).then(() => {
          proxy.$successToast('操作成功')
          clearParameterDialogFormData()
          state.isDialogVisibleForItemControl = false
          getMaterialDetail('', { id: state.globalMainObj.id, _level: state.globalMainObj._level }, state.textParameterGroupSearch)
        })
      } else { // 编辑
        INSPECT_INDEX_PARAMETER_GROUP_EDIT_API({ // 编辑
          id: state.addParameterGroupform.id,
          inspectMethodCode: state.globalMainObj.inspectMethodCode,
          inspectIndexMethodId: state.globalMainObj.id,
          parameterGroupCode: state.addParameterGroupform.parameterGroupCode,
          parameterGroupName: state.addParameterGroupform.parameterGroupName,
          inspectMaterialNames: state.parameterTreeCheckNodes,
          parameterDetails: tempStr
        }).then(() => {
          proxy.$successToast('操作成功')
          clearParameterDialogFormData()
          state.isDialogVisibleForItemControl = false
          getMaterialDetail('', { id: state.globalMainObj.id, _level: state.globalMainObj._level }, state.textParameterGroupSearch)
        })
      }
    }

    // [BTN:查询][过程参数] search bar
    const btnGetMainData = () => {
      state.currentPage = 1
      state.pageSize = 10
      getMaterialDetail('', { id: state.globalMainObj.id, _level: state.globalMainObj._level }, state.textParameterGroupSearch)
    }
    // 参数组弹窗 init
    const clearParameterDialogFormData = () => {
      state.addParameterGroupform.parameterGroupCode = ''
      state.addParameterGroupform.parameterGroupName = ''
      filterText.value = ''
      state.parameterTreeSelectedString = ''
      state.parameterTreeSslected = []
      parameterTreeRef.value.setCheckedNodes([])
      state.parameterTreeCheckNodes = []
      state.addParameterGroupform.parameterDetails = ''
      state.addParameterGroupform.parameterDetailsList = []
    }

    watch(filterText, (val) => {
      parameterTreeRef.value.filter(val)
    })

    // [参数明细] 关联项 tree-data 处理
    const parameterTreeDataTranslater = (data: any[], id: string, pid: string) => {
      const res: any[] = []
      const temp: any = {}
      for (let i = 0; i < data.length; i++) {
        data[i].children = []
        data[i].inspectMaterialAlls.forEach((item:ParameterTreeData) => {
          // data[i].children.push({ inspectTypeName: item })
          data[i].children.push(item)
        })
        data[i].inspectMaterialCode = data[i].inspectTypeCode
        data[i].inspectMaterialName = data[i].inspectTypeName
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
        } else {
          res.push(data[k])
        }
      }
      return res
    }

    const parameterTreeNodeClick = () => {
      state.parameterTreeCheckNodes = parameterTreeRef.value.getCheckedNodes(true)
      state.parameterTreeSslected = state.parameterTreeCheckNodes.map((it: any) => it.id)
    }

    // [BTN:批量删除][参数明细]
    const btnDeleteOfParameterGroupDataDelete = () => {
      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await INSPECT_INDEX_PARAMETER_GROUP_DELETE_API(
          state.multipleSelection
        )
        if (res.data.code === 200) {
          proxy.$successToast('操作成功')
          // reload
          getMaterialDetail('', { id: state.globalMainObj.id, _level: state.globalMainObj._level }, state.textParameterGroupSearch)
        }
      })
    }

    // [BTN:编辑][BTN:新增][参数明细]
    const handleParameterItem = (row:TopicMainData) => {
      if (row) { // 编辑
        console.log('编辑')
        state.addParameterGroupform.id = row.id
        state.parameterTreeSelectedString = row.groupMaterialName
        state.parameterTreeSslected = row.inspectMaterialIds
        state.addParameterGroupform.parameterGroupCode = row.parameterGroupCode
        state.addParameterGroupform.parameterGroupName = row.parameterGroupName
        console.log('state.globalMainObj')
        console.log(state.globalMainObj)
        if (state.globalMainObj.inspectPropertyName === '微生物类') { // 微生物类
          state.addParameterGroupform.parameterDetails = row.parameterDetails
          state.addParameterGroupform.parameterDetailsList = row.parameterDetails.split(',')
        } else { // 理化类
          state.addParameterGroupform.parameterDetails = ''
          state.addParameterGroupform.parameterDetailsList = []
        }
      } else { // 新增
        console.log('新增')
        if (state.globalMainObj.inspectPropertyName === '微生物类') { // 微生物类
          state.addParameterGroupform = { // [form]参数配置
            id: '',
            inspectIndexMethodId: '',
            parameterGroupCode: '',
            parameterGroupName: '',
            isFormItemContentShow: false,
            parameterDetails: '',
            parameterDetailsList: ['']
          }
          state.parameterTreeSelectedString = ''
          state.parameterTreeSslected = []
        } else { // 理化类
          state.addParameterGroupform = { // [form]参数配置
            id: '',
            inspectIndexMethodId: '',
            parameterGroupCode: '',
            parameterGroupName: '',
            isFormItemContentShow: false,
            parameterDetails: '',
            parameterDetailsList: []
          }
          state.parameterTreeSelectedString = ''
          state.parameterTreeSslected = []
        }
      }
      state.isDialogVisibleForItemControl = true
      state.mainDialog = {
        title: '参数配置'
      }

      if (state.parameterTreeData.length === 0) {
        INSPECT_INDEX_PARAMETER_RELATIVE_ITEM_API(
        ).then((res) => {
          state.parameterTreeData = parameterTreeDataTranslater(JSON.parse(JSON.stringify(res.data.data)), 'id', 'parentId')
        })
      }
    }

    // [参数明细][关联项] filter
    const filterNode = (value:string, data:any) => {
      if (!value) return true
      return data.inspectTypeName.indexOf(value) !== -1
    }

    // [参数明细][关联项] 弹出
    const popperHide = () => {
      if (state.parameterTreeCheckNodes.length !== 0) {
        state.parameterTreeSelectedString = state.parameterTreeCheckNodes.map((it: any) => it.inspectMaterialName).join(',')
      } else {
        state.parameterTreeSelectedString = ''
      }
    }
    //  [参数明细] 删除勾选
    const handleSelectionChange = (val:TopicMainData[]) => {
      state.multipleSelection = []
      val.forEach((item:TopicMainData) => {
        state.multipleSelection.push(item.id)
      })
    }

    // [db-click]可双点击参数明细 item 进入
    const setProcessParameter = (row:TopicMainData) => {
      if (state.globalMainObj.inspectPropertyName === '理化类') { // 理化类方可双点击进入
        state.topicMainData.forEach((item:TopicMainData) => { item.isCurrentFocusRow = false })
        row.isCurrentFocusRow = true
        state.importObj = row
        state.isImportTableDataShow = true
      } else {
        state.isImportTableDataShow = false
      }
    }
    // [参数明细] 微生物 dialog  + button
    const addParameterDetailsItem = () => {
      state.addParameterGroupform.parameterDetailsList.push('')
    }

    const tableRowFocusStyle = (object: any) => {
      if (state.topicMainData[object.rowIndex].isCurrentFocusRow === true) {
        return 'background-color: #ecf5ff' // --el-color-primary-light-9
      }
    }

    onMounted(async () => {
      // 检验属性下拉
      await DICTIONARY_QUERY_API({ dictType: 'INSPECT_PROPERTY' }).then((res) => {
        res.data.data.forEach((item:any) => {
          state.inspectPropertyOptions[item.dictCode] = item.dictValue
        })
        console.log('检验属性下拉')
        console.log(state.inspectPropertyOptions)
      })
      // 获取
      await getMainTreeData()
    })

    return {
      ...toRefs(state),
      refFunctionDialog,
      handleParameterItem,
      handleSizeChange,
      handleCurrentChange,
      getMaterialDetail,
      reset,
      treeModule,
      parameterTreeRef,
      treeNodeContextMenuHandle,
      btnGetMainData, // dataTable btn
      btnDeleteOfParameterGroupDataDelete, // dataTable btn
      btnHandleItemOfTreeMenu, // TreeMenu btn
      btnRemoveItemOfTreeMenu, // TreeMenu btn
      btnItemFloatConfirm,
      btnItemFloatClear,
      btnAddItemFloatConfirm,
      parameterTreeNodeClick,
      filterText,
      visible,
      filterNode,
      popperHide,
      handleSelectionChange,
      setProcessParameter,
      addParameterDetailsItem,
      tableRowFocusStyle
    }
  }
})
</script>

<style lang="scss" scoped>
.selfStyleFormItem{
    .selfStyleFormItem-title{
      color: #cccccc;
      border: var(--el-border-base);
      border-color: var(--el-border-color-base);
      border-radius: var(--el-border-radius-base);
      background-color: var(--el-color-white);
      --el-input-icon-color: var(--el-text-color-placeholder);
      --el-input-placeholder-color: var(--el-text-color-placeholder);
      --el-input-hover-border: var(--el-border-color-hover);
      --el-input-clear-hover-color: var(--el-text-color-secondary);
      --el-input-focus-border: var(--el-color-primary);
      position: relative;
      font-size: var(--el-font-size-base);
      display: inline-block;
      padding: 0 15px  !important;
      width: 100%;
      line-height: 40px;
      margin-bottom: 5px;
      box-sizing: border-box;
      text-align: left;
    }
    .selfStyleFormItem-content{
      border: var(--el-border-base);
      border-color: var(--el-border-color-base);
      border-radius: var(--el-border-radius-base);
      background-color: var(--el-color-white);
      padding: 10px;
    }
}

</style>
<style scoped >
.required ::v-deep(.el-form-item__label:before) {
    content: "*";
    color: var(--el-color-danger);
    margin-right: 4px;
}

</style>
