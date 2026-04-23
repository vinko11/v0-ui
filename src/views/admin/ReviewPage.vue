<script setup lang="ts">
import { ref } from 'vue'

interface Volunteer {
  id: string
  name: string
  phone: string
  idCard: string
  community: string
  submitDate: string
  status: 'pending' | 'approved' | 'rejected'
  rejectReason?: string
}

const volunteers = ref<Volunteer[]>([
  {
    id: '1',
    name: '张三',
    phone: '138****1234',
    idCard: '110***********1234',
    community: '朝阳区XX社区',
    submitDate: '2024-04-20',
    status: 'pending'
  },
  {
    id: '2',
    name: '李四',
    phone: '139****5678',
    idCard: '110***********5678',
    community: '海淀区YY社区',
    submitDate: '2024-04-21',
    status: 'pending'
  },
  {
    id: '3',
    name: '王五',
    phone: '137****9012',
    idCard: '110***********9012',
    community: '西城区ZZ社区',
    submitDate: '2024-04-19',
    status: 'approved'
  },
  {
    id: '4',
    name: '赵六',
    phone: '136****3456',
    idCard: '110***********3456',
    community: '东城区AA社区',
    submitDate: '2024-04-18',
    status: 'rejected',
    rejectReason: '身份信息不完整'
  }
])

// 拒绝弹窗
const showRejectModal = ref(false)
const rejectingId = ref<string | null>(null)
const rejectReason = ref('')
const rejectError = ref('')

const approveVolunteer = (id: string) => {
  const volunteer = volunteers.value.find(v => v.id === id)
  if (volunteer) {
    volunteer.status = 'approved'
  }
}

const openRejectModal = (id: string) => {
  rejectingId.value = id
  rejectReason.value = ''
  rejectError.value = ''
  showRejectModal.value = true
}

const confirmReject = () => {
  if (rejectReason.value.length < 5) {
    rejectError.value = '拒绝原因至少需要5个字符'
    return
  }
  
  const volunteer = volunteers.value.find(v => v.id === rejectingId.value)
  if (volunteer) {
    volunteer.status = 'rejected'
    volunteer.rejectReason = rejectReason.value
  }
  
  showRejectModal.value = false
  rejectingId.value = null
  rejectReason.value = ''
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-success/20 text-success'
    case 'rejected':
      return 'bg-destructive/20 text-destructive'
    default:
      return 'bg-warning/20 text-warning'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'approved':
      return '已通过'
    case 'rejected':
      return '已拒绝'
    default:
      return '待审核'
  }
}
</script>

<template>
  <div class="p-8">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground">志愿者审核</h1>
      <p class="text-lg text-muted-foreground mt-2">
        审核志愿者申请，共 {{ volunteers.filter(v => v.status === 'pending').length }} 条待审核
      </p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-3 gap-6 mb-8">
      <div class="bg-card rounded-xl p-6 border border-border">
        <p class="text-lg text-muted-foreground">待审核</p>
        <p class="text-4xl font-bold text-warning mt-2">
          {{ volunteers.filter(v => v.status === 'pending').length }}
        </p>
      </div>
      <div class="bg-card rounded-xl p-6 border border-border">
        <p class="text-lg text-muted-foreground">已通过</p>
        <p class="text-4xl font-bold text-success mt-2">
          {{ volunteers.filter(v => v.status === 'approved').length }}
        </p>
      </div>
      <div class="bg-card rounded-xl p-6 border border-border">
        <p class="text-lg text-muted-foreground">已拒绝</p>
        <p class="text-4xl font-bold text-destructive mt-2">
          {{ volunteers.filter(v => v.status === 'rejected').length }}
        </p>
      </div>
    </div>

    <!-- 审核表格 -->
    <div class="bg-card rounded-xl border border-border overflow-hidden">
      <table class="w-full">
        <thead class="bg-muted">
          <tr>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">姓名</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">联系电话</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">身份证号</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">所属社区</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">申请日期</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">状态</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-foreground">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="volunteer in volunteers"
            :key="volunteer.id"
            class="border-t border-border hover:bg-muted/50 transition-colors"
          >
            <td class="px-6 py-5 text-lg text-foreground font-medium">{{ volunteer.name }}</td>
            <td class="px-6 py-5 text-lg text-foreground">{{ volunteer.phone }}</td>
            <td class="px-6 py-5 text-lg text-foreground">{{ volunteer.idCard }}</td>
            <td class="px-6 py-5 text-lg text-foreground">{{ volunteer.community }}</td>
            <td class="px-6 py-5 text-lg text-muted-foreground">{{ volunteer.submitDate }}</td>
            <td class="px-6 py-5">
              <span
                :class="[
                  'px-3 py-1 rounded-lg text-base font-medium',
                  getStatusClass(volunteer.status)
                ]"
              >
                {{ getStatusLabel(volunteer.status) }}
              </span>
              <p v-if="volunteer.rejectReason" class="text-sm text-destructive mt-1">
                原因：{{ volunteer.rejectReason }}
              </p>
            </td>
            <td class="px-6 py-5">
              <div v-if="volunteer.status === 'pending'" class="flex gap-3">
                <button
                  @click="approveVolunteer(volunteer.id)"
                  class="px-5 py-2 bg-success text-success-foreground rounded-lg text-base font-medium hover:opacity-90 transition-opacity"
                >
                  通过
                </button>
                <button
                  @click="openRejectModal(volunteer.id)"
                  class="px-5 py-2 bg-destructive text-destructive-foreground rounded-lg text-base font-medium hover:opacity-90 transition-opacity"
                >
                  拒绝
                </button>
              </div>
              <span v-else class="text-muted-foreground text-base">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 拒绝原因弹窗 -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-card rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-2xl font-bold text-foreground mb-4">拒绝原因</h3>
        <p class="text-lg text-muted-foreground mb-4">请说明拒绝此申请的原因（至少5个字符）</p>
        
        <textarea
          v-model="rejectReason"
          rows="3"
          placeholder="请输入拒绝原因..."
          class="w-full p-4 text-lg border-2 border-border rounded-xl bg-background focus:border-primary focus:outline-none placeholder:text-muted-foreground resize-none"
        ></textarea>
        
        <p v-if="rejectError" class="text-destructive mt-2 text-base">{{ rejectError }}</p>
        
        <div class="flex gap-3 mt-6">
          <button
            @click="showRejectModal = false"
            class="flex-1 py-3 text-lg font-semibold rounded-xl bg-secondary text-secondary-foreground"
          >
            取消
          </button>
          <button
            @click="confirmReject"
            class="flex-1 py-3 text-lg font-semibold rounded-xl bg-destructive text-destructive-foreground"
          >
            确认拒绝
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
