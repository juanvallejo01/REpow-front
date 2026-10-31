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
    <div class="vista-titulo">
      <h1>Espacios</h1>
      <p>Elige un espacio para ver su disponibilidad y reservar.</p>
    </div>

    <p v-if="cargando" class="vacio">Cargando espacios...</p>
    <p v-else-if="error" class="mensaje error">{{ error }}</p>

    <!-- cada espacio es un enlace a su pagina de detalle -->
    <div v-else class="grid">
      <RouterLink
        v-for="espacio in espacios"
        :key="espacio.id"
        :to="`/espacios/${espacio.id}`"
        class="tarjeta espacio"
      >
        <!-- primera letra del nombre como "icono" -->
        <span class="inicial">{{ espacio.nombre[0] }}</span>

        <h2>{{ espacio.nombre }}</h2>
        <p class="ubicacion">{{ espacio.ubicacion }}</p>

        <div class="pie">
          <span class="etiqueta">{{ espacio.capacidad }} personas</span>
          <span class="ver">Ver disponibilidad →</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* las tarjetas se acomodan solas: 2 por fila en computador y 1 en celular */
.grid{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.espacio{
  display: flex;
  flex-direction: column;
  color: inherit;
  transition: border-color 0.2s, transform 0.2s;
}

.espacio:hover{
  border-color: var(--color-principal);
  transform: translateY(-2px);
}

.inicial{
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
  border-radius: 10px;
  background-color: var(--color-principal-suave);
  color: var(--color-principal);
  font-weight: 700;
  font-size: 18px;
}

.espacio h2{
  margin-bottom: 4px;
}

.ubicacion{
  margin: 0 0 16px 0;
  color: var(--color-texto-suave);
  font-size: 14px;
}

/* capacidad a la izquierda y enlace a la derecha, siempre al fondo de la tarjeta */
.pie{
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ver{
  font-size: 14px;
  font-weight: 600;
  color: var(--color-principal);
}
</style>
