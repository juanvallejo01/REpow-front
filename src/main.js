// PUNTO DE ENTRADA DEL FRONT: crea la app de Vue, le conecta el router y carga los estilos
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/estilos.css'

createApp(App).use(router).mount('#app')
