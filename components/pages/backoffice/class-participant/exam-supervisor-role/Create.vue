<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { CreateExamSupervisorRole } from '~~/types/api/class-participant/CreateExamSupervisorRole';
import { createExamSupervisorRole } from '~~/composables/api/class-participant/exam-supervisor-role/createExamSupervisorRole';

const emit = defineEmits(['close', 'reload'])
const valid = ref(true)
const createObj = ref(<CreateExamSupervisorRole>{})

async function save() {
    try {
        const { response: createRoleResponse, error } = await createExamSupervisorRole(createObj.value)

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

onMounted(async () => {

});

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Peran Pengawas Ujian</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field variant="outlined" hide-details label="Peran Pengawas Ujian" v-model="createObj.name"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="number" variant="outlined" hide-details label="Sort" v-model="createObj.sort"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createObj.name == ''"
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