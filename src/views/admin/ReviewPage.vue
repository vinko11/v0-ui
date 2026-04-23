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
    status: 'rejected'
  }
])

const approveVolunteer = (id: string) => {
  const volunteer = volunteers.value.find(v => v.id === id)
  if (volunteer) {
    volunteer.status = 'approved'
  }
}

const rejectVolunteer = (id: string) => {
  const volunteer = volunteers.value.find(v => v.id === id)
  if (volunteer) {
    volunteer.status = 'rejected'
  }
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
                  @click="rejectVolunteer(volunteer.id)"
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
  </div>
</template>
