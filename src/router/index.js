import { createRouter, createWebHistory } from 'vue-router'
import EspaciosView from '../views/EspaciosView.vue'
import EspacioView from '../views/EspacioView.vue'
import ReservasView from '../views/ReservasView.vue'

// cada ruta es una vista; el layout muestra la vista activa en su <RouterView>
const routes = [
  { path: '/', redirect: '/espacios' },
  { path: '/espacios', name: 'Espacios', component: EspaciosView },
  // props: true -> el :id de la url le llega a la vista como prop
  { path: '/espacios/:id', name: 'Espacio', component: EspacioView, props: true },
  { path: '/reservas', name: 'Reservas', component: ReservasView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
