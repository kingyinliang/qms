<template>
  <mds-card class="test_method" title="过程参数" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="display: flex; justify-content: flex-end;">
        <el-input size="small" style="margin-bottom:10px; width:200px; height:35px;margin-right:10px" clearable  v-model="plantList.textSearch" placeholder="参数名称" @keyup.enter="btnGetTopicMainData" />
        <div>
          <el-button icon="el-icon-search" size="small" class="topic-button" @click="btnGetTopicMainData">查询</el-button>
          <el-button icon="el-icon-plus" type="primary" class="topic-button" size="small" @click="btnAddItemOfTopicMainData">新增</el-button>
          <el-button icon="el-icon-delete" type="danger" class="topic-button" size="small" @click="btnDeleteItemsOfTopicMainData">批量删除</el-button>
        </div>
      </div>
    </template>
    <el-table border ref="multipleTable" :cell-style="{'text-align':'center'}" :data="dataTopicMainData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" max-height="400">
      <el-table-column type="selection" width="45" />
      <el-table-column type="index" label="序号" :index="(index) => index + 1 + (currentPage - 1) * pageSize" width="50" />
      <el-table-column label="参数名称" show-overflow-tooltip prop="paramSubscriptCode" />
      <el-table-column label="下标" show-overflow-tooltip prop="paramSubscript" />
      <el-table-column label="过程参数" show-overflow-tooltip >
        <template #default="scope">
          <span>{{scope.row.paramCode.split('[')[0]}}<sub v-if="scope.row.paramCode.paramSubscript!==''">{{scope.row.paramCode.split('[')[1].replace(']','')}}</sub></span>
        </template>
      </el-table-column>
      <el-table-column label="参数类型" show-overflow-tooltip prop="paramType">
        <template #default="scope">
          {{paramTypeObj[scope.row.paramType]}}
        </template>
      </el-table-column>
      <el-table-column label="数据类型" show-overflow-tooltip prop="paramDataType" >
        <template #default="scope">
          {{paramDataTypeObj[scope.row.paramDataType]}}
        </template>
      </el-table-column>
      <el-table-column label="数据标准" show-overflow-tooltip prop="paramStandard" />
      <el-table-column label="操作" width="80" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="btnEditItemOfTopicMainData(scope.row)">
            <em>编辑</em>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end;">
      <el-pagination
        :page-size="pageSize"
        :current-page="currentPage"
        :total="totalItems"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </mds-card>

  <el-dialog v-model="isAddItemDialogShow" :title="dialogTitle" width="30%">
      <el-form ref="refAddAndEditItemDialog" :model="addAndEditItemForm" :rules="dataRule">
        <!-- <el-form-item label="编码：" prop="paramSubscript" :label-width="cssForformLabelWidth">
          <el-input v-model="addAndEditItemForm.paramSubscript" maxlength="5" class="inputWidth" placeholder="请输入" autocomplete="off" @change="addAndEditItemForm.paramCode=addAndEditItemForm.paramSubscriptCode+'['+addAndEditItemForm.paramSubscript+']'"></el-input>
        </el-form-item> -->
        <el-form-item label="参数名称："  prop="paramSubscriptCode" :label-width="cssForformLabelWidth">
          <el-input v-model="addAndEditItemForm.paramSubscriptCode" maxlength="10" class="inputWidth" placeholder="请输入" autocomplete="off" @change="addAndEditItemForm.paramCode=addAndEditItemForm.paramSubscriptCode+'['+addAndEditItemForm.paramSubscript+']'"></el-input>
        </el-form-item>
        <el-form-item label="下标：" prop="paramSubscript" :label-width="cssForformLabelWidth">
          <el-input v-model="addAndEditItemForm.paramSubscript" maxlength="5" class="inputWidth" placeholder="请输入" autocomplete="off" @change="addAndEditItemForm.paramCode=addAndEditItemForm.paramSubscriptCode+'['+addAndEditItemForm.paramSubscript+']'"></el-input>
        </el-form-item>
        <el-form-item label="过程参数：" prop="paramCode"  :label-width="cssForformLabelWidth">
           <div class="fake-input-disabled">
            <span>{{addAndEditItemForm.paramCode===''?'':addAndEditItemForm.paramCode.split('[')[0]}}<sub>{{addAndEditItemForm.paramCode===''?'':addAndEditItemForm.paramCode.split('[')[1].replace(']','')}}</sub></span>
          </div>
        </el-form-item>
        <el-form-item label="参数类型：" prop="paramType"  :label-width="cssForformLabelWidth">
          <el-select  v-model="addAndEditItemForm.paramType" placeholder="请选择" style="width:100%" clearable>
            <el-option  v-for="item in paramTypeOptions"
              :key="item.dictCode"
              :label="item.dictValue"
              :value="item.dictCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型：" prop="paramDataType"  :label-width="cssForformLabelWidth">
          <el-select  v-model="addAndEditItemForm.paramDataType" placeholder="请选择" style="width:100%"  clearable @change="changeParamDataTypeOptions">
            <el-option
                v-for="item in paramDataTypeOptions"
                :key="item.dictCode"
                :label="item.dictValue"
                :value="item.dictCode">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据标准：" prop="paramStandard"  :label-width="cssForformLabelWidth">
          <div style="display:flex">

          <el-input v-model="addAndEditItemForm.paramStandard" maxlength="2" placeholder="请输入" style="margin-right:10px;" autocomplete="off" oninput="value=value.replace(/[^\d]/g,'')" @change="addAndEditItemForm.paramCode=addAndEditItemForm.paramSubscriptCode+'['+addAndEditItemForm.paramSubscript+']'"></el-input>

          <el-select  v-model="addAndEditItemForm.paramStandardType" placeholder="请选择"  clearable>
            <el-option v-for="(item) in paramStandardTypeOptions" :key="item.dictCode"
                :label="item.dictValue"
                :value="item.dictCode"
                :disabled="item.disabled" />
          </el-select>
          </div>

        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button size="small" class="topic-button" icon="el-icon-circle-close" @click="isAddItemDialogShow = false">取 消</el-button>
        <el-button size="small" class="topic-button" icon="el-icon-circle-check" type="primary" @click="btnAddItemToConfirm">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent, ref, toRefs, reactive, onMounted, ComponentInternalInstance, getCurrentInstance, nextTick
} from 'vue'
import MdsCard from '@/components/package/mds-card/src/mds-card.vue'
import {
  INSPECT_PROCESS_PARAMETER_QUERY_API, // 查询
  INSPECT_PROCESS_PARAMETER_INSERT_API, // 新增
  INSPECT_PROCESS_PARAMETER_DELETE_API, // 删除
  INSPECT_PROCESS_PARAMETER_UPDATE_API, // 编辑
  DICTIONARY_QUERY_API
} from '@/api/api'

interface TopicMainData {
  id: string
  paramCode: string
  paramName: string
  paramSubscript: string
  paramSubscriptCode: string
  paramDataType: string
  paramStandard: number | null
  paramStandardType: string
  paramType: string
}

interface PlantList{
  textSearch: string
}

// interface Props {}

interface DictionaryReturnOptions {
    dictCode: string
    dictId: string
    dictOrder: string
    dictValue: string
    factoryName: string
    id: string
    disabled?: boolean
}

interface State {
  dialogTitle: string
  isAddItemDialogShow: boolean
  currentPage: number
  pageSize: number
  totalItems: number
  dataTopicMainData: TopicMainData[]
  plantList: PlantList
  cssForformLabelWidth: string
  addAndEditItemForm: TopicMainData
  multipleSelection: string[]
  paramStandardTypeOptions: DictionaryReturnOptions[]
  paramDataTypeOptions: DictionaryReturnOptions[]
  paramTypeOptions: DictionaryReturnOptions[]
  paramDataTypeObj:any
  paramTypeObj:any
}

export default defineComponent({
  name: 'ProcessParameterIndex',
  components: {
    MdsCard
  },

  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any

    /**  == 变量 ==  **/
    // const { } = toRefs(props as Props)
    const state = reactive<State>({
      dialogTitle: '',
      isAddItemDialogShow: false,
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      dataTopicMainData: [],
      plantList: {
        textSearch: ''
      },
      cssForformLabelWidth: '100px',
      addAndEditItemForm: {
        id: '',
        paramCode: '',
        paramName: '',
        paramSubscript: '',
        paramSubscriptCode: '',
        paramDataType: '',
        paramStandard: null,
        paramStandardType: '',
        paramType: ''
      },
      multipleSelection: [],
      paramStandardTypeOptions: [],
      paramDataTypeOptions: [],
      paramTypeOptions: [],
      paramDataTypeObj: {},
      paramTypeObj: {}
    })
    const refAddAndEditItemDialog = ref()
    const dataRule = {
      paramSubscriptCode: [
        {
          required: true,
          message: '请输入参数名称',
          trigger: 'blur'
        }
      ],
      paramType: [
        {
          required: true,
          message: '请选择参数类型',
          trigger: 'blur'
        }
      ]
    }
    const props = { multiple: true }

    /**  == 函数 ==  **/
    // 过程参数列表数据
    const btnGetTopicMainData = async () => {
      await initVariable()
      const res = await INSPECT_PROCESS_PARAMETER_QUERY_API({
        current: state.currentPage,
        paramCodeOrName: state.plantList.textSearch,
        size: state.pageSize
      })
      state.dataTopicMainData = res.data.data.records
      state.totalItems = res.data.data.total
    }
    // [BTN:编辑] 编辑 item
    const btnEditItemOfTopicMainData = async (row: TopicMainData) => {
      state.dialogTitle = '过程参数-编辑'
      state.isAddItemDialogShow = true
      await nextTick()
      refAddAndEditItemDialog.value.resetFields()
      state.addAndEditItemForm = { ...row }
    }
    // [Table] 复选选择
    const handleSelectionChange = (val: TopicMainData[]) => {
      state.multipleSelection = val.map((item: TopicMainData) => item.id)
    }
    // [BTN:批量删除]
    const btnDeleteItemsOfTopicMainData = () => {
      if (!state.multipleSelection.length) {
        proxy.$warningToast('请选择数据')
        return
      }
      proxy.$confirm('是否删除此过程参数，请确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await INSPECT_PROCESS_PARAMETER_DELETE_API(state.multipleSelection)
        proxy.$successToast('操作成功')
        await btnGetTopicMainData()
      })
    }
    // [BTN:新增] 新增
    const btnAddItemOfTopicMainData = async () => {
      state.dialogTitle = '过程参数-新增'
      state.isAddItemDialogShow = true
      await nextTick()
      refAddAndEditItemDialog.value.resetFields()
      await initVariable()

      // let code = state.dataTopicMainData.reduce((previousValue: number, currentValue: TopicMainData) => {
      //   const currentCode = Number(currentValue.inspectMethodCode.replace(/M/g, ''))
      //   return previousValue < currentCode ? currentCode : previousValue
      // }, 0)
      // code++
      state.addAndEditItemForm = {
        id: '',
        paramCode: '',
        paramName: '',
        paramSubscript: '',
        paramSubscriptCode: '',
        paramDataType: '',
        paramStandard: null,
        paramStandardType: '',
        paramType: ''
      }
    }
    // [弹窗][BTN:确定]
    const btnAddItemToConfirm = () => {
      if (!state.addAndEditItemForm.paramSubscriptCode) {
        proxy.$warningToast('请输入参数名称')
        return false
      }

      if (!state.addAndEditItemForm.paramType) {
        proxy.$warningToast('请选择参数类型')
        return false
      }

      if (state.addAndEditItemForm.paramDataType === 'FLOAT_POINT' && (!state.addAndEditItemForm.paramStandard || !state.addAndEditItemForm.paramStandardType)) {
        proxy.$warningToast('请输入数据标准')
        return false
      }

      refAddAndEditItemDialog.value.validate(async (valid: boolean) => {
        if (valid) {
          if (state.addAndEditItemForm.id) {
            await INSPECT_PROCESS_PARAMETER_UPDATE_API(state.addAndEditItemForm)
          } else {
            await INSPECT_PROCESS_PARAMETER_INSERT_API(state.addAndEditItemForm)
          }
          proxy.$successToast('操作成功')
          state.isAddItemDialogShow = false
          await btnGetTopicMainData()
        }
      })
    }

    const handleSizeChange = (pageSize: number) => { // 每页条数切换
      state.currentPage = 1
      state.pageSize = pageSize
      btnGetTopicMainData()
    }
    const handleCurrentChange = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      btnGetTopicMainData()
    }

    const initVariable = async () => {
      // 数据类型
      await DICTIONARY_QUERY_API({ dictType: 'PROC_PARAM_DATA_TYPE' }).then((res) => {
        state.paramDataTypeOptions = res.data.data
        state.paramDataTypeOptions.forEach(item => {
          state.paramDataTypeObj[item.dictCode] = item.dictValue
        })
      })

      // 数据标准单位
      await DICTIONARY_QUERY_API({ dictType: 'PROC_PARAM_STANDARD' }).then((res) => {
        state.paramStandardTypeOptions = res.data.data
      })

      // 过程参数类型
      await DICTIONARY_QUERY_API({ dictType: 'PROC_PARAM_TYPE' }).then((res) => {
        state.paramTypeOptions = res.data.data
        state.paramTypeOptions.forEach(item => {
          state.paramTypeObj[item.dictCode] = item.dictValue
        })
      })
    }

    // [SELECT:参数类型][Event:change]
    const changeParamDataTypeOptions = (val:string) => {
      state.addAndEditItemForm.paramStandardType = ''
      if (val === 'FLOAT_POINT') {
        state.paramStandardTypeOptions.forEach((item:any) => {
          if (item.dictCode !== 'DIGIT') {
            item.disabled = false
          } else {
            item.disabled = true
          }
        })
      } else if (val === 'INTEGER') {
        state.paramStandardTypeOptions.forEach((item:any) => {
          if (item.dictCode === 'DIGIT') {
            item.disabled = false
          } else {
            item.disabled = true
          }
        })
      }
    }

    /**  == 生命周期 ==  **/
    onMounted(async () => {
      btnGetTopicMainData()
    })

    return {
      ...toRefs(state),
      refAddAndEditItemDialog,
      btnEditItemOfTopicMainData,
      btnAddItemOfTopicMainData,
      btnAddItemToConfirm,
      btnDeleteItemsOfTopicMainData,
      btnGetTopicMainData,
      handleSelectionChange,
      dataRule,
      props,
      handleSizeChange,
      handleCurrentChange,
      initVariable,
      changeParamDataTypeOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  min-height: 550px;
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.el-form::v-deep(.inputWidth) {
  width: 100%;
}

</style>
