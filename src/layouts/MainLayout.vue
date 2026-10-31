<script setup>
// enlaces del encabezado: cada uno lleva a una vista
const enlaces = [
  { nombre: 'Espacios', ruta: '/espacios' },
  { nombre: 'Reservas', ruta: '/reservas' },
]
</script>

<template>
  <header class="encabezado">
    <div class="encabezado-contenido">
      <RouterLink to="/" class="marca">
        <span class="logo">R</span>
        REpow
      </RouterLink>

      <!-- el enlace queda "activo" tambien en sus paginas internas (ej: /espacios/1) -->
      <nav>
        <RouterLink
          v-for="enlace in enlaces"
          :key="enlace.ruta"
          :to="enlace.ruta"
          :class="{ activo: $route.path.startsWith(enlace.ruta) }"
        >
          {{ enlace.nombre }}
        </RouterLink>
      </nav>
    </div>
  </header>

  <!-- aqui se muestra la vista activa -->
  <main>
    <slot />
  </main>
</template>

<style scoped>
/* barra superior: queda fija arriba al hacer scroll */
.encabezado{
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--color-tarjeta);
  border-bottom: 1px solid var(--color-borde);
}

.encabezado-contenido{
  max-width: 960px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.marca{
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-texto);
}

.logo{
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background-color: var(--color-principal);
  color: #ffffff;
}

nav{
  display: flex;
  gap: 4px;
}

nav a{
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  color: var(--color-texto-suave);
}

nav a:hover{
  color: var(--color-texto);
  background-color: var(--color-fondo);
}

nav a.activo{
  color: var(--color-principal);
  background-color: var(--color-principal-suave);
}
</style>
