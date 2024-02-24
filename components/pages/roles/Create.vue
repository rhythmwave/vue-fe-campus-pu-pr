<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { CreateRoleRequest, CreateRoleRoot } from '~~/types/api/role/CreateRole';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetStudyProgramListData, GetStudyProgramListRoot } from '~~/types/api/study-program/GetStudyProgramList';
import { ErrorRoot } from '~~/types/api/error';

onMounted(async () => {
    await getPermissions();
    await getStudyPrograms();
});

const valid = ref(true)
const createRoleRequest = ref(<CreateRoleRequest>{
    permission_ids: <string[]>[],
    study_program_ids: <string[]>[],
});

const emit = defineEmits(['close', 'reload'])


async function save() {

    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_role.RootRoleHandler/Create`, <any>{
            method: 'POST',
            body: createRoleRequest.value,
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
        emit('reload');
    } catch (error) {
        alert(error)

    }
    emit('close');

}

const permissions = ref(<GetPermisssionsListData[]>[]);
const permissionsCheckbox = ref(<any[]>[]);
const permissionsSelected = ref(0);
async function getPermissions() {
    try {
        const { data: getPermisssionsListData, pending, refresh, error } = await useAPIFetch<GetPermisssionsListRoot>(() => `/api/v1/root/root_permission.RootPermissionHandler/GetList?limit=1000000&page=1&search=`, <any>{
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
        permissions.value = <GetPermisssionsListData[]>getPermisssionsListData.value?.data;
        let temp = <any[]>[];
        permissions.value.forEach((d) => {
            let tData = {
                data: d,
                value: false,
            }
            temp.push(tData);
        });
        permissionsCheckbox.value = temp;
        permissionsSelected.value = 0;

    } catch (error) {
        alert(error)

    }


}
function clearPermissions() {
    let temp = <any[]>[];
    permissionsCheckbox.value.forEach((d) => {
        let tData = {
            data: d.data,
            value: false,
        }
        temp.push(tData);
    });
    permissionsCheckbox.value = temp;
    permissionsSelected.value = 0;
}
function savePermissions() {
    let newArray = permissionsCheckbox.value.filter(function (el) {
        return el.value;
    });
    permissionsSelected.value = newArray.length;
    let tempIds = <string[]>[];
    newArray.forEach((sp) => {
        tempIds.push(sp.data.id);
    });
    createRoleRequest.value.permission_ids = tempIds;
}

const studyPrograms = ref(<GetStudyProgramListData[]>[]);
const studyProgramsCheckbox = ref(<any[]>[]);
const studyProgramsSelected = ref(0);
async function getStudyPrograms() {
    try {
        const { data: getStudyProgramListData, pending, refresh, error } = await useAPIFetch<GetStudyProgramListRoot>(() => `/api/v1/root/root_study_program.RootStudyProgramHandler/GetList?limit=1000000&page=1&search=`, <any>{
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
        studyPrograms.value = <GetStudyProgramListData[]>getStudyProgramListData.value?.data;
        let temp = <any[]>[];
        studyPrograms.value.forEach((d) => {
            let tData = {
                data: d,
                value: false,
            }
            temp.push(tData);
        });
        studyProgramsCheckbox.value = temp;
        studyProgramsSelected.value = 0;

    } catch (error) {
        alert(error)

    }

}

function saveStudyProgram() {
    let newArray = studyProgramsCheckbox.value.filter(function (el) {
        return el.value;
    });
    studyProgramsSelected.value = newArray.length;
    let tempIds = <string[]>[];
    newArray.forEach((sp) => {
        tempIds.push(sp.data.id);
    });
    createRoleRequest.value.study_program_ids = tempIds;
}

function clearStudyPrograms() {
    let temp = <any[]>[];
    studyProgramsCheckbox.value.forEach((d) => {
        let tData = {
            data: d.data,
            value: false,
        }
        temp.push(tData);
    });
    studyProgramsCheckbox.value = temp;
    studyProgramsSelected.value = 0;
}

const dialogm1 = ref("");
const dialogm2 = ref("");
const dialog = ref(false);
const dialog2 = ref(false);
</script>
<template>
    <div>
        <v-card>
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Grup</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createRoleRequest.name" variant="outlined" hide-details
                                label="*Nama Grup" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="createRoleRequest.description" variant="outlined" hide-details
                                label="Keterangan" />
                        </v-col>

                        <div cols="12" />
                        <v-col cols="2" sm="2">
                            <v-dialog v-model="dialog" scrollable>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="success" style="width: 20px;height: 20px;" v-bind="props" flat>
                                        <PlusIcon style="width: 20px;height: 20px;" />
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>Hak Akses Prodi</v-card-title>
                                    <v-divider></v-divider>
                                    <v-card-text>
                                        <v-col cols="6" sm="12" md="6" lg="6" v-for="itm in studyProgramsCheckbox">
                                            <v-checkbox-btn color="primary" hide-details v-model="itm.value"
                                                :label="itm.data.name"></v-checkbox-btn>
                                        </v-col>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-btn color="error" text @click="dialog = false; clearStudyPrograms();">
                                            Tutup
                                        </v-btn>
                                        <v-btn color="success" text @click="dialog = false; saveStudyProgram();">
                                            Pilih
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>
                        <v-col cols="10" sm="10">
                            <h3>Hak Akses Prodi</h3>
                            {{ studyProgramsSelected == 0 ? '' : studyProgramsSelected + ' Dipilih' }}
                        </v-col>
                        <div cols="12" />
                        <v-col cols="2" sm="2">
                            <v-dialog v-model="dialog2" scrollable>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="success" style="width: 20px;height: 20px;" v-bind="props" flat>
                                        <PlusIcon style="width: 20px;height: 20px;" />
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>Hak Akses Modul</v-card-title>
                                    <v-divider></v-divider>
                                    <v-card-text>
                                        <v-col cols="6" sm="12" md="6" lg="6" v-for="itm in permissionsCheckbox">
                                            <v-checkbox-btn color="primary" hide-details v-model="itm.value"
                                                :label="itm.data.name"></v-checkbox-btn>
                                        </v-col>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-btn color="error" text @click="dialog2 = false; clearPermissions();">
                                            Tutup
                                        </v-btn>
                                        <v-btn color="success" text @click="dialog2 = false; savePermissions();">
                                            Pilih
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>
                        <v-col cols="10" sm="10">
                            <h3>Hak Akses Modul </h3>
                            {{ permissionsSelected == 0 ? '' : permissionsSelected + ' Dipilih' }}
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="typeof createRoleRequest.name == 'undefined' || createRoleRequest.name == '' || typeof createRoleRequest.description == 'undefined' || createRoleRequest.description == '' " @click="save(); ">
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