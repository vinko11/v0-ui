<script setup lang="ts">
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Wallet,
  Clock,
  TrendingUp,
  Info,
  ChevronRight
} from 'lucide-vue-next'
import { currentVolunteer, volunteerEarnings, myCompletedOrders } from '@/stores/globalStore'

const router = useRouter()

// 收入明细
const incomeDetails = [
  { month: '12月', hours: 24, amount: 720, fee: 86.4, net: 633.6 },
  { month: '11月', hours: 32, amount: 960, fee: 115.2, net: 844.8 },
  { month: '10月', hours: 28, amount: 840, fee: 100.8, net: 739.2 }
]
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
        <h1 class="text-2xl font-bold">我的钱包</h1>
      </div>
    </header>

    <!-- 薪酬概览 -->
    <div class="px-4 mt-4">
      <div class="card-warm bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center">
            <Wallet :size="28" class="text-success" />
          </div>
          <div>
            <p class="text-base text-muted-foreground">预估总收入</p>
            <p class="text-4xl font-bold text-success">¥{{ volunteerEarnings.net.toFixed(0) }}</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 pt-4 border-t border-success/20">
          <div class="text-center">
            <p class="text-2xl font-bold text-foreground">{{ volunteerEarnings.totalHours }}</p>
            <p class="text-sm text-muted-foreground">总工时(h)</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-foreground">¥{{ volunteerEarnings.hourlyRate }}</p>
            <p class="text-sm text-muted-foreground">时薪</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-foreground">¥{{ volunteerEarnings.gross.toFixed(0) }}</p>
            <p class="text-sm text-muted-foreground">毛收入</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 计算说明 -->
    <div class="px-4 mt-4">
      <div class="card-warm bg-trust/5 border border-trust/20">
        <div class="flex items-start gap-3">
          <Info :size="24" class="text-trust flex-shrink-0 mt-0.5" />
          <div>
            <h4 class="font-semibold text-trust mb-1">薪酬计算说明</h4>
            <p class="text-base text-muted-foreground">
              净收入 = 总工时 × 时薪 - 12%平台管理费
            </p>
            <p class="text-base text-muted-foreground mt-1">
              当前: {{ volunteerEarnings.totalHours }}h × ¥{{ volunteerEarnings.hourlyRate }} - ¥{{ volunteerEarnings.platformFee.toFixed(0) }}(12%) = ¥{{ volunteerEarnings.net.toFixed(0) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 收入明细 -->
    <div class="px-4 mt-6">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <TrendingUp :size="24" class="text-primary" />
        月度收入明细
      </h2>
      
      <div class="space-y-3">
        <div 
          v-for="item in incomeDetails" 
          :key="item.month"
          class="card-warm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-semibold text-foreground">{{ item.month }}</p>
              <p class="text-base text-muted-foreground flex items-center gap-2">
                <Clock :size="16" />
                {{ item.hours }}小时
              </p>
            </div>
            <div class="text-right">
              <p class="text-xl font-bold text-success">+¥{{ item.net.toFixed(0) }}</p>
              <p class="text-sm text-muted-foreground">
                毛收入¥{{ item.amount }} - 管理费¥{{ item.fee.toFixed(0) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近完成订单 -->
    <div class="px-4 mt-6">
      <h2 class="text-xl font-bold mb-4">最近完成订单</h2>
      
      <div v-if="myCompletedOrders.length === 0" class="card-warm text-center py-8">
        <p class="text-lg text-muted-foreground">暂无已完成订单</p>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="order in myCompletedOrders.slice(0, 5)" 
          :key="order.id"
          class="card-warm flex items-center justify-between"
        >
          <div>
            <p class="font-semibold text-foreground">{{ order.serviceName }}</p>
            <p class="text-sm text-muted-foreground">{{ order.userName }} · {{ order.completedAt?.split('T')[0] }}</p>
          </div>
          <div class="text-right">
            <p class="font-bold text-success">+¥{{ ((order.duration || 60) / 60 * currentVolunteer.hourlyRate * 0.88).toFixed(0) }}</p>
            <p class="text-sm text-muted-foreground">{{ order.duration }}分钟</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 提现入口 -->
    <div class="px-4 mt-6">
      <button class="card-warm w-full flex items-center justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet :size="24" class="text-primary" />
          </div>
          <div>
            <p class="text-lg font-semibold text-foreground">申请提现</p>
            <p class="text-sm text-muted-foreground">每月15日统一发放</p>
          </div>
        </div>
        <ChevronRight :size="24" class="text-muted-foreground" />
      </button>
    </div>
  </div>
</template>
