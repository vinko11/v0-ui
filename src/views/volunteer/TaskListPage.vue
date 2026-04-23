<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ClipboardList, 
  CheckCircle, 
  FileText, 
  User,
  MapPin,
  Clock,
  Phone,
  Award,
  BookOpen,
  Wallet,
  Star,
  X,
  MessageCircle,
  Stethoscope,
  ShoppingBag
} from 'lucide-vue-next'
import { 
  pendingOrders, 
  myAcceptedOrders, 
  currentVolunteer,
  volunteerEarnings,
  acceptOrder,
  rejectOrder,
  showToast
} from '@/stores/globalStore'

const router = useRouter()
const activeTab = ref('tasks')

const serviceIcons: Record<string, any> = {
  'chat': MessageCircle,
  'hospital': Stethoscope,
  'shopping': ShoppingBag
}

// 培训中心
const trainingItems = [
  { id: '1', title: '轮椅使用指南', icon: '🦽', completed: true },
  { id: '2', title: '急救基础知识', icon: '🏥', completed: false },
  { id: '3', title: '沟通技巧培训', icon: '💬', completed: true }
]

// 拒绝弹窗
const showRejectModal = ref(false)
const rejectingOrderId = ref<string | null>(null)
const rejectReason = ref('')
const rejectError = ref('')

function handleAcceptOrder(orderId: string) {
  showToast('处理中...', 'loading')
  setTimeout(() => {
    acceptOrder(orderId)
    showToast('接单成功！请按时上门服务', 'success')
  }, 800)
}

function openRejectModal(orderId: string) {
  rejectingOrderId.value = orderId
  rejectReason.value = ''
  rejectError.value = ''
  showRejectModal.value = true
}

function confirmReject() {
  if (rejectReason.value.length < 5) {
    rejectError.value = '拒绝原因至少需要5个字符'
    return
  }
  
  showToast('处理中...', 'loading')
  setTimeout(() => {
    rejectOrder(rejectingOrderId.value!, rejectReason.value)
    showToast('已拒绝该订单', 'success')
    showRejectModal.value = false
    rejectingOrderId.value = null
    rejectReason.value = ''
  }, 500)
}

function startTask(orderId: string) {
  router.push(`/volunteer/execute/${orderId}`)
}

function goToWallet() {
  router.push('/volunteer/wallet')
}
</script>

<template>
  <div class="min-h-screen bg-background pb-28">
    <!-- 顶部导航 -->
    <header class="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground px-4 py-6">
      <h1 class="text-2xl font-bold text-center">志愿者中心</h1>
      
      <!-- 信任徽章 -->
      <div class="flex justify-center gap-2 mt-3">
        <span class="trust-badge bg-white/20 text-white text-sm">
          <Award :size="16" />
          {{ currentVolunteer.badges[0] || '志愿者' }}
        </span>
        <span class="trust-badge bg-white/20 text-white text-sm">
          <Star :size="16" />
          {{ currentVolunteer.rating }}分
        </span>
      </div>
    </header>

    <!-- 荣誉墙 -->
    <div class="px-4 -mt-4">
      <div class="card-warm bg-gradient-to-r from-primary/5 to-warning/5 border border-primary/10">
        <div class="grid grid-cols-4 gap-3 text-center">
          <div>
            <p class="text-2xl font-bold text-primary">{{ currentVolunteer.totalHours }}</p>
            <p class="text-xs text-muted-foreground mt-1">服务时长</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-success">{{ currentVolunteer.totalOrders }}</p>
            <p class="text-xs text-muted-foreground mt-1">完成任务</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-warning">{{ currentVolunteer.rating }}</p>
            <p class="text-xs text-muted-foreground mt-1">服务评分</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-primary">{{ currentVolunteer.badges.length }}</p>
            <p class="text-xs text-muted-foreground mt-1">勋章数</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 预估薪酬入口 -->
    <div class="px-4 mt-4">
      <button 
        @click="goToWallet"
        class="card-warm w-full flex items-center justify-between hover:shadow-md transition-shadow active:scale-[0.98]"
      >
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
            <Wallet :size="28" class="text-success" />
          </div>
          <div class="text-left">
            <p class="text-lg font-semibold text-foreground">预估薪酬</p>
            <p class="text-2xl font-bold text-success">¥{{ volunteerEarnings.net.toFixed(0) }}</p>
          </div>
        </div>
        <div class="text-right text-sm text-muted-foreground">
          <p>总工时: {{ volunteerEarnings.totalHours }}h</p>
          <p>时薪: ¥{{ volunteerEarnings.hourlyRate }}/h</p>
        </div>
      </button>
    </div>

    <!-- 培训中心入口 -->
    <div class="px-4 mt-4">
      <div class="card-warm">
        <h3 class="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <BookOpen :size="20" class="text-primary" />
          培训中心
        </h3>
        <div class="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
          <button
            v-for="item in trainingItems"
            :key="item.id"
            :class="[
              'flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-[16px] text-base font-medium',
              item.completed 
                ? 'bg-success/10 text-success border border-success/20' 
                : 'bg-secondary text-secondary-foreground'
            ]"
          >
            <span class="text-xl">{{ item.icon }}</span>
            <span>{{ item.title }}</span>
            <CheckCircle v-if="item.completed" :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- 任务统计 -->
    <div class="px-4 mt-4">
      <div class="card-warm">
        <div class="flex justify-around">
          <div class="text-center">
            <p class="text-3xl font-bold text-success">{{ myAcceptedOrders.length }}</p>
            <p class="text-lg text-muted-foreground">进行中</p>
          </div>
          <div class="w-px bg-border"></div>
          <div class="text-center">
            <p class="text-3xl font-bold text-warning">{{ pendingOrders.length }}</p>
            <p class="text-lg text-muted-foreground">待接单</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="px-4 mt-6">
      <h2 class="text-xl font-bold text-foreground mb-4">待接任务</h2>
      
      <!-- 空状态 -->
      <div v-if="pendingOrders.length === 0" class="card-warm text-center py-12">
        <div class="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardList :size="40" class="text-muted-foreground" />
        </div>
        <p class="text-xl text-muted-foreground mb-2">暂无待接任务</p>
        <p class="text-base text-muted-foreground">休息一下，新任务马上来</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="order in pendingOrders"
          :key="order.id"
          class="card-warm"
        >
          <!-- 任务头部 -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-[16px] bg-primary/10 flex items-center justify-center">
                <component :is="serviceIcons[order.serviceType]" :size="24" class="text-primary" />
              </div>
              <span class="text-xl font-bold text-foreground">{{ order.serviceName }}</span>
            </div>
            <span class="px-3 py-1 rounded-full bg-warning/20 text-warning text-base font-medium">
              待接单
            </span>
          </div>

          <!-- 任务描述 -->
          <p class="text-lg text-foreground mb-4 line-clamp-2">{{ order.notes }}</p>

          <!-- 任务信息 -->
          <div class="flex flex-col gap-2 mb-5 text-muted-foreground">
            <div class="flex items-center gap-3 text-base">
              <MapPin :size="18" />
              <span class="flex-1">{{ order.address }}</span>
              <span class="font-semibold text-primary">1.2km</span>
            </div>
            <div class="flex items-center gap-3 text-base">
              <Clock :size="18" />
              <span>{{ order.scheduledDate }} {{ order.scheduledTime }}</span>
            </div>
            <div class="flex items-center gap-3 text-base">
              <Phone :size="18" />
              <span>{{ order.userName }} {{ order.userPhone }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-3">
            <button
              @click="handleAcceptOrder(order.id)"
              class="btn-elder-primary flex-1"
            >
              接受
            </button>
            <button
              @click="openRejectModal(order.id)"
              class="btn-elder-destructive flex-1"
            >
              拒绝
            </button>
          </div>
        </div>
      </div>

      <!-- 进行中任务 -->
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">进行中任务</h2>
      
      <div v-if="myAcceptedOrders.length === 0" class="card-warm text-center py-8">
        <p class="text-lg text-muted-foreground">暂无进行中的任务</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="order in myAcceptedOrders"
          :key="order.id"
          class="card-warm border-2 border-success/30"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-[16px] bg-success/10 flex items-center justify-center">
                <component :is="serviceIcons[order.serviceType]" :size="24" class="text-success" />
              </div>
              <span class="text-xl font-bold text-foreground">{{ order.serviceName }}</span>
            </div>
            <span 
              :class="[
                'px-3 py-1 rounded-full text-base font-medium',
                order.status === 'IN_PROGRESS' 
                  ? 'bg-primary/20 text-primary animate-pulse-soft' 
                  : 'bg-success/20 text-success'
              ]"
            >
              {{ order.status === 'IN_PROGRESS' ? '服务中' : '已接单' }}
            </span>
          </div>

          <div class="flex flex-col gap-2 mb-4 text-muted-foreground">
            <div class="flex items-center gap-3 text-base">
              <MapPin :size="18" />
              <span>{{ order.address }}</span>
            </div>
            <div class="flex items-center gap-3 text-base">
              <Clock :size="18" />
              <span>{{ order.scheduledDate }} {{ order.scheduledTime }}</span>
            </div>
          </div>

          <button
            @click="startTask(order.id)"
            class="btn-elder-success w-full"
          >
            {{ order.status === 'IN_PROGRESS' ? '继续服务' : '开始执行' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border safe-bottom z-40">
      <div class="flex justify-around py-3">
        <button 
          @click="activeTab = 'tasks'"
          :class="['flex flex-col items-center gap-1 px-6 py-2', activeTab === 'tasks' ? 'text-primary' : 'text-muted-foreground']"
        >
          <ClipboardList :size="28" :stroke-width="activeTab === 'tasks' ? 2.5 : 2" />
          <span class="text-base font-medium">待办</span>
        </button>
        <button 
          @click="activeTab = 'completed'"
          :class="['flex flex-col items-center gap-1 px-6 py-2', activeTab === 'completed' ? 'text-primary' : 'text-muted-foreground']"
        >
          <CheckCircle :size="28" />
          <span class="text-base font-medium">已完成</span>
        </button>
        <button 
          @click="router.push('/volunteer/register')"
          :class="['flex flex-col items-center gap-1 px-6 py-2', 'text-muted-foreground']"
        >
          <FileText :size="28" />
          <span class="text-base font-medium">认证</span>
        </button>
        <button 
          @click="router.push('/volunteer/profile')"
          :class="['flex flex-col items-center gap-1 px-6 py-2', 'text-muted-foreground']"
        >
          <User :size="28" />
          <span class="text-base font-medium">我的</span>
        </button>
      </div>
    </nav>

    <!-- 拒绝原因弹窗 -->
    <Teleport to="body">
      <div
        v-if="showRejectModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-card rounded-[32px] p-6 w-full max-w-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-2xl font-bold text-foreground">拒绝原因</h3>
            <button 
              @click="showRejectModal = false"
              class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
            >
              <X :size="24" />
            </button>
          </div>
          <p class="text-lg text-muted-foreground mb-4">请说明拒绝此任务的原因（至少5个字符）</p>
          
          <textarea
            v-model="rejectReason"
            rows="3"
            placeholder="请输入拒绝原因..."
            class="w-full p-4 text-lg border-2 border-border rounded-[16px] bg-background focus:border-primary focus:outline-none placeholder:text-muted-foreground resize-none"
          ></textarea>
          
          <p v-if="rejectError" class="text-destructive mt-2 text-base font-medium">{{ rejectError }}</p>
          
          <div class="flex gap-3 mt-6">
            <button
              @click="showRejectModal = false"
              class="btn-elder-secondary flex-1"
            >
              取消
            </button>
            <button
              @click="confirmReject"
              class="btn-elder-destructive flex-1"
            >
              确认拒绝
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
