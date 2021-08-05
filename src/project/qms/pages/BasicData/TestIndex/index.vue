<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-30 11:24:46
 * @LastEditors: Telliex
 * @LastEditTime: 2021-08-04 10:51:34
-->
<template>
  <mds-card class="test_method" title="检验指标标准" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="float: right;display: flex;">
        <el-form ref="pstngDate" :model="controlForm" size="small" :inline="true" label-position="right" label-width="82px" class="topforms" style=" float: left;">
          <el-form-item label="" prop="pstngDate">
            <el-input suffix-icon="el-icon-search" v-model="controlForm.filterText" placeholder="指标名称" clearable style="width: 160px;" />
          </el-form-item>
        </el-form>
        <div style="float: right;">
          <el-button icon="el-icon-search" type="primary" size="small" @click="btnGetMainData">查询</el-button>
          <el-button icon="el-icon-circle-plus-outline" type="primary" size="small" @click="btnAddItemData">新增</el-button>
          <el-button icon="el-icon-delete" type="primary" size="small" @click="btnBatchDelete">批次删除</el-button>
        </div>
      </div>
    </template>
    <el-table ref="multipleTable"  :cell-style="{'text-align':'center'}" :data="topicMainData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" tooltip-effect="dark" style="width: 100%" @selection-change="actHandleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" :index="(index) => index + 1 + (currentPage - 1) * pageSize" width="50" />
      <el-table-column label="检验类别\物料" min-width="200" prop="inspectMaterialTypeName" show-overflow-tooltip />
      <el-table-column label="指标代码" width="160" prop="indexCode" show-overflow-tooltip />
      <el-table-column label="指标名称" width="160" prop="indexName" show-overflow-tooltip />
      <el-table-column label="单位" width="100" prop="indexUnit" show-overflow-tooltip />
      <el-table-column label="方法" width="200" prop="indexMethod" show-overflow-tooltip />
      <el-table-column label="指标类" width="160" prop="indexType" show-overflow-tooltip />
      <el-table-column label="指标类描述" width="160" prop="indexTypeName" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope" >
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="btnEditItemData(scope.row)">
           编辑
          </el-button>
          <el-button type="text" icon="el-icon-money" class="role__btn" @click="btnVersionController(scope.row)">
           版本管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="float: right">
      <el-pagination
        v-if="topicMainData.length!==0"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="totalItems"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="val => pageSize = val"
        @current-change="val => currentPage = val"
      />
    </el-row>
  </mds-card>
  <!--指标弹窗-->
  <el-dialog :title="singleItemform.title" v-model="isDialogVisibleForItemControl" width="40%">
    <el-form :model="singleItemform">
      <el-form-item label="检验类别\物料" :label-width="'120px'">
        <el-select v-model="singleItemform.inspectMaterialId" placeholder="请选择检验类别\物料" style="width:100%" filterable @change="selectInspectMaterialChange" clearable>
          <el-option v-for="(opt, optIndex) in inspectMaterialOptions" :key="optIndex" :label="opt.inspectMaterialTypeName" :value="opt.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="指标代码" :label-width="'120px'">
        <template v-if="singleItemform.title==='新增指标'">
          <!-- {{singleItemform.inspectIndexName}} -->
          <div v-if="singleItemform.title='新增指标'" class="item-imput" @click="actAddIndexId">
            <p>
              <el-tag
                :key="tag.id"
                v-for="tag in tempMultiSelected"
                :disable-transitions="false"
                :hit="false"
                color="#fefefe"
              >{{tag.name}}
              </el-tag>
              <span> </span>
            </p>
          </div>
        </template>
        <template v-if="singleItemform.title==='编辑指标'">
          <el-select v-if="singleItemform.title='编辑指标'" v-model="singleItemform.inspectIndexId" placeholder="请选择指标代码" style="width:100%" @change="selectInspectIndexChange" filterable clearable>
            <el-option v-for="(opt, optIndex) in inspectIndexOptions" :key="optIndex" :label="opt.indexName" :value="opt.id" />
          </el-select>
        </template>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="btnItemFloatClear">取 消</el-button>
        <el-button type="primary" @click="btnItemFloatConfirm(singleItemform.title)">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <!--指标分配弹窗-->
  <category-organization-tree v-model:dialogVisible="isDialogShow" ref="refCategoryOrganizationTree" :title="'指标分配'"  :dialogData="dialogMainDataImport" :importData="multiSelected" @actConfirm="actConfirm" @actReset="actReset"  />
</template>

<script lang="ts">
//  ComponentInternalInstance, getCurrentInstance
import { defineComponent, ref, reactive, onMounted, toRefs, ComponentInternalInstance, getCurrentInstance } from 'vue'
import MdsCard from '@/components/package/mds-card/src/mds-card.vue'
import CategoryOrganizationTree from './CategoryOrganizationTree.vue'
import {
  INSPECT_INDEX_STANDARD_QUERY_API,
  INSPECT_INDEX_STANDARD_BATCH_DELETE_API,
  INSPECT_INDEX_MATERIAL_ASSIST_TYPE_DROPDOWN_API,
  INSPECT_INDEX_MATERIAL_ITEM_UPDATE_API,
  INSPECT_INDEX_MATERIAL_ITEM_ADD_API,
  INSPECT_INDEX_MATERIAL_BY_CATEGORY_QUERY_API,
  INSPECT_INDEX_DROPDOWN_API,
  DICTIONARY_QUERY_API
} from '@/api/api'

interface ItemFormate{
    title: string
    inspectIndexId: string
    inspectIndexName: string
    inspectMaterialId: string
    relationType: string
    id: string
}

interface InspectMaterialOptions {
  assistFlag: string
  id: string
  inspectMaterialCode: string
  inspectMaterialTypeName: string
}

interface InspectIndexOptions {
  id: string
  indexCode: string
  indexMethod: string
  indexName: string
  indexType: string
  indexTypeName: string
  indexUnit: string
  inspectProperty: string
  inspectPropertyName: string
  inspectScene: string
  inspectSceneName: string
}

interface TopicMainData{
  assistFlag: string;
  id: string;
  indexCode: string;
  indexMethod: string;
  indexName: string;
  indexType: string;
  indexTypeName: string;
  indexUnit: string;
  inspectIndexId: string;
  inspectMaterialId: string;
  inspectMaterialTypeName: string;
  relationType: string;
}

interface ControlForm{
  filterText: string;
}

interface SelectedItem{
  id: string
  name: string
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

interface DictionaryReturnOptions {
    dictCode: string;
    dictId: string;
    dictOrder: string;
    dictValue: string;
    factoryName: string;
    id: string;
}
interface Options {
    [propName: string]: any;
}

interface TransferAreaData{
  key: string
  label: string
}

interface State {
  isDialogShow: boolean
  isDialogVisibleForItemControl: boolean
  topicMainData: TopicMainData[]
  controlForm: ControlForm
  currentPage: number
  pageSize: number
  totalItems: number

  dialogMainDataImport: DialogMainDataImport[]
  selectedListOfTopicMainData: TopicMainData[]
  singleItemform: ItemFormate
  inspectMaterialOptions: InspectMaterialOptions[]
  inspectPropertyObject: Options
  inspectIndexOptions: InspectIndexOptions[]
  multiSelected:SelectedItem[]
  tempMultiSelected:SelectedItem[]
}

export default defineComponent({
  name: 'TestIndexLibIndex',
  components: {
    MdsCard,
    CategoryOrganizationTree
  },

  props: {
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const refCategoryOrganizationTree = ref()
    const refIndexAsing = ref()
    const state = reactive<State>({
      isDialogShow: false,
      isDialogVisibleForItemControl: false,
      topicMainData: [],
      controlForm: {
        filterText: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      dialogMainDataImport: [],
      selectedListOfTopicMainData: [],
      singleItemform: {
        title: '',
        inspectIndexId: '',
        inspectIndexName: '',
        inspectMaterialId: '',
        relationType: '',
        id: ''
      },
      inspectMaterialOptions: [],
      inspectPropertyObject: {},
      inspectIndexOptions: [],
      multiSelected: [],
      tempMultiSelected: []
    })

    // 函数

    // [ACTION:load][BTN:查询] 获取检验指标库数据
    const btnGetMainData = async () => {
      const res = await INSPECT_INDEX_STANDARD_QUERY_API({
        inspectMaterialTypeName: state.controlForm.filterText,
        current: state.currentPage,
        size: state.pageSize
      })
      console.log('获取检验指标数据')
      console.log(res.data.data)
      state.topicMainData = res.data.data.records
      state.totalItems = res.data.data.total
      state.currentPage = res.data.data.current
      state.pageSize = res.data.data.size
    }

    // [BTN:新增] 新增 item
    const btnAddItemData = async () => {
      state.isDialogVisibleForItemControl = true
      apiGetInspectMaterialOptions()
      // 检验类别\物料清空
      state.singleItemform = {
        title: '新增指标',
        inspectIndexName: '',
        inspectIndexId: '',
        inspectMaterialId: '',
        relationType: '',
        id: ''
      }
      // 指标代码清空
      state.tempMultiSelected = []
    }

    // [BTN:编辑] 编辑 item
    const btnEditItemData = async (val:TopicMainData) => {
      console.log('item info')
      console.log(val)
      state.isDialogVisibleForItemControl = true
      apiGetInspectMaterialOptions()
      state.singleItemform = {
        title: '编辑指标',
        inspectIndexName: val.indexCode,
        inspectIndexId: val.inspectIndexId,
        inspectMaterialId: val.inspectMaterialId,
        relationType: val.relationType,
        id: val.id
      }
    }

    // [BTN:版本管理]
    const btnVersionController = async () => {
      // if (ctx.state.common.mainTabs.find(tabItem => tabItem.name === 'qms-pages-BasicData-TestIndexVersion-index')) {
      //   this.$store.commit('common/updateMsgTabAlive', true)
      // } else {
      //   setTimeout(() => {
      //     this.$router.push({
      //       name: 'qms-pages-BasicData-TestIndexVersion-index'
      //     })
      //   }, 500)
      // }
    }

    // [table] 选框选择
    const actHandleSelectionChange = (val: TopicMainData[]) => {
      state.selectedListOfTopicMainData = val
    }

    // [BTN:批次删除]
    const btnBatchDelete = () => {
      if (state.selectedListOfTopicMainData.length === 0) {
        return
      }
      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const tempDeleteList: string[] = []
        state.selectedListOfTopicMainData.forEach(item => {
          tempDeleteList.push(item.id)
        })
        const res = await INSPECT_INDEX_STANDARD_BATCH_DELETE_API(tempDeleteList)
        if (res.data.code === 200) {
          state.currentPage = 1
          state.pageSize = 10
          state.totalItems = 0
          proxy.$successToast('操作成功')
          await btnGetMainData()
        }
      })
    }

    // 触发指标选择弹窗
    const actAddIndexId = async () => {
      const res = await INSPECT_INDEX_MATERIAL_BY_CATEGORY_QUERY_API()
      // 为 inspectPropertyName 附值 （后端无法返回）
      res.data.data.forEach((item:DialogMainDataImport) => {
        item.inspectPropertyName = state.inspectPropertyObject[item.inspectProperty]
      })
      // 指标弹窗架构
      state.dialogMainDataImport = JSON.parse(JSON.stringify(res.data.data))

      state.multiSelected = JSON.parse(JSON.stringify(state.tempMultiSelected))
      console.log('指标弹窗架构:state.dialogMainDataImport')
      console.log(state.dialogMainDataImport)
      state.isDialogShow = true
    }

    // 编辑/新增 操作确认
    const btnItemFloatConfirm = async (val:string) => {
      if (val === '新增指标') { // 新增指标
        if (state.singleItemform.inspectMaterialId === '') {
          proxy.$errorToast('检验类别\\物料字段未填写')
          return
        }

        if (state.tempMultiSelected.length === 0) {
          proxy.$errorToast('指标代码字段未填写')
          return
        }

        const tempItemform:ItemFormate[] = []
        state.tempMultiSelected.forEach((item: SelectedItem) => {
          tempItemform.push({
            title: state.singleItemform.title,
            id: '',
            inspectIndexId: item.id,
            inspectMaterialId: state.singleItemform.inspectMaterialId,
            inspectIndexName: item.name,
            relationType: state.singleItemform.relationType
          })
        })
        await INSPECT_INDEX_MATERIAL_ITEM_ADD_API(tempItemform)
        proxy.$successToast('操作成功')
        btnGetMainData() // reload
      } else { // 编辑指标
        if (state.singleItemform.inspectMaterialId === '') {
          proxy.$errorToast('检验类别\\物料字段未填写')
          return
        }
        if (state.singleItemform.inspectIndexId === '') {
          proxy.$errorToast('指标代码字段未填写')
          return
        }
        await INSPECT_INDEX_MATERIAL_ITEM_UPDATE_API(state.singleItemform)
        proxy.$successToast('操作成功')
        btnGetMainData() // reload
      }
      state.isDialogVisibleForItemControl = false
    }

    const btnItemFloatClear = () => {
      state.singleItemform = {
        title: '',
        inspectIndexId: '',
        inspectIndexName: '',
        inspectMaterialId: '',
        relationType: '',
        id: ''
      }
      state.isDialogVisibleForItemControl = false
    }

    // 检验类别\物料下拉选单
    const apiGetInspectMaterialOptions = async () => {
      const res = await INSPECT_INDEX_MATERIAL_ASSIST_TYPE_DROPDOWN_API()
      console.log('检验类及物料下拉数据')
      console.log(res.data.data)
      state.inspectMaterialOptions = res.data.data
    }

    // [弹窗:指标分配]确认
    const actConfirm = async (data:TransferAreaData[]) => {
      console.log('已选 selectedItems')
      console.log(data)
      state.multiSelected = []
      state.tempMultiSelected = JSON.parse(JSON.stringify(data))
    }

    // [弹窗:指标分配]取消关闭弹窗后的 reset
    const actReset = () => {
      //
    }

    const selectInspectMaterialChange = (val:string) => {
      console.log('val')
      console.log(val)
      state.inspectMaterialOptions.forEach((item:InspectMaterialOptions) => {
        if (item.inspectMaterialCode === val) {
          if (item.assistFlag === 'Y') {
            state.singleItemform.relationType = 'TYPE'
          } else {
            state.singleItemform.relationType = 'MATERIAL'
          }
        }
      })
      console.log(state.singleItemform)
    }

    const selectInspectIndexChange = (val:string) => {
      console.log('val')
      console.log(val)
      state.inspectIndexOptions.forEach((item:InspectIndexOptions) => {
        if (item.id === val) {
          state.singleItemform.inspectIndexName = item.indexName
        }
      })
    }

    onMounted(async () => {
      // 数据字典查找
      const resPropertyObject = await DICTIONARY_QUERY_API({ dictType: 'INSPECT_PROPERTY' })
      state.inspectPropertyObject = {}
      resPropertyObject.data.data.forEach((item:DictionaryReturnOptions) => {
        state.inspectPropertyObject[item.dictCode] = item.dictValue
      })

      const resIndexOptions = await INSPECT_INDEX_DROPDOWN_API()
      console.log('resIndexOptions')
      console.log(resIndexOptions.data.data)
      state.inspectIndexOptions = resIndexOptions.data.data
      btnGetMainData()
    })

    return {
      ...toRefs(state),
      refCategoryOrganizationTree,
      refIndexAsing,
      btnGetMainData,
      btnBatchDelete,
      btnAddItemData,
      btnEditItemData,
      btnItemFloatConfirm,
      btnItemFloatClear,
      btnVersionController,
      actReset,
      actConfirm,
      actHandleSelectionChange,
      actAddIndexId,
      apiGetInspectMaterialOptions,
      selectInspectMaterialChange,
      selectInspectIndexChange
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  height: calc(100vh - 117px);
}
.topforms {
  display: flex;
  .el-date-editor.el-input {
    width: auto;
  }
  .formtextarea {
    .el-form-item__content {
      width: 500px;
    }
  }
}
.item-imput{
    -webkit-appearance: none;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: var(--el-text-color-regular);
    display: inline-block;
    font-size: inherit;
    outline: 0;
    padding: 2px 10px;
    -webkit-transition: var(--el-border-transition-base);
    transition: var(--el-border-transition-base);
    width: 100%;
    cursor: pointer;
    p {
      line-height: 40px;
      box-sizing: content-box !important;
      span{
        margin-right: 5px;
      }
    }
}
</style>
