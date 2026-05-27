<template>
  <div class="page" v-if="issue">
    <van-nav-bar title="问题详情" left-arrow @click-left="$router.back()" />

    <div class="card">
      <div class="flex-between">
        <div class="bold fz-16">{{ issue.title }}</div>
        <span class="tag" :class="statusClass">{{ statusLabel }}</span>
      </div>
      <div class="text-3 fz-12 mt-4">{{ issue.projectName }}</div>
      <div class="flex-between mt-12">
        <span class="type-pill">{{ issue.type }}</span>
        <span class="text-2 fz-12">截止 {{ fmt(issue.deadline) }}</span>
      </div>
    </div>

    <div class="section-title">现场照片 ({{ issue.photos }})</div>
    <div class="card">
      <div class="photo-grid">
        <div v-for="n in issue.photos" :key="n" class="photo">
          <van-icon name="photo" size="36" color="#c8c9cc" />
        </div>
      </div>
    </div>

    <div class="section-title">责任与处理</div>
    <div class="card">
      <van-cell-group :border="false">
        <van-cell title="提交人" :value="user(issue.owner).name" />
        <van-cell title="责任部门" :value="issue.department" />
        <van-cell title="处理人" :value="user(issue.assignee).name" />
        <van-cell title="提交时间" :value="fmt(issue.createdAt)" />
      </van-cell-group>
    </div>

    <div class="section-title">处理流程（闭环留痕）</div>
    <div class="card">
      <van-steps direction="vertical" :active="step">
        <van-step><h3>问题提交</h3><p>{{ user(issue.owner).name }} · {{ fmt(issue.createdAt) }}</p></van-step>
        <van-step><h3>指派处理人</h3><p>{{ user(issue.assignee).name }}</p></van-step>
        <van-step><h3>处理中</h3><p>填写处理方案 + 上传处理照片</p></van-step>
        <van-step><h3>待确认</h3><p>提交方确认是否解决</p></van-step>
        <van-step><h3>已关闭</h3><p>形成闭环记录</p></van-step>
      </van-steps>
    </div>

    <div class="bottom-bar">
      <van-button block @click="next('doing')" :disabled="issue.status !== 'todo'">开始处理</van-button>
      <van-button block @click="next('pending_confirm')" :disabled="issue.status !== 'doing'">提交确认</van-button>
      <van-button block type="primary" @click="next('closed')" :disabled="issue.status !== 'pending_confirm'">闭环关闭</van-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { showSuccessToast } from 'vant'
import { useDataStore } from '@/store/data'
import { getUserById } from '@/mock/data'

const route = useRoute()
const store = useDataStore()

const issue = computed(() => store.issues.find(i => i.id === route.params.id))
const user = (id) => getUserById(id)
const fmt = (s) => { const d = new Date(s); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` }

const statusLabel = computed(() => ({ todo: '待处理', doing: '处理中', pending_confirm: '待确认', resolved: '已解决', closed: '已关闭' }[issue.value?.status]))
const statusClass = computed(() => ({ todo: 'tag-red', doing: 'tag-orange', pending_confirm: 'tag-blue', resolved: 'tag-green', closed: 'tag-gray' }[issue.value?.status]))

const step = computed(() => ({ todo: 1, doing: 2, pending_confirm: 3, closed: 4 }[issue.value?.status] || 0))

function next(status) {
  store.updateIssueStatus(issue.value.id, status)
  showSuccessToast('状态已更新')
}
</script>

<style lang="scss" scoped>
.bottom-bar {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 480px;
  display: flex; gap: 6px; padding: 10px 12px;
  background: #fff; box-shadow: 0 -2px 8px rgba(0,0,0,0.06);
}
.page { padding-bottom: 80px; }
.photo-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
}
.photo {
  background: #f7f8fa; border-radius: 8px;
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
}
.type-pill {
  display: inline-block; padding: 2px 8px;
  background: #f0f4fb; color: #1F3864;
  border-radius: 4px; font-size: 12px;
}
</style>
