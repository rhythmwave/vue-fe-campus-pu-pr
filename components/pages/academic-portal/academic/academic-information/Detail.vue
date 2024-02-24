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
            Informasi Akademik berisi informasi-informasi yang berkaitan dengan hal akademis.
            </v-alert>
        </v-col>
        <v-table class="month-table">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">Informasi terkait KHS, KRS dan Perwalian</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>02 Februari 2023</td>
                </tr>
                <tr>
                    <td>Assalamu'alaikum warohmatullahi wabarokatuh bapak ibu, Izin menginformasikan Sistem Ecampuz terkait Kartu Hasil Studi (KHS), dikarena kan ada mata kuliah yang masih belum terinput nilainya maka KHS yang semula tgl 1 Februari 2023 diundur tgl 6 Februari 2023 dan untuk Proses KRS semester Genap 2022/2023 dapat dilakukan pada tgl 8 - 11 Februari 2023 sedangkan untuk perwalian dapat dilakukan pada tgl 8 - 12 Februari 2023, Demikian kami informasikan terima kasih🙏🏽🙏🏽</td>
                </tr>
            </tbody>
        </v-table>
        <v-col cols="12">
            <v-card-actions class="pa-4">
                <v-spacer />
                <v-btn color="error" @click="$emit('close')">
                    Batal
                </v-btn>
            </v-card-actions>
        </v-col>
    </v-card>
</template>