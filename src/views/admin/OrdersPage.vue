<script setup lang="ts">
import { ref } from 'vue'

interface Order {
  id: string
  orderId: string
  serviceType: string
  userName: string
  volunteerName: string
  address: string
  orderTime: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
}

const orders = ref<Order[]>([
  {
    id: '1',
    orderId: 'WX2024042301',
    serviceType: '陪聊服务',
    userName: '王奶奶',
    volunteerName: '张三',
    address: '朝阳区XX社区3号楼',
    orderTime: '2024-04-23 09:30',
    status: 'in_progress'
  },
  {
    id: '2',
    orderId: 'WX2024042302',
    serviceType: '就医陪同',
    userName: '李爷爷',
    volunteerName: '-',
    address: '海淀区YY社区5号楼',
    orderTime: '2024-04-23 10:00',
    status: 'pending'
  },
  {
    id: '3',
    orderId: 'WX2024042303',
    serviceType: '购物协助',
    userName: '张阿姨',
    volunteerName: '李四',
    address: '西城区ZZ社区1号楼',
    orderTime: '2024-04-23 08:45',
    status: 'completed'
  },
  {
    id: '4',
    orderId: 'WX2024042204',
    serviceType: '陪聊服务',
    userName: '刘奶奶',
    volunteerName: '王五',
    address: '东城区AA社区2号楼',
    orderTime: '2024-04-22 14:00',
    status: 'completed'
  },
  {
    id: '5',
    orderId: 'WX2024042205',
    serviceType: '就医陪同',
    userName: '赵爷爷',
    volunteerName: '-',
    address: '丰台区BB社区6号楼',
    orderTime: '2024-04-22 16:30',
    status: 'cancelled'
  }
])

const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-success/20 text-success'
    case 'in_progress':
      return 'bg-primary/20 text-primary'
    case 'accepted':
      return 'bg-accent/20 text-accent-foreground'
    case 'cancelled':
      return 'bg-destructive/20 text-destructive'
    default:
      return 'bg-warning/20 text-warning'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return '已完成'
    case 'in_progress':
      return '服务中'
    case 'accepted':
      return '已接单'
    case 'cancelled':
      return '已取消'
    default:
      return '待接单'
  }
}

const getServiceIcon = (type: string) => {
  switch (type) {
    case '陪聊服务':
      return '💬'
    case '就医陪同':
      return '🏥'
    case '购物协助':
      return '🛒'
    default:
      return '📋'
  }
}
</script>

<template>
  <div class="p-8">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground">订单管理</h1>
      <p class="text-lg text-muted-foreground mt-2">
        查看和管理所有服务订单
      </p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-4 gap-6 mb-8">
      <div class="bg-card rounded-xl p-6 border border-border">
        <p class="text-lg text-muted-foreground">待接单</p>
        <p class="text-4xl font-bold text-warning mt-2">
          {{ orders.filter(o => o.status === 'pending').length }}
        </p>
      </div>
      <div class="bg-card rounded-xl p-6 border border-border">
        <p class="text-lg text-muted-foreground">服务中</p>
        <p class="text-4xl font-bold text-primary mt-2">
          {{ orders.filter(o => o.status === 'in_progress').length }}
        </p>
      </div>
      <div class="bg-card rounded-xl p-6 border border-border">
        <p class="text-lg text-muted-foreground">已完成</p>
        <p class="text-4xl font-bold text-success mt-2">
          {{ orders.filter(o => o.status === 'completed').length }}
        </p>
      </div>
      <div class="bg-card rounded-xl p-6 border border-border">
        <p class="text-lg text-muted-foreground">已取消</p>
        <p class="text-4xl font-bold text-destructive mt-2">
          {{ orders.filter(o => o.status === 'cancelled').length }}
        </p>
      </div>
    </div>

    <!-- 订单表格 -->
    <div class="bg-card rounded-xl border border-border overflow-hidden">
      <table class="w-full">
        <thead class="bg-muted">
          <tr>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">订单编号</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">服务类型</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">用户</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">志愿者</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">服务地址</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">下单时间</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="border-t border-border hover:bg-muted/50 transition-colors"
          >
            <td class="px-6 py-5 text-lg text-foreground font-mono">{{ order.orderId }}</td>
            <td class="px-6 py-5">
              <div class="flex items-center gap-2">
                <span class="text-xl">{{ getServiceIcon(order.serviceType) }}</span>
                <span class="text-lg text-foreground">{{ order.serviceType }}</span>
              </div>
            </td>
            <td class="px-6 py-5 text-lg text-foreground">{{ order.userName }}</td>
            <td class="px-6 py-5 text-lg" :class="order.volunteerName === '-' ? 'text-muted-foreground' : 'text-primary font-medium'">
              {{ order.volunteerName }}
            </td>
            <td class="px-6 py-5 text-lg text-foreground max-w-xs truncate">{{ order.address }}</td>
            <td class="px-6 py-5 text-lg text-muted-foreground">{{ order.orderTime }}</td>
            <td class="px-6 py-5">
              <span
                :class="[
                  'px-3 py-1 rounded-lg text-base font-medium',
                  getStatusClass(order.status)
                ]"
              >
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex justify-between items-center mt-6">
      <p class="text-lg text-muted-foreground">
        共 {{ orders.length }} 条记录
      </p>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-base">
          上一页
        </button>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-base">
          1
        </button>
        <button class="px-4 py-2 bg-muted text-foreground rounded-lg text-base hover:bg-secondary">
          2
        </button>
        <button class="px-4 py-2 bg-muted text-foreground rounded-lg text-base hover:bg-secondary">
          下一页
        </button>
      </div>
    </div>
  </div>
</template>
