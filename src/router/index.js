import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// cada ruta es una vista; el layout muestra la vista activa en su <RouterView>
const routes = [
  { path: '/', name: 'Home', component: HomeView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
