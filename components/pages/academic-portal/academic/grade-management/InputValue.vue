<script setup lang="ts">
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
            Pengelolaan Nilai dapat digunakan untuk memasukkan nilai mahasiswa secara on-line. Dosen dapat memberikan nilai sesuai dengan Mata Kuliah yang diampunya. Untuk memasukkan nilai Mata Kuliah yang ditawarkan oleh program studi lain dapat dilakukan dengan memilih Sistem Informasi Akademik yang bersesuaian.
            </v-alert>
        </v-col>
        <v-table class="month-table">
            <tbody>
                adsad
            </tbody>
        </v-table>
    </v-card>
</template>