<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../../store/globalStore'
import {
  ArrowLeft,
  Search,
  Star,
  Clock,
  CheckCircle,
  Award,
  ChevronRight,
  Filter
} from 'lucide-vue-next'

const router = useRouter()
const store = useGlobalStore()

// 搜索关键词
const searchKeyword = ref('')

// 当前筛选技能
const currentFilter = ref('all')

// 筛选选项
const filterOptions = [
  { key: 'all', label: '全部' },
  { key: '陪聊', label: '陪聊' },
  { key: '就医陪同', label: '就医' },
  { key: '购物协助', label: '购物' }
]

// 已审核的志愿者
const approvedVolunteers = computed(() => {
  return store.state.volunteers.filter(v => v.status === 'APPROVED')
})

// 筛选后的志愿者
const filteredVolunteers = computed(() => {
  let list = approvedVolunteers.value
  
  // 关键词搜索
  if (searchKeyword.value) {
    list = list.filter(v => v.name.includes(searchKeyword.value))
  }
  
  // 技能筛选
  if (currentFilter.value !== 'all') {
    list = list.filter(v => v.skills.includes(currentFilter.value))
  }
  
  return list
})

// 跳转详情
function goToDetail(id: string) {
  router.push(`/volunteers/${id}`)
}

// 返回
function goBack() {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-background pb-6">
    <!-- 顶部导航 -->
    <header class="bg-[#FF9248] text-white px-4 py-5 sticky top-0 z-10 rounded-b-[2rem]">
      <div class="max-w-md mx-auto">
        <div class="flex items-center gap-4 mb-4">
          <button 
            @click="goBack" 
            class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft :size="24" />
          </button>
          <h1 class="text-2xl font-bold flex-1">志愿者列表</h1>
        </div>
        
        <!-- 搜索框 -->
        <div class="relative">
          <Search :size="22" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索志愿者..."
            class="w-full pl-12 pr-4 py-4 text-lg rounded-[1.5rem] bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>
    </header>

    <!-- 移动端框架容器 -->
    <div class="max-w-md mx-auto">
      <!-- 筛选标签 -->
      <div class="px-5 py-4 flex gap-3 overflow-x-auto">
        <button
          v-for="option in filterOptions"
          :key="option.key"
          @click="currentFilter = option.key"
          :class="[
            'px-5 py-2.5 rounded-full text-base font-medium shrink-0 transition-all',
            currentFilter === option.key
              ? 'bg-[#FF9248] text-white'
              : 'bg-card text-foreground border border-border'
          ]"
        >
          {{ option.label }}
        </button>
      </div>

      <!-- 志愿者列表 -->
      <div class="px-5 flex flex-col gap-4">
        <!-- 空状态 -->
        <div
          v-if="filteredVolunteers.length === 0"
          class="py-16 text-center"
        >
          <div class="empty-state-illustration mx-auto mb-6" />
          <p class="text-xl text-muted-foreground">暂无符合条件的志愿者</p>
          <p class="text-base text-muted-foreground mt-2">请尝试其他筛选条件</p>
        </div>

        <button
          v-for="volunteer in filteredVolunteers"
          :key="volunteer.id"
          @click="goToDetail(volunteer.id)"
          class="w-full bg-card rounded-[2rem] p-5 shadow-sm text-left active:scale-[0.98] transition-all"
        >
          <div class="flex items-start gap-4">
            <!-- 头像 -->
            <div class="w-16 h-16 rounded-[1.25rem] bg-[#FFF5EE] flex items-center justify-center text-3xl shrink-0 relative">
              <span>{{ volunteer.name.charAt(0) }}</span>
              <span 
                class="absolute -bottom-1 -right-1 w-6 h-6 bg-[#3B82F6] text-white rounded-full flex items-center justify-center"
              >
                <CheckCircle :size="14" />
              </span>
            </div>

            <!-- 信息 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-bold text-foreground">{{ volunteer.name }}</h3>
                <span class="flex items-center gap-1 text-[#F59E0B] font-medium">
                  <Star :size="16" fill="currentColor" />
                  <span>{{ volunteer.rating }}</span>
                </span>
              </div>

              <!-- 服务时长和订单数 -->
              <div class="flex gap-4 mt-1.5 text-base text-muted-foreground">
                <span class="flex items-center gap-1">
                  <Clock :size="16" />
                  {{ volunteer.totalHours }} 小时
                </span>
                <span>{{ volunteer.serviceCount }} 单</span>
              </div>

              <!-- 技能标签 -->
              <div class="flex flex-wrap gap-2 mt-2.5">
                <span
                  v-for="skill in volunteer.skills"
                  :key="skill"
                  class="px-3 py-1 bg-[#FFF5EE] text-[#FF9248] rounded-full text-sm font-medium"
                >
                  {{ skill }}
                </span>
              </div>

              <!-- 荣誉勋章 -->
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="badge in volunteer.badges.slice(0, 2)"
                  :key="badge"
                  class="flex items-center gap-1 px-2.5 py-1 bg-[#FEF3C7] text-[#D97706] rounded-full text-sm font-medium"
                >
                  <Award :size="14" />
                  {{ badge }}
                </span>
              </div>
            </div>

            <!-- 箭头 -->
            <ChevronRight :size="28" class="text-muted-foreground shrink-0 mt-4" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
