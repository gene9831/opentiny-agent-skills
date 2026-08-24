<template>
  <div class="home-view">
    <div class="page-header">
      <h2>概览大盘</h2>
      <p class="subtitle">电子商务业务数据实时监控</p>
    </div>

    <div class="stats-cards">
      <div class="stat-card blue">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <div class="stat-title">今日销售额</div>
          <div class="stat-value">￥128,450</div>
          <div class="stat-trend positive">↑ 12.5% 较昨日</div>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <div class="stat-title">总库存量</div>
          <div class="stat-value">1,248件</div>
          <div class="stat-trend negative">↓ 3.2% 较上周</div>
        </div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon">🛡️</div>
        <div class="stat-content">
          <div class="stat-title">待处理价保</div>
          <div class="stat-value">12单</div>
          <div class="stat-trend neutral">- 持平</div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.home-view {
  animation: fadeIn 0.4s ease-out;
}

.page-header {
  margin-bottom: 24px;
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

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  transition:
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  font-size: 2rem;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.blue .stat-icon {
  background: rgba(58, 120, 236, 0.1);
}
.purple .stat-icon {
  background: rgba(142, 58, 236, 0.1);
}
.orange .stat-icon {
  background: rgba(236, 117, 58, 0.1);
}

.stat-title {
  color: #86909c;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1d2129;
  margin-bottom: 8px;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 500;
}
.stat-trend.positive {
  color: #00b42a;
}
.stat-trend.negative {
  color: #f53f3f;
}
.stat-trend.neutral {
  color: #86909c;
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
