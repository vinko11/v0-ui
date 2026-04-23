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
  { path: '/admin/review', label: '志愿者审核', icon: '👥' },
  { path: '/admin/orders', label: '订单管理', icon: '📋' }
])

const currentPath = computed(() => route.path)

const navigateTo = (path: string) => {
  router.push(path)
}

const goHome = () => {
  router.push('/')
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

      <!-- 底部返回按钮 -->
      <div class="p-4 border-t border-border">
        <button
          @click="goHome"
          class="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-lg text-muted-foreground hover:bg-secondary transition-all"
        >
          <span class="text-xl">🏠</span>
          <span>返回首页</span>
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>
