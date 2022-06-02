<template>
  <div class="flex flex-col justify-center h-screen">
    <div class="flex px-24px space-x-24px">
      <section
        class="card_wrapper p-10px w-7/12 h-88vh overflow-y-auto rounded-10px bg-white transition-all scroll-smooth"
      >
        <a-table
          :data="tableData"
          :pagination="false"
          :show-header="false"
          :bordered="false"
        >
          <template #columns>
            <a-table-column data-index="index" :width="50"></a-table-column>
            <a-table-column data-index="label"></a-table-column>
            <a-table-column :width="110">
              <template #cell="{ record }">
                <a-button
                  long
                  :type="
                    activeIndex.includes(record.index) ? 'primary' : 'outline'
                  "
                  status="success"
                  size="small"
                  @click="goUrl(record)"
                >
                  下载
                </a-button>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </section>

      <section class="flex-1 relative">
        <div
          class="form_wrapper card_wrapper w-400px flex flex-col p-30px my-0 mx-auto rounded-10px"
        >
          <div class="mb-24px text-22px flex">批量下载设置</div>
          <a-form :model="formData" auto-label-width :disabled="startDownload">
            <a-form-item label="下载起始">
              <a-input-number
                v-model="formData.data.fromNum"
                :style="{ width: '100%' }"
                :min="1"
                :max="tableData.length"
                hide-button
              >
                <template #prefix> 从第 </template>
                <template #suffix> 个开始 </template>
              </a-input-number>
            </a-form-item>
            <a-form-item label="下载个数">
              <a-input-number
                v-model="formData.data.downloadNum"
                :style="{ width: '100%' }"
                :min="1"
                :max="tableData.length"
                hide-button
              >
                <template #prefix> 每次 </template>
                <template #suffix> 个链接 </template>
              </a-input-number>
            </a-form-item>
          </a-form>
          <a-popconfirm
            v-if="!startDownload"
            content="确认开始下载吗？"
            position="bottom"
            @ok="startBatchDownload"
          >
            <a-button type="primary">开始批量下载</a-button>
          </a-popconfirm>
          <a-button v-else type="primary" @click="batchDownload">
            继续下载之后的{{ formData.data.downloadNum }}个链接
          </a-button>
        </div>
        <h2 class="mt-400px flex justify-center">
          <span
            class="text-70px font-bold text-light-400 select-none text-center"
          >
            装机软件下载列表
          </span>
        </h2>
      </section>
    </div>
  </div>
</template>

<script setup>
import { packageData } from '@/assets/packageData.js'
import { chunk } from 'lodash-es'
const formData = reactive({
  data: {
    fromNum: 1,
    downloadNum: 5
  }
})
const tableData = ref(
  (packageData || []).map((item, index) => {
    return {
      ...item,
      index: index + 1
    }
  })
)

const activeIndex = ref([0]) // 需要高亮的行
const startDownload = ref(false) // 是否开始下载

const currentDownLoadIndex = ref(0) // 当前下载到第几组

// 动态下载数据分组
// 二维数组，根据form表单数据动态分出多组数据
const downLoadArr = computed(() => {
  const arr = tableData.value.slice(formData.data.fromNum - 1)
  return chunk(arr, formData.data.downloadNum)
})

// 开始批量下载
function startBatchDownload() {
  startDownload.value = true
  batchDownload()
}

function batchDownload() {
  // 得到当前分组的下载数据
  const arr = downLoadArr.value?.[currentDownLoadIndex.value]
  if (!arr) return
  activeIndex.value = arr.map(item => item.index) // 高亮按钮
  arr.forEach(i => open(i.downloadUrl)) // 下载数据
  currentDownLoadIndex.value += 1 // 分组索引+1

  // 如果当前的下载分组索引+1后，大于了总的下载分组的length，则停止下载
  if (currentDownLoadIndex.value + 1 > downLoadArr.value.length) {
    downloadCompleted()
  }
}

// 下载完成
function downloadCompleted() {
  startDownload.value = false
  currentDownLoadIndex.value = 0
  activeIndex.value = []
}

// 打开链接
function goUrl(row) {
  activeIndex.value = [row.index]
  open(row.downloadUrl)
}
</script>

<style lang="scss" scoped>
.card_wrapper {
  border: 1px solid #e5e6eb;
  box-shadow: 2.8px 2.8px 2.2px -4px rgba(0, 0, 0, 0.02),
    6.7px 6.7px 5.3px -4px rgba(0, 0, 0, 0.028),
    12.5px 12.5px 10px -4px rgba(0, 0, 0, 0.035),
    22.3px 22.3px 17.9px -4px rgba(0, 0, 0, 0.042),
    41.8px 41.8px 33.4px -4px rgba(0, 0, 0, 0.05),
    100px 100px 80px -4px rgba(0, 0, 0, 0.07);
}
</style>
