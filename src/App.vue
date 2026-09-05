<!-- src/App.vue -->
<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>

<style scoped>
#app {
  width       : 100vw;
  height      : 100vh;
  margin      : 0;
  padding     : 0;
  overflow    : hidden;
  font-family : 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>