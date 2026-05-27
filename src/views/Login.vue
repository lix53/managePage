<template>
  <div class="login-page">
    <div class="brand">
      <div class="logo">黑玛</div>
      <div class="title">黑玛项目管家</div>
      <div class="subtitle">工地推进 · 责任留痕 · 闭环管理</div>
    </div>

    <div class="card-box">
      <div class="tip">本地演示版：选择一个身份进入</div>
      <div class="role-grid">
        <div
          v-for="u in users"
          :key="u.id"
          class="role-card"
          :class="{ active: selected === u.id }"
          @click="selected = u.id"
        >
          <div class="avatar" :style="{ background: avatarColor(u.role) }">{{ u.name[0] }}</div>
          <div class="name">{{ u.name }}</div>
          <div class="dept">{{ u.dept }}</div>
        </div>
      </div>
      <van-button type="primary" size="large" round block :disabled="!selected" @click="onLogin">
        进入系统
      </van-button>
      <div class="hint">提示：登录后底部 Tab 会根据身份显示对应内容</div>
    </div>

    <div class="footer">
      <div>V1.0 本地预览版 · 数据为模拟数据</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/store/user'
import { USERS } from '@/mock/data'

const router = useRouter()
const userStore = useUserStore()
const users = USERS
const selected = ref(localStorage.getItem('blackmart_last_user') || 'u01')

function avatarColor(role) {
  const map = {
    boss: '#1F3864', boss_wife: '#9C27B0', follow: '#2F5496',
    design_lead: '#00BCD4', designer: '#26A69A',
    engineer_lead: '#FF6F00', engineer: '#FB8C00',
    media: '#E91E63'
  }
  return map[role] || '#999'
}

function onLogin() {
  if (!selected.value) return
  const ok = userStore.login(selected.value)
  if (ok) {
    localStorage.setItem('blackmart_last_user', selected.value)
    showToast({ message: '登录成功', position: 'top' })
    router.replace('/main/dashboard')
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1F3864 0%, #2F5496 50%, #f5f6f8 50%, #f5f6f8 100%);
  padding: 40px 16px 24px;
  display: flex;
  flex-direction: column;
}
.brand {
  text-align: center;
  color: #fff;
  margin-bottom: 24px;
  .logo {
    width: 64px; height: 64px; border-radius: 16px;
    background: rgba(255,255,255,0.15);
    margin: 0 auto 12px;
    line-height: 64px; font-size: 24px; font-weight: 700;
    backdrop-filter: blur(10px);
  }
  .title { font-size: 22px; font-weight: 700; }
  .subtitle { font-size: 13px; opacity: 0.85; margin-top: 6px; }
}
.card-box {
  background: #fff; border-radius: 16px; padding: 18px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  .tip { color: #646566; font-size: 13px; margin-bottom: 12px; text-align: center; }
  .hint { color: #969799; font-size: 12px; text-align: center; margin-top: 12px; }
}
.role-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;
}
.role-card {
  border: 1.5px solid #ebedf0; border-radius: 10px; padding: 10px 4px;
  text-align: center; cursor: pointer; transition: all 0.2s;
  &.active {
    border-color: #1F3864; background: #f0f4fb;
    transform: scale(1.02);
  }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    margin: 0 auto 6px; color: #fff; line-height: 36px; font-weight: 600;
  }
  .name { font-size: 13px; font-weight: 600; color: #1a1a1a; }
  .dept { font-size: 11px; color: #969799; margin-top: 2px; }
}
.footer {
  margin-top: auto; text-align: center; color: #969799; font-size: 12px; padding-top: 20px;
}
</style>
