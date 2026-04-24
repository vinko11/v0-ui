<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGlobalStore } from './store/globalStore'
import { User, Users, Settings, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const store = useGlobalStore()

// 视图配置
const views = [
  { key: 'user', label: '用户端 U', icon: User, path: '/' },
  { key: 'volunteer', label: '志愿者端 V', icon: Users, path: '/volunteer' },
  { key: 'admin', label: '平台端 P', icon: Settings, path: '/admin' }
]

// 当前视图
const currentView = computed(() => store.state.currentRole)

// 切换视图
function switchView(view: 'user' | 'volunteer' | 'admin', path: string) {
  store.setRole(view)
  router.push(path)
}

// 监听路由变化同步状态
watch(() => route.path, (path) => {
  if (path.startsWith('/volunteer')) {
    store.setRole('volunteer')
  } else if (path.startsWith('/admin')) {
    store.setRole('admin')
  } else {
    store.setRole('user')
  }
}, { immediate: true })

// Toast图标
const toastIcon = computed(() => {
  switch (store.state.toast.type) {
    case 'success': return CheckCircle
    case 'error': return AlertCircle
    case 'loading': return Loader2
    default: return CheckCircle
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部角色切换导航 -->
    <div class="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div class="flex items-center justify-center gap-3 p-4">
        <button
          v-for="view in views"
          :key="view.key"
          @click="switchView(view.key as 'user' | 'volunteer' | 'admin', view.path)"
          :class="[
            'flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-lg font-semibold transition-all duration-200',
            currentView === view.key
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          ]"
        >
          <component :is="view.icon" :size="22" :stroke-width="2.5" />
          <span>{{ view.label }}</span>
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <RouterView />

    <!-- 全局Toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="store.state.toast.show"
          class="fixed top-24 left-1/2 -translate-x-1/2 z-[100] toast-animate"
        >
          <div
            :class="[
              'flex items-center gap-3 px-6 py-4 rounded-[1.5rem] shadow-lg text-lg font-medium',
              store.state.toast.type === 'success' ? 'bg-success text-success-foreground' :
              store.state.toast.type === 'error' ? 'bg-destructive text-destructive-foreground' :
              'bg-card text-card-foreground border border-border'
            ]"
          >
            <component
              :is="toastIcon"
              :size="24"
              :class="{ 'animate-spin': store.state.toast.type === 'loading' }"
            />
            <span>{{ store.state.toast.message }}</span>
            <button
              v-if="store.state.toast.type !== 'loading'"
              @click="store.hideToast()"
              class="ml-2 p-1 rounded-full hover:bg-white/20"
            >
              <X :size="18" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
