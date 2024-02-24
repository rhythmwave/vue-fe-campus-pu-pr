<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { GetFacultyDetailData, GetFacultyDetailRoot } from '~~/types/api/faculty/GetFacultyDetail';

const props = defineProps({
    title: String,
    value: String,
});
</script>
<template>
    <tr>
        <td>
            <div class="d-flex align-center">
                
                <div class="ml-4">
                    <h6 class="text-h6">{{ title }}</h6>
                </div>
            </div>
        </td>
        <td>
            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{value}} </h6>
        </td>
    </tr>
</template>