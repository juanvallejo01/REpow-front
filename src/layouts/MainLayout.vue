<script setup>
// enlaces del encabezado: cada uno lleva a una vista
const enlaces = [
  { nombre: 'Espacios', ruta: '/espacios' },
  { nombre: 'Reservas', ruta: '/reservas' },
]
</script>

<template>
  <!-- encabezado: el enlace queda "activo" tambien en sus paginas internas (ej: /espacios/1) -->
  <header class="encabezado">
    <span class="marca">REpow</span>
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
  </header>

  <!-- aqui se muestra la vista activa -->
  <main class="contenido">
    <slot />
  </main>
</template>

<style>
/* estilos globales (sin "scoped"): los usan todas las vistas */
body{
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f5f7;
  color: #222222;
}

#app{
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* barra de navegacion */
.encabezado{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: #222222;
}

.marca{
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;
}

.encabezado nav{
  display: flex;
  gap: 8px;
}

.encabezado a{
  color: #ffffff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
}

.encabezado a:hover{
  background-color: #555555;
}

.encabezado a.activo{
  background-color: #ffffff;
  color: #222222;
}

/* el contenido ocupa todo el espacio bajo el encabezado y hace scroll solo */
.contenido{
  flex: 1;
  overflow-y: auto;
}

/* contenedor de cada vista: centrado y con ancho maximo */
.vista{
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* caja blanca que usan las tarjetas y formularios */
.tarjeta{
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

button{
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

button.secundario{
  background-color: #e5e7eb;
  color: #222222;
}

button.peligro{
  background-color: #dc2626;
}

/* mensajes para el usuario */
.mensaje{
  padding: 10px 14px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.mensaje.error{
  background-color: #fee2e2;
  color: #991b1b;
}

.mensaje.exito{
  background-color: #dcfce7;
  color: #166534;
}

.vacio{
  color: #777777;
}
</style>
