import { reactive, readonly } from 'vue'

// 用户状态
export type UserStatus = 'ACTIVE' | 'FROZEN'

// 志愿者状态
export type VolunteerStatus = 'UNVERIFIED' | 'PENDING' | 'APPROVED'

// 订单状态
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED'

// 订单类型
export interface Order {
  id: string
  userId: string
  userName: string
  userPhone: string
  serviceType: 'chat' | 'medical' | 'shopping'
  serviceTypeName: string
  date: string
  time: string
  address: string
  notes: string
  status: OrderStatus
  volunteerId?: string
  volunteerName?: string
  createdAt: string
  startTime?: string
  endTime?: string
  duration?: number
  photos?: string[]
  report?: string
}

// 志愿者类型
export interface Volunteer {
  id: string
  name: string
  avatar: string
  phone: string
  idCard: string
  status: VolunteerStatus
  rating: number
  serviceCount: number
  totalHours: number
  badges: string[]
  skills: string[]
  reviews: { user: string; content: string; rating: number; date: string }[]
  createdAt: string
  hourlyRate: number
}

// 用户类型
export interface User {
  id: string
  name: string
  phone: string
  status: UserStatus
  frozenReason?: string
  frozenAt?: string
  serviceCount: number
  createdAt: string
}

// 全局状态
const state = reactive({
  // 当前视角
  currentRole: 'user' as 'user' | 'volunteer' | 'admin',
  
  // 当前用户
  currentUser: {
    id: 'u001',
    name: '王奶奶',
    phone: '138****1234',
    status: 'ACTIVE' as UserStatus,
    serviceCount: 12,
    createdAt: '2024-01-15'
  } as User,
  
  // 当前志愿者
  currentVolunteer: {
    id: 'v001',
    name: '小李',
    avatar: '',
    phone: '139****5678',
    idCard: '310***********1234',
    status: 'APPROVED' as VolunteerStatus,
    rating: 4.9,
    serviceCount: 56,
    totalHours: 168,
    badges: ['金牌志愿者', '医护达人', '贴心陪伴'],
    skills: ['陪聊', '就医陪同', '购物协助'],
    reviews: [
      { user: '张爷爷', content: '小李非常耐心，陪我聊了很久', rating: 5, date: '2024-03-10' },
      { user: '李奶奶', content: '帮我取药很细心', rating: 5, date: '2024-03-08' }
    ],
    createdAt: '2023-06-01',
    hourlyRate: 30
  } as Volunteer,
  
  // 所有用户
  users: [
    { id: 'u001', name: '王奶奶', phone: '138****1234', status: 'ACTIVE', serviceCount: 12, createdAt: '2024-01-15' },
    { id: 'u002', name: '张爷爷', phone: '137****2345', status: 'ACTIVE', serviceCount: 8, createdAt: '2024-02-20' },
    { id: 'u003', name: '李阿姨', phone: '136****3456', status: 'FROZEN', frozenReason: '多次无故取消订单', frozenAt: '2024-03-01', serviceCount: 3, createdAt: '2024-01-10' }
  ] as User[],
  
  // 所有志愿者
  volunteers: [
    {
      id: 'v001', name: '小李', avatar: '', phone: '139****5678', idCard: '310***********1234',
      status: 'APPROVED', rating: 4.9, serviceCount: 56, totalHours: 168,
      badges: ['金牌志愿者', '医护达人', '贴心陪伴'], skills: ['陪聊', '就医陪同', '购物协助'],
      reviews: [
        { user: '张爷爷', content: '小李非常耐心，陪我聊了很久', rating: 5, date: '2024-03-10' },
        { user: '李奶奶', content: '帮我取药很细心', rating: 5, date: '2024-03-08' }
      ],
      createdAt: '2023-06-01', hourlyRate: 30
    },
    {
      id: 'v002', name: '小王', avatar: '', phone: '138****6789', idCard: '310***********2345',
      status: 'APPROVED', rating: 4.7, serviceCount: 32, totalHours: 96,
      badges: ['热心志愿者', '购物能手'], skills: ['陪聊', '购物协助'],
      reviews: [
        { user: '王奶奶', content: '帮我买菜很仔细', rating: 5, date: '2024-03-05' }
      ],
      createdAt: '2023-09-15', hourlyRate: 25
    },
    {
      id: 'v003', name: '小张', avatar: '', phone: '137****7890', idCard: '310***********3456',
      status: 'PENDING', rating: 0, serviceCount: 0, totalHours: 0,
      badges: [], skills: ['陪聊'],
      reviews: [],
      createdAt: '2024-03-01', hourlyRate: 20
    }
  ] as Volunteer[],
  
  // 所有订单
  orders: [
    {
      id: 'o001', userId: 'u001', userName: '王奶奶', userPhone: '138****1234',
      serviceType: 'chat', serviceTypeName: '陪聊服务',
      date: '2024-03-15', time: '14:00', address: '阳光小区3号楼502室',
      notes: '想聊聊家常', status: 'PENDING',
      createdAt: '2024-03-14T10:30:00'
    },
    {
      id: 'o002', userId: 'u002', userName: '张爷爷', userPhone: '137****2345',
      serviceType: 'medical', serviceTypeName: '就医陪同',
      date: '2024-03-16', time: '09:00', address: '幸福路88号',
      notes: '去社区医院复查', status: 'ACCEPTED', volunteerId: 'v001', volunteerName: '小李',
      createdAt: '2024-03-14T14:20:00'
    },
    {
      id: 'o003', userId: 'u001', userName: '王奶奶', userPhone: '138****1234',
      serviceType: 'shopping', serviceTypeName: '购物协助',
      date: '2024-03-14', time: '10:00', address: '阳光小区3号楼502室',
      notes: '帮忙买些日用品', status: 'IN_SERVICE', volunteerId: 'v002', volunteerName: '小王',
      createdAt: '2024-03-13T16:00:00', startTime: '2024-03-14T10:05:00'
    },
    {
      id: 'o004', userId: 'u002', userName: '张爷爷', userPhone: '137****2345',
      serviceType: 'chat', serviceTypeName: '陪聊服务',
      date: '2024-03-10', time: '15:00', address: '幸福路88号',
      notes: '想下棋聊天', status: 'COMPLETED', volunteerId: 'v001', volunteerName: '小李',
      createdAt: '2024-03-09T11:00:00', startTime: '2024-03-10T15:00:00', endTime: '2024-03-10T17:00:00', duration: 120
    }
  ] as Order[],
  
  // Toast消息
  toast: {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'loading'
  }
})

// Actions
const actions = {
  // 切换角色
  setRole(role: 'user' | 'volunteer' | 'admin') {
    state.currentRole = role
  },
  
  // 冻结/解冻用户
  toggleUserFreeze(userId: string, freeze: boolean, reason?: string) {
    const user = state.users.find(u => u.id === userId)
    if (user) {
      user.status = freeze ? 'FROZEN' : 'ACTIVE'
      user.frozenReason = freeze ? reason : undefined
      user.frozenAt = freeze ? new Date().toISOString() : undefined
    }
    if (state.currentUser.id === userId) {
      state.currentUser.status = freeze ? 'FROZEN' : 'ACTIVE'
      state.currentUser.frozenReason = freeze ? reason : undefined
      state.currentUser.frozenAt = freeze ? new Date().toISOString() : undefined
    }
  },
  
  // 更新志愿者状态
  updateVolunteerStatus(volunteerId: string, status: VolunteerStatus) {
    const volunteer = state.volunteers.find(v => v.id === volunteerId)
    if (volunteer) {
      volunteer.status = status
    }
    if (state.currentVolunteer.id === volunteerId) {
      state.currentVolunteer.status = status
    }
  },
  
  // 创建订单
  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>) {
    const newOrder: Order = {
      ...order,
      id: `o${String(state.orders.length + 1).padStart(3, '0')}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    }
    state.orders.unshift(newOrder)
    return newOrder
  },
  
  // 接受订单
  acceptOrder(orderId: string, volunteerId: string, volunteerName: string) {
    const order = state.orders.find(o => o.id === orderId)
    if (order) {
      order.status = 'ACCEPTED'
      order.volunteerId = volunteerId
      order.volunteerName = volunteerName
    }
  },
  
  // 拒绝订单（需要理由）
  rejectOrder(orderId: string, reason: string) {
    const order = state.orders.find(o => o.id === orderId)
    if (order) {
      order.status = 'CANCELLED'
      // 记录拒绝理由（实际项目中应保存到日志）
      console.log(`订单 ${orderId} 被拒绝，理由: ${reason}`)
    }
  },
  
  // 开始服务
  startService(orderId: string) {
    const order = state.orders.find(o => o.id === orderId)
    if (order) {
      order.status = 'IN_SERVICE'
      order.startTime = new Date().toISOString()
    }
  },
  
  // 结束服务
  endService(orderId: string, report?: string, photos?: string[]) {
    const order = state.orders.find(o => o.id === orderId)
    if (order && order.startTime) {
      order.status = 'COMPLETED'
      order.endTime = new Date().toISOString()
      order.duration = Math.round((new Date(order.endTime).getTime() - new Date(order.startTime).getTime()) / 60000)
      order.report = report
      order.photos = photos
    }
  },
  
  // 显示Toast
  showToast(message: string, type: 'success' | 'error' | 'loading' = 'success') {
    state.toast = { show: true, message, type }
    if (type !== 'loading') {
      setTimeout(() => {
        state.toast.show = false
      }, 2000)
    }
  },
  
  // 隐藏Toast
  hideToast() {
    state.toast.show = false
  }
}

export function useGlobalStore() {
  return {
    state: readonly(state),
    ...actions
  }
}

export { state }
