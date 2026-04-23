<script setup lang="ts">
import { ref, computed, inject, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isUserFrozen = inject<Ref<boolean>>('isUserFrozen', ref(false))

const serviceType = computed(() => {
  const type = route.query.type as string
  const typeMap: Record<string, string> = {
    chat: '陪聊服务',
    medical: '就医陪同',
    shopping: '购物协助'
  }
  return typeMap[type] || '服务预约'
})

// 表单数据
const form = ref({
  date: '',
  time: '',
  address: '',
  contactName: '',
  contactPhone: '',
  remark: ''
})

const agreedToTerms = ref(false)

const isFormValid = computed(() => {
  return (
    form.value.date &&
    form.value.time &&
    form.value.address &&
    form.value.contactName &&
    form.value.contactPhone &&
    agreedToTerms.value &&
    !isUserFrozen.value
  )
})

const submitOrder = () => {
  if (!isFormValid.value) return
  // 模拟提交订单后跳转到订单详情页
  router.push('/order/12345')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-background pb-28">
    <!-- 冻结账户警告 -->
    <div v-if="isUserFrozen" class="bg-destructive text-destructive-foreground px-6 py-4">
      <p class="text-lg font-semibold text-center">
        账户状态异常，请联系社区管理员
      </p>
    </div>

    <!-- 顶部导航 -->
    <header class="bg-primary text-primary-foreground px-4 py-5 flex items-center gap-4">
      <button @click="goBack" class="text-3xl">←</button>
      <h1 class="text-2xl font-bold">{{ serviceType }}</h1>
    </header>

    <!-- 移动端框架容器 -->
    <div class="max-w-md mx-auto">
      <!-- 表单区域 -->
      <main class="p-5">
        <form @submit.prevent="submitOrder" class="flex flex-col gap-6">
          
          <!-- 日期选择 -->
          <div class="flex flex-col gap-2">
            <label class="text-xl font-semibold text-foreground">
              预约日期 <span class="text-destructive">*</span>
            </label>
            <input
              v-model="form.date"
              type="date"
              :disabled="isUserFrozen"
              class="w-full p-4 text-xl border-2 border-border rounded-xl bg-card focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- 时间选择 -->
          <div class="flex flex-col gap-2">
            <label class="text-xl font-semibold text-foreground">
              预约时间 <span class="text-destructive">*</span>
            </label>
            <input
              v-model="form.time"
              type="time"
              :disabled="isUserFrozen"
              class="w-full p-4 text-xl border-2 border-border rounded-xl bg-card focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- 服务地点 -->
          <div class="flex flex-col gap-2">
            <label class="text-xl font-semibold text-foreground">
              服务地点 <span class="text-destructive">*</span>
            </label>
            <input
              v-model="form.address"
              type="text"
              placeholder="请输入详细地址"
              :disabled="isUserFrozen"
              class="w-full p-4 text-xl border-2 border-border rounded-xl bg-card focus:border-primary focus:outline-none placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- 联系人 -->
          <div class="flex flex-col gap-2">
            <label class="text-xl font-semibold text-foreground">
              联系人 <span class="text-destructive">*</span>
            </label>
            <input
              v-model="form.contactName"
              type="text"
              placeholder="请输入联系人姓名"
              :disabled="isUserFrozen"
              class="w-full p-4 text-xl border-2 border-border rounded-xl bg-card focus:border-primary focus:outline-none placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- 联系电话 -->
          <div class="flex flex-col gap-2">
            <label class="text-xl font-semibold text-foreground">
              联系电话 <span class="text-destructive">*</span>
            </label>
            <input
              v-model="form.contactPhone"
              type="tel"
              placeholder="请输入联系电话"
              :disabled="isUserFrozen"
              class="w-full p-4 text-xl border-2 border-border rounded-xl bg-card focus:border-primary focus:outline-none placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- 备注 -->
          <div class="flex flex-col gap-2">
            <label class="text-xl font-semibold text-foreground">
              备注说明
            </label>
            <textarea
              v-model="form.remark"
              rows="3"
              placeholder="如有特殊需求请说明"
              :disabled="isUserFrozen"
              class="w-full p-4 text-xl border-2 border-border rounded-xl bg-card focus:border-primary focus:outline-none placeholder:text-muted-foreground resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            ></textarea>
          </div>

          <!-- 免责协议 -->
          <div class="bg-secondary rounded-xl p-5">
            <label class="flex items-start gap-4 cursor-pointer">
              <input
                v-model="agreedToTerms"
                type="checkbox"
                :disabled="isUserFrozen"
                class="w-7 h-7 mt-1 accent-primary rounded shrink-0 disabled:opacity-50"
              />
              <span class="text-lg text-secondary-foreground leading-relaxed">
                我已阅读并同意《暖心相伴服务协议》及《免责声明》，了解服务性质为志愿互助，非商业行为。
              </span>
            </label>
          </div>
        </form>
      </main>

      <!-- 底部提交按钮 -->
      <div class="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-5">
        <div class="max-w-md mx-auto">
          <button
            @click="submitOrder"
            :disabled="!isFormValid"
            :class="[
              'w-full py-5 text-2xl font-bold rounded-xl transition-all',
              isFormValid
                ? 'bg-primary text-primary-foreground active:scale-[0.98]'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            ]"
          >
            {{ isUserFrozen ? '账户已冻结' : '提交预约' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
