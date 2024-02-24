<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetOfficerActionListData, GetOfficerActionListRoot } from '~~/types/api/officer-action/GetOfficerActionList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateOfficerActionRequest } from '~~/types/api/officer-action/CreateOfficerAction';
import { createOfficerAction } from '~~/composables/api/officer-action/createOfficerAction';
import { AnyMap } from '@jridgewell/trace-mapping';
import { getOfficerList } from '~~/composables/api/officer/getOfficerList';
import { GetOfficerListData } from '~~/types/api/officer/GetOfficerList';
import { getDocumentTypeList } from '~~/composables/api/document-type/getDocumentTypeList';
import { GetDocumentTypeListData } from '~~/types/api/document-type/GetDocumentTypeList';
import { getDocumentActionList } from '~~/composables/api/document-action/getDocumentActionList';
import { GetDocumentActionListData } from '~~/types/api/document-action/GetDocumentActionList';


// const props = defineProps({
// });

onMounted(async () => {

    await getOfficer()
    await getDocumentType()
    await getDocumentAction()
});


const valid = ref(true)
const createOfficerActionRequest = ref(<CreateOfficerActionRequest>{
    document_action_id: '',
    document_type_id: '',
    officer_id: '',
});

const emit = defineEmits(['close', 'reload'])

const officer = ref<GetOfficerListData[]>([])
async function getOfficer() {
    try {
        const { response: resp, error: error } = await getOfficerList(1000000, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            officer.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const documentType = ref<GetDocumentTypeListData[]>([])
async function getDocumentType() {
    try {
        const { response: resp, error: error } = await getDocumentTypeList(1000000, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            documentType.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const documentAction = ref<GetDocumentActionListData[]>([])
async function getDocumentAction() {
    try {
        const { response: resp, error: error } = await getDocumentActionList(1000000, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            documentAction.value = resp?.data
            console.log('documentAction.value')
            console.log(documentAction.value)
        }
    } catch (error) {
        alert(error)
    }
}

async function save() {
    try {
        const { response: createRoleResponse, error } = await createOfficerAction(createOfficerActionRequest.value)

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
                <span class="title text-white">Proses Pengesahan Dokumen</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="documentType" item-value="id"
                                item-title="name" label="Nama Dokumen"
                                v-model="createOfficerActionRequest.document_type_id"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="documentAction" item-value="id"
                                item-title="action" label="Tipe Pengesah"
                                v-model="createOfficerActionRequest.document_action_id"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="officer" item-value="id" item-title="name"
                                label="Pejabat Pengesah" v-model="createOfficerActionRequest.officer_id"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createOfficerActionRequest.officer_id == ''"
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