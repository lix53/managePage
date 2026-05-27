import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/views/Login.vue'), meta: { title: '登录' } },
  {
    path: '/main',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/main/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: '看板', keepAlive: true } },
      { path: 'projects', name: 'ProjectList', component: () => import('@/views/ProjectList.vue'), meta: { title: '项目', keepAlive: true } },
      { path: 'issues', name: 'IssueList', component: () => import('@/views/IssueList.vue'), meta: { title: '问题', keepAlive: true } },
      { path: 'profile', name: 'Profile', component: () => import('@/views/Profile.vue'), meta: { title: '我的', keepAlive: true } }
    ]
  },
  { path: '/project/:id', component: () => import('@/views/ProjectDetail.vue'), meta: { title: '项目详情' } },
  { path: '/project/new', component: () => import('@/views/ProjectNew.vue'), meta: { title: '新建项目' } },
  { path: '/node/:projectId/:nodeKey', component: () => import('@/views/NodeDetail.vue'), meta: { title: '节点详情' } },
  { path: '/issue/new', component: () => import('@/views/IssueNew.vue'), meta: { title: '新建问题' } },
  { path: '/issue/:id', component: () => import('@/views/IssueDetail.vue'), meta: { title: '问题详情' } },
  { path: '/checkin', component: () => import('@/views/Checkin.vue'), meta: { title: '工地签到' } },
  { path: '/shipment/:projectId', component: () => import('@/views/Shipment.vue'), meta: { title: '发货管理' } },
  { path: '/payment/:projectId', component: () => import('@/views/Payment.vue'), meta: { title: '回款记录' } },
  { path: '/media/:projectId', component: () => import('@/views/Media.vue'), meta: { title: '素材库' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = `黑玛项目管家 - ${to.meta.title}`
  const user = localStorage.getItem('blackmart_user')
  if (to.path !== '/login' && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router
