<template>
  <div class="page">
    <div class="header">
      <div class="avatar">{{ userStore.name?.[0] || '?' }}</div>
      <div>
        <div class="name">{{ userStore.name }}</div>
        <div class="dept">{{ userStore.current?.dept }} · {{ userStore.current?.phone }}</div>
      </div>
    </div>

    <div class="card stats-card">
      <div class="stat">
        <div class="num">{{ myTasks.length }}</div>
        <div class="label">我的任务</div>
      </div>
      <div class="stat">
        <div class="num text-danger">{{ myOverdue.length }}</div>
        <div class="label">超期</div>
      </div>
      <div class="stat">
        <div class="num text-warn">{{ myIssues.length }}</div>
        <div class="label">问题单</div>
      </div>
    </div>

    <van-cell-group inset class="mt-12">
      <van-cell title="个人信息" is-link icon="user-o" />
      <van-cell title="消息通知" is-link icon="bell" :value="3 + ' 条未读'" />
      <van-cell title="我的项目" is-link icon="apps-o" @click="$router.push('/main/projects')" />
    </van-cell-group>

    <van-cell-group inset class="mt-12">
      <van-cell title="使用帮助" is-link icon="question-o" />
      <van-cell title="意见反馈" is-link icon="comment-o" />
      <van-cell title="关于黑玛项目管家" is-link icon="info-o" value="V1.0" />
    </van-cell-group>

    <div class="logout-area">
      <van-button block round @click="onLogout">切换身份 / 退出</van-button>
    </div>

    <div class="tips">本地预览版 · 数据为模拟数据 · 刷新会重置</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useDataStore } from '@/store/data'

defineOptions({ name: 'Profile' })

const router = useRouter()
const userStore = useUserStore()
const store = useDataStore()

const myTasks = computed(() =>
  store.nodes.filter(n => n.owner === userStore.current?.id && ['todo', 'doing'].includes(n.status))
)
const myOverdue = computed(() =>
  myTasks.value.filter(n => new Date(n.deadline).getTime() < Date.now())
)
const myIssues = computed(() =>
  store.issues.filter(i => i.assignee === userStore.current?.id && !['closed', 'resolved'].includes(i.status))
)

function onLogout() {
  userStore.logout()
  router.replace('/login')
}
</script>

<style lang="scss" scoped>
.header {
  background: linear-gradient(135deg, #1F3864 0%, #2F5496 100%);
  color: #fff; padding: 24px 16px; display: flex; align-items: center; gap: 16px;
  .avatar {
    width: 56px; height: 56px; border-radius: 50%;
    background: rgba(255,255,255,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700;
  }
  .name { font-size: 18px; font-weight: 600; }
  .dept { font-size: 12px; opacity: 0.85; margin-top: 4px; }
}
.stats-card {
  display: flex; padding: 16px 0;
  .stat { flex: 1; text-align: center;
    .num { font-size: 22px; font-weight: 700; }
    .label { font-size: 12px; color: #646566; margin-top: 4px; }
  }
}
.logout-area { padding: 24px 16px; }
.tips { text-align: center; color: #c8c9cc; font-size: 12px; padding: 16px; padding-bottom: 80px; }
</style>
