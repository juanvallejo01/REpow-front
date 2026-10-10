<script setup>
// enlaces del encabezado: cada uno lleva a una vista
const enlaces = [
  { nombre: 'Inicio', ruta: '/' },
]
</script>

<template>
  <!-- encabezado: RouterLink le pone la clase "activo" al enlace de la vista abierta -->
  <header class="encabezado">
    <RouterLink
      v-for="enlace in enlaces"
      :key="enlace.ruta"
      :to="enlace.ruta"
      active-class="activo"
    >
      {{ enlace.nombre }}
    </RouterLink>
  </header>

  <!-- aqui se muestra la vista activa -->
  <main class="contenido">
    <slot />
  </main>
</template>

<style>
/* estilos globales (sin "scoped"): el encabezado y el area de contenido */
body{
  margin: 0;
}

#app{
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.encabezado{
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 12px;
}

.contenido{
  flex: 1;
  overflow-y: auto;
}
</style>
