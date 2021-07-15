<template>
  <div class="header_main">
    <mds-card title="检验方法" :pack-up="false" style="margin-bottom: 0; background: #fff;">
      <template #titleBtn>
        <div style="float: right;display: flex;">
          <el-form ref="pstngDate" :model="plantList" size="small" :inline="true" label-position="right" label-width="82px" class="topforms" style=" float: left;">
            <el-form-item label="" prop="pstngDate">
              <el-input suffix-icon="el-icon-search" v-model="plantList.material" placeholder="物料" style="width: 160px;" />
            </el-form-item>
          </el-form>
          <div style="float: right;">
            <el-button icon="el-icon-search" size="small" @click="getList">查询</el-button>
            <el-button icon="el-icon-circle-check" type="primary" @click="addMethodBtn = true" size="small">新增</el-button>
            <el-button icon="el-icon-delete" type="danger" size="small" @click="selectDelete">批量删除</el-button>
          </div>
        </div>
      </template>
      <el-table ref="multipleTable" :cell-style="{'text-align':'center'}" :data="materialData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column label="编码">
          <template #default="scope">{{ scope.row.inspectMethodCode }}</template>
        </el-table-column>
        <el-table-column prop="inspectMethodName" label="检验方法">
        </el-table-column>
        <el-table-column prop="inspectProperty" label="检验类">
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="text" icon="el-icon-edit" class="role__btn" @click="editItem(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </mds-card>
    <el-dialog v-model="addMethodBtn" title="检验类别-新增" width="30%">
      <el-form :model="addMethodInfo" :rules="dataRule">
        <el-form-item label="编码：" prop="inspectMethodCode" :label-width="formLabelWidth">
          <el-input v-model="addMethodInfo.inspectMethodCode" class="inputWidth" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="检验方法：" prop="inspectMethodName" :label-width="formLabelWidth">
          <el-input v-model="addMethodInfo.inspectMethodName" class="inputWidth" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="校验组：" prop="inspectProperty" :label-width="formLabelWidth">
          <el-input v-model="addMethodInfo.inspectProperty" class="inputWidth" placeholder="来料检验" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button size="small" icon="el-icon-circle-close" @click="addMethodBtn = false">取 消</el-button>
        <el-button size="small" icon="el-icon-circle-check" type="primary" @click="addMethodSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted, ComponentInternalInstance, getCurrentInstance } from 'vue'
import MdsCard from '@/components/package/mds-card/src/mds-card.vue'
interface TargetInfoList {
  id?: string; // 主键
  inspectMethodCode: string; // "编码":
  inspectMethodName: string; // 检验方法
  inspectProperty: string; // 检验组
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
    const plantList = ref({
      material: ''
    })
    const multipleSelection = ref([])
    const formLabelWidth = ref('100px')
    const addMethodBtn = ref(false)
    const materialData = ref<TargetInfoList[]>([
      {
        id: '1', // 主键
        inspectMethodCode: '231131231', // "编码":
        inspectMethodName: '物管法', // 检验方法
        inspectProperty: '理化类' // 检验组
      },
      {
        id: '2', // 主键
        inspectMethodCode: '231131231444', // "编码":
        inspectMethodName: '物管法2', // 检验方法
        inspectProperty: '理化类2' // 检验组
      },
      {
        id: '3', // 主键
        inspectMethodCode: '2311312313423', // "编码":
        inspectMethodName: '物管法4', // 检验方法
        inspectProperty: '理化类4' // 检验组
      }
    ])
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
    const options = [
      {
        value: 1,
        label: '东南',
        children: [
          {
            value: 2,
            label: '上海',
            children: [
              { value: 3, label: '普陀' },
              { value: 4, label: '黄埔' },
              { value: 5, label: '徐汇' }
            ]
          },
          {
            value: 7,
            label: '江苏',
            children: [
              { value: 8, label: '南京' },
              { value: 9, label: '苏州' },
              { value: 10, label: '无锡' }
            ]
          },
          {
            value: 12,
            label: '浙江',
            children: [
              { value: 13, label: '杭州' },
              { value: 14, label: '宁波' },
              { value: 15, label: '嘉兴' }
            ]
          }
        ]
      },
      {
        value: 17,
        label: '西北',
        children: [
          {
            value: 18,
            label: '陕西',
            children: [
              { value: 19, label: '西安' },
              { value: 20, label: '延安' }
            ]
          },
          {
            value: 21,
            label: '新疆维吾尔族自治区',
            children: [
              { value: 22, label: '乌鲁木齐' },
              { value: 23, label: '克拉玛依' }
            ]
          }
        ]
      }
    ]
    const addMethodInfo = ref<TargetInfoList>({
      inspectMethodCode: '000111', // "编码":
      inspectMethodName: '滴定法', // 检验方法
      inspectProperty: '理化类' // 检验组
    })

    // 函数

    // 获取检验方法列表数据
    const getList = () => {
      console.log(plantList.value.material)
    }
    // [BTN:编辑] 编辑数据集 item
    const editItem = (obj: TargetInfoList) => {
      console.log(obj)
      addMethodBtn.value = true
    }
    const handleSelectionChange = (val: any) => {
      multipleSelection.value = val
    }
    // 新增检验方法 -保存
    const addMethodSave = (obj: TargetInfoList) => {
      proxy.$confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      //  1
      })
        .catch(() => {
          //
        })
    }
    // 批量删除
    const selectDelete = () => {
      console.log(multipleSelection) // 选中的列表数据
      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //  1
      })
        .catch(() => {
          //
        })
    }
    onMounted(() => {
      getList()
    })

    return {
      plantList,
      materialData,
      editItem,
      handleSelectionChange,
      multipleSelection,
      addMethodBtn,
      addMethodInfo,
      dataRule,
      formLabelWidth,
      addMethodSave,
      options,
      props,
      selectDelete,
      getList
    }
  }
})
</script>

<style lang="scss" scoped>
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
</style>
