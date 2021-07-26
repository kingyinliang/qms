<template>
  <el-row ref="printEle" :gutter="10" id="print_ele">
    <el-col v-for="(item, index) in 6" :key="item" :span="6 ">
      <div class="print_demo" style="page-break-after:always">
        <span>编码{{ index }}</span>
      </div>
    </el-col>
  </el-row>
  <el-button type="primary" @click="print">打印</el-button>
</template>

<script>
import { defineComponent, ref } from 'vue'
// import printJS from 'print-js'
import printjs from '@/utils/print.js'

export default defineComponent({
  name: 'print',
  setup () {
    const printEle = ref()
    const print = () => {
      console.log(1)
      printjs(document.querySelector('#print_ele'))
      // printJS({
      //   printable: 'print_ele',
      //   type: 'html',
      //   style: `.print_demo{
      //             border: 1px solid #000000;
      //             min-height: 200px;
      //             line-height: 200px;
      //             text-align: center;
      //             margin-bottom: 10px;
      //           }`
      // })
    }

    return {
      print,
      printEle
    }
  }
})
</script>

<style scoped>
.print_demo{
  border: 1px solid #000000;
  min-height: 200px;
  line-height: 200px;
  text-align: center;
  margin-bottom: 10px;
}
</style>
