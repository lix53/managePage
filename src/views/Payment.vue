<template>
  <div class="page" v-if="project">
    <van-nav-bar title="回款记录" left-arrow @click-left="$router.back()" />

    <div class="header-card">
      <div class="bold fz-16">{{ project.name }}</div>
      <div class="amount-row mt-12">
        <div class="amount-item">
          <div class="label">合同金额</div>
          <div class="value">¥{{ (project.contractAmount/10000).toFixed(1) }}万</div>
        </div>
        <div class="amount-item">
          <div class="label">已收</div>
          <div class="value text-success">¥{{ (project.receivedAmount/10000).toFixed(1) }}万</div>
        </div>
        <div class="amount-item">
          <div class="label">未收</div>
          <div class="value text-danger">¥{{ ((project.contractAmount - project.receivedAmount)/10000).toFixed(1) }}万</div>
        </div>
      </div>
      <van-progress
        :percentage="Math.round(project.receivedAmount / project.contractAmount * 100)"
        color="#07c160" track-color="rgba(255,255,255,0.3)"
        :pivot-text="''" class="mt-12"
      />
    </div>

    <div class="section-title">付款方式</div>
    <div class="card">
      <van-cell title="付款方式" :value="project.paymentMethod" />
      <van-cell title="预计完工" :value="fmt(project.expectFinishDate)" />
    </div>

    <div class="section-title">收款记录</div>
    <div class="card">
      <van-cell-group :border="false">
        <van-cell title="首付款 30%" :value="`¥${(project.contractAmount*0.3/10000).toFixed(1)}万`" label="已到账 · 立项时" />
        <van-cell v-if="project.receivedAmount > project.contractAmount * 0.3"
          title="中期款 60%" :value="`¥${(project.contractAmount*0.6/10000).toFixed(1)}万`" label="部分到账" />
        <van-cell v-if="project.receivedAmount >= project.contractAmount"
          title="尾款 10%" :value="`¥${(project.contractAmount*0.1/10000).toFixed(1)}万`" label="已结清" />
      </van-cell-group>
    </div>

    <div class="section-title">新增收款</div>
    <van-cell-group inset>
      <van-field v-model="form.amount" label="收款金额" type="number" placeholder="单位：元" />
      <van-field v-model="form.note" label="备注" placeholder="如：中期款" />
    </van-cell-group>

    <div style="padding: 20px 16px 80px;">
      <van-button block type="primary" round @click="onSubmit">记录收款</van-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { showSuccessToast } from 'vant'
import { useDataStore } from '@/store/data'

const route = useRoute()
const store = useDataStore()
const project = computed(() => store.projects.find(p => p.id === route.params.projectId))
const form = reactive({ amount: '', note: '' })
const fmt = (s) => { const d = new Date(s); return `${d.getMonth() + 1}/${d.getDate()}` }

function onSubmit() {
  if (!form.amount) return
  project.value.receivedAmount += Number(form.amount)
  showSuccessToast('收款已记录')
  form.amount = ''
  form.note = ''
}
</script>

<style lang="scss" scoped>
.header-card {
  background: linear-gradient(135deg, #1F3864 0%, #2F5496 100%);
  color: #fff; padding: 20px 16px;
}
.amount-row {
  background: rgba(255,255,255,0.15); border-radius: 10px;
  display: flex; padding: 12px 0;
  .amount-item { flex: 1; text-align: center; color: #fff;
    .label { font-size: 11px; opacity: 0.85; }
    .value { font-size: 16px; font-weight: 700; margin-top: 2px; }
    .text-success { color: #afe9c4; }
    .text-danger { color: #ff9999; }
  }
}
</style>
