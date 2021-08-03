<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-30 11:24:46
 * @LastEditors: Telliex
 * @LastEditTime: 2021-08-04 14:28:54
-->
<template>
  <mds-card class="test_method" title="版本明细" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="float: right;display: flex;">
        <el-form ref="pstngDate" :model="controlForm" size="small" :inline="true" label-position="right" label-width="82px" class="topforms" style=" float: left;">
          <el-form-item label="" prop="pstngDate">
            <el-input suffix-icon="el-icon-search" v-model="controlForm.filterText" placeholder="版本号" clearable  style="width: 160px;" />
          </el-form-item>
        </el-form>
        <div style="float: right;">
          <el-button icon="el-icon-search" type="primary" size="small" @click="btnGetMainData">查询</el-button>
          <el-button icon="el-icon-circle-plus-outline" type="primary" size="small" @click="btnAddItemData">新增</el-button>
          <el-button icon="el-icon-delete" type="primary" size="small" @click="actBatchDelete">批次删除</el-button>
        </div>
      </div>
    </template>
    <el-table ref="multipleTable"  :cell-style="{'text-align':'center'}" :data="topicMainData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @row-dblclick="handleDbclick">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" :index="(index) => index + 1 + (currentPage - 1) * pageSize" width="50" />
      <el-table-column label="检验类别\物料" min-width="200" prop="inspectMaterialTypeName" show-overflow-tooltip />
      <el-table-column label="指标代码" width="160" prop="indexCode" show-overflow-tooltip />
      <el-table-column label="指标名称" width="160" prop="indexName" show-overflow-tooltip />
      <el-table-column label="单位" width="100" prop="indexUnit" show-overflow-tooltip />
      <el-table-column label="方法" width="200" prop="indexMethod" show-overflow-tooltip />
      <el-table-column label="版本" width="160" prop="indexVersion" show-overflow-tooltip />
      <el-table-column label="版本执行方法" width="160" prop="indexVersionMethod" show-overflow-tooltip>

        <template #default="scope">
        <el-button
          size="mini"
          type="text"
          @click="seeVersion(scope.$index, scope.row)">{{scope.row.indexVersionMethod}}</el-button>
         </template>
      </el-table-column>
      <el-table-column label="变更说明" width="160" prop="changeInfo" show-overflow-tooltip />
      <el-table-column label="执行开始日" width="200" prop="beginDate" show-overflow-tooltip />
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
  <el-dialog :title="'版本明细'" v-model="isDialogVisibleForItemControl" width="40%">
    <el-form ref="addRef" :model="addFormInfo" :rules="dataRule">
        <el-form-item label="版本：" prop="indexVersion" :label-width="'140px'">
          <el-input v-model="addFormInfo.indexVersion" class="140px" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本执行方法：" prop="indexVersionMethod" :label-width="'140px'">
          <el-input v-model="addFormInfo.indexVersionMethod" class="140px" placeholder="请选择" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="执行开始日：" prop="beginDate" :label-width="'140px'">
           <el-date-picker
            v-model="addFormInfo.beginDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="btnItemFloatClear">取 消</el-button>
        <el-button type="primary" @click="btnItemFloatConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <!--标准值明细-->
  <index-value-detail v-if="isDialogShow" ref="refIndexValueDetail" :target="versionId" />
</template>

<script lang="ts">
//  ComponentInternalInstance, getCurrentInstance
import { defineComponent, ref, reactive, onMounted, toRefs, ComponentInternalInstance, getCurrentInstance } from 'vue'
import MdsCard from '@/components/package/mds-card/src/mds-card.vue'
import IndexValueDetail from './TestIndexValueDetail.vue'
import {
  INSPECT_INDEX_VERSION_QUERY_API, // 基础数据-[指标版本管理]- 查询
  INSPECT_INDEX_VERSION_ADD_API, // 基础数据-[指标版本管理]- 新增
  INSPECT_INDEX_VERSION_DELETE_API // 基础数据-[指标版本管理]- 删除

} from '@/api/api'

interface AddFormInfo {
  beginDate: string
  indexVersion: string
  indexVersionMethod: string
}

interface TopicMainData{
  beginDate: string
  changeInfo: string
  currentFlag: string
  factory: string
  id: string
  indexCode: string
  indexMethod: string
  indexName: string
  indexUnit: string
  indexVersion: string
  indexVersionMethod: string
  inspectIndexMaterialId: string
  inspectMaterialTypeName: string
}
interface ControlForm{
  filterText: string;
}

interface State {
  isDialogShow: boolean
  isDialogVisibleForItemControl: boolean
  addFormInfo: AddFormInfo
  inspectIndexMaterialId: string
  topicMainData: TopicMainData[]
  controlForm: ControlForm
  currentPage: number
  pageSize: number
  totalItems: number
  selectedListOfTopicMainData: TopicMainData[]
  versionId: string
}

export default defineComponent({
  name: 'TestIndexVersionIndex',
  components: {
    MdsCard,
    IndexValueDetail
  },

  props: {
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const refIndexValueDetail = ref()
    const refIndexAsing = ref()

    const dataRule = ref({
      indexVersion: [
        {
          required: true,
          message: '请输入版本',
          trigger: 'blur'
        }
      ],
      beginDate: [
        {
          required: true,
          message: '执行开始日',
          trigger: 'blur'
        }
      ]
    })
    const state = reactive<State>({
      isDialogShow: false,
      isDialogVisibleForItemControl: false,
      inspectIndexMaterialId: '624547859339390976',
      addFormInfo: {
        beginDate: '',
        indexVersion: '',
        indexVersionMethod: ''
      },
      topicMainData: [],
      controlForm: {
        filterText: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      selectedListOfTopicMainData: [],
      versionId: ''
    })

    // 函数

    // [ACTION:load][BTN:查询] 获取指标版本管理数据
    const btnGetMainData = async () => {
      const res = await INSPECT_INDEX_VERSION_QUERY_API({
        inspectIndexMaterialId: state.inspectIndexMaterialId,
        indexVersion: state.controlForm.filterText,
        current: state.currentPage,
        size: state.pageSize
      })
      console.log('获取指标版本管理数据')
      console.log(res.data.data)
      state.topicMainData = res.data.data.records
      state.totalItems = res.data.data.total
      state.currentPage = res.data.data.current
      state.pageSize = res.data.data.size
      state.isDialogShow = false
    }

    // [BTN:新增] 新增 item
    const btnAddItemData = async () => {
      state.addFormInfo = {
        beginDate: '',
        indexVersion: '',
        indexVersionMethod: ''
      }
      state.isDialogVisibleForItemControl = true
    }

    // [table] 选框选择
    const handleSelectionChange = (val: TopicMainData[]) => {
      state.selectedListOfTopicMainData = val
      console.log(state.selectedListOfTopicMainData)
      // multipleSelection.value = val.map((item: TargetInfo) => item.id)
    }

    // [BTN:批次删除]
    const actBatchDelete = () => {
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
        console.log(tempDeleteList)

        const res = await INSPECT_INDEX_VERSION_DELETE_API(tempDeleteList)
        if (res.data.code === 200) {
          state.currentPage = 1
          state.pageSize = 10
          state.totalItems = 0
          proxy.$successToast('操作成功')
          await btnGetMainData()
        }
      })
    }

    // [BTN:确认][float]
    const btnItemFloatConfirm = async () => {
      console.log('state.addFormInfo')
      console.log(state.addFormInfo)
      await INSPECT_INDEX_VERSION_ADD_API({
        inspectIndexMaterialId: state.inspectIndexMaterialId,
        ...state.addFormInfo
      })
      proxy.$successToast('操作成功')
      btnGetMainData() // reload
      state.isDialogVisibleForItemControl = false
    }

    // [BTN:取消][float]
    const btnItemFloatClear = () => {
      state.addFormInfo = {
        beginDate: '',
        indexVersion: '',
        indexVersionMethod: ''
      }
      state.isDialogVisibleForItemControl = false
    }

    // [Table:Row][dbclick]
    const handleDbclick = (val:TopicMainData) => {
      console.log(val)
      state.versionId = val.id
      state.isDialogShow = true
    }

    const seeVersion = () => {
      //
    }

    onMounted(async () => {
      btnGetMainData()
    })

    return {
      ...toRefs(state),
      refIndexValueDetail,
      refIndexAsing,
      btnGetMainData,
      handleSelectionChange,
      actBatchDelete,
      btnAddItemData,
      btnItemFloatConfirm,
      btnItemFloatClear,
      dataRule,
      handleDbclick,
      seeVersion
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
