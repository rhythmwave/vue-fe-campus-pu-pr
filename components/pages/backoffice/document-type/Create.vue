<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetDocumentTypeListData, GetDocumentTypeListRoot } from '~~/types/api/document-type/GetDocumentTypeList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateDocumentTypeRequest } from '~~/types/api/document-type/CreateDocumentType';
import { createDocumentType } from '~~/composables/api/document-type/createDocumentType';
import { AnyMap } from '@jridgewell/trace-mapping';


// const props = defineProps({
// });

onMounted(async () => {

});

const valid = ref(true)
const createDocumentTypeRequest = ref(<CreateDocumentTypeRequest>{});

const emit = defineEmits(['close', 'reload'])

async function save() {
    try {
        const { response: createRoleResponse, error } = await createDocumentType(createDocumentTypeRequest.value)

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
                <span class="title text-white">Tambah Tipe Dokumen</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createDocumentTypeRequest.name" variant="outlined" hide-details
                                label="Nama(*)" :readonly="false" />
                        </v-col>
                        
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createDocumentTypeRequest.name == ''"
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