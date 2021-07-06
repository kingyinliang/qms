<template>
  <div class="header_main">
    <mds-card title="检验方法" :pack-up="false" style="margin-bottom: 0; background: #fff;">
      <template #titleBtn>
        <div style="float: right;display: flex;">
          <el-form ref="pstngDate" :model="plantList" size="small" :inline="true" label-position="right" label-width="82px" class="topforms" style=" float: left;">
            <el-form-item label="" prop="pstngDate">
              <el-input suffix-icon="el-icon-search" v-model="plantList.headerTxt" placeholder="物料" style="width: 160px;" />
            </el-form-item>
          </el-form>
          <div style="float: right;">
            <el-button icon="el-icon-search" size="small">查询</el-button>
            <el-button icon="el-icon-circle-check" type="primary" size="small">新增</el-button>
            <el-button icon="el-icon-delete" type="danger" size="small">批量删除</el-button>
          </div>
        </div>
      </template>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column label="编码">
          <template #default="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="检验方法">
        </el-table-column>
        <el-table-column prop="address" label="检验类">
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="scope">
            <el-button type="text" class="role__btn" @click="editItem(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </mds-card>
    <el-dialog v-model="addMethodBtn" title="检验类别-新增" width="30%" :before-close="addMethodBtn= false">
      <el-form :model="addMethodInfo" :rules="rules">
        <el-form-item label="类别编码：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addMethodInfo.name" class="inputWidth" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别名称：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addMethodInfo.name" class="inputWidth" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级组织：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addMethodInfo.name" class="inputWidth" placeholder="来料检验" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关联组织：" :label-width="formLabelWidth">
          <el-cascader :options="options" class="inputWidth" :props="props" collapse-tags clearable></el-cascader>
        </el-form-item>
        <el-form-item label="取样单位：" :label-width="formLabelWidth">
          <el-cascader :options="options" class="inputWidth" :props="props" collapse-tags clearable></el-cascader>
        </el-form-item>
        <el-form-item label="配合取样：" :label-width="formLabelWidth">
          <el-cascader :options="options" class="inputWidth" :props="props" collapse-tags clearable></el-cascader>
        </el-form-item>
        <el-form-item label="留样数量：" :label-width="formLabelWidth">
          <el-input v-model="addMethodInfo.name" class="inputWidth" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手动执行：" prop="name" :label-width="formLabelWidth">
          <el-radio-group v-model="addMethodInfo.name">
            <el-radio label="允许"></el-radio>
            <el-radio label="不允许"></el-radio>
          </el-radio-group>
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
import { defineComponent, ref } from "vue";
import MdsCard from "@/components/package/mds-card/src/mds-card.vue";
interface TargetInfoList {
  id: string;
  dictionaryCode: string;
  dictionaryOwner: string;
  propertyList: [];
  created: string;
  changed: string;
  changer: string;
  blueprint: boolean;
  standard: boolean;
  project: boolean;
  formula: boolean;
  task: boolean;
  isRedact: boolean;
}
interface AddInfo {
  id: string;
  dictionaryCode: string;
  dictionaryOwner: string;
  name: string;
}
export default defineComponent({
  name: "testMethod",
  components: {
    MdsCard,
  },

  setup() {
    //变量
    const plantList = ref({
      headerTxt: "",
    });
    const formLabelWidth = ref("120px");
    const addMethodBtn = ref(false);
    const tableData = ref<TargetInfoList[]>([]);
    const dataRule = {
      name: [
        {
          required: true,
          message: "部门编号不能为空",
          trigger: "blur",
        },
      ],
      deptName: [
        {
          required: true,
          message: "部门名称不能为空",
          trigger: "blur",
        },
      ],
      deptType: [
        {
          required: true,
          message: "部门类型不能为空",
          trigger: "blur",
        },
      ],
    };

    //函数
    // [BTN:编辑] 编辑数据集 item
    const editItem = (obj: TargetInfoList) => {
      //       console.log(obj)
      //       obj.isRedact = true
      //       obj.changed = dateFormat(new Date(), 'yyyy-MM-dd')
    };
    const handleSelectionChange = () => {};
    const addMethodInfo = (obj: AddInfo) => {
      //       console.log(obj)
      //       obj.isRedact = true
      //       obj.changed = dateFormat(new Date(), 'yyyy-MM-dd')
    };
    const addMethodSave = (obj: AddInfo) => {
      //       console.log(obj)
      //       obj.isRedact = true
      //       obj.changed = dateFormat(new Date(), 'yyyy-MM-dd')
    };

    return {
      plantList,
      tableData,
      editItem,
      handleSelectionChange,
      addMethodBtn,
      addMethodInfo,
      dataRule,
      formLabelWidth,
      addMethodSave,
    };
  },
});
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
</style>
