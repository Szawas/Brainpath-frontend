import { createRouter, createWebHistory } from 'vue-router'

import Landing from '@/views/Landing.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import Onboarding from '@/views/Onboarding.vue'
import Reframing from '@/views/Reframing.vue'
import InterestForm from '@/views/InterestForm.vue'
import Recommendation from '@/views/Recommendation.vue'
import ResourcePreview from '@/views/ResourcePreview.vue'
import Profile from '@/views/Profile.vue'
import History from '@/views/History.vue'
import Chatbot from '@/views/Chatbot.vue'
import AdminResources from '@/views/AdminResources.vue'
import AdminAnalytics from '@/views/AdminAnalytics.vue'
import AdminSettings from '@/views/AdminSettings.vue'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: Landing,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      role: 'user',
    },
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: Onboarding,
    meta: {
      requiresAuth: true,
      role: 'user',
    },
  },
  {
    path: '/reframing',
    name: 'reframing',
    component: Reframing,
    meta: {
      requiresAuth: true,
      role: 'user',
    },
  },
  {
    path: '/interest-form',
    name: 'interest-form',
    component: InterestForm,
    meta: {
      requiresAuth: true,
      role: 'user',
    },
  },
  {
    path: '/recommendation',
    name: 'recommendation',
    component: Recommendation,
    meta: {
      requiresAuth: true,
      role: 'user',
    },
  },
  {
    path: '/resources/:id',
    name: 'resource-preview',
    component: ResourcePreview,
    meta: {
      requiresAuth: true,
      role: 'user',
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      requiresAuth: true,
      role: 'user',
    },
  },
  {
    path: '/history',
    name: 'history',
    component: History,
    meta: {
      requiresAuth: true,
      role: 'user',
    },
  },
  {
    path: '/chatbot',
    name: 'chatbot',
    component: Chatbot,
    meta: {
      requiresAuth: true,
      role: 'user',
    },
  },
  {
    path: '/admin/resources',
    name: 'admin-resources',
    component: AdminResources,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/admin/analytics',
    name: 'admin-analytics',
    component: AdminAnalytics,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: AdminSettings,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 112,
        behavior: 'smooth',
      }
    }

    return {
      top: 0,
      behavior: 'smooth',
    }
  },
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    }
  }
  
  // Jika sudah login dan mencoba ke halaman public (login/register/landing)
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register' || to.path === '/')) {
    return authStore.user?.role === 'admin' ? '/admin/resources' : '/dashboard'
  }

  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    return authStore.user?.role === 'admin' ? '/admin/resources' : '/dashboard'
  }

  return true
})

export default router
