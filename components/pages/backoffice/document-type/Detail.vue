
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetDocumentTypeListData } from '~~/types/api/document-type/GetDocumentTypeList';

const props = defineProps({
    getDocumentTypeListData: Array as any,
});

onMounted(() => {
    detailDocumentType.value = <GetDocumentTypeListData>props.getDocumentTypeListData
});
const detailDocumentType = ref(<GetDocumentTypeListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Tipe Dokumen</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailDocumentType.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailDocumentType.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
