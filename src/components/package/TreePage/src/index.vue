<template>
  <mds-card :title="title" :name="'org'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <el-row style="padding:10px 0;">
      <el-col>
          <div>
            <slot name="out-header" />
          </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="org-card">
          <div class="org-card_title">
            {{ leftTitle }}
          </div>
          <div class="filter-input">
            <el-input v-model="filterText" :placeholder="searchPlaceHolder" size="small">
              <template #suffix>
                <em class="el-input__icon el-icon-search" />
              </template>
            </el-input>
          </div>
          <div class="tree-main SelfScrollbar">
            <el-tree
            ref="treeRef"
            :data="treeData"
            :node-key="nodeKey"
            :default-expanded-keys="expandedKeys"
            :current-node-key="focusCurrentNodeNumber"
            :props="treeProps" highlight-current
            :filter-node-method="filterNode"
            @node-click="treeNodeClick"
            @node-contextmenu="treeNodeContextMenu">
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <el-tooltip effect="dark" :content="data.tooltip" :disabled="!data.isTooltip" placement="right">
                    <span style="font-size:14px">{{ node.label }}</span>
                  </el-tooltip>
                </span>
              </template>
            </el-tree>
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
  <template v-if="floatMenu">
    <div id="context--menu" class="context--menu" v-show="menuVisible">
      <slot name="context--menu" />
    </div>
  </template>

</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, nextTick } from 'vue'
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
    searchPlaceHolder: { // 自定 search bar placeholder string
      type: String,
      default: function () {
        return '输入名称搜索'
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
        return { label: 'deptName', children: 'children' }
      }
    },
    floatMenu: { // 开启 float menu
      type: Boolean,
      default: true
    },
    nodeKey: { // 自定 node key
      type: String,
      default: 'id'
    },
    defaultFilterNodeProps: { // 自定加上第一层过滤维度
      type: Object,
      default: function () {
        return { prop: '', value: '' }
      }
    },
    filterWoekLevel: { // 自定 过滤层级
      type: Number,
      default: 0
    }
  },
  setup (props, { emit }) {
    const filterText = ref('')
    const treeRef = ref()
    const expandedKeys = ref<string[]>([])
    const menuVisible = ref(false)
    const focusCurrentNodeNumber = ref('')

    onMounted(() => {
      document.addEventListener('click', () => {
        menuVisible.value = false
      })
    })
    watch(filterText, (val) => {
      treeRef.value.filter(val)
    })

    watch(props, async (val: any) => {
      await nextTick()
      expandedKeys.value = []
      treeRef.value.filter(filterText.value) // when reload filter still work
      for (const item of val.treeData) {
        if (item[(props as any).treeProps.children] && item[(props as any).treeProps.children].length) {
          expandedKeys.value.push(item[(props as any).nodeKey])
        }
      }
    })

    watch(focusCurrentNodeNumber, async (val) => {
      if (val.toString()) {
        await nextTick()
        treeRef.value.setCurrentKey(val)
      } else {
        await nextTick()
        treeRef.value.setCurrentKey(null)
      }
    })

    // 搜索
    // eslint-disable-next-line
    const filterNode = (value: string, data: any,node:any) => {
      console.log((props as any).filterWoekLevel)

      let defaultFilter = true
      if (data[(props as any).defaultFilterNodeProps.prop]) {
        defaultFilter = data[(props as any).defaultFilterNodeProps.prop] === (props as any).defaultFilterNodeProps.value
      }

      // 如果什么都没填就直接返回
      if (!value) return defaultFilter

      if ((props as any).filterWoekLevel !== 0) {
        if (node.level >= (props as any).filterWoekLevel) {
          if (defaultFilter && node.parent.data[(props as any).treeProps.label].indexOf(value) !== -1) {
            return true
          }
          return false
        }
      }

      // eslint-disable-next-line
      if(defaultFilter && data[(props as any).treeProps.label].indexOf(value) !== -1){
        return true
      }
    }

    // 树点击
    // eslint-disable-next-line
    const treeNodeClick = (row: any) => {
      menuVisible.value = false
      emit('treeNodeClick', row, true)
    }

    // 组织架构右击
    // eslint-disable-next-line
    const treeNodeContextMenu = (event: MouseEvent, object: any) => {
      if (object.notShowContextMenuOnThisNode !== true) {
        menuVisible.value = true
        const menu = document.querySelector('#context--menu') as HTMLDivElement
        menu.style.left = event.clientX + 'px'
        menu.style.top = event.clientY + 'px'
        emit('treeNodeContextMenu', object)
      }
    }

    return {
      treeRef,
      filterText,
      menuVisible,
      expandedKeys,
      filterNode,
      treeNodeClick,
      treeNodeContextMenu,
      focusCurrentNodeNumber
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
