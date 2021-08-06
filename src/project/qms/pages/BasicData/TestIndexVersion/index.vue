<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-30 11:24:46
 * @LastEditors: Telliex
 * @LastEditTime: 2021-08-06 16:28:37
-->
<template>
  <mds-card class="test_method" title="版本明细" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="float: right;display: flex;">
        <el-form ref="pstngDate" :model="controlForm" size="small" :inline="true" label-position="right" label-width="82px" class="topforms" style=" float: left;">
          <el-form-item label="" prop="pstngDate">
            <el-input suffix-icon="el-icon-search" v-model="controlForm.filterText" placeholder="版本号" clearable  style="width: 160px;" />
          </el-form-item>
        </el-form>
        <div style="float: right;">
          <el-button icon="el-icon-search"  size="small" @click="btnGetMainData">查询</el-button>
          <el-button icon="el-icon-circle-plus-outline" type="primary" size="small" @click="btnAddItemData">新增</el-button>
          <el-button icon="el-icon-delete" type="danger" size="small" @click="actBatchDelete">批量删除</el-button>
        </div>
      </div>
    </template>
    <el-table ref="multipleTable"  :cell-style="{'text-align':'center'}" :data="topicMainData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @row-dblclick="handleDbclick">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" :index="(index) => index + 1 + (currentPage - 1) * pageSize" width="50" />
      <el-table-column label="检验类别\物料" min-width="200" prop="inspectMaterialTypeName" show-overflow-tooltip />
      <el-table-column label="指标代码" width="160" prop="indexCode" show-overflow-tooltip />
      <el-table-column label="指标名称" width="160" prop="indexName" show-overflow-tooltip />
      <el-table-column label="单位" width="100" prop="indexUnit" show-overflow-tooltip />
      <el-table-column label="方法" width="200" prop="indexMethod" show-overflow-tooltip />
      <el-table-column label="版本" width="160" prop="indexVersion" show-overflow-tooltip />
      <el-table-column label="版本执行方法" width="160" prop="indexVersionMethod" show-overflow-tooltip>

        <template #default="scope">
        <el-button
          size="mini"
          type="text"
          @click="seeVersion(scope.row)">{{scope.row.indexVersionMethod}}</el-button>
         </template>
      </el-table-column>
      <el-table-column label="变更说明" width="160" prop="changeInfo" show-overflow-tooltip />
      <el-table-column label="执行开始日" width="200" prop="beginDate" show-overflow-tooltip />
    </el-table>
    <el-row style="float: right">
      <el-pagination
        v-if="topicMainData.length!==0"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="totalItems"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="val => pageSize = val"
        @current-change="val => currentPage = val"
      />
    </el-row>
  </mds-card>
  <!--指标弹窗-->
  <el-dialog :title="'版本明细'" v-model="isDialogVisibleForItemControl" width="40%">
    <el-form ref="addRef" :model="addFormInfo" :rules="dataRule">
        <el-form-item label="版本：" prop="indexVersion" :label-width="'140px'">
          <el-input v-model="addFormInfo.indexVersion" class="140px" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本执行方法：" prop="indexVersionMethod" :label-width="'140px'">
            <el-upload
              ref="upload"
              :action="apiFileURL"
              :on-remove="removeFile"
              :on-success="addfile"
              :http-request="httpRequest"
              :on-error="errorFile"
              :limit="1"
              :file-list="fileList"
              style="width:100%"
            >
              <!-- <el-button size="small" type="primary">点击上传</el-button> -->
              <el-input v-model="addFormInfo.indexVersionMethod" placeholder="请上传文件" autocomplete="off" :disabled="!canUploadFile" style="width:100%"></el-input>
            </el-upload>
          <!-- <el-input v-model="addFormInfo.indexVersionMethod" class="140px" placeholder="请选择" autocomplete="off"></el-input>
          <el-upload ref="upload" class="org-img-upload" list-type="picture-card" :action="FILE_API" :limit="1" :http-request="httpRequest" :file-list="fileList" :on-success="addfile" :on-remove="removeFile" :on-preview="handlePictureCardPreview">
              <el-button size="small" type="primary">点击上传</el-button>
          </el-upload> -->
        </el-form-item>
        <el-form-item label="执行开始日：" prop="beginDate" :label-width="'140px'">
           <el-date-picker
            v-model="addFormInfo.beginDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="btnItemFloatClear">取 消</el-button>
        <el-button type="primary" @click="btnItemFloatConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <!--标准值明细-->
  <index-value-detail v-model:dialogVisible="isDialogShow" v-if="isDialogShow" ref="refIndexValueDetail" :target="versionId" />
</template>

<script lang="ts">
//  ComponentInternalInstance, getCurrentInstance
import { useRouter } from 'vue-router'
import { defineComponent, ref, reactive, onMounted, toRefs, ComponentInternalInstance, getCurrentInstance } from 'vue'
import MdsCard from '@/components/package/mds-card/src/mds-card.vue'
import IndexValueDetail from './TestIndexValueDetail.vue'
import axios from 'axios'
import { useStore } from 'vuex'
import {
  INSPECT_INDEX_VERSION_QUERY_API, // 基础数据-[指标版本管理]- 查询
  INSPECT_INDEX_VERSION_ADD_API, // 基础数据-[指标版本管理]- 新增
  INSPECT_INDEX_VERSION_DELETE_API, // 基础数据-[指标版本管理]- 删除
  UPLOAD_FILE_API, // 文件上传
  DOWNLOAD_FILE_API // 文件下载
  // UPLOAD_FILE_API
} from '@/api/api'

interface AddFormInfo {
  beginDate: string
  indexVersion: string
  indexVersionMethod: string
}

interface TopicMainData{
  beginDate: string
  changeInfo: string
  currentFlag: string
  factory: string
  id: string
  indexCode: string
  indexMethod: string
  indexName: string
  indexUnit: string
  indexVersion: string
  indexVersionMethod: string
  inspectIndexMaterialId: string
  inspectMaterialTypeName: string
}
interface ControlForm{
  filterText: string;
}

interface FileList{
  name: string
  url: string
}

interface State {
  isDialogShow: boolean
  isDialogVisibleForItemControl: boolean
  addFormInfo: AddFormInfo
  inspectIndexMaterialId: string
  topicMainData: TopicMainData[]
  controlForm: ControlForm
  currentPage: number
  pageSize: number
  totalItems: number
  selectedListOfTopicMainData: TopicMainData[]
  versionId: string
  apiFileURL: string
  fileURL: string
  fileList: FileList[]
  dialogImageUrl: string
  canUploadFile: boolean
}

export default defineComponent({
  name: 'TestIndexVersionIndex',
  components: {
    MdsCard,
    IndexValueDetail
  },

  props: {
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const refIndexValueDetail = ref()
    const upload = ref()
    const router = useRouter()
    const store = useStore()
    const dataRule = ref({
      indexVersion: [
        {
          required: true,
          message: '请输入版本',
          trigger: 'blur'
        }
      ],
      beginDate: [
        {
          required: true,
          message: '执行开始日',
          trigger: 'blur'
        }
      ]
    })
    const state = reactive<State>({
      isDialogShow: false,
      isDialogVisibleForItemControl: false,
      inspectIndexMaterialId: '', // '624547859339390976'
      addFormInfo: {
        beginDate: '',
        indexVersion: '',
        indexVersionMethod: ''
      },
      topicMainData: [],
      controlForm: {
        filterText: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      selectedListOfTopicMainData: [],
      versionId: '',
      apiFileURL: '',
      fileURL: '',
      fileList: [],
      dialogImageUrl: '',
      canUploadFile: true
    })

    // 函数

    // [ACTION:load][BTN:查询] 获取指标版本管理数据
    const btnGetMainData = async () => {
      const res = await INSPECT_INDEX_VERSION_QUERY_API({
        inspectIndexMaterialId: state.inspectIndexMaterialId,
        indexVersion: state.controlForm.filterText,
        current: state.currentPage,
        size: state.pageSize
      })
      console.log('获取指标版本管理数据')
      console.log(res.data.data)
      state.topicMainData = res.data.data.records
      state.totalItems = res.data.data.total
      state.currentPage = res.data.data.current
      state.pageSize = res.data.data.size
      state.isDialogShow = false
    }

    // [BTN:新增] 新增 item
    const btnAddItemData = async () => {
      state.addFormInfo = {
        beginDate: '',
        indexVersion: '',
        indexVersionMethod: ''
      }
      state.isDialogVisibleForItemControl = true
    }

    // [table] 选框选择
    const handleSelectionChange = (val: TopicMainData[]) => {
      state.selectedListOfTopicMainData = val
      console.log(state.selectedListOfTopicMainData)
      // multipleSelection.value = val.map((item: TargetInfo) => item.id)
    }

    // [BTN:批次删除]
    const actBatchDelete = () => {
      if (state.selectedListOfTopicMainData.length === 0) {
        return
      }
      proxy.$confirm('确认删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const tempDeleteList: string[] = []
        state.selectedListOfTopicMainData.forEach(item => {
          tempDeleteList.push(item.id)
        })
        console.log(tempDeleteList)

        const res = await INSPECT_INDEX_VERSION_DELETE_API(tempDeleteList)
        if (res.data.code === 200) {
          state.currentPage = 1
          state.pageSize = 10
          state.totalItems = 0
          proxy.$successToast('操作成功')
          await btnGetMainData()
        }
      })
    }

    // [BTN:确认][float]
    const btnItemFloatConfirm = async () => {
      console.log('state.addFormInfo')
      console.log(state.addFormInfo)
      if (state.addFormInfo.indexVersion === '') {
        proxy.$errorToast('请输入版本')
        return
      }

      if (state.addFormInfo.beginDate === '') {
        proxy.$errorToast('请输入执行开始日')
        return
      }

      if (new Date(state.addFormInfo.beginDate).getTime() - new Date(formatDate()).getTime() <= 0) {
        proxy.$errorToast('必须选择今天以后的日期')
        return
      }

      await INSPECT_INDEX_VERSION_ADD_API({
        inspectIndexMaterialId: state.inspectIndexMaterialId,
        ...state.addFormInfo
      })
      proxy.$successToast('操作成功')
      removeFile()
      btnGetMainData() // reload
      state.isDialogVisibleForItemControl = false
    }

    // [BTN:取消][float]
    const btnItemFloatClear = () => {
      removeFile()
      state.addFormInfo = {
        beginDate: '',
        indexVersion: '',
        indexVersionMethod: ''
      }
      state.isDialogVisibleForItemControl = false
    }

    // [Table:Row][dbclick]
    const handleDbclick = (val:TopicMainData) => {
      console.log(val)
      state.versionId = val.id
      state.isDialogShow = true
    }

    const seeVersion = (row:TopicMainData) => {
      DOWNLOAD_FILE_API({ key: row.indexMethod }).then(res => {
        console.log('下载 obj')
        console.log(res.data.data)
        window.open(res.data.data.url, '_blank')
      })
    }

    const errorFile = () => {
      state.canUploadFile = true
      state.addFormInfo.indexVersionMethod = ''
    }

    // 上传图片前
    const httpRequest = (options:any) => {
      state.canUploadFile = false
      UPLOAD_FILE_API({
        name: options.file.name
      }).then(({ data }) => {
        if (data.code === 200) {
          console.log('data.data')
          console.log(data.data)

          state.apiFileURL = data.data.url
          axios.put(data.data.url, options.file).then(res => {
            if (res.status === 200) {
              options.onSuccess(data.data.key, options)
            }
          })
        }
      })

      // UPLOAD_FILE_API({
      //   name: options.file.name
      // }).then(({ data }) => {
      //   if (data.code === 200) {
      //     console.log('data.data.url')
      //     console.log(data.data.url)
      //     console.log('state.fileList2')
      //     console.log(state.fileList)
      //     state.apiFileURL = data.data.url
      //     axios.put(data.data.url, options.file).then(res => {
      //       if (res.status === 200) {
      //         console.log('77777777')
      //         console.log(data.data)
      //         console.log(options)
      //         options.onSuccess(data.data.key, options)
      //       }
      //     })
      //   }
      // })
    }

    // 上传图片后
    const addfile = (key:string) => {
      console.log('成功！')
      console.log(key)
      state.fileURL = key
      state.addFormInfo.indexVersionMethod = key
      console.log(state.fileList)
    }

    // 移出图片
    const removeFile = () => {
      console.log('removeFile')
      state.canUploadFile = true
      state.addFormInfo.indexVersionMethod = ''
      state.fileList = []
    }

    const formatDate = () => {
      var d = new Date()
      var month = '' + (d.getMonth() + 1)
      var day = '' + d.getDate()
      var year = d.getFullYear()

      if (month.length < 2) { month = '0' + month }
      if (day.length < 2) { day = '0' + day }
      return [year, month, day].join('-')
    }

    // const useEffect = (() => {
    //   if (router.asPath !== router.route) {
    //     // router.query.lang is defined
    //   }
    // }, [router])

    onMounted(async () => {
      if (store.state.common.inspectIndexMaterialId === '') {
        store.commit('common/updateInspectIndexMaterialId', router.currentRoute.value.query.versionID as string)
      }
      state.inspectIndexMaterialId = router.currentRoute.value.query.versionID ? router.currentRoute.value.query.versionID as string : store.state.common.inspectIndexMaterialId
      btnGetMainData()
    })

    return {
      ...toRefs(state),
      formatDate,
      httpRequest,
      addfile,
      removeFile,
      errorFile,
      refIndexValueDetail,
      upload,
      btnGetMainData,
      handleSelectionChange,
      actBatchDelete,
      btnAddItemData,
      btnItemFloatConfirm,
      btnItemFloatClear,
      dataRule,
      handleDbclick,
      seeVersion
    }
  }
})
</script>

<style lang="scss" scoped>
.test_method{
  height: calc(100vh - 117px);
}
.topforms {
  display: flex;
  .el-date-editor.el-input {
    width: auto;
  }
  .formtextarea {
    .el-form-item__content {
      width: 500px;
    }
  }
}
.item-imput{
    -webkit-appearance: none;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: var(--el-text-color-regular);
    display: inline-block;
    font-size: inherit;
    outline: 0;
    padding: 2px 10px;
    -webkit-transition: var(--el-border-transition-base);
    transition: var(--el-border-transition-base);
    width: 100%;
    cursor: pointer;
    p {
      line-height: 40px;
      box-sizing: content-box !important;
      span{
        margin-right: 5px;
      }
    }
}

</style>
<style scoped>
.el-form-item__content >>> .el-upload--text{
  width: 100%;
}
</style>
