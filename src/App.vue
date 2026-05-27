<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['Dashboard', 'ProjectList', 'IssueList', 'Profile']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
</script>

<style lang="scss">
.app-container {
  max-width: 480px;
  min-height: 100vh;
  margin: 0 auto;
  background: #f5f6f8;
  position: relative;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.06);
}
</style>
