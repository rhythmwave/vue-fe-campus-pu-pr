<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { GetFacultyDetailData, GetFacultyDetailRoot } from '~~/types/api/faculty/GetFacultyDetail';
import { GetStudentAcademicGuidanceSessionFile } from '~~/types/api/student-academic-guidance/GetStudentAcademicGuidanceSessionList';

const props = defineProps({
    value: Array as any,
});
onMounted(async () => {
    getStudentAcademicGuidanceSessionFile.value = <GetStudentAcademicGuidanceSessionFile>props.value
})
let getStudentAcademicGuidanceSessionFile = ref(<GetStudentAcademicGuidanceSessionFile>{})
</script>
<template>
    <v-card elevation="10">
        <v-card-item>
            <div class="d-flex align-center">
                <v-avatar rounded="md" size="70">
                    <!-- <img contain src="/images/profile/user-1.jpg" height="70" /> -->
                    <FileIcon></FileIcon>
                </v-avatar>
                <div class="pl-5">
                    <a v-if="getStudentAcademicGuidanceSessionFile.file_url" target="_blank"
                        :href="getStudentAcademicGuidanceSessionFile.file_url">
                        <h5 class="text-h5">{{
                            getStudentAcademicGuidanceSessionFile.file_url }}</h5>
                    </a>
                </div>
            </div>
        </v-card-item>
</v-card></template>