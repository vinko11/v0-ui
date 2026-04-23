<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Star, 
  Award, 
  Clock,
  Phone,
  Shield,
  BadgeCheck,
  MessageCircle,
  Heart
} from 'lucide-vue-next'
import { volunteerList, orderList } from '@/stores/globalStore'

const route = useRoute()
const router = useRouter()
const volunteerId = route.params.id as string

const volunteer = computed(() => 
  volunteerList.value.find(v => v.id === volunteerId)
)

// 该志愿者的历史评价
const volunteerReviews = computed(() => 
  orderList.value
    .filter(o => o.volunteerId === volunteerId && o.review)
    .map(o => ({
      userName: o.userName,
      rating: o.rating || 5,
      review: o.review,
      date: o.completedAt,
      serviceName: o.serviceName
    }))
)

// 勋章墙数据
const badgeDetails = computed(() => {
  const badges = volunteer.value?.badges || []
  return badges.map(badge => {
    const badgeInfo: Record<string, { icon: string; color: string; desc: string }> = {
      '金牌志愿者': { icon: '🥇', color: 'bg-yellow-100', desc: '累计服务超过100次' },
      '银牌志愿者': { icon: '🥈', color: 'bg-gray-100', desc: '累计服务超过50次' },
      '爱心使者': { icon: '❤️', color: 'bg-red-100', desc: '获得10次以上五星好评' },
      '社区之星': { icon: '⭐', color: 'bg-orange-100', desc: '社区表彰优秀志愿者' },
      '急救认证': { icon: '🏥', color: 'bg-blue-100', desc: '通过急救技能培训认证' }
    }
    return {
      name: badge,
      ...badgeInfo[badge] || { icon: '🏅', color: 'bg-primary/10', desc: '荣誉勋章' }
    }
  })
})
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
        <h1 class="text-2xl font-bold">志愿者详情</h1>
      </div>
    </header>

    <template v-if="volunteer">
      <!-- 志愿者头像和基本信息 -->
      <div class="bg-gradient-to-b from-primary/20 to-transparent px-4 pt-6 pb-8">
        <div class="flex flex-col items-center">
          <div class="relative mb-4">
            <div class="w-28 h-28 rounded-full bg-card flex items-center justify-center shadow-lg">
              <span class="text-4xl font-bold text-primary">{{ volunteer.name.charAt(0) }}</span>
            </div>
            <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-trust rounded-full flex items-center justify-center shadow">
              <BadgeCheck :size="24" class="text-white" />
            </div>
          </div>
          
          <h2 class="text-3xl font-bold text-foreground mb-2">{{ volunteer.name }}</h2>
          
          <div class="flex items-center gap-2 mb-4">
            <div class="flex items-center gap-1 bg-warning/20 px-3 py-1 rounded-full">
              <Star :size="18" class="text-warning fill-warning" />
              <span class="font-bold text-warning">{{ volunteer.rating }}</span>
            </div>
            <span class="text-muted-foreground">|</span>
            <span class="text-muted-foreground">{{ volunteer.totalOrders }}次服务</span>
          </div>

          <!-- 技能标签 -->
          <div class="flex flex-wrap justify-center gap-2">
            <span 
              v-for="skill in volunteer.skills" 
              :key="skill"
              class="px-4 py-2 bg-card text-foreground rounded-full text-base font-medium shadow-sm"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <!-- 服务统计 -->
      <div class="px-4 -mt-4">
        <div class="card-warm">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-2xl font-bold text-primary">{{ volunteer.totalOrders }}</p>
              <p class="text-sm text-muted-foreground">服务次数</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-primary">{{ volunteer.totalHours }}</p>
              <p class="text-sm text-muted-foreground">服务时长</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-primary">{{ volunteer.badges.length }}</p>
              <p class="text-sm text-muted-foreground">荣誉勋章</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 个人简介 -->
      <div class="px-4 mt-6">
        <h3 class="text-xl font-bold mb-3">个人简介</h3>
        <div class="card-warm">
          <p class="text-lg text-muted-foreground leading-relaxed">
            {{ volunteer.experience }}
          </p>
        </div>
      </div>

      <!-- 勋章墙 -->
      <div v-if="badgeDetails.length > 0" class="px-4 mt-6">
        <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
          <Award :size="24" class="text-warning" />
          勋章墙
        </h3>
        <div class="card-warm">
          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="badge in badgeDetails" 
              :key="badge.name"
              :class="[badge.color, 'p-4 rounded-[20px] text-center']"
            >
              <div class="text-4xl mb-2">{{ badge.icon }}</div>
              <h4 class="font-bold text-foreground">{{ badge.name }}</h4>
              <p class="text-sm text-muted-foreground mt-1">{{ badge.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 服务评价 -->
      <div class="px-4 mt-6">
        <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
          <MessageCircle :size="24" class="text-primary" />
          服务评价
        </h3>
        
        <!-- 空状态 -->
        <div v-if="volunteerReviews.length === 0" class="card-warm text-center py-8">
          <Heart :size="40" class="text-muted-foreground mx-auto mb-3" />
          <p class="text-lg text-muted-foreground">暂无评价</p>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="(review, i) in volunteerReviews" 
            :key="i"
            class="card-warm"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="font-bold text-primary">{{ review.userName.charAt(0) }}</span>
                </div>
                <div>
                  <p class="font-semibold">{{ review.userName }}</p>
                  <p class="text-sm text-muted-foreground">{{ review.serviceName }}</p>
                </div>
              </div>
              <div class="flex items-center gap-0.5">
                <Star 
                  v-for="j in 5" 
                  :key="j" 
                  :size="16" 
                  :class="j <= review.rating ? 'text-warning fill-warning' : 'text-muted-foreground'"
                />
              </div>
            </div>
            <p class="text-muted-foreground">{{ review.review }}</p>
          </div>
        </div>
      </div>

      <!-- 信任保障 -->
      <div class="px-4 mt-6 mb-8">
        <div class="card-warm bg-trust/5 border border-trust/20">
          <div class="flex items-center gap-3 mb-3">
            <Shield :size="24" class="text-trust" />
            <span class="text-lg font-semibold text-trust">信任保障</span>
          </div>
          <ul class="space-y-2 text-muted-foreground">
            <li class="flex items-center gap-2">
              <BadgeCheck :size="18" class="text-trust" />
              已通过实名认证
            </li>
            <li class="flex items-center gap-2">
              <BadgeCheck :size="18" class="text-trust" />
              社区备案志愿者
            </li>
            <li class="flex items-center gap-2">
              <BadgeCheck :size="18" class="text-trust" />
              服务全程可追溯
            </li>
          </ul>
        </div>
      </div>
    </template>

    <!-- 未找到志愿者 -->
    <div v-else class="px-4 py-12 text-center">
      <p class="text-xl text-muted-foreground">未找到该志愿者信息</p>
    </div>
  </div>
</template>
