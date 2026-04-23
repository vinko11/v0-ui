<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  XCircle,
  Play,
  Search,
  PlusCircle,
  MessageCircle,
  Stethoscope,
  ShoppingBag,
  X,
  Copy,
  Link
} from 'lucide-vue-next'
import { orderList, volunteerList, showToast } from '@/stores/globalStore'

const route = useRoute()

// 检查是否需要打开代下单弹窗
const showCreateModal = ref(route.query.action === 'create')

// 搜索和筛选
const searchQuery = ref('')
const statusFilter = ref('all')

const serviceIcons: Record<string, any> = {
  'chat': MessageCircle,
  'hospital': Stethoscope,
  'shopping': ShoppingBag
}

const filteredOrders = computed(() => {
  let result = orderList.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(o => 
      o.userName.toLowerCase().includes(query) || 
      o.id.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value !== 'all') {
    result = result.filter(o => o.status === statusFilter.value)
  }
  
  return result
})

const statusCounts = computed(() => ({
  pending: orderList.value.filter(o => o.status === 'PENDING').length,
  accepted: orderList.value.filter(o => o.status === 'ACCEPTED').length,
  inProgress: orderList.value.filter(o => o.status === 'IN_PROGRESS').length,
  completed: orderList.value.filter(o => o.status === 'COMPLETED').length
}))

// 代下单表单
const createForm = ref({
  serviceType: 'chat',
  volunteerId: '',
  userName: '',
  userPhone: '',
  address: '',
  date: '',
  time: '',
  notes: ''
})

const generatedLink = ref('')

function submitCreateOrder() {
  if (!createForm.value.userName || !createForm.value.address || !createForm.value.date) {
    showToast('请填写完整信息', 'error')
    return
  }
  
  showToast('处理中...', 'loading')
  
  setTimeout(() => {
    // 生成订单链接
    const orderId = `ADM${Date.now().toString(36).toUpperCase()}`
    generatedLink.value = `https://nuanxin.app/confirm/${orderId}`
    showToast('订单已创建，请分享确认链接', 'success')
  }, 800)
}

function copyLink() {
  navigator.clipboard.writeText(generatedLink.value)
  showToast('链接已复制', 'success')
}

function closeModal() {
  showCreateModal.value = false
  generatedLink.value = ''
  createForm.value = {
    serviceType: 'chat',
    volunteerId: '',
    userName: '',
    userPhone: '',
    address: '',
    date: '',
    time: '',
    notes: ''
  }
}

const approvedVolunteers = computed(() => 
  volunteerList.value.filter(v => v.status === 'APPROVED')
)

function getStatusClass(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-success/20 text-success'
    case 'IN_PROGRESS':
      return 'bg-primary/20 text-primary'
    case 'ACCEPTED':
      return 'bg-accent/20 text-accent-foreground'
    case 'CANCELLED':
      return 'bg-destructive/20 text-destructive'
    default:
      return 'bg-warning/20 text-warning'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'COMPLETED':
      return '已完成'
    case 'IN_PROGRESS':
      return '服务中'
    case 'ACCEPTED':
      return '已接单'
    case 'CANCELLED':
      return '已取消'
    default:
      return '待接单'
  }
}
</script>

<template>
  <div class="p-8">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-foreground flex items-center gap-3">
          <ClipboardList :size="32" class="text-primary" />
          订单管理
        </h1>
        <p class="text-lg text-muted-foreground mt-2">
          查看和管理所有服务订单
        </p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="btn-elder-primary flex items-center gap-2"
      >
        <PlusCircle :size="24" />
        代下单
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-4 gap-6 mb-8">
      <div class="card-warm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-[16px] bg-warning/10 flex items-center justify-center">
            <Clock :size="24" class="text-warning" />
          </div>
          <div>
            <p class="text-base text-muted-foreground">待接单</p>
            <p class="text-3xl font-bold text-warning">{{ statusCounts.pending }}</p>
          </div>
        </div>
      </div>
      <div class="card-warm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-[16px] bg-primary/10 flex items-center justify-center">
            <Play :size="24" class="text-primary" />
          </div>
          <div>
            <p class="text-base text-muted-foreground">服务中</p>
            <p class="text-3xl font-bold text-primary">{{ statusCounts.inProgress }}</p>
          </div>
        </div>
      </div>
      <div class="card-warm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-[16px] bg-success/10 flex items-center justify-center">
            <CheckCircle :size="24" class="text-success" />
          </div>
          <div>
            <p class="text-base text-muted-foreground">已完成</p>
            <p class="text-3xl font-bold text-success">{{ statusCounts.completed }}</p>
          </div>
        </div>
      </div>
      <div class="card-warm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-[16px] bg-muted flex items-center justify-center">
            <XCircle :size="24" class="text-muted-foreground" />
          </div>
          <div>
            <p class="text-base text-muted-foreground">已接单</p>
            <p class="text-3xl font-bold text-foreground">{{ statusCounts.accepted }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="flex gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <Search :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="搜索订单号或用户名"
          class="w-full pl-12 pr-4 py-3 text-lg rounded-[16px] border-2 border-border bg-card focus:border-primary outline-none"
        />
      </div>
      <select 
        v-model="statusFilter"
        class="px-6 py-3 text-lg rounded-[16px] border-2 border-border bg-card focus:border-primary outline-none"
      >
        <option value="all">全部状态</option>
        <option value="PENDING">待接单</option>
        <option value="ACCEPTED">已接单</option>
        <option value="IN_PROGRESS">服务中</option>
        <option value="COMPLETED">已完成</option>
      </select>
    </div>

    <!-- 订单表格 -->
    <div class="bg-card rounded-[24px] border border-border overflow-hidden shadow-sm">
      <table class="w-full">
        <thead class="bg-muted">
          <tr>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">订单编号</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">服务类型</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">用户</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">志愿者</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">预约时间</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="border-t border-border hover:bg-muted/50 transition-colors"
          >
            <td class="px-6 py-5 text-lg text-foreground font-mono">{{ order.id }}</td>
            <td class="px-6 py-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center">
                  <component :is="serviceIcons[order.serviceType]" :size="20" class="text-primary" />
                </div>
                <span class="text-lg text-foreground">{{ order.serviceName }}</span>
              </div>
            </td>
            <td class="px-6 py-5 text-lg text-foreground">{{ order.userName }}</td>
            <td class="px-6 py-5 text-lg" :class="order.volunteerName ? 'text-primary font-medium' : 'text-muted-foreground'">
              {{ order.volunteerName || '-' }}
            </td>
            <td class="px-6 py-5 text-lg text-muted-foreground">
              {{ order.scheduledDate }} {{ order.scheduledTime }}
            </td>
            <td class="px-6 py-5">
              <span
                :class="[
                  'px-4 py-2 rounded-full text-base font-semibold',
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
        共 {{ filteredOrders.length }} 条记录
      </p>
    </div>

    <!-- 代下单弹窗 -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-card rounded-[32px] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-foreground flex items-center gap-2">
              <PlusCircle :size="28" class="text-success" />
              代下单
            </h3>
            <button 
              @click="closeModal"
              class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
            >
              <X :size="24" />
            </button>
          </div>

          <template v-if="!generatedLink">
            <div class="space-y-5">
              <div>
                <label class="text-lg font-semibold text-foreground block mb-2">服务类型</label>
                <select 
                  v-model="createForm.serviceType"
                  class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none"
                >
                  <option value="chat">暖心陪聊</option>
                  <option value="hospital">就医陪同</option>
                  <option value="shopping">购物协助</option>
                </select>
              </div>

              <div>
                <label class="text-lg font-semibold text-foreground block mb-2">指定志愿者（可选）</label>
                <select 
                  v-model="createForm.volunteerId"
                  class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none"
                >
                  <option value="">系统自动匹配</option>
                  <option v-for="v in approvedVolunteers" :key="v.id" :value="v.id">
                    {{ v.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="text-lg font-semibold text-foreground block mb-2">用户姓名</label>
                <input 
                  v-model="createForm.userName"
                  type="text"
                  placeholder="请输入用户姓名"
                  class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none"
                />
              </div>

              <div>
                <label class="text-lg font-semibold text-foreground block mb-2">联系电话</label>
                <input 
                  v-model="createForm.userPhone"
                  type="tel"
                  placeholder="请输入联系电话"
                  class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none"
                />
              </div>

              <div>
                <label class="text-lg font-semibold text-foreground block mb-2">服务地址</label>
                <input 
                  v-model="createForm.address"
                  type="text"
                  placeholder="请输入详细地址"
                  class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-lg font-semibold text-foreground block mb-2">日期</label>
                  <input 
                    v-model="createForm.date"
                    type="date"
                    class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label class="text-lg font-semibold text-foreground block mb-2">时间</label>
                  <input 
                    v-model="createForm.time"
                    type="time"
                    class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label class="text-lg font-semibold text-foreground block mb-2">备注</label>
                <textarea 
                  v-model="createForm.notes"
                  rows="2"
                  placeholder="服务备注"
                  class="w-full p-4 text-lg rounded-[16px] border-2 border-border bg-background focus:border-primary outline-none resize-none"
                ></textarea>
              </div>
            </div>

            <button 
              @click="submitCreateOrder"
              class="btn-elder-success w-full mt-6"
            >
              生成订单链接
            </button>
          </template>

          <!-- 生成链接后 -->
          <template v-else>
            <div class="text-center">
              <div class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle :size="40" class="text-success" />
              </div>
              <h4 class="text-xl font-bold text-foreground mb-2">订单创建成功</h4>
              <p class="text-muted-foreground mb-6">请将以下链接分享给用户确认</p>
              
              <div class="flex items-center gap-2 p-4 bg-secondary rounded-[16px] mb-6">
                <Link :size="20" class="text-muted-foreground flex-shrink-0" />
                <span class="flex-1 text-left text-foreground truncate">{{ generatedLink }}</span>
                <button @click="copyLink" class="p-2 bg-primary text-primary-foreground rounded-[8px]">
                  <Copy :size="20" />
                </button>
              </div>

              <button 
                @click="closeModal"
                class="btn-elder-secondary w-full"
              >
                完成
              </button>
            </div>
          </template>
        </div>
      </div>
    </Teleport>
  </div>
</template>
