<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateYudiciumTerm } from '~~/composables/api/yudicium-term/updateYudiciumTerm';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { ErrorRoot } from '~~/types/api/error';
import { UpdateYudiciumTermRequest } from '~~/types/api/yudicium-term/UpdateYudiciumTerm';
import { GetYudiciumTermListData } from '~~/types/api/yudicium-term/GetYudiciumTermList';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';

const props = defineProps({
    sample: Array as any,
    getYudiciumTermListData: Array as any,
});

onMounted(async () => {
    detailYudiciumTerm = <GetYudiciumTermListData>props.getYudiciumTermListData
    updateYudiciumTermRequest.value = Object.assign({}, <UpdateYudiciumTermRequest>props.getYudiciumTermListData)

    await getCuriculum()
});

const sample = ref(<GetSampleListData>{})

const valid = ref(true)
const updateYudiciumTermRequest = ref(<UpdateYudiciumTermRequest>{
    id: "",
    term: "",
    remarks: "",
});
let detailYudiciumTerm = <GetYudiciumTermListData>{
    id: "",
    term: "",
    remarks: "",
};

const emitData = defineEmits(['close', 'reload'])

const curiculum = ref<GetCuriculumListData[]>([])
async function getCuriculum() {
    try {
        const { response: resp, error: error } = await getCuriculumList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            curiculum.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function update() {
    try {
        const { response: updateRoleResponse, error } = await updateYudiciumTerm(updateYudiciumTermRequest.value)

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
                <span class="title text-white">Ubah Syarat Yudicium</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            Kurikulum: {{ detailYudiciumTerm.curriculum_name }}
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateYudiciumTermRequest.term" variant="outlined" hide-details
                                label="Syarat" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateYudiciumTermRequest.remarks" variant="outlined" hide-details
                                label="Catatan" :readonly="false" />
                        </v-col>

                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateYudiciumTermRequest.term == ''" @click="update();">
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