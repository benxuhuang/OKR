import { createRouter, createWebHistory } from 'vue-router'
import GoalManagement from '../views/GoalManagement.vue'
import TodayTasks from '../views/TodayTasks.vue'
import WeeklyStats from '../views/WeeklyStats.vue'
import MonthlyStats from '../views/MonthlyStats.vue'

const routes = [
  {
    path: '/',
    redirect: '/today-tasks'
  },
  {
    path: '/today-tasks',
    name: 'TodayTasks',
    component: TodayTasks
  },
  {
    path: '/goals',
    name: 'Goals',
    component: GoalManagement
  },
  {
    path: '/weekly-stats',
    name: 'WeeklyStats',
    component: WeeklyStats
  },
  {
    path: '/monthly-stats',
    name: 'Monthly',
    component: MonthlyStats
  }
]

const router = createRouter({
  history: createWebHistory('/okr/'),
  routes
})

export default router 