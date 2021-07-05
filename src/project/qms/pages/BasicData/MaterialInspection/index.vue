<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-07-05 16:00:17
 * @LastEditors: Telliex
 * @LastEditTime: 2021-07-05 17:14:37
-->
<template>
  <tree-page
    :title="'物料分类'"
    :leftTitle="'物料分类'"
    :rightTitle="'物料明细'"
    :treeData="treeData"
    :treeProps="{ label: 'name' }"
  >
    <template #context--menu>
      <ul>
        <li>分配</li>
      </ul>
    </template>
    <template #view>
     <el-table :data="tableData"
    style="width: 100%"
    height="250">
        <el-table-column type="index" :index="indexMethod" label="序号" width="55" fixed />
        <el-table-column label="编码" prop="codingString" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="名称" prop="materialName" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="归属上级"  prop="parentNode" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column label="品项" prop="className" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column fixed="right" label="操作" header-align="left" align="left" width="100">
            <template #default>
                <el-button>
                    编辑
                </el-button>
            </template>
        </el-table-column>
      </el-table>

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[10, 20, 50]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
    </template>
  </tree-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MaterialInspection',
  setup () {
    const treeData = ref([
      {
        id: 1,
        name: 'ssb',
        children: [
          { id: 1, name: 'yyds' }
        ]
      }
    ])

    const tableData = [{
      date: '2016-05-03',
      name: '王小虎',
      province: '上海',
      city: '普陀区',
      address: '上海市普陀区金沙江路 1518 弄',
      zip: 200333
    }]

    return {
      treeData,
      tableData
    }
  }
})
</script>

<style scoped>

</style>
