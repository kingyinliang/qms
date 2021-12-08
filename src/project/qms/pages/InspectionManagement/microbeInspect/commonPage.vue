<template>
  <mds-card class="test_method" title="检验列表" :pack-up="false" style="margin-bottom: 0; background: #fff; overflow:scroll">
    <template #titleBtn>
      <div style="float: right">
        <el-form :inline="true" size="small" style="float: right;display: flex" @keyup.enter="query()" @submit.prevent>
          <el-form-item>
            <el-radio-group v-model="queryForm.indexName" @change="query">
              <el-radio label="菌落总数">菌落总数</el-radio>
              <el-radio label="大肠菌群">大肠菌群</el-radio>
              <el-radio label="酵母菌">酵母菌</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="培养日期：" v-if="type === 'CALCULATE'">
            <el-date-picker
              v-model="queryForm.inspectDateBegin"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选选择日期"
              style="width: 140px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="样品码：">
            <el-input v-model="queryForm.sampleCode" placeholder="请输入" style="width: 120px" clearable></el-input>
          </el-form-item>
          <el-button v-if="type==='CULTIVATE'" icon="el-icon-search" type="primary" size="small" class="topic-button" @click="cultivate()" >培养</el-button>
          <el-button v-else icon="el-icon-search" type="primary" size="small" class="topic-button" @click="preview()" >预览</el-button>
        </el-form>
      </div>
    </template>
    <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="selectionChange">
      <el-table-column v-if="type === 'CULTIVATE'" type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column v-if="type !== 'CULTIVATE'" label="录入" width="55" align="center">
        <template #default="scope">
          <el-checkbox :model-value="scope.row.status === '已保存'? true: false" disabled/>
        </template>
      </el-table-column>
      <el-table-column label="样品码" show-overflow-tooltip prop="sampleCode" />
      <el-table-column label="检验内容" show-overflow-tooltip prop="inspectContent" />
      <el-table-column label="操作" width="140" fixed="right" v-if="type!=='CULTIVATE'">
        <template #default="scope">
          <el-button v-if="type === 'CALCULATE'" type="text" icon="qmsIconfont qms-jianyan3" class="role__btn" @click="calculate(scope.row)">
            计数
          </el-button>
          <el-button v-if="type === 'FIVETUBES'" type="text" icon="qmsIconfont qms-jianyan3" class="role__btn" @click="five(scope.row)">
            检验
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </mds-card>
  <el-dialog v-model="cultivateDialog" title="培养" width="855px">
    <commonDialog ref="cultivateDialogRef" type="CULTIVATE" :preview="false" @success="() => cultivateDialog = false"/>
    <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
      <el-button size="small" icon="el-icon-circle-close" @click="cultivateDialog = false">取消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="updateFormSubmit">保存</el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="countDialog" title="计数" width="855px">
    <commonDialog ref="countDialogRef" type="CALCULATE" :preview="false" @success="() => cultivateDialog = false"/>
    <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
      <el-button size="small" icon="el-icon-circle-close" @click="countDialog = false">取消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="updateFormSubmit">保存</el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="fiveDialog" title="检验" width="855px">
    <commonDialog ref="fiveDialogRef" type="FIVETUBES" :preview="false" @success="() => cultivateDialog = false"/>
    <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
      <el-button size="small" icon="el-icon-circle-close" @click="fiveDialog = false">取消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="updateFormSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  onMounted,
  nextTick,
  getCurrentInstance
} from 'vue'
import {
  MICROBE_INSPECT_LIST,
  MICROBE_INSPECT_FIVE_DIALOG_QUERY,
  MICROBE_INSPECT_COUNT_DIALOG_QUERY,
  MICROBE_INSPECT_CULTIVATE_DIALOG_QUERY
} from '@/api/api'
import commonDialog from './commonDialog'

export default defineComponent({
  name: 'commonPage',
  props: {
    type: {
      type: String,
      default: 'CALCULATE' // CULTIVATE 培养 CALCULATE 计数  FIVETUBES 五管
    },
    indexName: {
      type: String,
      default: '菌落总数'
    },
    taskInspectIdList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    commonDialog
  },
  setup (props) {
    const proxy = getCurrentInstance().proxy

    const componentData = reactive({
      countDialogRef: ref(),
      cultivateDialogRef: ref(),
      fiveDialogRef: ref(),
      countDialog: false,
      cultivateDialog: false,
      fiveDialog: false,
      queryForm: {
        indexName: props.indexName,
        sampleCode: '',
        inspectDateBegin: '',
        taskInspectIdList: props.taskInspectIdList
      },
      selectionData: [],
      tableData: []
    })

    // 查询
    const query = async () => {
      const { data } = await MICROBE_INSPECT_LIST(componentData.queryForm)
      componentData.tableData = data.data
    }
    const selectionChange = (val) => {
      componentData.selectionData = val
    }
    // 培养
    const cultivate = async () => {
      if (!componentData.selectionData.length) {
        proxy.$warningToast('请选择数据')
        return
      }
      const { data } = await MICROBE_INSPECT_CULTIVATE_DIALOG_QUERY(componentData.selectionData.map(it => it.id))
      componentData.cultivateDialog = true
      await nextTick()
      componentData.cultivateDialogRef.init(data.data, componentData.selectionData)
    }
    // 预览
    const preview = () => {
      console.log(1)
    }
    // 计数
    const calculate = async (row) => {
      const { data } = await MICROBE_INSPECT_COUNT_DIALOG_QUERY([row.id])
      componentData.countDialog = true
      await nextTick()
      componentData.countDialogRef.init(data.data[0], row)
    }
    // 检验
    const five = async (row) => {
      const { data } = await MICROBE_INSPECT_FIVE_DIALOG_QUERY([row.id])
      componentData.fiveDialog = true
      await nextTick()
      componentData.fiveDialogRef.init(data.data[0], row)
    }
    const updateFormSubmit = () => {
      if (props.type === 'CALCULATE') {
      } else if (props.type === 'CULTIVATE') {
        componentData.cultivateDialogRef.updateFormSubmit()
      } else if (props.type === 'FIVETUBES') {
        componentData.fiveDialogRef.updateFormSubmit()
      }
    }

    onMounted(async () => {
      await query()
    })

    return {
      ...toRefs(componentData),
      selectionChange,
      cultivate,
      preview,
      query,
      calculate,
      five,
      updateFormSubmit
    }
  }
})
</script>

<style scoped>

</style>
