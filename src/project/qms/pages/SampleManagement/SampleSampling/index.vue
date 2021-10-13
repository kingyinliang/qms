<template>
  <mds-card class="task" title="待办任务" :pack-up="false">
    <template #titleBtn>
      <div style="float: right; color: #333333;font-size: 14px;font-weight: bold;cursor: pointer" @click="goHistory"><i class="qmsIconfont qms-lishirenwu1" style="color: #487BFF"/> 历史任务</div>
    </template>
    <el-row :gutter="16">
      <el-col :span="6">
        <div class="task__item" :class="{active: task === 1}"  @click="changeTask(1)">
          <p class="task__item--title">
            <i class="qmsIconfont qms-lailiaofujian" style="font-size: 20px;color: #487BFF"/>
            来料检验
          </p>
          <div class="task__item__flex">
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">16</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>待完成</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">16</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>进行中</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">16</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>已完成</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="task__item" :class="{active: task === 2}"  @click="changeTask(2)">
          <p class="task__item--title">
            <i class="qmsIconfont qms-zhichengjianyan1" style="font-size: 20px;color: #487BFF"/>
            制程检验
          </p>
          <div class="task__item__flex">
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">16</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>待完成</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">16</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>进行中</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">16</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>已完成</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="task__item" :class="{active: task === 3}" @click="changeTask(3)">
          <p class="task__item--title">
            <i class="qmsIconfont qms-shengchanfuzhujiancha" style="font-size: 20px;color: #487BFF"/>
            生产辅助检验
          </p>
          <div class="task__item__flex">
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">16</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>待完成</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">16</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>进行中</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">16</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>已完成</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="task__item" :class="{active: task === 4}" @click="changeTask(4)">
          <p class="task__item--title">
            <i class="qmsIconfont qms-linjian" style="font-size: 20px;color: #487BFF"/>
            临时检验
          </p>
          <div class="task__item__flex">
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">16</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>待完成</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">16</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>进行中</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">16</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>已完成</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </mds-card>
  <mds-card class="task-list" title="任务列表" :pack-up="false">
    <template #titleBtn>
      <el-form :inline="true" size="small" style="float: right;display: flex">
        <el-form-item label="取样码：">
          <el-input v-model="queryForm.itemCodeOrName" style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item label="检验内容：">
          <el-input v-model="queryForm.itemCodeOrName" style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-input v-model="queryForm.itemCodeOrName" style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="() => {queryForm.current = 1; query()}">查询</el-button>
          <el-button v-if="task !== 4" icon="el-icon-plus" @click="addOrUpdate">新建</el-button>
          <el-button type="primary"><i class="qmsIconfont qms-jianyan3" /> 取样</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table border :cell-style="{'text-align':'center'}" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" fixed="left" :index="(index) => index + 1 + (queryForm.current - 1) * queryForm.size" label="序号" width="50" />
      <el-table-column label="样品码" prop="itemCode" :show-overflow-tooltip="true" />
      <el-table-column label="状态" prop="itemName" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="检验内容" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 2" label="订单" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 1 || task === 2" label="物料信息" prop="created" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 2" label="品项" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 2" label="取样信息" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 2 || task === 3" label="取样说明" prop="creator" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 1" label="物料批次" prop="changer" min-width="150" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 1" label="供应商" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 1 || task === 3" label="任务触发时间" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 3" label="取样截至时间" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 4" label="发布人" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column v-if="task === 4" label="发布时间" prop="changed" min-width="165" :show-overflow-tooltip="true" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="scope">
          <el-button type="text" icon="qmsIconfont qms-guanlian" class="role__btn" @click="updateMaterial(scope.row)">
            关联物料
          </el-button>
          <el-button type="text" icon="iconfont factory-luru" class="role__btn">
            编辑
          </el-button>
          <el-button style="color: #EF4632" type="text" icon="el-icon-delete" class="role__btn">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="float: right">
      <el-pagination
        :page-size="queryForm.size"
        :current-page="queryForm.current"
        :total="queryForm.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="val => {queryForm.size = val;query()}"
        @current-change="val => {queryForm.current = val; query()}"
      />
    </el-row>
  </mds-card>
  <el-dialog v-model="addOrUpdateDialog" title="任务" width="30%">
    <el-form v-if="task === 1" size="small" :model="addOrUpdateForm" label-width="85px">
      <el-form-item label="检验类：">
        <el-input v-model="addOrUpdateForm.itemCodeOrName"></el-input>
      </el-form-item>
      <el-form-item label="物料信息：">
        <el-input v-model="addOrUpdateForm.itemCodeOrName"></el-input>
      </el-form-item>
      <el-form-item label="批次：">
        <el-input v-model="addOrUpdateForm.itemCodeOrName"></el-input>
      </el-form-item>
      <el-form-item label="品项：">
        <el-input v-model="addOrUpdateForm.itemCodeOrName"></el-input>
      </el-form-item>
      <el-form-item label="供应商：">
        <el-input v-model="addOrUpdateForm.itemCodeOrName"></el-input>
      </el-form-item>
    </el-form>
    <el-form v-if="task === 2" size="small" :model="addOrUpdateForm" label-width="85px">
      <el-form-item label="检验类：">
        <el-input v-model="addOrUpdateForm.itemCodeOrName"></el-input>
      </el-form-item>
      <el-form-item label="物料信息：">
        <el-input v-model="addOrUpdateForm.itemCodeOrName"></el-input>
      </el-form-item>
      <el-form-item label="生产订单：">
        <el-input v-model="addOrUpdateForm.itemCodeOrName"></el-input>
      </el-form-item>
      <el-form-item label="品项：">
        <el-input v-model="addOrUpdateForm.itemCodeOrName"></el-input>
      </el-form-item>
      <el-form-item label="取样信息：">
        <el-input v-model="addOrUpdateForm.itemCodeOrName"></el-input>
      </el-form-item>
    </el-form>
    <el-form v-if="task === 3" size="small" :model="addOrUpdateForm" label-width="85px">
      <el-form-item label="检验类：">
        <el-input v-model="addOrUpdateForm.itemCodeOrName"></el-input>
      </el-form-item>
      <el-form-item label="取样信息：">
        <el-input v-model="addOrUpdateForm.itemCodeOrName"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
      <el-button size="small" icon="el-icon-circle-close" @click="addOrUpdateDialog = false">取消</el-button>
      <el-button size="small" icon="el-icon-circle-check" type="primary" @click="updateFormSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import layoutTs from '@/components/layout/layoutTs'

interface TableData{
  id?: string
}
export default defineComponent({
  name: 'SampleSampling',
  setup () {
    const { gotoPage } = layoutTs()
    const task = ref(1)
    const addOrUpdateDialog = ref(false)
    const queryForm = reactive({
      itemCodeOrName: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据
    const tableData = ref<TableData[]>([]) // 表格数据
    const addOrUpdateForm = ref({})

    const query = () => {
      console.log(1)
    }
    const changeTask = (val: number) => {
      task.value = val
      queryForm.current = 1
      query()
    }
    const goHistory = () => {
      gotoPage({
        path: 'qms-pages-SampleManagement-SampleSampling-historyTask'
      })
    }
    const addOrUpdate = () => {
      addOrUpdateDialog.value = true
    }
    const updateFormSubmit = () => {
      addOrUpdateDialog.value = false
    }

    return {
      task,
      addOrUpdateDialog,
      queryForm,
      tableData,
      addOrUpdateForm,
      changeTask,
      goHistory,
      query,
      addOrUpdate,
      updateFormSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.task{
  border: none;
  box-shadow: none;
  padding: 0!important;
  &__item{
    cursor: pointer;
    height: 140px;
    background: white;
    padding: 14px 10px;
    box-shadow: 3px 3px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(171, 171, 171, 0.5);
    &--title{
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    &__flex{
      display: flex;
      align-items: center;
      margin-top: 23px;
      &__item{
        flex: 1;
        text-align: center;
        &--big{
          font-size: 32px;
          font-weight: bold;
        }
        &--small{
          font-size: 14px;
        }
        &--border{
          width: 2px;
          height: 30px;
          background: #999999;
        }
        i{
          color: #487BFF;
          margin-right: 4px;
        }
      }
    }
  }
  .active{
    border: 1px solid #487BFF
  }
}
.task-list{
  background: white;
  .el-form-item{
    margin-bottom: 11px;
  }
}
</style>
