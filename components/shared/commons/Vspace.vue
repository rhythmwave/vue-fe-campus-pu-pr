<script setup lang="ts">
// maximum 16
const props = defineProps({
    space: String,
});
</script>

<template>
    <div :class="'pt-'+ space "></div>
</template>