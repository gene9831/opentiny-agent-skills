<template>
  <div class="price-protection-view">
    <div class="page-header">
      <div class="header-left">
        <h2>价保单监控</h2>
        <p class="subtitle">跟踪并审批客户提起的价保申请订单</p>
      </div>
      <div class="header-right">
        <button class="btn-add" @click="handleManualAdd">＋ 新增价保申请</button>
      </div>
    </div>

    <div class="table-container">
      <tiny-grid :data="priceProtectionList" border resizable>
        <tiny-grid-column type="index" width="60" />
        <tiny-grid-column field="id" title="价保单号" width="180" />
        <tiny-grid-column field="orderId" title="原订单号" width="150" />
        <tiny-grid-column field="customerName" title="客户姓名" width="100" />
        <tiny-grid-column field="amount" title="补偿金额" width="110" align="right">
          <template #default="{ row }">
            <span class="amount">￥{{ row.amount }}</span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="reason" title="价保原因" min-width="180" />
        <tiny-grid-column field="status" title="当前状态" width="110" align="center">
          <template #default="{ row }">
            <span :class="['status-bubble', row.status.toLowerCase()]">
              {{ statusLabel[row.status] }}
            </span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="createdAt" title="提起时间" width="175" />
        <!-- 操作列：仅 Pending 状态展示审批/驳回按钮 -->
        <tiny-grid-column title="操作" width="150" align="center">
          <template #default="{ row }">
            <div v-if="row.status === 'Pending'" class="row-actions">
              <button class="act-btn approve" @click="handleApprove(row)">通过</button>
              <button class="act-btn reject" @click="handleReject(row)">驳回</button>
            </div>
            <span v-else class="action-done">—</span>
          </template>
        </tiny-grid-column>
      </tiny-grid>
    </div>

    <!-- 新增价保申请弹窗 -->
    <PriceProtectionModal ref="modalRef" />

    <!-- 审批确认对话框 -->
    <tiny-dialog-box
      v-model:visible="reviewDialog.visible"
      :title="reviewDialog.action === 'approve' ? '确认审批通过' : '确认驳回'"
      width="420px"
    >
      <div class="review-confirm">
        <p>
          即将对价保申请
          <strong>{{ reviewDialog.orderId }}</strong>
          执行
          <strong :class="reviewDialog.action === 'approve' ? 'text-success' : 'text-danger'">
            {{ reviewDialog.action === 'approve' ? '审批通过' : '驳回' }}
          </strong>
          操作。
        </p>
        <tiny-form :model="reviewDialog">
          <tiny-form-item label="备注（可选）">
            <tiny-input v-model="reviewDialog.remark" type="textarea" :rows="2" placeholder="填写审批备注" />
          </tiny-form-item>
        </tiny-form>
      </div>
      <template #footer>
        <tiny-button @click="reviewDialog.visible = false">取消</tiny-button>
        <tiny-button :type="reviewDialog.action === 'approve' ? 'success' : 'danger'" @click="confirmReview">
          确认{{ reviewDialog.action === 'approve' ? '通过' : '驳回' }}
        </tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>

<script setup lang="ts">
import { priceProtectionList, type PriceProtectionOrder } from '../../mock'
import { ref, reactive } from 'vue'
import PriceProtectionModal from '../../components/PriceProtectionModal.vue'

const modalRef = ref()

const statusLabel: Record<string, string> = {
  Pending: '待处理',
  Approved: '已通过',
  Rejected: '已拒绝'
}

const handleManualAdd = () => {
  modalRef.value?.openModal({ customerName: '', orderId: '', amount: 0, reason: '' })
}

// 行内审批对话框状态
const reviewDialog = reactive({
  visible: false,
  action: 'approve' as 'approve' | 'reject',
  orderId: '',
  id: '',
  remark: ''
})

const handleApprove = (row: PriceProtectionOrder) => {
  reviewDialog.action = 'approve'
  reviewDialog.orderId = row.orderId
  reviewDialog.id = row.id
  reviewDialog.remark = ''
  reviewDialog.visible = true
}

const handleReject = (row: PriceProtectionOrder) => {
  reviewDialog.action = 'reject'
  reviewDialog.orderId = row.orderId
  reviewDialog.id = row.id
  reviewDialog.remark = ''
  reviewDialog.visible = true
}

const confirmReview = () => {
  const order = priceProtectionList.value.find((o) => o.id === reviewDialog.id)
  if (order) {
    if (order.status !== 'Pending') {
      alert(`申请单状态为「${order.status}」，无法重复审核。`)
      reviewDialog.visible = false
      return
    }
    order.status = reviewDialog.action === 'approve' ? 'Approved' : 'Rejected'
    if (reviewDialog.remark) {
      order.remark = reviewDialog.remark
    }
  }
  reviewDialog.visible = false
}

</script>

<style scoped>
.price-protection-view {
  animation: fadeIn 0.4s ease-out;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.page-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 4px 0;
}

.subtitle {
  color: #86909c;
  font-size: 0.95rem;
  margin: 0;
}

.review-confirm p {
  font-size: 0.95rem;
  margin-bottom: 16px;
  color: #1d2129;
  line-height: 1.6;
}
.review-confirm strong {
  font-weight: 600;
}
.text-success {
  color: #00b42a;
}
.text-danger {
  color: #f53f3f;
}

.action-done {
  color: #c9cdd4;
  font-size: 1rem;
}

/* 顶部新增按钮 */
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6366f1;
  background: #fff;
  border: 1.5px solid #c7d2fe;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-add:hover {
  background: rgba(99, 102, 241, 0.06);
  border-color: #818cf8;
}

/* 行内操作按钮组 */
.row-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.act-btn {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
}
.act-btn.approve {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}
.act-btn.approve:hover {
  background: #d1fae5;
  border-color: #6ee7b7;
}
.act-btn.reject {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.act-btn.reject:hover {
  background: #fee2e2;
  border-color: #f87171;
}

.table-container {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  flex: 1;
}

.amount {
  font-weight: 600;
  color: #f53f3f;
}

.status-bubble {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-bubble.approved {
  background: #e8ffea;
  color: #00b42a;
}

.status-bubble.pending {
  background: #e8f3ff;
  color: #165dff;
}

.status-bubble.rejected {
  background: #ffece8;
  color: #f53f3f;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
