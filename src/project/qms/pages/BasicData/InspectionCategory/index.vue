<template>
  <div>
    <tree-page
      ref="treePage"
      :treeData="treeData"
      title="检验类别"
      leftTitle="检验类别"
      rightTitle="类别详情"
      :treeProps="{ label: 'inspectTypeName', children: 'children' }"
      @treeNodeClick="getDetail"
      @treeNodeContextMenu="contextmenu"
    >
      <template #context--menu>
        <li class="contextMenu" @click="addSameLevel">新增同级</li>
        <li class="contextMenu" @click="addSubordinate">新增下级</li>
      </template>
      <template #view>
        <el-form ref="detailRef" :model="detailInfo" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="类别编码：" prop="inspectTypeCode">
                <el-input :disabled="true" v-model="detailInfo.inspectTypeCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类别名称：" prop="inspectTypeName">
                <el-input :disabled="isRedact" v-model="detailInfo.inspectTypeName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级类别：" prop="parentId">
                <el-input :disabled="true" v-model="detailInfo.parentName"></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="detailInfo.parentId === '0'" :span="12">
              <el-form-item label="生产辅助：" prop="assistFlag" :label-width="formLabelWidth">
                <el-radio-group v-model="detailInfo.assistFlag" :disabled="isRedact">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关联组织：">
                <tree-dialog
                  ref="detailRelationRef"
                  v-model="detailInfo.relation"
                  :tree-data="options"
                  :disabled="isRedact"
                  :leafOnly="false"
                  :checkStrictly="true"
                  :placeholder="isRedact?' ': '请选择'"
                  :tree-props="{ label: 'deptName', children: 'children' }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="取样单位：">
                <tree-dialog
                  ref="detailCooperateRef"
                  v-model="detailInfo.cooperate"
                  :tree-data="options"
                  :disabled="isRedact"
                  :leafOnly="false"
                  :checkStrictly="true"
                  :placeholder="isRedact?' ': '请选择'"
                  :tree-props="{ label: 'deptName', children: 'children' }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="配合取样：">
                <tree-dialog
                  ref="detailSampleRef"
                  v-model="detailInfo.sample"
                  :tree-data="options"
                  :disabled="isRedact"
                  :leafOnly="false"
                  :checkStrictly="true"
                  :placeholder="isRedact?' ': '请选择'"
                  :tree-props="{ label: 'deptName', children: 'children' }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="留样数量：">
                <el-input :disabled="isRedact" v-model="detailInfo.sampleAmount" maxlength='2' @input="e => detailInfo.sampleAmount = e.replace(/[^0-9]/gi, '')" :placeholder="isRedact?' ': '请输入'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手动执行：" prop="manualFlag">
                <el-radio-group :disabled="isRedact" v-model="detailInfo.manualFlag">
                  <el-radio label="Y">允许</el-radio>
                  <el-radio label="N">不允许</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-form-item style="width:100%">
              <div class="dialog-footer">
                <el-button v-if="isRedact" size="small" type="primary" icon="el-icon-edit" @click="isRedact= false">编辑</el-button>
                <!-- <div v-else> -->
                <el-button v-if="!isRedact" size="small" icon="el-icon-circle-close" @click="cancel">取消</el-button>
                <el-button v-if="!isRedact" size="small" type="danger" icon="el-icon-delete" @click="resetForm('ruleForm')">删除</el-button>
                <el-button v-if="!isRedact" size="small" type="primary" icon="el-icon-document-checked" @click="editSave">保存</el-button>
                <!-- </div> -->
              </div>
            </el-form-item>
          </el-row>
        </el-form>
      </template>
    </tree-page>
    <el-dialog v-model="addLevelBtn" title="检验类别-新增" width="50%">
      <el-form ref="addRef" :model="addLevelInfo" :rules="rules">
        <el-form-item label="类别编码：" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.inspectTypeCode" class="inputWidth" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别名称：" prop="inspectTypeName" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.inspectTypeName" class="inputWidth" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级类别：" prop="parentId" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.parentName" class="inputWidth" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="!level" label="生产辅助：" prop="assistFlag" :label-width="formLabelWidth">
          <el-radio-group v-model="addLevelInfo.assistFlag">
            <el-radio label="Y">是</el-radio>
            <el-radio label="N">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联组织：" :label-width="formLabelWidth">
          <tree-dialog
            ref="relationRef"
            v-model="addLevelInfo.relation"
            :tree-data="options"
            :leafOnly="false"
            :checkStrictly="true"
            :tree-props="{ label: 'deptName', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="取样单位：" :label-width="formLabelWidth">
          <tree-dialog
            ref="cooperateRef"
            v-model="addLevelInfo.cooperate"
            :tree-data="options"
            :leafOnly="false"
            :checkStrictly="true"
            :tree-props="{ label: 'deptName', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="配合取样：" :label-width="formLabelWidth">
          <tree-dialog
            ref="sampleRef"
            v-model="addLevelInfo.sample"
            :tree-data="options"
            :leafOnly="false"
            :checkStrictly="true"
            :tree-props="{ label: 'deptName', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="留样数量：" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.sampleAmount" maxlength='2' @input="e => addLevelInfo.sampleAmount = e.replace(/[^0-9]/gi, '')" placeholder="请输入" class="inputWidth" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手动执行：" prop="manualFlag" :label-width="formLabelWidth">
          <el-radio-group v-model="addLevelInfo.manualFlag">
            <el-radio label="Y">允许</el-radio>
            <el-radio label="N">不允许</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button size="small" icon="el-icon-circle-close" @click="addLevelBtn = false">取 消</el-button>
        <el-button size="small" icon="el-icon-circle-check" type="primary" @click="addLevelSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, onMounted, ComponentInternalInstance, getCurrentInstance, nextTick, onDeactivated
} from 'vue'
import { treeDataTranslate } from '@/utils/index'
import {
  INSPECT_TYPE_LIST_API,
  INSPECT_TYPE_DETAIL_API,
  INSPECT_TYPE_ADD_API,
  INSPECT_TYPE_UPDATE_API,
  ORG_TREE_API,
  INSPECT_TYPE_DEL_API,
  INSPECT_TYPE_MATERIAL_API
} from '@/api/api'

interface AddLevelInfo {
  id: string; // 主键
  assistFlag?: string; // "上级类别":
  parentId?: string; // "上级类别":
  parentName?: string; // "上级类别":
  inspectTypeName?: string; // 类别名称
  inspectTypeCode?: string; // 类别编码
  sampleAmount?: string; // 留样数量
  manualFlag?: string; // 手动执行
  relation?: any[]; // 关联组织列表;
  sample?: any[]; // 配合取样;
  cooperate?: any[]; // 取样单位
}
interface TreeData {
  id: string; // 主键
  assistFlag?: string; // "上级类别":
  parentId?: string; // "上级类别":
  parentName?: string; // "上级类别":
  inspectTypeName?: string; // 类别名称
  inspectTypeCode: string; // 类别名称
}

export default defineComponent({
  name: 'InspectionCategory',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance

    const proxy = ctx.proxy as any

    const treePage = ref()
    const addRef = ref()
    const detailRef = ref()
    const relationRef = ref()
    const sampleRef = ref()
    const cooperateRef = ref()
    const detailRelationRef = ref()
    const detailSampleRef = ref()
    const detailCooperateRef = ref()
    const level = ref(false)
    const addLevelBtn = ref(false)
    const isRedact = ref(true)
    const props = ref({ emitPath: false, multiple: true, value: 'id', label: 'deptName', children: 'children' })

    const treeData = ref<TreeData[]>([])
    let treeDataOrg:TreeData[] = []
    const options = ref([])

    const addLevelInfo = reactive<AddLevelInfo>({ id: '', relation: [] })
    const detailInfo = ref<AddLevelInfo>({
      id: '',
      parentId: '',
      parentName: '',
      inspectTypeName: '',
      inspectTypeCode: '',
      sampleAmount: '',
      manualFlag: '',
      relation: [],
      sample: [],
      cooperate: []
    })
    let temp:TreeData
    let detail:TreeData
    const formLabelWidth = '120px'
    const rules = {
      parentId: [
        { required: true, message: '请输入上级类别', trigger: 'blur' }
      ],
      inspectTypeName: [
        { required: true, message: '请输入类别名称', trigger: 'blur' }
      ],
      inspectTypeCode: [
        { required: true, message: '请输入类别编码', trigger: 'blur' }
      ],
      manualFlag: [
        { required: true, message: '请选择是否手动执行', trigger: 'change' }
      ]
    }

    // 逻辑函数
    // 列表变树结构
    const setTreeData = async (id = '') => {
      console.log(id)
      const res = await INSPECT_TYPE_LIST_API()
      treeDataOrg = res.data.data
      treeData.value = treeDataTranslate(res.data.data, 'id', 'parentId')
      id ? treePage.value.focusCurrentNodeNumber = id : treePage.value.focusCurrentNodeNumber = treeData.value[0].id
      id ? getDetail({ id, inspectTypeCode: '' }) : getDetail(treeData.value[0])
    }
    // 下拉框数据变换
    const setOrGetData = (data: any, type = 'get') => {
      if (type === 'get') {
        return data.getCheckedNodes(true).map((it: any) => { return { deptName: it.deptName, deptId: it.id } })
      } else {
        return data.map((it: any) => it.deptId)
      }
    }
    const cancel = () => {
      isRedact.value = true
      getDetail(detail)
    }
    // 树点击获取详情
    const getDetail = async (row:TreeData) => {
      detail = row
      const res = await INSPECT_TYPE_DETAIL_API({ id: row.id })
      detailInfo.value = res.data.data
      detailInfo.value.relation = setOrGetData(detailInfo.value.relation, 'set')
      detailInfo.value.sample = setOrGetData(detailInfo.value.sample, 'set')
      detailInfo.value.cooperate = setOrGetData(detailInfo.value.cooperate, 'set')
    }
    // 树右击
    const contextmenu = (row: TreeData) => {
      temp = row
      row.parentId === '0' ? level.value = false : level.value = true
    }
    // 生成编码
    const generateCode = (startCode: string) => {
      let code = ''
      let endCode = 0
      const reg = new RegExp(`^(${startCode})(\\d{2})`)
      treeDataOrg.forEach((it: TreeData) => {
        if (reg.test(it.inspectTypeCode)) {
          if (endCode < Number(RegExp.$2)) {
            endCode = Number(RegExp.$2)
          }
        }
      })
      console.log(endCode)
      if (endCode + 1 < 10) {
        code = `${startCode}0${endCode + 1}`
      } else {
        code = `${startCode}${endCode + 1}`
      }
      addLevelInfo.inspectTypeCode = code
    }
    // 新增同级
    const addSameLevel = async () => {
      addLevelBtn.value = true
      await nextTick()
      addRef.value.resetFields()
      clearForm()
      // generateCode(temp.inspectTypeCode.slice(0, temp.inspectTypeCode.length - 2))
      // addLevelInfo.assistFlag = temp.assistFlag
      if (!level.value) {
        addLevelInfo.assistFlag = 'N'
      } else {
        addLevelInfo.assistFlag = temp.assistFlag
      }
      addLevelInfo.parentId = temp.parentId
      addLevelInfo.parentName = temp.parentName
    }
    const clearForm = () => {
      addLevelInfo.inspectTypeCode = ''
      addLevelInfo.relation = []
      addLevelInfo.sample = []
      addLevelInfo.cooperate = []
      addLevelInfo.manualFlag = 'Y'
      addLevelInfo.sampleAmount = ''
      addLevelInfo.inspectTypeName = ''
    }
    // 新增下级
    const addSubordinate = async () => {
      if (treeDataOrg.filter(it => it.parentId === temp.id).length === 0) {
        const res = await INSPECT_TYPE_MATERIAL_API({ inspectTypeId: temp.id })
        if (res.data.data !== 0) {
          proxy.$warningToast('已分配物料')
          return false
        }
      }
      addLevelBtn.value = true
      level.value = true
      await nextTick()
      addRef.value.resetFields()
      clearForm()
      // generateCode(temp.inspectTypeCode)
      addLevelInfo.assistFlag = temp.assistFlag
      addLevelInfo.parentId = temp.id
      addLevelInfo.parentName = temp.inspectTypeName
    }
    // 新增弹窗保存
    const addLevelSave = () => {
      addRef.value.validate(async (valid: boolean) => {
        if (valid) {
          addLevelInfo.relation = setOrGetData(relationRef.value)
          addLevelInfo.sample = setOrGetData(sampleRef.value)
          addLevelInfo.cooperate = setOrGetData(cooperateRef.value)
          const res = await INSPECT_TYPE_ADD_API(addLevelInfo)
          proxy.$successToast('操作成功')
          addLevelBtn.value = false
          setTreeData(res.data.msg)
        }
      })
    }
    // 删除
    const resetForm = async () => {
      proxy.$confirm('是否删除此检验类，请确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await INSPECT_TYPE_DEL_API({ id: detailInfo.value.id })
        proxy.$successToast('操作成功')
        isRedact.value = true
        detailInfo.value = {
          id: '',
          parentId: '',
          parentName: '',
          inspectTypeName: '',
          inspectTypeCode: '',
          sampleAmount: '',
          manualFlag: '',
          relation: [],
          sample: [],
          cooperate: []
        }
        setTreeData()
      })
    }
    // 编辑保存
    const editSave = () => {
      detailRef.value.validate(async (valid: boolean) => {
        if (valid) {
          detailInfo.value.relation = setOrGetData(detailRelationRef.value)
          detailInfo.value.sample = setOrGetData(detailSampleRef.value)
          detailInfo.value.cooperate = setOrGetData(detailCooperateRef.value)
          await INSPECT_TYPE_UPDATE_API(detailInfo.value)
          proxy.$successToast('操作成功')
          isRedact.value = true
          await setTreeData(detail.id)
        }
      })
    }
    // 去掉children
    const cascaderTranslate = (data: any) => {
      data.forEach((item: any) => {
        if (item.children.length) {
          cascaderTranslate(item.children)
        } else {
          delete item.children
        }
      })
    }
    // 获取组织架构
    const getOrg = async () => {
      const res = await ORG_TREE_API({ factory: JSON.parse(sessionStorage.getItem('system') || '{}').id || '' })
      cascaderTranslate(res.data.data)
      options.value = res.data.data
    }
    onMounted(() => {
      setTreeData()
      getOrg()
    })
    onDeactivated(() => {
      if (!isRedact.value) {
        proxy.$warningToast('请注意保存数据后跳转')
      }
    })
    return {
      treePage,
      level,
      addRef,
      detailRef,
      relationRef,
      sampleRef,
      cooperateRef,
      detailRelationRef,
      detailSampleRef,
      detailCooperateRef,
      treeData,
      addLevelBtn,
      addLevelInfo,
      formLabelWidth,
      rules,
      props,
      options,
      detailInfo,
      isRedact,
      cancel,
      contextmenu,
      getDetail,
      addSameLevel,
      addSubordinate,
      addLevelSave,
      resetForm,
      editSave
    }
  }
})
</script>

<style lang="scss" scoped>
.contextMenu {
  list-style: none;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 28px;
}
.addLevel:hover {
  color: #487bff;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.el-form /deep/.inputWidth {
  width: 100%;
}
</style>
