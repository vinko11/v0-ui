<script setup lang="ts">
import { ref } from 'vue'

// 统计数据
const stats = ref({
  totalOrders: 156,
  pendingOrders: 12,
  activeVolunteers: 86,
  pendingReviews: 5
})

// 警报中心
const alerts = ref([
  { id: '1', type: 'warning', title: '高频订单用户', message: '李奶奶本周已下单5次，请关注', time: '2小时前' },
  { id: '2', type: 'info', title: '长期未使用用户', message: '张爷爷已30天未使用服务', time: '5小时前' },
  { id: '3', type: 'error', title: '服务超时', message: '订单#12345服务时长超过预期', time: '昨天' }
])

// 最近活动
const recentActivities = ref([
  { id: '1', action: '志愿者审核通过', user: '王志愿者', time: '10分钟前' },
  { id: '2', action: '新订单创建', user: '李奶奶', time: '30分钟前' },
  { id: '3', action: '服务完成', user: '张志愿者', time: '1小时前' },
  { id: '4', action: '用户冻结', user: '管理员', time: '2小时前' }
])

const getAlertClass = (type: string) => {
  switch (type) {
    case 'error':
      return 'border-destructive/30 bg-destructive/5'
    case 'warning':
      return 'border-warning/30 bg-warning/5'
    default:
      return 'border-trust/30 bg-trust/5'
  }
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'error':
      return '🚨'
    case 'warning':
      return '⚠️'
    default:
      return 'ℹ️'
  }
}
</script>

<template>
  <div class="p-8">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground">数据概览</h1>
      <p class="text-lg text-muted-foreground mt-2">
        社区服务运营状态一览
      </p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-4 gap-6 mb-8">
      <div class="bg-card rounded-xl p-6 border border-border">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-2xl">
            📋
          </div>
          <div>
            <p class="text-4xl font-bold text-foreground">{{ stats.totalOrders }}</p>
            <p class="text-lg text-muted-foreground">总订单数</p>
          </div>
        </div>
      </div>
      <div class="bg-card rounded-xl p-6 border border-border">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-warning/20 flex items-center justify-center text-2xl">
            ⏳
          </div>
          <div>
            <p class="text-4xl font-bold text-warning">{{ stats.pendingOrders }}</p>
            <p class="text-lg text-muted-foreground">待处理订单</p>
          </div>
        </div>
      </div>
      <div class="bg-card rounded-xl p-6 border border-border">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-success/20 flex items-center justify-center text-2xl">
            👥
          </div>
          <div>
            <p class="text-4xl font-bold text-success">{{ stats.activeVolunteers }}</p>
            <p class="text-lg text-muted-foreground">活跃志愿者</p>
          </div>
        </div>
      </div>
      <div class="bg-card rounded-xl p-6 border border-border">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-trust/20 flex items-center justify-center text-2xl">
            📝
          </div>
          <div>
            <p class="text-4xl font-bold text-trust">{{ stats.pendingReviews }}</p>
            <p class="text-lg text-muted-foreground">待审核申请</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <!-- 警报中心 -->
      <div class="bg-card rounded-xl p-6 border border-border">
        <h2 class="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          🔔 警报中心
        </h2>
        <div class="flex flex-col gap-3">
          <div
            v-for="alert in alerts"
            :key="alert.id"
            :class="['p-4 rounded-xl border', getAlertClass(alert.type)]"
          >
            <div class="flex items-start gap-3">
              <span class="text-xl">{{ getAlertIcon(alert.type) }}</span>
              <div class="flex-1">
                <p class="text-base font-semibold text-foreground">{{ alert.title }}</p>
                <p class="text-sm text-muted-foreground mt-1">{{ alert.message }}</p>
                <p class="text-xs text-muted-foreground mt-2">{{ alert.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="bg-card rounded-xl p-6 border border-border">
        <h2 class="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          📊 最近活动
        </h2>
        <div class="flex flex-col gap-3">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
          >
            <div>
              <p class="text-base font-medium text-foreground">{{ activity.action }}</p>
              <p class="text-sm text-muted-foreground">{{ activity.user }}</p>
            </div>
            <p class="text-sm text-muted-foreground">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
