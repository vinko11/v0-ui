<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../../store/globalStore'
import {
  ClipboardList,
  CheckCircle,
  FileText,
  User,
  MapPin,
  Clock,
  Star,
  Award,
  BookOpen,
  Wallet,
  X,
  AlertTriangle,
  MessageCircle,
  Stethoscope,
  ShoppingBag,
  ChevronRight
} from 'lucide-vue-next'

const router = useRouter()
const store = useGlobalStore()

// 服务类型图标映射
const serviceIcons: Record<string, typeof MessageCircle> = {
  chat: MessageCircle,
  medical: Stethoscope,
  shopping: ShoppingBag
}

// 志愿者状态
const volunteerStatus = computed(() => store.state.currentVolunteer.status)

// 待处理订单（PENDING状态）
const pendingOrders = computed(() => {
  return store.state.orders.filter(o => o.status === 'PENDING')
})

// 我的订单（已接单或服务中）
const myOrders = computed(() => {
  return store.state.orders.filter(
    o => o.volunteerId === store.state.currentVolunteer.id && 
    (o.status === 'ACCEPTED' || o.status === 'IN_SERVICE')
  )
})

// 预估收入计算
const estimatedIncome = computed(() => {
  const hourlyRate = store.state.currentVolunteer.hourlyRate
  const totalHours = store.state.currentVolunteer.totalHours
  const gross = totalHours * hourlyRate
  const platformFee = gross * 0.12
  return {
    gross,
    platformFee,
    net: gross - platformFee
  }
})

// 培训中心
const trainingItems = [
  { id: '1', title: '轮椅使用指南', icon: '🦽', completed: true },
  { id: '2', title: '急救基础知识', icon: '🏥', completed: true },
  { id: '3', title: '沟通技巧培训', icon: '💬', completed: false }
]

// 拒绝弹窗
const showRejectModal = ref(false)
const rejectingOrderId = ref<string | null>(null)
const rejectReason = ref('')
const rejectError = ref('')

// 接受订单
function acceptOrder(orderId: string) {
  store.showToast('处理中...', 'loading')
  setTimeout(() => {
    store.acceptOrder(
      orderId, 
      store.state.currentVolunteer.id, 
      store.state.currentVolunteer.name
    )
    store.showToast('接单成功！', 'success')
  }, 800)
}

// 打开拒绝弹窗
function openRejectModal(orderId: string) {
  rejectingOrderId.value = orderId
  rejectReason.value = ''
  rejectError.value = ''
  showRejectModal.value = true
}

// 确认拒绝
function confirmReject() {
  if (rejectReason.value.length < 5) {
    rejectError.value = '拒绝原因至少需要5个字符'
    return
  }
  
  store.showToast('处理中...', 'loading')
  setTimeout(() => {
    store.rejectOrder(rejectingOrderId.value!, rejectReason.value)
    store.showToast('已拒绝该订单', 'success')
    showRejectModal.value = false
  }, 500)
}

// 开始执行
function startTask(orderId: string) {
  router.push(`/volunteer/execute/${orderId}`)
}

// 导航
function goToWallet() {
  router.push('/volunteer/wallet')
}

function goToProfile() {
  router.push('/volunteer/profile')
}

function goToRegister() {
  router.push('/volunteer/register')
}
</script>

<template>
  <div class="min-h-screen bg-background pb-28">
    <!-- 顶部导航 -->
    <header class="bg-gradient-to-br from-[#FF9248] to-[#FFB088] text-white px-4 py-6 rounded-b-[2rem]">
      <div class="max-w-md mx-auto">
        <h1 class="text-2xl font-bold text-center mb-3">志愿者中心</h1>
        
        <!-- 状态徽章 -->
        <div class="flex justify-center gap-3">
          <span class="trust-badge bg-white/20 text-white">
            <Star :size="16" fill="currentColor" />
            <span>{{ store.state.currentVolunteer.rating }} 分</span>
          </span>
          <span 
            :class="[
              'trust-badge',
              volunteerStatus === 'APPROVED' 
                ? 'bg-white/20 text-white' 
                : 'bg-warning/80 text-white'
            ]"
          >
            <CheckCircle :size="16" />
            <span>{{ volunteerStatus === 'APPROVED' ? '已认证' : volunteerStatus === 'PENDING' ? '审核中' : '未认证' }}</span>
          </span>
        </div>
      </div>
    </header>

    <div class="max-w-md mx-auto">
      <!-- 荣誉墙 -->
      <div class="mx-5 -mt-4 bg-card rounded-[2rem] shadow-sm p-5">
        <div class="grid grid-cols-4 gap-3 text-center">
          <div>
            <div class="text-2xl font-bold text-[#FF9248]">{{ store.state.currentVolunteer.totalHours }}</div>
            <p class="text-xs text-muted-foreground mt-1">服务时长</p>
          </div>
          <div>
            <div class="text-2xl font-bold text-[#22C55E]">{{ store.state.currentVolunteer.serviceCount }}</div>
            <p class="text-xs text-muted-foreground mt-1">完成任务</p>
          </div>
          <div>
            <div class="text-2xl font-bold text-[#F59E0B]">{{ store.state.currentVolunteer.rating }}</div>
            <p class="text-xs text-muted-foreground mt-1">服务评分</p>
          </div>
          <div>
            <div class="text-2xl font-bold text-[#3B82F6]">{{ store.state.currentVolunteer.badges.length }}</div>
            <p class="text-xs text-muted-foreground mt-1">勋章数</p>
          </div>
        </div>
      </div>

      <!-- 预估薪酬入口 -->
      <button
        @click="goToWallet"
        class="mx-5 mt-4 w-[calc(100%-2.5rem)] bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-[2rem] p-5 flex items-center justify-between active:scale-[0.98] transition-transform"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Wallet :size="24" />
          </div>
          <div class="text-left">
            <p class="text-base opacity-90">预估收入</p>
            <p class="text-2xl font-bold">¥ {{ estimatedIncome.net.toFixed(0) }}</p>
          </div>
        </div>
        <ChevronRight :size="24" />
      </button>

      <!-- 培训中心 -->
      <div class="mx-5 mt-4 bg-card rounded-[2rem] shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen :size="20" class="text-[#FF9248]" />
            培训中心
          </h3>
          <span class="text-sm text-[#FF9248] font-medium">查看全部</span>
        </div>
        <div class="flex gap-3 overflow-x-auto pb-1">
          <div
            v-for="item in trainingItems"
            :key="item.id"
            :class="[
              'shrink-0 flex items-center gap-2 px-4 py-3 rounded-[1.25rem] text-base font-medium',
              item.completed 
                ? 'bg-[#F0FDF4] text-[#22C55E]' 
                : 'bg-[#FFF5EE] text-[#FF9248]'
            ]"
          >
            <span class="text-xl">{{ item.icon }}</span>
            <span>{{ item.title }}</span>
            <CheckCircle v-if="item.completed" :size="18" />
          </div>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="mx-5 mt-4 grid grid-cols-2 gap-4">
        <div class="bg-card rounded-[1.5rem] p-5 shadow-sm text-center">
          <p class="text-3xl font-bold text-[#FF9248]">{{ pendingOrders.length }}</p>
          <p class="text-base text-muted-foreground mt-1">待接单</p>
        </div>
        <div class="bg-card rounded-[1.5rem] p-5 shadow-sm text-center">
          <p class="text-3xl font-bold text-[#22C55E]">{{ myOrders.length }}</p>
          <p class="text-base text-muted-foreground mt-1">进行中</p>
        </div>
      </div>

      <!-- 我的订单 -->
      <div v-if="myOrders.length > 0" class="px-5 mt-6">
        <h2 class="text-xl font-bold text-foreground mb-4">我的订单</h2>
        <div class="space-y-4">
          <div
            v-for="order in myOrders"
            :key="order.id"
            class="bg-card rounded-[2rem] p-5 shadow-sm"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-[#FFF5EE] flex items-center justify-center">
                  <component :is="serviceIcons[order.serviceType]" :size="24" class="text-[#FF9248]" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-foreground">{{ order.serviceTypeName }}</h3>
                  <p class="text-sm text-muted-foreground">{{ order.userName }}</p>
                </div>
              </div>
              <span 
                :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium',
                  order.status === 'IN_SERVICE' 
                    ? 'bg-[#22C55E]/20 text-[#22C55E]' 
                    : 'bg-[#3B82F6]/20 text-[#3B82F6]'
                ]"
              >
                {{ order.status === 'IN_SERVICE' ? '服务中' : '已接单' }}
              </span>
            </div>

            <div class="space-y-2 text-base text-muted-foreground mb-4">
              <div class="flex items-center gap-2">
                <MapPin :size="18" />
                <span>{{ order.address }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Clock :size="18" />
                <span>{{ order.date }} {{ order.time }}</span>
              </div>
            </div>

            <button
              @click="startTask(order.id)"
              class="w-full btn-elder bg-[#22C55E] text-white font-bold active:scale-[0.98] transition-transform"
            >
              {{ order.status === 'IN_SERVICE' ? '继续服务' : '开始执行' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 待接订单 -->
      <div class="px-5 mt-6">
        <h2 class="text-xl font-bold text-foreground mb-4">待接订单</h2>
        
        <!-- 空状态 -->
        <div v-if="pendingOrders.length === 0" class="text-center py-12">
          <div class="empty-state-illustration mx-auto mb-4" />
          <p class="text-xl text-muted-foreground">暂无待接订单</p>
          <p class="text-base text-muted-foreground mt-2">休息一下，等待新订单吧</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="order in pendingOrders"
            :key="order.id"
            class="bg-card rounded-[2rem] p-5 shadow-sm"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-[#FFF5EE] flex items-center justify-center">
                  <component :is="serviceIcons[order.serviceType]" :size="24" class="text-[#FF9248]" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-foreground">{{ order.serviceTypeName }}</h3>
                  <p class="text-sm text-muted-foreground">{{ order.userName }}</p>
                </div>
              </div>
              <span class="px-3 py-1.5 rounded-full text-sm font-medium bg-[#F59E0B]/20 text-[#D97706]">
                待接单
              </span>
            </div>

            <p class="text-base text-foreground mb-3 line-clamp-2">{{ order.notes || '无备注' }}</p>

            <div class="space-y-2 text-base text-muted-foreground mb-4">
              <div class="flex items-center gap-2">
                <MapPin :size="18" />
                <span class="flex-1">{{ order.address }}</span>
                <span class="font-semibold text-[#FF9248]">1.2km</span>
              </div>
              <div class="flex items-center gap-2">
                <Clock :size="18" />
                <span>{{ order.date }} {{ order.time }}</span>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                @click="acceptOrder(order.id)"
                class="flex-1 btn-elder bg-[#FF9248] text-white font-bold active:scale-[0.98] transition-transform"
              >
                接受
              </button>
              <button
                @click="openRejectModal(order.id)"
                class="flex-1 btn-elder bg-destructive text-white font-bold active:scale-[0.98] transition-transform"
              >
                拒绝
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom">
      <div class="max-w-md mx-auto flex justify-around py-3">
        <button class="flex flex-col items-center gap-1 text-[#FF9248] px-4 py-2">
          <ClipboardList :size="26" />
          <span class="text-sm font-medium">待办</span>
        </button>
        <button class="flex flex-col items-center gap-1 text-muted-foreground px-4 py-2">
          <CheckCircle :size="26" />
          <span class="text-sm">已完成</span>
        </button>
        <button 
          @click="goToWallet"
          class="flex flex-col items-center gap-1 text-muted-foreground px-4 py-2"
        >
          <Wallet :size="26" />
          <span class="text-sm">钱包</span>
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

    <!-- 拒绝原因弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showRejectModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5"
          @click.self="showRejectModal = false"
        >
          <div class="bg-card rounded-[2rem] p-6 w-full max-w-sm shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-foreground flex items-center gap-2">
                <AlertTriangle :size="22" class="text-[#F59E0B]" />
                拒绝原因
              </h3>
              <button
                @click="showRejectModal = false"
                class="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              >
                <X :size="20" />
              </button>
            </div>
            
            <p class="text-base text-muted-foreground mb-4">请说明拒绝此订单的原因（至少5个字符），此信息将记录在系统中。</p>
            
            <textarea
              v-model="rejectReason"
              rows="4"
              placeholder="请输入拒绝原因..."
              class="w-full p-4 text-lg border-2 border-border rounded-[1.5rem] bg-background focus:border-[#FF9248] focus:outline-none placeholder:text-muted-foreground resize-none"
            />
            
            <p v-if="rejectError" class="text-destructive mt-2 text-base font-medium">{{ rejectError }}</p>
            
            <div class="flex gap-3 mt-6">
              <button
                @click="showRejectModal = false"
                class="flex-1 btn-elder bg-secondary text-foreground font-bold"
              >
                取消
              </button>
              <button
                @click="confirmReject"
                class="flex-1 btn-elder bg-destructive text-white font-bold"
              >
                确认拒绝
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
