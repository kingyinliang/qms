<template>
  <div class="inspect__form">
    <p class="inspect__form__header">
      <img src="@/assets/img/printIcon.svg" alt="" class="inspect__form__header__img">
      <span>{{ form.inspectContent }}</span>
    </p>
    <template v-if="type === 'CULTIVATE' || type === 'CALCULATE'">
      <mds-card class="inspect__form__main" title="培养" :pack-up="false">
        <el-form :inline="true" size="small" label-width="98px">
          <el-form-item label="检验日期：">
            <el-date-picker
              v-model="form.inspectDate"
              type="date"
              :disabled="preview"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选选择日期"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item label="培养批次：">
            <el-input v-model="form.cultureBatch" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
          </el-form-item>
          <el-form-item label="培养箱：">
            <el-select v-model="form.cultureBox" placeholder="请选择" :disabled="preview" clearable style="width: 140px">
              <el-option v-for="item in cultureBox" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="灭菌锅编号：">
            <el-select v-model="form.sterilizerPot" placeholder="请选择" :disabled="preview" clearable style="width: 140px">
              <el-option v-for="item in sterilizerPot" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="放入时间：">
            <el-date-picker
              v-model="form.putInDate"
              type="date"
              :disabled="preview"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选选择日期"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item label="放入温度：">
            <el-input v-model="form.putInTemp" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
          </el-form-item>
          <el-form-item label="取出时间：">
            <el-date-picker
              v-model="form.takeOutDate"
              type="date"
              :disabled="preview"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选选择日期"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item label="取出温度：">
            <el-input v-model="form.takeOutTemp" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
          </el-form-item>
          <el-form-item label="灭菌用品批次：" label-width="120px">
            <el-input v-model="form.sterilizerBatch" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
          </el-form-item>
          <el-form-item label="检验人：">
            <el-select v-model="form.inspectMan" multiple filterable placeholder="请选择" :disabled="preview" clearable style="width: 140px">
              <el-option v-for="item in users" :key="item.id" :label="item.realName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="培养24小时温度：" label-width="140px">
            <el-input v-model="form.cultureTemp" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
          </el-form-item>
        </el-form>
      </mds-card>
      <mds-card v-if="type === 'CALCULATE'" class="inspect__form__main" title="计数" :pack-up="false">
        <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column label="稀释度" width="110" >
            <template #default="scope">
              <el-input v-model="scope.row.sampleCode" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
            </template>
          </el-table-column>
          <el-table-column label="计数1" width="110" >
            <template #default="scope">
              <el-input v-model="scope.row.sampleCode" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
            </template>
          </el-table-column>
          <el-table-column label="计数2" width="110" >
            <template #default="scope">
              <el-input v-model="scope.row.sampleCode" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
            </template>
          </el-table-column>
          <el-table-column label="平均值" width="110" >
            <template #default="scope">
              <el-input v-model="scope.row.sampleCode" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
            </template>
          </el-table-column>
          <el-table-column label="结果" width="110" >
            <template #default="scope">
              <el-input v-model="scope.row.sampleCode" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
            </template>
          </el-table-column>
          <el-table-column label="单位" width="110" >
            <template #default="scope">
              <el-input v-model="scope.row.sampleCode" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
            </template>
          </el-table-column>
          <el-table-column label="备注" width="110" >
            <template #default="scope">
              <el-input v-model="scope.row.sampleCode" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
            </template>
          </el-table-column>
        </el-table>
      </mds-card>
    </template>
    <template v-if="type === 'FIVETUBES'">
      <mds-card class="inspect__form__main" title="检验台信息" :pack-up="false">
        <el-form :inline="true" size="small" label-width="98px">
          <el-form-item label="样品码：">
            <el-input v-model="form.sampleCode" placeholder="请输入" disabled clearable style="width: 140px" />
          </el-form-item>
          <el-form-item label="出水口编号：">
            <el-select v-model="form.outWaterNo" placeholder="请选择" :disabled="preview" clearable style="width: 140px">
              <el-option v-for="item in outWaterNo" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="检验日期：">
            <el-date-picker
              v-model="form.inspectDate"
              type="date"
              :disabled="preview"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选选择日期"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item label="杀菌锅编号：">
            <el-select v-model="form.sterilizerPot" placeholder="请选择" :disabled="preview" clearable style="width: 140px">
              <el-option v-for="item in sterilizerPot" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="操作台编号：">
            <el-select v-model="form.consoleNo" placeholder="请选择" :disabled="preview" clearable style="width: 140px">
              <el-option v-for="item in consoleNo" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="培养箱编号：">
            <el-select v-model="form.cultureBox" placeholder="请选择" :disabled="preview" clearable style="width: 140px">
              <el-option v-for="item in cultureBox" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
            </el-select>
          </el-form-item>
        </el-form>
      </mds-card>
      <mds-card class="inspect__form__main" title="检验数据" :pack-up="false">
        <el-table border :cell-style="{'text-align':'center'}" :data="form.taskFiveTubeDataList" tooltip-effect="dark" :span-method="objectSpanMethod" style="width: 100%">
          <el-table-column type="index" label="样品制备" width="80" align="center" />
          <el-table-column label="10mL双料管" width="110" >
            <template #default="scope">
              <el-select v-model="scope.row.ten" placeholder="请选择" :disabled="preview" clearable size="small" style="width: 100px">
                <el-option v-for="item in ftube" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="1mL单料管" width="110" >
            <template #default="scope">
              <el-select v-model="scope.row.one" placeholder="请选择" :disabled="preview" clearable size="small" style="width: 100px">
                <el-option v-for="item in ftube" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="0.1mL单料管" width="110" >
            <template #default="scope">
              <el-select v-model="scope.row.zeroPointOne" placeholder="请选择" :disabled="preview" clearable size="small" style="width: 100px">
                <el-option v-for="item in ftube" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="EMB平板及G染色、镜检" min-width="130" >
            <template #default="scope">
              <el-input v-model="scope.row.sampleCode" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
            </template>
          </el-table-column>
          <el-table-column label="证实试验" min-width="110" >
            <template #default="scope">
              <el-input v-model="scope.row.sampleCode" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
            </template>
          </el-table-column>
          <el-table-column label="查MPN检索表（MPN/100mL）" min-width="130" >
            <template #default="scope">
              <el-input v-model="scope.row.sampleCode" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
            </template>
          </el-table-column>
        </el-table>
      </mds-card>
      <div style="display: flex;align-items: center">
        <div>检验说明：</div>
        <el-input v-model="form.sampleCode" placeholder="请输入" disabled clearable style="flex: 1" />
      </div>
    </template>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  getCurrentInstance
} from 'vue'
import {
  DICT_DROPDOWN,
  USER_LIST_QUERY,
  MICROBE_INSPECT_CULTIVATE_DIALOG_SAVED,
  MICROBE_INSPECT_FIVE_DIALOG_SAVED
} from '@/api/api'
import { dateFormat } from '@/utils'

export default defineComponent({
  name: 'commonDialog',
  props: {
    type: {
      type: String,
      default: 'CALCULATE' // CULTIVATE 培养 CALCULATE 计数  FIVETUBES 五管
    },
    preview: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const proxy = getCurrentInstance().proxy

    const componentData = reactive({
      visibleDialog: false,
      form: {},
      tableData: [],
      users: [],
      ftube: [],
      consoleNo: [],
      outWaterNo: [],
      cultureBox: [],
      sterilizerPot: []
    })

    const init = (data, row) => {
      if (data) {
        componentData.form = data
        componentData.form.inspectContent = props.type !== 'CULTIVATE' ? row.inspectContent : row[0].inspectContent.split('-')[row[0].inspectContent.split('-').length - 1]
        if (props.type === 'CULTIVATE') {
          componentData.form.inspectMan = componentData.form.inspectMan.split(',')
          componentData.form.taskInspectIdList = row.map(it => it.id)
          componentData.form.sampleCodeList = row.map(it => it.sampleCode)
          componentData.form.taskInspectIndexIdList = row.map(it => it.taskInspectIndexId)
          componentData.form.taskManageIdList = row.map(it => it.taskManageId)
        }
        if (props.type === 'FIVETUBES') {
          componentData.form.taskInspectId = row.id
          componentData.form.taskInspectIndexId = row.taskInspectIndexId
          componentData.form.taskManageId = row.taskManageId
          componentData.form.taskFiveTubeDataList[0].emb = componentData.form.emb
          componentData.form.taskFiveTubeDataList[0].confirm = componentData.form.confirm
          componentData.form.taskFiveTubeDataList[0].mpn = componentData.form.mpn
        }
      } else if (props.type === 'CALCULATE') {} else if (props.type === 'CULTIVATE') {
        componentData.form = {
          inspectContent: row[0].inspectContent.split('-')[row[0].inspectContent.split('-').length - 1],
          inspectDate: dateFormat(new Date(), 'yyyy-MM-dd'),
          inspectMan: [],
          cultureBatch: '',
          sterilizerBatch: '',
          cultureBox: '',
          sterilizerPot: '',
          putInDate: '',
          putInTemp: '',
          takeOutDate: '',
          takeOutTemp: '',
          cultureTemp: '',
          taskInspectIdList: row.map(it => it.id),
          sampleCodeList: row.map(it => it.sampleCode),
          taskInspectIndexIdList: row.map(it => it.taskInspectIndexId),
          taskManageIdList: row.map(it => it.taskManageId)
        }
      } else if (props.type === 'FIVETUBES') {
        const list = []
        for (let i = 0; i < 5; i++) {
          list.push({
            ten: '',
            one: '',
            zeroPointOne: '',
            emb: '',
            confirm: '',
            mpn: ''
          })
        }
        componentData.form = {
          inspectContent: row.inspectContent,
          taskInspectId: row.id,
          taskInspectIndexId: row.taskInspectIndexId,
          taskManageId: row.taskManageId,
          sampleCode: row.sampleCode,
          inspectDate: dateFormat(new Date(), 'yyyy-MM-dd'),
          outWaterNo: '',
          sterilizerPot: '',
          consoleNo: '',
          cultureBox: '',
          taskFiveTubeDataList: list
        }
      }
    }
    const getSelect = async (code) => {
      const { data } = await DICT_DROPDOWN({ dictType: code })
      return data.data
    }
    const objectSpanMethod = (scope) => {
      if (scope.columnIndex > 3) {
        if (scope.rowIndex > 1) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          return {
            rowspan: 5,
            colspan: 1
          }
        }
      }
    }
    const updateFormSubmit = async () => {
      if (props.type === 'CALCULATE') {
      } else if (props.type === 'CULTIVATE') {
        const data = JSON.parse(JSON.stringify(componentData.form))
        data.inspectMan = data.inspectMan.join(',')
        await MICROBE_INSPECT_CULTIVATE_DIALOG_SAVED(data)
      } else if (props.type === 'FIVETUBES') {
        componentData.form.emb = componentData.form.taskFiveTubeDataList[0].emb
        componentData.form.confirm = componentData.form.taskFiveTubeDataList[0].confirm
        componentData.form.mpn = componentData.form.taskFiveTubeDataList[0].mpn
        await MICROBE_INSPECT_FIVE_DIALOG_SAVED(componentData.form)
      }
      proxy.$successToast('操作成功')
      proxy.$emit('success')
    }

    onMounted(async () => {
      componentData.cultureBox = await getSelect('INCUBATOR')
      componentData.sterilizerPot = await getSelect('STERPOT_NO')
      componentData.outWaterNo = await getSelect('OUTLET_NO')
      componentData.consoleNo = await getSelect('CONSOLE_NO')
      componentData.ftube = await getSelect('FTUBE_V')
      const { data } = await USER_LIST_QUERY({ factory: JSON.parse(sessionStorage.getItem('system') || '{}').id || '', deptCode: '710050' })
      componentData.users = data.data
    })

    return {
      ...toRefs(componentData),
      init,
      objectSpanMethod,
      updateFormSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.inspect__form{
  &__header{
    display: flex;
    justify-content: center;
    line-height: 32px;
    font-size: 20px;
    &__img{
      height: 32px;
      margin-right: 10px;
    }
  }
  &__main{
    border: none;
    box-shadow: none;
  }
}
</style>
