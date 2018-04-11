import FlatsPage from './components/FlatsPage.vue'
import HistoryPage from './components/HistoryPage.vue'
import AdminPage from './components/AdminPage.vue'
import FavoritesPage from './components/FavoritesPage.vue'
import LoginPage from './components/LoginPage.vue'
import RegistrationPage from './components/RegistrationPage.vue'

export const routes = [
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