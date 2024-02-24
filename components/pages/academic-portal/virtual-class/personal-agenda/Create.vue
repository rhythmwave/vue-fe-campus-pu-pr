<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';

const emit = defineEmits(['close', 'reload'])
const classes = ref([
  {
    studyProgram: 'Teknologi Konstruksi Jalan dan Jembatan',
    class: 'A+B',
    subject: 'Pendidikan Pancasila',
    subject_id: '1',
  },
  {
    studyProgram: 'Teknologi Konstruksi Bangunan Air',
    class: 'A',
    subject: 'Pendidikan Pancasila',
    subject_id: '2',
  },
  {
    studyProgram: 'Teknologi Konstruksi Bangunan Air',
    class: 'C',
    subject: 'Pendidikan Pancasila',
    subject_id: '3',
  },
])
</script>
<template>
    <div>
        <v-card>
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Agenda Pribadi</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-autocomplete :items="classes" :item-title="item => `${item.studyProgram} - ${item.class} - ${item.subject}`" item-value="subject_id" color="primary" variant="outlined" hide-details label="Pilih Materi" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field variant="outlined" hide-details label="Nama Agenda" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="['Insidental', 'Mingguan', 'Bulanan']" color="primary" variant="outlined" hide-details label="Pilih Frekuensi" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="date" variant="outlined" hide-details label="Hari Tanggal" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="time" variant="outlined" hide-details label="Jam" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea variant="outlined" hide-details label="Keterangan" />
                        </v-col>
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
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>