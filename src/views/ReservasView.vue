<script setup>
import { ref, onMounted } from 'vue'
import ReservaForm from '../components/ReservaForm.vue'
import { getReservas, getEspacios, editarReserva, cancelarReserva, mensajeDeError } from '../services/api.js'
import { aFechaHora, soloFecha, soloHora, numeroDia, mesCorto } from '../utils/fechas.js'

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
    exito.value = 'Reserva actualizada correctamente.'
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
    exito.value = 'Reserva cancelada.'
  }catch(e){
    error.value = mensajeDeError(e)
  }
  await cargarReservas()
}

onMounted(cargarReservas)
</script>

<template>
  <div class="vista">
    <div class="vista-titulo">
      <h1>Reservas</h1>
      <p>Cada vez que una reserva cambia, su versión sube en 1.</p>
    </div>

    <p v-if="error" class="mensaje error">{{ error }}</p>
    <p v-if="exito" class="mensaje exito">{{ exito }}</p>

    <p v-if="cargando" class="vacio">Cargando reservas...</p>
    <p v-else-if="reservas.length === 0" class="vacio">Todavía no hay reservas.</p>

    <div v-else class="lista">
      <div
        v-for="reserva in reservas"
        :key="reserva.id"
        class="tarjeta reserva"
        :class="{ cancelada: reserva.estado === 'cancelada' }"
      >
        <div class="fila">
          <!-- cuadro con el dia y el mes -->
          <div class="fecha">
            <span class="dia">{{ numeroDia(reserva.inicio) }}</span>
            <span class="mes">{{ mesCorto(reserva.inicio) }}</span>
          </div>

          <div class="info">
            <h2>{{ nombresEspacios[reserva.espacio_id] }}</h2>
            <p>{{ soloHora(reserva.inicio) }} – {{ soloHora(reserva.fin) }} · {{ reserva.responsable }}</p>
          </div>

          <div class="estado">
            <span class="etiqueta" :class="{ verde: reserva.estado === 'activa' }">{{ reserva.estado }}</span>
            <!-- la version se muestra para ver como sube con cada cambio -->
            <span class="etiqueta">v{{ reserva.version }}</span>
          </div>
        </div>

        <ReservaForm
          v-if="editando === reserva.id"
          class="editar"
          :inicial="datosDelFormulario(reserva)"
          texto-boton="Guardar cambios"
          con-cancelar
          @guardar="(datos) => guardar(reserva, datos)"
          @cancelar="editando = null"
        />

        <div v-else-if="reserva.estado === 'activa'" class="acciones">
          <button class="secundario" @click="editando = reserva.id">Editar</button>
          <button class="peligro" @click="cancelar(reserva)">Cancelar reserva</button>
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

/* fecha | informacion | estado, en una sola fila */
.fila{
  display: flex;
  align-items: center;
  gap: 16px;
}

.fecha{
  width: 56px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
  border-radius: 10px;
  background-color: var(--color-principal-suave);
  color: var(--color-principal);
}

.dia{
  font-size: 20px;
  font-weight: 700;
  line-height: 1.1;
}

.mes{
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

/* la informacion ocupa todo el espacio del medio */
.info{
  flex: 1;
}

.info h2{
  margin-bottom: 2px;
}

.info p{
  margin: 0;
  color: var(--color-texto-suave);
  font-size: 14px;
}

.estado{
  display: flex;
  gap: 6px;
}

.acciones{
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-borde);
}

.editar{
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-borde);
}

.cancelada{
  opacity: 0.6;
}

/* en pantallas pequenas el estado baja debajo de la informacion */
@media (max-width: 600px){
  .fila{
    flex-wrap: wrap;
  }

  .estado{
    width: 100%;
  }
}
</style>
