import { ref, computed } from 'vue'

// 用户状态
export type UserStatus = 'ACTIVE' | 'FROZEN'
export type VolunteerStatus = 'UNVERIFIED' | 'PENDING' | 'APPROVED' | 'REJECTED'
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface Order {
  id: string
  serviceType: 'chat' | 'hospital' | 'shopping'
  serviceName: string
  status: OrderStatus
  userId: string
  userName: string
  userPhone: string
  volunteerId?: string
  volunteerName?: string
  address: string
  scheduledDate: string
  scheduledTime: string
  notes: string
  createdAt: string
  acceptedAt?: string
  startedAt?: string
  completedAt?: string
  rejectReason?: string
  rating?: number
  review?: string
  duration?: number // 服务时长(分钟)
  photos?: string[]
}

export interface Volunteer {
  id: string
  name: string
  phone: string
  idCard: string
  status: VolunteerStatus
  avatar?: string
  skills: string[]
  experience: string
  totalOrders: number
  totalHours: number
  rating: number
  badges: string[]
  hourlyRate: number
  createdAt: string
  approvedAt?: string
  rejectReason?: string
}

export interface User {
  id: string
  name: string
  phone: string
  status: UserStatus
  freezeReason?: string
  freezeAt?: string
  totalOrders: number
  createdAt: string
  preferences?: {
    language?: string
    personality?: string
  }
}

// 全局状态
export const currentView = ref<'user' | 'volunteer' | 'admin'>('user')

// 当前用户
export const currentUser = ref<User>({
  id: 'U001',
  name: '张奶奶',
  phone: '138****1234',
  status: 'ACTIVE',
  totalOrders: 12,
  createdAt: '2024-01-15',
  preferences: {
    language: '普通话',
    personality: '耐心细致'
  }
})

// 当前志愿者
export const currentVolunteer = ref<Volunteer>({
  id: 'V001',
  name: '李明',
  phone: '139****5678',
  idCard: '310***********1234',
  status: 'APPROVED',
  skills: ['陪聊', '就医陪同', '购物协助'],
  experience: '3年社区志愿服务经验',
  totalOrders: 48,
  totalHours: 156,
  rating: 4.9,
  badges: ['金牌志愿者', '爱心使者', '社区之星'],
  hourlyRate: 30,
  createdAt: '2023-06-01',
  approvedAt: '2023-06-05'
})

// Mock 订单数据库
export const orderList = ref<Order[]>([
  {
    id: 'ORD001',
    serviceType: 'chat',
    serviceName: '暖心陪聊',
    status: 'PENDING',
    userId: 'U002',
    userName: '王爷爷',
    userPhone: '137****9876',
    address: '阳光社区 3号楼 502室',
    scheduledDate: '2024-12-20',
    scheduledTime: '14:00',
    notes: '希望聊聊以前的故事',
    createdAt: '2024-12-18T10:00:00'
  },
  {
    id: 'ORD002',
    serviceType: 'hospital',
    serviceName: '就医陪同',
    status: 'ACCEPTED',
    userId: 'U003',
    userName: '刘奶奶',
    userPhone: '136****5432',
    volunteerId: 'V001',
    volunteerName: '李明',
    address: '幸福小区 7号楼 301室',
    scheduledDate: '2024-12-21',
    scheduledTime: '08:30',
    notes: '去人民医院看骨科',
    createdAt: '2024-12-17T14:00:00',
    acceptedAt: '2024-12-17T15:00:00'
  },
  {
    id: 'ORD003',
    serviceType: 'shopping',
    serviceName: '购物协助',
    status: 'IN_PROGRESS',
    userId: 'U004',
    userName: '陈爷爷',
    userPhone: '135****2468',
    volunteerId: 'V001',
    volunteerName: '李明',
    address: '和平花园 12号楼 101室',
    scheduledDate: '2024-12-19',
    scheduledTime: '10:00',
    notes: '帮忙采购年货',
    createdAt: '2024-12-16T09:00:00',
    acceptedAt: '2024-12-16T10:00:00',
    startedAt: '2024-12-19T10:05:00'
  },
  {
    id: 'ORD004',
    serviceType: 'chat',
    serviceName: '暖心陪聊',
    status: 'COMPLETED',
    userId: 'U005',
    userName: '孙奶奶',
    userPhone: '134****1357',
    volunteerId: 'V001',
    volunteerName: '李明',
    address: '阳光社区 5号楼 603室',
    scheduledDate: '2024-12-15',
    scheduledTime: '15:00',
    notes: '想找人说说话',
    createdAt: '2024-12-14T11:00:00',
    acceptedAt: '2024-12-14T12:00:00',
    startedAt: '2024-12-15T15:00:00',
    completedAt: '2024-12-15T17:00:00',
    duration: 120,
    rating: 5,
    review: '小李很有耐心，陪我聊了很久，感谢！'
  }
])

// Mock 志愿者列表
export const volunteerList = ref<Volunteer[]>([
  {
    id: 'V001',
    name: '李明',
    phone: '139****5678',
    idCard: '310***********1234',
    status: 'APPROVED',
    skills: ['陪聊', '就医陪同', '购物协助'],
    experience: '3年社区志愿服务经验',
    totalOrders: 48,
    totalHours: 156,
    rating: 4.9,
    badges: ['金牌志愿者', '爱心使者', '社区之星'],
    hourlyRate: 30,
    createdAt: '2023-06-01',
    approvedAt: '2023-06-05'
  },
  {
    id: 'V002',
    name: '王芳',
    phone: '138****4321',
    idCard: '310***********5678',
    status: 'APPROVED',
    skills: ['陪聊', '购物协助'],
    experience: '退休护士，有丰富的护理经验',
    totalOrders: 35,
    totalHours: 98,
    rating: 4.8,
    badges: ['银牌志愿者', '爱心使者'],
    hourlyRate: 28,
    createdAt: '2023-08-15',
    approvedAt: '2023-08-20'
  },
  {
    id: 'V003',
    name: '张强',
    phone: '137****8765',
    idCard: '310***********9012',
    status: 'PENDING',
    skills: ['就医陪同', '购物协助'],
    experience: '热心公益，愿意帮助老人',
    totalOrders: 0,
    totalHours: 0,
    rating: 0,
    badges: [],
    hourlyRate: 25,
    createdAt: '2024-12-10'
  }
])

// Mock 用户列表
export const userList = ref<User[]>([
  {
    id: 'U001',
    name: '张奶奶',
    phone: '138****1234',
    status: 'ACTIVE',
    totalOrders: 12,
    createdAt: '2024-01-15'
  },
  {
    id: 'U002',
    name: '王爷爷',
    phone: '137****9876',
    status: 'ACTIVE',
    totalOrders: 8,
    createdAt: '2024-02-20'
  },
  {
    id: 'U003',
    name: '刘奶奶',
    phone: '136****5432',
    status: 'ACTIVE',
    totalOrders: 15,
    createdAt: '2024-01-08'
  },
  {
    id: 'U004',
    name: '陈爷爷',
    phone: '135****2468',
    status: 'FROZEN',
    freezeReason: '多次无故取消订单',
    freezeAt: '2024-12-01',
    totalOrders: 3,
    createdAt: '2024-03-10'
  }
])

// Toast 状态
export const toast = ref<{
  show: boolean
  message: string
  type: 'success' | 'error' | 'loading'
}>({
  show: false,
  message: '',
  type: 'success'
})

export function showToast(message: string, type: 'success' | 'error' | 'loading' = 'success') {
  toast.value = { show: true, message, type }
  if (type !== 'loading') {
    setTimeout(() => {
      toast.value.show = false
    }, 2500)
  }
}

export function hideToast() {
  toast.value.show = false
}

// 计算属性
export const pendingOrders = computed(() => 
  orderList.value.filter(o => o.status === 'PENDING')
)

export const myAcceptedOrders = computed(() => 
  orderList.value.filter(o => 
    o.volunteerId === currentVolunteer.value.id && 
    (o.status === 'ACCEPTED' || o.status === 'IN_PROGRESS')
  )
)

export const myCompletedOrders = computed(() => 
  orderList.value.filter(o => 
    o.volunteerId === currentVolunteer.value.id && 
    o.status === 'COMPLETED'
  )
)

// 志愿者薪酬计算
export const volunteerEarnings = computed(() => {
  const totalHours = currentVolunteer.value.totalHours
  const hourlyRate = currentVolunteer.value.hourlyRate
  const gross = totalHours * hourlyRate
  const platformFee = gross * 0.12
  const net = gross - platformFee
  return { gross, platformFee, net, totalHours, hourlyRate }
})

// 操作函数
export function acceptOrder(orderId: string) {
  const order = orderList.value.find(o => o.id === orderId)
  if (order) {
    order.status = 'ACCEPTED'
    order.volunteerId = currentVolunteer.value.id
    order.volunteerName = currentVolunteer.value.name
    order.acceptedAt = new Date().toISOString()
  }
}

export function rejectOrder(orderId: string, reason: string) {
  const order = orderList.value.find(o => o.id === orderId)
  if (order) {
    order.rejectReason = reason
    // 订单回到待接单状态供其他志愿者接单
  }
}

export function startService(orderId: string) {
  const order = orderList.value.find(o => o.id === orderId)
  if (order) {
    order.status = 'IN_PROGRESS'
    order.startedAt = new Date().toISOString()
  }
}

export function completeService(orderId: string, duration: number) {
  const order = orderList.value.find(o => o.id === orderId)
  if (order) {
    order.status = 'COMPLETED'
    order.completedAt = new Date().toISOString()
    order.duration = duration
    // 更新志愿者统计
    currentVolunteer.value.totalOrders++
    currentVolunteer.value.totalHours += Math.round(duration / 60)
  }
}

export function freezeUser(userId: string, reason: string) {
  const user = userList.value.find(u => u.id === userId)
  if (user) {
    user.status = 'FROZEN'
    user.freezeReason = reason
    user.freezeAt = new Date().toISOString()
  }
}

export function unfreezeUser(userId: string) {
  const user = userList.value.find(u => u.id === userId)
  if (user) {
    user.status = 'ACTIVE'
    user.freezeReason = undefined
    user.freezeAt = undefined
  }
}

export function approveVolunteer(volunteerId: string) {
  const volunteer = volunteerList.value.find(v => v.id === volunteerId)
  if (volunteer) {
    volunteer.status = 'APPROVED'
    volunteer.approvedAt = new Date().toISOString()
  }
}

export function rejectVolunteer(volunteerId: string, reason: string) {
  const volunteer = volunteerList.value.find(v => v.id === volunteerId)
  if (volunteer) {
    volunteer.status = 'REJECTED'
    volunteer.rejectReason = reason
  }
}
