<template>
  <mds-card class="test_method" title="检验指标库" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="float: right;display: flex;">
        <el-form ref="pstngDate" :model="controlForm" size="small" :inline="true" label-position="right" label-width="82px" class="topforms" style=" float: left;">
          <el-form-item label="" prop="pstngDate">
            <el-input suffix-icon="el-icon-search" v-model="controlForm.filterText" placeholder="名称" clearable style="width: 160px;" />
          </el-form-item>
        </el-form>
        <div style="float: right;">
          <el-button icon="el-icon-search" size="small" @click="getMainData">查询</el-button>
        </div>
      </div>
    </template>
    <el-table ref="multipleTable" :cell-style="{'text-align':'center'}" :data="topicMainData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" :index="(index) => index + 1 + (currentPage - 1) * pageSize" width="50" />
      <el-table-column label="指标类" prop="indexType" />
      <el-table-column label="指标类描述" prop="indexTypeName" />
      <el-table-column label="指标代码" prop="indexCode" />
      <el-table-column label="指标名称" prop="indexName" />
      <el-table-column label="单位" prop="indexUnit" />
      <el-table-column label="方法" prop="indexMethod" />
      <el-table-column label="属性" prop="inspectProperty" />
      <el-table-column label="应用场景" prop="inspectScene" />
      <el-table-column label="同步时间" prop="syncDate" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="btnEditItem(scope.row)">
            编辑
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
  name: 'TestIndexLibIndex',
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

    // [ACTION:load] 获取检验指标库数据
    const getMainData = async () => {
      const res = await INSPECT_INDEX_LIBRARY_QUERY_API({
        indexCodeOrName: state.controlForm.filterText,
        current: 1,
        size: 10
      })
      console.log('获取检验指标库数据')
      console.log(res.data.data)
      state.topicMainData = res.data.data.records
      state.totalItems = res.data.data.total
      state.currentPage = res.data.data.current
      state.pageSize = res.data.data.size
    }

    // [BTN:编辑] 编辑数据集 item
    const btnEditItem = async (row: TopicMainData) => {
      console.log(row)
      // state.isDialogShow = true
      const res = await INSPECT_INDEX_LIBRARY_ITEM_BY_ID_QUERY_API({
        id: row.id
      })
      console.log(res.data.data)
      state.dialogMainDataImport = res.data.data
      state.isDialogShow = true
    }

    const actReset = () => {
      // if (state.whoAsign === 'single') {
      //   state.globleItem = {
      //     inspectGroupCode: '',
      //     inspectGroupName: '',
      //     inspectMaterialType: '',
      //     inspectMaterialCode: '',
      //     inspectMaterialName: ''
      //   }
      // } else if (state.whoAsign === 'multi') {
      //   state.globleItemGroup = []
      // }
    }

    const actConfirm = async (data:DialogMainDataReturn) => {
      console.log('444444')
      console.log(data)
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
      // console.log(res.data.data)

      // let dataTemp:TableData[] = []
      // if (state.whoAsign === 'single') {
      //   dataTemp.push(state.globleItem)
      // } else if (state.whoAsign === 'multi') {
      //   dataTemp = state.globleItemGroup
      // }

      // INSPECT_MATERIAL_DISTRIBUTION_INSPECT_MATERIAL_API({
      //   inspectMaterialDetails: dataTemp,
      //   inspectTypeIdList: val // 检验类id数组
      // }).then(() => {
      //   proxy.$successToast('分配成功')
      //   // reload page
      //   if (state.whoAsign === 'single') {
      //     apiMaterialDetail(state.currentMaterialString, state.currentMaterialGroupString, state.globleSearchString)
      //   } else if (state.whoAsign === 'multi') {
      //     getMaterialCatagoryData()
      //   }
      // })
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
      actConfirm
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
</style>
