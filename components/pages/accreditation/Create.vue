<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetStudyProgramListData, GetStudyProgramListRoot } from '~~/types/api/study-program/GetStudyProgramList';
import { ErrorRoot } from '~~/types/api/error';
import { CreateAccreditationRequest } from '~~/types/api/admin-study-program/CreateAccreditation';
import { convertDateWithoutTimeToTimezoned, formatYearMonthDate } from '~~/utils/helpers/date-utils';


const props = defineProps({
    id: String,
});

onMounted(async () => {

});

const valid = ref(true)
const createAccreditationRequest = ref(<CreateAccreditationRequest>{
    study_program_id: props.id,
    decree_number: '',
    decree_date: '',
    decree_due_date: '',
    accreditation: '',
    is_active: false,
});

const emit = defineEmits(['close', 'reload'])


async function save() {
    try {
        if (createAccreditationRequest.value.decree_date) {
            createAccreditationRequest.value.decree_date = convertDateWithoutTimeToTimezoned(createAccreditationRequest.value.decree_date)
        }
        if (createAccreditationRequest.value.decree_due_date) {
            createAccreditationRequest.value.decree_due_date = convertDateWithoutTimeToTimezoned(createAccreditationRequest.value.decree_due_date)
        }
        try {
            const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/study_program/admin_accreditation.AdminAccreditationHandler/Create`, <any>{
                method: 'POST',
                body: createAccreditationRequest.value,
            })
            if (error.value) {
                let errorRoot = <ErrorRoot><unknown>error.value.data;
                if (!errorRoot.meta) {
                    // return { response: null, error: errorRoot };
                    alert(errorRoot);
                    return;
                } else {
                    alert(errorRoot.meta.message);
                }
                if (errorRoot.meta.status == 401) {
                    const authUser = useAuthStorage();
                    authUser.value = null;
                    navigateTo({ name: 'login', path: '' })
                    // return { response: null, error: errorRoot };
                    return;
                }
                return;
            }
            emit('reload');

        } catch (error) {
            alert(error)
        }

    } catch (error) {
        alert(error)
        console.log(error)
        // return false;
    }
    emit('close');

}
const accreditations = ref([
    {
        id: "A",
        name: "A - Berakreditasi A",
    },
    {
        id: "B",
        name: "B - Berakreditasi B",
    },
    {
        id: "C",
        name: "C - Berakreditasi C",
    },
    {
        id: "D",
        name: "D - Baik",
    },
    {
        id: "E",
        name: "E - Baik Sekali",
    },
    {
        id: "F",
        name: "F - Tidak Terakreditasi",
    },
    {
        id: "U",
        name: "U - Unggul",
    },
])

const statuses = ref([
    {
        id: true,
        name: "Dipakai",
    },
    {
        id: false,
        name: "Tidak Dipakai",
    },
])
function changeAccreditationDecreeDueDate(ev: any){
    if(ev.target.value != ''){
        var date = new Date(ev.target.value);
        date.setDate(date.getFullYear() + 5).toString()
        createAccreditationRequest.value.decree_due_date = formatYearMonthDate(date.toString());
    }
}
</script>
<template>
    <div>
        <v-card>
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Akreditasi</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createAccreditationRequest.decree_number" variant="outlined" hide-details
                                label="No. S.K. Akreditasi BAN-P.T (*)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createAccreditationRequest.decree_date" type="date" variant="outlined" hide-details label="Tanggal S.K. (Surat Keputusan) Akreditasi BAN (*)" @change="changeAccreditationDecreeDueDate($event)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createAccreditationRequest.decree_due_date" type="date"
                                variant="outlined" hide-details
                                label="Tanggal batas akhir berlaku S.K. (Surat Keputusan) Akreditasi BAN (*)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="createAccreditationRequest.accreditation" label="Akreditasi (*)"
                                placeholder="Akreditasi (*)" item-title="name" item-value="id" :items="accreditations" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="createAccreditationRequest.is_active" label="Status (*)"
                                placeholder="Status (*)" item-title="name" item-value="id" :items="statuses" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createAccreditationRequest.study_program_id == '' || createAccreditationRequest.decree_number == '' || createAccreditationRequest.decree_date == '' || createAccreditationRequest.decree_due_date == '' || createAccreditationRequest.accreditation == ''"
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