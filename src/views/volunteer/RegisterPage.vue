<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  phone: '',
  idCard: '',
  community: '',
  experience: '',
  idFrontImage: null as File | null,
  idBackImage: null as File | null
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)

const isFormValid = computed(() => {
  return (
    form.value.name &&
    form.value.phone &&
    form.value.idCard &&
    form.value.community
  )
})

const handleFileUpload = (event: Event, type: 'front' | 'back') => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    if (type === 'front') {
      form.value.idFrontImage = target.files[0]
    } else {
      form.value.idBackImage = target.files[0]
    }
  }
}

const submitForm = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  
  // 模拟提交
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  isSubmitting.value = false
  submitSuccess.value = true
  
  // 2秒后返回
  setTimeout(() => {
    router.push('/volunteer')
  }, 2000)
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-background pb-28">
    <!-- 顶部导航 -->
    <header class="bg-primary text-primary-foreground px-4 py-5 flex items-center gap-4">
      <button @click="goBack" class="text-3xl">←</button>
      <h1 class="text-2xl font-bold">志愿者注册</h1>
    </header>

    <!-- 移动端框架容器 -->
    <div class="max-w-md mx-auto">
      <!-- 成功提示 -->
      <div v-if="submitSuccess" class="p-5">
        <div class="bg-success/20 rounded-2xl p-8 text-center">
          <div class="text-6xl mb-4">✅</div>
          <h2 class="text-2xl font-bold text-success mb-2">提交成功</h2>
          <p class="text-lg text-muted-foreground">您的申请已提交，请等待审核</p>
        </div>
      </div>

      <!-- 表单区域 -->
      <main v-else class="p-5">
        <form @submit.prevent="submitForm" class="flex flex-col gap-6">
          
          <!-- 姓名 -->
          <div class="flex flex-col gap-2">
            <label class="text-xl font-semibold text-foreground">
              真实姓名 <span class="text-destructive">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="请输入真实姓名"
              class="w-full p-4 text-xl border-2 border-border rounded-xl bg-card focus:border-primary focus:outline-none placeholder:text-muted-foreground"
            />
          </div>

          <!-- 手机号 -->
          <div class="flex flex-col gap-2">
            <label class="text-xl font-semibold text-foreground">
              联系电话 <span class="text-destructive">*</span>
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="请输入联系电话"
              class="w-full p-4 text-xl border-2 border-border rounded-xl bg-card focus:border-primary focus:outline-none placeholder:text-muted-foreground"
            />
          </div>

          <!-- 身份证号 -->
          <div class="flex flex-col gap-2">
            <label class="text-xl font-semibold text-foreground">
              身份证号 <span class="text-destructive">*</span>
            </label>
            <input
              v-model="form.idCard"
              type="text"
              placeholder="请输入身份证号"
              class="w-full p-4 text-xl border-2 border-border rounded-xl bg-card focus:border-primary focus:outline-none placeholder:text-muted-foreground"
            />
          </div>

          <!-- 所属社区 -->
          <div class="flex flex-col gap-2">
            <label class="text-xl font-semibold text-foreground">
              所属社区 <span class="text-destructive">*</span>
            </label>
            <input
              v-model="form.community"
              type="text"
              placeholder="请输入所属社区"
              class="w-full p-4 text-xl border-2 border-border rounded-xl bg-card focus:border-primary focus:outline-none placeholder:text-muted-foreground"
            />
          </div>

          <!-- 身份证照片上传 -->
          <div class="flex flex-col gap-2">
            <label class="text-xl font-semibold text-foreground">
              身份证照片
            </label>
            <div class="grid grid-cols-2 gap-4">
              <div class="relative">
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => handleFileUpload(e, 'front')"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  :class="[
                    'h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1',
                    form.idFrontImage ? 'border-success bg-success/10' : 'border-border'
                  ]"
                >
                  <span class="text-2xl">{{ form.idFrontImage ? '✅' : '📷' }}</span>
                  <span class="text-base text-muted-foreground">人像面</span>
                </div>
              </div>
              <div class="relative">
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => handleFileUpload(e, 'back')"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  :class="[
                    'h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1',
                    form.idBackImage ? 'border-success bg-success/10' : 'border-border'
                  ]"
                >
                  <span class="text-2xl">{{ form.idBackImage ? '✅' : '📷' }}</span>
                  <span class="text-base text-muted-foreground">国徽面</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 服务经验 -->
          <div class="flex flex-col gap-2">
            <label class="text-xl font-semibold text-foreground">
              服务经验
            </label>
            <textarea
              v-model="form.experience"
              rows="3"
              placeholder="请简要描述您的志愿服务经验（选填）"
              class="w-full p-4 text-xl border-2 border-border rounded-xl bg-card focus:border-primary focus:outline-none placeholder:text-muted-foreground resize-none"
            ></textarea>
          </div>
        </form>
      </main>

      <!-- 底部提交按钮 -->
      <div v-if="!submitSuccess" class="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-5">
        <div class="max-w-md mx-auto">
          <button
            @click="submitForm"
            :disabled="!isFormValid || isSubmitting"
            :class="[
              'w-full py-5 text-2xl font-bold rounded-xl transition-all',
              isFormValid && !isSubmitting
                ? 'bg-primary text-primary-foreground active:scale-[0.98]'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            ]"
          >
            {{ isSubmitting ? '提交中...' : '提交申请' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
