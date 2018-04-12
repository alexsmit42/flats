import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueI18n)

import Firebase from 'firebase/app'
import 'firebase/auth'

Firebase.initializeApp({
  apiKey: 'AIzaSyBmgSGpSGbfaRwByySTXJHIbI00fBRCo80',
  authDomain: 'flats-c3f88.firebaseapp.com',
  databaseURL: 'https://flats-c3f88.firebaseio.com',
  projectId: 'flats-c3f88',
  storageBucket: 'flats-c3f88.appspot.com',
  messagingSenderId: '704028153692'
});

import App from './App.vue'

Vue.config.devtools = true


// Store

const store = new Vuex.Store({
  state: {
    days: {},
    flats: [],
    lastDay: ''
  },
  mutations: {
    updateDays (state, days) {
      state.days = days
    },
    updateFlats (state, data) {
      state.flats = data.flats
      state.lastDay = data.lastDay
    }
  }
})


// Routes

import {routes} from './routes'
const router = new VueRouter({
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


// Locales

const localeMessages = require('./locales/')
const i18n = new VueI18n({
  locale: 'en',
  messages: localeMessages
})


Firebase.auth().onAuthStateChanged( () => {
  new Vue({
    el: '#app',
    store,
    router,
    i18n,
    render: h => h(App)
  })
});

require('./styles/_vars.scss')
