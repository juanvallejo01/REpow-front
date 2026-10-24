<script setup>
import { ref, onMounted } from 'vue'
import { getEspacios, mensajeDeError } from '../services/api.js'

const espacios = ref([])
const cargando = ref(true)
const error = ref('')

async function cargarEspacios(){
  try{
    espacios.value = await getEspacios()
  }catch(e){
    error.value = mensajeDeError(e)
  }finally{
    cargando.value = false
  }
}

onMounted(cargarEspacios)
</script>

<template>
  <div class="vista">
    <h1>Espacios</h1>

    <p v-if="cargando">Cargando espacios...</p>
    <p v-else-if="error" class="mensaje error">{{ error }}</p>

    <!-- cada espacio es un enlace a su pagina de detalle -->
    <div v-else class="grid">
      <RouterLink
        v-for="espacio in espacios"
        :key="espacio.id"
        :to="`/espacios/${espacio.id}`"
        class="tarjeta espacio"
      >
        <h2>{{ espacio.nombre }}</h2>
        <p>Capacidad: {{ espacio.capacidad }} personas</p>
        <p>{{ espacio.ubicacion }}</p>
        <span class="ver">Ver horarios →</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.grid{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.espacio{
  color: inherit;
  text-decoration: none;
  transition: transform 0.2s;
}

.espacio:hover{
  transform: scale(1.02);
}

.espacio h2{
  margin: 0 0 8px 0;
  font-size: 18px;
}

.espacio p{
  margin: 4px 0;
  color: #555555;
}

.ver{
  display: inline-block;
  margin-top: 8px;
  color: #2563eb;
}

@media (max-width: 600px){
  .grid{
    grid-template-columns: 1fr;
  }
}
</style>
