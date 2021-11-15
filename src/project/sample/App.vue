<template>
  <div style="padding: 20px; background: #F1F4F7;width: 100%;height: 100%">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>
