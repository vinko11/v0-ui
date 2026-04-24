<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../../store/globalStore'
import {
  MessageCircle,
  Stethoscope,
  ShoppingBag,
  Shield,
  UserCheck,
  Heart,
  ChevronRight,
  Clock,
  Users,
  Award,
  Bell,
  Home,
  ClipboardList,
  User,
  AlertTriangle
} from 'lucide-vue-next'

const router = useRouter()
const store = useGlobalStore()

// 服务类型
const services = [
  {
    id: 'chat',
    name: '陪聊服务',
    desc: '倾听陪伴，温暖心灵',
    detail: '专业志愿者上门陪您聊天',
    icon: MessageCircle,
    color: 'bg-[#FF9248]',
    bgColor: 'bg-[#FFF5EE]'
  },
  {
    id: 'medical',
    name: '就医陪同',
    desc: '全程陪护，安心看诊',
    detail: '陪同就医，帮助挂号取药',
    icon: Stethoscope,
    color: 'bg-[#3B82F6]',
    bgColor: 'bg-[#EFF6FF]'
  },
  {
    id: 'shopping',
    name: '购物协助',
    desc: '代购跑腿，省心省力',
    detail: '帮您采购日用品蔬菜等',
    icon: ShoppingBag,
    color: 'bg-[#22C55E]',
    bgColor: 'bg-[#F0FDF4]'
  }
]

// 服务保障
const guarantees = [
  { icon: UserCheck, title: '实名监控', desc: '志愿者均已实名认证' },
  { icon: Shield, title: '意外保险', desc: '服务期间享意外保障' },
  { icon: Award, title: '居委背书', desc: '社区官方认证项目' }
]

// 社区统计
const stats = computed(() => ({
  totalHours: 12680,
  helpedElders: 856,
  activeVolunteers: 128
}))

// 公告
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
  }, 4000)
})

onUnmounted(() => {
  clearInterval(noticeTimer)
})

// 用户是否被冻结
const isUserFrozen = computed(() => store.state.currentUser.status === 'FROZEN')

// 跳转服务详情（不直接下单）
function goToServiceDetail(serviceId: string) {
  router.push(`/service/${serviceId}`)
}

// 查看志愿者列表
function goToVolunteerList() {
  router.push('/volunteers')
}

// 查看我的订单
function goToMyOrders() {
  router.push('/my-orders')
}

// 个人中心
function goToProfile() {
  router.push('/profile')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 冻结账户警告 -->
    <div v-if="isUserFrozen" class="bg-destructive text-destructive-foreground px-6 py-4">
      <div class="max-w-md mx-auto flex items-center justify-center gap-3">
        <AlertTriangle :size="24" />
        <p class="text-lg font-semibold">账户状态异常，请联系社区管理员</p>
      </div>
    </div>

    <!-- 顶部欢迎区 -->
    <div class="bg-gradient-to-br from-[#FF9248] to-[#FFB088] text-white px-6 py-8 rounded-b-[2rem]">
      <div class="max-w-md mx-auto">
        <div class="flex items-center justify-between mb-5">
          <div>
            <p class="text-lg opacity-90">您好，</p>
            <h1 class="text-3xl font-bold">{{ store.state.currentUser.name }}</h1>
          </div>
          <button
            @click="goToMyOrders"
            class="flex items-center gap-2 bg-white/20 px-5 py-3 rounded-full text-lg font-medium active:scale-95 transition-transform"
          >
            <Bell :size="22" />
            <span>我的订单</span>
          </button>
        </div>
        
        <!-- 信任徽章 -->
        <div class="flex flex-wrap gap-3 mb-5">
          <span class="trust-badge bg-white/20 text-white">
            <UserCheck :size="16" />
            <span>实名认证</span>
          </span>
          <span class="trust-badge bg-white/20 text-white">
            <Shield :size="16" />
            <span>社区认证</span>
          </span>
          <span class="trust-badge bg-white/20 text-white">
            <Award :size="16" />
            <span>服务保障</span>
          </span>
        </div>
        
        <!-- 滚动公告 -->
        <div class="bg-white/20 rounded-[1.5rem] px-5 py-3 overflow-hidden">
          <div class="flex items-center gap-3">
            <span class="shrink-0 bg-white text-[#FF9248] px-3 py-1 rounded-full text-sm font-bold">公告</span>
            <p class="text-base whitespace-nowrap transition-all duration-500">
              {{ notices[currentNoticeIndex] }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端内容容器 -->
    <div class="max-w-md mx-auto pb-28">
      <!-- 社区统计 -->
      <div class="mx-5 -mt-5 bg-card rounded-[2rem] shadow-sm p-6">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="flex items-center justify-center gap-1.5 text-[#FF9248]">
              <Clock :size="20" />
              <span class="text-2xl font-bold">{{ stats.totalHours.toLocaleString() }}</span>
            </div>
            <p class="text-sm text-muted-foreground mt-1">累计服务时长</p>
          </div>
          <div class="border-x border-border">
            <div class="flex items-center justify-center gap-1.5 text-[#3B82F6]">
              <Heart :size="20" />
              <span class="text-2xl font-bold">{{ stats.helpedElders }}</span>
            </div>
            <p class="text-sm text-muted-foreground mt-1">帮助长者数</p>
          </div>
          <div>
            <div class="flex items-center justify-center gap-1.5 text-[#22C55E]">
              <Users :size="20" />
              <span class="text-2xl font-bold">{{ stats.activeVolunteers }}</span>
            </div>
            <p class="text-sm text-muted-foreground mt-1">活跃志愿者</p>
          </div>
        </div>
      </div>

      <!-- 服务类目 -->
      <div class="px-5 mt-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-foreground">选择服务</h2>
          <button
            @click="goToVolunteerList"
            class="flex items-center gap-1 text-[#FF9248] text-base font-medium active:opacity-70"
          >
            <span>查看志愿者</span>
            <ChevronRight :size="20" />
          </button>
        </div>
        
        <div class="space-y-4">
          <button
            v-for="service in services"
            :key="service.id"
            @click="goToServiceDetail(service.id)"
            :disabled="isUserFrozen"
            :class="[
              'w-full flex items-center gap-5 p-5 rounded-[2rem] shadow-sm transition-all duration-200',
              service.bgColor,
              isUserFrozen 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-md active:scale-[0.98]'
            ]"
          >
            <div :class="['w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0', service.color]">
              <component :is="service.icon" :size="32" class="text-white" />
            </div>
            <div class="flex-1 text-left">
              <h3 class="text-xl font-bold text-foreground">{{ service.name }}</h3>
              <p class="text-base text-muted-foreground mt-0.5">{{ service.desc }}</p>
              <p class="text-sm text-[#3B82F6] mt-1">{{ service.detail }}</p>
            </div>
            <ChevronRight :size="28" class="text-muted-foreground shrink-0" />
          </button>
        </div>
      </div>

      <!-- 服务保障 -->
      <div class="px-5 mt-8">
        <h2 class="text-2xl font-bold text-foreground mb-4">服务保障</h2>
        <div class="bg-[#EFF6FF] rounded-[2rem] p-6 border border-[#3B82F6]/20">
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="item in guarantees"
              :key="item.title"
              class="text-center"
            >
              <div class="w-14 h-14 mx-auto rounded-[1.25rem] bg-white flex items-center justify-center mb-3 shadow-sm">
                <component :is="item.icon" :size="28" class="text-[#3B82F6]" />
              </div>
              <h4 class="text-base font-bold text-foreground">{{ item.title }}</h4>
              <p class="text-xs text-muted-foreground mt-1 leading-relaxed">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 查看志愿者入口 -->
      <div class="px-5 mt-6">
        <button
          @click="goToVolunteerList"
          class="w-full p-5 bg-card rounded-[2rem] shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform"
        >
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-[1.25rem] bg-[#FFF5EE] flex items-center justify-center">
              <Users :size="28" class="text-[#FF9248]" />
            </div>
            <div class="text-left">
              <p class="text-xl font-bold text-foreground">查看志愿者</p>
              <p class="text-base text-muted-foreground">浏览志愿者档案和评价</p>
            </div>
          </div>
          <ChevronRight :size="28" class="text-muted-foreground" />
        </button>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom">
      <div class="max-w-md mx-auto flex justify-around py-3">
        <button class="flex flex-col items-center gap-1 text-[#FF9248] px-4 py-2">
          <Home :size="26" />
          <span class="text-sm font-medium">首页</span>
        </button>
        <button 
          @click="goToVolunteerList"
          class="flex flex-col items-center gap-1 text-muted-foreground px-4 py-2"
        >
          <Users :size="26" />
          <span class="text-sm">志愿者</span>
        </button>
        <button 
          @click="goToMyOrders"
          class="flex flex-col items-center gap-1 text-muted-foreground px-4 py-2"
        >
          <ClipboardList :size="26" />
          <span class="text-sm">我的订单</span>
        </button>
        <button 
          @click="goToProfile"
          class="flex flex-col items-center gap-1 text-muted-foreground px-4 py-2"
        >
          <User :size="26" />
          <span class="text-sm">我的</span>
        </button>
      </div>
    </nav>
  </div>
</template>
