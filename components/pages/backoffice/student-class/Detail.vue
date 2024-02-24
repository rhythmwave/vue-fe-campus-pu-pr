<script setup lang="ts">
import { GetStudentClassParticipantData } from "~~/types/api/student-class/GetStudentClassParticipantList";

const props = defineProps({
    studentParticipants: Array as any,
});
const studentParticipants = ref(<GetStudentClassParticipantData[]>[])
onMounted(async () => {
    studentParticipants.value = props.studentParticipants
});
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Daftar Peserta Kelas</span>
        </v-card-title>
        <v-table class="month-table">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">KODE DIKTI</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in studentParticipants">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.student_nim_number }}</td>
                    <td>{{ item.student_name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.dikti_study_program_code }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>