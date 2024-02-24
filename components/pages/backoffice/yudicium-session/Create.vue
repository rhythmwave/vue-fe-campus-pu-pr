<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetYudiciumSessionListData, GetYudiciumSessionListRoot } from '~~/types/api/yudicium-session/GetYudiciumSessionList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateYudiciumSessionRequest } from '~~/types/api/yudicium-session/CreateYudiciumSession';
import { createYudiciumSession } from '~~/composables/api/yudicium-session/createYudiciumSession';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';


const props = defineProps({
    sample: Array as any,
});

onMounted(async () => {
    sample.value = <GetSampleListData>props.sample

    await getSemester()
});

const sample = ref(<GetSampleListData>{})

const valid = ref(true)
const createYudiciumSessionRequest = ref(<CreateYudiciumSessionRequest>{});

const emitData = defineEmits(['close', 'reload'])

const session_date = ref('')
const semesters = ref<GetSemesterListData[]>([])
const selectedSemester = ref(<GetSemesterListData>{})
async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semesters.value = resp?.data
            console.log(semesters.value)
        }
    } catch (error) {
        alert(error)
    }
}

async function save() {
    try {
        if (session_date.value) {
            createYudiciumSessionRequest.value.session_date = convertDateWithoutTimeToTimezoned(session_date.value)
        }
        const { response: createRoleResponse, error } = await createYudiciumSession(createYudiciumSessionRequest.value)

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

async function semesterOnChange(id: any) {
    selectedSemester.value = semesters.value.filter((x) => { return x.id == id })[0]
    createYudiciumSessionRequest.value.semester_id = id
}

function MouseOver(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Sesi Yudisium</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-select item-value="id" variant="outlined" hide-details :items="semesters" label="Semester"
                                @update:model-value="(sl: any) => semesterOnChange(sl)">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                                    }}</span>
                                </template>
                                <template v-slot:item="{ item, props: { onClick, title, value } }">
                                    <ul>
                                        <li style="padding: 10px; margin: 2px;">
                                            <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                                @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                <span @click="onClick">{{ title.school_year }} - {{ title.semester_type
                                                }}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createYudiciumSessionRequest.name" variant="outlined" hide-details
                                label="Nama Sesi" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="session_date" variant="outlined" hide-details label="Tanggal"
                                type="date" :readonly="false" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createYudiciumSessionRequest.name == ''"
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