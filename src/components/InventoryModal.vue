<template>
  <tiny-dialog-box
    v-model:visible="visible"
    title="新增入库单"
    width="500px"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
  >
    <div class="modal-content">
      <tiny-form :model="formData" label-width="80px" class="form-container">
        <tiny-form-item label="商品名称">
          <tiny-input v-model="formData.productName" placeholder="例如: iPhone 15 Pro Max"></tiny-input>
        </tiny-form-item>
        <tiny-form-item label="入库数量">
          <tiny-numeric v-model="formData.quantity" :min="1" :max="99999"></tiny-numeric>
        </tiny-form-item>
        <tiny-form-item label="存放仓库">
          <tiny-select v-model="formData.warehouse" placeholder="请选择仓库">
            <tiny-option label="北京一号仓" value="北京一号仓"></tiny-option>
            <tiny-option label="上海二号仓" value="上海二号仓"></tiny-option>
            <tiny-option label="广州中心仓" value="广州中心仓"></tiny-option>
            <tiny-option label="深圳坂田仓" value="深圳坂田仓"></tiny-option>
          </tiny-select>
        </tiny-form-item>
      </tiny-form>
    </div>

    <template #footer>
      <tiny-button @click="handleCancel">取消</tiny-button>
      <tiny-button type="primary" @click="handleConfirm">确认入库</tiny-button>
    </template>
  </tiny-dialog-box>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { addInventory } from '../mock'

const visible = ref(false)
const formData = ref({
  productName: '',
  quantity: 1,
  warehouse: '北京一号仓'
})

const openModal = (params: { productName: string; quantity: number; warehouse: string }) => {
  formData.value = {
    productName: params.productName || '',
    quantity: params.quantity || 1,
    warehouse: params.warehouse || '北京一号仓'
  }
  visible.value = true
}

const handleConfirm = () => {
  if (!formData.value.productName) {
    alert('商品名称不能为空')
    return
  }

  // 更新 Mock 数据
  addInventory({
    productName: formData.value.productName,
    sku: `SKU-AUTO-${Math.floor(Math.random() * 10000)}`,
    quantity: formData.value.quantity,
    warehouse: formData.value.warehouse
  })

  visible.value = false
}

const handleCancel = () => {
  visible.value = false
}

defineExpose({
  openModal
})
</script>

<style scoped>
.modal-content {
  padding: 10px 0;
}

.form-container {
  padding: 0 10px;
}
</style>
