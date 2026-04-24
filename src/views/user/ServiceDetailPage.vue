<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '../../store/globalStore'
import {
  MessageCircle,
  Stethoscope,
  ShoppingBag,
  ArrowLeft,
  Heart,
  Clock,
  Shield,
  Star,
  CheckCircle,
  Users,
  Phone,
  MapPin,
  Calendar,
  ChevronRight,
  AlertTriangle,
  X
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useGlobalStore()

const serviceId = computed(() => route.params.id as string)

// 服务配置
const serviceConfigs: Record<string, {
  name: string
  desc: string
  icon: typeof MessageCircle
  color: string
  bgColor: string
  scene: string
  advantages: { icon: typeof Heart; title: string; desc: string }[]
}> = {
  chat: {
    name: '陪聊服务',
    desc: '专业志愿者上门陪伴，倾听您的心声',
    icon: MessageCircle,
    color: 'bg-[#FF9248]',
    bgColor: 'bg-[#FFF5EE]',
    scene: '温馨的客厅里，志愿者与老人围坐在茶几旁，愉快地聊着家常',
    advantages: [
      { icon: Heart, title: '温暖陪伴', desc: '专业培训的志愿者，懂得倾听与关怀' },
      { icon: Clock, title: '灵活时间', desc: '可根据您的作息安排服务时间' },
      { icon: Shield, title: '安全放心', desc: '全程实名监控，居委会背书保障' },
      { icon: Star, title: '贴心服务', desc: '志愿者均有丰富的陪伴经验' },
      { icon: Users, title: '匹配推荐', desc: '根据您的偏好智能匹配志愿者' }
    ]
  },
  medical: {
    name: '就医陪同',
    desc: '全程陪护就医，让看病不再难',
    icon: Stethoscope,
    color: 'bg-[#3B82F6]',
    bgColor: 'bg-[#EFF6FF]',
    scene: '医院门诊大厅，志愿者搀扶老人办理挂号手续',
    advantages: [
      { icon: Heart, title: '全程陪护', desc: '从挂号到取药，全程专人陪同' },
      { icon: Clock, title: '准时到达', desc: '提前预约，按时上门接送' },
      { icon: Shield, title: '专业素养', desc: '志愿者熟悉医院流程和注意事项' },
      { icon: Star, title: '细心记录', desc: '帮您记录医嘱和用药注意事项' },
      { icon: Users, title: '无障碍服务', desc: '提供轮椅推行等特殊需求服务' }
    ]
  },
  shopping: {
    name: '购物协助',
    desc: '代购跑腿，让生活更便利',
    icon: ShoppingBag,
    color: 'bg-[#22C55E]',
    bgColor: 'bg-[#F0FDF4]',
    scene: '超市货架前，志愿者认真核对购物清单，挑选新鲜蔬果',
    advantages: [
      { icon: Heart, title: '精心挑选', desc: '按您的要求认真挑选商品' },
      { icon: Clock, title: '快速送达', desc: '采购完成后第一时间送上门' },
      { icon: Shield, title: '价格透明', desc: '保留购物小票，明细清晰' },
      { icon: Star, title: '品质保证', desc: '只选新鲜优质商品' },
      { icon: Users, title: '贴心服务', desc: '可帮助搬运重物上楼' }
    ]
  }
}

const currentService = computed(() => serviceConfigs[serviceId.value] || serviceConfigs.chat)

// 服务流程
const serviceFlow = [
  { step: 1, title: '下单', desc: '填写服务需求' },
  { step: 2, title: '匹配', desc: '系统推荐志愿者' },
  { step: 3, title: '上门', desc: '志愿者准时到达' },
  { step: 4, title: '评价', desc: '服务完成后评价' }
]

// 是否显示预约弹窗
const showBookingModal = ref(false)

// 协议勾选
const agreementChecked = ref(false)

// 用户是否被冻结
const isUserFrozen = computed(() => store.state.currentUser.status === 'FROZEN')

// 显示冻结拦截弹窗
const showFrozenModal = ref(false)

// 点击立即预约
function handleBooking() {
  if (isUserFrozen.value) {
    showFrozenModal.value = true
    return
  }
  showBookingModal.value = true
}

// 确认预约，跳转下单页
function confirmBooking() {
  if (!agreementChecked.value) {
    store.showToast('请先阅读并同意社区互助协议', 'error')
    return
  }
  showBookingModal.value = false
  router.push({ path: '/order', query: { type: serviceId.value } })
}

// 返回
function goBack() {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-background pb-32">
    <!-- 顶部导航 -->
    <div :class="['sticky top-0 z-40 px-4 py-4', currentService.bgColor]">
      <div class="max-w-md mx-auto flex items-center gap-4">
        <button
          @click="goBack"
          class="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
        >
          <ArrowLeft :size="24" class="text-foreground" />
        </button>
        <h1 class="text-2xl font-bold text-foreground">{{ currentService.name }}</h1>
      </div>
    </div>

    <div class="max-w-md mx-auto">
      <!-- 服务场景图 -->
      <div :class="['mx-5 mt-4 rounded-[2rem] p-8 text-center', currentService.bgColor]">
        <div :class="['w-24 h-24 mx-auto rounded-[2rem] flex items-center justify-center mb-4', currentService.color]">
          <component :is="currentService.icon" :size="48" class="text-white" />
        </div>
        <h2 class="text-2xl font-bold text-foreground mb-2">{{ currentService.name }}</h2>
        <p class="text-base text-muted-foreground">{{ currentService.desc }}</p>
        <p class="text-sm text-muted-foreground mt-4 italic">「{{ currentService.scene }}」</p>
      </div>

      <!-- 核心优势 -->
      <div class="px-5 mt-6">
        <h3 class="text-xl font-bold text-foreground mb-4">核心优势</h3>
        <div class="space-y-3">
          <div
            v-for="(advantage, index) in currentService.advantages"
            :key="index"
            class="flex items-start gap-4 bg-card rounded-[1.5rem] p-4 shadow-sm"
          >
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shrink-0', currentService.bgColor]">
              <component :is="advantage.icon" :size="24" :class="currentService.color.replace('bg-', 'text-')" />
            </div>
            <div>
              <h4 class="text-lg font-bold text-foreground">{{ advantage.title }}</h4>
              <p class="text-base text-muted-foreground mt-0.5">{{ advantage.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 服务流程 -->
      <div class="px-5 mt-8">
        <h3 class="text-xl font-bold text-foreground mb-4">服务流程</h3>
        <div class="bg-card rounded-[2rem] p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div
              v-for="(item, index) in serviceFlow"
              :key="item.step"
              class="flex flex-col items-center text-center flex-1"
            >
              <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold', currentService.color, 'text-white']">
                {{ item.step }}
              </div>
              <p class="text-base font-semibold text-foreground mt-2">{{ item.title }}</p>
              <p class="text-xs text-muted-foreground mt-1">{{ item.desc }}</p>
              <!-- 连接线 -->
              <div
                v-if="index < serviceFlow.length - 1"
                class="absolute"
              />
            </div>
          </div>
          <!-- 连接线 -->
          <div class="flex items-center mt-[-3.5rem] mb-8 px-6">
            <div v-for="i in 3" :key="i" class="flex-1 flex items-center">
              <div class="flex-1" />
              <ChevronRight :size="20" class="text-muted-foreground mx-1" />
              <div class="flex-1" />
            </div>
          </div>
        </div>
      </div>

      <!-- 安全保障 -->
      <div class="px-5 mt-6">
        <div class="bg-[#EFF6FF] rounded-[2rem] p-5 border border-[#3B82F6]/20">
          <div class="flex items-center gap-3 mb-3">
            <Shield :size="24" class="text-[#3B82F6]" />
            <span class="text-lg font-bold text-foreground">安全保障</span>
          </div>
          <ul class="space-y-2 text-base text-muted-foreground">
            <li class="flex items-center gap-2">
              <CheckCircle :size="18" class="text-[#22C55E] shrink-0" />
              <span>所有志愿者均通过实名认证和背景审查</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle :size="18" class="text-[#22C55E] shrink-0" />
              <span>服务全程可追溯，居委会监督保障</span>
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle :size="18" class="text-[#22C55E] shrink-0" />
              <span>提供服务期间意外伤害保险</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 底部预约按钮 -->
    <div class="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-5 safe-area-bottom">
      <div class="max-w-md mx-auto">
        <button
          @click="handleBooking"
          :class="[
            'w-full btn-elder text-white font-bold',
            currentService.color,
            'active:scale-[0.98] transition-transform'
          ]"
        >
          立即预约
        </button>
      </div>
    </div>

    <!-- 预约确认弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showBookingModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50"
          @click.self="showBookingModal = false"
        >
          <div class="bg-card rounded-[2rem] p-6 w-full max-w-sm shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-foreground">确认预约</h3>
              <button
                @click="showBookingModal = false"
                class="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              >
                <X :size="20" />
              </button>
            </div>
            
            <p class="text-base text-muted-foreground mb-6">
              您即将预约「{{ currentService.name }}」，请阅读并同意以下协议后继续。
            </p>

            <!-- 协议勾选 -->
            <label class="flex items-start gap-3 p-4 bg-secondary rounded-[1.5rem] cursor-pointer">
              <input
                type="checkbox"
                v-model="agreementChecked"
                class="w-6 h-6 mt-0.5 accent-[#FF9248] rounded"
              />
              <span class="text-base text-foreground leading-relaxed">
                我已阅读并同意《社区互助服务协议》，了解服务内容、费用标准及双方权利义务。
              </span>
            </label>

            <button
              @click="confirmBooking"
              :disabled="!agreementChecked"
              :class="[
                'w-full mt-6 btn-elder font-bold transition-all',
                agreementChecked
                  ? 'bg-[#FF9248] text-white'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              ]"
            >
              确认并填写订单
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 账户冻结拦截弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showFrozenModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50"
          @click.self="showFrozenModal = false"
        >
          <div class="bg-card rounded-[2rem] p-8 w-full max-w-sm shadow-xl text-center">
            <div class="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-5">
              <AlertTriangle :size="40" class="text-destructive" />
            </div>
            <h3 class="text-2xl font-bold text-foreground mb-3">账号异常</h3>
            <p class="text-lg text-muted-foreground mb-6">
              您的账号存在异常，暂时无法使用服务。请联系社区网格员处理。
            </p>
            <div class="flex items-center justify-center gap-2 text-[#3B82F6] text-lg font-medium mb-6">
              <Phone :size="22" />
              <span>社区热线：400-123-4567</span>
            </div>
            <button
              @click="showFrozenModal = false"
              class="w-full btn-elder bg-muted text-foreground font-bold"
            >
              我知道了
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

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>
