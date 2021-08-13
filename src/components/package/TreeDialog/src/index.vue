<template>
  <el-popover :disabled="disabled" placement="bottom-start" trigger="click" popper-class="treeDialog">
    <template #reference>
      <el-select
        class="treeDialog__input"
        v-model="checkedValue"
        :disabled="disabled"
        multiple
        value-key="id"
        popper-class="treeDialog__none"
        :automatic-dropdown="false"
        :readonly="true"
        :placeholder="placeholder"
        @remove-tag="removeTag"
      >
        <el-option v-for="item in selectOption" :key="item.id" :label="item[treeProps.label]" :value="item" />
      </el-select>
    </template>
    <div class="treeDialog__filter-input">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        size="small"
        clearable
        style="margin-bottom:10px;">
        <template #suffix>
          <em class="el-input__icon el-icon-search" />
        </template>
      </el-input>
    </div>
    <div style="height: 200px; overflow: scroll;">
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="treeProps"
        :default-checked-keys="defaultCheckedKeys"
        :check-strictly="checkStrictly"
        node-key="id"
        show-checkbox
        highlight-current
        default-expand-all
        :filter-node-method="filterNode"
        @check-change="handleCheckedChange"
      />
    </div>
  </el-popover>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRefs,
  watch,
  computed
} from 'vue'

interface Props{
  modelValue: undefined|string|any[];
  treeProps?: any;
  disabled?: boolean;
  leafOnly?: boolean;
  treeData: any[];
}

export default defineComponent({
  name: 'TreeDialog',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: [String, Array],
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    leafOnly: {
      type: Boolean,
      default: true
    },
    checkStrictly: {
      type: Boolean,
      default: false
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
        return {
          label: 'label', children: 'children'
        }
      }
    }
  },
  setup (props: Props, { emit }) {
    const treeRef = ref()
    const filterText = ref('')
    const checkedValue = ref([])
    const selectOption = ref([])
    const { modelValue, treeProps, leafOnly } = toRefs<Props>(props)

    const defaultCheckedKeys = computed({
      get () {
        return props.modelValue
      },
      set (val) {
        emit('update:modelValue', val)
      }
    })

    const filterNode = (value:string, data: any) => {
      if (!value) return true
      return data[treeProps.value.label].indexOf(value) !== -1
    }
    const handleCheckedChange = () => {
      const checkNodes = treeRef.value.getCheckedNodes(leafOnly?.value)
      const ids = checkNodes.map((it: any) => it.id)
      checkedValue.value = checkNodes
      selectOption.value = checkNodes
      emit('update:modelValue', ids)
    }
    const getCheckedNodes = () => {
      return treeRef.value.getCheckedNodes(leafOnly?.value)
    }
    const removeTag = (tag: any) => {
      treeRef.value.setChecked(tag.id, false)
    }

    watch(filterText, (val) => {
      treeRef.value.filter(val)
    })
    watch(modelValue, (val) => {
      if (val) {
        defaultCheckedKeys.value = val
        treeRef.value.setCheckedKeys(val)
      }
    })

    return {
      treeRef,
      filterText,
      checkedValue,
      defaultCheckedKeys,
      selectOption,
      removeTag,
      filterNode,
      handleCheckedChange,
      getCheckedNodes
    }
  }
})
</script>

<style lang="scss">
  .treeDialog{
    min-width: 250px!important;
    width: auto!important;
  }
  .treeDialog__none{
    display: none;
  }
  .treeDialog__input{
    width: 100%;
  }
</style>
<style lang="scss" scoped>
</style>
