<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  MessageCircle, 
  Stethoscope, 
  ShoppingBag, 
  Shield, 
  UserCheck, 
  Building2,
  Heart,
  Clock,
  Users,
  ChevronRight,
  Megaphone,
  Home,
  ClipboardList,
  User
} from 'lucide-vue-next'
import { currentUser } from '@/stores/globalStore'

const router = useRouter()

const services = [
  {
    id: 'chat',
    name: '暖心陪聊',
    description: '倾听您的故事，陪您聊天解闷',
    icon: MessageCircle,
    color: 'bg-orange-100',
    iconColor: 'text-orange-500'
  },
  {
    id: 'hospital',
    name: '就医陪同',
    description: '陪您看病挂号，全程贴心照顾',
    icon: Stethoscope,
    color: 'bg-blue-100',
    iconColor: 'text-blue-500'
  },
  {
    id: 'shopping',
    name: '购物协助',
    description: '帮您采购生活用品，送货上门',
    icon: ShoppingBag,
    color: 'bg-green-100',
    iconColor: 'text-green-500'
  }
]

const guarantees = [
  { icon: UserCheck, title: '实名监控', desc: '所有志愿者均已实名认证' },
  { icon: Shield, title: '意外保险', desc: '服务期间享受意外险保障' },
  { icon: Building2, title: '居委背书', desc: '社区居委会官方认可' }
]

const stats = ref({
  totalHours: 12680,
  helpedElders: 3420,
  activeVolunteers: 186
})

const announcements = [
  '欢迎新志愿者加入暖心相伴大家庭',
  '冬季服务温馨提示：请志愿者注意保暖',
  '本周六社区将举办志愿者表彰大会'
]

const activeTab = ref('home')

function goToServiceDetail(serviceId: string) {
  router.push(`/service/${serviceId}`)
}

function goToVolunteerList() {
  router.push('/volunteers')
}
</script>

<template>
  <div class="min-h-screen bg-background pb-28">
    <!-- 顶部欢迎 -->
    <div class="bg-gradient-to-b from-primary/20 to-transparent px-6 pt-6 pb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">暖心相伴</h1>
      <p class="text-xl text-muted-foreground">社区互助，温暖相伴每一天</p>
    </div>

    <!-- 滚动公告 -->
    <div class="bg-warning/10 border-y border-warning/20 py-3 overflow-hidden">
      <div class="flex items-center gap-3 animate-scroll-left whitespace-nowrap">
        <Megaphone class="text-warning flex-shrink-0 ml-4" :size="20" />
        <span v-for="(ann, i) in announcements" :key="i" class="text-base text-warning font-medium mx-8">
          {{ ann }}
        </span>
      </div>
    </div>

    <!-- 信任徽章 -->
    <div class="flex flex-wrap justify-center gap-3 px-4 py-5">
      <div class="trust-badge bg-trust/10 text-trust">
        <Shield :size="18" />
        <span>实名认证</span>
      </div>
      <div class="trust-badge bg-success/10 text-success">
        <UserCheck :size="18" />
        <span>社区认证</span>
      </div>
      <div class="trust-badge bg-primary/10 text-primary">
        <Heart :size="18" />
        <span>服务保障</span>
      </div>
    </div>

    <!-- 社区统计 -->
    <div class="px-4 mb-6">
      <div class="card-warm">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="flex items-center justify-center gap-1 text-primary mb-1">
              <Clock :size="20" />
            </div>
            <p class="text-2xl font-bold text-foreground">{{ stats.totalHours.toLocaleString() }}</p>
            <p class="text-sm text-muted-foreground">服务时长(小时)</p>
          </div>
          <div>
            <div class="flex items-center justify-center gap-1 text-primary mb-1">
              <Heart :size="20" />
            </div>
            <p class="text-2xl font-bold text-foreground">{{ stats.helpedElders.toLocaleString() }}</p>
            <p class="text-sm text-muted-foreground">帮助长者(位)</p>
          </div>
          <div>
            <div class="flex items-center justify-center gap-1 text-primary mb-1">
              <Users :size="20" />
            </div>
            <p class="text-2xl font-bold text-foreground">{{ stats.activeVolunteers }}</p>
            <p class="text-sm text-muted-foreground">活跃志愿者</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 服务卡片 - 点击进入详情页而非直接下单 -->
    <div class="px-4 mb-8">
      <h2 class="text-2xl font-bold mb-4 px-2">选择服务</h2>
      <div class="space-y-4">
        <button
          v-for="service in services"
          :key="service.id"
          @click="goToServiceDetail(service.id)"
          :disabled="currentUser.status === 'FROZEN'"
          :class="[
            'card-warm-lg w-full flex items-center gap-5 text-left transition-all',
            currentUser.status === 'FROZEN' 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:shadow-md active:scale-[0.98]'
          ]"
        >
          <div :class="[service.color, 'w-20 h-20 rounded-[24px] flex items-center justify-center flex-shrink-0']">
            <component :is="service.icon" :size="36" :class="service.iconColor" :stroke-width="2" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-2xl font-bold text-foreground mb-1">{{ service.name }}</h3>
            <p class="text-lg text-muted-foreground">{{ service.description }}</p>
          </div>
          <ChevronRight :size="28" class="text-muted-foreground flex-shrink-0" />
        </button>
      </div>
    </div>

    <!-- 查看志愿者入口 -->
    <div class="px-4 mb-8">
      <button
        @click="goToVolunteerList"
        class="card-warm w-full flex items-center justify-between hover:shadow-md transition-shadow active:scale-[0.98]"
      >
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Users :size="28" class="text-primary" />
          </div>
          <div class="text-left">
            <h3 class="text-xl font-semibold text-foreground">查看志愿者</h3>
            <p class="text-base text-muted-foreground">了解我们的爱心志愿者团队</p>
          </div>
        </div>
        <ChevronRight :size="24" class="text-muted-foreground" />
      </button>
    </div>

    <!-- 服务保障 -->
    <div class="px-4 mb-8">
      <h2 class="text-2xl font-bold mb-4 px-2">服务保障</h2>
      <div class="card-warm">
        <div class="space-y-4">
          <div 
            v-for="(g, i) in guarantees" 
            :key="i"
            class="flex items-center gap-4 p-4 rounded-[20px] bg-secondary/50"
          >
            <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <component :is="g.icon" :size="28" class="text-primary" />
            </div>
            <div>
              <h4 class="text-xl font-semibold text-foreground">{{ g.title }}</h4>
              <p class="text-base text-muted-foreground">{{ g.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 TabBar -->
    <nav class="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border safe-bottom z-40">
      <div class="flex justify-around py-3">
        <button 
          @click="activeTab = 'home'"
          :class="['flex flex-col items-center gap-1 px-6 py-2', activeTab === 'home' ? 'text-primary' : 'text-muted-foreground']"
        >
          <Home :size="28" :stroke-width="activeTab === 'home' ? 2.5 : 2" />
          <span class="text-base font-medium">首页</span>
        </button>
        <button 
          @click="goToVolunteerList"
          :class="['flex flex-col items-center gap-1 px-6 py-2', activeTab === 'volunteers' ? 'text-primary' : 'text-muted-foreground']"
        >
          <Users :size="28" />
          <span class="text-base font-medium">志愿者</span>
        </button>
        <button 
          @click="router.push('/my-orders')"
          :class="['flex flex-col items-center gap-1 px-6 py-2', activeTab === 'orders' ? 'text-primary' : 'text-muted-foreground']"
        >
          <ClipboardList :size="28" />
          <span class="text-base font-medium">订单</span>
        </button>
        <button 
          @click="router.push('/profile')"
          :class="['flex flex-col items-center gap-1 px-6 py-2', activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground']"
        >
          <User :size="28" />
          <span class="text-base font-medium">我的</span>
        </button>
      </div>
    </nav>
  </div>
</template>
