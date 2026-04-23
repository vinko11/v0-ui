<script setup lang="ts">
import { User, Users, Settings } from 'lucide-vue-next'
import { currentView, toast, currentUser } from './stores/globalStore'
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部身份切换导航 -->
    <div class="sticky top-0 z-50 bg-card border-b-2 border-border shadow-sm">
      <div class="flex items-center justify-center gap-3 p-4">
        <button
          v-for="view in [
            { key: 'user', label: '用户端 U', icon: User },
            { key: 'volunteer', label: '志愿者端 V', icon: Users },
            { key: 'admin', label: '平台端 P', icon: Settings }
          ]"
          :key="view.key"
          @click="currentView = view.key as 'user' | 'volunteer' | 'admin'"
          :class="[
            'flex items-center gap-3 px-6 py-4 rounded-[24px] text-lg font-bold transition-all',
            currentView === view.key
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary text-secondary-foreground hover:bg-accent'
          ]"
        >
          <component :is="view.icon" :size="24" :stroke-width="2.5" />
          <span>{{ view.label }}</span>
        </button>
      </div>
      
      <!-- 用户状态提示 -->
      <div 
        v-if="currentView === 'user' && currentUser.status === 'FROZEN'" 
        class="bg-destructive/10 border-t border-destructive/20 px-4 py-3"
      >
        <p class="text-center text-destructive font-semibold text-lg">
          账号已冻结，请联系社区网格员
        </p>
      </div>
    </div>

    <!-- 内容区域 -->
    <RouterView />

    <!-- 全局 Toast -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] toast-animate"
      >
        <div
          :class="[
            'flex items-center gap-3 px-6 py-4 rounded-[20px] shadow-lg text-lg font-semibold',
            toast.type === 'success' && 'bg-success text-success-foreground',
            toast.type === 'error' && 'bg-destructive text-destructive-foreground',
            toast.type === 'loading' && 'bg-card text-foreground border-2 border-border'
          ]"
        >
          <span v-if="toast.type === 'loading'" class="animate-spin">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </span>
          <span v-else-if="toast.type === 'success'">✓</span>
          <span v-else>✕</span>
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
