<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { DeleteExamSupervisorRole } from '~~/types/api/class-participant/DeleteExamSupervisorRole';
import { deleteExamSupervisorRole } from '~~/composables/api/class-participant/exam-supervisor-role/deleteExamSupervisorRole';

const props = defineProps({
    data: Array as any,
});
const emit = defineEmits(['close', 'reload'])
const valid = ref(true)
const deleteObj = ref(<DeleteExamSupervisorRole>{})

async function deleteItem() {
    try {
        const { response: createRoleResponse, error } = await deleteExamSupervisorRole(deleteObj.value)

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
    deleteObj.value = <DeleteExamSupervisorRole>props.data
});

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Delete Peran Pengawas Ujian {{  }}</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        Yakin Menghapus Data {{ deleteObj.name }}
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary"
                                    @click="deleteItem">
                                    Delete
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>