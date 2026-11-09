<script setup>
// COMPONENTE: ventana que compara mis cambios con la version actual
import { aFechaHora, soloFecha, soloHora, textoFecha } from '../utils/fechas.js'

// ventana que aparece cuando el back responde 412:
// otra persona guardo la reserva mientras el usuario la estaba editando
const props = defineProps({
  // lo que el usuario intento guardar (formato del formulario)
  mio: { type: Object, required: true },
  // la reserva como esta ahora en el servidor (la manda el back en el 412)
  actual: { type: Object, required: true },
})

const emit = defineEmits(['usar-actual', 'guardar-mio'])

// '2026-10-20' -> 'martes, 20 de octubre'
function fechaLegible(fecha){
  return textoFecha(aFechaHora(fecha, '12:00'))
}

// cada fila compara un dato: lo mio contra lo que hay en el servidor
const filas = [
  {
    nombre: 'Responsable',
    mio: props.mio.responsable,
    actual: props.actual.responsable,
  },
  {
    nombre: 'Fecha',
    mio: fechaLegible(props.mio.fecha),
    actual: fechaLegible(soloFecha(props.actual.inicio)),
  },
  {
    nombre: 'Horario',
    mio: `${props.mio.horaInicio} – ${props.mio.horaFin}`,
    actual: `${soloHora(props.actual.inicio)} – ${soloHora(props.actual.fin)}`,
  },
]
</script>

<template>
  <!-- fondo oscuro que cubre toda la pantalla -->
  <div class="fondo">
    <div class="ventana" role="dialog" aria-modal="true" aria-labelledby="titulo-conflicto">
      <h2 id="titulo-conflicto">Alguien modificó esta reserva</h2>
      <p class="explicacion">
        Mientras la editabas, otra persona guardó cambios y la reserva pasó a la
        <strong>versión {{ actual.version }}</strong>. Elige con cuál quedarte.
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Tus cambios</th>
            <th>Versión actual</th>
          </tr>
        </thead>
        <tbody>
          <!-- si el dato es distinto, la fila se resalta -->
          <tr v-for="fila in filas" :key="fila.nombre" :class="{ distinto: fila.mio !== fila.actual }">
            <th>{{ fila.nombre }}</th>
            <td>{{ fila.mio }}</td>
            <td>{{ fila.actual }}</td>
          </tr>
        </tbody>
      </table>

      <div class="acciones">
        <button class="secundario" @click="emit('usar-actual')">Quedarme con la versión actual</button>
        <button @click="emit('guardar-mio')">Guardar mis cambios</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fondo{
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 16px;
  background-color: rgba(17, 24, 39, 0.5);
}

.ventana{
  width: 100%;
  max-width: 560px;
  /* si no cabe en la pantalla, la ventana hace scroll por dentro */
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  border-radius: var(--radio);
  background-color: var(--color-tarjeta);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

h2{
  font-size: 20px;
}

.explicacion{
  margin: 8px 0 20px 0;
  color: var(--color-texto-suave);
}

table{
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th, td{
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid var(--color-borde);
}

thead th{
  font-size: 12px;
  text-transform: uppercase;
  color: var(--color-texto-suave);
}

tbody th{
  color: var(--color-texto-suave);
  font-weight: 600;
}

/* los datos que cambiaron se marcan en amarillo */
tr.distinto td{
  background-color: #fef9c3;
  font-weight: 600;
}

.acciones{
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}

/* en celular los botones van uno debajo del otro */
@media (max-width: 500px){
  .acciones{
    flex-direction: column-reverse;
  }
}
</style>
