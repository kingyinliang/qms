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
          <el-button v-if="type === 'CALCULATE'" type="text" icon="qmsIconfont qms-jianyan3" class="role__btn" @click="rowBtn(scope.row)">
            计数
          </el-button>
          <el-button v-if="type === 'FIVETUBES'" type="text" icon="qmsIconfont qms-jianyan3" class="role__btn" @click="rowBtn(scope.row)">
            检验
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </mds-card>
  <el-dialog v-model="visibleDialog" :title="type === 'CULTIVATE'? '培养' : type === 'CALCULATE'? '计数' : '检验'" width="855px">
    <commonDialog ref="dialogRef" :type="type" :preview="false" @success="successFn"/>
    <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
      <el-button v-if="type === 'CULTIVATE'" size="small" icon="el-icon-circle-close" @click="visibleDialog = false">取消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="updateFormSubmit('CHECKING')">保存</el-button>
      <el-button v-if="type !== 'CULTIVATE'" size="small" icon="el-icon-circle-check" type="primary" @click="updateFormSubmit('COMPLETED')">完成</el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="visiblePreviewDialog" title="检验预览" width="855px">
    <commonDialog ref="previewDialogRef" previewDialog="FIVETUBES" @success="previewSuccessFn"/>
    <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
      <el-button size="small" icon="el-icon-circle-close" @click="visiblePreviewDialog = false">取消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="updateFormSubmit('COMPLETED', 'preview')">完成</el-button>
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
      dialogRef: ref(),
      previewDialogRef: ref(),
      visibleDialog: false,
      visiblePreviewDialog: false,
      queryForm: {
        indexName: props.indexName,
        sampleCode: '',
        inspectDateBegin: '',
        taskInspectIdList: props.taskInspectIdList
      },
      tmpRow: {},
      selectionData: [],
      tableData: [],
      fivePreviewTableData: []
    })

    // 查询
    const query = async (tmp) => {
      if (!tmp) {
        componentData.queryForm.taskInspectIdList = []
      }
      const { data } = await MICROBE_INSPECT_LIST(componentData.queryForm)
      if (tmp) {
        componentData.tableData = data.data
      } else if (!data.data.length) {
        proxy.$warningToast('无查询数据')
      } else if (componentData.tableData.filter(it => it.id === data.data[0].id).length) {
        proxy.$warningToast('此数据已在表格内')
      } else {
        componentData.tableData.push(data.data[0])
      }
    }
    const selectionChange = (val) => {
      componentData.selectionData = val
    }
    // 预览
    const preview = async () => {
      // const ids = componentData.tableData.filter(it => it.status === '已保存').map(it => it.id)
      const ids = componentData.tableData.map(it => it.id)
      if (!ids.length) {
        proxy.$warningToast('请录入数据后预览')
        return
      }
      if (props.type === 'FIVETUBES') {
        componentData.visiblePreviewDialog = true
        const { data } = await MICROBE_INSPECT_FIVE_DIALOG_QUERY(ids)
        await nextTick()
        componentData.previewDialogRef.previewInit(data.data)
      }
    }
    // 培养
    const cultivate = async () => {
      if (!componentData.selectionData.length) {
        proxy.$warningToast('请选择数据')
        return
      }
      const { data } = await MICROBE_INSPECT_CULTIVATE_DIALOG_QUERY(componentData.selectionData.map(it => it.id))
      componentData.visibleDialog = true
      await nextTick()
      componentData.dialogRef.init(data.data, componentData.selectionData)
    }
    // 计数和检验
    const rowBtn = async (row) => {
      let net
      if (props.type === 'FIVETUBES') {
        net = MICROBE_INSPECT_FIVE_DIALOG_QUERY
      } else {
        net = MICROBE_INSPECT_COUNT_DIALOG_QUERY
      }
      const { data } = await net([row.id])
      componentData.visibleDialog = true
      componentData.tmpRow = row
      await nextTick()
      componentData.dialogRef.init(data.data[0], row)
    }
    // 保存和完成
    const updateFormSubmit = (str, pre) => {
      if (pre) {
        componentData.previewDialogRef.updateFormSubmit(str)
      } else {
        componentData.dialogRef.updateFormSubmit(str)
      }
    }
    // 保存和完成回调
    const successFn = (str) => {
      componentData.visibleDialog = false
      if (str === 'COMPLETED') {
        componentData.tableData = componentData.tableData.filter(it => it.id !== componentData.tmpRow.id)
      } else {
        const tmpList = componentData.tableData.filter(it => it.status !== '已保存')
        const tmpIndex = tmpList.findIndex(it => it.id === componentData.tmpRow.id) + 1
        if (tmpList[tmpIndex]) {
          rowBtn(tmpList[tmpIndex])
        }

        const tmp = componentData.tableData.find(it => it.id === componentData.tmpRow.id)
        tmp.status = '已保存'
      }
    }
    const previewSuccessFn = () => {
      console.log(1)
    }

    onMounted(async () => {
      await query(true)
    })

    return {
      ...toRefs(componentData),
      selectionChange,
      cultivate,
      preview,
      query,
      rowBtn,
      updateFormSubmit,
      successFn,
      previewSuccessFn
    }
  }
})
</script>

<style scoped>

</style>
