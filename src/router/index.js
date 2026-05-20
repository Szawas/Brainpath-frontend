import { createRouter, createWebHistory } from 'vue-router'

import Landing from '@/views/Landing.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Onboarding from '@/views/Onboarding.vue'
import Reframing from '@/views/Reframing.vue'
import InterestForm from '@/views/InterestForm.vue'
import OnboardingRecommendation from '@/views/OnboardingRecommendation.vue'
import Recommendation from '@/views/Recommendation.vue'
import CourseDetail from '@/views/CourseDetail.vue'
import Learning from '@/views/Learning.vue'
import Feedback from '@/views/Feedback.vue'

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
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: Onboarding,
  },
  {
    path: '/reframing',
    name: 'reframing',
    component: Reframing,
  },
  {
    path: '/interest-form',
    name: 'interest-form',
    component: InterestForm,
  },
  {
    path: '/onboarding-recommendation',
    name: 'onboarding-recommendation',
    component: OnboardingRecommendation,
  },
  {
    path: '/recommendation',
    name: 'recommendation',
    component: Recommendation,
  },
  {
    path: '/courses/:id',
    name: 'course-detail',
    component: CourseDetail,
  },
  {
    path: '/learn/:id',
    name: 'learning',
    component: Learning,
  },
  {
    path: '/feedback/:id',
    name: 'feedback',
    component: Feedback,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
