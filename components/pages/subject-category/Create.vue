<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetStudyProgramListData, GetStudyProgramListRoot } from '~~/types/api/study-program/GetStudyProgramList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateSubjectCategoryRequest } from '~~/types/api/subject-category/CreateSubjectCategory';
import { createSubjectCategory } from '~~/composables/api/subject-category/createSubjectCateggory';


const props = defineProps({
    id: String,
});

onMounted(async () => {

});

const valid = ref(true)
const createSubjectCategoryRequest = ref(<CreateSubjectCategoryRequest>{
    
});

const emitData = defineEmits(['close', 'reload'])


async function save() {
    console.log(createSubjectCategoryRequest.value)
    try {
        const { response: createRoleResponse, error } = await createSubjectCategory(createSubjectCategoryRequest.value)
        
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            console.log(dataError.meta.message);
            return;
        } else {
            emitData('reload');
        }
        // return true;
    } catch (error) {
        alert(error)
        console.log(error)
        // return false;
    }
    emitData('close');

}

</script>
<template>
    <div>
        <v-card>
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Kategori Mata Kuliah</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createSubjectCategoryRequest.code" variant="outlined" hide-details
                                label="Kode (*)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createSubjectCategoryRequest.name"  variant="outlined"
                                hide-details label="Nama (*)" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createSubjectCategoryRequest.code == ''"
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