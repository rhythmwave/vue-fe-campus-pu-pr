<script setup lang="ts">
// maximum 16
const props = defineProps({
    space: String,
});
</script>

<template>
    <span :class="'pr-'+ space "></span>
</template>