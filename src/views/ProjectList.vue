<template>
  <div class="page">
    <van-nav-bar title="项目列表" left-arrow @click-left="$router.push('/main/dashboard')">
      <template #right>
        <van-icon name="plus" size="20" @click="$router.push('/project/new')" />
      </template>
    </van-nav-bar>

    <van-search v-model="keyword" placeholder="搜索项目名/客户/编号" shape="round" />

    <van-tabs v-model:active="tab" @change="onTabChange" sticky offset-top="46">
      <van-tab title="全部" name="all" />
      <van-tab title="进行中" name="running" />
      <van-tab title="超期" name="overdue" />
      <van-tab title="待发货" name="ship" />
      <van-tab title="待验收" name="accept" />
      <van-tab title="待回款" name="unpaid" />
      <van-tab title="已完成" name="done" />
    </van-tabs>

    <div class="list">
      <div v-if="filtered.length === 0" class="empty">暂无项目</div>
      <div v-else v-for="p in filtered" :key="p.id" class="card project-card" @click="goDetail(p.id)">
        <div class="flex-between">
          <div class="flex-1">
            <div class="bold fz-16">{{ p.name }}</div>
            <div class="text-3 fz-12 mt-4">{{ p.code }} · {{ p.customer.name }}</div>
          </div>
          <span class="tag" :class="'tag-' + status(p.status).color">{{ status(p.status).name }}</span>
        </div>

        <div class="flex-between mt-12">
          <div class="text-2 fz-12">
            <van-icon name="user-o" /> {{ owner(p) }}
          </div>
          <div class="text-2 fz-12">
            <van-icon name="clock-o" /> {{ formatDate(p.expectFinishDate) }}
          </div>
        </div>

        <div class="amount-row mt-8">
          <div>
            <div class="text-3 fz-12">合同金额</div>
            <div class="bold fz-14">¥{{ (p.contractAmount/10000).toFixed(1) }}万</div>
          </div>
          <div>
            <div class="text-3 fz-12">未收金额</div>
            <div class="bold fz-14" :class="{ 'text-danger': p.contractAmount - p.receivedAmount > 0 }">
              ¥{{ ((p.contractAmount - p.receivedAmount)/10000).toFixed(1) }}万
            </div>
          </div>
          <div>
            <div class="text-3 fz-12">状态</div>
            <div class="bold fz-14">
              <span v-if="p.overdue" class="text-danger">超期 ⚠️</span>
              <span v-else class="text-success">正常</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-floating-bubble icon="plus" @click="$router.push('/project/new')" />
  </div>
</template>

<script setup>
import { ref, computed, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '@/store/data'
import { getStatusInfo, getUserById } from '@/mock/data'

defineOptions({ name: 'ProjectList' })

const route = useRoute()
const router = useRouter()
const store = useDataStore()
const keyword = ref('')
const tab = ref(route.query.filter || route.query.status || 'all')

onActivated(() => {
  if (route.query.filter) tab.value = route.query.filter
  if (route.query.status) tab.value = route.query.status
})

const filtered = computed(() => {
  let list = store.projects
  const t = tab.value
  if (t === 'running') list = list.filter(p => !['done', 'closed'].includes(p.status))
  else if (t === 'overdue') list = list.filter(p => p.overdue)
  else if (t === 'ship') list = list.filter(p => p.status === 'ship')
  else if (t === 'accept') list = list.filter(p => p.status === 'accept')
  else if (t === 'unpaid') list = list.filter(p => (p.contractAmount - p.receivedAmount) > 0 && p.status !== 'closed')
  else if (t === 'done') list = list.filter(p => p.status === 'done')
  if (keyword.value) {
    const k = keyword.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(k) ||
      p.code.toLowerCase().includes(k) ||
      p.customer.name.toLowerCase().includes(k)
    )
  }
  return list
})

const status = (k) => getStatusInfo(k)
const owner = (p) => {
  const u = getUserById(p.managers.engineer)
  return u.name
}
const formatDate = (s) => {
  const d = new Date(s); return `${d.getMonth() + 1}/${d.getDate()}`
}
const goDetail = (id) => router.push(`/project/${id}`)
function onTabChange(name) {
  router.replace({ path: '/main/projects', query: { filter: name } })
}
</script>

<style lang="scss" scoped>
.list { padding-bottom: 80px; }
.project-card { cursor: pointer; }
.amount-row {
  display: flex; justify-content: space-between;
  background: #f7f8fa; border-radius: 8px; padding: 8px 12px;
  > div { text-align: left; }
}
.empty { text-align: center; color: #969799; padding: 40px; }
</style>
