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
            <el-tree
              ref="treeRef"
              :data="treeData"
              node-key="id"
              :props="treeProps"
              highlight-current
              default-expand-all
              :filter-node-method="filterNode"
              @node-click="treeNodeClick"
              @node-contextmenu="treeNodeContextMenu"
            />
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
  <div id="context--menu" class="context--menu" v-show="menuVisible">
    <slot name="context--menu" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import MdsCard from '../../mds-card'

export default defineComponent({
  name: 'TreePage',
  components: {
    MdsCard
  },
  emits: ['treeNodeClick', 'treeNodeContextMenu'],
  props: {
    title: {
      type: String,
      default: function () {
        return '标题'
      }
    },
    leftTitle: {
      type: String,
      default: function () {
        return '左标题'
      }
    },
    rightTitle: {
      type: String,
      default: function () {
        return '右标题'
      }
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
        return { label: 'deptName' }
      }
    }
  },
  setup (props, { emit }) {
    const filterText = ref('')
    const treeRef = ref()
    const menuVisible = ref(false)

    watch(filterText, (val) => {
      treeRef.value.filter(val)
    })

    // 搜索
    // eslint-disable-next-line
    const filterNode = (value:string, data: any) => {
      if (!value) return true
      // eslint-disable-next-line
      return data[(props as any).treeProps.label].indexOf(value) !== -1
    }

    // 树点击
    // eslint-disable-next-line
    const treeNodeClick = (row: any) => {
      emit('treeNodeClick', row, true)
    }

    // 组织架构右击
    // eslint-disable-next-line
    const treeNodeContextMenu = (event: MouseEvent, object: any) => {
      menuVisible.value = true
      const menu = document.querySelector('#context--menu') as HTMLDivElement
      menu.style.left = event.clientX + 'px'
      menu.style.top = event.clientY + 'px'
      emit('treeNodeContextMenu', object)
    }

    onMounted(() => {
      document.addEventListener('click', e => {
        const target: HTMLDivElement = e.target as HTMLDivElement
        if (target.className !== 'context--menu') menuVisible.value = false
      })
    })

    return {
      treeRef,
      filterText,
      menuVisible,
      filterNode,
      treeNodeClick,
      treeNodeContextMenu
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
