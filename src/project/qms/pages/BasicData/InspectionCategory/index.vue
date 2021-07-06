<template>
  <div>
    <tree-page :treeData="treeData" title="检验类别" leftTitle="检验类别" rightTitle="类别详情" :treeProps="{ label: 'name' }">
      <template #context--menu>
        <li class="addLevel" @click="addSameLevel">新增同级</li>
        <li class="addLevel" @click="addSubordinate">新增下级</li>
      </template>
      <template #view>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="类别编码：" prop="name">
                <el-input :disabled="isRedact" v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类别名称：" prop="name">
                <el-input :disabled="isRedact" v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级类别：" prop="name">
                <el-input :disabled="isRedact" v-model="ruleForm.name"></el-input>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关联组织：">
                <el-input :disabled="isRedact" v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="取样单位：">
                <el-input :disabled="isRedact" v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="配合取样：">
                <el-input :disabled="isRedact" v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="留样数据：">
                <el-input :disabled="isRedact" v-model="ruleForm.desc"></el-input>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手动执行：" prop="name">
                <el-radio-group :disabled="isRedact" v-model="addLevelInfo.name">
                  <el-radio label="允许"></el-radio>
                  <el-radio label="不允许"></el-radio>
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
          <el-input v-model="addLevelInfo.name" class="inputWidth" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别名称：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.name" class="inputWidth" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级组织：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addLevelInfo.name" class="inputWidth" placeholder="来料检验" autocomplete="off"></el-input>
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
          <el-input v-model="addLevelInfo.name" class="inputWidth" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手动执行：" prop="name" :label-width="formLabelWidth">
          <el-radio-group v-model="addLevelInfo.name">
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
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "InspectionCategory",
  setup() {
    const treeData = ref([
      {
        id: 1,
        name: "sb",
        children: [{ id: 1, name: "yyds" }],
      },
    ]);

    return {
      treeData,
    };
  },
  data() {
    return {
      addLevelBtn: false,
      addLevelInfo: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
      props: { multiple: true },
      options: [
        {
          value: 1,
          label: "东南",
          children: [
            {
              value: 2,
              label: "上海",
              children: [
                { value: 3, label: "普陀" },
                { value: 4, label: "黄埔" },
                { value: 5, label: "徐汇" },
              ],
            },
            {
              value: 7,
              label: "江苏",
              children: [
                { value: 8, label: "南京" },
                { value: 9, label: "苏州" },
                { value: 10, label: "无锡" },
              ],
            },
            {
              value: 12,
              label: "浙江",
              children: [
                { value: 13, label: "杭州" },
                { value: 14, label: "宁波" },
                { value: 15, label: "嘉兴" },
              ],
            },
          ],
        },
        {
          value: 17,
          label: "西北",
          children: [
            {
              value: 18,
              label: "陕西",
              children: [
                { value: 19, label: "西安" },
                { value: 20, label: "延安" },
              ],
            },
            {
              value: 21,
              label: "新疆维吾尔族自治区",
              children: [
                { value: 22, label: "乌鲁木齐" },
                { value: 23, label: "克拉玛依" },
              ],
            },
          ],
        },
      ],
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      isRedact: true,
    };
  },

  methods: {
    /*
      新增同级
    */
    addSameLevel() {
      console.log("???1?");
      this.addLevelBtn = true;
    },
    /*
      新增下级
    */
    addSubordinate() {
      console.log("???2?");
      this.addLevelBtn = true;
    },
    /*
      新增弹窗关闭
    */
    handleClose() {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //   })
      //   .catch(_ => {});
      this.addLevelBtn = false;
    },
    /*
      新增弹窗保存
    */
    addLevelSave() {},
    resetForm() {
      // this.$refs[formName].resetFields();
    },
    //编辑保存
    editSave() {
      this.isRedact = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.addLevel {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 17px;
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
