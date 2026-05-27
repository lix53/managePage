<template>
  <div class="page" v-if="node">
    <van-nav-bar :title="node.nodeName" left-arrow @click-left="$router.back()" />

    <div class="card">
      <div class="bold fz-18">{{ node.nodeName }}</div>
      <div class="text-3 fz-12 mt-4">项目：{{ project?.name }}</div>
      <div class="flex-between mt-12">
        <span class="tag" :class="statusClass">{{ statusLabel }}</span>
        <span class="text-2 fz-12">截止 {{ fmt(node.deadline) }}</span>
      </div>
      <div class="mt-12 text-2 fz-13">
        负责人：<span class="bold">{{ user(node.owner).name }}</span>
      </div>
    </div>

    <div class="section-title">节点要求</div>
    <div class="card">
      <div class="fz-13 text-2">{{ desc }}</div>
    </div>

    <div class="section-title">已上传资料 ({{ node.files || 0 }})</div>
    <div class="card">
      <div v-if="!node.files" class="text-3 fz-13" style="text-align:center;padding:20px;">暂未上传任何资料</div>
      <div v-else class="file-grid">
        <div v-for="n in node.files" :key="n" class="file-thumb">
          <van-icon name="photo" size="32" color="#c8c9cc" />
          <div class="text-3 fz-12">文件{{ n }}</div>
        </div>
      </div>

      <van-uploader v-model="uploadFiles" multiple :max-count="9" class="mt-12">
        <van-button icon="plus" block plain>追加上传</van-button>
      </van-uploader>
    </div>

    <div class="section-title">操作日志</div>
    <div class="card">
      <van-steps direction="vertical" :active="0">
        <van-step v-if="node.confirmedBy">
          <h3>✓ 已确认</h3>
          <p>{{ user(node.confirmedBy).name }} · {{ fmt(node.deadline) }}</p>
        </van-step>
        <van-step>
          <h3>{{ statusLabel }}</h3>
          <p>{{ user(node.owner).name }} 处理中</p>
        </van-step>
        <van-step>
          <h3>节点创建</h3>
          <p>系统自动 · {{ fmt(node.deadline) }}</p>
        </van-step>
      </van-steps>
    </div>

    <div class="bottom-bar">
      <van-button block size="large">上传完成</van-button>
      <van-button block type="primary" size="large" @click="onSubmit">提交确认</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { useDataStore } from '@/store/data'
import { useUserStore } from '@/store/user'
import { getUserById, NODE_TEMPLATE } from '@/mock/data'

const route = useRoute()
const router = useRouter()
const store = useDataStore()
const userStore = useUserStore()
const uploadFiles = ref([])

const node = computed(() => store.nodes.find(n => n.id === route.params.nodeKey))
const project = computed(() => store.projects.find(p => p.id === route.params.projectId))
const desc = computed(() => {
  const tpl = NODE_TEMPLATE.find(t => t.key === node.value?.nodeKey)
  return tpl?.desc || '完成本节点要求的所有事项'
})
const user = (id) => getUserById(id)
const fmt = (s) => { const d = new Date(s); return `${d.getMonth() + 1}/${d.getDate()}` }

const statusLabel = computed(() => {
  return ({ todo: '待办', doing: '进行中', pending_confirm: '待确认', done: '已完成' })[node.value?.status] || node.value?.status
})
const statusClass = computed(() => {
  return ({ todo: 'tag-gray', doing: 'tag-orange', pending_confirm: 'tag-blue', done: 'tag-green' })[node.value?.status]
})

function onSubmit() {
  store.updateNodeStatus(node.value.id, 'pending_confirm', userStore.current?.id)
  showSuccessToast('已提交，等待负责人确认')
  setTimeout(() => router.back(), 800)
}
</script>

<style lang="scss" scoped>
.bottom-bar {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 480px;
  display: flex; gap: 8px; padding: 10px 12px;
  background: #fff; box-shadow: 0 -2px 8px rgba(0,0,0,0.06);
}
.file-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
}
.file-thumb {
  background: #f7f8fa; border-radius: 8px;
  padding: 16px 0; text-align: center;
}
.page { padding-bottom: 80px; }
</style>
