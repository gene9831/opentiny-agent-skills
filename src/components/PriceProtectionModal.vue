<template>
  <tiny-dialog-box
    v-model:visible="visible"
    title="新增价保申请"
    width="520px"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
    custom-class="pp-dialog"
  >
    <!-- Form -->
    <tiny-form :model="formData" label-width="100px" class="pp-form">
      <tiny-form-item label="客户姓名">
        <tiny-input v-model="formData.customerName" placeholder="例如：张三" />
      </tiny-form-item>
      <tiny-form-item label="原订单号">
        <tiny-input v-model="formData.orderId" placeholder="例如：ORD-5X9A2B" />
      </tiny-form-item>
      <tiny-form-item label="补偿金额">
        <tiny-numeric
          v-model="formData.amount"
          :min="0.01"
          :max="99999"
          :precision="2"
          :step="10"
          style="width: 100%"
        />
      </tiny-form-item>
      <tiny-form-item label="申请事由">
        <tiny-input type="textarea" v-model="formData.reason" placeholder="例如：百亿补贴大促降价保底" :rows="3" />
      </tiny-form-item>
    </tiny-form>

    <template #footer>
      <div class="dialog-footer">
        <tiny-button class="btn-cancel" @click="handleCancel">取消</tiny-button>
        <tiny-button class="btn-confirm" @click="handleConfirm">
          <span class="btn-icon">✓</span> 提交申请
        </tiny-button>
      </div>
    </template>
  </tiny-dialog-box>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { addPriceProtectionOrder } from '../mock'

const visible = ref(false)
const formData = ref({ customerName: '', orderId: '', amount: 0, reason: '' })

const openModal = (params: { customerName: string; orderId: string; amount: number; reason: string }) => {
  formData.value = {
    customerName: params.customerName || '',
    orderId: params.orderId || '',
    amount: params.amount || 0,
    reason: params.reason || ''
  }
  visible.value = true
}

const handleConfirm = () => {
  if (!formData.value.customerName) {
    alert('客户姓名不能为空')
    return
  }
  if (!formData.value.orderId) {
    alert('原订单号不能为空')
    return
  }
  if (!formData.value.amount || formData.value.amount <= 0) {
    alert('补偿金额必须大于 0')
    return
  }
  if (!formData.value.reason) {
    alert('申请事由不能为空')
    return
  }
  addPriceProtectionOrder({
    customerName: formData.value.customerName,
    orderId: formData.value.orderId,
    amount: formData.value.amount,
    reason: formData.value.reason
  })
  visible.value = false
}

const handleCancel = () => {
  visible.value = false
}

defineExpose({ openModal })
</script>

<style>
/* 对话框外层定制 - 非 scoped 以穿透 tiny-dialog */
.pp-dialog .tiny-dialog-box__header {
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
  padding: 20px 24px 16px;
  border-radius: 12px 12px 0 0;
}
.pp-dialog .tiny-dialog-box__title {
  color: #fff !important;
  font-size: 1.05rem;
  font-weight: 600;
}
.pp-dialog .tiny-dialog-box__headerbtn .tiny-dialog-box__close {
  color: rgba(255, 255, 255, 0.8) !important;
}
.pp-dialog .tiny-dialog-box__body {
  padding: 0;
}
.pp-dialog .tiny-dialog-box__footer {
  padding: 16px 24px 20px;
  border-top: 1px solid #f0f0f0;
}
</style>

<style scoped>
/* Form */
.pp-form {
  padding: 20px 24px 8px;
}

/* Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  border: 1px solid #e5e7eb;
  color: #6b7280;
  background: #fff;
  border-radius: 8px;
  padding: 0 20px;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.btn-cancel:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.btn-confirm {
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%) !important;
  color: white !important;
  border: none !important;
  border-radius: 8px;
  padding: 0 24px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.5);
}
.btn-icon {
  font-size: 1rem;
  font-weight: 700;
}
</style>
