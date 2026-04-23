<script setup lang="ts">
import { ref, provide } from 'vue'

// 当前视图模式
const currentView = ref<'user' | 'volunteer' | 'admin'>('user')

// 用户账户冻结状态 (用于演示)
const isUserFrozen = ref(false)

// 提供给子组件使用
provide('currentView', currentView)
provide('isUserFrozen', isUserFrozen)
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部角色切换导航 -->
    <div class="sticky top-0 z-50 bg-card border-b-2 border-border">
      <div class="flex items-center justify-center gap-2 p-3">
        <button
          v-for="view in [
            { key: 'user', label: '用户端', icon: '👤' },
            { key: 'volunteer', label: '志愿者端', icon: '🤝' },
            { key: 'admin', label: '管理后台', icon: '⚙️' }
          ]"
          :key="view.key"
          @click="currentView = view.key as 'user' | 'volunteer' | 'admin'"
          :class="[
            'flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-semibold transition-all',
            currentView === view.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          ]"
        >
          <span class="text-xl">{{ view.icon }}</span>
          <span>{{ view.label }}</span>
        </button>
      </div>
      
      <!-- 演示控制：冻结用户切换 -->
      <div v-if="currentView === 'user'" class="flex items-center justify-center gap-4 pb-3 px-4">
        <label class="flex items-center gap-3 text-base text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            v-model="isUserFrozen"
            class="w-5 h-5 accent-destructive"
          />
          <span>演示模式：冻结用户账户</span>
        </label>
      </div>
    </div>

    <!-- 内容区域 -->
    <RouterView />
  </div>
</template>
