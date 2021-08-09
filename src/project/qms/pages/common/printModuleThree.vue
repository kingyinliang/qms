<template>
  <div id="print_ele__moduleThree" class="none_ele">
    <div class="print_item" v-for="item in multipleSelection" :key="item.id">
      <p>{{ item.deptName }}</p>
      <p>{{ item.name }}</p>
      <p>{{ item.code }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'print_ele__moduleThree',
  props: {
    multipleSelection: {
      type: Array
    }
  },
  setup () {
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
