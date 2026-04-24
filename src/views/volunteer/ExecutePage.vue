<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '../../store/globalStore'
import {
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  Shield,
  Camera,
  FileText,
  CheckCircle,
  Play,
  Square,
  Upload,
  X,
  MessageCircle,
  Stethoscope,
  ShoppingBag
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useGlobalStore()

const orderId = computed(() => route.params.id as string)

// 获取订单信息
const order = computed(() => {
  return store.state.orders.find(o => o.id === orderId.value)
})

// 服务类型图标映射
const serviceIcons: Record<string, typeof MessageCircle> = {
  chat: MessageCircle,
  medical: Stethoscope,
  shopping: ShoppingBag
}

// 任务状态：0-前往中, 1-已到达, 2-服务中, 3-已完成
const taskStatus = computed(() => {
  if (!order.value) return 0
  switch (order.value.status) {
    case 'ACCEPTED': return 0
    case 'IN_SERVICE': return 2
    case 'COMPLETED': return 3
    default: return 0
  }
})

// 本地状态（用于UI过渡）
const localStatus = ref(0)

onMounted(() => {
  localStatus.value = taskStatus.value
})

// 安全检查清单
const safetyChecklist = ref([
  { id: 'id', label: '我已携带身份证', checked: false },
  { id: 'health', label: '我身体健康无不适', checked: false },
  { id: 'phone', label: '手机已充满电', checked: false }
])

const allChecksPassed = computed(() => safetyChecklist.value.every(item => item.checked))

// 服务计时
const serviceTimer = ref(0)
const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)

function startTimer() {
  if (timerInterval.value) return
  timerInterval.value = setInterval(() => {
    serviceTimer.value++
  }, 1000)
}

function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

onUnmounted(() => {
  stopTimer()
})

// 格式化时间
const formattedTime = computed(() => {
  const hours = Math.floor(serviceTimer.value / 3600)
  const minutes = Math.floor((serviceTimer.value % 3600) / 60)
  const seconds = serviceTimer.value % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

// 报备弹窗
const showReportModal = ref(false)
const reportContent = ref('')
const reportPhotos = ref<string[]>([])

// 状态标签
const statusLabels = ['前往中', '已到达', '服务中', '已完成']
const currentStatusLabel = computed(() => statusLabels[localStatus.value])

// 按钮配置
const buttonConfig = computed(() => {
  switch (localStatus.value) {
    case 0:
      return { text: '确认到达', color: 'bg-[#F59E0B]', icon: MapPin }
    case 1:
      return { text: '开始服务', color: 'bg-[#FF9248]', icon: Play }
    case 2:
      return { text: '结束服务', color: 'bg-[#22C55E]', icon: Square }
    default:
      return { text: '已完成', color: 'bg-muted', icon: CheckCircle }
  }
})

const canProceed = computed(() => {
  if (localStatus.value === 0) {
    return allChecksPassed.value
  }
  return true
})

// 处理状态变更
function handleStatusChange() {
  if (!canProceed.value || localStatus.value >= 3) return
  
  store.showToast('处理中...', 'loading')
  
  setTimeout(() => {
    if (localStatus.value === 0) {
      // 到达
      localStatus.value = 1
      store.showToast('已确认到达！', 'success')
    } else if (localStatus.value === 1) {
      // 开始服务
      localStatus.value = 2
      store.startService(orderId.value)
      startTimer()
      store.showToast('服务已开始，计时中...', 'success')
    } else if (localStatus.value === 2) {
      // 结束服务
      stopTimer()
      store.endService(orderId.value, reportContent.value, reportPhotos.value)
      localStatus.value = 3
      store.showToast('服务已完成，感谢您的付出！', 'success')
      setTimeout(() => {
        router.push('/volunteer')
      }, 2000)
    }
  }, 600)
}

// 打开报备弹窗
function openReportModal() {
  showReportModal.value = true
}

// 提交报备
function submitReport() {
  if (reportContent.value.length < 5) {
    store.showToast('请填写报备内容（至少5个字）', 'error')
    return
  }
  store.showToast('报备提交成功！', 'success')
  showReportModal.value = false
}

// 模拟添加照片
function addPhoto() {
  reportPhotos.value.push(`photo_${Date.now()}.jpg`)
  store.showToast('照片已添加', 'success')
}

// 返回
function goBack() {
  router.push('/volunteer')
}

// 拨打电话
function callContact() {
  if (order.value) {
    window.location.href = `tel:${order.value.userPhone}`
  }
}
</script>

<template>
  <div class="min-h-screen bg-background pb-40">
    <!-- 顶部导航 -->
    <header class="bg-gradient-to-br from-[#FF9248] to-[#FFB088] text-white px-4 py-5 rounded-b-[2rem]">
      <div class="max-w-md mx-auto flex items-center gap-4">
        <button 
          @click="goBack"
          class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft :size="24" />
        </button>
        <h1 class="text-2xl font-bold">任务执行</h1>
      </div>
    </header>

    <div v-if="order" class="max-w-md mx-auto">
      <!-- 状态指示器和计时 -->
      <div class="mx-5 -mt-4 bg-card rounded-[2rem] p-6 shadow-sm">
        <div class="text-center">
          <!-- 服务计时（服务中显示） -->
          <div v-if="localStatus === 2" class="mb-4">
            <p class="text-base text-muted-foreground mb-1">服务时长</p>
            <p class="text-4xl font-mono font-bold text-[#FF9248]">{{ formattedTime }}</p>
          </div>
          
          <!-- 状态图标 -->
          <div
            :class="[
              'inline-flex items-center justify-center w-20 h-20 rounded-[1.5rem] mb-3',
              localStatus === 3 ? 'bg-[#22C55E]/20' : 'bg-[#FF9248]/20'
            ]"
          >
            <component 
              :is="serviceIcons[order.serviceType] || MessageCircle" 
              :size="36" 
              :class="localStatus === 3 ? 'text-[#22C55E]' : 'text-[#FF9248]'"
            />
          </div>
          <p class="text-2xl font-bold text-foreground">{{ currentStatusLabel }}</p>
        </div>

        <!-- 进度条 -->
        <div class="flex items-center gap-2 mt-6">
          <div
            v-for="i in 4"
            :key="i"
            :class="[
              'flex-1 h-2.5 rounded-full transition-all duration-500',
              i <= localStatus + 1 ? 'bg-[#FF9248]' : 'bg-muted'
            ]"
          />
        </div>
        <div class="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>前往</span>
          <span>到达</span>
          <span>服务</span>
          <span>完成</span>
        </div>
      </div>

      <!-- 安全检查清单（仅在前往阶段显示） -->
      <div v-if="localStatus === 0" class="mx-5 mt-4 bg-[#FEF3C7] rounded-[2rem] p-5 border border-[#F59E0B]/30">
        <h3 class="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Shield :size="22" class="text-[#F59E0B]" />
          出发前安全确认
        </h3>
        <div class="flex flex-col gap-4">
          <label
            v-for="item in safetyChecklist"
            :key="item.id"
            class="flex items-center gap-4 cursor-pointer"
          >
            <div 
              :class="[
                'w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all',
                item.checked 
                  ? 'bg-[#22C55E] border-[#22C55E]' 
                  : 'border-border bg-white'
              ]"
            >
              <CheckCircle v-if="item.checked" :size="18" class="text-white" />
            </div>
            <input v-model="item.checked" type="checkbox" class="hidden" />
            <span 
              :class="[
                'text-lg',
                item.checked ? 'text-foreground font-medium' : 'text-muted-foreground'
              ]"
            >
              {{ item.label }}
            </span>
          </label>
        </div>
        <p v-if="!allChecksPassed" class="text-base text-[#D97706] mt-4 font-medium">
          请完成所有安全确认后再出发
        </p>
      </div>

      <!-- 报备按钮（服务中显示） -->
      <div v-if="localStatus === 2" class="mx-5 mt-4">
        <button
          @click="openReportModal"
          class="w-full flex items-center justify-center gap-3 py-4 bg-[#3B82F6] text-white rounded-[1.5rem] text-lg font-bold active:scale-[0.98] transition-transform"
        >
          <Camera :size="24" />
          <span>服务报备</span>
        </button>
        <p class="text-center text-sm text-muted-foreground mt-2">
          上传服务照片或填写心得
        </p>
      </div>

      <!-- 任务信息 -->
      <div class="px-5 mt-4">
        <div class="bg-card rounded-[2rem] p-5 shadow-sm">
          <h2 class="text-xl font-bold text-foreground mb-4">任务信息</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-base text-muted-foreground">服务类型</span>
              <span class="text-base font-semibold text-foreground">{{ order.serviceTypeName }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-base text-muted-foreground">预约时间</span>
              <span class="text-base text-foreground">{{ order.date }} {{ order.time }}</span>
            </div>
          </div>
        </div>

        <!-- 联系人信息 -->
        <div class="bg-card rounded-[2rem] p-5 shadow-sm mt-4">
          <h2 class="text-xl font-bold text-foreground mb-4">联系人</h2>
          
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xl font-semibold text-foreground">{{ order.userName }}</p>
              <p class="text-base text-muted-foreground mt-1">{{ order.userPhone }}</p>
            </div>
            <button
              @click="callContact"
              class="w-14 h-14 rounded-[1.25rem] bg-[#22C55E] flex items-center justify-center active:scale-95 transition-transform"
            >
              <Phone :size="24" class="text-white" />
            </button>
          </div>
          
          <div class="flex items-start gap-3 mt-4 text-base text-muted-foreground">
            <MapPin :size="20" class="shrink-0 mt-0.5" />
            <span>{{ order.address }}</span>
          </div>
        </div>

        <!-- 服务说明 -->
        <div class="bg-card rounded-[2rem] p-5 shadow-sm mt-4">
          <h2 class="text-xl font-bold text-foreground mb-3">服务说明</h2>
          <p class="text-base text-muted-foreground leading-relaxed">
            {{ order.notes || '无特别说明' }}
          </p>
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-5 safe-area-bottom">
      <div class="max-w-md mx-auto">
        <button
          @click="handleStatusChange"
          :disabled="localStatus === 3 || !canProceed"
          :class="[
            'w-full flex items-center justify-center gap-3 btn-elder font-bold transition-all active:scale-[0.98]',
            !canProceed ? 'bg-muted text-muted-foreground cursor-not-allowed' : buttonConfig.color,
            localStatus === 3 ? 'cursor-not-allowed' : 'text-white'
          ]"
        >
          <component :is="buttonConfig.icon" :size="24" />
          <span>{{ buttonConfig.text }}</span>
        </button>
        
        <p v-if="localStatus === 0 && !allChecksPassed" class="text-center text-base text-[#F59E0B] mt-3 font-medium">
          请先完成安全确认清单
        </p>
        <p v-else-if="localStatus < 3" class="text-center text-base text-muted-foreground mt-3">
          点击按钮更新服务状态
        </p>
        <p v-else class="text-center text-base text-[#22C55E] mt-3 font-medium">
          服务已完成，感谢您的付出！
        </p>
      </div>
    </div>

    <!-- 报备弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showReportModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5"
          @click.self="showReportModal = false"
        >
          <div class="bg-card rounded-[2rem] p-6 w-full max-w-sm shadow-xl max-h-[80vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText :size="22" class="text-[#3B82F6]" />
                服务报备
              </h3>
              <button
                @click="showReportModal = false"
                class="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              >
                <X :size="20" />
              </button>
            </div>
            
            <!-- 上传照片 -->
            <div class="mb-4">
              <p class="text-base font-medium text-foreground mb-3">上传服务照片</p>
              <div class="flex flex-wrap gap-3">
                <div
                  v-for="(photo, index) in reportPhotos"
                  :key="index"
                  class="w-20 h-20 rounded-xl bg-muted flex items-center justify-center relative"
                >
                  <Camera :size="24" class="text-muted-foreground" />
                  <button
                    @click="reportPhotos.splice(index, 1)"
                    class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center"
                  >
                    <X :size="14" />
                  </button>
                </div>
                <button
                  @click="addPhoto"
                  class="w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground active:bg-muted transition-colors"
                >
                  <Upload :size="24" />
                  <span class="text-xs">添加</span>
                </button>
              </div>
            </div>
            
            <!-- 报备内容 -->
            <div class="mb-4">
              <p class="text-base font-medium text-foreground mb-3">服务心得（可选）</p>
              <textarea
                v-model="reportContent"
                rows="4"
                placeholder="记录服务过程中的心得体会..."
                class="w-full p-4 text-base border-2 border-border rounded-[1.5rem] bg-background focus:border-[#3B82F6] focus:outline-none placeholder:text-muted-foreground resize-none"
              />
            </div>
            
            <button
              @click="submitReport"
              class="w-full btn-elder bg-[#3B82F6] text-white font-bold"
            >
              提交报备
            </button>
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
