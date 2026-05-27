<template>
  <div class="page dashboard">
    <!-- 顶部蓝色头部 -->
    <div class="header">
      <div class="hello">
        <div class="greet">{{ greet }}，{{ userStore.name }}</div>
        <div class="role">{{ roleName }} · 今天是 {{ today }}</div>
      </div>
      <div class="header-stats">
        <div class="stat">
          <div class="num">{{ store.runningProjects.length }}</div>
          <div class="label">进行中项目</div>
        </div>
        <div class="stat">
          <div class="num text-warn">{{ store.overdueTasks.length }}</div>
          <div class="label">超期任务</div>
        </div>
        <div class="stat">
          <div class="num text-danger">{{ store.openIssues.length }}</div>
          <div class="label">未闭环问题</div>
        </div>
      </div>
    </div>

    <!-- 八大看板卡片 -->
    <div class="section-title">老板看板（3分钟看清全公司）</div>
    <div class="grid">
      <div class="grid-card" @click="goList({ filter: 'today' })">
        <van-icon name="todo-list-o" class="icon" color="#2F5496" />
        <div class="num">{{ store.todayTasks.length }}</div>
        <div class="label">今日待处理</div>
      </div>
      <div class="grid-card warn" @click="goList({ filter: 'overdue' })">
        <van-icon name="warning-o" class="icon" color="#ff976a" />
        <div class="num">{{ store.overdueProjects.length }}</div>
        <div class="label">超期项目</div>
      </div>
      <div class="grid-card danger" @click="goIssues">
        <van-icon name="info-o" class="icon" color="#ee0a24" />
        <div class="num">{{ store.openIssues.length }}</div>
        <div class="label">未闭环问题</div>
      </div>
      <div class="grid-card" @click="goList({ status: 'ship' })">
        <van-icon name="logistics" class="icon" color="#ff976a" />
        <div class="num">{{ store.pendingShipProjects.length }}</div>
        <div class="label">待发货</div>
      </div>
      <div class="grid-card" @click="goList({ status: 'accept' })">
        <van-icon name="passed" class="icon" color="#07c160" />
        <div class="num">{{ store.pendingAcceptProjects.length }}</div>
        <div class="label">待验收</div>
      </div>
      <div class="grid-card money" @click="goList({ filter: 'unpaid' })">
        <van-icon name="balance-o" class="icon" color="#ee0a24" />
        <div class="num">¥{{ (store.unpaidAmount/10000).toFixed(1) }}<span class="unit">万</span></div>
        <div class="label">待回款金额</div>
      </div>
    </div>

    <!-- 超期项目列表 -->
    <div class="section-title">⚠️ 超期项目（红灯优先处理）</div>
    <div v-if="store.overdueProjects.length === 0" class="empty">暂无超期项目 🎉</div>
    <div v-else>
      <div v-for="p in store.overdueProjects" :key="p.id" class="card project-card" @click="goDetail(p.id)">
        <div class="flex-between">
          <div class="bold fz-16">{{ p.name }}</div>
          <span class="tag tag-red">超期</span>
        </div>
        <div class="text-3 fz-12 mt-4">{{ p.code }} · {{ p.customer.name }}</div>
        <div class="flex-between mt-8">
          <span class="tag" :class="'tag-' + getStatus(p.status).color">{{ getStatus(p.status).name }}</span>
          <span class="text-2 fz-12">未收 ¥{{ ((p.contractAmount - p.receivedAmount)/10000).toFixed(1) }}万</span>
        </div>
      </div>
    </div>

    <!-- 人员责任 -->
    <div class="section-title">👥 人员责任</div>
    <div class="card">
      <div v-for="w in store.workloadByUser" :key="w.user.id" class="workload-row">
        <div class="avatar-small">{{ w.user.name[0] }}</div>
        <div class="flex-1 ml-8">
          <div class="bold fz-14">{{ w.user.name }} <span class="text-3 fz-12">· {{ w.user.dept }}</span></div>
          <div class="text-3 fz-12 mt-4">
            待办 {{ w.pending }} · <span class="text-danger">超期 {{ w.overdue }}</span> · 问题 {{ w.issues }}
          </div>
        </div>
        <van-icon name="arrow" color="#c8c9cc" />
      </div>
    </div>

    <div class="footer-tip">基于 14 状态机的项目推进系统 · 数据每日 00:00 重算</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useDataStore } from '@/store/data'
import { getStatusInfo } from '@/mock/data'

defineOptions({ name: 'Dashboard' })

const router = useRouter()
const userStore = useUserStore()
const store = useDataStore()

const greet = computed(() => {
  const h = new Date().getHours()
  if (h < 11) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})
const today = new Date().toLocaleDateString('zh-CN')
const roleName = computed(() => {
  const map = { boss: '老板', boss_wife: '老板娘', follow: '跟单/财务', design_lead: '设计负责人', designer: '设计师', engineer_lead: '工程负责人', engineer: '施工人员', media: '新媒体' }
  return map[userStore.role] || '员工'
})

const getStatus = (k) => getStatusInfo(k)
const goList = (q) => router.push({ path: '/main/projects', query: q })
const goDetail = (id) => router.push(`/project/${id}`)
const goIssues = () => router.push('/main/issues')
</script>

<style lang="scss" scoped>
.dashboard { padding-bottom: 80px; }
.header {
  background: linear-gradient(135deg, #1F3864 0%, #2F5496 100%);
  color: #fff; padding: 18px 16px 24px;
  .greet { font-size: 18px; font-weight: 600; }
  .role { font-size: 12px; opacity: 0.85; margin-top: 4px; }
}
.header-stats {
  display: flex; justify-content: space-around;
  background: rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 14px 0; margin-top: 14px;
  backdrop-filter: blur(8px);
  .stat { text-align: center; flex: 1; color: #fff;
    .num { font-size: 22px; font-weight: 700; }
    .label { font-size: 11px; opacity: 0.85; margin-top: 2px; }
    .text-warn { color: #ffd28d; }
    .text-danger { color: #ff9999; }
  }
}
.grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
  padding: 0 12px;
}
.grid-card {
  background: #fff; border-radius: 12px; padding: 14px 8px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  position: relative; overflow: hidden;
  .icon { font-size: 22px; margin-bottom: 6px; }
  .num { font-size: 22px; font-weight: 700; color: #1a1a1a;
    .unit { font-size: 12px; font-weight: 400; color: #969799; }
  }
  .label { font-size: 12px; color: #646566; margin-top: 2px; }
  &.warn { background: linear-gradient(135deg, #fff8f1 0%, #fff 100%); }
  &.danger { background: linear-gradient(135deg, #fff0f0 0%, #fff 100%); }
  &.money { background: linear-gradient(135deg, #fff0f0 0%, #fff 100%); }
}
.project-card {
  cursor: pointer;
}
.empty {
  text-align: center; color: #969799; padding: 24px; font-size: 13px;
}
.workload-row {
  display: flex; align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f2f3f5;
  &:last-child { border-bottom: none; }
}
.avatar-small {
  width: 32px; height: 32px; border-radius: 50%;
  background: #1F3864; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 13px;
}
.footer-tip {
  text-align: center; color: #c8c9cc; font-size: 11px;
  padding: 16px;
}
</style>
