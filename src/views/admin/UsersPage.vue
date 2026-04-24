<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: string
  name: string
  phone: string
  community: string
  registerDate: string
  orderCount: number
  status: 'active' | 'frozen'
  freezeReason?: string
  freezeDate?: string
}

const users = ref<User[]>([
  {
    id: '1',
    name: '王奶奶',
    phone: '138****8888',
    community: '朝阳区XX社区',
    registerDate: '2024-01-15',
    orderCount: 12,
    status: 'active'
  },
  {
    id: '2',
    name: '李爷爷',
    phone: '139****9999',
    community: '海淀区YY社区',
    registerDate: '2024-02-20',
    orderCount: 8,
    status: 'active'
  },
  {
    id: '3',
    name: '张阿姨',
    phone: '137****7777',
    community: '西城区ZZ社区',
    registerDate: '2024-03-10',
    orderCount: 5,
    status: 'frozen',
    freezeReason: '多次恶意取消订单',
    freezeDate: '2024-04-18'
  },
  {
    id: '4',
    name: '刘叔叔',
    phone: '136****6666',
    community: '东城区AA社区',
    registerDate: '2024-03-25',
    orderCount: 3,
    status: 'active'
  }
])

// 冻结弹窗
const showFreezeModal = ref(false)
const freezingUserId = ref<string | null>(null)
const freezeReason = ref('')
const freezeError = ref('')

const openFreezeModal = (id: string) => {
  freezingUserId.value = id
  freezeReason.value = ''
  freezeError.value = ''
  showFreezeModal.value = true
}

const confirmFreeze = () => {
  if (freezeReason.value.length < 5) {
    freezeError.value = '冻结原因至少需要5个字符'
    return
  }
  
  const user = users.value.find(u => u.id === freezingUserId.value)
  if (user) {
    user.status = 'frozen'
    user.freezeReason = freezeReason.value
    user.freezeDate = new Date().toISOString().split('T')[0]
  }
  
  showFreezeModal.value = false
  freezingUserId.value = null
  freezeReason.value = ''
}

const unfreezeUser = (id: string) => {
  const user = users.value.find(u => u.id === id)
  if (user) {
    user.status = 'active'
    user.freezeReason = undefined
    user.freezeDate = undefined
  }
}

const getStatusClass = (status: string) => {
  return status === 'active' 
    ? 'bg-success/20 text-success' 
    : 'bg-destructive/20 text-destructive'
}

const getStatusLabel = (status: string) => {
  return status === 'active' ? '正常' : '已冻结'
}
</script>

<template>
  <div class="p-8">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground">用户管理</h1>
      <p class="text-lg text-muted-foreground mt-2">
        管理平台用户，当前共 {{ users.length }} 位用户
      </p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-3 gap-6 mb-8">
      <div class="bg-card rounded-xl p-6 border border-border">
        <p class="text-lg text-muted-foreground">总用户数</p>
        <p class="text-4xl font-bold text-primary mt-2">
          {{ users.length }}
        </p>
      </div>
      <div class="bg-card rounded-xl p-6 border border-border">
        <p class="text-lg text-muted-foreground">正常用户</p>
        <p class="text-4xl font-bold text-success mt-2">
          {{ users.filter(u => u.status === 'active').length }}
        </p>
      </div>
      <div class="bg-card rounded-xl p-6 border border-border">
        <p class="text-lg text-muted-foreground">已冻结</p>
        <p class="text-4xl font-bold text-destructive mt-2">
          {{ users.filter(u => u.status === 'frozen').length }}
        </p>
      </div>
    </div>

    <!-- 用户表格 -->
    <div class="bg-card rounded-xl border border-border overflow-hidden">
      <table class="w-full">
        <thead class="bg-muted">
          <tr>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">用户名</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">联系电话</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">所属社区</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">注册日期</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">订单数</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">状态</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-t border-border hover:bg-muted/50 transition-colors"
          >
            <td class="px-6 py-5 text-lg text-foreground font-medium">{{ user.name }}</td>
            <td class="px-6 py-5 text-lg text-foreground">{{ user.phone }}</td>
            <td class="px-6 py-5 text-lg text-foreground">{{ user.community }}</td>
            <td class="px-6 py-5 text-lg text-muted-foreground">{{ user.registerDate }}</td>
            <td class="px-6 py-5 text-lg text-foreground">{{ user.orderCount }}</td>
            <td class="px-6 py-5">
              <span
                :class="[
                  'px-3 py-1 rounded-lg text-base font-medium',
                  getStatusClass(user.status)
                ]"
              >
                {{ getStatusLabel(user.status) }}
              </span>
              <div v-if="user.freezeReason" class="mt-1">
                <p class="text-sm text-destructive">原因：{{ user.freezeReason }}</p>
                <p class="text-sm text-muted-foreground">冻结于：{{ user.freezeDate }}</p>
              </div>
            </td>
            <td class="px-6 py-5">
              <button
                v-if="user.status === 'active'"
                @click="openFreezeModal(user.id)"
                class="px-5 py-2 bg-destructive text-destructive-foreground rounded-lg text-base font-medium hover:opacity-90 transition-opacity"
              >
                冻结
              </button>
              <button
                v-else
                @click="unfreezeUser(user.id)"
                class="px-5 py-2 bg-success text-success-foreground rounded-lg text-base font-medium hover:opacity-90 transition-opacity"
              >
                解冻
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 冻结原因弹窗 -->
    <div
      v-if="showFreezeModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-card rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-2xl font-bold text-foreground mb-4">冻结账户</h3>
        <p class="text-lg text-muted-foreground mb-4">请说明冻结此用户的原因（至少5个字符）</p>
        
        <textarea
          v-model="freezeReason"
          rows="3"
          placeholder="请输入冻结原因..."
          class="w-full p-4 text-lg border-2 border-border rounded-xl bg-background focus:border-primary focus:outline-none placeholder:text-muted-foreground resize-none"
        ></textarea>
        
        <p v-if="freezeError" class="text-destructive mt-2 text-base">{{ freezeError }}</p>
        
        <div class="flex gap-3 mt-6">
          <button
            @click="showFreezeModal = false"
            class="flex-1 py-3 text-lg font-semibold rounded-xl bg-secondary text-secondary-foreground"
          >
            取消
          </button>
          <button
            @click="confirmFreeze"
            class="flex-1 py-3 text-lg font-semibold rounded-xl bg-destructive text-destructive-foreground"
          >
            确认冻结
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
