<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Volunteer {
  id: string
  name: string
  avatar: string
  serviceHours: number
  rating: number
  completedOrders: number
  skills: string[]
  medals: string[]
  verified: boolean
}

const volunteers = ref<Volunteer[]>([
  {
    id: '1',
    name: '王阿姨',
    avatar: '👩',
    serviceHours: 256,
    rating: 4.9,
    completedOrders: 89,
    skills: ['陪聊', '购物协助'],
    medals: ['长期服务', '五星好评'],
    verified: true
  },
  {
    id: '2',
    name: '李师傅',
    avatar: '👨',
    serviceHours: 180,
    rating: 4.8,
    completedOrders: 65,
    skills: ['就医陪同', '购物协助'],
    medals: ['急救认证', '专业技能'],
    verified: true
  },
  {
    id: '3',
    name: '张姐',
    avatar: '👩',
    serviceHours: 120,
    rating: 4.7,
    completedOrders: 42,
    skills: ['陪聊', '就医陪同'],
    medals: ['耐心服务'],
    verified: true
  },
  {
    id: '4',
    name: '刘大哥',
    avatar: '👨',
    serviceHours: 95,
    rating: 4.9,
    completedOrders: 38,
    skills: ['购物协助', '就医陪同'],
    medals: ['热心助人'],
    verified: true
  }
])

const goToDetail = (id: string) => {
  router.push(`/volunteers/${id}`)
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-background pb-6">
    <!-- 顶部导航 -->
    <header class="bg-primary text-primary-foreground px-4 py-5 sticky top-0 z-10">
      <div class="max-w-md mx-auto flex items-center">
        <button @click="goBack" class="text-2xl mr-4">←</button>
        <h1 class="text-2xl font-bold flex-1 text-center pr-8">志愿者列表</h1>
      </div>
    </header>

    <!-- 移动端框架容器 -->
    <div class="max-w-md mx-auto">
      <!-- 搜索和筛选 -->
      <div class="p-4 bg-card border-b border-border">
        <div class="flex gap-2">
          <input
            type="text"
            placeholder="搜索志愿者..."
            class="flex-1 px-4 py-3 text-lg border-2 border-border rounded-xl bg-background focus:border-primary focus:outline-none"
          />
          <button class="px-4 py-3 bg-secondary rounded-xl text-lg font-medium">
            筛选
          </button>
        </div>
        <div class="flex gap-2 mt-3 overflow-x-auto">
          <button class="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium shrink-0">
            全部
          </button>
          <button class="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium shrink-0">
            陪聊
          </button>
          <button class="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium shrink-0">
            就医
          </button>
          <button class="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium shrink-0">
            购物
          </button>
        </div>
      </div>

      <!-- 志愿者列表 -->
      <div class="p-4 flex flex-col gap-4">
        <button
          v-for="volunteer in volunteers"
          :key="volunteer.id"
          @click="goToDetail(volunteer.id)"
          class="w-full bg-card rounded-xl p-4 border border-border text-left active:scale-[0.98] transition-all"
        >
          <div class="flex items-start gap-4">
            <!-- 头像 -->
            <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl shrink-0 relative">
              {{ volunteer.avatar }}
              <span 
                v-if="volunteer.verified"
                class="absolute -bottom-1 -right-1 w-5 h-5 bg-trust text-white rounded-full flex items-center justify-center text-xs"
              >
                ✓
              </span>
            </div>

            <!-- 信息 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-bold text-foreground">{{ volunteer.name }}</h3>
                <span class="text-sm text-warning flex items-center gap-0.5">
                  ⭐ {{ volunteer.rating }}
                </span>
              </div>

              <!-- 服务时长和订单数 -->
              <div class="flex gap-4 mt-1 text-sm text-muted-foreground">
                <span>服务 {{ volunteer.serviceHours }} 小时</span>
                <span>完成 {{ volunteer.completedOrders }} 单</span>
              </div>

              <!-- 技能标签 -->
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="skill in volunteer.skills"
                  :key="skill"
                  class="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs"
                >
                  {{ skill }}
                </span>
              </div>

              <!-- 荣誉勋章 -->
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="medal in volunteer.medals"
                  :key="medal"
                  class="px-2 py-0.5 bg-warning/20 text-warning rounded text-xs font-medium"
                >
                  🏅 {{ medal }}
                </span>
              </div>
            </div>

            <!-- 箭头 -->
            <span class="text-muted-foreground text-xl shrink-0">→</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
