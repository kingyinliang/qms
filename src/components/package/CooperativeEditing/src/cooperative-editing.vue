<template>
  <div class="editor">
    <div class="editor__user">
      <div class="editor__user__item" v-for="(item, index) in userList" :key="index">{{ item.realName.slice(0, 2) }}</div>
    </div>
    <div class="editor__range" v-for="(item, index) in userList" :key="index">
      <span
        class="editor__range__item"
        v-if="item.id !== userId && item.range"
        :style="getRangeStyle(item.range, index)"
        :data-synchrony-sub="item.realName.slice(0, 1)"
      />
    </div>
    <div id="editor" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { editingFn, defaultOption } from './editing'

export default defineComponent({
  name: 'CooperativeEditing',
  emits: ['selectionChange', 'textChange', 'webSocketOnmessage'],
  props: {
    socketUrl: {
      type: String,
      default: ''
    },
    userId: {
      type: String,
      default: ''
    },
    editorOption: {
      type: Object,
      default: function () {
        return defaultOption
      }
    }
  },
  setup (props) {
    const { userList, getRangeStyle } = editingFn(props)

    return {
      userList,
      getRangeStyle
    }
  }
})
</script>

<style lang="scss" scoped>
.editor{
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  &__user{
    position: absolute;
    right: 20px;
    &__item{
      display: inline-flex;
      width: 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: white;
      border-radius: 50%;
      background: #8a979e;
      margin-right: 10px;
    }
  }
  &__range{
    &__item{
      position: absolute;
      width: 1px;
      background: red;
      &:after{
        content: attr(data-synchrony-sub);
        position: absolute;
        white-space: nowrap;
        font-size: 9px;
        color: #fff;
        background-color: inherit;
        top: -8px;
        padding: 2px;
        font-weight: bold;
        width: 11px;
        text-align: center;
      }
    }
  }
}
.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
