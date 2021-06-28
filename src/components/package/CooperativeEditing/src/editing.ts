import Quill from 'quill'
import { onBeforeUnmount, onMounted, Ref, ref } from 'vue'
import Delta from 'quill-delta'
import ClientSocketIO from 'socket.io-client'

interface UserInfo {
  id: string,
  realName: string,
  range?: number,
}

interface RangeData {
  id: string,
  range: number,
}

interface RangeStyle {
  background: string,
  height: string,
  left: string,
  top: string,
}

interface EditingFn {
  userList: Ref<UserInfo[]>
  getRangeStyle: (r: number, i: number) => RangeStyle
}

export const defaultOption = {
  theme: 'snow',
  modules: {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image', 'video'],
        [
          { table: 'TD' },
          { 'table-insert-row': 'TIR' },
          { 'table-insert-column': 'TIC' },
          { 'table-delete-row': 'TDR' },
          { 'table-delete-column': 'TDC' }
        ]
      ],
      handlers: {}
    },
    table: true
  },
  placeholder: '输入。。。。'
}

const rangeColor = [
  'red', 'rebeccapurple', 'blue'
]

// eslint-disable-next-line
export function editingFn (props: any): EditingFn {
  const userList: Ref<UserInfo[]> = ref([])
  const socketIo = ref()
  let editor: Quill = {} as Quill
  const handlers = {
    table: function () {
      editor.getModule('table').insertTable(2, 3)
    },
    'table-insert-row': function () {
      editor.getModule('table').insertRowBelow()
    },
    'table-insert-column': function () {
      editor.getModule('table').insertColumnRight()
    },
    'table-delete-row': function () {
      editor.getModule('table').deleteRow()
    },
    'table-delete-column': function () {
      editor.getModule('table').deleteColumn()
    }
  }

  const getRangeStyle = (range: number, index: number): RangeStyle => {
    const bounds = editor.getBounds(range || 0)

    return {
      background: rangeColor[index],
      height: bounds.height + 'px',
      left: bounds.left + document.getElementById('editor')!.offsetLeft + 'px',
      top: bounds.top + document.getElementById('editor')!.offsetTop + 'px'
    }
  }

  const initEditing = () => {
    defaultOption.modules.toolbar.handlers = handlers
    editor = new Quill(document.getElementById('editor') as HTMLElement, { ...defaultOption, ...props.editorOption })
    // 富文本输入
    editor.on('text-change', (delta, oldContents, source) => {
      if (source === 'user') {
        // 发送修改的内容
        socketIo.value.emit('text-change', delta)
        // 发送所有内容
        socketIo.value.emit('all-message', editor.getContents())
        // 发送自己位置
        socketIo.value.emit('selection-change', editor.getSelection()?.index)
      }
    })
    // 富文本点击
    editor.on('selection-change', (range) => {
      socketIo.value.emit('selection-change', range.index)
    })
  }

  const initSocket = () => {
    // Socket
    // 连接
    socketIo.value = ClientSocketIO(`${props.socketUrl}&userId=${props.userId}`)
    socketIo.value.on('connect', () => {
      console.log('连接成功')
    })
    // 获取正在编辑人员
    socketIo.value.on('user-list', (UserList: []) => {
      userList.value = UserList
    })
    // 获取全部内容
    socketIo.value.on('all-message', (delta: Delta) => {
      editor.setContents(delta)
    })
    // 更新内容
    socketIo.value.on('text-change', (delta: Delta) => {
      editor.updateContents(delta)
      // 发送自己位置
      socketIo.value.emit('selection-change', editor.getSelection()?.index)
    })
    // 更新某用户位置
    socketIo.value.on('selection-change', (rangeData: RangeData) => {
      const tmp = userList.value.find(item => item.id === rangeData.id)
      if (tmp) {
        tmp.range = rangeData.range
      }
    })
    // 断开
    socketIo.value.on('disconnect', function () {
      console.log('Disconnected')
    })
  }

  onMounted(() => {
    initEditing()
    initSocket()
  })

  onBeforeUnmount(() => {
    console.log('disconnect')
    socketIo.value.emit('disconnect')
  })

  return {
    userList,
    getRangeStyle
  }
}
