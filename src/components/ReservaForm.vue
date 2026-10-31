<script setup>
import { reactive } from 'vue'

// formulario para crear o editar una reserva
// no llama a la API: emite "guardar" con los datos y la vista decide que hacer
const props = defineProps({
  inicial: {
    type: Object,
    default: () => ({ responsable: '', fecha: '', horaInicio: '08:00', horaFin: '09:00' }),
  },
  textoBoton: { type: String, default: 'Reservar' },
  // en "editar" se muestra un boton para cerrar el formulario
  conCancelar: { type: Boolean, default: false },
})

const emit = defineEmits(['guardar', 'cancelar'])

// copia de los datos para no modificar el objeto que llega por props
const form = reactive({ ...props.inicial })
</script>

<template>
  <form class="formulario" @submit.prevent="emit('guardar', { ...form })">
    <label>
      Responsable
      <input v-model="form.responsable" required placeholder="Nombre de quien reserva">
    </label>

    <label>
      Fecha
      <input v-model="form.fecha" type="date" required>
    </label>

    <div class="horas">
      <label>
        Desde
        <input v-model="form.horaInicio" type="time" required>
      </label>
      <label>
        Hasta
        <input v-model="form.horaFin" type="time" required>
      </label>
    </div>

    <div class="acciones">
      <button type="submit">{{ textoBoton }}</button>
      <button v-if="conCancelar" type="button" class="secundario" @click="emit('cancelar')">
        Cerrar
      </button>
    </div>
  </form>
</template>

<style scoped>
.formulario{
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.horas{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.acciones{
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

/* el boton principal ocupa todo el ancho que sobra */
.acciones button[type="submit"]{
  flex: 1;
}
</style>
