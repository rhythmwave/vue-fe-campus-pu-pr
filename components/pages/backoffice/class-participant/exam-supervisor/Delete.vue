<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { DeleteExamSupervisor } from '~~/types/api/class-participant/DeleteExamSupervisor';
import { deleteExamSupervisor } from '~~/composables/api/class-participant/exam-supervisor/deleteExamSupervisor';

const emit = defineEmits(['close', 'reload'])
const props = defineProps({
    dataId: String,
    dataName: String,
});
const id = ref('')
const name = ref('')

async function deleteItem() {
    try {
        const { response: updateRoleResponse, error } = await deleteExamSupervisor(<DeleteExamSupervisor>{id: id.value})
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
    id.value = <string>props.dataId
    name.value = <string>props.dataName
});

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Delete Peran Pengawas</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        Yakin Menghapus Data {{ name }}
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary"
                                    @click="deleteItem">
                                    Hapus
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>