<template>
  <div class="page" v-if="project">
    <van-nav-bar :title="project.code" left-arrow @click-left="$router.back()" />

    <!-- 项目头部 -->
    <div class="header-card">
      <div class="flex-between">
        <div class="flex-1">
          <div class="bold fz-18">{{ project.name }}</div>
          <div class="text-3 fz-12 mt-4">{{ project.customer.name }} · {{ project.customer.phone }}</div>
          <div class="text-3 fz-12 mt-4"><van-icon name="location-o" /> {{ project.customer.address }}</div>
        </div>
        <span class="tag" :class="'tag-' + status(project.status).color">{{ status(project.status).name }}</span>
      </div>
      <div class="amount-bar mt-12">
        <div class="amount-item">
          <div class="label">合同金额</div>
          <div class="value">¥{{ (project.contractAmount/10000).toFixed(1) }}万</div>
        </div>
        <div class="amount-item">
          <div class="label">已收金额</div>
          <div class="value text-success">¥{{ (project.receivedAmount/10000).toFixed(1) }}万</div>
        </div>
        <div class="amount-item">
          <div class="label">未收金额</div>
          <div class="value text-danger">¥{{ ((project.contractAmount - project.receivedAmount)/10000).toFixed(1) }}万</div>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-grid">
      <div class="quick-item" @click="$router.push(`/checkin?projectId=${project.id}`)">
        <van-icon name="location-o" color="#1F3864" /><div>签到</div>
      </div>
      <div class="quick-item" @click="$router.push(`/issue/new?projectId=${project.id}`)">
        <van-icon name="warning-o" color="#ee0a24" /><div>报问题</div>
      </div>
      <div class="quick-item" @click="$router.push(`/shipment/${project.id}`)">
        <van-icon name="logistics" color="#ff976a" /><div>发货</div>
      </div>
      <div class="quick-item" @click="$router.push(`/payment/${project.id}`)">
        <van-icon name="balance-o" color="#07c160" /><div>回款</div>
      </div>
      <div class="quick-item" @click="$router.push(`/media/${project.id}`)">
        <van-icon name="photo-o" color="#9C27B0" /><div>素材</div>
      </div>
    </div>

    <!-- Tab -->
    <van-tabs v-model:active="tab" sticky offset-top="46">
      <van-tab title="节点" name="nodes">
        <div class="nodes-wrap">
          <div v-for="(n, idx) in nodes" :key="n.id" class="node-row" @click="goNode(n)">
            <div class="left">
              <div class="dot" :class="n.status"></div>
              <div v-if="idx < nodes.length - 1" class="line"></div>
            </div>
            <div class="right card">
              <div class="flex-between">
                <div class="bold fz-14">{{ idx + 1 }}. {{ n.nodeName }}</div>
                <span class="tag" :class="nodeStatusClass(n)">{{ nodeStatusLabel(n) }}</span>
              </div>
              <div class="text-2 fz-12 mt-4">
                负责人：{{ user(n.owner).name }} · 截止：{{ fmt(n.deadline) }}
              </div>
              <div class="text-3 fz-12 mt-4" v-if="n.files">
                <van-icon name="records" /> 已上传 {{ n.files }} 个文件
              </div>
              <div v-if="n.confirmedBy" class="text-success fz-12 mt-4">
                ✓ 已由 {{ user(n.confirmedBy).name }} 确认
              </div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab title="问题" name="issues" :badge="issues.length || ''">
        <div v-if="issues.length === 0" class="empty">暂无问题 ✓</div>
        <div v-else v-for="i in issues" :key="i.id" class="card" @click="$router.push(`/issue/${i.id}`)">
          <div class="flex-between">
            <div class="bold fz-14">{{ i.title }}</div>
            <span class="tag" :class="issueStatusClass(i.status)">{{ issueStatusLabel(i.status) }}</span>
          </div>
          <div class="text-3 fz-12 mt-4">{{ i.type }} · {{ user(i.assignee).name }} 处理</div>
          <div class="text-3 fz-12 mt-4">截止 {{ fmt(i.deadline) }}</div>
        </div>
      </van-tab>

      <van-tab title="人员" name="team">
        <div class="card">
          <van-cell-group :border="false">
            <van-cell title="销售" :value="user(project.managers.sales).name" />
            <van-cell title="设计负责人" :value="user(project.managers.design).name" />
            <van-cell title="跟单" :value="user(project.managers.follow).name" />
            <van-cell title="工程负责人" :value="user(project.managers.engineer).name" />
            <van-cell title="新媒体" :value="user(project.managers.media).name" />
          </van-cell-group>
        </div>
      </van-tab>

      <van-tab title="信息" name="info">
        <div class="card">
          <van-cell-group :border="false">
            <van-cell title="项目编号" :value="project.code" />
            <van-cell title="项目类型" :value="project.type" />
            <van-cell title="付款方式" :value="project.paymentMethod" />
            <van-cell title="预计进场" :value="fmt(project.expectStartDate)" />
            <van-cell title="预计完工" :value="fmt(project.expectFinishDate)" />
            <van-cell title="创建时间" :value="fmt(project.createdAt)" />
          </van-cell-group>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '@/store/data'
import { getStatusInfo, getUserById } from '@/mock/data'

const route = useRoute()
const router = useRouter()
const store = useDataStore()
const tab = ref('nodes')

const project = computed(() => store.projects.find(p => p.id === route.params.id))
const nodes = computed(() => store.nodes.filter(n => n.projectId === route.params.id))
const issues = computed(() => store.issues.filter(i => i.projectId === route.params.id))

const status = (k) => getStatusInfo(k)
const user = (id) => getUserById(id)
const fmt = (s) => {
  if (!s) return '-'
  const d = new Date(s); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const goNode = (n) => router.push(`/node/${route.params.id}/${n.id}`)

function nodeStatusLabel(n) {
  const now = Date.now()
  if (n.status === 'done') return '已完成'
  if (n.status === 'pending_confirm') return '待确认'
  if (n.status === 'doing') return new Date(n.deadline).getTime() < now ? '超期进行中' : '进行中'
  if (n.status === 'todo') return new Date(n.deadline).getTime() < now ? '超期未开始' : '待办'
  return n.status
}
function nodeStatusClass(n) {
  const now = Date.now()
  if (n.status === 'done') return 'tag-green'
  if (n.status === 'pending_confirm') return 'tag-blue'
  if (new Date(n.deadline).getTime() < now) return 'tag-red'
  if (n.status === 'doing') return 'tag-orange'
  return 'tag-gray'
}
function issueStatusLabel(s) {
  return ({ todo: '待处理', doing: '处理中', pending_confirm: '待确认', resolved: '已解决', closed: '已关闭' })[s] || s
}
function issueStatusClass(s) {
  return ({ todo: 'tag-red', doing: 'tag-orange', pending_confirm: 'tag-blue', resolved: 'tag-green', closed: 'tag-gray' })[s] || 'tag-gray'
}
</script>

<style lang="scss" scoped>
.header-card {
  background: linear-gradient(135deg, #1F3864 0%, #2F5496 100%);
  color: #fff; padding: 16px;
  .text-3, .text-2 { color: rgba(255,255,255,0.85); }
  .tag { background: rgba(255,255,255,0.25); color: #fff; }
}
.amount-bar {
  background: rgba(255,255,255,0.15); border-radius: 10px;
  display: flex; padding: 12px 0;
  .amount-item { flex: 1; text-align: center; color: #fff;
    .label { font-size: 11px; opacity: 0.85; }
    .value { font-size: 16px; font-weight: 700; margin-top: 2px; }
    .text-success { color: #afe9c4; }
    .text-danger { color: #ff9999; }
  }
}
.quick-grid {
  display: grid; grid-template-columns: repeat(5, 1fr);
  background: #fff; padding: 12px 0;
  .quick-item {
    text-align: center; font-size: 12px; color: #1a1a1a;
    .van-icon { font-size: 22px; display: block; margin-bottom: 4px; }
  }
}
.nodes-wrap {
  padding: 10px 12px;
}
.node-row {
  display: flex; align-items: stretch; gap: 10px; margin-bottom: 4px;
  cursor: pointer;
  .left {
    width: 16px; display: flex; flex-direction: column; align-items: center; padding-top: 18px;
    .dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: #c8c9cc;
      &.done { background: #07c160; }
      &.doing { background: #2F5496; box-shadow: 0 0 0 3px rgba(47,84,150,0.2); }
      &.pending_confirm { background: #ff976a; }
      &.todo { background: #ebedf0; border: 1.5px solid #c8c9cc; }
    }
    .line {
      flex: 1; width: 2px; background: #ebedf0; margin-top: 4px;
    }
  }
  .right { flex: 1; margin: 0 0 8px 0; }
}
.empty { text-align: center; color: #969799; padding: 40px; }
</style>
