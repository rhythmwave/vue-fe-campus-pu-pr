<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';

import { CreateSupervisorRoleRequest } from '~~/types/api/thesis/CreateSupervisorRole';
import { createSupervisorRole } from '~~/composables/api/admin-thesis/createSupervisorRole';

const props = defineProps({
    // semesterId: Array as any,
});

const emit = defineEmits(['reload', 'close'])

const create = ref(<CreateSupervisorRoleRequest>{
    name: '',
    sort: ''
})

async function save(){
    try {
        const { response: createRoleResponse, error } = await createSupervisorRole(create.value)
        
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            console.log(dataError.meta.message);
            return;
        } else {
            emit('reload');
        }
        // return true;
    } catch (error) {
        alert(error)
        console.log(error)
        // return false;
    }
    emit('close');
}


onMounted(async () => {
    // semester_id.value = <string>props.semesterId
})
</script>

<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">Buat Peran Dosen Ujian TA</v-card-title>
            <v-card-text>
                <v-col cols="12" sm="12">
                    <v-form ref="form" lazy-validation>
                        <v-row>
                            <v-col cols="12" sm="12" class="float-left">
                                <v-text-field v-model="create.name" variant="outlined" hide-details label="Nama (*)" />
                            </v-col>
                            <v-col cols="12" sm="12" class="float-left">
                                <v-text-field type="number" v-model="create.sort" variant="outlined" hide-details label="Sort" />
                            </v-col>
                            <v-col cols="12">
                                <v-card-actions class="pa-4">
                                    <v-spacer />
                                    <v-btn color="error" @click="$emit('close')">
                                        Batal
                                    </v-btn>
                                    <v-btn color="secondary" :disabled="create.name == ''"
                                        @click="save(); ">
                                        Tambah
                                    </v-btn>
                                </v-card-actions>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>
            </v-card-text>
        </v-card>
    </div>
</template>