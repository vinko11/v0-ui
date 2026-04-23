<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userInfo = ref({
  name: '李奶奶',
  phone: '138****8888',
  community: '朝阳区XX社区'
})

// 影响力历史
const impactHistory = ref({
  totalServices: 12,
  thankYouNotes: 8,
  totalHours: 24
})

// 最近服务记录
const recentServices = ref([
  { id: '1', type: '陪聊服务', date: '2024-04-18', volunteer: '张志愿者', status: 'completed' },
  { id: '2', type: '就医陪同', date: '2024-04-15', volunteer: '李志愿者', status: 'completed' },
  { id: '3', type: '购物协助', date: '2024-04-10', volunteer: '王志愿者', status: 'completed' }
])

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background pb-24">
    <!-- 顶部导航 -->
    <header class="bg-primary text-primary-foreground px-4 py-5 flex items-center gap-4">
      <button @click="goBack" class="text-3xl">←</button>
      <h1 class="text-2xl font-bold">我的</h1>
    </header>

    <div class="max-w-md mx-auto">
      <!-- 用户信息卡片 -->
      <div class="bg-card mx-5 mt-5 rounded-xl p-5 border border-border">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h2 class="text-2xl font-bold text-foreground">{{ userInfo.name }}</h2>
            <p class="text-lg text-muted-foreground">{{ userInfo.phone }}</p>
            <p class="text-base text-muted-foreground">{{ userInfo.community }}</p>
          </div>
        </div>
        
        <!-- 信任徽章 -->
        <div class="flex gap-2 mt-4">
          <span class="trust-badge bg-trust/10 text-trust">
            ✓ 实名认证
          </span>
          <span class="trust-badge bg-success/10 text-success">
            ⭐ 社区成员
          </span>
        </div>
      </div>

      <!-- 影响力历史 -->
      <div class="bg-card mx-5 mt-4 rounded-xl p-5 border border-border">
        <h3 class="text-xl font-bold text-foreground mb-4">我的影响力</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-3xl font-bold text-primary">{{ impactHistory.totalServices }}</p>
            <p class="text-sm text-muted-foreground mt-1">服务次数</p>
          </div>
          <div class="text-center border-x border-border">
            <p class="text-3xl font-bold text-warning">{{ impactHistory.thankYouNotes }}</p>
            <p class="text-sm text-muted-foreground mt-1">感谢信</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-success">{{ impactHistory.totalHours }}h</p>
            <p class="text-sm text-muted-foreground mt-1">陪伴时长</p>
          </div>
        </div>
      </div>

      <!-- 最近服务 -->
      <div class="p-5">
        <h3 class="text-xl font-bold text-foreground mb-4">最近服务</h3>
        <div class="flex flex-col gap-3">
          <div
            v-for="service in recentServices"
            :key="service.id"
            class="bg-card rounded-xl p-4 border border-border"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-lg font-semibold text-foreground">{{ service.type }}</span>
              <span class="px-2 py-1 bg-success/20 text-success text-sm rounded-lg">已完成</span>
            </div>
            <div class="flex items-center justify-between text-base text-muted-foreground">
              <span>{{ service.volunteer }}</span>
              <span>{{ service.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部导航 -->
      <nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4">
        <div class="max-w-md mx-auto flex justify-around">
          <button 
            @click="router.push('/')"
            class="flex flex-col items-center text-muted-foreground"
          >
            <span class="text-2xl">🏠</span>
            <span class="text-base">首页</span>
          </button>
          <button 
            @click="router.push('/order/1')"
            class="flex flex-col items-center text-muted-foreground"
          >
            <span class="text-2xl">📋</span>
            <span class="text-base">我的订单</span>
          </button>
          <button class="flex flex-col items-center text-primary">
            <span class="text-2xl">👤</span>
            <span class="text-base font-medium">我的</span>
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>
