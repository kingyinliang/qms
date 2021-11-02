<template>
  <mds-card :title="title" :name="'org'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="org-card">
          <div class="org-card_title">
            {{ leftTitle }}
          </div>
          <div class="filter-input">
            <el-input v-model="filterText" placeholder="输入名称搜索" size="small">
              <template #suffix>
                <em class="el-input__icon el-icon-search" />
              </template>
            </el-input>
          </div>
          <div class="tree-main SelfScrollbar">
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="org-card">
          <div class="org-card_title">
            {{ rightTitle }}
          </div>
          <div class="detail-main SelfScrollbar">
            <slot name="view" />
          </div>
        </div>
      </el-col>
    </el-row>
  </mds-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import MdsCard from '../../mds-card'

export default defineComponent({
  name: 'QueryTable',
  components: {
    MdsCard
  },
  props: {
    title: {
      type: String,
      default: '标题'
    },
    leftTitle: {
      type: String,
      default: '左标题'
    },
    rightTitle: {
      type: String,
      default: '右标题'
    },
    treeData: {
      type: Array,
      required: true,
      default: function () {
        return []
      }
    },
    treeProps: {
      type: Object,
      default: function () {
        return { label: 'deptName', children: 'children' }
      }
    }
  },
  setup () {
    const filterText = ref('')
    const menuVisible = ref(false)

    onMounted(() => {
      document.addEventListener('click', () => {
        menuVisible.value = false
      })
    })

    return {
      filterText,
      menuVisible
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
