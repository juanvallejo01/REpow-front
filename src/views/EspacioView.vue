<script setup>
import { ref, onMounted } from 'vue'
import ReservaForm from '../components/ReservaForm.vue'
import { getEspacio, getOcupacion, crearReserva, mensajeDeError } from '../services/api.js'
import { hoy, aFechaHora, soloHora } from '../utils/fechas.js'

// el :id de la url (ver router/index.js)
const props = defineProps({
  id: { type: String, required: true },
})

const espacio = ref(null)
const fecha = ref(hoy())
const ocupadas = ref([])
const error = ref('')
const exito = ref('')
// el formulario se reinicia cuando cambia la fecha o se crea una reserva (ver :key en el template)
const reservasCreadas = ref(0)

async function cargarOcupacion(){
  try{
    ocupadas.value = await getOcupacion(props.id, fecha.value)
  }catch(e){
    error.value = mensajeDeError(e)
  }
}

async function cargarEspacio(){
  try{
    espacio.value = await getEspacio(props.id)
    await cargarOcupacion()
  }catch(e){
    error.value = mensajeDeError(e)
  }
}

async function reservar(datos){
  error.value = ''
  exito.value = ''
  try{
    await crearReserva({
      espacio_id: Number(props.id),
      responsable: datos.responsable,
      inicio: aFechaHora(datos.fecha, datos.horaInicio),
      fin: aFechaHora(datos.fecha, datos.horaFin),
    })
    exito.value = 'Reserva creada correctamente.'
    fecha.value = datos.fecha
    reservasCreadas.value++
    await cargarOcupacion()
  }catch(e){
    // ej: 409 "El espacio ya esta reservado en ese horario"
    error.value = mensajeDeError(e)
  }
}

onMounted(cargarEspacio)
</script>

<template>
  <div class="vista">
    <RouterLink to="/espacios" class="volver">← Espacios</RouterLink>

    <p v-if="!espacio && !error" class="vacio">Cargando espacio...</p>

    <div v-if="espacio" class="vista-titulo">
      <h1>{{ espacio.nombre }}</h1>
      <div class="datos">
        <span class="etiqueta">{{ espacio.capacidad }} personas</span>
        <span class="etiqueta">{{ espacio.ubicacion }}</span>
      </div>
    </div>

    <p v-if="error" class="mensaje error">{{ error }}</p>
    <p v-if="exito" class="mensaje exito">{{ exito }}</p>

    <div v-if="espacio" class="columnas">
      <!-- horarios ocupados del dia elegido -->
      <section class="tarjeta">
        <div class="cabecera">
          <h2>Disponibilidad</h2>
          <input v-model="fecha" type="date" @change="cargarOcupacion">
        </div>

        <p v-if="ocupadas.length === 0" class="vacio">Libre todo el día.</p>

        <ul v-else class="horarios">
          <li v-for="reserva in ocupadas" :key="reserva.id">
            <span class="etiqueta azul">{{ soloHora(reserva.inicio) }} – {{ soloHora(reserva.fin) }}</span>
            <span>{{ reserva.responsable }}</span>
          </li>
        </ul>
      </section>

      <!-- formulario para reservar -->
      <section class="tarjeta">
        <h2>Nueva reserva</h2>
        <ReservaForm
          :key="`${fecha}-${reservasCreadas}`"
          :inicial="{ responsable: '', fecha, horaInicio: '08:00', horaFin: '09:00' }"
          @guardar="reservar"
        />
      </section>
    </div>
  </div>
</template>

<style scoped>
.volver{
  display: inline-block;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 14px;
}

.datos{
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.columnas{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

/* titulo de la tarjeta a la izquierda y fecha a la derecha */
.cabecera{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.cabecera h2{
  margin-bottom: 0;
}

.horarios{
  list-style: none;
  margin: 0;
  padding: 0;
}

/* cada horario ocupado es una fila separada por una linea */
.horarios li{
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-borde);
}

.horarios li:last-child{
  border-bottom: none;
}

/* en pantallas pequenas las tarjetas van una debajo de la otra */
@media (max-width: 700px){
  .columnas{
    grid-template-columns: 1fr;
  }
}
</style>
