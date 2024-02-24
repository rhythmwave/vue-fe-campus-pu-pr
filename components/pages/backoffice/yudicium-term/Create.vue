<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetYudiciumTermListData, GetYudiciumTermListRoot } from '~~/types/api/yudicium-term/GetYudiciumTermList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateYudiciumTermRequest } from '~~/types/api/yudicium-term/CreateYudiciumTerm';
import { createYudiciumTerm } from '~~/composables/api/yudicium-term/createYudiciumTerm';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';


const props = defineProps({
    sample: Array as any,
});

onMounted(async () => {
    sample.value = <GetSampleListData>props.sample

    await getCuriculum()
});

const sample = ref(<GetSampleListData>{})

const valid = ref(true)
const createYudiciumTermRequest = ref(<CreateYudiciumTermRequest>{
    curriculum_id: '',
    term: '',
    remarks: '',
});

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

async function save() {
    try {
        const { response: createRoleResponse, error } = await createYudiciumTerm(createYudiciumTermRequest.value)

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
                <span class="title text-white">Tambah Syarat Yudicium</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createYudiciumTermRequest.term" variant="outlined" hide-details
                                label="Syarat" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createYudiciumTermRequest.remarks" variant="outlined" hide-details
                                label="Catatan" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="curiculum" item-value="id" item-title="name"
                                label="Kurikulum" v-model="createYudiciumTermRequest.curriculum_id"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary"
                                    :disabled="createYudiciumTermRequest.curriculum_id == '' || createYudiciumTermRequest.term == ''"
                                    @click="save();">
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