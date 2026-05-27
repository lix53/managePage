<template>
  <div class="main-layout">
    <router-view />
    <van-tabbar v-model="active" route safe-area-inset-bottom>
      <van-tabbar-item to="/main/dashboard" icon="bar-chart-o">看板</van-tabbar-item>
      <van-tabbar-item to="/main/projects" icon="apps-o">项目</van-tabbar-item>
      <van-tabbar-item to="/main/issues" icon="warning-o" :badge="issueBadge">问题</van-tabbar-item>
      <van-tabbar-item to="/main/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDataStore } from '@/store/data'

const active = ref(0)
const store = useDataStore()
const issueBadge = computed(() => {
  const n = store.openIssues.length
  return n > 0 ? n : ''
})
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
}
</style>
