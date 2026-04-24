<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Task {
  id: string
  serviceType: string
  typeIcon: string
  description: string
  address: string
  distance: string
  time: string
  contactName: string
  status: 'pending' | 'accepted' | 'rejected'
}

const tasks = ref<Task[]>([
  {
    id: '1',
    serviceType: '陪聊服务',
    typeIcon: '💬',
    description: '希望有人陪我聊聊天，最近心情不太好',
    address: '朝阳区XX社区3号楼',
    distance: '1.2km',
    time: '今天 14:00',
    contactName: '王奶奶',
    status: 'accepted'
  },
  {
    id: '2',
    serviceType: '就医陪同',
    typeIcon: '🏥',
    description: '需要去医院复查，希望有人陪同',
    address: '海淀区YY社区5号楼',
    distance: '2.5km',
    time: '明天 09:00',
    contactName: '李爷爷',
    status: 'pending'
  },
  {
    id: '3',
    serviceType: '购物协助',
    typeIcon: '🛒',
    description: '需要帮忙买一些日用品和蔬菜',
    address: '西城区ZZ社区1号楼',
    distance: '0.8km',
    time: '今天 16:30',
    contactName: '张阿姨',
    status: 'pending'
  }
])

// 志愿者荣誉信息
const volunteerStats = ref({
  rank: '银星志愿者',
  totalHours: 156,
  completedTasks: 45,
  rating: 4.9
})

// 培训中心
const trainingItems = ref([
  { id: '1', title: '轮椅使用指南', icon: '🦽' },
  { id: '2', title: '急救基础知识', icon: '🏥' },
  { id: '3', title: '沟通技巧培训', icon: '💬' }
])

// 拒绝弹窗
const showRejectModal = ref(false)
const rejectingTaskId = ref<string | null>(null)
const rejectReason = ref('')
const rejectError = ref('')

const acceptTask = (taskId: string) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.status = 'accepted'
  }
}

const openRejectModal = (taskId: string) => {
  rejectingTaskId.value = taskId
  rejectReason.value = ''
  rejectError.value = ''
  showRejectModal.value = true
}

const confirmReject = () => {
  if (rejectReason.value.length < 5) {
    rejectError.value = '拒绝原因至少需要5个字符'
    return
  }
  
  const task = tasks.value.find(t => t.id === rejectingTaskId.value)
  if (task) {
    task.status = 'rejected'
  }
  
  showRejectModal.value = false
  rejectingTaskId.value = null
  rejectReason.value = ''
}

const startTask = (taskId: string) => {
  router.push(`/volunteer/execute/${taskId}`)
}

const goToRegister = () => {
  router.push('/volunteer/register')
}

const goToProfile = () => {
  router.push('/volunteer/profile')
}
</script>

<template>
  <div class="min-h-screen bg-background pb-24">
    <!-- 顶部导航 -->
    <header class="bg-primary text-primary-foreground px-4 py-5">
      <h1 class="text-2xl font-bold text-center">志愿者中心</h1>
      
      <!-- 信任徽章 -->
      <div class="flex justify-center gap-2 mt-3">
        <span class="trust-badge bg-white/20 text-white text-sm">
          ⭐ {{ volunteerStats.rank }}
        </span>
        <span class="trust-badge bg-white/20 text-white text-sm">
          ✓ 认证志愿者
        </span>
      </div>
    </header>

    <!-- 移动端框架容器 -->
    <div class="max-w-md mx-auto">
      <!-- 荣誉墙 -->
      <div class="bg-gradient-to-r from-primary/10 to-warning/10 mx-5 mt-5 rounded-xl p-5 border border-primary/20">
        <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          🏆 志愿者荣誉
        </h3>
        <div class="grid grid-cols-4 gap-3">
          <div class="text-center">
            <p class="text-2xl font-bold text-primary">{{ volunteerStats.totalHours }}</p>
            <p class="text-xs text-muted-foreground mt-1">服务时长</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-success">{{ volunteerStats.completedTasks }}</p>
            <p class="text-xs text-muted-foreground mt-1">完成任务</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-warning">{{ volunteerStats.rating }}</p>
            <p class="text-xs text-muted-foreground mt-1">服务评分</p>
          </div>
          <div class="text-center">
            <p class="text-2xl">⭐</p>
            <p class="text-xs text-muted-foreground mt-1">银星</p>
          </div>
        </div>
      </div>

      <!-- 培训中心入口 -->
      <div class="bg-card mx-5 mt-4 rounded-xl p-4 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          📚 培训中心
        </h3>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="item in trainingItems"
            :key="item.id"
            class="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm font-medium text-secondary-foreground"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.title }}</span>
          </button>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="bg-card mx-5 mt-4 rounded-xl p-5 border border-border">
        <div class="flex justify-around">
          <div class="text-center">
            <p class="text-3xl font-bold text-primary">{{ tasks.filter(t => t.status === 'accepted').length }}</p>
            <p class="text-lg text-muted-foreground">已接单</p>
          </div>
          <div class="w-px bg-border"></div>
          <div class="text-center">
            <p class="text-3xl font-bold text-foreground">{{ tasks.filter(t => t.status === 'pending').length }}</p>
            <p class="text-lg text-muted-foreground">待接单</p>
          </div>
        </div>
      </div>

      <!-- 任务列表 -->
      <main class="p-5">
        <h2 class="text-xl font-bold text-foreground mb-4">待办任务</h2>
        <div class="flex flex-col gap-4">
          <div
            v-for="task in tasks.filter(t => t.status !== 'rejected')"
            :key="task.id"
            class="bg-card rounded-xl p-5 border border-border"
          >
            <!-- 任务头部 -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ task.typeIcon }}</span>
                <span class="text-xl font-bold text-foreground">{{ task.serviceType }}</span>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded-lg text-base font-medium',
                  task.status === 'accepted' 
                    ? 'bg-success/20 text-success' 
                    : 'bg-warning/20 text-warning'
                ]"
              >
                {{ task.status === 'accepted' ? '已接单' : '待接单' }}
              </span>
            </div>

            <!-- 任务描述 -->
            <p class="text-lg text-foreground mb-3 line-clamp-2">{{ task.description }}</p>

            <!-- 任务信息 -->
            <div class="flex flex-col gap-2 mb-4 text-muted-foreground">
              <div class="flex items-center gap-2 text-base">
                <span>📍</span>
                <span>{{ task.address }}</span>
                <span class="ml-auto font-semibold text-primary">{{ task.distance }}</span>
              </div>
              <div class="flex items-center gap-2 text-base">
                <span>🕐</span>
                <span>{{ task.time }}</span>
              </div>
              <div class="flex items-center gap-2 text-base">
                <span>👤</span>
                <span>{{ task.contactName }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3">
              <template v-if="task.status === 'pending'">
                <button
                  @click="acceptTask(task.id)"
                  class="flex-1 py-4 text-xl font-bold rounded-xl bg-primary text-primary-foreground active:scale-[0.98]"
                >
                  接受
                </button>
                <button
                  @click="openRejectModal(task.id)"
                  class="flex-1 py-4 text-xl font-bold rounded-xl bg-destructive text-destructive-foreground active:scale-[0.98]"
                >
                  拒绝
                </button>
              </template>
              <button
                v-else
                @click="startTask(task.id)"
                class="flex-1 py-4 text-xl font-bold rounded-xl bg-success text-success-foreground active:scale-[0.98]"
              >
                开始执行
              </button>
            </div>
          </div>
        </div>
      </main>

      <!-- 底部导航 -->
      <nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4">
        <div class="max-w-md mx-auto flex justify-around">
          <button class="flex flex-col items-center text-primary">
            <span class="text-2xl">📋</span>
            <span class="text-base font-medium">待办</span>
          </button>
          <button class="flex flex-col items-center text-muted-foreground">
            <span class="text-2xl">✅</span>
            <span class="text-base">已完成</span>
          </button>
          <button 
            @click="goToRegister"
            class="flex flex-col items-center text-muted-foreground"
          >
            <span class="text-2xl">📝</span>
            <span class="text-base">注册</span>
          </button>
          <button 
            @click="goToProfile"
            class="flex flex-col items-center text-muted-foreground"
          >
            <span class="text-2xl">👤</span>
            <span class="text-base">档案</span>
          </button>
        </div>
      </nav>
    </div>

    <!-- 拒绝原因弹窗 -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-card rounded-2xl p-6 w-full max-w-sm">
        <h3 class="text-2xl font-bold text-foreground mb-4">拒绝原因</h3>
        <p class="text-lg text-muted-foreground mb-4">请说明拒绝此任务的原因（至少5个字符）</p>
        
        <textarea
          v-model="rejectReason"
          rows="3"
          placeholder="请输入拒绝原因..."
          class="w-full p-4 text-lg border-2 border-border rounded-xl bg-background focus:border-primary focus:outline-none placeholder:text-muted-foreground resize-none"
        ></textarea>
        
        <p v-if="rejectError" class="text-destructive mt-2 text-base">{{ rejectError }}</p>
        
        <div class="flex gap-3 mt-6">
          <button
            @click="showRejectModal = false"
            class="flex-1 py-3 text-lg font-semibold rounded-xl bg-secondary text-secondary-foreground"
          >
            取消
          </button>
          <button
            @click="confirmReject"
            class="flex-1 py-3 text-lg font-semibold rounded-xl bg-destructive text-destructive-foreground"
          >
            确认拒绝
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
