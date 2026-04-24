import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'

// 用户端页面
import UserHome from './views/user/HomePage.vue'
import UserOrder from './views/user/OrderPage.vue'
import UserOrderDetail from './views/user/OrderDetailPage.vue'
import UserProfile from './views/user/ProfilePage.vue'

// 志愿者端页面
import VolunteerTasks from './views/volunteer/TaskListPage.vue'
import VolunteerExecute from './views/volunteer/ExecutePage.vue'
import VolunteerRegister from './views/volunteer/RegisterPage.vue'
import VolunteerProfile from './views/volunteer/ProfilePage.vue'

// 管理后台页面
import AdminLayout from './views/admin/AdminLayout.vue'
import AdminDashboard from './views/admin/DashboardPage.vue'
import AdminReview from './views/admin/ReviewPage.vue'
import AdminOrders from './views/admin/OrdersPage.vue'
import AdminUsers from './views/admin/UsersPage.vue'
import AdminAudit from './views/admin/AuditPage.vue'

const routes = [
  // 用户端路由
  { path: '/', component: UserHome, meta: { title: '首页 - 暖心相伴' } },
  { path: '/order', component: UserOrder, meta: { title: '下单 - 暖心相伴' } },
  { path: '/order/:id', component: UserOrderDetail, meta: { title: '订单详情 - 暖心相伴' } },
  { path: '/profile', component: UserProfile, meta: { title: '我的 - 暖心相伴' } },
  
  // 志愿者端路由
  { path: '/volunteer', component: VolunteerTasks, meta: { title: '待办任务 - 暖心相伴' } },
  { path: '/volunteer/execute/:id', component: VolunteerExecute, meta: { title: '执行任务 - 暖心相伴' } },
  { path: '/volunteer/register', component: VolunteerRegister, meta: { title: '志愿者注册 - 暖心相伴' } },
  { path: '/volunteer/profile', component: VolunteerProfile, meta: { title: '志愿者档案 - 暖心相伴' } },
  
  // 管理后台路由
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: AdminDashboard, meta: { title: '数据概览 - 管理后台' } },
      { path: 'review', component: AdminReview, meta: { title: '志愿者审核 - 管理后台' } },
      { path: 'orders', component: AdminOrders, meta: { title: '订单管理 - 管理后台' } },
      { path: 'users', component: AdminUsers, meta: { title: '用户管理 - 管理后台' } },
      { path: 'audit', component: AdminAudit, meta: { title: '审计日志 - 管理后台' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  document.title = (to.meta.title as string) || '暖心相伴'
})

const app = createApp(App)
app.use(router)
app.mount('#app')
