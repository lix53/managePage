<template>
  <div class="page">
    <van-nav-bar title="素材库" left-arrow @click-left="$router.back()" />

    <div class="card">
      <div class="bold fz-16">{{ project?.name }}</div>
      <div class="text-3 fz-12 mt-4">案例素材沉淀 · 由严静负责整理</div>
    </div>

    <div class="section-title">素材分类</div>
    <div v-if="assets.length === 0" class="empty">还没有素材，去拍一些吧 📷</div>
    <div v-for="a in assets" :key="a.id" class="card">
      <div class="flex-between">
        <div class="bold">{{ a.type }}</div>
        <span class="tag" :class="statusClass(a.status)">{{ statusLabel(a.status) }}</span>
      </div>
      <div class="text-3 fz-12 mt-4">共 {{ a.count }} 个文件 · 更新于 {{ fmt(a.updateAt) }}</div>
      <div class="photo-grid mt-8">
        <div v-for="n in Math.min(a.count, 6)" :key="n" class="photo">
          <van-icon name="photo" size="28" color="#c8c9cc" />
        </div>
      </div>
    </div>

    <div class="section-title">快速上传</div>
    <div class="card">
      <van-uploader v-model="files" multiple :max-count="9" />
      <div class="mt-12">
        <van-button block type="primary" size="small" @click="onUpload">上传到素材库</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { showSuccessToast } from 'vant'
import { useDataStore } from '@/store/data'

const route = useRoute()
const store = useDataStore()
const files = ref([])

const project = computed(() => store.projects.find(p => p.id === route.params.projectId))
const assets = computed(() => store.media.filter(m => m.projectId === route.params.projectId))

const fmt = (s) => { const d = new Date(s); return `${d.getMonth() + 1}/${d.getDate()}` }
const statusLabel = (s) => ({ unsorted: '未整理', sorted: '已整理', published: '已发布', unsuitable: '不适合发布' }[s])
const statusClass = (s) => ({ unsorted: 'tag-gray', sorted: 'tag-blue', published: 'tag-green', unsuitable: 'tag-red' }[s])

function onUpload() {
  if (files.value.length === 0) return
  showSuccessToast(`已上传 ${files.value.length} 个文件（模拟）`)
  files.value = []
}
</script>

<style lang="scss" scoped>
.empty { text-align: center; color: #969799; padding: 30px; }
.photo-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;
}
.photo {
  background: #f7f8fa; border-radius: 6px;
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
}
</style>
