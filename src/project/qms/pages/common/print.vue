<template>
  <mds-card class="test_method" title="打印" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <el-table :data="printData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="编码" prop="code" />
      <el-table-column label="实验室名字" prop="deptName" />
      <el-table-column label="曲房名" prop="name" />
    </el-table>
    <div class="clearfix">
      <div style="line-height: 40px; float: right;margin-top: 10px">
        <el-radio-group v-model="module">
          <el-radio label="1">模板一（A4）</el-radio>
          <el-radio label="2">模板二（60*60）</el-radio>
          <el-radio label="3">模板三（30*30）</el-radio>
        </el-radio-group>
        <el-button type="primary" style="margin-left: 20px" @click="print">打印</el-button>
      </div>
    </div>
  </mds-card>
  <printModuleOne v-if="module === '1'" :multipleSelection="multipleSelection" />
  <printModuleTwo v-if="module === '2'" :multipleSelection="multipleSelection" />
  <printModuleThree v-if="module === '3'" :multipleSelection="multipleSelection" />
</template>

<script>
import { defineComponent, ref } from 'vue'
import printjs from '@/utils/print.js'
import printModuleOne from './printModuleOne'
import printModuleTwo from './printModuleTwo'
import printModuleThree from './printModuleThree'

export default defineComponent({
  name: 'print',
  components: {
    printModuleOne,
    printModuleTwo,
    printModuleThree
  },
  setup () {
    const printEle = ref()
    const multipleSelection = ref([])
    const module = ref('1')
    const printData = ref([
      {
        id: '1',
        code: '21040071',
        name: 'A-01曲房',
        deptName: '制曲-煮豆理化实验'
      }, {
        id: '2',
        code: '21040072',
        name: 'A-02曲房',
        deptName: '制曲-煮豆理化实验'
      }, {
        id: '3',
        code: '21040073',
        name: 'A-03曲房',
        deptName: '制曲-煮豆理化实验'
      }, {
        id: '4',
        code: '21040074',
        name: 'A-04曲房',
        deptName: '制曲-煮豆理化实验'
      }, {
        id: '5',
        code: '21040075',
        name: 'A-05曲房',
        deptName: '制曲-煮豆理化实验'
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
