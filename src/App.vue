<template>
  <div class="all">
    <router-view />
  </div>
</template>

<style>
.all {
  padding: 50px;
}
</style>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>
