<template>
  <div class="page">
    <van-nav-bar title="问题闭环">
      <template #right>
        <van-icon name="plus" size="20" @click="$router.push('/issue/new')" />
      </template>
    </van-nav-bar>

    <van-tabs v-model:active="tab" sticky offset-top="46">
      <van-tab title="全部" name="all" />
      <van-tab title="待处理" name="todo" />
      <van-tab title="处理中" name="doing" />
      <van-tab title="待确认" name="pending_confirm" />
      <van-tab title="已关闭" name="closed" />
    </van-tabs>

    <div class="list">
      <div v-if="filtered.length === 0" class="empty">暂无问题</div>
      <div v-for="i in filtered" :key="i.id" class="card" @click="$router.push(`/issue/${i.id}`)">
        <div class="flex-between">
          <div class="flex-1">
            <div class="bold fz-15">{{ i.title }}</div>
            <div class="text-3 fz-12 mt-4">{{ i.projectName }}</div>
          </div>
          <span class="tag" :class="statusClass(i)">{{ statusLabel(i) }}</span>
        </div>
        <div class="mt-8 flex-between">
          <div class="text-2 fz-12">
            <span class="type-pill">{{ i.type }}</span>
            <span class="ml-8"><van-icon name="user-o" /> {{ user(i.assignee).name }}</span>
          </div>
          <div class="fz-12" :class="overdue(i) ? 'text-danger' : 'text-3'">
            <van-icon name="clock-o" /> {{ fmt(i.deadline) }}
          </div>
        </div>
        <div class="text-3 fz-12 mt-4">
          <van-icon name="photo-o" /> {{ i.photos }} 张照片 · 提交人 {{ user(i.owner).name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDataStore } from '@/store/data'
import { getUserById } from '@/mock/data'

defineOptions({ name: 'IssueList' })

const store = useDataStore()
const tab = ref('all')

const filtered = computed(() => {
  if (tab.value === 'all') return store.issues
  return store.issues.filter(i => i.status === tab.value)
})

const user = (id) => getUserById(id)
const fmt = (s) => { const d = new Date(s); return `${d.getMonth() + 1}/${d.getDate()}` }
const overdue = (i) => new Date(i.deadline).getTime() < Date.now() && !['closed', 'resolved'].includes(i.status)

function statusLabel(i) {
  return ({ todo: '待处理', doing: '处理中', pending_confirm: '待确认', resolved: '已解决', closed: '已关闭' })[i.status] || i.status
}
function statusClass(i) {
  if (overdue(i)) return 'tag-red'
  return ({ todo: 'tag-red', doing: 'tag-orange', pending_confirm: 'tag-blue', resolved: 'tag-green', closed: 'tag-gray' })[i.status]
}
</script>

<style lang="scss" scoped>
.list { padding-bottom: 80px; }
.empty { text-align: center; color: #969799; padding: 40px; }
.type-pill {
  display: inline-block; padding: 1px 6px;
  background: #f0f4fb; color: #1F3864;
  border-radius: 3px; font-size: 11px;
}
</style>
