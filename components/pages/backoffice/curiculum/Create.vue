<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetCuriculumListData, GetCuriculumListRoot } from '~~/types/api/curiculum/GetCuriculumList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateCuriculumRequest } from '~~/types/api/curiculum/CreateCuriculum';
import { createCuriculum } from '~~/composables/api/curiculum/createCuriculum';
import { AnyMap } from '@jridgewell/trace-mapping';
import { onMounted, ref } from 'vue';


const props = defineProps({
    study_program_id: String,
});

onMounted(async () => {
    createCuriculumRequest.value.study_program_id = <string>props.study_program_id

});


const valid = ref(true)
const createCuriculumRequest = ref(<CreateCuriculumRequest>{
    study_program_id: '',
    name: '',
    year: '',
    rector_decision_number: '',
    rector_decision_date: '',
    aggreeing_party: '',
    aggreement_date: '',
    ideal_study_period: 0,
    maximum_study_period: 0,
    remarks: '',
    is_active: false,
    final_score_determinant: 'best',
});

const emitData = defineEmits(['close', 'reload'])

async function save() {
    try {
        let request = Object.assign({}, createCuriculumRequest.value)
        if (request.aggreement_date) {
            request.aggreement_date = convertDateWithoutTimeToTimezoned(request.aggreement_date)
        } if (request.rector_decision_date) {
            request.rector_decision_date = convertDateWithoutTimeToTimezoned(request.rector_decision_date)
        }
        const { response: createRoleResponse, error } = await createCuriculum(request)

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
                <span class="title text-white">Tambah Kurikulum</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createCuriculumRequest.name" variant="outlined" hide-details="auto"
                                label="Nama Kurikulum (*)" :readonly="false" hint="[Nama Kurikulum maksimal 60 karakter]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createCuriculumRequest.year" type="number" variant="outlined"
                                hide-details="auto" label="Tahun Kurikulum (*)" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Keputusan Rektor"></v-label> <br /> <br />
                            <v-text-field v-model="createCuriculumRequest.rector_decision_number" variant="outlined"
                                hide-details="auto" label="Nomor" :readonly="false" />
                            <br />
                            <v-text-field v-model="createCuriculumRequest.rector_decision_date" type="date"
                                variant="outlined" hide-details="auto" label="Tanggal" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Waktu Disetujui"></v-label> <br /> <br />
                            <v-textarea outlined v-model="createCuriculumRequest.aggreeing_party"
                                label="Pihak yang Menyetuju" variant="outlined" hide-details="auto"
                                :readonly="false"></v-textarea>
                            <br />
                            <v-text-field v-model="createCuriculumRequest.aggreement_date" type="date" variant="outlined"
                                hide-details="auto" label="Tanggal disetujui" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Masa Studi(*)"></v-label> <br /> <br />
                            <v-text-field v-model.number="createCuriculumRequest.ideal_study_period" type="number"
                                hint="Semester [Diisi dengan angka[0-9], dengan nilai: 1 s/d 10]" variant="outlined"
                                hide-details="auto" label="Ideal(*)" /> <br />
                            <v-text-field v-model.number="createCuriculumRequest.maximum_study_period" type="number"
                                hint="Semester [Diisi dengan angka[0-9], dengan nilai: 2 s/d 20]" variant="outlined"
                                hide-details="auto" label="Maximum(*)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Komponen Pengambilan Nilai"></v-label>
                            <v-radio-group v-model="createCuriculumRequest.final_score_determinant" inline
                                hide-details="auto">
                                <v-radio label="Terbaik" value="best" color="primary"></v-radio>
                                <v-radio label="Terakhir" value="last" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea outlined v-model="createCuriculumRequest.remarks" label="Keterangan"
                                variant="outlined" hide-details="auto" :readonly="false"></v-textarea>

                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-switch v-model="createCuriculumRequest.is_active" label="Aktif" color="primary"></v-switch>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createCuriculumRequest.name == ''" @click="save();">
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