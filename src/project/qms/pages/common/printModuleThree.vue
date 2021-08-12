<template>
  <div id="print_ele__moduleThree" class="none_ele">
    <div class="print_item" v-for="item in multipleSelection" :key="item.id">
      <p class="print_item_title">{{ item.deptName }}</p>
      <p class="print_item_title">{{ item.name }}</p>
      <img :id="'code' + item.id" class="print_item_qrcode" />
      <p class="print_item_number">{{ item.code }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, watch, onMounted } from 'vue'
import JsBarcode from 'jsbarcode'

export default defineComponent({
  name: 'print_ele__moduleThree',
  props: {
    multipleSelection: {
      type: Array
    }
  },
  setup (props: any) {
    const barCode = (id: string, code: string) => {
      JsBarcode(id, code, {
        displayValue: false
      })
    }
    watch(props, async (val: any) => {
      await nextTick()
      val.multipleSelection.forEach((it: any) => {
        barCode(`#code${it.id}`, it.code)
      })
    })
    onMounted(async () => {
      await nextTick()
      props.multipleSelection.forEach((it: any) => {
        barCode(`#code${it.id}`, it.code)
      })
    })
    return {
    }
  }
})
</script>

<style lang="scss" scoped>
  .none_ele{
    display: none;
  }
  #print_ele__moduleThree{
    .print_item{
      background: white;
      width: 3cm;
      height: 3cm;
      overflow: hidden;
      padding-top: 0.28cm;
      &_title{
        line-height: 0.6cm;
        font-size: 0.28cm;
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
      size: 3cm 3cm;
      margin: 0;
    }
    .none_ele{
      display: block;
    }
    #print_ele__moduleThree{
      .print_item{
        page-break-after:always;
        page-break-before: always;
      }
    }
  }
</style>
