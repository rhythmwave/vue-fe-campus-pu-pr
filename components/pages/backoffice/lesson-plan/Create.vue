<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetLessonPlanListData, GetLessonPlanListRoot } from '~~/types/api/lesson-plan/GetLessonPlanList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateLessonPlanRequest } from '~~/types/api/lesson-plan/CreateLessonPlan';
import { createLessonPlan } from '~~/composables/api/lesson-plan/createLessonPlan';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { getSampleList } from '~~/composables/api/sample/getSampleList';


const props = defineProps({
    subject_id: String,
});

onMounted(async () => {
    createLessonPlanRequest.value.subject_id = <string>props.subject_id
});


const valid = ref(true)
const createLessonPlanRequest = ref(<CreateLessonPlanRequest>{
    subject_id: "",
    meeting_order: 1,
    lesson: "",
    english_lesson: "",
});

const emitData = defineEmits(['close', 'reload'])


async function save() {
    try {
        const { response: createRoleResponse, error } = await createLessonPlan(createLessonPlanRequest.value)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emitData('reload');
        }
        // return true;
        emitData('close');
    } catch (error) {
        alert(error)
        // return false;
    }

}

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Rencana Pembelajaran</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createLessonPlanRequest.meeting_order" type="number"
                                variant="outlined" hide-details label="Pertemuan Ke" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createLessonPlanRequest.lesson" variant="outlined" hide-details
                                label="Materi" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createLessonPlanRequest.english_lesson" variant="outlined" hide-details
                                label="Materi(Inggris)" :readonly="false" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createLessonPlanRequest.lesson == ''" @click="save();">
                                    Tambah
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>