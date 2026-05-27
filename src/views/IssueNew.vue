<template>
  <div class="page">
    <van-nav-bar title="新建问题" left-arrow @click-left="$router.back()" />

    <van-form @submit="onSubmit">
      <van-cell-group inset class="mt-12">
        <van-field v-model="form.projectName" label="所属项目" is-link readonly @click="showProj = true" placeholder="选择项目" required :rules="[{ required: true }]" />
        <van-field v-model="form.title" label="问题标题" placeholder="一句话描述问题" required :rules="[{ required: true }]" />
        <van-field v-model="form.type" label="问题类型" is-link readonly @click="showType = true" placeholder="请选择" required :rules="[{ required: true }]" />
      </van-cell-group>

      <van-cell-group inset class="mt-12">
        <van-field label="现场照片">
          <template #input>
            <van-uploader v-model="photos" multiple :max-count="9" />
          </template>
        </van-field>
      </van-cell-group>

      <van-cell-group inset class="mt-12">
        <van-field v-model="form.assigneeName" label="处理人" is-link readonly @click="showAssignee = true" required :rules="[{ required: true }]" />
        <van-field v-model="form.deadlineText" label="处理截止" is-link readonly @click="showDate = true" required :rules="[{ required: true }]" />
        <van-field v-model="form.description" label="详细描述" type="textarea" rows="3" placeholder="补充背景、影响" />
      </van-cell-group>

      <div style="padding: 20px 16px 80px;">
        <van-button block type="primary" native-type="submit" round>提交问题</van-button>
        <div class="text-3 fz-12 mt-12" style="text-align:center;">
          ⚠️ 工地问题没有在系统里留痕，后期不作为责任判定依据
        </div>
      </div>
    </van-form>

    <van-popup v-model:show="showProj" position="bottom">
      <van-picker :columns="projOpts" :columns-field-names="{ text: 'label', value: 'value' }" @confirm="onPickProj" @cancel="showProj = false" />
    </van-popup>
    <van-popup v-model:show="showType" position="bottom">
      <van-picker :columns="typeOpts" @confirm="(v) => { form.type = v.selectedValues[0]; showType = false }" @cancel="showType = false" />
    </van-popup>
    <van-popup v-model:show="showAssignee" position="bottom">
      <van-picker :columns="userOpts" :columns-field-names="{ text: 'label', value: 'value' }" @confirm="onPickAssignee" @cancel="showAssignee = false" />
    </van-popup>
    <van-popup v-model:show="showDate" position="bottom">
      <van-date-picker @confirm="onDate" @cancel="showDate = false" :min-date="new Date()" :max-date="new Date(2028,11,31)" />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import { useDataStore } from '@/store/data'
import { useUserStore } from '@/store/user'
import { USERS } from '@/mock/data'

const route = useRoute()
const router = useRouter()
const store = useDataStore()
const userStore = useUserStore()

const showProj = ref(false)
const showType = ref(false)
const showAssignee = ref(false)
const showDate = ref(false)
const photos = ref([])

const form = reactive({
  projectId: route.query.projectId || '',
  projectName: '',
  title: '',
  type: '',
  assigneeId: '',
  assigneeName: '',
  deadline: '',
  deadlineText: '',
  description: ''
})

if (form.projectId) {
  const p = store.projects.find(p => p.id === form.projectId)
  if (p) form.projectName = p.name
}

const projOpts = computed(() => store.projects.map(p => ({ label: p.name, value: p.id })))
const userOpts = computed(() => USERS.map(u => ({ label: `${u.name} (${u.dept})`, value: u.id })))
const typeOpts = ['设计问题', '清单漏项', '发货错误', '灯具损坏', '现场尺寸不符', '客户变更', '施工条件不具备', '安装错误', '质量问题', '售后问题', '回款问题']

function onPickProj(v) {
  form.projectId = v.selectedValues[0]
  const p = store.projects.find(p => p.id === form.projectId)
  form.projectName = p?.name || ''
  showProj.value = false
}
function onPickAssignee(v) {
  form.assigneeId = v.selectedValues[0]
  form.assigneeName = USERS.find(u => u.id === form.assigneeId)?.name || ''
  showAssignee.value = false
}
function onDate(v) {
  const [y, m, d] = v.selectedValues
  form.deadline = new Date(y, m - 1, d).toISOString()
  form.deadlineText = `${y}-${m}-${d}`
  showDate.value = false
}

function onSubmit() {
  store.addIssue({
    projectId: form.projectId,
    title: form.title,
    type: form.type,
    photos: photos.value.length || 1,
    department: USERS.find(u => u.id === form.assigneeId)?.dept || '',
    owner: userStore.current?.id,
    assignee: form.assigneeId,
    deadline: form.deadline
  })
  showSuccessToast('问题已提交')
  setTimeout(() => router.back(), 500)
}
</script>
