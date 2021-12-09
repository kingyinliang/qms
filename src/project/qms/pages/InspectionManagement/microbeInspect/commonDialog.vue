<template>
  <div v-if="!previewDialog" class="inspect__form">
    <p class="inspect__form__header">
      <img src="@/assets/img/printIcon.svg" alt="" class="inspect__form__header__img">
      <span>{{ form.inspectContent }}</span>
    </p>
    <el-form :inline="true" size="small" label-width="98px">
      <template v-if="type === 'CULTIVATE' || type === 'CALCULATE'">
        <mds-card class="inspect__form__main" title="培养" :pack-up="false">
          <div>
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
          </div>
        </mds-card>
        <mds-card v-if="type === 'CALCULATE'" class="inspect__form__main" title="计数" :pack-up="false">
          <el-form-item label="计数时间：">
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
          <el-form-item label="计数人：">
            <el-select v-model="form.inspectMan" multiple filterable placeholder="请选择" :disabled="preview" clearable style="width: 140px">
              <el-option v-for="item in users" :key="item.id" :label="item.realName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-table border :cell-style="{'text-align':'center'}" :data="form.taskCultureDataList" tooltip-effect="dark" :span-method="countSpanMethod" style="width: 100%">
            <el-table-column label="稀释度" min-width="110" >
              <template #default="scope">
                <div class="dilution">
                  <span>10</span>
                  <span class="dilution__m">{{ scope.row.dilution }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="计数1" min-width="110" >
              <template #default="scope">
                <el-input v-model="scope.row.countOne" placeholder="请输入" :disabled="preview" size="small" clearable style="width: 140px" @change="keyChange(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column label="计数2" min-width="110" >
              <template #default="scope">
                <el-input v-model="scope.row.countTwo" placeholder="请输入" :disabled="preview" size="small" clearable style="width: 110px" @change="keyChange(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column label="平均值" min-width="110" >
              <template #default="scope">
                {{ scope.row.average }}
              </template>
            </el-table-column>
            <el-table-column label="结果" min-width="110" >
              <template #default="scope">
                <el-input v-model="scope.row.result" placeholder="请输入" :disabled="preview" clearable style="width: 110px" @change="resultChange(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column label="单位" min-width="110" >
              <template #default="scope">
                <el-input v-model="scope.row.sampleCode" placeholder="请输入" :disabled="preview" clearable style="width: 110px" />
              </template>
            </el-table-column>
            <el-table-column label="备注" min-width="110" >
              <template #default="scope">
                <el-input v-model="scope.row.sampleCode" placeholder="请输入" :disabled="preview" clearable style="width: 110px" />
              </template>
            </el-table-column>
          </el-table>
        </mds-card>
      </template>
      <template v-if="type === 'FIVETUBES'">
        <mds-card class="inspect__form__main" title="检验台信息" :pack-up="false">
          <div>
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
          </div>
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
                <el-input v-model="scope.row.emb" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
              </template>
            </el-table-column>
            <el-table-column label="证实试验" min-width="110" >
              <template #default="scope">
                <el-input v-model="scope.row.confirm" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
              </template>
            </el-table-column>
            <el-table-column label="查MPN检索表（MPN/100mL）" min-width="130" >
              <template #default="scope">
                <el-input v-model="scope.row.mpn" placeholder="请输入" :disabled="preview" clearable style="width: 140px" />
              </template>
            </el-table-column>
          </el-table>
        </mds-card>
      </template>
      <template v-if="type === 'FIVETUBES' || type === 'CALCULATE'">
        <div>
          <el-form-item label="综合判定：" label-width="120">
            <el-radio v-model="form.judgeResult" label="Y" :disabled="preview">合格</el-radio>
            <el-radio v-model="form.judgeResult" label="N" :disabled="preview">不合格</el-radio>
          </el-form-item>
          <el-form-item label="检验说明：" label-width="120" style="margin-left: 100px">
            <el-input v-model="form.inspectExplain" placeholder="请输入" :disabled="preview" clearable style="width: 300px"/>
          </el-form-item>
          <el-form-item label="复检方式：" label-width="120">
            <el-radio v-model="form.recheckMod" label="ORIGINAL_RECHECK" :disabled="preview">原样复检</el-radio>
            <el-radio v-model="form.recheckMod" label="RESAMOLING" :disabled="preview">取样复检</el-radio>
          </el-form-item>
          <el-form-item label="取样说明：" label-width="120" style="margin-left: 60px">
            <el-input v-model="form.inspectSiteName" placeholder="请输入" :disabled="preview" clearable style="width: 300px"/>
          </el-form-item>
        </div>
      </template>
    </el-form>
  </div>
  <div v-else-if="previewDialog === 'FIVETUBES'">
    <el-table border :cell-style="{'text-align':'center'}" :data="fivePreviewTableData" tooltip-effect="dark" style="width: 100%" :span-method="fivePreviewSpanMethod">
      <el-table-column label="样品" show-overflow-tooltip prop="sampleCode" min-width="95" />
      <el-table-column label="检验内容" show-overflow-tooltip prop="inspectContent" min-width="95" />
      <el-table-column label="10mL双料管" show-overflow-tooltip min-width="100">
        <template #default="scope">
          <el-select v-model="scope.row.ten" placeholder=" " disabled size="small" style="width: 75px">
            <el-option v-for="item in ftube" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="1mL单料管" show-overflow-tooltip min-width="90">
        <template #default="scope">
          <el-select v-model="scope.row.one" placeholder=" " disabled size="small" style="width: 65px">
            <el-option v-for="item in ftube" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="0.1mL单料管" show-overflow-tooltip min-width="110">
        <template #default="scope">
          <el-select v-model="scope.row.zeroPointOne" placeholder=" " disabled size="small" style="width: 75px">
            <el-option v-for="item in ftube" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="EMB平板及G染色、镜检" show-overflow-tooltip prop="emb" min-width="120" />
      <el-table-column label="证实试验" show-overflow-tooltip prop="confirm" min-width="80" />
      <el-table-column label="查MPN检索表（MPN/100mL）" show-overflow-tooltip prop="mpn" min-width="130" />
    </el-table>
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
  MICROBE_INSPECT_COUNT_DIALOG_STANDARD,
  MICROBE_INSPECT_CULTIVATE_DIALOG_SAVED,
  MICROBE_INSPECT_FIVE_DIALOG_SAVED,
  MICROBE_INSPECT_COUNT_DIALOG_SAVED
} from '@/api/api'
import { dateFormat } from '@/utils'

export default defineComponent({
  name: 'commonDialog',
  props: {
    previewDialog: {
      type: String,
      default: ''
    },
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
      form: {},
      standard: {},
      inspectMethod: {},
      fivePreviewTableData: [],
      users: [],
      ftube: [],
      consoleNo: [],
      outWaterNo: [],
      cultureBox: [],
      sterilizerPot: []
    })

    const init = async (data, row) => {
      if (props.type === 'CALCULATE') {
        const res = await MICROBE_INSPECT_COUNT_DIALOG_STANDARD([row])
        componentData.standard = res.data.data[0].inspectIndexStandard
        componentData.inspectMethod = res.data.data[0].inspectMethodGroupNameList[0].inspectParameterGroupList[0] || ''
        if (!componentData.standard) {
          proxy.$warningToast('无标准')
        }
        if (!componentData.inspectMethod) {
          proxy.$warningToast('无inspectMethod')
        }
      }
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
        if (props.type === 'CALCULATE') {
          componentData.form.inspectMan = componentData.form.inspectMan.split(',')
          componentData.form.taskInspectId = row.id
          componentData.form.taskInspectIndexId = row.taskInspectIndexId
          componentData.form.taskManageId = row.taskManageId
        }
        if (props.type === 'FIVETUBES') {
          componentData.form.taskInspectId = row.id
          componentData.form.taskInspectIndexId = row.taskInspectIndexId
          componentData.form.taskManageId = row.taskManageId
          componentData.form.taskFiveTubeDataList[0].emb = componentData.form.emb
          componentData.form.taskFiveTubeDataList[0].confirm = componentData.form.confirm
          componentData.form.taskFiveTubeDataList[0].mpn = componentData.form.mpn
        }
      } else if (props.type === 'CALCULATE') {
        const tmpList = componentData.inspectMethod.parameterDetails.split(',')
        const list = tmpList.map(it => {
          return {
            id: '',
            dilution: it,
            countOne: '',
            countTwo: '',
            average: ''
          }
        })
        componentData.form = {
          inspectContent: row.inspectContent,
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
          taskInspectIdList: row.id,
          taskInspectIndexIdList: row.taskInspectIndexId,
          taskManageIdList: row.taskManageId,
          taskCultureDataList: list
        }
      } else if (props.type === 'CULTIVATE') {
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
            sampleSequence: i + 1,
            taskInspectId: row.id,
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
          judgeResult: '',
          inspectExplain: '',
          recheckMod: '',
          inspectSiteName: '',
          taskFiveTubeDataList: list
        }
      }
    }
    const previewInit = (data) => {
      componentData.fivePreviewTableData = []
      data.forEach(it => {
        it.taskFiveTubeDataList[0].sampleCode = it.sampleCode
        it.taskFiveTubeDataList[0].inspectContent = it.inspectContent
        it.taskFiveTubeDataList[0].emb = it.emb
        it.taskFiveTubeDataList[0].confirm = it.confirm
        it.taskFiveTubeDataList[0].mpn = it.mpn
        componentData.fivePreviewTableData = componentData.fivePreviewTableData.concat(it.taskFiveTubeDataList)
      })
    }
    const getSelect = async (code) => {
      const { data } = await DICT_DROPDOWN({ dictType: code })
      return data.data
    }
    // 合并单元格 检验
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
    // 合并单元格 计数
    const countSpanMethod = (scope) => {
      if (scope.columnIndex > 3) {
        if (scope.rowIndex > 1) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          return {
            rowspan: componentData.form.taskCultureDataList.length,
            colspan: 1
          }
        }
      }
    }
    const fivePreviewSpanMethod = (scope) => {
      if (scope.columnIndex < 2 || scope.columnIndex > 4) {
        if (scope.rowIndex % 5 !== 0) {
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
    // 提交表单
    const updateFormSubmit = async (str) => {
      if (props.type === 'CALCULATE') {
        componentData.form.taskStatus = str
        await MICROBE_INSPECT_COUNT_DIALOG_SAVED(componentData.form)
      } else if (props.type === 'CULTIVATE') {
        const data = JSON.parse(JSON.stringify(componentData.form))
        data.inspectMan = data.inspectMan.join(',')
        await MICROBE_INSPECT_CULTIVATE_DIALOG_SAVED(data)
      } else if (props.type === 'FIVETUBES') {
        componentData.form.taskStatus = str
        componentData.form.emb = componentData.form.taskFiveTubeDataList[0].emb
        componentData.form.confirm = componentData.form.taskFiveTubeDataList[0].confirm
        componentData.form.mpn = componentData.form.taskFiveTubeDataList[0].mpn
        await MICROBE_INSPECT_FIVE_DIALOG_SAVED(componentData.form)
      }
      proxy.$successToast('操作成功')
      proxy.$emit('success', str)
    }
    const keyChange = (row) => {
      row.average = (Number(row.countOne) + Number(row.countTwo)) / 2
    }
    // 结果联动判定
    const resultChange = (row) => {
      if (Number(row.result) > componentData.standard.indexDown && Number(row.result) < componentData.standard.indexUp) {
        componentData.form.judgeResult = 'Y'
      } else {
        componentData.form.judgeResult = 'N'
      }
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
      previewInit,
      objectSpanMethod,
      countSpanMethod,
      fivePreviewSpanMethod,
      updateFormSubmit,
      keyChange,
      resultChange
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
  .dilution{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    font-size: 16px;
    &__m{
      font-size: 12px;
      margin-top: -20px;
      margin-left: 3px;
    }
  }
}
</style>
