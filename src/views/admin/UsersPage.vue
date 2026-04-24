<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGlobalStore } from '../../store/globalStore'
import {
  Users,
  UserCheck,
  UserX,
  X,
  AlertTriangle,
  Plus,
  Link,
  Copy,
  CheckCircle
} from 'lucide-vue-next'

const store = useGlobalStore()

// 用户列表
const users = computed(() => store.state.users)

// 冻结弹窗
const showFreezeModal = ref(false)
const freezingUserId = ref<string | null>(null)
const freezeReason = ref('')
const freezeError = ref('')

// 代下单弹窗
const showProxyOrderModal = ref(false)
const proxyOrder = ref({
  userId: '',
  serviceType: 'chat',
  volunteerId: '',
  date: '',
  time: '',
  address: '',
  notes: ''
})
const proxyOrderLink = ref('')

// 打开冻结弹窗
function openFreezeModal(id: string) {
  freezingUserId.value = id
  freezeReason.value = ''
  freezeError.value = ''
  showFreezeModal.value = true
}

// 确认冻结
function confirmFreeze() {
  if (freezeReason.value.length < 5) {
    freezeError.value = '冻结原因至少需要5个字符'
    return
  }
  
  store.showToast('处理中...', 'loading')
  setTimeout(() => {
    store.toggleUserFreeze(freezingUserId.value!, true, freezeReason.value)
    store.showToast('用户已冻结', 'success')
    showFreezeModal.value = false
  }, 500)
}

// 解冻用户
function unfreezeUser(id: string) {
  store.showToast('处理中...', 'loading')
  setTimeout(() => {
    store.toggleUserFreeze(id, false)
    store.showToast('用户已解冻', 'success')
  }, 500)
}

// 代下单
function openProxyOrderModal() {
  proxyOrder.value = {
    userId: users.value[0]?.id || '',
    serviceType: 'chat',
    volunteerId: store.state.volunteers.find(v => v.status === 'APPROVED')?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    address: '',
    notes: ''
  }
  proxyOrderLink.value = ''
  showProxyOrderModal.value = true
}

// 生成代下单链接
function generateProxyOrderLink() {
  const user = users.value.find(u => u.id === proxyOrder.value.userId)
  const volunteer = store.state.volunteers.find(v => v.id === proxyOrder.value.volunteerId)
  
  if (!user || !volunteer || !proxyOrder.value.address) {
    store.showToast('请填写完整信息', 'error')
    return
  }
  
  store.showToast('处理中...', 'loading')
  setTimeout(() => {
    // 生成待确认订单链接
    const orderId = `proxy_${Date.now()}`
    proxyOrderLink.value = `https://warmheart.app/confirm/${orderId}`
    store.showToast('订单链接已生成', 'success')
  }, 600)
}

// 复制链接
function copyLink() {
  navigator.clipboard.writeText(proxyOrderLink.value)
  store.showToast('链接已复制', 'success')
}

// 服务类型名称
const serviceTypeNames: Record<string, string> = {
  chat: '陪聊服务',
  medical: '就医陪同',
  shopping: '购物协助'
}
</script>

<template>
  <div class="p-8">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-foreground">用户管理</h1>
        <p class="text-lg text-muted-foreground mt-2">
          管理平台用户，当前共 {{ users.length }} 位用户
        </p>
      </div>
      <button
        @click="openProxyOrderModal"
        class="flex items-center gap-2 px-6 py-3 bg-[#FF9248] text-white rounded-[1.5rem] text-lg font-bold hover:opacity-90 transition-opacity"
      >
        <Plus :size="22" />
        代下单
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-3 gap-6 mb-8">
      <div class="bg-card rounded-[1.5rem] p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-[#FFF5EE] flex items-center justify-center">
            <Users :size="28" class="text-[#FF9248]" />
          </div>
          <div>
            <p class="text-base text-muted-foreground">总用户数</p>
            <p class="text-3xl font-bold text-foreground">{{ users.length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-card rounded-[1.5rem] p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
            <UserCheck :size="28" class="text-[#22C55E]" />
          </div>
          <div>
            <p class="text-base text-muted-foreground">正常用户</p>
            <p class="text-3xl font-bold text-[#22C55E]">
              {{ users.filter(u => u.status === 'ACTIVE').length }}
            </p>
          </div>
        </div>
      </div>
      <div class="bg-card rounded-[1.5rem] p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center">
            <UserX :size="28" class="text-destructive" />
          </div>
          <div>
            <p class="text-base text-muted-foreground">已冻结</p>
            <p class="text-3xl font-bold text-destructive">
              {{ users.filter(u => u.status === 'FROZEN').length }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户表格 -->
    <div class="bg-card rounded-[1.5rem] shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-muted">
          <tr>
            <th class="px-6 py-4 text-left text-base font-semibold text-foreground">用户名</th>
            <th class="px-6 py-4 text-left text-base font-semibold text-foreground">联系电话</th>
            <th class="px-6 py-4 text-left text-base font-semibold text-foreground">注册日期</th>
            <th class="px-6 py-4 text-left text-base font-semibold text-foreground">服务次数</th>
            <th class="px-6 py-4 text-left text-base font-semibold text-foreground">状态</th>
            <th class="px-6 py-4 text-left text-base font-semibold text-foreground">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-t border-border hover:bg-muted/50 transition-colors"
          >
            <td class="px-6 py-5 text-base text-foreground font-medium">{{ user.name }}</td>
            <td class="px-6 py-5 text-base text-foreground">{{ user.phone }}</td>
            <td class="px-6 py-5 text-base text-muted-foreground">{{ user.createdAt }}</td>
            <td class="px-6 py-5 text-base text-foreground">{{ user.serviceCount }}</td>
            <td class="px-6 py-5">
              <span
                :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium',
                  user.status === 'ACTIVE' 
                    ? 'bg-[#F0FDF4] text-[#22C55E]' 
                    : 'bg-destructive/10 text-destructive'
                ]"
              >
                {{ user.status === 'ACTIVE' ? '正常' : '已冻结' }}
              </span>
              <div v-if="user.frozenReason" class="mt-2">
                <p class="text-sm text-destructive">原因：{{ user.frozenReason }}</p>
                <p class="text-xs text-muted-foreground">{{ user.frozenAt }}</p>
              </div>
            </td>
            <td class="px-6 py-5">
              <button
                v-if="user.status === 'ACTIVE'"
                @click="openFreezeModal(user.id)"
                class="px-5 py-2.5 bg-destructive text-white rounded-xl text-base font-medium hover:opacity-90 transition-opacity"
              >
                冻结
              </button>
              <button
                v-else
                @click="unfreezeUser(user.id)"
                class="px-5 py-2.5 bg-[#22C55E] text-white rounded-xl text-base font-medium hover:opacity-90 transition-opacity"
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
      <Transition name="modal">
        <div
          v-if="showFreezeModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          @click.self="showFreezeModal = false"
        >
          <div class="bg-card rounded-[2rem] p-6 w-full max-w-md shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-foreground flex items-center gap-2">
                <AlertTriangle :size="22" class="text-destructive" />
                冻结账户
              </h3>
              <button
                @click="showFreezeModal = false"
                class="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              >
                <X :size="20" />
              </button>
            </div>
            
            <p class="text-base text-muted-foreground mb-4">
              冻结后该用户将无法使用服务。请说明冻结原因（至少5个字符）。
            </p>
            
            <textarea
              v-model="freezeReason"
              rows="3"
              placeholder="请输入冻结原因..."
              class="w-full p-4 text-base border-2 border-border rounded-[1.5rem] bg-background focus:border-destructive focus:outline-none placeholder:text-muted-foreground resize-none"
            />
            
            <p v-if="freezeError" class="text-destructive mt-2 text-base font-medium">{{ freezeError }}</p>
            
            <div class="flex gap-3 mt-6">
              <button
                @click="showFreezeModal = false"
                class="flex-1 py-3 text-base font-semibold rounded-xl bg-secondary text-foreground"
              >
                取消
              </button>
              <button
                @click="confirmFreeze"
                class="flex-1 py-3 text-base font-semibold rounded-xl bg-destructive text-white"
              >
                确认冻结
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 代下单弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showProxyOrderModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          @click.self="showProxyOrderModal = false"
        >
          <div class="bg-card rounded-[2rem] p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-foreground flex items-center gap-2">
                <Plus :size="22" class="text-[#FF9248]" />
                代下单
              </h3>
              <button
                @click="showProxyOrderModal = false"
                class="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              >
                <X :size="20" />
              </button>
            </div>
            
            <div class="space-y-4">
              <!-- 选择用户 -->
              <div>
                <label class="block text-base font-medium text-foreground mb-2">选择用户</label>
                <select
                  v-model="proxyOrder.userId"
                  class="w-full p-4 text-base border-2 border-border rounded-xl bg-background focus:border-[#FF9248] focus:outline-none"
                >
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }} ({{ user.phone }})
                  </option>
                </select>
              </div>

              <!-- 选择服务 -->
              <div>
                <label class="block text-base font-medium text-foreground mb-2">服务类型</label>
                <select
                  v-model="proxyOrder.serviceType"
                  class="w-full p-4 text-base border-2 border-border rounded-xl bg-background focus:border-[#FF9248] focus:outline-none"
                >
                  <option value="chat">陪聊服务</option>
                  <option value="medical">就医陪同</option>
                  <option value="shopping">购物协助</option>
                </select>
              </div>

              <!-- 选择志愿者 -->
              <div>
                <label class="block text-base font-medium text-foreground mb-2">指定志愿者</label>
                <select
                  v-model="proxyOrder.volunteerId"
                  class="w-full p-4 text-base border-2 border-border rounded-xl bg-background focus:border-[#FF9248] focus:outline-none"
                >
                  <option 
                    v-for="v in store.state.volunteers.filter(v => v.status === 'APPROVED')" 
                    :key="v.id" 
                    :value="v.id"
                  >
                    {{ v.name }} ({{ v.rating }}分)
                  </option>
                </select>
              </div>

              <!-- 日期和时间 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-base font-medium text-foreground mb-2">日期</label>
                  <input
                    v-model="proxyOrder.date"
                    type="date"
                    class="w-full p-4 text-base border-2 border-border rounded-xl bg-background focus:border-[#FF9248] focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block text-base font-medium text-foreground mb-2">时间</label>
                  <input
                    v-model="proxyOrder.time"
                    type="time"
                    class="w-full p-4 text-base border-2 border-border rounded-xl bg-background focus:border-[#FF9248] focus:outline-none"
                  />
                </div>
              </div>

              <!-- 地址 -->
              <div>
                <label class="block text-base font-medium text-foreground mb-2">服务地址</label>
                <input
                  v-model="proxyOrder.address"
                  type="text"
                  placeholder="请输入详细地址"
                  class="w-full p-4 text-base border-2 border-border rounded-xl bg-background focus:border-[#FF9248] focus:outline-none"
                />
              </div>

              <!-- 备注 -->
              <div>
                <label class="block text-base font-medium text-foreground mb-2">备注（可选）</label>
                <textarea
                  v-model="proxyOrder.notes"
                  rows="2"
                  placeholder="服务备注信息"
                  class="w-full p-4 text-base border-2 border-border rounded-xl bg-background focus:border-[#FF9248] focus:outline-none resize-none"
                />
              </div>
            </div>

            <!-- 生成的链接 -->
            <div v-if="proxyOrderLink" class="mt-6 p-4 bg-[#F0FDF4] rounded-xl border border-[#22C55E]/30">
              <div class="flex items-center gap-2 mb-2">
                <CheckCircle :size="20" class="text-[#22C55E]" />
                <span class="text-base font-medium text-foreground">订单链接已生成</span>
              </div>
              <div class="flex items-center gap-2">
                <input
                  :value="proxyOrderLink"
                  readonly
                  class="flex-1 p-3 text-sm bg-white rounded-lg border border-border"
                />
                <button
                  @click="copyLink"
                  class="p-3 bg-[#22C55E] text-white rounded-lg"
                >
                  <Copy :size="20" />
                </button>
              </div>
              <p class="text-sm text-muted-foreground mt-2">
                将此链接发送给用户，用户确认后订单将生效
              </p>
            </div>
            
            <button
              @click="generateProxyOrderLink"
              class="w-full mt-6 py-4 text-lg font-bold rounded-xl bg-[#FF9248] text-white flex items-center justify-center gap-2"
            >
              <Link :size="22" />
              生成待确认订单链接
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
