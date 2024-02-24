<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { upsertAcademicGuidanceDecision } from '~~/composables/api/academic-guidance/upsertAcademicGuidanceDecision';
import { getSampleList } from '~~/composables/api/sample/getSampleList';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { ErrorRoot } from '~~/types/api/error';
import { UpsertAcademicGuidanceDecisionRequest } from '~~/types/api/academic-guidance/UpsertAcademicGuidanceDecision';
import { GetAcademicGuidanceListData } from '~~/types/api/academic-guidance/GetAcademicGuidanceList';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';

const props = defineProps({
    semesterId: String,
    getAcademicGuidanceListData: Array as any,
});
 
onMounted(async () => {
    detailAcademicGuidance = <GetLecturerListData>props.getAcademicGuidanceListData
    upsertAcademicGuidanceDecisionRequest.value = Object.assign({}, <UpsertAcademicGuidanceDecisionRequest>props.getAcademicGuidanceListData)
    upsertAcademicGuidanceDecisionRequest.value.decision_date = detailAcademicGuidance.academic_guidance_decision_date
    upsertAcademicGuidanceDecisionRequest.value.decision_number = detailAcademicGuidance.academic_guidance_decision_number
    upsertAcademicGuidanceDecisionRequest.value.lecturer_id = detailAcademicGuidance.id
    upsertAcademicGuidanceDecisionRequest.value.semester_id = <string>props.semesterId
    if (upsertAcademicGuidanceDecisionRequest.value.decision_date)
        upsertAcademicGuidanceDecisionRequest.value.decision_date = upsertAcademicGuidanceDecisionRequest.value.decision_date.substring(0, 10)
});
const valid = ref(true)
const upsertAcademicGuidanceDecisionRequest = ref(<UpsertAcademicGuidanceDecisionRequest>{
    lecturer_id: "",
    semester_id: "",
    decision_number: "",
    decision_date: "",
});
let detailAcademicGuidance: GetLecturerListData;

const emitData = defineEmits(['close', 'reload'])


async function update() {
    try {
        let request: any = Object.assign({},upsertAcademicGuidanceDecisionRequest.value)
        console.log("upsertAcademicGuidanceDecisionRequest.value")
        console.log(upsertAcademicGuidanceDecisionRequest.value)
        if (request.decision_date) {
        console.log("aaaaaaaaaaa")
            request.decision_date = convertDateWithoutTimeToTimezoned(request.decision_date)
        }
        const { response: updateRoleResponse, error } = await upsertAcademicGuidanceDecision(request)

        console.log("request")
        console.log(request)
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
                <span class="title text-white">Input SK Bimbingan</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="upsertAcademicGuidanceDecisionRequest.decision_number" variant="outlined"
                                hide-details label="Nomor SK *" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="upsertAcademicGuidanceDecisionRequest.decision_date" type="date"
                                variant="outlined" hide-details label="Tanggal SK *" :readonly="false" />
                        </v-col>

                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary"
                                    :disabled="upsertAcademicGuidanceDecisionRequest.decision_date == '' || upsertAcademicGuidanceDecisionRequest.decision_number == ''"
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