<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetYudiciumListData, GetYudiciumListRoot } from '~~/types/api/yudicium/GetYudiciumList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { DoYudiciumRequest } from '~~/types/api/yudicium/DoYudicium';
import { doYudicium } from '~~/composables/api/yudicium/doYudicium';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { getYudiciumSessionList } from '~~/composables/api/yudicium-session/getYudiciumSessionList';
import { GetYudiciumSessionListData } from '~~/types/api/yudicium-session/GetYudiciumSessionList';
import { GetYudiciumStudentListData } from '~~/types/api/yudicium/GetYudiciumStudentList';


const props = defineProps({
    getYudiciumStudentListData: Array as Object,
});

onMounted(async () => {
    var detail = <GetYudiciumStudentListData>props.getYudiciumStudentListData
    doYudiciumRequest.value.student_ids = [detail.id]
    await getYudiciumSession()
});


const valid = ref(true)
const doYudiciumRequest = ref(<DoYudiciumRequest>{});

const emitData = defineEmits(['close', 'reload'])

const yudiciumSession = ref<GetYudiciumSessionListData[]>([])
async function getYudiciumSession() {
    try {
        const { response: resp, error: error } = await getYudiciumSessionList(1000000, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            yudiciumSession.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function save() {
    try {
        var req = Object.assign({}, doYudiciumRequest.value)
        if (req.yudicium_date) {
            req.yudicium_date = convertDateWithoutTimeToTimezoned(req.yudicium_date);
        }
        const { response: createRoleResponse, error } = await doYudicium(req)

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
                <span class="title text-white">Yudicium</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>

                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="yudiciumSession" item-value="id"
                                item-title="name" label="Sesi Yudicium"
                                v-model="doYudiciumRequest.yudicium_session_id"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="date" v-model="doYudiciumRequest.yudicium_date" variant="outlined"
                                hide-details label="Tanggal" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="doYudiciumRequest.yudicium_number" variant="outlined" hide-details
                                label="Nomor Yudicium" :readonly="false" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" @click="save();">
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