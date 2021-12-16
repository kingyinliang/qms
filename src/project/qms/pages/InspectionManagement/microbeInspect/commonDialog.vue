<template>
  <div v-if="!previewDialog" class="inspect__form">
    <p class="inspect__form__header" :class="{'inspect__form__header--center': !preview, 'inspect__form__header--left': preview}">
      <img src="@/assets/img/printIcon.svg" alt="" class="inspect__form__header__img">
      <span>{{ form.inspectContent }}</span>
    </p>
    <el-form :model="form" ref="formRef" :rules="preview? {} : type === 'CULTIVATE'? {} : rules" :inline="true" size="small" label-width="110px">
      <template v-if="type === 'CULTIVATE' || type === 'CALCULATE'">
        <mds-card class="inspect__form__main" title="培养" :pack-up="false">
          <div>
            <el-form-item label="检验日期：">
              <el-date-picker
                v-model="form.inspectDate"
                type="date"
                :disabled="preview || type === 'CALCULATE'"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :placeholder="preview? '':'请选选择日期'"
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item label="培养批次：" prop="cultureBatch">
              <el-input v-model="form.cultureBatch" maxlength="6" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 140px" />
            </el-form-item>
            <el-form-item label="培养箱：" prop="cultureBox">
              <el-select v-model="form.cultureBox" :placeholder="preview? ' ':'请选择'" :disabled="preview" clearable style="width: 140px">
                <el-option v-for="item in cultureBox" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
              </el-select>
            </el-form-item>
            <el-form-item label="灭菌锅编号：">
              <el-select v-model="form.sterilizerPot" :placeholder="preview? ' ':'请选择'" :disabled="preview" clearable style="width: 140px">
                <el-option v-for="item in sterilizerPot" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
              </el-select>
            </el-form-item>
            <el-form-item label="放入时间：" prop="putInDate">
              <el-date-picker
                v-model="form.putInDate"
                type="date"
                :disabled="preview"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :placeholder="preview? '':'请选选择日期'"
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item label="放入温度：" prop="putInTemp">
              <el-input v-model="form.putInTemp" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 140px" />
            </el-form-item>
            <el-form-item label="取出时间：" prop="takeOutDate">
              <el-date-picker
                v-model="form.takeOutDate"
                type="date"
                :disabled="preview"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :placeholder="preview? '':'请选选择日期'"
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item label="取出温度：" prop="takeOutTemp">
              <el-input v-model="form.takeOutTemp" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 140px" />
            </el-form-item>
            <el-form-item label="检验人：" prop="inspectMan">
              <el-select v-model="form.inspectMan" multiple filterable :placeholder="preview? ' ':'请选择'" :disabled="preview" clearable style="width: 140px">
                <el-option v-for="item in users" :key="item.id" :label="item.realName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="灭菌用品批次：" label-width="130px" prop="sterilizerBatch">
              <el-input v-model="form.sterilizerBatch" maxlength="6" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 140px" />
            </el-form-item>
            <el-form-item label="培养24小时温度：" label-width="140px" prop="cultureTemp">
              <el-input v-model="form.cultureTemp" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 140px" />
            </el-form-item>
          </div>
        </mds-card>
        <mds-card v-if="type === 'CALCULATE'" class="inspect__form__main" title="计数" :pack-up="false">
          <el-form-item label="计数时间：" prop="countDate">
            <el-date-picker
              v-model="form.countDate"
              type="date"
              :disabled="preview"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :placeholder="preview? '':'请选选择日期'"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item label="计数人：" prop="countMan">
            <el-select v-model="form.countMan" multiple filterable :placeholder="preview? ' ':'请选择'" :disabled="preview" clearable style="width: 140px">
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
              <template #header v-if="!preview"><span style="color: red">*</span>计数1</template>
              <template #default="scope">
                <el-input v-model="scope.row.countOne" :placeholder="preview? '':'请输入'" :disabled="preview" size="small" clearable style="width: 140px" @input="e => scope.row.countOne = e.replace(/[^0-9]/gi, '')" @change="keyChange(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column label="计数2" min-width="110" >
              <template #header v-if="!preview"><span style="color: red">*</span>计数2</template>
              <template #default="scope">
                <el-input v-model="scope.row.countTwo" :placeholder="preview? '':'请输入'" :disabled="preview" size="small" clearable style="width: 110px" @input="e => scope.row.countTwo = e.replace(/[^0-9]/gi, '')" @change="keyChange(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column label="平均值" min-width="110" >
              <template #header v-if="!preview"><span style="color: red">*</span>平均值</template>
              <template #default="scope">
                {{ scope.row.average }}
              </template>
            </el-table-column>
            <el-table-column label="结果" min-width="110" >
              <template #header v-if="!preview"><span style="color: red">*</span>结果</template>
              <template #default="scope">
                <el-input v-model="scope.row.inspectResult" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 110px" @change="resultChange(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column label="单位" min-width="110" >
              <template #default="scope">
                <el-input v-model="scope.row.cultureUnit" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 110px" />
              </template>
            </el-table-column>
            <el-table-column label="备注" min-width="110" >
              <template #default="scope">
                <el-input v-model="scope.row.cultureRemark" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 110px" />
              </template>
            </el-table-column>
          </el-table>
        </mds-card>
      </template>
      <template v-if="type === 'FIVETUBES'">
        <mds-card class="inspect__form__main" title="检验台信息" :pack-up="false">
          <div>
            <el-form-item label="样品码：">
              <el-input v-model="form.sampleCode" :placeholder="preview? '':'请输入'" disabled clearable style="width: 140px" />
            </el-form-item>
            <el-form-item label="出水口编号：" prop="outWaterNo">
              <el-select v-model="form.outWaterNo" :placeholder="preview? ' ':'请选择'" :disabled="preview" clearable style="width: 140px">
                <el-option v-for="item in outWaterNo" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
              </el-select>
            </el-form-item>
            <el-form-item label="检验日期：" prop="inspectDate">
              <el-date-picker
                v-model="form.inspectDate"
                type="date"
                :disabled="preview"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :placeholder="preview? '':'请选选择日期'"
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item label="杀菌锅编号：">
              <el-select v-model="form.sterilizerPot" :placeholder="preview? ' ':'请选择'" :disabled="preview" clearable style="width: 140px">
                <el-option v-for="item in sterilizerPot" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
              </el-select>
            </el-form-item>
            <el-form-item label="操作台编号：" prop="consoleNo">
              <el-select v-model="form.consoleNo" :placeholder="preview? ' ':'请选择'" :disabled="preview" clearable style="width: 140px">
                <el-option v-for="item in consoleNo" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
              </el-select>
            </el-form-item>
            <el-form-item label="培养箱编号：" prop="cultureBox">
              <el-select v-model="form.cultureBox" :placeholder="preview? ' ':'请选择'" :disabled="preview" clearable style="width: 140px">
                <el-option v-for="item in cultureBox" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
              </el-select>
            </el-form-item>
          </div>
        </mds-card>
        <mds-card class="inspect__form__main" title="检验数据" :pack-up="false">
          <el-table border :cell-style="{'text-align':'center'}" :data="form.taskFiveTubeDataList" tooltip-effect="dark" :span-method="objectSpanMethod" style="width: 100%">
            <el-table-column type="index" label="样品制备" width="80" align="center" />
            <el-table-column label="10mL双料管" width="110" >
              <template #header v-if="!preview"><span style="color: red">*</span>10mL双料管</template>
              <template #default="scope">
                <el-select v-model="scope.row.ten" :placeholder="preview? ' ':'请选择'" :disabled="preview" clearable size="small" style="width: 100px">
                  <el-option v-for="item in ftube" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="1mL单料管" width="110" >
              <template #header v-if="!preview"><span style="color: red">*</span>1mL单料管</template>
              <template #default="scope">
                <el-select v-model="scope.row.one" :placeholder="preview? ' ':'请选择'" :disabled="preview" clearable size="small" style="width: 100px">
                  <el-option v-for="item in ftube" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="0.1mL单料管" width="110" >
              <template #header v-if="!preview"><span style="color: red">*</span>0.1mL单料管</template>
              <template #default="scope">
                <el-select v-model="scope.row.zeroPointOne" :placeholder="preview? ' ':'请选择'" :disabled="preview" clearable size="small" style="width: 100px">
                  <el-option v-for="item in ftube" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="EMB平板及G染色、镜检" min-width="130" >
              <template #default="scope">
                <el-input v-model="scope.row.emb" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 140px" />
              </template>
            </el-table-column>
            <el-table-column label="证实试验" min-width="110" >
              <template #default="scope">
                <el-input v-model="scope.row.confirm" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 140px" />
              </template>
            </el-table-column>
            <el-table-column label="查MPN检索表（MPN/100mL）" min-width="130" >
              <template #default="scope">
                <el-input v-model="scope.row.mpn" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 140px" />
              </template>
            </el-table-column>
          </el-table>
        </mds-card>
      </template>
      <template v-if="type === 'FIVETUBES' || type === 'CALCULATE'">
        <el-row style="padding: 0 16px">
          <el-form-item label="综合判定：" label-width="120" prop="judgeResult">
            <el-radio v-model="form.judgeResult" label="Y" :disabled="preview">合格</el-radio>
            <el-radio v-model="form.judgeResult" label="N" :disabled="preview">不合格</el-radio>
          </el-form-item>
          <el-form-item label="检验说明：" label-width="120" style="margin-left: 100px">
            <el-input v-model="form.inspectExplain" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 300px"/>
          </el-form-item>
        </el-row>
        <el-row style="padding: 0 16px">
          <el-form-item label="复检方式：" label-width="120">
            <el-radio v-model="form.recheckMod" label="ORIGINAL_RECHECK" :disabled="preview">原样复检</el-radio>
            <el-radio v-model="form.recheckMod" label="RESAMOLING" :disabled="preview">取样复检</el-radio>
          </el-form-item>
          <el-form-item label="取样说明：" label-width="120" style="margin-left: 60px">
            <el-input v-model="form.inspectSiteName" :placeholder="preview? '':'请输入'" :disabled="preview" clearable style="width: 300px"/>
          </el-form-item>
        </el-row>
      </template>
    </el-form>
  </div>
  <div v-else-if="previewDialog === 'FIVETUBES'">
    <el-table border :cell-style="{'text-align':'center'}" :data="previewTableData" tooltip-effect="dark" style="width: 100%" :span-method="fivePreviewSpanMethod">
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
  <div v-else-if="previewDialog === 'CALCULATE'">
    <el-table border :cell-style="{'text-align':'center'}" :data="previewTableData" tooltip-effect="dark" style="width: 100%" :span-method="countPreviewSpanMethod">
      <el-table-column label="样品" show-overflow-tooltip prop="sampleCode" min-width="95" />
      <el-table-column label="检验内容" show-overflow-tooltip prop="inspectContent" min-width="95" />
      <el-table-column label="计数1" show-overflow-tooltip prop="countOne" min-width="110" />
      <el-table-column label="计数2" show-overflow-tooltip prop="countTwo" min-width="110" />
      <el-table-column label="平均值" show-overflow-tooltip prop="average" min-width="110" />
      <el-table-column label="结果" show-overflow-tooltip prop="inspectResult" min-width="110" />
    </el-table>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
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
  MICROBE_INSPECT_COUNT_DIALOG_SAVED,
  MICROBE_INSPECT_FIVE_DIALOG_PREVIEW_SAVED,
  MICROBE_INSPECT_COUNT_DIALOG_PREVIEW_SAVED
} from '@/api/api'
import { dateFormat, merge } from '@/utils'

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
    const rules = {
      inspectMan: [{ required: true, message: '请选择检验人', trigger: 'blur' }],
      cultureBatch: [{ required: true, message: '请输入培养批次', trigger: 'blur' }],
      cultureBox: [{ required: true, message: '请选择培养箱', trigger: 'blur' }],
      putInDate: [{ required: true, message: '请选择放入时间', trigger: 'blur' }],
      putInTemp: [{ required: true, message: '请选择放入温度', trigger: 'blur' }],
      takeOutDate: [{ required: true, message: '请选择取出时间', trigger: 'blur' }],
      takeOutTemp: [{ required: true, message: '请选择取出温度', trigger: 'blur' }],
      sterilizerBatch: [{ required: true, message: '请输入灭菌用品批次', trigger: 'blur' }],
      cultureTemp: [{ required: true, message: '请输入培养24小时温度', trigger: 'blur' }],
      countDate: [{ required: true, message: '请选择计数时间', trigger: 'blur' }],
      countMan: [{ required: true, message: '请选择计数人', trigger: 'blur' }],
      outWaterNo: [{ required: true, message: '请选择出水口编号', trigger: 'blur' }],
      inspectDate: [{ required: true, message: '请选择检验日期', trigger: 'blur' }],
      consoleNo: [{ required: true, message: '请选择操作台编号', trigger: 'blur' }],
      judgeResult: [{ required: true, message: '请选择综合判定', trigger: 'blur' }]
    }

    const componentData = reactive({
      formRef: ref(),
      form: {},
      standard: {},
      inspectMethod: {},
      previewTableData: [],
      previewData: [],
      users: [],
      ftube: [],
      consoleNo: [],
      outWaterNo: [],
      cultureBox: [],
      sterilizerPot: [],
      spanArr: []
    })

    // 初始化表单弹窗或者预览表单
    const init = async (data, row) => {
      componentData.formRef.resetFields()
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
          componentData.form.inspectMan = componentData.form.inspectMan ? componentData.form.inspectMan.split(',') : []
          componentData.form.taskInspectIdList = row.map(it => it.id)
          componentData.form.sampleCodeList = row.map(it => it.sampleCode)
          componentData.form.taskInspectIndexIdList = row.map(it => it.taskInspectIndexId)
          componentData.form.taskManageIdList = row.map(it => it.taskManageId)
        }
        if (props.type === 'CALCULATE') {
          componentData.form.inspectMan = componentData.form.inspectMan ? componentData.form.inspectMan.split(',') : []
          componentData.form.countMan = componentData.form.countMan ? componentData.form.countMan.split(',') : []
          componentData.form.taskInspectId = row.id
          componentData.form.taskInspectIndexId = row.taskInspectIndexId
          componentData.form.taskManageId = row.taskManageId
          if (!componentData.form.taskCultureDataList.length) {
            const tmpList = componentData.inspectMethod.parameterDetails.split(',')
            const list = tmpList.map(it => {
              return {
                id: '',
                taskInspectId: row.id,
                dilution: it,
                countOne: '',
                countTwo: '',
                average: '',
                inspectResult: '',
                cultureUnit: '',
                cultureRemark: ''
              }
            })
            componentData.form.taskCultureDataList = list
          } else {
            componentData.form.taskCultureDataList[0].inspectResult = componentData.form.inspectResult
            componentData.form.taskCultureDataList[0].cultureUnit = componentData.form.cultureUnit
            componentData.form.taskCultureDataList[0].cultureRemark = componentData.form.cultureRemark
          }
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
            taskInspectId: row.id,
            dilution: it,
            countOne: '',
            countTwo: '',
            average: '',
            inspectResult: '',
            cultureUnit: '',
            cultureRemark: ''
          }
        })
        componentData.form = {
          id: '',
          inspectContent: row.inspectContent,
          inspectDate: dateFormat(new Date(), 'yyyy-MM-dd'),
          inspectMan: [],
          countMan: [],
          countDate: '',
          cultureBatch: '',
          sterilizerBatch: '',
          cultureBox: '',
          sterilizerPot: '',
          putInDate: '',
          putInTemp: '',
          takeOutDate: '',
          takeOutTemp: '',
          cultureTemp: '',
          inspectSiteName: '',
          recheckMod: '',
          inspectExplain: '',
          judgeResult: '',
          taskInspectId: row.id,
          sampleCode: row.sampleCode,
          taskInspectIndexId: row.taskInspectIndexId,
          taskManageId: row.taskManageId,
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
      if (row instanceof Array) {
        componentData.form.inspectMethodCode = row[0].inspectMethodCode
        componentData.form.inspectMethodName = row[0].inspectMethodName
      } else {
        componentData.form.inspectMethodCode = row.inspectMethodCode
        componentData.form.inspectMethodName = row.inspectMethodName
      }
    }
    // 初始化预览弹窗
    const previewInit = (data) => {
      componentData.previewTableData = []
      data.forEach(it => {
        if (props.previewDialog === 'FIVETUBES') {
          it.taskFiveTubeDataList.map(item => { item.sampleCode = it.sampleCode })
          it.taskFiveTubeDataList[0].inspectContent = it.inspectContent
          it.taskFiveTubeDataList[0].emb = it.emb
          it.taskFiveTubeDataList[0].confirm = it.confirm
          it.taskFiveTubeDataList[0].mpn = it.mpn
          componentData.previewTableData = componentData.previewTableData.concat(it.taskFiveTubeDataList)
        }
        if (props.previewDialog === 'CALCULATE') {
          it.taskCultureDataList.map(item => { item.sampleCode = it.sampleCode })
          it.taskCultureDataList[0].inspectContent = it.inspectContent
          it.taskCultureDataList[0].inspectResult = it.inspectResult
          componentData.previewTableData = componentData.previewTableData.concat(it.taskCultureDataList)
        }
      })
      componentData.previewData = data
      componentData.spanArr = merge(componentData.previewTableData, 'sampleCode')
    }
    // 获取数据字典
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
    // 预览合并单元格
    const fivePreviewSpanMethod = (scope) => {
      if (scope.columnIndex < 2 || scope.columnIndex > 4) {
        return {
          rowspan: componentData.spanArr[scope.rowIndex],
          colspan: componentData.spanArr[scope.rowIndex] > 0 ? 1 : 0
        }
      }
    }
    // 预览合并单元格
    const countPreviewSpanMethod = (scope) => {
      if (scope.columnIndex < 2 || scope.columnIndex > 4) {
        return {
          rowspan: componentData.spanArr[scope.rowIndex],
          colspan: componentData.spanArr[scope.rowIndex] > 0 ? 1 : 0
        }
      }
    }
    // 提交表单--校验
    const updateFormSubmit = async (str) => {
      if (str === 'COMPLETED') {
        componentData.formRef.validate((valid) => {
          if (valid) {
            if (props.type === 'CALCULATE') {
              for (const item of componentData.form.taskCultureDataList) {
                if (!item.countOne || !item.countTwo || !item.average) {
                  proxy.$warningToast('请填写计数表格必填数据')
                  return
                }
              }
            }
            if (props.type === 'FIVETUBES') {
              for (const item of componentData.form.taskFiveTubeDataList) {
                if (!item.ten || !item.one || !item.zeroPointOne) {
                  proxy.$warningToast('请填写检验表格必填数据')
                  return
                }
              }
            }
            updateFormSubmitFn(str)
          }
        })
      } else {
        if (props.type === 'CULTIVATE' && !componentData.form.inspectDate) {
          proxy.$warningToast('请选择检验日期')
          return
        }
        updateFormSubmitFn(str)
      }
    }
    // 提交表单
    const updateFormSubmitFn = async (str) => {
      if (props.type === 'CALCULATE') {
        componentData.form.taskStatus = str
        const data = JSON.parse(JSON.stringify(componentData.form))
        data.inspectMan = data.inspectMan.join(',')
        data.countMan = data.countMan?.join(',')
        data.inspectResult = data.taskCultureDataList[0].inspectResult
        data.cultureUnit = data.taskCultureDataList[0].cultureUnit
        data.cultureRemark = data.taskCultureDataList[0].cultureRemark
        await MICROBE_INSPECT_COUNT_DIALOG_SAVED(data)
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
    // 计数 计算平均值
    const keyChange = (row) => {
      row.average = ((Number(row.countOne) + Number(row.countTwo)) / 2).toFixed(2)
    }
    // 结果联动判定
    const resultChange = (row) => {
      if (Number(row.inspectResult) > componentData.standard.indexDown && Number(row.inspectResult) < componentData.standard.indexUp) {
        componentData.form.judgeResult = 'Y'
      } else {
        componentData.form.judgeResult = 'N'
      }
    }
    // 预览完成
    const previewFormSubmitFn = async () => {
      if (props.previewDialog === 'FIVETUBES') {
        await MICROBE_INSPECT_FIVE_DIALOG_PREVIEW_SAVED(componentData.previewData)
      }
      if (props.previewDialog === 'CALCULATE') {
        await MICROBE_INSPECT_COUNT_DIALOG_PREVIEW_SAVED(componentData.previewData)
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
      rules,
      init,
      previewInit,
      objectSpanMethod,
      countSpanMethod,
      countPreviewSpanMethod,
      fivePreviewSpanMethod,
      updateFormSubmit,
      keyChange,
      resultChange,
      previewFormSubmitFn
    }
  }
})
</script>

<style lang="scss" scoped>
.inspect__form{
  background: white;
  padding-top: 10px;
  &__header{
    line-height: 32px;
    font-size: 20px;
    &__img{
      margin-left: 20px;
      height: 32px;
      margin-right: 10px;
    }
  }
  &__header--left{
    img{
      float: left;
    }
    span{
      display: block;
      line-height: 32px;
      text-align: center;
    }
  }
  &__header--center{
    display: flex;
    justify-content: center;
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
