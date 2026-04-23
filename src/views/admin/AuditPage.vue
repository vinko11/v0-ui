<script setup lang="ts">
import { ref } from 'vue'

interface AuditLog {
  id: string
  action: string
  target: string
  operator: string
  operatorRole: string
  details: string
  timestamp: string
  ip: string
}

const logs = ref<AuditLog[]>([
  {
    id: '1',
    action: '用户冻结',
    target: '用户：赵某',
    operator: '管理员A',
    operatorRole: '超级管理员',
    details: '原因：多次投诉记录',
    timestamp: '2024-04-21 14:30:22',
    ip: '192.168.1.100'
  },
  {
    id: '2',
    action: '志愿者审核通过',
    target: '志愿者：王志愿',
    operator: '管理员B',
    operatorRole: '审核员',
    details: '资料完整，背景审核通过',
    timestamp: '2024-04-21 13:15:08',
    ip: '192.168.1.101'
  },
  {
    id: '3',
    action: '志愿者审核拒绝',
    target: '志愿者：李某',
    operator: '管理员A',
    operatorRole: '超级管理员',
    details: '原因：身份信息不完整',
    timestamp: '2024-04-21 11:22:45',
    ip: '192.168.1.100'
  },
  {
    id: '4',
    action: '用户解冻',
    target: '用户：张某',
    operator: '管理员C',
    operatorRole: '客服',
    details: '用户申诉通过，恢复账户',
    timestamp: '2024-04-20 16:45:33',
    ip: '192.168.1.102'
  },
  {
    id: '5',
    action: '订单取消',
    target: '订单：#12340',
    operator: '管理员B',
    operatorRole: '审核员',
    details: '用户请求取消，志愿者同意',
    timestamp: '2024-04-20 10:08:17',
    ip: '192.168.1.101'
  }
])

const getActionClass = (action: string) => {
  if (action.includes('冻结') || action.includes('拒绝')) {
    return 'bg-destructive/20 text-destructive'
  } else if (action.includes('通过') || action.includes('解冻')) {
    return 'bg-success/20 text-success'
  }
  return 'bg-warning/20 text-warning'
}
</script>

<template>
  <div class="p-8">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground">审计日志</h1>
      <p class="text-lg text-muted-foreground mt-2">
        系统操作记录追溯，保障数据安全与合规
      </p>
    </div>

    <!-- 筛选器 -->
    <div class="bg-card rounded-xl p-4 border border-border mb-6">
      <div class="flex items-center gap-4">
        <select class="px-4 py-2 border border-border rounded-lg bg-background text-foreground">
          <option value="">全部操作类型</option>
          <option value="freeze">用户冻结</option>
          <option value="unfreeze">用户解冻</option>
          <option value="approve">审核通过</option>
          <option value="reject">审核拒绝</option>
        </select>
        <select class="px-4 py-2 border border-border rounded-lg bg-background text-foreground">
          <option value="">全部操作员</option>
          <option value="admin-a">管理员A</option>
          <option value="admin-b">管理员B</option>
          <option value="admin-c">管理员C</option>
        </select>
        <input
          type="date"
          class="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
        />
        <button class="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
          筛选
        </button>
      </div>
    </div>

    <!-- 日志表格 -->
    <div class="bg-card rounded-xl border border-border overflow-hidden">
      <table class="w-full">
        <thead class="bg-muted">
          <tr>
            <th class="px-6 py-4 text-left text-base font-semibold text-foreground">操作类型</th>
            <th class="px-6 py-4 text-left text-base font-semibold text-foreground">操作对象</th>
            <th class="px-6 py-4 text-left text-base font-semibold text-foreground">操作员</th>
            <th class="px-6 py-4 text-left text-base font-semibold text-foreground">详情</th>
            <th class="px-6 py-4 text-left text-base font-semibold text-foreground">时间</th>
            <th class="px-6 py-4 text-left text-base font-semibold text-foreground">IP地址</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="log in logs"
            :key="log.id"
            class="border-t border-border hover:bg-muted/50 transition-colors"
          >
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-3 py-1 rounded-lg text-sm font-medium',
                  getActionClass(log.action)
                ]"
              >
                {{ log.action }}
              </span>
            </td>
            <td class="px-6 py-4 text-base text-foreground">{{ log.target }}</td>
            <td class="px-6 py-4">
              <div>
                <p class="text-base text-foreground">{{ log.operator }}</p>
                <p class="text-sm text-muted-foreground">{{ log.operatorRole }}</p>
              </div>
            </td>
            <td class="px-6 py-4 text-base text-muted-foreground max-w-xs truncate">
              {{ log.details }}
            </td>
            <td class="px-6 py-4 text-base text-muted-foreground">{{ log.timestamp }}</td>
            <td class="px-6 py-4 text-base text-muted-foreground font-mono">{{ log.ip }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex items-center justify-between mt-6">
      <p class="text-base text-muted-foreground">共 {{ logs.length }} 条记录</p>
      <div class="flex items-center gap-2">
        <button class="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted">
          上一页
        </button>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg">1</button>
        <button class="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted">2</button>
        <button class="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted">3</button>
        <button class="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted">
          下一页
        </button>
      </div>
    </div>
  </div>
</template>
