<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { GetFacultyDetailData, GetFacultyDetailRoot } from '~~/types/api/faculty/GetFacultyDetail';
import { GetLecturerAcademicGuidanceListStudent } from '~~/types/api/lecturer-academic-guidance/GetLecturerAcademicGuidanceList';

const props = defineProps({
    value: Array as any,
});
onMounted(async () => {
    getLecturerAcademicGuidanceListStudent.value = <GetLecturerAcademicGuidanceListStudent>props.value
})
let getLecturerAcademicGuidanceListStudent = ref(<GetLecturerAcademicGuidanceListStudent>{})
</script>
<template>
    <v-card elevation="10">
        <v-card-item>
            <div class="d-flex align-center">
                <v-avatar rounded="md" size="70">
                    <img contain src="/images/profile/user-1.jpg" height="70" />
                </v-avatar>
                <div class="pl-5">
                    <h5 class="text-h5" v-if="getLecturerAcademicGuidanceListStudent.name">{{
                        getLecturerAcademicGuidanceListStudent.name }}</h5>
                    <h5 class="text-h5" v-if="getLecturerAcademicGuidanceListStudent.nim_number">{{
                        getLecturerAcademicGuidanceListStudent.nim_number }}</h5>
                </div>
            </div>
        </v-card-item>
    </v-card>
</template>