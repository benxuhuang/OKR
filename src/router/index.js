import { createRouter, createWebHistory } from 'vue-router'
import GoalManagement from '../views/GoalManagement.vue'

const routes = [
  {
    path: '/',
    redirect: '/goals'
  },
  {
    path: '/goals',
    name: 'Goals',
    component: GoalManagement
  },
  {
    path: '/today',
    name: 'Today',
    component: () => import('../views/TodayTasks.vue')
  },
  {
    path: '/weekly',
    name: 'Weekly',
    component: () => import('../views/WeeklyStats.vue')
  },
  {
    path: '/monthly',
    name: 'Monthly',
    component: () => import('../views/MonthlyStats.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/okr/'),
  routes
})

export default router 