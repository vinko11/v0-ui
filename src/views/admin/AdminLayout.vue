<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface MenuItem {
  path: string
  label: string
  icon: string
}

const menuItems = ref<MenuItem[]>([
  { path: '/admin/dashboard', label: '数据概览', icon: '📊' },
  { path: '/admin/review', label: '志愿者审核', icon: '👥' },
  { path: '/admin/orders', label: '订单管理', icon: '📋' },
  { path: '/admin/users', label: '用户管理', icon: '👤' },
  { path: '/admin/audit', label: '审计日志', icon: '📝' }
])

const currentPath = computed(() => route.path)

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="min-h-screen bg-background flex">
    <!-- 侧边栏 -->
    <aside class="w-64 bg-card border-r border-border flex flex-col shrink-0">
      <!-- Logo 区域 -->
      <div class="p-6 border-b border-border">
        <h1 class="text-2xl font-bold text-primary">暖心相伴</h1>
        <p class="text-base text-muted-foreground mt-1">管理后台</p>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 p-4">
        <ul class="flex flex-col gap-2">
          <li v-for="item in menuItems" :key="item.path">
            <button
              @click="navigateTo(item.path)"
              :class="[
                'w-full flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium transition-all',
                currentPath === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              ]"
            >
              <span class="text-xl">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- 管理员信息 -->
      <div class="p-4 border-t border-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            👤
          </div>
          <div>
            <p class="text-base font-medium text-foreground">管理员</p>
            <p class="text-sm text-muted-foreground">admin@example.com</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>
