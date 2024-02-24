<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateDocumentAction } from '~~/composables/api/document-action/updateDocumentAction';
import { ErrorRoot } from '~~/types/api/error';
import { UpdateDocumentActionRequest } from '~~/types/api/document-action/UpdateDocumentAction';
import { GetDocumentActionListData } from '~~/types/api/document-action/GetDocumentActionList';

const props = defineProps({
    getDocumentActionListData: Array as any,
});

onMounted(async () => {
    detailDocumentAction = <GetDocumentActionListData>props.getDocumentActionListData
    updateDocumentActionRequest.value = Object.assign({},<UpdateDocumentActionRequest>props.getDocumentActionListData) 
});


const valid = ref(true)
const updateDocumentActionRequest = ref(<UpdateDocumentActionRequest>{});
let detailDocumentAction: GetDocumentActionListData;

const emit = defineEmits(['close', 'reload'])

async function update() {
    try {
        const { response: updateRoleResponse, error } = await updateDocumentAction(updateDocumentActionRequest.value)

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

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Dokumen Tipe Pengesahh</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateDocumentActionRequest.action" variant="outlined" hide-details
                                label="Nama(*)" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateDocumentActionRequest.english_action" variant="outlined" hide-details
                                label="Nama Asing" :readonly="false" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateDocumentActionRequest.action == ''"
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