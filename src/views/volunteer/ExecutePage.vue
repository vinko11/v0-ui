<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  Camera,
  FileText,
  CheckCircle2,
  Navigation,
  Play,
  Square,
  Upload,
  X
} from 'lucide-vue-next'
import { orderList, startService, completeService, showToast } from '@/stores/globalStore'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id as string

const order = computed(() => orderList.value.find(o => o.id === orderId))

// 任务状态：0-未到达, 1-已到达, 2-服务中, 3-已完成
const taskStatus = ref(0)

// 服务计时
const serviceStartTime = ref<Date | null>(null)
const elapsedSeconds = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

// 安全检查清单
const safetyChecklist = ref([
  { id: 'id', label: '我已携带身份证', checked: false },
  { id: 'health', label: '我身体健康无不适', checked: false },
  { id: 'phone', label: '手机已充满电', checked: false }
])

const allChecksPassed = computed(() => safetyChecklist.value.every(item => item.checked))

// 报备系统
const showReportModal = ref(false)
const reportContent = ref('')
const reportPhotos = ref<string[]>([])

const elapsedTime = computed(() => {
  const hours = Math.floor(elapsedSeconds.value / 3600)
  const minutes = Math.floor((elapsedSeconds.value % 3600) / 60)
  const seconds = elapsedSeconds.value % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const statusLabels = ['前往中', '已到达', '服务中', '已完成']
const currentStatusLabel = computed(() => statusLabels[taskStatus.value])

const buttonConfig = computed(() => {
  switch (taskStatus.value) {
    case 0:
      return { text: '确认到达', icon: Navigation, color: 'btn-elder bg-warning text-white hover:bg-warning/90' }
    case 1:
      return { text: '开始服务', icon: Play, color: 'btn-elder-primary' }
    case 2:
      return { text: '结束服务', icon: Square, color: 'btn-elder-success' }
    default:
      return { text: '已完成', icon: CheckCircle2, color: 'btn-elder bg-muted text-muted-foreground' }
  }
})

const canProceed = computed(() => {
  if (taskStatus.value === 0) {
    return allChecksPassed.value
  }
  return true
})

function handleStatusChange() {
  if (!canProceed.value) return
  
  if (taskStatus.value === 0) {
    // 到达
    taskStatus.value = 1
    showToast('已确认到达', 'success')
  } else if (taskStatus.value === 1) {
    // 开始服务
    taskStatus.value = 2
    serviceStartTime.value = new Date()
    startService(orderId)
    showToast('服务开始计时', 'success')
    
    // 开始计时
    timerInterval = setInterval(() => {
      elapsedSeconds.value++
    }, 1000)
  } else if (taskStatus.value === 2) {
    // 结束服务
    if (timerInterval) {
      clearInterval(timerInterval)
    }
    taskStatus.value = 3
    const duration = Math.round(elapsedSeconds.value / 60)
    completeService(orderId, duration)
    showToast('服务完成，感谢您的付出！', 'success')
    
    setTimeout(() => {
      router.push('/volunteer')
    }, 2000)
  }
}

function openReportModal() {
  showReportModal.value = true
}

function submitReport() {
  if (!reportContent.value.trim()) {
    showToast('请填写报备内容', 'error')
    return
  }
  showToast('处理中...', 'loading')
  setTimeout(() => {
    showToast('报备提交成功', 'success')
    showReportModal.value = false
    reportContent.value = ''
    reportPhotos.value = []
  }, 800)
}

function addPhoto() {
  // 模拟添加照片
  reportPhotos.value.push(`photo_${Date.now()}`)
}

function removePhoto(index: number) {
  reportPhotos.value.splice(index, 1)
}

onMounted(() => {
  // 检查订单状态，恢复状态
  if (order.value?.status === 'IN_PROGRESS') {
    taskStatus.value = 2
    // 计算已过去的时间
    if (order.value.startedAt) {
      const startTime = new Date(order.value.startedAt)
      elapsedSeconds.value = Math.floor((Date.now() - startTime.getTime()) / 1000)
      timerInterval = setInterval(() => {
        elapsedSeconds.value++
      }, 1000)
    }
  }
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<template>
  <div class="min-h-screen bg-background pb-36">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-30 bg-card border-b border-border">
      <div class="flex items-center gap-4 px-4 py-4">
        <button 
          @click="router.push('/volunteer')" 
          class="w-12 h-12 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowLeft :size="24" />
        </button>
        <h1 class="text-2xl font-bold">任务执行</h1>
      </div>
    </header>

    <template v-if="order">
      <!-- 状态指示器 -->
      <div class="px-4 mt-4">
        <div class="card-warm">
          <div class="text-center">
            <div
              :class="[
                'inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl mb-3',
                taskStatus === 3 ? 'bg-success/20' : 'bg-primary/20'
              ]"
            >
              <Navigation v-if="taskStatus === 0" :size="40" class="text-warning" />
              <MapPin v-else-if="taskStatus === 1" :size="40" class="text-primary" />
              <Play v-else-if="taskStatus === 2" :size="40" class="text-success" />
              <CheckCircle2 v-else :size="40" class="text-success" />
            </div>
            <p class="text-2xl font-bold text-foreground">{{ currentStatusLabel }}</p>
            
            <!-- 服务计时 -->
            <div v-if="taskStatus >= 2" class="mt-4 p-4 bg-secondary rounded-[20px]">
              <p class="text-base text-muted-foreground mb-1">服务时长</p>
              <p class="text-4xl font-bold text-primary font-mono">{{ elapsedTime }}</p>
            </div>
          </div>

          <!-- 进度条 -->
          <div class="flex items-center gap-2 mt-6">
            <div
              v-for="i in 4"
              :key="i"
              :class="[
                'flex-1 h-2 rounded-full transition-all',
                i <= taskStatus + 1 ? 'bg-primary' : 'bg-muted'
              ]"
            ></div>
          </div>
          <div class="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>前往</span>
            <span>到达</span>
            <span>服务</span>
            <span>完成</span>
          </div>
        </div>
      </div>

      <!-- 安全检查清单（仅在前往阶段显示） -->
      <div v-if="taskStatus === 0" class="px-4 mt-4">
        <div class="card-warm bg-warning/5 border border-warning/20">
          <h3 class="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 :size="24" class="text-warning" />
            出发前安全确认
          </h3>
          <div class="flex flex-col gap-4">
            <label
              v-for="item in safetyChecklist"
              :key="item.id"
              class="flex items-center gap-4 cursor-pointer p-3 rounded-[16px] bg-background"
            >
              <input
                v-model="item.checked"
                type="checkbox"
                class="w-7 h-7 accent-primary rounded"
              />
              <span 
                :class="[
                  'text-lg',
                  item.checked ? 'text-foreground font-medium' : 'text-muted-foreground'
                ]"
              >
                {{ item.label }}
              </span>
              <CheckCircle2 v-if="item.checked" :size="20" class="text-success ml-auto" />
            </label>
          </div>
          <p v-if="!allChecksPassed" class="text-base text-warning mt-4 text-center">
            请完成所有安全确认后再出发
          </p>
        </div>
      </div>

      <!-- 报备按钮（服务中显示） -->
      <div v-if="taskStatus === 2" class="px-4 mt-4">
        <button 
          @click="openReportModal"
          class="card-warm w-full flex items-center justify-center gap-3 bg-trust/5 border border-trust/20 hover:shadow-md transition-shadow"
        >
          <FileText :size="24" class="text-trust" />
          <span class="text-lg font-semibold text-trust">服务报备</span>
        </button>
      </div>

      <!-- 任务信息 -->
      <div class="px-4 mt-4">
        <div class="card-warm">
          <h2 class="text-xl font-bold text-foreground mb-4">任务信息</h2>
          
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span class="text-lg text-muted-foreground">服务类型</span>
              <span class="text-lg font-semibold text-foreground">{{ order.serviceName }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-lg text-muted-foreground">预约时间</span>
              <span class="text-lg text-foreground">{{ order.scheduledDate }} {{ order.scheduledTime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系人信息 -->
      <div class="px-4 mt-4">
        <div class="card-warm">
          <h2 class="text-xl font-bold text-foreground mb-4">联系人</h2>
          
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-xl font-semibold text-foreground">{{ order.userName }}</p>
              <p class="text-lg text-muted-foreground mt-1">{{ order.userPhone }}</p>
            </div>
            <a
              :href="`tel:${order.userPhone}`"
              class="w-14 h-14 rounded-full bg-success flex items-center justify-center active:scale-95"
            >
              <Phone :size="28" class="text-white" />
            </a>
          </div>
          
          <div class="flex items-start gap-3 text-lg text-muted-foreground p-3 bg-secondary rounded-[16px]">
            <MapPin :size="20" class="flex-shrink-0 mt-0.5" />
            <span>{{ order.address }}</span>
          </div>
        </div>
      </div>

      <!-- 服务说明 -->
      <div class="px-4 mt-4 mb-8">
        <div class="card-warm">
          <h2 class="text-xl font-bold text-foreground mb-3">服务说明</h2>
          <p class="text-lg text-muted-foreground leading-relaxed">{{ order.notes }}</p>
        </div>
      </div>
    </template>

    <!-- 未找到订单 -->
    <div v-else class="px-4 py-12 text-center">
      <p class="text-xl text-muted-foreground">未找到该订单信息</p>
    </div>

    <!-- 底部操作按钮 -->
    <div class="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border p-4 safe-bottom z-40">
      <button
        @click="handleStatusChange"
        :disabled="taskStatus === 3 || !canProceed"
        :class="[
          'w-full flex items-center justify-center gap-3',
          !canProceed ? 'btn-elder bg-muted text-muted-foreground cursor-not-allowed' : buttonConfig.color,
          taskStatus === 3 && 'cursor-not-allowed'
        ]"
      >
        <component :is="buttonConfig.icon" :size="28" />
        <span>{{ buttonConfig.text }}</span>
      </button>
      
      <p v-if="taskStatus === 0 && !allChecksPassed" class="text-center text-base text-warning mt-3">
        请先完成安全确认清单
      </p>
      <p v-else-if="taskStatus < 3" class="text-center text-base text-muted-foreground mt-3">
        点击按钮更新服务状态
      </p>
      <p v-else class="text-center text-base text-success mt-3 font-medium">
        服务已完成，感谢您的付出！
      </p>
    </div>

    <!-- 报备弹窗 -->
    <Teleport to="body">
      <div
        v-if="showReportModal"
        class="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
        @click.self="showReportModal = false"
      >
        <div class="bg-card w-full max-w-lg rounded-t-[32px] p-6 max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold">服务报备</h3>
            <button 
              @click="showReportModal = false"
              class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
            >
              <X :size="24" />
            </button>
          </div>

          <div class="space-y-5">
            <!-- 服务时长 -->
            <div class="p-4 bg-secondary rounded-[16px] text-center">
              <p class="text-base text-muted-foreground">当前服务时长</p>
              <p class="text-3xl font-bold text-primary font-mono">{{ elapsedTime }}</p>
            </div>

            <!-- 报备内容 -->
            <div>
              <label class="text-lg font-semibold text-foreground block mb-2">服务心得</label>
              <textarea 
                v-model="reportContent"
                rows="4"
                placeholder="记录服务过程中的感受和心得..."
                class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none resize-none"
              ></textarea>
            </div>

            <!-- 上传照片 -->
            <div>
              <label class="text-lg font-semibold text-foreground block mb-2">服务照片</label>
              <div class="flex flex-wrap gap-3">
                <div 
                  v-for="(photo, index) in reportPhotos" 
                  :key="photo"
                  class="relative w-20 h-20 bg-secondary rounded-[12px] flex items-center justify-center"
                >
                  <Camera :size="32" class="text-muted-foreground" />
                  <button 
                    @click="removePhoto(index)"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center"
                  >
                    <X :size="14" class="text-white" />
                  </button>
                </div>
                <button 
                  @click="addPhoto"
                  class="w-20 h-20 border-2 border-dashed border-border rounded-[12px] flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload :size="24" />
                  <span class="text-xs">添加</span>
                </button>
              </div>
            </div>
          </div>

          <button 
            @click="submitReport"
            class="btn-elder-primary w-full mt-6"
          >
            提交报备
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
