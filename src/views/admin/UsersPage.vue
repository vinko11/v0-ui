<script setup lang="ts">
import { computed, ref } from 'vue'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search,
  AlertTriangle,
  X
} from 'lucide-vue-next'
import { 
  userList, 
  freezeUser, 
  unfreezeUser, 
  currentUser,
  showToast 
} from '@/stores/globalStore'

// 搜索
const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value) return userList.value
  const query = searchQuery.value.toLowerCase()
  return userList.value.filter(u => 
    u.name.toLowerCase().includes(query) || 
    u.phone.includes(query)
  )
})

// 冻结弹窗
const showFreezeModal = ref(false)
const freezingUserId = ref<string | null>(null)
const freezeReason = ref('')
const freezeError = ref('')

function openFreezeModal(id: string) {
  freezingUserId.value = id
  freezeReason.value = ''
  freezeError.value = ''
  showFreezeModal.value = true
}

function confirmFreeze() {
  if (freezeReason.value.length < 5) {
    freezeError.value = '冻结原因至少需要5个字符'
    return
  }
  
  showToast('处理中...', 'loading')
  setTimeout(() => {
    freezeUser(freezingUserId.value!, freezeReason.value)
    
    // 同步更新当前用户状态（用于演示三端联动）
    if (freezingUserId.value === currentUser.value.id) {
      currentUser.value.status = 'FROZEN'
      currentUser.value.freezeReason = freezeReason.value
    }
    
    showToast('用户已冻结', 'success')
    showFreezeModal.value = false
    freezingUserId.value = null
    freezeReason.value = ''
  }, 800)
}

function handleUnfreeze(id: string) {
  showToast('处理中...', 'loading')
  setTimeout(() => {
    unfreezeUser(id)
    
    // 同步更新当前用户状态
    if (id === currentUser.value.id) {
      currentUser.value.status = 'ACTIVE'
      currentUser.value.freezeReason = undefined
    }
    
    showToast('用户已解冻', 'success')
  }, 500)
}

const activeCount = computed(() => userList.value.filter(u => u.status === 'ACTIVE').length)
const frozenCount = computed(() => userList.value.filter(u => u.status === 'FROZEN').length)
</script>

<template>
  <div class="p-8">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground flex items-center gap-3">
        <Users :size="32" class="text-primary" />
        用户管理
      </h1>
      <p class="text-lg text-muted-foreground mt-2">
        管理平台用户，进行风控拦截操作
      </p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-3 gap-6 mb-8">
      <div class="card-warm">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center">
            <Users :size="28" class="text-primary" />
          </div>
          <div>
            <p class="text-lg text-muted-foreground">总用户数</p>
            <p class="text-4xl font-bold text-primary">{{ userList.length }}</p>
          </div>
        </div>
      </div>
      <div class="card-warm">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-[20px] bg-success/10 flex items-center justify-center">
            <UserCheck :size="28" class="text-success" />
          </div>
          <div>
            <p class="text-lg text-muted-foreground">正常用户</p>
            <p class="text-4xl font-bold text-success">{{ activeCount }}</p>
          </div>
        </div>
      </div>
      <div class="card-warm">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-[20px] bg-destructive/10 flex items-center justify-center">
            <UserX :size="28" class="text-destructive" />
          </div>
          <div>
            <p class="text-lg text-muted-foreground">已冻结</p>
            <p class="text-4xl font-bold text-destructive">{{ frozenCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <Search :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="搜索用户名或手机号"
          class="w-full pl-12 pr-4 py-3 text-lg rounded-[16px] border-2 border-border bg-card focus:border-primary outline-none"
        />
      </div>
    </div>

    <!-- 风控提示 -->
    <div class="card-warm bg-warning/5 border border-warning/20 mb-6">
      <div class="flex items-start gap-3">
        <AlertTriangle :size="24" class="text-warning flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="font-semibold text-warning mb-1">风控拦截说明</h4>
          <p class="text-base text-muted-foreground">
            冻结用户后，该用户在用户端提交订单时将触发全屏模态框拦截，提示"账号异常，请联系社区网格员"。
          </p>
        </div>
      </div>
    </div>

    <!-- 用户表格 -->
    <div class="bg-card rounded-[24px] border border-border overflow-hidden shadow-sm">
      <table class="w-full">
        <thead class="bg-muted">
          <tr>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">用户名</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">联系电话</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">注册日期</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">订单数</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">状态</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="border-t border-border hover:bg-muted/50 transition-colors"
          >
            <td class="px-6 py-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="font-bold text-primary">{{ user.name.charAt(0) }}</span>
                </div>
                <span class="text-lg font-medium text-foreground">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-6 py-5 text-lg text-foreground">{{ user.phone }}</td>
            <td class="px-6 py-5 text-lg text-muted-foreground">{{ user.createdAt }}</td>
            <td class="px-6 py-5 text-lg text-foreground">{{ user.totalOrders }}</td>
            <td class="px-6 py-5">
              <span
                :class="[
                  'px-4 py-2 rounded-full text-base font-semibold',
                  user.status === 'ACTIVE' 
                    ? 'bg-success/20 text-success' 
                    : 'bg-destructive/20 text-destructive'
                ]"
              >
                {{ user.status === 'ACTIVE' ? '正常' : '已冻结' }}
              </span>
              <div v-if="user.freezeReason" class="mt-2">
                <p class="text-sm text-destructive">原因：{{ user.freezeReason }}</p>
                <p class="text-sm text-muted-foreground">冻结于：{{ user.freezeAt?.split('T')[0] }}</p>
              </div>
            </td>
            <td class="px-6 py-5">
              <button
                v-if="user.status === 'ACTIVE'"
                @click="openFreezeModal(user.id)"
                class="px-5 py-3 bg-destructive text-destructive-foreground rounded-[12px] text-base font-semibold hover:opacity-90 transition-opacity"
              >
                冻结
              </button>
              <button
                v-else
                @click="handleUnfreeze(user.id)"
                class="px-5 py-3 bg-success text-success-foreground rounded-[12px] text-base font-semibold hover:opacity-90 transition-opacity"
              >
                解冻
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 冻结原因弹窗 -->
    <Teleport to="body">
      <div
        v-if="showFreezeModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-card rounded-[32px] p-8 w-full max-w-md">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-destructive flex items-center gap-2">
              <UserX :size="28" />
              冻结账户
            </h3>
            <button 
              @click="showFreezeModal = false"
              class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
            >
              <X :size="24" />
            </button>
          </div>
          
          <p class="text-lg text-muted-foreground mb-4">
            冻结后，该用户将无法提交新订单。请说明冻结原因（至少5个字符）
          </p>
          
          <textarea
            v-model="freezeReason"
            rows="3"
            placeholder="请输入冻结原因..."
            class="w-full p-4 text-lg border-2 border-border rounded-[16px] bg-background focus:border-destructive focus:outline-none placeholder:text-muted-foreground resize-none"
          ></textarea>
          
          <p v-if="freezeError" class="text-destructive mt-2 text-base font-medium">{{ freezeError }}</p>
          
          <div class="flex gap-4 mt-6">
            <button
              @click="showFreezeModal = false"
              class="btn-elder-secondary flex-1"
            >
              取消
            </button>
            <button
              @click="confirmFreeze"
              class="btn-elder-destructive flex-1"
            >
              确认冻结
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
