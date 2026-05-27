<template>
  <div class="page">
    <van-nav-bar title="发货管理" left-arrow @click-left="$router.back()" />

    <div class="card">
      <div class="bold fz-16">{{ project?.name }}</div>
      <div class="text-3 fz-12 mt-4">{{ project?.customer.address }}</div>
    </div>

    <div class="section-title">发货记录</div>
    <div v-if="shipments.length === 0" class="empty">暂无发货记录</div>
    <div v-for="s in shipments" :key="s.id" class="card">
      <div class="flex-between">
        <div class="bold">{{ s.no }}</div>
        <span class="tag" :class="s.status === 'signed' ? 'tag-green' : 'tag-orange'">
          {{ s.status === 'signed' ? '已签收' : '运输中' }}
        </span>
      </div>
      <div class="text-2 fz-13 mt-8">物流单号：{{ s.logisticsNo }}</div>
      <div class="text-2 fz-13 mt-4">司机：{{ s.driver }}</div>
      <div class="text-3 fz-12 mt-4">发货时间：{{ fmt(s.date) }}</div>
    </div>

    <div class="section-title">新建发货单</div>
    <van-cell-group inset>
      <van-field label="清单核对">
        <template #input>
          <div>
            <div v-for="item in checklist" :key="item.key" class="check-item">
              <van-checkbox v-model="item.checked">{{ item.name }}</van-checkbox>
            </div>
          </div>
        </template>
      </van-field>
      <van-field label="打包照片">
        <template #input>
          <van-uploader v-model="photos" multiple :max-count="9" />
        </template>
      </van-field>
      <van-field v-model="form.logisticsNo" label="物流单号" placeholder="选填" />
      <van-field v-model="form.driver" label="司机电话" placeholder="选填" />
    </van-cell-group>

    <div style="padding: 20px 16px 80px;">
      <van-button block type="primary" round @click="onSubmit">确认发货</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { showSuccessToast } from 'vant'
import { useDataStore } from '@/store/data'

const route = useRoute()
const store = useDataStore()
const photos = ref([])

const project = computed(() => store.projects.find(p => p.id === route.params.projectId))
const shipments = computed(() => store.shipments.filter(s => s.projectId === route.params.projectId))

const checklist = ref([
  { key: 'list', name: '灯具清单', checked: false },
  { key: 'accessory', name: '配件', checked: false },
  { key: 'power', name: '电源驱动', checked: false },
  { key: 'controller', name: '控制器', checked: false },
  { key: 'bracket', name: '支架', checked: false },
  { key: 'wire', name: '线材', checked: false },
  { key: 'spare', name: '备品备件', checked: false }
])

const form = reactive({ logisticsNo: '', driver: '' })
const fmt = (s) => { const d = new Date(s); return `${d.getMonth() + 1}/${d.getDate()}` }

function onSubmit() {
  showSuccessToast('发货已记录（模拟）')
}
</script>

<style lang="scss" scoped>
.check-item { margin: 6px 0; }
.empty { text-align: center; color: #969799; padding: 30px; }
</style>
