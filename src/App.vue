<script setup>
import MainLayout from './layouts/MainLayout.vue'
</script>

<template>
  <!-- el layout pone el encabezado; la vista de la ruta actual va en su slot -->
  <MainLayout>
    <RouterView />
  </MainLayout>
</template>
