<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateCuriculum } from '~~/composables/api/curiculum/updateCuriculum';
import { getSampleOptionsList } from '~~/composables/api/sample-options/getSampleOptionsList';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { ErrorRoot } from '~~/types/api/error';
import { UpdateCuriculumRequest } from '~~/types/api/curiculum/UpdateCuriculum';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { GetSampleOptionsListData } from '~~/types/api/sample-options/GetSampleOptionsList';
import { GetCuriculumDetaiData } from '~~/types/api/curiculum/GetCuriculumDetail';
import { getCuriculumDetail } from '~~/composables/api/curiculum/getCuriculumDetail';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';

const props = defineProps({
    getCuriculumListData: Array as any,
});

onMounted(async () => {
    detailCuriculum = <GetCuriculumDetaiData>props.getCuriculumListData
    updateCuriculumRequest.value = Object.assign({}, <UpdateCuriculumRequest>props.getCuriculumListData)
    getCuriculumDetilData()
});

const valid = ref(true)
const updateCuriculumRequest = ref(<UpdateCuriculumRequest>{});
let detailCuriculum: GetCuriculumDetaiData;

const emitData = defineEmits(['close', 'reload'])

async function getCuriculumDetilData() {
    try {
        const { response: resp, error: error } = await getCuriculumDetail(detailCuriculum.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            detailCuriculum = resp?.data
            updateCuriculumRequest.value = Object.assign({}, <UpdateCuriculumRequest><unknown>detailCuriculum)

            updateCuriculumRequest.value.aggreement_date = updateCuriculumRequest.value.aggreement_date.substring(0, 10)
            updateCuriculumRequest.value.rector_decision_date = updateCuriculumRequest.value.rector_decision_date.substring(0, 10)
        }
    } catch (error) {
        alert(error)
    }
}

async function update() {
    try {
        let request = Object.assign({}, updateCuriculumRequest.value)
        if (request.aggreement_date) {
            request.aggreement_date = convertDateWithoutTimeToTimezoned(request.aggreement_date)
        } if (request.rector_decision_date) {
            request.rector_decision_date = convertDateWithoutTimeToTimezoned(request.rector_decision_date)
        }
        const { response: updateRoleResponse, error } = await updateCuriculum(request)

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
                <span class="title text-white">Ubah Jenis Nilai</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateCuriculumRequest.name" variant="outlined" hide-details="auto"
                                label="Nama Kurikulum (*)" :readonly="false" hint="[Nama Kurikulum maksimal 60 karakter]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateCuriculumRequest.year" type="number" variant="outlined"
                                hide-details="auto" label="Tahun Kurikulum (*)" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Keputusan Rektor"></v-label> <br /> <br />
                            <v-text-field v-model="updateCuriculumRequest.rector_decision_number" variant="outlined"
                                hide-details="auto" label="Nomor" :readonly="false" />
                            <br />
                            <v-text-field v-model="updateCuriculumRequest.rector_decision_date" type="date"
                                variant="outlined" hide-details="auto" label="Tanggal" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Waktu Disetujui"></v-label> <br /> <br />
                            <v-textarea outlined v-model="updateCuriculumRequest.aggreeing_party"
                                label="Pihak yang Menyetuju" variant="outlined" hide-details="auto"
                                :readonly="false"></v-textarea>
                            <br />
                            <v-text-field v-model="updateCuriculumRequest.aggreement_date" type="date" variant="outlined"
                                hide-details="auto" label="Tanggal disetujui" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Masa Studi(*)"></v-label> <br /> <br />
                            <v-text-field v-model.number="updateCuriculumRequest.ideal_study_period" type="number"
                                hint="Semester [Diisi dengan angka[0-9], dengan nilai: 1 s/d 10]" variant="outlined"
                                hide-details="auto" label="Ideal(*)" /> <br />
                            <v-text-field v-model.number="updateCuriculumRequest.maximum_study_period" type="number"
                                hint="Semester [Diisi dengan angka[0-9], dengan nilai: 2 s/d 20]" variant="outlined"
                                hide-details="auto" label="Maximum(*)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Komponen Pengambilan Nilai"></v-label>
                            <v-radio-group v-model="updateCuriculumRequest.final_score_determinant" inline
                                hide-details="auto">
                                <v-radio label="Terbaik" value="best" color="primary"></v-radio>
                                <v-radio label="Terakhir" value="last" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea outlined v-model="updateCuriculumRequest.remarks" label="Keterangan"
                                variant="outlined" hide-details="auto" :readonly="false"></v-textarea>

                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-switch v-model="updateCuriculumRequest.is_active" label="Aktif" color="primary"></v-switch>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateCuriculumRequest.name == ''" @click="update();">
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