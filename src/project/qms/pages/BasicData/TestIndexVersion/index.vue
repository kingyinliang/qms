<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-30 11:24:46
 * @LastEditors: Telliex
 * @LastEditTime: 2021-10-12 15:37:36
-->
<template>
  <mds-card class="test_method" title="版本明细" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <template #titleBtn>
      <div style="float: right;display: flex;">
        <el-input size="small" style="margin-bottom:10px; width:200px; height:35px;margin-right:10px" v-model="controlForm.filterText" placeholder="版本号" clearable @keyup.enter="btnGetMainData('init')"  />
        <div style="float: right;">
          <el-button icon="el-icon-search" size="small" class="topic-button" @click="btnGetMainData('init')">查询</el-button>
          <el-button icon="el-icon-plus" type="primary" size="small" class="topic-button" @click="btnAddItemData">新增</el-button>
          <el-button icon="el-icon-delete" type="danger" size="small" class="topic-button" @click="actBatchDelete">批量删除</el-button>
        </div>
      </div>
    </template>
    <el-table ref="multipleTable" border :row-style="tableRowFocusStyle"    :cell-style="{'text-align':'center'}" :data="topicMainData" tooltip-effect="dark" @selection-change="handleSelectionChangeOfTopicMainData" @row-dblclick="handleDbclickOfTopicMainData" max-height="300" style="width: 100%">
      <el-table-column type="selection" width="55" align="center" :selectable="checkDate" />
      <el-table-column type="index" label="序号" :index="(index) => index + 1 + (currentPage - 1) * pageSize" width="55" />
      <el-table-column label="检验类别\物料" min-width="200" prop="inspectMaterialTypeName" show-overflow-tooltip />
      <el-table-column label="指标代码" width="160" prop="indexCode" show-overflow-tooltip />
      <el-table-column label="指标名称" width="160" prop="indexName" show-overflow-tooltip />
      <el-table-column label="单位" width="100" prop="indexUnit" show-overflow-tooltip />
      <el-table-column label="方法" width="200" prop="indexMethod" show-overflow-tooltip />
      <el-table-column label="版本" width="160" prop="indexVersion" show-overflow-tooltip />
      <el-table-column label="版本执行方法" min-width="260" prop="indexVersionMethod" >
        <template #default="scope">
          <ul style="text-align:left">
            <li v-for="(item,myIndex) in scope.row.indexVersionMethodRemoveRouteList"
            :key="item" style="margin-bottom: 5px;">
              <el-tooltip
                effect="dark"
                :content="item.name"
                placement="top"
              >
                <el-button
                  size="mini"
                  type="text"
                  @click="seeVersion(scope.row,myIndex)">{{item.name}}</el-button>
              </el-tooltip>
            </li>
          </ul>
         </template>
      </el-table-column>
      <el-table-column label="变更说明" width="160" prop="changeInfo" show-overflow-tooltip />
      <el-table-column label="执行开始日" width="200" prop="beginDate" show-overflow-tooltip />
      <el-table-column label="操作" width="80" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="el-icon-edit" class="role__btn" @click="btnEditItemOfTopicMainData(scope.row)" :disabled="(new Date(scope.row.beginDate).getTime() - new Date(formatDate()).getTime()) <= 0">
            <em>编辑</em>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

      <el-pagination
        v-if="topicMainData.length!==0"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="totalItems"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

    <!--标准值明细-->
    <index-value-detail v-model:dialogVisible="isDialogShow" v-if="isDialogShow" ref="refIndexValueDetail"   :target="versionObj" style="margin-bottom:20px"/>

  </mds-card>
  <!--指标弹窗-->
  <el-dialog :title="addFormInfo.title" v-model="isDialogVisibleForItemControl" width="550px">
    <el-form ref="addRef" :model="addFormInfo" :rules="dataRule">
        <el-form-item label="版本：" prop="indexVersion" :label-width="'140px'">
          <el-input v-model="addFormInfo.indexVersion" class="140px" autocomplete="off" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="版本执行方法：" prop="indexVersionMethod" :label-width="'140px'">
            <el-upload
              ref="upload"
              :action="apiFileURL"
              :before-remove="beforeRemove"
              :on-remove="uploadOfRemoveFile"
              :on-success="uploadOfAddfileSuccess"
              :http-request="httpRequest"
              :on-error="uploadOfErrorFile"
              :file-list="uploadFileListRemoveRoute"
              show-file-list
            >
              <!-- <el-input v-model="addFormInfo.indexVersionMethod" placeholder="请上传文件" autocomplete="off" :disabled="!canUploadFile" style="width:100%"></el-input> -->

              <el-button size="small" type="primary" :disabled="!fileUploadFinish">选取上传文件</el-button>

            </el-upload>

        </el-form-item>
        <el-form-item label="执行开始日：" prop="beginDate" :label-width="'140px'">
           <el-date-picker
            v-model="addFormInfo.beginDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="pickerOptions"
            placeholder="请选选择日期"
            style="width:100%"
            >
          </el-date-picker>
        </el-form-item>
      </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" class="topic-button" icon="el-icon-circle-close" @click="btnItemFloatClear">取 消</el-button>
        <el-button size="small" class="topic-button" icon="el-icon-circle-check" type="primary" @click="btnItemFloatConfirm" :disabled="!fileUploadFinish">确 定</el-button>
      </span>
    </template>
  </el-dialog>

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
  INSPECT_INDEX_VERSION_UPDATE_API, // 基础数据-[指标版本管理]- 编辑
  UPLOAD_FILE_API, // 文件上传
  DOWNLOAD_FILE_API // 文件下载
  // UPLOAD_FILE_API
} from '../../../../../api/api/index'
import layoutTs from '@/components/layout/layoutTs'
interface FileList{
  name: string
  url: string
}

interface AddFormInfo {
  id: string
  title: string
  beginDate: string
  indexVersion: string
  indexVersionMethod: string
  indexVersionMethodList: FileList []
  indexVersionMethodRemoveRoute: string
  indexVersionMethodRemoveRouteList: FileList []
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
  indexVersionMethodList:FileList[]
  indexVersionMethodRemoveRoute: string
  indexVersionMethodRemoveRouteList: FileList[]
  inspectIndexMaterialId: string
  inspectMaterialTypeName: string
  isCurrentFocusRow: boolean
}
interface ControlForm{
  filterText: string;
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
  versionObj: TopicMainData | null
  apiFileURL: string
  // fileURL: string
  uploadFileListRemoveRoute: FileList[]
  uploadFileList: FileList[]
  dialogImageUrl: string
  canUploadFile: boolean
  fileUploadFinish: boolean
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
    const { gotoPage, tabsCloseCurrentHandle } = layoutTs()
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
      isDialogShow: true,
      isDialogVisibleForItemControl: false,
      inspectIndexMaterialId: '', // '624547859339390976'
      addFormInfo: {
        id: '',
        title: '',
        beginDate: '',
        indexVersion: '',
        indexVersionMethod: '',
        indexVersionMethodList: [],
        indexVersionMethodRemoveRoute: '',
        indexVersionMethodRemoveRouteList: []
      },
      topicMainData: [],
      controlForm: {
        filterText: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      selectedListOfTopicMainData: [],
      versionObj: null,
      apiFileURL: '',
      // fileURL: '',
      uploadFileListRemoveRoute: [],
      uploadFileList: [],
      dialogImageUrl: '',
      canUploadFile: true,
      fileUploadFinish: true
    })

    // 函数

    // [ACTION:load][BTN:查询] 获取指标版本管理数据
    const btnGetMainData = async (type = '') => {
      if (type === 'init') {
        state.currentPage = 1
        state.pageSize = 10
      }

      const res = await INSPECT_INDEX_VERSION_QUERY_API({
        inspectIndexMaterialId: state.inspectIndexMaterialId,
        indexVersion: state.controlForm.filterText,
        current: state.currentPage,
        size: state.pageSize
      })
      state.topicMainData = res.data.data.records
      state.topicMainData.forEach(item => {
        item.indexVersionMethodRemoveRouteList = []
        item.indexVersionMethodList = []
        item.indexVersionMethodRemoveRoute = ''
        if (item.indexVersionMethod) {
          const temp:string[] = item.indexVersionMethod.split(',')
          temp.forEach(subItem => {
            item.indexVersionMethodRemoveRouteList.push({
              name: subItem.substring(subItem.lastIndexOf('/') + 1, subItem.length),
              url: ''
            })
            item.indexVersionMethodList.push({
              name: subItem,
              url: ''
            })
          })
          item.indexVersionMethodRemoveRoute = temp.map(subItem => subItem.substring(subItem.lastIndexOf('/') + 1, subItem.length)).join(',')
        }
      })
      console.log('获取指标版本管理数据')
      console.log(state.topicMainData)
      // 默认第一条数据
      state.topicMainData.forEach((item, index) => {
        if (index === 0) {
          item.isCurrentFocusRow = true
        } else {
          item.isCurrentFocusRow = false
        }
      })

      state.totalItems = res.data.data.total
      state.currentPage = res.data.data.current
      state.pageSize = res.data.data.size
      state.isDialogShow = true
      handleDbclickOfTopicMainData(state.topicMainData[0])
    }

    // [BTN:新增] 新增 item
    const btnAddItemData = () => {
      state.uploadFileListRemoveRoute = []
      state.uploadFileList = []
      state.addFormInfo = {
        id: '',
        title: '版本明细-新增',
        beginDate: '',
        indexVersion: '',
        indexVersionMethod: '',
        indexVersionMethodList: [],
        indexVersionMethodRemoveRoute: '',
        indexVersionMethodRemoveRouteList: []
      }
      state.isDialogVisibleForItemControl = true
    }

    // [BTN:编辑] 编辑 item
    const btnEditItemOfTopicMainData = (row:TopicMainData) => {
      console.log(row)
      if (new Date(row.beginDate).getTime() - new Date(formatDate()).getTime() >= 0) {
        state.addFormInfo = {
          id: row.id,
          title: '版本明细-编辑',
          beginDate: row.beginDate,
          indexVersion: row.indexVersion,
          indexVersionMethod: row.indexVersionMethod,
          indexVersionMethodList: row.indexVersionMethodList,
          indexVersionMethodRemoveRoute: row.indexVersionMethodRemoveRoute,
          indexVersionMethodRemoveRouteList: row.indexVersionMethodRemoveRouteList
        }
        console.log('state.addFormInfo')
        console.log(state.addFormInfo)
        state.uploadFileListRemoveRoute = JSON.parse(JSON.stringify(state.addFormInfo.indexVersionMethodRemoveRouteList))
        state.uploadFileList = JSON.parse(JSON.stringify(state.addFormInfo.indexVersionMethodList))
        state.isDialogVisibleForItemControl = true
      }
    }

    // [table] 选框选择
    const handleSelectionChangeOfTopicMainData = (val: TopicMainData[]) => {
      state.selectedListOfTopicMainData = val
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
        const res = await INSPECT_INDEX_VERSION_DELETE_API(
          state.selectedListOfTopicMainData.map(item => item.id)
        )
        if (res.data.code === 200) {
          proxy.$successToast('操作成功')
          await btnGetMainData()
        }
      })
    }

    // [BTN:确认][float]
    const btnItemFloatConfirm = async () => {
      console.log('state.addFormInfo.beginDate')
      console.log(state.addFormInfo.beginDate)
      if (state.addFormInfo.indexVersion === '') {
        proxy.$errorToast('请输入版本')
        return
      }

      if (state.addFormInfo.beginDate === '') {
        proxy.$errorToast('请输入执行开始日')
        return
      }

      if ((new Date(state.addFormInfo.beginDate).getTime() - new Date(formatDate()).getTime()) <= 0) {
        proxy.$errorToast('必须选择今天以后的日期')
        return
      }
      if (state.addFormInfo.beginDate !== '') {
        const temp:string = formatDateTransfer(state.addFormInfo.beginDate)
        state.addFormInfo.beginDate = temp
      }

      if (state.addFormInfo.title === '版本明细-新增') { // 新增
        state.addFormInfo.indexVersionMethod = state.uploadFileList.map(item => item.name).join(',')
        state.addFormInfo.indexVersionMethodList = [] // 复原
        state.addFormInfo.indexVersionMethodRemoveRoute = '' // 复原
        state.addFormInfo.indexVersionMethodRemoveRouteList = [] // 复原
        await INSPECT_INDEX_VERSION_ADD_API({
          inspectIndexMaterialId: state.inspectIndexMaterialId,
          ...state.addFormInfo
        })
      } else { // 编辑
        state.addFormInfo.indexVersionMethod = state.uploadFileList.map(item => item.name).join(',')
        state.addFormInfo.indexVersionMethodList = [] // 复原
        state.addFormInfo.indexVersionMethodRemoveRoute = '' // 复原
        state.addFormInfo.indexVersionMethodRemoveRouteList = [] // 复原

        await INSPECT_INDEX_VERSION_UPDATE_API({
          inspectIndexMaterialId: state.inspectIndexMaterialId,
          ...state.addFormInfo
        })
      }

      proxy.$successToast('操作成功')
      btnGetMainData() // reload
      btnItemFloatClear()
    }

    // [BTN:取消][float]
    const btnItemFloatClear = () => {
      // uploadOfRemoveFile()
      state.addFormInfo = {
        id: '',
        title: '',
        beginDate: '',
        indexVersion: '',
        indexVersionMethod: '',
        indexVersionMethodList: [],
        indexVersionMethodRemoveRoute: '',
        indexVersionMethodRemoveRouteList: []
      }
      state.isDialogVisibleForItemControl = false
    }

    // [Table:Row][dbclick]
    const handleDbclickOfTopicMainData = (row:TopicMainData) => {
      state.topicMainData.forEach((item:TopicMainData) => { item.isCurrentFocusRow = false })
      row.isCurrentFocusRow = true
      state.versionObj = row
      state.isDialogShow = true
    }

    const seeVersion = (row:TopicMainData, index:number) => {
      console.log(row)
      console.log(index)
      DOWNLOAD_FILE_API({ key: row.indexVersionMethodList[index].name }).then(res => {
        console.log('下载 obj')
        console.log(res.data.data)
        window.open(res.data.data.url, '_blank')
      })
    }

    const uploadOfErrorFile = () => {
      state.canUploadFile = true
      state.addFormInfo.indexVersionMethod = ''
    }

    // 上传档案前
    const httpRequest = (options:any) => {
      console.log('options')
      console.log(options)
      state.fileUploadFinish = false
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
              console.log('9999999')
              options.onSuccess(data.data.key, options)
            }
          })
        }
      })
    }

    // 上传档案后
    const uploadOfAddfileSuccess = (key:string) => {
      console.log('上传成功！')
      console.log(key)
      state.fileUploadFinish = true
      // state.fileURL = key
      state.uploadFileListRemoveRoute.push({
        name: key.substring(key.lastIndexOf('/') + 1, key.length),
        url: ''
      })
      state.uploadFileList.push({
        name: key,
        url: ''
      })

      console.log('state.uploadFileListRemoveRoute')
      console.log(state.uploadFileListRemoveRoute)
      console.log('state.uploadFileList')
      console.log(state.uploadFileList)
    }

    // 移除上传档案
    const uploadOfRemoveFile = (file:FileList) => {
      state.canUploadFile = true
      let tempIndex = null
      // 取得欲删除 index
      state.uploadFileListRemoveRoute.forEach((item, index) => {
        if (item.name === file.name) {
          tempIndex = index
        }
      })
      if (tempIndex !== null) {
        state.uploadFileListRemoveRoute.splice(tempIndex, 1)
        state.uploadFileList.splice(tempIndex, 1)
      }
      console.log('state.uploadFileListRemoveRoute')
      console.log(state.uploadFileListRemoveRoute)
      console.log('state.uploadFileList')
      console.log(state.uploadFileList)
    }

    // 移出上传档案前提示
    const beforeRemove = (file:any) => {
      if (state.canUploadFile === true) {
        return proxy.$confirm(`确定移除 ${file.name}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }
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

    const formatDateTransfer = (date:any) => {
      var d = new Date(date)
      var month = '' + (d.getMonth() + 1)
      var day = '' + d.getDate()
      var year = d.getFullYear()

      if (month.length < 2) { month = '0' + month }
      if (day.length < 2) { day = '0' + day }
      return [year, month, day].join('-')
    }

    const checkDate = (row:TopicMainData) => {
      if ((new Date(row.beginDate).getTime() - new Date(formatDate()).getTime()) <= 0) {
        return false
      }
      return true
    }

    const handleSizeChange = (pageSize: number) => { // 每页条数切换
      state.currentPage = 1
      state.pageSize = pageSize
      btnGetMainData()
    }
    const handleCurrentChange = (currentPage: number) => { // 页码切换
      state.currentPage = currentPage
      btnGetMainData()
    }

    // 时间选取限制
    const pickerOptions = (time:any) => {
      return time.getTime() < Date.now()
    }

    const tableRowFocusStyle = (object: any) => {
      if (state.topicMainData[object.rowIndex].isCurrentFocusRow === true) {
        return 'background-color: #ecf5ff' // --el-color-primary-light-9
      }
    }

    onMounted(async () => {
      console.log('我的版本号是？')
      console.log(router.currentRoute.value.query.versionID)
      if (!router.currentRoute.value.query.versionID) {
        tabsCloseCurrentHandle()
        proxy.$warningToast('版本号无法识别，请重新选择！')
        gotoPage({
          path: 'qms-pages-BasicData-TestIndex-index'
        })
        return
      }
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
      uploadOfAddfileSuccess,
      uploadOfRemoveFile,
      uploadOfErrorFile,
      refIndexValueDetail,
      upload,
      btnGetMainData,
      handleSelectionChangeOfTopicMainData,
      actBatchDelete,
      btnAddItemData,
      btnItemFloatConfirm,
      btnItemFloatClear,
      dataRule,
      handleDbclickOfTopicMainData,
      seeVersion,
      handleSizeChange,
      handleCurrentChange,
      checkDate,
      btnEditItemOfTopicMainData,
      pickerOptions,
      formatDateTransfer,
      tableRowFocusStyle,
      beforeRemove
    }
  }
})
</script>

<style lang="scss" scoped>
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
::v-deep(.el-upload.el-upload--text){
  width:100%;
  text-align: left;
}

.el-form-item__content ::v-deep(.el-upload--text){
  width: 100%;
}
// ::v-deep(.el-upload-list__item.is-success){
//   width:50%
// }

::v-deep(.el-form-item__content ){
  width:50%
}
</style>
