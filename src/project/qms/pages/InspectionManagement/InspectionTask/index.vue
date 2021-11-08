<template>
  <mds-card class="task" title="待办任务" :pack-up="false">
    <template #titleBtn>
      <div style="float: right; color: #333333;font-size: 14px;font-weight: bold;cursor: pointer" @click="goHistory"><i class="qmsIconfont qms-lishirenwu1" style="color: #487BFF"/> 历史任务</div>
    </template>
    <el-row :gutter="16">
      <el-col :span="6" v-for="(item, index) in taskList" :key="index">
        <div class="task__item" :class="{active: task === item.inspectClassify}"  @click="changeTask(item.inspectClassify)">
          <p class="task__item--title">
            <svg class="qmsIconfont" aria-hidden="true">
              <use xlink:href="#qms-lailiaofujian" v-if="item.inspectClassify === 'INCOMING'"></use>
              <use xlink:href="#qms-zhichengjianyan1" v-if="item.inspectClassify === 'PROCESS'"></use>
              <use xlink:href="#qms-shengchanfuzhujiancha" v-if="item.inspectClassify === 'ASSIST'"></use>
              <use xlink:href="#qms-linjian" v-if="item.inspectClassify === 'TEMP'"></use>
            </svg>
            <span>
              {{ item.inspectClassifyName }}
            </span>
          </p>
          <div class="task__item__flex">
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">{{ item.execute }}</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-daiwancheng"/>待完成</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">{{ item.progressing }}</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-jinrushiyan"/>进行中</p>
            </div>
            <div class="task__item__flex__item--border"/>
            <div class="task__item__flex__item">
              <p class="task__item__flex__item--big">{{ item.completed }}</p>
              <p class="task__item__flex__item--small"><i class="qmsIconfont qms-shenhetongguo"/>已完成</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </mds-card>
  <mds-card class="task-list" title="任务列表" :pack-up="false">
    <template #titleBtn>
      <el-form :inline="true" size="small" style="float: right;display: flex" @keyup.enter="() => {queryForm.current = 1; query()}" @submit.prevent>
        <el-form-item label="取样码：">
          <el-input v-model="queryForm.sampleCode" placeholder="请输入" style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item label="检验内容：">
          <el-input v-model="queryForm.inspectContent" placeholder="请输入" style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="() => {queryForm.current = 1; query()}">查询</el-button>
          <el-button icon="el-icon-plus" @click="goInspect()">检验</el-button>
          <el-button type="primary" @click="goPrint()"><i class="qmsIconfont qms-jianyan3" /> 打印</el-button>
        </el-form-item>
      </el-form>
    </template>
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
</template>

<script lang="ts">
import { ComponentInternalInstance, defineComponent, getCurrentInstance, reactive, ref } from 'vue'
import layoutTs from '@/components/layout/layoutTs'

export default defineComponent({
  name: 'inspectionTask',
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as any
    const { gotoPage } = layoutTs()
    const taskList = ref<any[]>([]) // 任务汇总
    const queryForm = reactive({
      taskSampleClassify: '',
      inspectContent: '',
      taskStatus: '',
      sampleCode: '',
      current: 1,
      size: 10,
      total: 0
    }) // 查询表单数据

    // 跳转历史任务
    const goHistory = () => {
      gotoPage({
        path: 'qms-pages-SampleManagement-SampleSampling-historyTask'
      })
    }
    // 查询
    const query = async () => {
      console.log(1)
    }
    // 切换任务分类
    const changeTask = (val: string) => {
      console.log(val)
    }
    // 检验
    const goInspect = () => {
      gotoPage({
        path: 'qms-pages-SampleManagement-SampleSampling-historyTask'
      })
    }
    // 打印
    const goPrint = () => {
      console.log(1)
    }

    return {
      taskList,
      queryForm,
      goHistory,
      changeTask,
      query,
      goInspect,
      goPrint
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
        display: flex;
        line-height: 22px;
        .qmsIconfont{
          width: 22px;
          height: 22px;
          margin-right: 3px;
        }
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
  .status{
    position: relative;
    padding-left: 15px;
    &::before {
      content: "";
      display: block;
      border-radius: 50%;
      position: absolute;
      top: 7px;
      left: 0;
      width: 6px;
      height: 6px;
    }
  }
  .yellow::before{
    background: #FFBF00;
  }
  .blue::before{
    background: #487BFF;
  }
  .grey::before{
    background: #D8D8D8;
  }
  .green::before{
    background: #7ED321;
  }
</style>
