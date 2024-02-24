<script setup lang="ts">
const emit = defineEmits(['close', 'reload'])
const props = defineProps({
    title: String,
});
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">{{ title }}</span>
        </v-card-title>
        <v-col cols="12">
            <v-alert type="info" variant="tonal">
                Keterangan : 
                <br />
                Form Tambah Post dapat digunakan untuk membalas pesan diskusi yang sudah dipilih.
            </v-alert>
        </v-col>
        <v-form ref="form" lazy-validation>
            <v-col cols="12" sm="12">
                <v-text-field variant="outlined" hide-details label="Judul Postingan" />
            </v-col>
            <v-col cols="12" sm="12">
                <v-textarea label="Isi"></v-textarea>
            </v-col>
        </v-form>
        <v-col cols="12">
            <v-card-actions class="pa-4">
                <v-spacer />
                <v-btn color="error" @click="$emit('close')">
                    Batal
                </v-btn>
                <v-btn color="secondary">
                    Tambah
                </v-btn>
            </v-card-actions>
        </v-col>
    </v-card>
</template>