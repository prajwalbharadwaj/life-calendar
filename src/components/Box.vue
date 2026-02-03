<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  classes: {
    default: 'bg-blue-100 border-blue-300'
  }
})
</script>

<template>
  <div :class="classes" class="size-4 border-2" />
</template>