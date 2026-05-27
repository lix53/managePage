<template>
  <div class="page">
    <van-nav-bar title="新建项目" left-arrow @click-left="$router.back()" />

    <van-form @submit="onSubmit">
      <van-cell-group inset class="mt-12">
        <van-field v-model="form.name" label="项目名称" placeholder="如 XX精品酒店大堂照明" required :rules="[{ required: true }]" />
        <van-field v-model="form.customer.name" label="客户名称" placeholder="客户公司或品牌名" required :rules="[{ required: true }]" />
        <van-field v-model="form.customer.phone" label="联系电话" type="tel" placeholder="11 位手机号" />
        <van-field v-model="form.customer.address" label="项目地址" placeholder="详细地址" />
      </van-cell-group>

      <van-cell-group inset class="mt-12">
        <van-field v-model="form.type" label="项目类型" is-link readonly @click="showType = true" placeholder="请选择" />
        <van-field v-model="form.contractAmount" label="合同金额(元)" type="number" placeholder="如 285000" />
        <van-field v-model="form.paymentMethod" label="付款方式" is-link readonly @click="showPay = true" placeholder="请选择" />
      </van-cell-group>

      <van-cell-group inset class="mt-12">
        <van-field v-model="ownerNames.engineer" label="工程负责人" is-link readonly @click="pickOwner('engineer')" />
        <van-field v-model="ownerNames.design" label="设计负责人" is-link readonly @click="pickOwner('design')" />
        <van-field v-model="ownerNames.follow" label="跟单" is-link readonly @click="pickOwner('follow')" />
        <van-field v-model="ownerNames.media" label="新媒体" is-link readonly @click="pickOwner('media')" />
      </van-cell-group>

      <van-cell-group inset class="mt-12">
        <van-field v-model="form.expectStartDateText" label="预计进场" is-link readonly @click="showDate('expectStartDate')" />
        <van-field v-model="form.expectFinishDateText" label="预计完工" is-link readonly @click="showDate('expectFinishDate')" />
      </van-cell-group>

      <div style="padding: 20px 16px 80px;">
        <van-button block type="primary" native-type="submit" round>创建项目</van-button>
      </div>
    </van-form>

    <van-popup v-model:show="showType" position="bottom">
      <van-picker :columns="['商业空间', '办公', '酒店', '餐饮', '住宅', '其他']" @confirm="(v) => { form.type = v.selectedValues[0]; showType = false }" @cancel="showType = false" />
    </van-popup>
    <van-popup v-model:show="showPay" position="bottom">
      <van-picker :columns="['全款', '30-60-10', '50-50', '分期', '其他']" @confirm="(v) => { form.paymentMethod = v.selectedValues[0]; showPay = false }" @cancel="showPay = false" />
    </van-popup>
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker :columns="ownerOptions" :columns-field-names="{ text: 'label', value: 'value' }" @confirm="onPickOwner" @cancel="showPicker = false" />
    </van-popup>
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker @confirm="onDateConfirm" @cancel="showDatePicker = false" :min-date="new Date(2024,0,1)" :max-date="new Date(2028,11,31)" />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import { useDataStore } from '@/store/data'
import { USERS } from '@/mock/data'

const router = useRouter()
const store = useDataStore()
const showType = ref(false)
const showPay = ref(false)
const showPicker = ref(false)
const showDatePicker = ref(false)
const currentOwnerKey = ref('')
const currentDateKey = ref('')

const form = reactive({
  name: '', type: '', contractAmount: '', paymentMethod: '',
  customer: { name: '', phone: '', address: '' },
  managers: { sales: 'u01', design: 'u04', follow: 'u03', engineer: 'u07', media: 'u10' },
  expectStartDate: '', expectStartDateText: '',
  expectFinishDate: '', expectFinishDateText: ''
})

const ownerNames = computed(() => ({
  engineer: USERS.find(u => u.id === form.managers.engineer)?.name,
  design: USERS.find(u => u.id === form.managers.design)?.name,
  follow: USERS.find(u => u.id === form.managers.follow)?.name,
  media: USERS.find(u => u.id === form.managers.media)?.name
}))

const ownerOptions = computed(() =>
  USERS.map(u => ({ label: `${u.name} (${u.dept})`, value: u.id }))
)

function pickOwner(key) { currentOwnerKey.value = key; showPicker.value = true }
function onPickOwner(v) {
  form.managers[currentOwnerKey.value] = v.selectedValues[0]
  showPicker.value = false
}
function showDate(key) { currentDateKey.value = key; showDatePicker.value = true }
function onDateConfirm(v) {
  const [y, m, d] = v.selectedValues
  const date = new Date(y, m - 1, d).toISOString()
  form[currentDateKey.value] = date
  form[currentDateKey.value + 'Text'] = `${y}-${m}-${d}`
  showDatePicker.value = false
}

function onSubmit() {
  const p = store.addProject({
    name: form.name,
    type: form.type || '其他',
    contractAmount: Number(form.contractAmount) || 0,
    paymentMethod: form.paymentMethod || '其他',
    customer: { ...form.customer },
    managers: { ...form.managers },
    expectStartDate: form.expectStartDate,
    expectFinishDate: form.expectFinishDate
  })
  showSuccessToast('项目已创建')
  setTimeout(() => router.replace(`/project/${p.id}`), 500)
}
</script>
