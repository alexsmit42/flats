import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueI18n)

import Firebase from 'firebase/app'
import 'firebase/auth'

import FirebaseConfig from './firebase'
Firebase.initializeApp(FirebaseConfig);

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

import router from './router'

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
