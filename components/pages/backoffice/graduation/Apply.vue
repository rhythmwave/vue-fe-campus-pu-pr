<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetGraduationListData, GetGraduationListRoot } from '~~/types/api/graduation/GetGraduationList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { ApplyGraduationRequest } from '~~/types/api/graduation/ApplyGraduation';
import { applyGraduation } from '~~/composables/api/graduation/applyGraduation';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { getGraduationSessionList } from '~~/composables/api/graduation-session/getGraduationSessionList';
import { GetGraduationSessionListData } from '~~/types/api/graduation-session/GetGraduationSessionList';
import { GetStudentData } from '~~/types/api/admin-student/GetAdminStudent';


const props = defineProps({
    sample: Array as any,
});

onMounted(async () => {

    await getGraduationSession()
});


const valid = ref(true)
const applyGraduationRequest = ref(<ApplyGraduationRequest>{});

const emitData = defineEmits(['close', 'reload'])
const graduationSessions = ref<GetGraduationSessionListData[]>([])

async function getGraduationSession() {
    try {
        const { response: resp, error: error } = await getGraduationSessionList(1000000, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            graduationSessions.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const limit = 20
const pagination = ref({
    page: 1,
    limit: limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const students = ref(<GetStudentData[]>[])
async function getDataStudent(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_student.AdminStudentHandler/GetList?limit=${limit}&page=${page}&studyProgramId=&studentForceFrom=&studentForceTo=&nimNumberFrom&nimNumberTo&name=${search}&address&regencyId&status`, <any>{
            method: 'GET',
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                alert(errorRoot)
                return;
            }
            alert(errorRoot.meta.message)
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return;
            }
            return;
        }
        pagination.value =
        {
            next: _resp.value.pagination.next,
            prev: _resp.value.pagination.prev,
            total_pages: _resp.value.pagination.total_pages,
            total_records: _resp.value.pagination.total_records,
            limit: _resp.value.pagination.limit,
            page: _resp.value.pagination.page
        }
        students.value = _resp.value.data
        students.value.forEach((s) => {
            s.name = "(" + s.student_force + ") " + s.nim_number + " " + s.name
        });
    } catch (error) {
        alert(error)
    }
}
function getAutocompleteStudyProgram(data: any) {
    applyGraduationRequest.value.student_id = data.id
}
async function save() {
    try {
        var req = Object.assign({}, applyGraduationRequest.value)
        if (req.application_date) {

            req.application_date = convertDateWithoutTimeToTimezoned(req.application_date);
        }
        const { response: createRoleResponse, error } = await applyGraduation(req)

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
                <span class="title text-white">Tambah Pendaftaran Wisudawan</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>

                        <v-col cols="12" sm="12">
                            <Autocomplete @reload="(data: any) => getDataStudent(20, 1, data.search)"
                                :label="'*Pilih Mahasiswa'" @selected="(data: any) => getAutocompleteStudyProgram(data)"
                                :options="students" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="date" v-model="applyGraduationRequest.application_date" variant="outlined"
                                hide-details label="Tanggal" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details item-value="id" item-title="session_school_year" label="Sesi Wisuda"
                                v-model="applyGraduationRequest.graduation_session_id" :items="graduationSessions">
                            </v-select>
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