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
  status: 'pending' | 'accepted'
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

const acceptTask = (taskId: string) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.status = 'accepted'
  }
}

const startTask = (taskId: string) => {
  router.push(`/volunteer/execute/${taskId}`)
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background pb-24">
    <!-- 顶部导航 -->
    <header class="bg-primary text-primary-foreground px-4 py-5 flex items-center gap-4">
      <button @click="goHome" class="text-3xl">←</button>
      <h1 class="text-2xl font-bold">待办任务</h1>
    </header>

    <!-- 统计信息 -->
    <div class="bg-card mx-5 mt-5 rounded-xl p-5 border border-border">
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
      <div class="flex flex-col gap-4">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="bg-card rounded-xl p-5 border border-border"
        >
          <!-- 任务头部 -->
          <div class="flex items-center justify-between mb-4">
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
          <p class="text-lg text-foreground mb-4 line-clamp-2">{{ task.description }}</p>

          <!-- 任务信息 -->
          <div class="flex flex-col gap-2 mb-4 text-muted-foreground">
            <div class="flex items-center gap-2 text-lg">
              <span>📍</span>
              <span>{{ task.address }}</span>
              <span class="ml-auto font-semibold text-primary">{{ task.distance }}</span>
            </div>
            <div class="flex items-center gap-2 text-lg">
              <span>🕐</span>
              <span>{{ task.time }}</span>
            </div>
            <div class="flex items-center gap-2 text-lg">
              <span>👤</span>
              <span>{{ task.contactName }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-3">
            <button
              v-if="task.status === 'pending'"
              @click="acceptTask(task.id)"
              class="flex-1 py-4 text-xl font-bold rounded-xl bg-primary text-primary-foreground active:scale-[0.98]"
            >
              接受任务
            </button>
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
      <div class="flex justify-around">
        <button class="flex flex-col items-center text-primary">
          <span class="text-2xl">📋</span>
          <span class="text-base font-medium">待办</span>
        </button>
        <button class="flex flex-col items-center text-muted-foreground">
          <span class="text-2xl">✅</span>
          <span class="text-base">已完成</span>
        </button>
        <button class="flex flex-col items-center text-muted-foreground">
          <span class="text-2xl">👤</span>
          <span class="text-base">我的</span>
        </button>
      </div>
    </nav>
  </div>
</template>
