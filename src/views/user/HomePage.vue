<script setup lang="ts">
import { ref, inject, type Ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isUserFrozen = inject<Ref<boolean>>('isUserFrozen', ref(false))

interface Service {
  id: string
  title: string
  description: string
  icon: string
  color: string
  detail: string
}

const services = ref<Service[]>([
  {
    id: 'chat',
    title: '陪聊服务',
    description: '倾听陪伴，温暖心灵',
    icon: '💬',
    color: 'bg-orange-100',
    detail: '专业志愿者上门陪您聊天，舒缓心情'
  },
  {
    id: 'medical',
    title: '就医陪同',
    description: '陪您看病，安心就诊',
    icon: '🏥',
    color: 'bg-green-100',
    detail: '全程陪同就医，帮助挂号取药'
  },
  {
    id: 'shopping',
    title: '购物协助',
    description: '代购跑腿，方便生活',
    icon: '🛒',
    color: 'bg-blue-100',
    detail: '帮您采购日用品、蔬菜水果等'
  }
])

// 社区统计数据
const stats = ref({
  hoursVolunteered: 1240,
  seniorsHelped: 450,
  activeVolunteers: 86
})

// 滚动公告
const notices = ref([
  '温馨提示：天气转凉，请注意添衣保暖',
  '社区活动：本周六下午有健康义诊活动',
  '安全提醒：谨防电信诈骗，保护个人信息'
])
const currentNoticeIndex = ref(0)

let noticeTimer: ReturnType<typeof setInterval>

onMounted(() => {
  noticeTimer = setInterval(() => {
    currentNoticeIndex.value = (currentNoticeIndex.value + 1) % notices.value.length
  }, 5000)
})

onUnmounted(() => {
  clearInterval(noticeTimer)
})

const selectService = (serviceId: string) => {
  router.push({ path: '/order', query: { type: serviceId } })
}

const goToProfile = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 冻结账户警告 -->
    <div v-if="isUserFrozen" class="bg-destructive text-destructive-foreground px-6 py-4">
      <p class="text-lg font-semibold text-center">
        账户状态异常，请联系社区管理员
      </p>
    </div>

    <!-- 顶部导航 -->
    <header class="bg-primary text-primary-foreground px-6 py-6">
      <h1 class="text-3xl font-bold text-center">暖心相伴</h1>
      <p class="text-center text-lg mt-2 opacity-90">社区互助服务平台</p>
      
      <!-- 信任徽章 -->
      <div class="flex justify-center gap-3 mt-4 flex-wrap">
        <span class="trust-badge bg-white/20 text-white">
          <span>✓</span> 实名认证
        </span>
        <span class="trust-badge bg-white/20 text-white">
          <span>🛡️</span> 社区认证
        </span>
        <span class="trust-badge bg-white/20 text-white">
          <span>⭐</span> 服务保障
        </span>
      </div>
    </header>

    <!-- 移动端框架容器 -->
    <div class="max-w-md mx-auto">
      
      <!-- 社区公告滚动条 -->
      <div class="bg-secondary mx-5 mt-4 rounded-xl px-4 py-3 overflow-hidden">
        <div class="flex items-center gap-3">
          <span class="shrink-0 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">公告</span>
          <div class="overflow-hidden flex-1">
            <p class="text-base text-secondary-foreground whitespace-nowrap transition-all duration-500">
              {{ notices[currentNoticeIndex] }}
            </p>
          </div>
        </div>
      </div>

      <!-- 社区统计 -->
      <div class="bg-card mx-5 mt-4 rounded-xl p-5 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4 text-center">社区服务数据</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-primary">{{ stats.hoursVolunteered }}</p>
            <p class="text-sm text-muted-foreground mt-1">服务时长</p>
          </div>
          <div class="text-center border-x border-border">
            <p class="text-2xl font-bold text-primary">{{ stats.seniorsHelped }}</p>
            <p class="text-sm text-muted-foreground mt-1">帮助长者</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-primary">{{ stats.activeVolunteers }}</p>
            <p class="text-sm text-muted-foreground mt-1">活跃志愿者</p>
          </div>
        </div>
      </div>

      <!-- 服务卡片区域 -->
      <main class="p-5">
        <h2 class="text-2xl font-semibold mb-5 text-foreground">选择服务</h2>
        
        <div class="flex flex-col gap-4">
          <button
            v-for="service in services"
            :key="service.id"
            @click="selectService(service.id)"
            :disabled="isUserFrozen"
            :class="[
              'w-full p-5 rounded-2xl border-2 border-border bg-card shadow-sm transition-all',
              isUserFrozen 
                ? 'opacity-50 cursor-not-allowed' 
                : 'active:scale-[0.98] hover:border-primary hover:shadow-md'
            ]"
          >
            <div class="flex items-center gap-4">
              <!-- 图标区域 -->
              <div
                :class="[service.color, 'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0']"
              >
                {{ service.icon }}
              </div>
              
              <!-- 文字区域 -->
              <div class="flex-1 text-left">
                <h3 class="text-xl font-bold text-card-foreground">
                  {{ service.title }}
                </h3>
                <p class="text-base text-muted-foreground mt-0.5">
                  {{ service.description }}
                </p>
                <p class="text-sm text-trust mt-1">
                  {{ service.detail }}
                </p>
              </div>
              
              <!-- 箭头 -->
              <div class="text-muted-foreground text-xl">
                →
              </div>
            </div>
          </button>
        </div>

        <!-- 信任保障说明 -->
        <div class="mt-6 p-4 bg-trust/10 rounded-xl border border-trust/20">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">🛡️</span>
            <p class="text-lg font-semibold text-foreground">服务保障</p>
          </div>
          <ul class="text-base text-muted-foreground space-y-2">
            <li class="flex items-center gap-2">
              <span class="text-trust">✓</span> 所有志愿者均通过实名认证
            </li>
            <li class="flex items-center gap-2">
              <span class="text-trust">✓</span> 服务全程可追溯
            </li>
            <li class="flex items-center gap-2">
              <span class="text-trust">✓</span> 社区监督保障安全
            </li>
          </ul>
        </div>
      </main>

      <!-- 底部导航 -->
      <nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4">
        <div class="max-w-md mx-auto flex justify-around">
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
          <button 
            @click="goToProfile"
            class="flex flex-col items-center text-muted-foreground"
          >
            <span class="text-2xl">👤</span>
            <span class="text-base">我的</span>
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>
