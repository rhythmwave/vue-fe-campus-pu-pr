
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetDocumentActionListData } from '~~/types/api/document-action/GetDocumentActionList';

const props = defineProps({
    getDocumentActionListData: Array as any,
});

onMounted(() => {
    detailDocumentAction.value = <GetDocumentActionListData>props.getDocumentActionListData
});
const detailDocumentAction = ref(<GetDocumentActionListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailDocumentAction.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailDocumentAction.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
