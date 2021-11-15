<template>
  <mds-card class="test_method" title="检验指标库" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="float: right;display: flex;">

        <el-input
            size="small"
            style="margin-bottom:10px; width:300px; height:35px;margin-right:10px"
            v-model="controlForm.filterText"
            placeholder="指标类描述/代码、指标名称/代码"
            clearable
            @keyup.enter="getMainData('init')" />
        <div style="float: right;">
          <el-button icon="el-icon-search" size="small" class="topic-button" @click="getMainData('init')">查询</el-button>
        </div>
      </div>
    </template>
    <el-table border ref="multipleTable" :cell-style="{'text-align':'center'}" :data="topicMainData" tooltip-effect="dark" style="width: 100%" max-height="400" >
      <el-table-column type="index" label="序号" :index="(index) => index + 1 + (currentPage - 1) * pageSize" width="55" />
      <!-- <el-table-column label="指标类"  width="80" prop="indexType" show-overflow-tooltip /> -->
      <el-table-column label="指标类描述" min-width="220" prop="indexTypeName" show-overflow-tooltip />
      <el-table-column label="指标代码" width="100" prop="indexCode" show-overflow-tooltip />
      <el-table-column label="指标名称" width="180" prop="indexName" show-overflow-tooltip />
      <el-table-column label="单位" width="100" prop="indexUnit" show-overflow-tooltip />
      <el-table-column label="方法" width="160" prop="indexMethod" show-overflow-tooltip />
      <el-table-column label="属性" width="160" prop="inspectPropertyName" show-overflow-tooltip />
      <el-table-column label="应用场景" width="160" prop="inspectSceneName" show-overflow-tooltip />
      <el-table-column label="同步时间" width="200" prop="syncDate" show-overflow-tooltip />
      <el-table-column label="操作" width="80" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="btnEditItem(scope.row)">
            <em>编辑</em>
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </mds-card>
  <test-index-item-edit v-model:dialogVisible="isDialogShow" ref="refFunctionDialog" :title="'指标明细'"  :dialogData="dialogMainDataImport" @actConfirm="actConfirm" @actReset="actReset"  />
</template>

<script lang="ts">
//  ComponentInternalInstance, getCurrentInstance
import { defineComponent, ref, reactive, onMounted, toRefs, ComponentInternalInstance, getCurrentInstance } from 'vue'
import MdsCard from '@/components/package/mds-card/src/mds-card.vue'
import TestIndexItemEdit from './TestIndexItemEdit.vue'
import {
  INSPECT_INDEX_LIBRARY_QUERY_API,
  INSPECT_INDEX_LIBRARY_ITEM_BY_ID_QUERY_API,
  INSPECT_INDEX_LIBRARY_ITEM_UPDATE_API
} from '@/api/api'

interface TopicMainData{
  id: string;
  indexCode: string;
  indexMethod: string;
  indexName: string;
  indexType: string;
  indexTypeName: string;
  indexUnit: string;
  inspectProperty: string;
  inspectPropertyName: string;
  inspectScene: string;
  inspectSceneName: string;
  syncDate: string;
}

interface ControlForm{
  filterText: string;
}

interface DialogMainDataReturn{
  id?: string;
  indexCode?: string;
  indexMethod?: string;
  indexName?: string;
  indexType?: string;
  indexTypeName?: string;
  indexUnit?: string;
  inspectProperty?: string;
  inspectPropertyName?: string;
  inspectScene?: string;
  inspectSceneName?: string;
  syncDate?: string;
}

interface DialogMainDataImport{
  id?: string;
  indexCode?: string;
  indexMethod?: string;
  indexName?: string;
  indexType?: string;
  indexTypeName?: string;
  indexUnit?: string;
  inspectProperty?: string;
  inspectPropertyName?: string;
  inspectScene?: string;
  inspectSceneName?: string;
  syncDate?: string;
}

interface State {
  isDialogShow: boolean
  topicMainData: TopicMainData[]
  controlForm: ControlForm
  currentPage: number
  pageSize: number
  totalItems: number
  dialogMainDataReturn: DialogMainDataReturn
  dialogMainDataImport: DialogMainDataImport
}

export default defineComponent({
  name: 'TestIndexLibraryIndex',
  components: {
    MdsCard,
    TestIndexItemEdit
  },

  props: {
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const refFunctionDialog = ref()
    const state = reactive<State>({
      isDialogShow: false,
      topicMainData: [],
      controlForm: {
        filterText: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      dialogMainDataReturn: {},
      dialogMainDataImport: {}

    })

    // 函数
    // [ACTION:load][BTN:查询] 获取检验指标库数据
    const getMainData = async (type = '') => {
      if (type === 'init') {
        state.currentPage = 1
        state.pageSize = 10
      }
      const res = await INSPECT_INDEX_LIBRARY_QUERY_API({
        indexCodeOrName: state.controlForm.filterText,
        current: state.currentPage,
        size: state.pageSize
      })

      state.topicMainData = res.data.data.records
      state.totalItems = res.data.data.total
      state.currentPage = res.data.data.current
      state.pageSize = res.data.data.size
    }

    // [BTN:编辑] 编辑数据集 item
    const btnEditItem = async (row: TopicMainData) => {
      // state.isDialogShow = true
      const res = await INSPECT_INDEX_LIBRARY_ITEM_BY_ID_QUERY_API({
        id: row.id
      })
      state.dialogMainDataImport = res.data.data
      state.isDialogShow = true
    }

    const actReset = () => {
      //
    }

    const actConfirm = async (data:DialogMainDataReturn) => {
      await INSPECT_INDEX_LIBRARY_ITEM_UPDATE_API({
        id: data.id,
        indexCode: data.indexCode,
        indexMethod: data.indexMethod,
        indexName: data.indexName,
        indexUnit: data.indexUnit,
        inspectProperty: data.inspectProperty,
        inspectScene: data.inspectScene
      })
      proxy.$successToast('操作成功')
      getMainData()
    }

    const handleSizeChange = (pageSize: number) => { // 每页条数切换
      state.currentPage = 1
      state.pageSize = pageSize
      getMainData()
    }
    const handleCurrentChange = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      getMainData()
    }

    onMounted(() => {
      getMainData()
    })

    return {
      ...toRefs(state),
      refFunctionDialog,
      btnEditItem,
      getMainData,
      actReset,
      actConfirm,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  min-height: 550px;
  height: calc(100vh - 60px);
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
</style>
