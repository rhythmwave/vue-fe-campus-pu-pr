<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetSampleApiListData, GetSampleApiListRoot } from '~~/types/api/sample-api/GetSampleApiList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateSampleApiRequest } from '~~/types/api/sample-api/CreateSampleApi';
import { createSampleApi } from '~~/composables/api/sample-api/createSampleApi';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { getSampleOptionsList } from '~~/composables/api/sample-options/getSampleOptionsList';
import { GetSampleOptionsListData } from '~~/types/api/sample-options/GetSampleOptionsList';


const props = defineProps({
    sample: Array as any,
});

onMounted(async () => {
    sample.value = <GetSampleListData>props.sample
    createSampleApiRequest.value.study_program_id = sample.value.id

    await getSampleOptions()
});

const sample = ref(<GetSampleListData>{})

const valid = ref(true)
const createSampleApiRequest = ref(<CreateSampleApiRequest>{});

const emit = defineEmits(['close', 'reload'])

const sampleOptions = ref<GetSampleOptionsListData[]>([])
async function getSampleOptions() {
    try {
        const { response: resp, error: error } = await getSampleOptionsList(1000000, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            sampleOptions.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function save() {
    try {
        const { response: createRoleResponse, error } = await createSampleApi(createSampleApiRequest.value)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emit('reload');
        }
        // return true;
        emit('close');
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
                <span class="title text-white">Tambah Jenis Nilai</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="sample.name" variant="outlined" hide-details
                                label="Nama" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="sample.ageg" variant="outlined" hide-details
                                label="Umur" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="sampleOptions" item-value="id"
                                item-title="name" label="Options"
                                v-model="createSampleApiRequest.name"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createSampleApiRequest.name == ''"
                                    @click="save(); ">
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