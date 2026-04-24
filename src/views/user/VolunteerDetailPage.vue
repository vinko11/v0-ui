<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '../../store/globalStore'
import {
  ArrowLeft,
  Star,
  Clock,
  CheckCircle,
  Award,
  Shield,
  MessageCircle,
  Calendar,
  Phone
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useGlobalStore()

const volunteerId = computed(() => route.params.id as string)

// 获取志愿者信息
const volunteer = computed(() => {
  return store.state.volunteers.find(v => v.id === volunteerId.value)
})

// 返回
function goBack() {
  router.back()
}

// 预约服务
function bookService() {
  router.push({ path: '/order', query: { volunteer: volunteerId.value } })
}
</script>

<template>
  <div class="min-h-screen bg-background pb-32">
    <!-- 顶部导航 -->
    <div class="bg-gradient-to-br from-[#FF9248] to-[#FFB088] text-white px-4 pt-4 pb-8 rounded-b-[2rem]">
      <div class="max-w-md mx-auto">
        <div class="flex items-center gap-4 mb-6">
          <button 
            @click="goBack" 
            class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft :size="24" />
          </button>
          <h1 class="text-2xl font-bold">志愿者详情</h1>
        </div>

        <!-- 志愿者头像和基本信息 -->
        <div v-if="volunteer" class="flex items-center gap-5">
          <div class="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center text-4xl font-bold text-[#FF9248] relative">
            {{ volunteer.name.charAt(0) }}
            <span class="absolute -bottom-1 -right-1 w-8 h-8 bg-[#3B82F6] text-white rounded-full flex items-center justify-center">
              <CheckCircle :size="18" />
            </span>
          </div>
          <div>
            <h2 class="text-3xl font-bold">{{ volunteer.name }}</h2>
            <div class="flex items-center gap-3 mt-2">
              <span class="flex items-center gap-1 text-lg">
                <Star :size="20" fill="currentColor" />
                {{ volunteer.rating }} 分
              </span>
              <span class="text-lg opacity-80">|</span>
              <span class="text-lg opacity-90">{{ volunteer.serviceCount }} 次服务</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="volunteer" class="max-w-md mx-auto -mt-4">
      <!-- 服务统计 -->
      <div class="mx-5 bg-card rounded-[2rem] shadow-sm p-5">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="flex items-center justify-center gap-1.5 text-[#FF9248]">
              <Clock :size="20" />
              <span class="text-2xl font-bold">{{ volunteer.totalHours }}</span>
            </div>
            <p class="text-sm text-muted-foreground mt-1">累计时长</p>
          </div>
          <div class="border-x border-border">
            <div class="text-2xl font-bold text-[#22C55E]">{{ volunteer.serviceCount }}</div>
            <p class="text-sm text-muted-foreground mt-1">完成订单</p>
          </div>
          <div>
            <div class="text-2xl font-bold text-[#3B82F6]">{{ volunteer.badges.length }}</div>
            <p class="text-sm text-muted-foreground mt-1">荣誉勋章</p>
          </div>
        </div>
      </div>

      <!-- 勋章墙 -->
      <div class="px-5 mt-6">
        <h3 class="text-xl font-bold text-foreground mb-4">勋章墙</h3>
        <div class="flex flex-wrap gap-3">
          <div
            v-for="badge in volunteer.badges"
            :key="badge"
            class="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-[1.5rem] shadow-sm"
          >
            <Award :size="22" class="text-[#D97706]" />
            <span class="text-base font-bold text-[#92400E]">{{ badge }}</span>
          </div>
        </div>
        <div v-if="volunteer.badges.length === 0" class="text-center py-8 text-muted-foreground">
          暂无勋章
        </div>
      </div>

      <!-- 服务技能 -->
      <div class="px-5 mt-6">
        <h3 class="text-xl font-bold text-foreground mb-4">服务技能</h3>
        <div class="flex flex-wrap gap-3">
          <span
            v-for="skill in volunteer.skills"
            :key="skill"
            class="px-5 py-2.5 bg-[#FFF5EE] text-[#FF9248] rounded-full text-base font-medium"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- 认证信息 -->
      <div class="px-5 mt-6">
        <h3 class="text-xl font-bold text-foreground mb-4">认证信息</h3>
        <div class="bg-[#EFF6FF] rounded-[2rem] p-5 border border-[#3B82F6]/20">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <CheckCircle :size="22" class="text-[#22C55E]" />
              <span class="text-base text-foreground">实名认证已通过</span>
            </div>
            <div class="flex items-center gap-3">
              <Shield :size="22" class="text-[#3B82F6]" />
              <span class="text-base text-foreground">社区背景审查已通过</span>
            </div>
            <div class="flex items-center gap-3">
              <Calendar :size="22" class="text-[#FF9248]" />
              <span class="text-base text-foreground">加入时间：{{ volunteer.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 服务评价 -->
      <div class="px-5 mt-6">
        <h3 class="text-xl font-bold text-foreground mb-4">服务评价</h3>
        <div class="space-y-4">
          <div
            v-for="(review, index) in volunteer.reviews"
            :key="index"
            class="bg-card rounded-[1.5rem] p-5 shadow-sm"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#FFF5EE] flex items-center justify-center text-lg font-bold text-[#FF9248]">
                  {{ review.user.charAt(0) }}
                </div>
                <span class="text-base font-semibold text-foreground">{{ review.user }}</span>
              </div>
              <div class="flex items-center gap-1 text-[#F59E0B]">
                <Star v-for="i in review.rating" :key="i" :size="16" fill="currentColor" />
              </div>
            </div>
            <p class="text-base text-muted-foreground leading-relaxed">{{ review.content }}</p>
            <p class="text-sm text-muted-foreground mt-2">{{ review.date }}</p>
          </div>
          
          <div v-if="volunteer.reviews.length === 0" class="text-center py-8">
            <div class="empty-state-illustration mx-auto mb-4 w-24 h-24" />
            <p class="text-lg text-muted-foreground">暂无评价</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部预约按钮 -->
    <div class="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-5 safe-area-bottom">
      <div class="max-w-md mx-auto flex gap-4">
        <button class="flex-1 btn-elder bg-secondary text-foreground font-bold flex items-center justify-center gap-2">
          <Phone :size="22" />
          联系TA
        </button>
        <button
          @click="bookService"
          class="flex-1 btn-elder bg-[#FF9248] text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <MessageCircle :size="22" />
          预约服务
        </button>
      </div>
    </div>
  </div>
</template>
