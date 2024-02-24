<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetGraduationSessionListData, GetGraduationSessionListRoot } from '~~/types/api/graduation-session/GetGraduationSessionList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateGraduationSessionRequest } from '~~/types/api/graduation-session/CreateGraduationSession';
import { createGraduationSession } from '~~/composables/api/graduation-session/createGraduationSession';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';


const props = defineProps({
    sample: Array as any,
});

onMounted(async () => {
    sample.value = <GetSampleListData>props.sample

    await getYearData()
});

const sample = ref(<GetSampleListData>{})

const valid = ref(true)
const createGraduationSessionRequest = ref(<CreateGraduationSessionRequest>{});

const emitData = defineEmits(['close', 'reload'])

const session_date = ref('')
const years = ref<number[]>([])
const selectedYear = ref(0)
async function getYearData() {
    try {
        var year = new Date().getFullYear()
        var temp = <number[]>[];
        for (let y = 2004; y < year + 2; y++) {
            temp.push(y)
        }
        years.value = temp
    } catch (error) {
        alert(error)
    }
}

async function save() {
    try {
        if (session_date.value) {
            createGraduationSessionRequest.value.session_date = convertDateWithoutTimeToTimezoned(session_date.value)
        }
        const { response: createRoleResponse, error } = await createGraduationSession(createGraduationSessionRequest.value)

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

async function yearOnChange(id: any) {
    selectedYear.value = years.value.filter((x) => { return x == id })[0]
    createGraduationSessionRequest.value.session_year = id
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
                <span class="title text-white">Tambah Sesi Wisuda</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-select item-value="id" variant="outlined" hide-details :items="years" label="Tahun"
                                @update:model-value="(sl: any) => yearOnChange(sl)">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.title }}</span>
                                </template>
                                <template v-slot:item="{ item, props: { onClick, title, value } }">
                                    <ul>
                                        <li style="padding: 10px; margin: 2px;">
                                            <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                                @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                <span @click="onClick">{{ title }}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createGraduationSessionRequest.session_number" variant="outlined"
                                hide-details label="Nomor Sesi" type="number" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="session_date" variant="outlined" hide-details label="Tanggal" type="date"
                                :readonly="false" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="!createGraduationSessionRequest.session_number"
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