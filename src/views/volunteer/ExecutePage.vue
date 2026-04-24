<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 任务状态：0-未开始, 1-已到达, 2-服务中, 3-已完成
const taskStatus = ref(0)

// 安全检查清单
const safetyChecklist = ref([
  { id: 'id', label: '我已携带身份证', checked: false },
  { id: 'health', label: '我身体健康无不适', checked: false },
  { id: 'phone', label: '手机已充满电', checked: false }
])

const allChecksPassed = computed(() => safetyChecklist.value.every(item => item.checked))

const taskInfo = ref({
  serviceType: '陪聊服务',
  contactName: '王奶奶',
  contactPhone: '138****8888',
  address: '朝阳区XX社区3号楼201室',
  time: '今天 14:00',
  description: '希望有人陪我聊聊天，最近心情不太好，子女都不在身边'
})

const statusLabels = ['前往中', '已到达', '服务中', '已完成']

const currentStatusLabel = computed(() => statusLabels[taskStatus.value])

const buttonConfig = computed(() => {
  switch (taskStatus.value) {
    case 0:
      return { text: '确认到达', color: 'bg-warning', next: 1 }
    case 1:
      return { text: '开始服务', color: 'bg-primary', next: 2 }
    case 2:
      return { text: '结束服务', color: 'bg-success', next: 3 }
    default:
      return { text: '已完成', color: 'bg-muted', next: 3 }
  }
})

const canProceed = computed(() => {
  if (taskStatus.value === 0) {
    return allChecksPassed.value
  }
  return true
})

const handleStatusChange = () => {
  if (!canProceed.value) return
  
  if (taskStatus.value < 3) {
    taskStatus.value = buttonConfig.value.next
  }
  if (taskStatus.value === 3) {
    // 完成后可以跳转回列表
    setTimeout(() => {
      router.push('/volunteer')
    }, 1500)
  }
}

const goBack = () => {
  router.push('/volunteer')
}

const callContact = () => {
  window.location.href = `tel:${taskInfo.value.contactPhone}`
}
</script>

<template>
  <div class="min-h-screen bg-background pb-36">
    <!-- 顶部导航 -->
    <header class="bg-primary text-primary-foreground px-4 py-5 flex items-center gap-4">
      <button @click="goBack" class="text-3xl">←</button>
      <h1 class="text-2xl font-bold">任务执行</h1>
    </header>

    <div class="max-w-md mx-auto">
      <!-- 状态指示器 -->
      <div class="bg-card mx-5 mt-5 rounded-xl p-6 border border-border">
        <div class="text-center">
          <div
            :class="[
              'inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl mb-3',
              taskStatus === 3 ? 'bg-success/20' : 'bg-primary/20'
            ]"
          >
            <span v-if="taskStatus === 0">🚶</span>
            <span v-else-if="taskStatus === 1">📍</span>
            <span v-else-if="taskStatus === 2">💬</span>
            <span v-else>✅</span>
          </div>
          <p class="text-2xl font-bold text-foreground">{{ currentStatusLabel }}</p>
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

      <!-- 安全检查清单（仅在前往阶段显示） -->
      <div v-if="taskStatus === 0" class="bg-warning/10 mx-5 mt-4 rounded-xl p-5 border border-warning/20">
        <h3 class="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          🛡️ 出发前安全确认
        </h3>
        <div class="flex flex-col gap-3">
          <label
            v-for="item in safetyChecklist"
            :key="item.id"
            class="flex items-center gap-4 cursor-pointer"
          >
            <input
              v-model="item.checked"
              type="checkbox"
              class="w-6 h-6 accent-primary rounded"
            />
            <span 
              :class="[
                'text-lg',
                item.checked ? 'text-foreground' : 'text-muted-foreground'
              ]"
            >
              {{ item.label }}
            </span>
          </label>
        </div>
        <p v-if="!allChecksPassed" class="text-sm text-warning mt-3">
          请完成所有安全确认后再出发
        </p>
      </div>

      <!-- 任务信息 -->
      <main class="p-5">
        <div class="bg-card rounded-xl p-5 border border-border mb-4">
          <h2 class="text-xl font-bold text-foreground mb-4">任务信息</h2>
          
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span class="text-lg text-muted-foreground">服务类型</span>
              <span class="text-lg font-semibold text-foreground">{{ taskInfo.serviceType }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-lg text-muted-foreground">预约时间</span>
              <span class="text-lg text-foreground">{{ taskInfo.time }}</span>
            </div>
          </div>
        </div>

        <!-- 联系人信息 -->
        <div class="bg-card rounded-xl p-5 border border-border mb-4">
          <h2 class="text-xl font-bold text-foreground mb-4">联系人</h2>
          
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-xl font-semibold text-foreground">{{ taskInfo.contactName }}</p>
              <p class="text-lg text-muted-foreground mt-1">{{ taskInfo.contactPhone }}</p>
            </div>
            <button
              @click="callContact"
              class="w-14 h-14 rounded-full bg-success flex items-center justify-center text-2xl active:scale-95"
            >
              📞
            </button>
          </div>
          
          <div class="flex items-start gap-2 text-lg text-muted-foreground">
            <span class="shrink-0">📍</span>
            <span>{{ taskInfo.address }}</span>
          </div>
        </div>

        <!-- 服务说明 -->
        <div class="bg-card rounded-xl p-5 border border-border">
          <h2 class="text-xl font-bold text-foreground mb-3">服务说明</h2>
          <p class="text-lg text-muted-foreground leading-relaxed">{{ taskInfo.description }}</p>
        </div>
      </main>
    </div>

    <!-- 底部操作按钮 -->
    <div class="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-5">
      <div class="max-w-md mx-auto">
        <button
          @click="handleStatusChange"
          :disabled="taskStatus === 3 || !canProceed"
          :class="[
            'w-full py-6 text-2xl font-bold rounded-xl transition-all active:scale-[0.98]',
            !canProceed ? 'bg-muted text-muted-foreground cursor-not-allowed' : buttonConfig.color,
            taskStatus === 3 ? 'text-muted-foreground cursor-not-allowed' : 'text-white'
          ]"
        >
          {{ buttonConfig.text }}
        </button>
        
        <p v-if="taskStatus === 0 && !allChecksPassed" class="text-center text-base text-warning mt-3">
          请先完成安全确认清单
        </p>
        <p v-else-if="taskStatus < 3" class="text-center text-lg text-muted-foreground mt-3">
          点击按钮更新服务状态
        </p>
        <p v-else class="text-center text-lg text-success mt-3">
          服务已完成，感谢您的付出！
        </p>
      </div>
    </div>
  </div>
</template>
