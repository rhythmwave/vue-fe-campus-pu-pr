<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { UpdateAccreditationRequest } from '~~/types/api/admin-study-program/UpdateAccreditation';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';

const props = defineProps({
    id: String,
    decree_number: String,
    decree_date: String,
    decree_due_date: String,
    accreditation: String,
    is_active: Boolean,
});

const valid = ref(true)
const updateAccreditationRequest = ref(<UpdateAccreditationRequest>{

});
let formatTimeAppend = ""
onMounted(async () => {
    updateAccreditationRequest.value = {
        id: `${props.id}`,
        decree_number: `${props.decree_number}`,
        accreditation: `${props.accreditation}`,
        decree_date: `${props.decree_date?.substring(0, 10)}`,
        decree_due_date: `${props.decree_due_date?.substring(0, 10)}`,
        is_active: props.is_active,
    };
})


const emit = defineEmits(['close', 'reload'])
async function update() {
    try {
        // return true;
        if (updateAccreditationRequest.value.decree_date) {
            updateAccreditationRequest.value.decree_date = convertDateWithoutTimeToTimezoned(updateAccreditationRequest.value.decree_date)
        }
        if (updateAccreditationRequest.value.decree_due_date) {
            updateAccreditationRequest.value.decree_due_date = convertDateWithoutTimeToTimezoned(updateAccreditationRequest.value.decree_due_date)
        }
        try {
            const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/study_program/admin_accreditation.AdminAccreditationHandler/Update`, <any>{
                method: 'PATCH',
                body: updateAccreditationRequest.value,
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
            }
            emit("reload");
        } catch (error) {
            alert(error)
        }
    } catch (error) {
        alert(error)
        console.log(error)
        // return false;
    }
    emit("close");
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
</script>
<template>
    <div>
        <v-card>
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Akreditasi</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAccreditationRequest.decree_number" variant="outlined" hide-details
                                label="No. S.K. Akreditasi BAN-P.T (*)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAccreditationRequest.decree_date" type="date" variant="outlined"
                                hide-details label="Tanggal S.K. (Surat Keputusan) Akreditasi BAN (*)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAccreditationRequest.decree_due_date" type="date"
                                variant="outlined" hide-details
                                label="Tanggal batas akhir berlaku S.K. (Surat Keputusan) Akreditasi BAN (*)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="updateAccreditationRequest.accreditation" label="Akreditasi (*)"
                                placeholder="Akreditasi (*)" item-title="name" item-value="id" :items="accreditations" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="updateAccreditationRequest.is_active" label="Status (*)"
                                placeholder="Status (*)" item-title="name" item-value="id" :items="statuses" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateAccreditationRequest.id == ''"
                                    @click="update(); ">
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