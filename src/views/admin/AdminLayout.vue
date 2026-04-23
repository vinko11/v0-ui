<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  UserCog,
  FileText,
  PlusCircle,
  Settings
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const menuItems = [
  { path: '/admin/dashboard', label: '数据概览', icon: LayoutDashboard },
  { path: '/admin/review', label: '志愿者审核', icon: Users },
  { path: '/admin/orders', label: '订单管理', icon: ClipboardList },
  { path: '/admin/users', label: '用户管理', icon: UserCog },
  { path: '/admin/audit', label: '审计日志', icon: FileText }
]

const currentPath = computed(() => route.path)

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="min-h-screen bg-background flex">
    <!-- 侧边栏 -->
    <aside class="w-72 bg-card border-r-2 border-border flex flex-col shrink-0">
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
                'w-full flex items-center gap-4 px-5 py-4 rounded-[20px] text-lg font-medium transition-all',
                currentPath === item.path
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-secondary'
              ]"
            >
              <component :is="item.icon" :size="24" />
              <span>{{ item.label }}</span>
            </button>
          </li>
        </ul>

        <!-- 快捷操作 -->
        <div class="mt-6 pt-6 border-t border-border">
          <p class="text-sm text-muted-foreground mb-3 px-2">快捷操作</p>
          <button 
            @click="router.push('/admin/orders?action=create')"
            class="w-full flex items-center gap-4 px-5 py-4 rounded-[20px] text-lg font-medium bg-success/10 text-success hover:bg-success/20 transition-all"
          >
            <PlusCircle :size="24" />
            <span>代下单</span>
          </button>
        </div>
      </nav>

      <!-- 管理员信息 -->
      <div class="p-4 border-t border-border">
        <div class="flex items-center gap-3 p-3 rounded-[16px] bg-secondary/50">
          <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Settings :size="24" class="text-primary" />
          </div>
          <div>
            <p class="text-base font-semibold text-foreground">系统管理员</p>
            <p class="text-sm text-muted-foreground">admin@nuanxin.com</p>
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
