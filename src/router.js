import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'

import Firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(VueRouter)
Vue.use(Meta)

import FlatsPage from './components/FlatsPage.vue'
import HistoryPage from './components/HistoryPage.vue'
import AdminPage from './components/AdminPage.vue'
import FavoritesPage from './components/FavoritesPage.vue'
import LoginPage from './components/LoginPage.vue'
import RegistrationPage from './components/RegistrationPage.vue'

const routes = [
  {
    path: '/', redirect: 'flats'
  },
  {
    path: '/flats', component: FlatsPage, name: 'flats',
  },
  {
    path: '/history', component: HistoryPage, name: 'history'
  },
  {
    path: '/admin', component: AdminPage, name: 'admin', 
    meta: {
        isRequiredAuth: true
    }
  },
  {
    path: '/favorites', component: FavoritesPage, name: 'favorites', 
    meta: {
        isRequiredAuth: true
    }
  },
  {
    path: '/login', component: LoginPage, name: 'login',
    meta: {
        noMenu: true
    }
  },
  {
    path: '/registration', component: RegistrationPage, name: 'registration',
    meta: {
        noMenu: true
    }
  }
]

const router =  new VueRouter({
  routes,
  linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  const currentUser = Firebase.auth().currentUser;

  let isRequiredAuth = to.matched.some(record => {
    return record.meta.isRequiredAuth
  })

  if (isRequiredAuth && !currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router