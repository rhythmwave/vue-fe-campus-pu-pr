<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateDocumentType } from '~~/composables/api/document-type/updateDocumentType';
import { ErrorRoot } from '~~/types/api/error';
import { UpdateDocumentTypeRequest } from '~~/types/api/document-type/UpdateDocumentType';
import { GetDocumentTypeListData } from '~~/types/api/document-type/GetDocumentTypeList';

const props = defineProps({
    getDocumentTypeListData: Array as any,
});

onMounted(async () => {
    detailDocumentType = <GetDocumentTypeListData>props.getDocumentTypeListData
    updateDocumentTypeRequest.value = Object.assign({},<UpdateDocumentTypeRequest>props.getDocumentTypeListData) 
});


const valid = ref(true)
const updateDocumentTypeRequest = ref(<UpdateDocumentTypeRequest>{});
let detailDocumentType: GetDocumentTypeListData;

const emit = defineEmits(['close', 'reload'])

async function update() {
    try {
        const { response: updateRoleResponse, error } = await updateDocumentType(updateDocumentTypeRequest.value)

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
                <span class="title text-white">Ubah Tipe Dokumen</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateDocumentTypeRequest.name" variant="outlined" hide-details
                                label="Nama(*)" :readonly="false" />
                        </v-col>
                        
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateDocumentTypeRequest.name == ''"
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