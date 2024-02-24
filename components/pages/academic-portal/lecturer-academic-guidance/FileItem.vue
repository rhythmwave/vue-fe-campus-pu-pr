<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { GetFacultyDetailData, GetFacultyDetailRoot } from '~~/types/api/faculty/GetFacultyDetail';
import { GetLecturerAcademicGuidanceListFile } from '~~/types/api/lecturer-academic-guidance/GetLecturerAcademicGuidanceList';

const props = defineProps({
    value: Array as any,
});
onMounted(async () => {
    getLecturerAcademicGuidanceListFile.value = <GetLecturerAcademicGuidanceListFile>props.value
})
let getLecturerAcademicGuidanceListFile = ref(<GetLecturerAcademicGuidanceListFile>{})
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
                    <a v-if="getLecturerAcademicGuidanceListFile.file_url" target="_blank"
                        :href="getLecturerAcademicGuidanceListFile.file_url">
                        <h5 class="text-h5">{{
                            getLecturerAcademicGuidanceListFile.file_url }}</h5>
                    </a>
                </div>
            </div>
        </v-card-item>
</v-card></template>