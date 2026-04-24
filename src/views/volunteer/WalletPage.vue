<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../../store/globalStore'
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  Clock,
  Calendar,
  Info,
  ChevronRight
} from 'lucide-vue-next'

const router = useRouter()
const store = useGlobalStore()

// 预估收入计算
const estimatedIncome = computed(() => {
  const hourlyRate = store.state.currentVolunteer.hourlyRate
  const totalHours = store.state.currentVolunteer.totalHours
  const gross = totalHours * hourlyRate
  const platformFee = gross * 0.12
  return {
    hourlyRate,
    totalHours,
    gross,
    platformFee,
    net: gross - platformFee
  }
})

// 收入明细
const incomeHistory = [
  { id: '1', date: '2024-03-10', type: '陪聊服务', hours: 2, amount: 60, fee: 7.2 },
  { id: '2', date: '2024-03-08', type: '就医陪同', hours: 3, amount: 90, fee: 10.8 },
  { id: '3', date: '2024-03-05', type: '购物协助', hours: 1.5, amount: 45, fee: 5.4 },
  { id: '4', date: '2024-03-01', type: '陪聊服务', hours: 2.5, amount: 75, fee: 9.0 }
]

function goBack() {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-background pb-8">
    <!-- 顶部导航 -->
    <div class="bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] text-white px-4 pt-4 pb-8 rounded-b-[2rem]">
      <div class="max-w-md mx-auto">
        <div class="flex items-center gap-4 mb-6">
          <button 
            @click="goBack" 
            class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft :size="24" />
          </button>
          <h1 class="text-2xl font-bold">我的钱包</h1>
        </div>

        <!-- 预估收入 -->
        <div class="text-center py-4">
          <p class="text-lg opacity-90 mb-2">预估总收入</p>
          <p class="text-5xl font-bold">¥ {{ estimatedIncome.net.toFixed(0) }}</p>
          <p class="text-base opacity-80 mt-2">已扣除平台管理费</p>
        </div>
      </div>
    </div>

    <div class="max-w-md mx-auto -mt-4">
      <!-- 收入明细卡片 -->
      <div class="mx-5 bg-card rounded-[2rem] shadow-sm p-5">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="flex items-center justify-center gap-1 text-[#3B82F6]">
              <Clock :size="18" />
              <span class="text-2xl font-bold">{{ estimatedIncome.totalHours }}</span>
            </div>
            <p class="text-sm text-muted-foreground mt-1">总工时</p>
          </div>
          <div class="border-x border-border">
            <div class="text-2xl font-bold text-[#22C55E]">¥{{ estimatedIncome.hourlyRate }}</div>
            <p class="text-sm text-muted-foreground mt-1">时薪</p>
          </div>
          <div>
            <div class="text-2xl font-bold text-[#F59E0B]">12%</div>
            <p class="text-sm text-muted-foreground mt-1">平台费率</p>
          </div>
        </div>
      </div>

      <!-- 计算公式说明 -->
      <div class="mx-5 mt-4 bg-[#EFF6FF] rounded-[1.5rem] p-4 border border-[#3B82F6]/20">
        <div class="flex items-start gap-3">
          <Info :size="22" class="text-[#3B82F6] shrink-0 mt-0.5" />
          <div class="text-base text-foreground">
            <p class="font-medium mb-1">收入计算公式</p>
            <p class="text-muted-foreground">
              净收入 = (总工时 × 时薪) - 12% 平台管理费
            </p>
            <p class="text-sm text-muted-foreground mt-2">
              {{ estimatedIncome.totalHours }}小时 × ¥{{ estimatedIncome.hourlyRate }} = ¥{{ estimatedIncome.gross.toFixed(0) }}
              <br />
              平台管理费: ¥{{ estimatedIncome.platformFee.toFixed(0) }}
              <br />
              <span class="font-semibold text-[#22C55E]">净收入: ¥{{ estimatedIncome.net.toFixed(0) }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- 收入明细 -->
      <div class="px-5 mt-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-foreground">收入明细</h2>
          <button class="flex items-center gap-1 text-[#3B82F6] text-base font-medium">
            <span>全部</span>
            <ChevronRight :size="18" />
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in incomeHistory"
            :key="item.id"
            class="bg-card rounded-[1.5rem] p-4 shadow-sm flex items-center justify-between"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
                <TrendingUp :size="22" class="text-[#22C55E]" />
              </div>
              <div>
                <p class="text-base font-semibold text-foreground">{{ item.type }}</p>
                <p class="text-sm text-muted-foreground">{{ item.date }} · {{ item.hours }}小时</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-[#22C55E]">+¥{{ (item.amount - item.fee).toFixed(0) }}</p>
              <p class="text-xs text-muted-foreground">平台费 ¥{{ item.fee.toFixed(0) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
