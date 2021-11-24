<template>
  <div id="print_ele__module_Three" class="none_ele">
    <div class="print_item" v-for="item in multipleSelection" :key="item.code">
      <div class="print_item--div">
        <p class="print_item_title" v-if="!item.wrap">{{ item.title }}</p>
        <p class="print_item_wrap_title" v-else>{{ item.title }}</p>
        <p class="print_item_title">{{ item.subtitle }}</p>
        <img :id="'code' + item.code" class="print_item_qrcode" />
        <p class="print_item_number">{{ item.code }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, ref } from 'vue'
import JsBarcode from 'jsbarcode'
import printjs from '@/utils/print.js'

export default defineComponent({
  name: 'printModule',
  setup () {
    const multipleSelection = ref([])
    const barCode = (id, code) => {
      JsBarcode(id, code, {
        displayValue: false
      })
    }
    const print = async (data) => {
      multipleSelection.value = data
      await nextTick()
      multipleSelection.value.forEach((it) => {
        barCode(`#code${it.code}`, it.code)
      })
      printjs('#print_ele__module_Three')
    }
    return {
      print,
      multipleSelection
    }
  }
})
</script>

<style lang="scss" scoped>
  .none_ele{
    display: none;
  }
  #print_ele__module_Three{
    .print_item--div{
      margin: auto;
      background: white;
      width: 3cm;
      height: 3cm;
      overflow: hidden;
      padding-top: 0.28cm;
    }
    .print_item{
      &_title{
        white-space: nowrap;
        line-height: 0.6cm;
        font-size: 0.2cm;
      }
      &_wrap_title{
        line-height: 0.6cm;
        font-size: 0.2cm;
      }
      &_qrcode{
        display: block;
        width: 2.5cm;
        height: 0.8cm;
        margin: auto;
      }
      &_number{
        margin-top: 0.1cm;
        font-size: 0.2cm;
      }
      p{
        text-align: center;
      }
    }
  }
</style>
<style lang="scss" media="print" scoped>
  @media print {
    @page {
      size: landscape!important;
      margin: 0 auto;
    }
    .none_ele{
      display: block;
    }
    #print_ele__module_Three{
      .print_item{
        width: 100%;
        page-break-after:always;
        page-break-before: always;
      }
    }
  }
</style>
