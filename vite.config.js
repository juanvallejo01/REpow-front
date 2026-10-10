import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// configuracion minima: solo el plugin para leer archivos .vue
export default defineConfig({
  plugins: [vue()],
})
