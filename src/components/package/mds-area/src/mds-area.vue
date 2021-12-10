<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-11-12 10:44:24
 * @LastEditors: Telliex
 * @LastEditTime: 2021-12-10 10:54:30
-->
<template>
  <div class="t-box-area" :class="{outline:outline,shadow:shadow}">
    <div class="t-box-area-title" v-if="title!==''">
      <h3> <em class="title-icon" :style="{ background: iconBg }" />{{ title }} </h3>
      <div style="display: flex; justify-content: flex-end; align-items: baseline;">
        <slot name="titleBtn" />
      </div>
    </div>
    <div class="clearfix" :class="name + 'Box'">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MdsArea',
  props: {
    outline: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: Boolean,
      default: false
    },
    packUp: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ''
    },
    iconBg: String,
    title: {
      type: String,
      default: ''
    }
  },
  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>

</style>
