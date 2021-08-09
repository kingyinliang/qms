<template>
  <mds-card class="test_method" title="打印" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <el-table :data="printData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="编码" prop="code" />
      <el-table-column label="实验室名字" prop="deptName" />
      <el-table-column label="曲房名" prop="name" />
    </el-table>
    <div class="clearfix">
      <div style="line-height: 40px; float: right;margin-top: 10px">
        <el-radio-group v-model="module">
          <el-radio label="1">模板一（30*30）</el-radio>
          <el-radio label="2">模板二</el-radio>
          <el-radio label="3">模板三</el-radio>
        </el-radio-group>
        <el-button type="primary" style="margin-left: 20px" @click="print">打印</el-button>
      </div>
    </div>
  </mds-card>
  <div id="print_ele__moduleOne" class="none_ele">
    <div class="print_item" v-for="item in multipleSelection" :key="item.id">
      <p>{{ item.deptName }}</p>
      <p>{{ item.name }}</p>
      <p>{{ item.code }}</p>
    </div>
  </div>
  <div id="print_ele__moduleTwo" class="none_ele">
    <div class="print_item" v-for="item in multipleSelection" :key="item.id">
      <p>{{ item.deptName }}</p>
      <p>{{ item.name }}</p>
      <p>{{ item.code }}</p>
    </div>
  </div>
  <div id="print_ele__moduleThree" class="none_ele">
    <div class="print_item" v-for="item in multipleSelection" :key="item.id">
      <p>{{ item.deptName }}</p>
      <p>{{ item.name }}</p>
      <p>{{ item.code }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import printjs from '@/utils/print.js'

export default defineComponent({
  name: 'print',
  setup () {
    const printEle = ref()
    const multipleSelection = ref([])
    const module = ref('1')
    const printData = ref([
      {
        id: '1',
        code: '21040071',
        name: 'A-01曲房',
        deptName: '制曲-煮豆理化实验室'
      }, {
        id: '2',
        code: '21040072',
        name: 'A-02曲房',
        deptName: '制曲-煮豆理化实验室'
      }, {
        id: '3',
        code: '21040073',
        name: 'A-03曲房',
        deptName: '制曲-煮豆理化实验室'
      }, {
        id: '4',
        code: '21040074',
        name: 'A-04曲房',
        deptName: '制曲-煮豆理化实验室'
      }, {
        id: '5',
        code: '21040075',
        name: 'A-05曲房',
        deptName: '制曲-煮豆理化实验室'
      }
    ])

    const handleSelectionChange = (val) => {
      multipleSelection.value = val.map(item => item)
    }
    const print = () => {
      if (module.value === '1') {
        printjs('#print_ele__moduleOne')
      } else if (module.value === '2') {
        printjs('#print_ele__moduleTwo')
      } else if (module.value === '3') {
        printjs('#print_ele__moduleThree')
      }
    }

    return {
      printData,
      multipleSelection,
      module,
      print,
      handleSelectionChange,
      printEle
    }
  }
})
</script>

<style lang="scss">
  .none_ele{
    display: none;
  }
  #print_ele__moduleOne{
    .print_item{
      width: 3cm;
      height: 3cm;
      p{
        text-align: center;
        line-height: 0.7cm;
        font-size: 0.4cm;
      }
    }
  }
  #print_ele__moduleTwo{
    .print_item{
      width: 6cm;
      height: 6cm;
      p{
        text-align: center;
        line-height: 1.4cm;
        font-size: 0.8cm;
      }
    }
  }
  #print_ele__moduleThree{
    .print_item{
      width: 3cm;
      height: 3cm;
      p{
        text-align: center;
        line-height: 0.7cm;
        font-size: 0.4cm;
      }
    }
  }
</style>
<style lang="scss" media="print">
  @media print {
    @page {
      size: auto;
      margin: 0;
    }
    .none_ele{
      display: block;
    }
    #print_ele__moduleOne, #print_ele__moduleTwo{
      .print_item{
        page-break-after:always;
        page-break-before: always;
      }
    }
  }
</style>
