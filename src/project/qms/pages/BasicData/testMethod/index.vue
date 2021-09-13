<template>
  <mds-card class="test_method" title="检验方法" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="float: right;display: flex;">
        <el-input size="small" style="margin-bottom:10px; width:200px; height:35px;margin-right:10px"  v-model="plantList.inspectMethodCodeOrName" placeholder="检验方法编码/名称" @keyup.enter="getList" />
        <div style="float: right;">
          <el-button icon="el-icon-search" size="small" class="topic-button" @click="getList">查询</el-button>
          <el-button icon="el-icon-plus" type="primary" class="topic-button" @click="addData" size="small">新增</el-button>
          <el-button icon="el-icon-delete" type="danger" class="topic-button" size="small" @click="selectDelete">批量删除</el-button>
        </div>
      </div>
    </template>
    <el-table ref="multipleTable" border :cell-style="{'text-align':'center'}" :data="materialData.slice((currPage - 1) * pageSize, currPage * pageSize)" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" />
      <el-table-column type="index" label="序号" :index="(index) => index + 1 + (currPage - 1) * pageSize" width="55" />
      <el-table-column label="编码" prop="inspectMethodCode" />
      <el-table-column label="检验方法" prop="inspectMethodName" />
      <el-table-column label="属性" prop="inspectPropertyName" />
      <el-table-column label="操作" width="80" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="iconfont factory-luru" class="role__btn" @click="editItem(scope.row)">
            <em>编辑</em>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="float: right">
      <el-pagination
        :page-size="pageSize"
        :current-page="currPage"
        :total="totalCount"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="val => pageSize = val"
        @current-change="val => currPage = val"
      />
    </el-row>
  </mds-card>
  <el-dialog v-model="addMethodBtn" title="检验方法" width="30%">
      <el-form ref="addRef" :model="addMethodInfo" :rules="dataRule">
        <el-form-item v-if="addMethodInfo.id" label="编码：" :label-width="formLabelWidth">
          <el-input v-model="addMethodInfo.inspectMethodCode" class="inputWidth" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="检验方法：" prop="inspectMethodName" :label-width="formLabelWidth">
          <el-input v-model="addMethodInfo.inspectMethodName" maxlength="20" class="inputWidth" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性：" prop="inspectProperty" :label-width="formLabelWidth">
          <el-select v-model="addMethodInfo.inspectProperty" class="inputWidth" placeholder="请选择" @change="val => addMethodInfo.inspectPropertyName = inspectProperty.find(it => it.dictCode === val).dictValue">
            <el-option v-for="item in inspectProperty" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
          </el-select>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button size="small" class="topic-button" icon="el-icon-circle-close" @click="addMethodBtn = false">取消</el-button>
        <el-button size="small" class="topic-button" icon="el-icon-circle-check" type="primary" @click="addMethodSave">确定</el-button>
      </span>
    </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, onMounted, ComponentInternalInstance, getCurrentInstance, nextTick
} from 'vue'
import MdsCard from '@/components/package/mds-card/src/mds-card.vue'
import {
  TEST_METHOD_LIST_API,
  TEST_METHOD_ADD_API,
  TEST_METHOD_DEL_API,
  TEST_METHOD_UPDATE_API,
  DICT_DROPDOWN,
  Dict
} from '@/api/api'

interface TargetInfo {
  id: string; // 主键
  inspectMethodCode: string; // "编码":
  inspectMethodName: string; // 检验方法
  inspectProperty: string; // 检验组
  inspectPropertyName: string; // 检验组
}

export default defineComponent({
  name: 'testMethod',
  components: {
    MdsCard
  },

  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance

    const proxy = ctx.proxy as any
    // 变量
    const addRef = ref()
    const currPage = ref(1)
    const pageSize = ref(10)
    const totalCount = ref(1)
    const plantList = reactive({
      inspectMethodCodeOrName: ''
    })
    const multipleSelection = ref<string[]>([])
    const formLabelWidth = ref('100px')
    const addMethodBtn = ref(false)
    const materialData = ref<TargetInfo[]>([])
    const inspectProperty = ref<Dict[]>([])
    const dataRule = {
      inspectMethodCode: [
        {
          required: true,
          message: '编码自动带出',
          trigger: 'blur'
        }
      ],
      inspectMethodName: [
        {
          required: true,
          message: '请输入检验方法',
          trigger: 'blur'
        }
      ],
      inspectProperty: [
        {
          required: true,
          message: '请输入检验组',
          trigger: 'blur'
        }
      ]
    }
    const props = { multiple: true }
    const addMethodInfo = ref<TargetInfo>({
      id: '',
      inspectMethodCode: '', // "编码":
      inspectMethodName: '', // 检验方法
      inspectProperty: '', // 检验组
      inspectPropertyName: '' // 检验组
    })

    // 函数

    // 获取检验方法列表数据
    const getList = async () => {
      const res = await TEST_METHOD_LIST_API(plantList)
      materialData.value = res.data.data
      totalCount.value = res.data.data.length
    }
    // [BTN:编辑] 编辑数据集 item
    const editItem = async (row: TargetInfo) => {
      addMethodBtn.value = true
      await nextTick()
      addRef.value.resetFields()
      addMethodInfo.value = { ...row }
    }
    // 复选选择
    const handleSelectionChange = (val: TargetInfo[]) => {
      multipleSelection.value = val.map((item: TargetInfo) => item.id)
    }
    // 批量删除
    const selectDelete = () => {
      if (!multipleSelection.value.length) {
        proxy.$warningToast('请选择数据')
        return
      }
      proxy.$confirm('是否删除此检验方法，请确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await TEST_METHOD_DEL_API(multipleSelection.value)
        proxy.$successToast('操作成功')
        await getList()
      })
    }
    // 新增弹窗
    const addData = async () => {
      addMethodBtn.value = true
      await nextTick()
      addRef.value.resetFields()
      // let code = materialData.value.reduce((previousValue: number, currentValue: TargetInfo) => {
      //   const currentCode = Number(currentValue.inspectMethodCode.replace(/M/g, ''))
      //   return previousValue < currentCode ? currentCode : previousValue
      // }, 0)
      // code++
      addMethodInfo.value = {
        id: '',
        // inspectMethodCode: `M${code < 10 ? '0' + code : code}`,
        inspectMethodCode: '',
        inspectMethodName: '',
        inspectPropertyName: '',
        inspectProperty: ''
      }
    }
    // 新增检验方法 -保存
    const addMethodSave = () => {
      addRef.value.validate(async (valid: boolean) => {
        if (valid) {
          if (addMethodInfo.value.id) {
            await TEST_METHOD_UPDATE_API(addMethodInfo.value)
          } else {
            await TEST_METHOD_ADD_API(addMethodInfo.value)
          }
          proxy.$successToast('操作成功')
          addMethodBtn.value = false
          await getList()
        }
      })
    }

    onMounted(async () => {
      getList()
      const res = await DICT_DROPDOWN({ dictType: 'inspect_property' })
      inspectProperty.value = res.data.data
    })

    return {
      inspectProperty,
      addRef,
      currPage,
      pageSize,
      totalCount,
      plantList,
      materialData,
      editItem,
      addData,
      handleSelectionChange,
      multipleSelection,
      addMethodBtn,
      addMethodInfo,
      dataRule,
      formLabelWidth,
      addMethodSave,
      props,
      selectDelete,
      getList
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  min-height: calc(100vh - 117px);
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
.el-form /deep/.inputWidth {
  width: 100%;
}
</style>
