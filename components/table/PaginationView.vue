<script setup lang="ts">
const props = defineProps({
  limit: { type: Number, default: 0 },
  page: { type: Number, default: 0 },
  total_pages: { type: Number, default: 0 },
  total_records: { type: Number, default: 0 }
})

const emit = defineEmits(['prevPage', 'jumpPage', 'nextPage'])

</script>

<template>
  <div>
    <ul style="display: inline-block;">
      <v-btn color="primary" style="padding: 2px !important; height: 25px; min-width: 30px; margin: 4px;" @click="$emit('prevPage')">
        &#8592;
      </v-btn>
      <v-btn v-for="(item, i) of props.total_pages" :key="i.toString()" color="primary" style="padding: 2px !important; height: 25px; min-width: 30px; margin: 4px;" @click="$emit('jumpPage', item)">
        {{ item }}
      </v-btn>
      <v-btn color="primary" style="padding: 2px !important; height: 25px; min-width: 30px; margin: 4px;" @click="$emit('nextPage')">
        &#8594;
      </v-btn>
      <SharedCommonsHspace space="3" />
      <span class="text-body-2">({{ total_records }} records) </span>
    </ul>
  </div>
</template>
