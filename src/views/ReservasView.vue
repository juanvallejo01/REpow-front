<script setup>
import { ref, onMounted } from 'vue'
import ReservaForm from '../components/ReservaForm.vue'
import { getReservas, getEspacios, editarReserva, cancelarReserva, mensajeDeError } from '../services/api.js'
import { aFechaHora, soloFecha, soloHora, textoFecha } from '../utils/fechas.js'

const reservas = ref([])
// { 1: 'Sala de reuniones A', 2: 'Auditorio', ... } para mostrar el nombre del espacio
const nombresEspacios = ref({})
const cargando = ref(true)
const error = ref('')
const exito = ref('')
// id de la reserva que se esta editando (null = ninguna)
const editando = ref(null)

async function cargarReservas(){
  try{
    const [lista, espacios] = await Promise.all([getReservas(), getEspacios()])
    reservas.value = lista
    nombresEspacios.value = Object.fromEntries(espacios.map((e) => [e.id, e.nombre]))
  }catch(e){
    error.value = mensajeDeError(e)
  }finally{
    cargando.value = false
  }
}

// datos de una reserva en el formato del formulario
function datosDelFormulario(reserva){
  return {
    responsable: reserva.responsable,
    fecha: soloFecha(reserva.inicio),
    horaInicio: soloHora(reserva.inicio),
    horaFin: soloHora(reserva.fin),
  }
}

async function guardar(reserva, datos){
  error.value = ''
  exito.value = ''
  try{
    await editarReserva(reserva, {
      responsable: datos.responsable,
      inicio: aFechaHora(datos.fecha, datos.horaInicio),
      fin: aFechaHora(datos.fecha, datos.horaFin),
    })
    exito.value = 'Reserva actualizada'
    editando.value = null
  }catch(e){
    // 412: otra persona la cambio antes (la ventana para resolverlo va despues)
    error.value = mensajeDeError(e)
  }
  // se recarga para tener la version nueva de cada reserva
  await cargarReservas()
}

async function cancelar(reserva){
  if (!confirm(`¿Cancelar la reserva de ${reserva.responsable}?`)) return

  error.value = ''
  exito.value = ''
  try{
    await cancelarReserva(reserva)
    exito.value = 'Reserva cancelada'
  }catch(e){
    error.value = mensajeDeError(e)
  }
  await cargarReservas()
}

onMounted(cargarReservas)
</script>

<template>
  <div class="vista">
    <h1>Reservas</h1>

    <p v-if="error" class="mensaje error">{{ error }}</p>
    <p v-if="exito" class="mensaje exito">{{ exito }}</p>

    <p v-if="cargando">Cargando reservas...</p>
    <p v-else-if="reservas.length === 0" class="vacio">Todavía no hay reservas.</p>

    <div v-else class="lista">
      <div
        v-for="reserva in reservas"
        :key="reserva.id"
        class="tarjeta reserva"
        :class="{ cancelada: reserva.estado === 'cancelada' }"
      >
        <div class="cabecera">
          <h2>{{ nombresEspacios[reserva.espacio_id] }}</h2>
          <span class="estado">{{ reserva.estado }}</span>
        </div>

        <p>{{ textoFecha(reserva.inicio) }} · {{ soloHora(reserva.inicio) }} – {{ soloHora(reserva.fin) }}</p>
        <p>Responsable: {{ reserva.responsable }}</p>
        <!-- la version se muestra para ver como sube con cada cambio -->
        <p class="version">Versión {{ reserva.version }}</p>

        <ReservaForm
          v-if="editando === reserva.id"
          :inicial="datosDelFormulario(reserva)"
          texto-boton="Guardar cambios"
          con-cancelar
          @guardar="(datos) => guardar(reserva, datos)"
          @cancelar="editando = null"
        />

        <div v-else-if="reserva.estado === 'activa'" class="acciones">
          <button class="secundario" @click="editando = reserva.id">Editar</button>
          <button class="peligro" @click="cancelar(reserva)">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lista{
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cabecera{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reserva h2{
  margin: 0;
  font-size: 18px;
}

.reserva p{
  margin: 6px 0;
  color: #555555;
}

.estado{
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  background-color: #dcfce7;
  color: #166534;
}

.cancelada{
  opacity: 0.6;
}

.cancelada .estado{
  background-color: #e5e7eb;
  color: #555555;
}

.version{
  font-size: 12px;
}

.acciones{
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
</style>
