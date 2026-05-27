<template>
  <div class="page">
    <van-nav-bar title="工地签到" left-arrow @click-left="$router.back()" />

    <div class="header-card">
      <div class="time">{{ now }}</div>
      <div class="loc"><van-icon name="location" /> 模拟定位：深圳市福田区车公庙XX路88号</div>
      <div class="text-3 fz-12 mt-12">签到目标：到场 30 秒内完成 · 系统自动记录时间与位置</div>
    </div>

    <van-cell-group inset class="mt-12">
      <van-field v-model="form.projectName" label="项目" is-link readonly @click="showProj = true" placeholder="选择今日工地项目" required />
    </van-cell-group>

    <div class="section-title">现场照片（至少 1 张）</div>
    <div class="card">
      <van-uploader v-model="photos" multiple :max-count="9" />
    </div>

    <div class="section-title">施工条件</div>
    <div class="card">
      <van-radio-group v-model="form.condition">
        <van-cell-group :border="false">
          <van-cell title="✅ 具备施工条件" clickable @click="form.condition = '具备施工条件'">
            <template #right-icon><van-radio name="具备施工条件" /></template>
          </van-cell>
          <van-cell title="⚠️ 材料部分未到" clickable @click="form.condition = '材料部分未到'">
            <template #right-icon><van-radio name="材料部分未到" /></template>
          </van-cell>
          <van-cell title="⚠️ 存在交叉施工" clickable @click="form.condition = '存在交叉施工'">
            <template #right-icon><van-radio name="存在交叉施工" /></template>
          </van-cell>
          <van-cell title="❌ 不具备施工条件" clickable @click="form.condition = '不具备施工条件'">
            <template #right-icon><van-radio name="不具备施工条件" /></template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>

    <van-cell-group inset>
      <van-field v-model="form.remark" label="备注" type="textarea" rows="2" placeholder="选填" />
    </van-cell-group>

    <div style="padding: 20px 16px 80px;">
      <van-button block type="primary" round size="large" @click="onSubmit">立即签到</van-button>
    </div>

    <van-popup v-model:show="showProj" position="bottom">
      <van-picker :columns="projOpts" :columns-field-names="{ text: 'label', value: 'value' }" @confirm="onPick" @cancel="showProj = false" />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showSuccessToast, showFailToast } from 'vant'
import { useDataStore } from '@/store/data'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const store = useDataStore()
const userStore = useUserStore()

const showProj = ref(false)
const photos = ref([])
const now = ref('')

const form = reactive({
  projectId: route.query.projectId || '',
  projectName: '',
  condition: '具备施工条件',
  remark: ''
})

onMounted(() => {
  if (form.projectId) {
    const p = store.projects.find(p => p.id === form.projectId)
    if (p) form.projectName = p.name
  }
  setInterval(() => {
    now.value = new Date().toLocaleString('zh-CN')
  }, 1000)
  now.value = new Date().toLocaleString('zh-CN')
})

const projOpts = computed(() => store.projects
  .filter(p => ['enter', 'working', 'debug'].includes(p.status))
  .map(p => ({ label: p.name, value: p.id }))
)
function onPick(v) {
  form.projectId = v.selectedValues[0]
  form.projectName = store.projects.find(p => p.id === form.projectId)?.name
  showProj.value = false
}

function onSubmit() {
  if (!form.projectId) return showFailToast('请选择项目')
  if (photos.value.length === 0) return showFailToast('请至少拍 1 张现场照片')
  store.addCheckin({
    projectId: form.projectId,
    userId: userStore.current.id,
    userName: userStore.current.name,
    photos: photos.value.length,
    condition: form.condition,
    remark: form.remark
  })
  showSuccessToast('签到成功')
  setTimeout(() => router.back(), 800)
}
</script>

<style lang="scss" scoped>
.header-card {
  background: linear-gradient(135deg, #1F3864 0%, #2F5496 100%);
  color: #fff; padding: 20px 16px;
  .time { font-size: 24px; font-weight: 700; }
  .loc { font-size: 13px; opacity: 0.9; margin-top: 6px; }
  .text-3 { color: rgba(255,255,255,0.7); }
}
</style>
