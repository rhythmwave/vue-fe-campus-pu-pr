
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerAcademicGuidanceListData } from '~~/types/api/lecturer-academic-guidance/GetLecturerAcademicGuidanceList';

const props = defineProps({
    getLecturerAcademicGuidanceListData: Array as any,
});

onMounted(() => {
    detailLecturerAcademicGuidance.value = <GetLecturerAcademicGuidanceListData>props.getLecturerAcademicGuidanceListData
    console.log(detailLecturerAcademicGuidance.value)
});
const detailLecturerAcademicGuidance = ref(<GetLecturerAcademicGuidanceListData>{
    id: "",
    academic_guidance_id: "",
    subject: "",
    session_date: "",
    summary: "",
    files: [],
    students: [],
});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Files</span>
        </v-card-title>
        <v-row>
            <v-col :cols="12">
                <PagesAcademicPortalLecturerAcademicGuidanceFileItem v-for="itm in detailLecturerAcademicGuidance.files"
                    :value="itm" />
            </v-col>
        </v-row>
    </v-card>
</template>

<style lang="scss"></style>
