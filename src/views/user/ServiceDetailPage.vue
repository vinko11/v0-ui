<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  MessageCircle, 
  Stethoscope, 
  ShoppingBag, 
  ArrowLeft,
  Clock,
  CheckCircle2,
  Star,
  Users,
  Shield,
  X
} from 'lucide-vue-next'
import { currentUser, showToast } from '@/stores/globalStore'

const route = useRoute()
const router = useRouter()
const serviceId = route.params.id as string

const serviceData = computed(() => {
  const services: Record<string, any> = {
    chat: {
      id: 'chat',
      name: '暖心陪聊',
      icon: MessageCircle,
      color: 'bg-orange-100',
      iconColor: 'text-orange-500',
      image: '/images/chat-service.jpg',
      description: '专业志愿者上门陪伴，倾听您的心声，分享生活点滴',
      advantages: [
        '经过专业培训的志愿者，善于倾听和沟通',
        '灵活的时间安排，配合您的作息',
        '定期回访，建立长期陪伴关系',
        '保护隐私，所有交流内容严格保密',
        '紧急情况下可联系家属或社区'
      ],
      price: '免费',
      duration: '1-2小时/次'
    },
    hospital: {
      id: 'hospital',
      name: '就医陪同',
      icon: Stethoscope,
      color: 'bg-blue-100',
      iconColor: 'text-blue-500',
      image: '/images/hospital-service.jpg',
      description: '全程陪同就医，帮助挂号、取药、与医生沟通',
      advantages: [
        '提前预约挂号，减少等待时间',
        '全程陪同，协助与医生沟通病情',
        '代取药品，讲解用药方法',
        '保管就医资料，建立健康档案',
        '就医后跟踪回访，关心恢复情况'
      ],
      price: '免费',
      duration: '半天'
    },
    shopping: {
      id: 'shopping',
      name: '购物协助',
      icon: ShoppingBag,
      color: 'bg-green-100',
      iconColor: 'text-green-500',
      image: '/images/shopping-service.jpg',
      description: '帮您采购日常生活用品，新鲜蔬果，送货上门',
      advantages: [
        '根据您的清单精心挑选商品',
        '选择新鲜优质的蔬菜水果',
        '比价购物，为您节省开支',
        '送货上门，帮助整理归位',
        '可代缴水电煤等生活费用'
      ],
      price: '免费',
      duration: '按需'
    }
  }
  return services[serviceId] || services.chat
})

const flowSteps = [
  { step: 1, title: '提交预约', desc: '填写服务时间和需求' },
  { step: 2, title: '志愿者匹配', desc: '系统智能匹配合适志愿者' },
  { step: 3, title: '上门服务', desc: '志愿者按时上门提供服务' },
  { step: 4, title: '服务评价', desc: '完成后为服务打分评价' }
]

// 弹窗状态
const showOrderModal = ref(false)
const agreeProtocol = ref(false)
const orderForm = ref({
  date: '',
  time: '',
  address: '',
  phone: '',
  notes: ''
})

function openOrderModal() {
  if (currentUser.value.status === 'FROZEN') {
    showFrozenModal.value = true
    return
  }
  showOrderModal.value = true
}

const showFrozenModal = ref(false)

function submitOrder() {
  if (!agreeProtocol.value) {
    showToast('请先同意社区互助协议', 'error')
    return
  }
  if (!orderForm.value.date || !orderForm.value.time || !orderForm.value.address) {
    showToast('请填写完整信息', 'error')
    return
  }
  
  showToast('处理中...', 'loading')
  
  setTimeout(() => {
    showToast('预约成功！志愿者将尽快与您联系', 'success')
    showOrderModal.value = false
    router.push('/my-orders')
  }, 1500)
}
</script>

<template>
  <div class="min-h-screen bg-background pb-8">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-30 bg-card border-b border-border">
      <div class="flex items-center gap-4 px-4 py-4">
        <button 
          @click="router.back()" 
          class="w-12 h-12 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowLeft :size="24" />
        </button>
        <h1 class="text-2xl font-bold">{{ serviceData.name }}</h1>
      </div>
    </header>

    <!-- 服务头图区域 -->
    <div :class="[serviceData.color, 'mx-4 mt-4 rounded-[32px] p-8 flex flex-col items-center']">
      <div class="w-24 h-24 bg-white rounded-[28px] flex items-center justify-center shadow-sm mb-4">
        <component :is="serviceData.icon" :size="48" :class="serviceData.iconColor" />
      </div>
      <h2 class="text-3xl font-bold text-foreground mb-2">{{ serviceData.name }}</h2>
      <p class="text-lg text-muted-foreground text-center">{{ serviceData.description }}</p>
      <div class="flex items-center gap-6 mt-4">
        <div class="flex items-center gap-2 text-muted-foreground">
          <Clock :size="20" />
          <span>{{ serviceData.duration }}</span>
        </div>
        <div class="flex items-center gap-2 text-success font-semibold">
          <span class="text-xl">{{ serviceData.price }}</span>
        </div>
      </div>
    </div>

    <!-- 核心优势 -->
    <div class="px-4 mt-6">
      <h3 class="text-2xl font-bold mb-4">服务优势</h3>
      <div class="card-warm space-y-4">
        <div 
          v-for="(adv, i) in serviceData.advantages" 
          :key="i"
          class="flex items-start gap-3"
        >
          <CheckCircle2 :size="24" class="text-success flex-shrink-0 mt-0.5" />
          <p class="text-lg text-foreground">{{ adv }}</p>
        </div>
      </div>
    </div>

    <!-- 服务流程 -->
    <div class="px-4 mt-6">
      <h3 class="text-2xl font-bold mb-4">服务流程</h3>
      <div class="card-warm">
        <div class="relative">
          <div 
            v-for="(step, i) in flowSteps" 
            :key="step.step"
            class="flex items-start gap-4 relative"
            :class="i < flowSteps.length - 1 ? 'pb-6' : ''"
          >
            <!-- 连接线 -->
            <div 
              v-if="i < flowSteps.length - 1"
              class="absolute left-5 top-12 w-0.5 h-full bg-primary/30"
            ></div>
            <!-- 步骤圆点 -->
            <div class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0 z-10">
              {{ step.step }}
            </div>
            <div class="pt-1">
              <h4 class="text-xl font-semibold text-foreground">{{ step.title }}</h4>
              <p class="text-base text-muted-foreground mt-1">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户评价 -->
    <div class="px-4 mt-6">
      <h3 class="text-2xl font-bold mb-4">用户评价</h3>
      <div class="card-warm">
        <div class="flex items-center gap-4 mb-4">
          <div class="flex items-center gap-1">
            <Star v-for="i in 5" :key="i" :size="24" class="text-warning fill-warning" />
          </div>
          <span class="text-2xl font-bold">4.9</span>
          <span class="text-muted-foreground">(328条评价)</span>
        </div>
        <div class="space-y-4">
          <div class="p-4 bg-secondary/50 rounded-[20px]">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users :size="20" class="text-primary" />
              </div>
              <span class="font-semibold">张奶奶</span>
              <div class="flex items-center gap-0.5 ml-auto">
                <Star v-for="i in 5" :key="i" :size="16" class="text-warning fill-warning" />
              </div>
            </div>
            <p class="text-muted-foreground">小李很有耐心，陪我聊了很久，感觉心情好多了，感谢！</p>
          </div>
          <div class="p-4 bg-secondary/50 rounded-[20px]">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users :size="20" class="text-primary" />
              </div>
              <span class="font-semibold">王爷爷</span>
              <div class="flex items-center gap-0.5 ml-auto">
                <Star v-for="i in 5" :key="i" :size="16" class="text-warning fill-warning" />
              </div>
            </div>
            <p class="text-muted-foreground">服务很周到，志愿者很热情，下次还找他！</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部预约按钮 -->
    <div class="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border p-4 safe-bottom z-40">
      <button 
        @click="openOrderModal"
        class="btn-elder-primary w-full flex items-center justify-center gap-3"
      >
        <span>立即预约</span>
      </button>
    </div>

    <!-- 预约弹窗 -->
    <Teleport to="body">
      <div 
        v-if="showOrderModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
        @click.self="showOrderModal = false"
      >
        <div class="bg-card w-full max-w-lg rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold">预约{{ serviceData.name }}</h3>
            <button 
              @click="showOrderModal = false"
              class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
            >
              <X :size="24" />
            </button>
          </div>

          <div class="space-y-5">
            <div>
              <label class="text-lg font-semibold text-foreground block mb-2">预约日期</label>
              <input 
                v-model="orderForm.date"
                type="date" 
                class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label class="text-lg font-semibold text-foreground block mb-2">预约时间</label>
              <input 
                v-model="orderForm.time"
                type="time" 
                class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label class="text-lg font-semibold text-foreground block mb-2">服务地址</label>
              <input 
                v-model="orderForm.address"
                type="text" 
                placeholder="请输入详细地址"
                class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label class="text-lg font-semibold text-foreground block mb-2">联系电话</label>
              <input 
                v-model="orderForm.phone"
                type="tel" 
                placeholder="请输入联系电话"
                class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label class="text-lg font-semibold text-foreground block mb-2">备注（选填）</label>
              <textarea 
                v-model="orderForm.notes"
                rows="3"
                placeholder="请描述您的具体需求"
                class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none resize-none"
              ></textarea>
            </div>

            <!-- 社区互助协议 -->
            <div class="p-4 bg-trust/10 rounded-[16px] border border-trust/20">
              <div class="flex items-center gap-2 mb-2">
                <Shield :size="20" class="text-trust" />
                <span class="font-semibold text-trust">社区互助协议</span>
              </div>
              <p class="text-sm text-muted-foreground mb-3">
                本服务由社区志愿者提供，属于公益性质互助服务。服务过程中请注意安全，如遇紧急情况请拨打110或120。
              </p>
              <label class="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="agreeProtocol"
                  class="w-6 h-6 accent-primary rounded"
                />
                <span class="text-lg">我已阅读并同意《社区互助协议》</span>
              </label>
            </div>
          </div>

          <button 
            @click="submitOrder"
            :disabled="!agreeProtocol"
            :class="[
              'btn-elder-primary w-full mt-6',
              !agreeProtocol && 'opacity-50 cursor-not-allowed'
            ]"
          >
            确认预约
          </button>
        </div>
      </div>
    </Teleport>

    <!-- 账号冻结弹窗 -->
    <Teleport to="body">
      <div 
        v-if="showFrozenModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-card w-full max-w-sm rounded-[32px] p-8 text-center">
          <div class="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield :size="40" class="text-destructive" />
          </div>
          <h3 class="text-2xl font-bold text-destructive mb-2">账号异常</h3>
          <p class="text-lg text-muted-foreground mb-6">
            您的账号已被冻结，无法提交订单。请联系社区网格员处理。
          </p>
          <button 
            @click="showFrozenModal = false"
            class="btn-elder bg-secondary text-secondary-foreground w-full"
          >
            我知道了
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
