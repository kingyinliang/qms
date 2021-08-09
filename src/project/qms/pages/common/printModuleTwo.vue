<template>
  <div id="print_ele__moduleTwo" class="none_ele">
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
  name: 'printModuleTwo',
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
</style>
<style lang="scss" media="print" scoped>
  @media print {
    @page {
      size: 6cm 6cm;
      margin: 0;
    }
    .none_ele{
      display: block;
    }
    #print_ele__moduleTwo{
      .print_item{
        page-break-after:always;
        page-break-before: always;
      }
    }
  }
</style>
