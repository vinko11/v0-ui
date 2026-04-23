<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Service {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

const services = ref<Service[]>([
  {
    id: 'chat',
    title: '陪聊服务',
    description: '倾听陪伴，温暖心灵',
    icon: '💬',
    color: 'bg-orange-100'
  },
  {
    id: 'medical',
    title: '就医陪同',
    description: '陪您看病，安心就诊',
    icon: '🏥',
    color: 'bg-green-100'
  },
  {
    id: 'shopping',
    title: '购物协助',
    description: '代购跑腿，方便生活',
    icon: '🛒',
    color: 'bg-blue-100'
  }
])

const selectService = (serviceId: string) => {
  router.push({ path: '/order', query: { type: serviceId } })
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部导航 -->
    <header class="bg-primary text-primary-foreground px-6 py-6">
      <h1 class="text-3xl font-bold text-center">暖心相伴</h1>
      <p class="text-center text-lg mt-2 opacity-90">社区互助服务平台</p>
    </header>

    <!-- 服务卡片区域 -->
    <main class="p-6">
      <h2 class="text-2xl font-semibold mb-6 text-foreground">选择服务</h2>
      
      <div class="flex flex-col gap-5">
        <button
          v-for="service in services"
          :key="service.id"
          @click="selectService(service.id)"
          class="w-full p-6 rounded-2xl border-2 border-border bg-card shadow-sm transition-all active:scale-[0.98] hover:border-primary hover:shadow-md"
        >
          <div class="flex items-center gap-5">
            <!-- 图标区域 -->
            <div
              :class="[service.color, 'w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0']"
            >
              {{ service.icon }}
            </div>
            
            <!-- 文字区域 -->
            <div class="flex-1 text-left">
              <h3 class="text-2xl font-bold text-card-foreground">
                {{ service.title }}
              </h3>
              <p class="text-lg text-muted-foreground mt-1">
                {{ service.description }}
              </p>
            </div>
            
            <!-- 箭头 -->
            <div class="text-muted-foreground text-2xl">
              →
            </div>
          </div>
        </button>
      </div>

      <!-- 底部提示 -->
      <div class="mt-8 p-4 bg-secondary rounded-xl">
        <p class="text-center text-lg text-secondary-foreground">
          所有服务均由认证志愿者提供
        </p>
      </div>
    </main>

    <!-- 底部导航 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4">
      <div class="flex justify-around">
        <button class="flex flex-col items-center text-primary">
          <span class="text-2xl">🏠</span>
          <span class="text-base font-medium">首页</span>
        </button>
        <button 
          @click="router.push('/order/1')"
          class="flex flex-col items-center text-muted-foreground"
        >
          <span class="text-2xl">📋</span>
          <span class="text-base">我的订单</span>
        </button>
        <button class="flex flex-col items-center text-muted-foreground">
          <span class="text-2xl">👤</span>
          <span class="text-base">我的</span>
        </button>
      </div>
    </nav>
  </div>
</template>
