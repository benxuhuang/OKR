import { createRouter, createWebHistory } from 'vue-router'
import GoalManagement from '../views/GoalManagement.vue'
import TodayTasks from '../views/TodayTasks.vue'
import WeeklyStats from '../views/WeeklyStats.vue'
import MonthlyStats from '../views/MonthlyStats.vue'
import Settings from '../views/Settings.vue'

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
    path: '/settings',
    name: 'Settings',
    component: Settings
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