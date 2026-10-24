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
    exito.value = 'Reserva creada'
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
    <RouterLink to="/espacios">← Volver</RouterLink>

    <p v-if="!espacio && !error">Cargando espacio...</p>

    <template v-if="espacio">
      <h1>{{ espacio.nombre }}</h1>
      <p class="detalle">Capacidad: {{ espacio.capacidad }} personas · {{ espacio.ubicacion }}</p>
    </template>

    <p v-if="error" class="mensaje error">{{ error }}</p>
    <p v-if="exito" class="mensaje exito">{{ exito }}</p>

    <div v-if="espacio" class="columnas">
      <!-- horarios ocupados del dia elegido -->
      <section class="tarjeta">
        <h2>Horarios ocupados</h2>
        <input v-model="fecha" type="date" @change="cargarOcupacion">

        <p v-if="ocupadas.length === 0" class="vacio">No hay reservas este día.</p>
        <ul v-else>
          <li v-for="reserva in ocupadas" :key="reserva.id">
            <strong>{{ soloHora(reserva.inicio) }} – {{ soloHora(reserva.fin) }}</strong>
            {{ reserva.responsable }}
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
.detalle{
  color: #555555;
  margin-top: -8px;
}

.columnas{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

h2{
  margin-top: 0;
  font-size: 18px;
}

input[type="date"]{
  padding: 8px;
  border: 1px solid #cccccc;
  border-radius: 6px;
}

ul{
  padding-left: 18px;
}

li{
  margin: 6px 0;
}

@media (max-width: 600px){
  .columnas{
    grid-template-columns: 1fr;
  }
}
</style>
