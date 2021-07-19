<template>
  <div>
    <tree-page
      :treeData="treeData"
      title="检验类别"
      leftTitle="检验类别"
      rightTitle="类别详情"
      :treeProps="{ label: 'name' }"
      @treeNodeClick="getDetail"
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
                <el-input :disabled="isRedact" v-model="detailInfo.inspectTypeCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类别名称：" prop="inspectTypeName">
                <el-input :disabled="isRedact" v-model="detailInfo.inspectTypeName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级类别：" prop="parentId">
                <el-input :disabled="isRedact" v-model="detailInfo.parentId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关联组织：">
                <el-cascader :show-all-levels="false" :options="options" :disabled="isRedact" :props="props" v-model="detailInfo.relation" clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="取样单位：">
                <el-cascader :show-all-levels="false" :options="options" :disabled="isRedact" :props="props" v-model="detailInfo.cooperate" clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="配合取样：">
                <el-cascader :options="options" :disabled="isRedact" :props="props" v-model="detailInfo.sample" clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="留样数据：">
                <el-input :disabled="isRedact" v-model="detailInfo.sampleAmount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手动执行：" prop="manualFlag">
                <el-radio-group :disabled="isRedact" v-model="addLevelInfo.manualFlag">
                  <el-radio label="允许" v-model="addLevelInfo.manualFlag"></el-radio>
                  <el-radio label="不允许" v-model="addLevelInfo.manualFlag"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-form-item style="width:100%">
              <div class="dialog-footer">
                <el-button v-if="isRedact" size="small" type="primary" icon="el-icon-edit" @click="isRedact= false">编辑</el-button>
                <!-- <div v-else> -->
                <el-button v-if="!isRedact" size="small" icon="el-icon-circle-close" @click="isRedact= true">取消</el-button>
                <el-button v-if="!isRedact" size="small" type="danger" icon="el-icon-delete" @click="resetForm('ruleForm')">删除</el-button>
                <el-button v-if="!isRedact" size="small" type="primary" icon="el-icon-document-checked" @click="editSave">保存</el-button>
                <!-- </div> -->
              </div>
            </el-form-item>
          </el-row>
        </el-form>
      </template>
    </tree-page>
    <el-dialog v-model="addLevelBtn" title="检验类别-新增" width="30%" :before-close="handleClose">
      <el-form :model="addLevelInfo" :rules="rules">
        <el-form-item label="类别编码：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.inspectTypeCode" class="inputWidth" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别名称：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.inspectTypeName" class="inputWidth" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级类别：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.parentId" class="inputWidth" :disabled="true" placeholder="来料检验" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关联组织：" :label-width="formLabelWidth">
          <el-cascader v-model="addLevelInfo.relation" :show-all-levels="false" :options="options" class="inputWidth" :props="props" collapse-tags clearable @change="setCascader"></el-cascader>
        </el-form-item>
        <el-form-item label="取样单位：" :label-width="formLabelWidth">
          <el-cascader :show-all-levels="false" :options="options" class="inputWidth" :props="props" collapse-tags clearable></el-cascader>
        </el-form-item>
        <el-form-item label="配合取样：" :label-width="formLabelWidth">
          <el-cascader :show-all-levels="false" :options="options" class="inputWidth" :props="props" collapse-tags clearable></el-cascader>
        </el-form-item>
        <el-form-item label="留样数量：" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.sampleAmount" class="inputWidth" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手动执行：" prop="manualFlag" :label-width="formLabelWidth">
          <el-radio-group v-model="addLevelInfo.manualFlag">
            <el-radio label="允许"></el-radio>
            <el-radio label="不允许"></el-radio>
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
import { defineComponent, ref, reactive, nextTick, onMounted, ComponentInternalInstance, getCurrentInstance } from 'vue'
import { treeDataTranslate } from '@/utils/index'
import { INSPECT_TYPE_LIST_API, INSPECT_TYPE_DETAIL_API, INSPECT_TYPE_ADD_API, ORG_TREE_API } from '@/api/api'

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
}

export default defineComponent({
  name: 'InspectionCategory',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance

    const proxy = ctx.proxy as any
    const treeData = ref<TreeData[]>([])
    const addLevelBtn = ref(false)
    const addLevelInfo = reactive<AddLevelInfo>({ id: '', relation: [] })
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
    const props = ref({ multiple: true, value: 'id', label: 'deptName', children: 'children' })
    const options = ref([])
    const detailInfo = ref<AddLevelInfo>({
      id: '1', // 主键
      parentId: '来料检验', // "上级类别":
      inspectTypeName: '豆渣', // 类别名称
      inspectTypeCode: '1021202', // 类别编码
      sampleAmount: '11', // 留样数量
      manualFlag: '允许', // 手动执行
      relation: [], // 关联组织列表;
      sample: [], // 配合取样;
      cooperate: [] // 取样单位
    })
    const isRedact = ref(true)

    // 逻辑函数
    // 列表变树结构
    const setTreeData = async () => {
      const res = await INSPECT_TYPE_LIST_API()
      console.log(res.data.data)
      const treeD = [
        { id: 1, name: 'qqqq', parentId: '0' },
        { id: 2, name: 'qqqq1', parentId: '0' },
        { id: 3, name: 'qqqq2', parentId: '0' },
        { id: 4, name: 'wwww1', parentId: '1' },
        { id: 5, name: 'wwww2', parentId: '1' },
        { id: 6, name: 'wwww3', parentId: '2' },
        { id: 7, name: 'wwww4', parentId: '2' },
        { id: 8, name: 'wwww5', parentId: '2' },
        { id: 9, name: 'eeee', parentId: '3' }
      ]
      treeData.value = treeDataTranslate(treeD, 'id', 'parentId')
      // treeData.value = treeDataTranslate(res.data.data, 'id', 'parentId')
    }
    const getDetail = async (row:TreeData) => {
      const res = await INSPECT_TYPE_DETAIL_API({ id: row.id })
      console.log(res)
    }
    /*
      新增同级
    */
    const addSameLevel = () => {
      addLevelBtn.value = true
    }
    /*
      新增下级
    */
    const addSubordinate = () => {
      addLevelBtn.value = true
    }
    /*
      新增弹窗关闭
    */
    const handleClose = () => {
      proxy.$confirm('确认关闭新增弹窗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addLevelBtn.value = false
      })
        .catch(() => {
          //
        })
    }
    /*
      新增弹窗保存
    */
    const addLevelSave = () => {
      proxy.$confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log(addLevelInfo.relation)
        // await INSPECT_TYPE_ADD_API(addLevelInfo.value)
      })
    }
    const resetForm = () => {
      // this.$refs[formName].resetFields();
    }
    // 编辑保存
    const editSave = () => {
      isRedact.value = true
    }

    const setCascader = (e: any) => {
      console.log(e)
    }

    const cascaderTranslate = (data: any) => {
      data.forEach((item: any) => {
        if (item.children.length) {
          cascaderTranslate(item.children)
        } else {
          delete item.children
        }
      })
    }

    onMounted(async () => {
      setTreeData()
      const res = await ORG_TREE_API({ factory: JSON.parse(sessionStorage.getItem('system') || '{}').id || '' })
      cascaderTranslate(res.data.data)
      options.value = res.data.data
    })
    return {
      treeData,
      addLevelBtn,
      addLevelInfo,
      formLabelWidth,
      rules,
      props,
      options,
      detailInfo,
      isRedact,
      setCascader,
      getDetail,
      addSameLevel,
      addSubordinate,
      handleClose,
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
.inputWidth {
  width: 200px;
}
</style>
