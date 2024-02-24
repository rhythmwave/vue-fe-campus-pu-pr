<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateLessonPlan } from '~~/composables/api/lesson-plan/updateLessonPlan';
import { getSampleList } from '~~/composables/api/sample/getSampleList';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { ErrorRoot } from '~~/types/api/error';
import { UpdateLessonPlanRequest } from '~~/types/api/lesson-plan/UpdateLessonPlan';
import { GetLessonPlanListData } from '~~/types/api/lesson-plan/GetLessonPlanList';

const props = defineProps({
    subject_id: String,
    getLessonPlanListData: Array as any,
});

onMounted(async () => {
    detailLessonPlan = <GetLessonPlanListData>props.getLessonPlanListData
    updateLessonPlanRequest.value = Object.assign({}, <UpdateLessonPlanRequest>props.getLessonPlanListData)
    updateLessonPlanRequest.value.subject_id = <string>props.subject_id
});

const sample = ref(<GetSampleListData>{})

const valid = ref(true)
const updateLessonPlanRequest = ref(<UpdateLessonPlanRequest>{});
let detailLessonPlan: GetLessonPlanListData;

const emitData = defineEmits(['close', 'reload'])


async function update() {
    try {
        const { response: updateRoleResponse, error } = await updateLessonPlan(updateLessonPlanRequest.value)

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
                <span class="title text-white">Ubah Rencana Pembelajaran</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="updateLessonPlanRequest.meeting_order" type="number"
                                variant="outlined" hide-details label="Pertemuan Ke" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateLessonPlanRequest.lesson" variant="outlined" hide-details
                                label="Materi" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateLessonPlanRequest.english_lesson" variant="outlined" hide-details
                                label="Materi(Inggris)" :readonly="false" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateLessonPlanRequest.lesson == ''"
                                    @click="update();">
                                    Ubah
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>