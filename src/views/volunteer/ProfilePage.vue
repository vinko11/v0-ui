<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const volunteerInfo = ref({
  name: '张志愿者',
  phone: '138****1234',
  community: '朝阳区XX社区',
  joinDate: '2023年6月'
})

// 技能档案
const skills = ref([
  { id: '1', name: '医疗背景', icon: '🏥', description: '护理专业毕业' },
  { id: '2', name: '心理辅导', icon: '💬', description: '持有心理咨询证书' },
  { id: '3', name: '驾驶执照', icon: '🚗', description: 'C1驾照' }
])

// 荣誉徽章
const badges = ref([
  { id: '1', name: '银星志愿者', icon: '⭐', color: 'bg-gray-200' },
  { id: '2', name: '服务之星', icon: '🌟', color: 'bg-yellow-100' },
  { id: '3', name: '暖心天使', icon: '😇', color: 'bg-pink-100' }
])

// 服务统计
const stats = ref({
  totalHours: 156,
  completedTasks: 45,
  rating: 4.9,
  thankYouNotes: 38
})

const goBack = () => {
  router.push('/volunteer')
}
</script>

<template>
  <div class="min-h-screen bg-background pb-24">
    <!-- 顶部导航 -->
    <header class="bg-primary text-primary-foreground px-4 py-5 flex items-center gap-4">
      <button @click="goBack" class="text-3xl">←</button>
      <h1 class="text-2xl font-bold">志愿者档案</h1>
    </header>

    <div class="max-w-md mx-auto">
      <!-- 个人信息卡片 -->
      <div class="bg-card mx-5 mt-5 rounded-xl p-5 border border-border">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-4xl">
            👤
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-foreground">{{ volunteerInfo.name }}</h2>
            <p class="text-lg text-muted-foreground">{{ volunteerInfo.phone }}</p>
            <p class="text-base text-muted-foreground">{{ volunteerInfo.community }}</p>
            <p class="text-sm text-muted-foreground">加入时间：{{ volunteerInfo.joinDate }}</p>
          </div>
        </div>
        
        <!-- 信任徽章 -->
        <div class="flex gap-2 mt-4 flex-wrap">
          <span class="trust-badge bg-trust/10 text-trust">
            ✓ 实名认证
          </span>
          <span class="trust-badge bg-success/10 text-success">
            ✓ 背景审核
          </span>
          <span class="trust-badge bg-warning/10 text-warning">
            ⭐ 银星志愿者
          </span>
        </div>
      </div>

      <!-- 服务统计 -->
      <div class="bg-card mx-5 mt-4 rounded-xl p-5 border border-border">
        <h3 class="text-lg font-bold text-foreground mb-4">服务统计</h3>
        <div class="grid grid-cols-4 gap-3">
          <div class="text-center">
            <p class="text-2xl font-bold text-primary">{{ stats.totalHours }}</p>
            <p class="text-xs text-muted-foreground mt-1">服务时长</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-success">{{ stats.completedTasks }}</p>
            <p class="text-xs text-muted-foreground mt-1">完成任务</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-warning">{{ stats.rating }}</p>
            <p class="text-xs text-muted-foreground mt-1">服务评分</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-pink-500">{{ stats.thankYouNotes }}</p>
            <p class="text-xs text-muted-foreground mt-1">感谢信</p>
          </div>
        </div>
      </div>

      <!-- 荣誉徽章 -->
      <div class="bg-card mx-5 mt-4 rounded-xl p-5 border border-border">
        <h3 class="text-lg font-bold text-foreground mb-4">荣誉徽章</h3>
        <div class="flex gap-4">
          <div
            v-for="badge in badges"
            :key="badge.id"
            class="text-center"
          >
            <div :class="[badge.color, 'w-16 h-16 rounded-full flex items-center justify-center text-3xl']">
              {{ badge.icon }}
            </div>
            <p class="text-sm text-foreground mt-2">{{ badge.name }}</p>
          </div>
        </div>
      </div>

      <!-- 技能档案 -->
      <div class="p-5">
        <h3 class="text-lg font-bold text-foreground mb-4">技能档案</h3>
        <div class="flex flex-col gap-3">
          <div
            v-for="skill in skills"
            :key="skill.id"
            class="bg-card rounded-xl p-4 border border-border flex items-center gap-4"
          >
            <div class="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
              {{ skill.icon }}
            </div>
            <div>
              <p class="text-lg font-semibold text-foreground">{{ skill.name }}</p>
              <p class="text-base text-muted-foreground">{{ skill.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部导航 -->
      <nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4">
        <div class="max-w-md mx-auto flex justify-around">
          <button 
            @click="router.push('/volunteer')"
            class="flex flex-col items-center text-muted-foreground"
          >
            <span class="text-2xl">📋</span>
            <span class="text-base">待办</span>
          </button>
          <button class="flex flex-col items-center text-muted-foreground">
            <span class="text-2xl">✅</span>
            <span class="text-base">已完成</span>
          </button>
          <button 
            @click="router.push('/volunteer/register')"
            class="flex flex-col items-center text-muted-foreground"
          >
            <span class="text-2xl">📝</span>
            <span class="text-base">注册</span>
          </button>
          <button class="flex flex-col items-center text-primary">
            <span class="text-2xl">👤</span>
            <span class="text-base font-medium">档案</span>
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>
