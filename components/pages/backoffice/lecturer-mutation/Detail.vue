
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerMutationListData } from '~~/types/api/lecturer-mutation/GetLecturerMutationList';

const props = defineProps({
    getLecturerMutationListData: Array as any,
});

onMounted(() => {
    detailLecturerMutation.value = <GetLecturerMutationListData>props.getLecturerMutationListData
});
const detailLecturerMutation = ref(<GetLecturerMutationListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailLecturerMutation.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailLecturerMutation.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
