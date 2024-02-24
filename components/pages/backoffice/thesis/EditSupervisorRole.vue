<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';

import { EditSupervisorRoleRequest } from '~~/types/api/thesis/EditSupervisorRole';
import { editSupervisorRole } from '~~/composables/api/admin-thesis/editSupervisorRole';

const props = defineProps({
    supervisorRole: Object as any,
});

const emit = defineEmits(['reload', 'close'])

const edit = ref(<EditSupervisorRoleRequest>{
    id: '',
    name: '',
    sort: ''
})

async function save(){
    try {
        const { response: createRoleResponse, error } = await editSupervisorRole(edit.value)
        
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
    edit.value = <EditSupervisorRoleRequest>{
        id: props.supervisorRole.id,
        name: props.supervisorRole.name,
        sort: props.supervisorRole.sort,
    }
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
                                <v-text-field v-model="edit.name" variant="outlined" hide-details label="Nama (*)" />
                            </v-col>
                            <v-col cols="12" sm="12" class="float-left">
                                <v-text-field type="number" v-model="edit.sort" variant="outlined" hide-details label="Sort" />
                            </v-col>
                            <v-col cols="12">
                                <v-card-actions class="pa-4">
                                    <v-spacer />
                                    <v-btn color="error" @click="$emit('close')">
                                        Batal
                                    </v-btn>
                                    <v-btn color="secondary" :disabled="edit.name == ''"
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