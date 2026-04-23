<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 订单状态步骤
interface Step {
  id: number
  title: string
  description: string
  time?: string
}

const steps = ref<Step[]>([
  { id: 1, title: '已提交', description: '订单已成功提交', time: '今天 09:30' },
  { id: 2, title: '已接单', description: '志愿者已接单', time: '今天 09:45' },
  { id: 3, title: '服务中', description: '志愿者已到达', time: '今天 10:00' },
  { id: 4, title: '已完成', description: '服务已完成' }
])

const currentStep = ref(3) // 当前进行到第3步

const orderInfo = ref({
  orderId: 'WX2024042312345',
  serviceType: '就医陪同',
  date: '2024年4月23日',
  time: '上午 10:00',
  address: '北京市朝阳区XX社区XX号楼',
  contactName: '李奶奶',
  contactPhone: '138****8888',
  volunteerName: '张志愿',
  volunteerPhone: '139****9999'
})

const getStepStatus = (stepId: number) => {
  if (stepId < currentStep.value) return 'completed'
  if (stepId === currentStep.value) return 'current'
  return 'pending'
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background pb-8">
    <!-- 顶部导航 -->
    <header class="bg-primary text-primary-foreground px-4 py-5 flex items-center gap-4">
      <button @click="goBack" class="text-3xl">←</button>
      <h1 class="text-2xl font-bold">订单详情</h1>
    </header>

    <main class="p-5">
      <!-- 订单编号 -->
      <div class="bg-card rounded-xl p-5 mb-5 border border-border">
        <p class="text-lg text-muted-foreground">订单编号</p>
        <p class="text-xl font-semibold text-foreground mt-1">{{ orderInfo.orderId }}</p>
      </div>

      <!-- 服务进度步骤条 -->
      <div class="bg-card rounded-xl p-6 mb-5 border border-border">
        <h2 class="text-xl font-bold text-foreground mb-6">服务进度</h2>
        
        <div class="relative">
          <!-- 步骤列表 -->
          <div class="flex flex-col gap-0">
            <div
              v-for="(step, index) in steps"
              :key="step.id"
              class="flex gap-4"
            >
              <!-- 步骤指示器 -->
              <div class="flex flex-col items-center">
                <!-- 圆点 -->
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold shrink-0',
                    getStepStatus(step.id) === 'completed' ? 'bg-success text-success-foreground' :
                    getStepStatus(step.id) === 'current' ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  ]"
                >
                  <span v-if="getStepStatus(step.id) === 'completed'">✓</span>
                  <span v-else>{{ step.id }}</span>
                </div>
                <!-- 连接线 -->
                <div
                  v-if="index < steps.length - 1"
                  :class="[
                    'w-1 h-16',
                    getStepStatus(step.id) === 'completed' ? 'bg-success' : 'bg-muted'
                  ]"
                ></div>
              </div>

              <!-- 步骤内容 -->
              <div class="flex-1 pb-6">
                <h3
                  :class="[
                    'text-xl font-semibold',
                    getStepStatus(step.id) === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                  ]"
                >
                  {{ step.title }}
                </h3>
                <p class="text-lg text-muted-foreground mt-1">{{ step.description }}</p>
                <p v-if="step.time" class="text-base text-muted-foreground mt-1">{{ step.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 服务信息 -->
      <div class="bg-card rounded-xl p-5 mb-5 border border-border">
        <h2 class="text-xl font-bold text-foreground mb-4">服务信息</h2>
        
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <span class="text-lg text-muted-foreground">服务类型</span>
            <span class="text-lg font-semibold text-foreground">{{ orderInfo.serviceType }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-lg text-muted-foreground">预约日期</span>
            <span class="text-lg text-foreground">{{ orderInfo.date }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-lg text-muted-foreground">预约时间</span>
            <span class="text-lg text-foreground">{{ orderInfo.time }}</span>
          </div>
          <div class="flex justify-between items-start">
            <span class="text-lg text-muted-foreground shrink-0">服务地点</span>
            <span class="text-lg text-foreground text-right">{{ orderInfo.address }}</span>
          </div>
        </div>
      </div>

      <!-- 联系信息 -->
      <div class="bg-card rounded-xl p-5 border border-border">
        <h2 class="text-xl font-bold text-foreground mb-4">联系信息</h2>
        
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <span class="text-lg text-muted-foreground">联系人</span>
            <span class="text-lg text-foreground">{{ orderInfo.contactName }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-lg text-muted-foreground">联系电话</span>
            <span class="text-lg text-foreground">{{ orderInfo.contactPhone }}</span>
          </div>
          <div class="h-px bg-border my-2"></div>
          <div class="flex justify-between items-center">
            <span class="text-lg text-muted-foreground">志愿者</span>
            <span class="text-lg font-semibold text-primary">{{ orderInfo.volunteerName }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-lg text-muted-foreground">志愿者电话</span>
            <a :href="'tel:' + orderInfo.volunteerPhone" class="text-lg text-primary underline">
              {{ orderInfo.volunteerPhone }}
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
