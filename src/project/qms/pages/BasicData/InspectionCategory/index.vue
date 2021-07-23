<template>
  <div>
    <tree-page
      :treeData="treeData"
      title="检验类别"
      leftTitle="检验类别"
      rightTitle="类别详情"
      :treeProps="{ label: 'inspectTypeName' }"
      @treeNodeClick="getDetail"
      @treeNodeContextMenu="contextmenu"
    >
      <template #context--menu>
        <li class="addLevel" @click="addSameLevel">新增同级</li>
        <li class="addLevel" @click="addSubordinate">新增下级</li>
      </template>
      <template #view>
        <el-form :model="detailInfo" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
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
                <el-input :disabled="true" v-model="detailInfo.parentId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关联组织：">
                <el-cascader ref="detailRelationRef" :show-all-levels="false" :options="options" :disabled="isRedact" :props="props" v-model="detailInfo.relation" clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="取样单位：">
                <el-cascader ref="detailCooperateRef" :show-all-levels="false" :options="options" :disabled="isRedact" :props="props" v-model="detailInfo.cooperate" clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="配合取样：">
                <el-cascader ref="detailSampleRef" :options="options" :disabled="isRedact" :props="props" v-model="detailInfo.sample" clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="留样数据：">
                <el-input :disabled="isRedact" v-model="detailInfo.sampleAmount"></el-input>
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
                <el-button v-if="!isRedact" size="small" icon="el-icon-circle-close" @click="isRedact= true">取消</el-button>
                <el-button v-if="!isRedact" size="small" icon="el-icon-circle-close" @click="dayin">打印</el-button>
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
      <el-form :model="addLevelInfo" :rules="rules">
        <el-form-item label="类别编码：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.inspectTypeCode" class="inputWidth" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别名称：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.inspectTypeName" class="inputWidth" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级类别：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.parentId" class="inputWidth" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关联组织：" :label-width="formLabelWidth">
          <el-cascader ref="relationRef" v-model="addLevelInfo.relation" :show-all-levels="false" :options="options" class="inputWidth" :props="props" collapse-tags clearable></el-cascader>
        </el-form-item>
        <el-form-item label="取样单位：" :label-width="formLabelWidth">
          <el-cascader ref="sampleRef" v-model="addLevelInfo.sample" :show-all-levels="false" :options="options" class="inputWidth" :props="props" collapse-tags clearable></el-cascader>
        </el-form-item>
        <el-form-item label="配合取样：" :label-width="formLabelWidth">
          <el-cascader ref="cooperateRef" v-model="addLevelInfo.cooperate" :show-all-levels="false" :options="options" class="inputWidth" :props="props" collapse-tags clearable></el-cascader>
        </el-form-item>
        <el-form-item label="留样数量：" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.sampleAmount" class="inputWidth" autocomplete="off"></el-input>
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
import { defineComponent, ref, reactive, onMounted, ComponentInternalInstance, getCurrentInstance } from 'vue'
import { treeDataTranslate } from '@/utils/index'
import { INSPECT_TYPE_LIST_API, INSPECT_TYPE_DETAIL_API, INSPECT_TYPE_ADD_API, INSPECT_TYPE_UPDATE_API, ORG_TREE_API } from '@/api/api'

interface AddLevelInfo {
  id: string; // 主键
  parentId?: string; // "上级类别":
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
  parentId: string; // "上级类别":
  inspectTypeName: string; // 类别名称
  inspectTypeCode: string; // 类别名称
}

export default defineComponent({
  name: 'InspectionCategory',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance

    const proxy = ctx.proxy as any

    const relationRef = ref()
    const sampleRef = ref()
    const cooperateRef = ref()
    const detailRelationRef = ref()
    const detailSampleRef = ref()
    const detailCooperateRef = ref()
    const addLevelBtn = ref(false)
    const isRedact = ref(true)
    const props = ref({ emitPath: false, multiple: true, value: 'id', label: 'deptName', children: 'children' })

    const treeData = ref<TreeData[]>([])
    const options = ref([])
    const dayin = () => {
      window.print()
    }

    const addLevelInfo = reactive<AddLevelInfo>({ id: '', relation: [] })
    const detailInfo = ref<AddLevelInfo>({
      id: '1', // 主键
      parentId: '0', // "上级类别":
      inspectTypeName: '豆渣', // 类别名称
      inspectTypeCode: '1021202', // 类别编码
      sampleAmount: '11', // 留样数量
      manualFlag: '允许', // 手动执行
      relation: [], // 关联组织列表;
      sample: [], // 配合取样;
      cooperate: [] // 取样单位
    })
    let temp:TreeData
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
    const setTreeData = async () => {
      const res = await INSPECT_TYPE_LIST_API()
      treeData.value = treeDataTranslate(res.data.data, 'id', 'parentId')
    }
    const setOrGetData = (data: any, type = 'get') => {
      if (type === 'get') {
        return data.getCheckedNodes(true).map((it: any) => { return { deptName: it.data.deptName, deptId: it.data.id } })
      } else {
        return data.map((it: any) => it.deptId)
      }
    }
    const getDetail = async (row:TreeData) => {
      temp = row
      const res = await INSPECT_TYPE_DETAIL_API({ id: row.id })
      detailInfo.value = res.data.data
      detailInfo.value.relation = setOrGetData(detailInfo.value.relation, 'set')
      detailInfo.value.sample = setOrGetData(detailInfo.value.sample, 'set')
      detailInfo.value.cooperate = setOrGetData(detailInfo.value.cooperate, 'set')
    }
    const contextmenu = (row: TreeData) => {
      temp = row
    }
    const generateCode = () => {
      const a = temp.inspectTypeCode.slice(temp.inspectTypeCode.length - 2, temp.inspectTypeCode.length)
      console.log(a)
      addLevelInfo.inspectTypeCode = temp.inspectTypeCode.slice(0, temp.inspectTypeCode.length - 2) + Number()
      addLevelInfo.parentId = temp.parentId
    }
    // 新增同级
    const addSameLevel = () => {
      addLevelBtn.value = true
      generateCode()
    }
    // 新增下级
    const addSubordinate = () => {
      addLevelBtn.value = true
    }
    // 新增弹窗保存
    const addLevelSave = () => {
      proxy.$confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        addLevelInfo.relation = setOrGetData(relationRef.value)
        addLevelInfo.sample = setOrGetData(sampleRef.value)
        addLevelInfo.cooperate = setOrGetData(cooperateRef.value)
        await INSPECT_TYPE_ADD_API(addLevelInfo)
        proxy.$successToast('操作成功')
        addLevelBtn.value = false
        setTreeData()
      })
    }
    // 删除
    const resetForm = () => {
      // this.$refs[formName].resetFields();
      proxy.$successToast('操作成功')
      setTreeData()
    }
    // 编辑保存
    const editSave = async () => {
      detailInfo.value.relation = setOrGetData(detailRelationRef.value)
      detailInfo.value.sample = setOrGetData(detailSampleRef.value)
      detailInfo.value.cooperate = setOrGetData(detailCooperateRef.value)
      await INSPECT_TYPE_UPDATE_API(detailInfo.value)
      proxy.$successToast('操作成功')
      isRedact.value = true
      getDetail(temp)
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
    return {
      dayin,
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
.addLevel {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
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
