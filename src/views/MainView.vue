<template>
  <div class="h-screen flex">
    <div class="w-full flex px-24px pb-48px pt-32px space-x-24px lt-xl:p-0">
      <section
        class="card_wrapper relative h-full w-7/12 flex flex-col rounded-10px bg-white p-10px transition-all lt-md:(w-full) lt-xl:(rounded-none) !lt-xl:border-y-none !lt-xl:border-l-none !lt-xl:shadow-none"
      >
        <div class="mb-8px">
          <a-input
            ref="搜索框Ref"
            v-model="searchText"
            class="transition-all"
            placeholder="搜索"
            allow-clear
          ></a-input>
        </div>
        <div
          class="flex-1 overflow-y-auto scroll-smooth"
          style="scrollbar-gutter: stable"
        >
          <a-table
            :data="calcTableData"
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
                    :type="activeIndex.includes(record.index) ? 'primary' : 'outline'"
                    status="success"
                    size="small"
                    :row-url="record.downloadUrl"
                    @click="goUrl(record)"
                  >
                    下载
                  </a-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
      </section>

      <section class="relative flex-1 lt-md:(hidden) lt-xl:(flex items-center pr-16px)">
        <div
          class="card_wrapper mx-auto my-0 w-400px flex flex-col rounded-10px p-30px transition-all lt-xl:(w-320px)"
        >
          <div class="mb-24px flex text-22px">批量下载设置</div>
          <a-form :model="formData" auto-label-width :disabled="startDownload">
            <a-form-item label="下载起始">
              <a-input-number
                v-model="formData.data.fromNum"
                :style="{ width: '100%' }"
                :min="1"
                :max="calcTableData.length"
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
                :max="calcTableData.length"
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
            <a-button type="primary" :disabled="!!searchText">开始批量下载</a-button>
          </a-popconfirm>
          <a-button v-else type="primary" @click="batchDownload">
            继续下载之后的{{ formData.data.downloadNum }}个链接
          </a-button>
        </div>
        <h2 class="mt-400px flex justify-center lt-xl:hidden">
          <span class="select-none text-center text-70px font-bold text-light-400">
            装机软件下载列表
          </span>
        </h2>
      </section>
    </div>
  </div>
</template>

<script setup>
import packageData from '@/assets/packageData.json'
import Fuse from 'fuse.js'
import { chunk } from 'lodash-es'
import { Message } from '@arco-design/web-vue'
const searchText = ref('')
const 搜索框Ref = ref()

onMounted(() => {
  搜索框Ref.value.focus()
})
const formData = reactive({
  data: {
    fromNum: 1,
    downloadNum: 5,
  },
})
const tableData = ref(
  (packageData || []).map((item, index) => {
    return {
      ...item,
      index: index + 1,
    }
  })
)

const fuse = new Fuse(tableData.value, {
  keys: ['label'],
  includeScore: true,
  threshold: 0.5,
})

const calcTableData = computed(() => {
  if (!searchText.value) {
    return tableData.value
  }
  return fuse.search(searchText.value).map(result => result.item)
})

const activeIndex = ref([0]) // 需要高亮的行
const startDownload = ref(false) // 是否开始下载

const currentDownLoadIndex = ref(0) // 当前下载到第几组

// 动态下载数据分组
// 二维数组，根据form表单数据动态分出多组数据
const downLoadArr = computed(() => {
  const arr = calcTableData.value.slice(formData.data.fromNum - 1)
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

const { copy } = useClipboard()
// 打开链接
async function goUrl(row) {
  activeIndex.value = [row.index]
  if (row.code) {
    Message.success('已自动复制提取码')
    await copy(row.code)
  }
  open(row.downloadUrl)
}

watch(searchText, (newVal, oldVal) => {
  if (!!oldVal && !newVal) {
    formData.data = {
      fromNum: 1,
      downloadNum: 5,
    }
  }
})

const { ctrl_f } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'f' && e.type === 'keydown') e.preventDefault()
  },
})

whenever(ctrl_f, () => {
  搜索框Ref.value.focus()
})
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
