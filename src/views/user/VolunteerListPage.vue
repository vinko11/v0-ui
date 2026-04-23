<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Star, 
  Award, 
  Clock,
  ChevronRight,
  Search,
  BadgeCheck
} from 'lucide-vue-next'
import { volunteerList } from '@/stores/globalStore'

const router = useRouter()
const searchQuery = ref('')
const activeFilter = ref('all')

const approvedVolunteers = computed(() => 
  volunteerList.value.filter(v => v.status === 'APPROVED')
)

const filteredVolunteers = computed(() => {
  let result = approvedVolunteers.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(v => 
      v.name.toLowerCase().includes(query) || 
      v.skills.some(s => s.toLowerCase().includes(query))
    )
  }
  
  if (activeFilter.value !== 'all') {
    result = result.filter(v => v.skills.includes(activeFilter.value))
  }
  
  return result
})

const filters = [
  { key: 'all', label: '全部' },
  { key: '陪聊', label: '陪聊' },
  { key: '就医陪同', label: '就医' },
  { key: '购物协助', label: '购物' }
]

function goToDetail(volunteerId: string) {
  router.push(`/volunteer/${volunteerId}`)
}
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
        <h1 class="text-2xl font-bold">志愿者团队</h1>
      </div>
    </header>

    <!-- 搜索栏 -->
    <div class="px-4 pt-4">
      <div class="relative">
        <Search :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="搜索志愿者姓名或技能"
          class="w-full pl-12 pr-4 py-4 text-lg rounded-[20px] border-2 border-border bg-card focus:border-primary outline-none"
        />
      </div>
      
      <!-- 筛选标签 -->
      <div class="flex gap-2 mt-3 overflow-x-auto pb-2">
        <button
          v-for="filter in filters"
          :key="filter.key"
          @click="activeFilter = filter.key"
          :class="[
            'px-5 py-2 rounded-full text-base font-medium whitespace-nowrap transition-all',
            activeFilter === filter.key 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- 志愿者统计 -->
    <div class="px-4 mt-4">
      <div class="card-warm">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold text-primary">{{ approvedVolunteers.length }}</p>
            <p class="text-sm text-muted-foreground">认证志愿者</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-primary">4.9</p>
            <p class="text-sm text-muted-foreground">平均评分</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-primary">98%</p>
            <p class="text-sm text-muted-foreground">好评率</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 志愿者列表 -->
    <div class="px-4 mt-6">
      <h2 class="text-xl font-bold mb-4">全部志愿者 ({{ filteredVolunteers.length }})</h2>
      
      <!-- 空状态 -->
      <div v-if="filteredVolunteers.length === 0" class="card-warm text-center py-12">
        <div class="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <Search :size="40" class="text-muted-foreground" />
        </div>
        <p class="text-xl text-muted-foreground mb-2">没有找到志愿者</p>
        <p class="text-base text-muted-foreground">试试其他搜索词或筛选条件</p>
      </div>

      <div v-else class="space-y-4">
        <button
          v-for="volunteer in filteredVolunteers"
          :key="volunteer.id"
          @click="goToDetail(volunteer.id)"
          class="card-warm w-full text-left hover:shadow-md transition-shadow active:scale-[0.98]"
        >
          <div class="flex items-start gap-4">
            <!-- 头像 -->
            <div class="relative">
              <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span class="text-2xl font-bold text-primary">{{ volunteer.name.charAt(0) }}</span>
              </div>
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-trust rounded-full flex items-center justify-center">
                <BadgeCheck :size="14" class="text-white" />
              </div>
            </div>
            
            <!-- 信息 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-xl font-bold text-foreground">{{ volunteer.name }}</h3>
                <div v-if="volunteer.badges.length > 0" class="flex items-center gap-1">
                  <Award :size="18" class="text-warning" />
                </div>
              </div>
              
              <!-- 评分和服务次数 -->
              <div class="flex items-center gap-4 text-muted-foreground mb-2">
                <div class="flex items-center gap-1">
                  <Star :size="16" class="text-warning fill-warning" />
                  <span>{{ volunteer.rating }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Clock :size="16" />
                  <span>{{ volunteer.totalOrders }}次服务</span>
                </div>
              </div>
              
              <!-- 技能标签 -->
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="skill in volunteer.skills.slice(0, 3)" 
                  :key="skill"
                  class="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {{ skill }}
                </span>
              </div>

              <!-- 荣誉勋章 -->
              <div v-if="volunteer.badges.length > 0" class="flex flex-wrap gap-2 mt-2">
                <span 
                  v-for="badge in volunteer.badges.slice(0, 2)" 
                  :key="badge"
                  class="px-2 py-0.5 bg-warning/20 text-warning rounded text-xs font-medium flex items-center gap-1"
                >
                  <Award :size="12" />
                  {{ badge }}
                </span>
              </div>
            </div>

            <ChevronRight :size="24" class="text-muted-foreground flex-shrink-0 mt-4" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
