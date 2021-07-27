<template>
  <div id="print_ele" class="clearfix">
    <div class="print_demo" v-for="(item, index) in 6" :key="item">
      <span>编码{{ index }}</span>
    </div>
  </div>
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
      // window.print()
      printjs('#print_ele')
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

<style>
  #print_ele{
  }
  .print_demo{
    float: left;
    margin-right: 10px;
    page-break-after:always;
    width: 20%;
    border: 1px solid #000000;
    min-height: 200px;
    line-height: 200px;
    text-align: center;
    margin-bottom: 10px;
  }
</style>
<style media="print">
  @media print {
    .print_demo{
      page-break-after:always;
      page-break-before: always;
      float: none;
      border: 1px solid #000000;
      min-height: 200px;
      line-height: 200px;
      text-align: center;
      margin-bottom: 10px;
    }
  }
</style>
