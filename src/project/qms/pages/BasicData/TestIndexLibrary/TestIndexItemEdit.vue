<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-08 11:25:52
 * @LastEditors: Telliex
 * @LastEditTime: 2021-11-09 10:21:35
-->
<template>
    <dialogDevice :dialogVisible="dialogVisible" :title="title" @on-confirm="onConfirm" @on-close="onClose">
      <template #default>
         <el-form ref="ruleForm"  :model="formData" :rules="dataRule">
          <el-form-item label="指标代码：" prop="indexCode" :label-width="'120px'">
            <el-input v-model="formData.indexCode" class="inputWidth" :disabled="true" placeholder="" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="指标名称：" prop="indexName" :label-width="'120px'">
            <el-input v-model="formData.indexName" class="inputWidth" :disabled="true" placeholder="" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="单位：" prop="indexUnit" :label-width="'120px'">
            <el-input v-model="formData.indexUnit" class="inputWidth" :disabled="true" placeholder="" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="方法：" prop="indexMethod" :label-width="'120px'">
            <el-input v-model="formData.indexMethod" class="inputWidth" :disabled="true" placeholder="" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="属性：" prop="inspectProperty" :label-width="'120px'">
            <el-select v-model="formData.inspectProperty" style="width: 100%"  :disabled="true"  placeholder="">
              <el-option v-for="(opt, optIndex) in inspectPropertyOptions" :key="optIndex" :label="opt.dictValue" :value="opt.dictCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="应用场景：" prop="inspectScene" :label-width="'120px'">
            <el-select v-model="formData.inspectScene" style="width: 100%"  clearable placeholder="请选择">
              <el-option v-for="(opt, optIndex) in inspectSceneOptions" :key="optIndex" :label="opt.dictValue" :value="opt.dictCode" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </dialogDevice>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, reactive, toRefs, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { DICTIONARY_QUERY_API } from '@/api/api'
import dialogDevice from '../../components/SHDialog.vue'

interface DialogMainDataImport{
  // id?: string;
  indexCode: string;
  indexMethod: string;
  indexName: string;
  // indexType?: string;
  // indexTypeName?: string;
  indexUnit: string;
  inspectProperty: string;
  // inspectPropertyName?: string;
  inspectScene: string;
  // inspectSceneName?: string;
  // syncDate?: string;
}

interface Props {
    title: string
    dialogVisible: boolean
    dialogData: DialogMainDataImport
}

interface DictionaryReturnOptions {
    dictCode?: string;
    dictId?: string;
    dictOrder?: string;
    dictValue?: string;
    factoryName?: string;
    id?: string;
}

interface State {
    isDialogShow: boolean
    formData: DialogMainDataImport
    inspectPropertyOptions: DictionaryReturnOptions[]
    inspectSceneOptions: DictionaryReturnOptions[]
}

export default defineComponent({
  name: 'TestIndexItemEdit',
  components: {
    dialogDevice
  },
  emits: ['actReset', 'actConfirm', 'update:dialogVisible'],
  props: {
    title: {
      type: String,
      default: '弹框'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup (props, context) {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const state = reactive<State>({
      isDialogShow: false,
      formData: {
        indexCode: '',
        indexName: '',
        indexUnit: '',
        indexMethod: '',
        inspectProperty: '',
        inspectScene: ''
      },
      inspectPropertyOptions: [],
      inspectSceneOptions: []
    })
    const parent = { ...context }
    const { dialogVisible, dialogData } = toRefs(props as Props)
    const ruleForm = ref()
    const dataRule = {
      // indexCode: [
      //   {
      //     required: true,
      //     message: '请选择指标代码',
      //     trigger: 'blur'
      //   }
      // ],
      // indexName: [
      //   {
      //     required: true,
      //     message: '请输入指标名称',
      //     trigger: 'blur'
      //   }
      // ],
      // indexUnit: [
      //   {
      //     required: true,
      //     message: '请输入单位',
      //     trigger: 'blur'
      //   }
      // ],
      // indexMethod: [
      //   {
      //     required: true,
      //     message: '请输入方法',
      //     trigger: 'blur'
      //   }
      // ],
      // inspectProperty: [
      //   {
      //     required: true,
      //     message: '请选择检验组',
      //     trigger: 'blur'
      //   }
      // ],
      inspectScene: [
        {
          required: true,
          message: '请选择应用场景',
          trigger: 'blur'
        }
      ]
    }

    const onConfirm = () => {
      ruleForm.value.validate((valid: boolean) => {
        if (valid) {
          parent.emit('actConfirm', state.formData)
          parent.emit('update:dialogVisible', false)
        } else {
          proxy.$warningToast('请填写必填栏位')
          return false
        }
      })
    }

    const onClose = () => {
      parent.emit('update:dialogVisible', false)
      parent.emit('actReset')
      ruleForm.value.resetFields()
    }

    onMounted(async () => {
      const resProperty = await DICTIONARY_QUERY_API({ dictType: 'INSPECT_PROPERTY' })
      state.inspectPropertyOptions = resProperty.data.data
      const resScene = await DICTIONARY_QUERY_API({ dictType: 'INSPECT_SCENE' })
      state.inspectSceneOptions = resScene.data.data
    })

    watch(
      dialogVisible,
      newValue => {
        state.isDialogShow = newValue
      },
      { immediate: true }
    )

    watch(
      dialogData,
      newValue => {
        state.formData = newValue
      },
      { immediate: true }
    )

    return {
      ...toRefs(state),
      ruleForm,
      onConfirm,
      onClose,
      dataRule
    }
  }
})

</script>

<style scoped></style>
