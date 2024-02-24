<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateAdminStudyProgramDegree } from '~~/composables/api/admin-study-program/updateAdminStudyProgramDegree';
import { ErrorRoot } from '~~/types/api/error';
import { UpdateAdminStudyProgramDegreeRequest } from '~~/types/api/admin-study-program/UpdateAdminStudyProgramDegree';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';

const props = defineProps({
    getAdminStudyProgramDegreeListData: Array as any,
});

onMounted(async () => {
    detailAdminStudyProgramDegree = <GetAdminStudyProgramListData>props.getAdminStudyProgramDegreeListData
    updateAdminStudyProgramDegreeRequest.value = Object.assign({}, <UpdateAdminStudyProgramDegreeRequest>props.getAdminStudyProgramDegreeListData)
    updateAdminStudyProgramDegreeRequest.value.study_program_id = detailAdminStudyProgramDegree.id
});


const valid = ref(true)
const updateAdminStudyProgramDegreeRequest = ref(<UpdateAdminStudyProgramDegreeRequest>{
    study_program_id: '',
    degree: '',
    short_degree: '',
    english_degree: '',
});
let detailAdminStudyProgramDegree = <GetAdminStudyProgramListData>{
    study_program_id: '',
    degree: '',
    short_degree: '',
    english_degree: '',
};

const emitData = defineEmits(['close', 'reload'])

async function update() {
    try {
        const { response: updateRoleResponse, error } = await updateAdminStudyProgramDegree(updateAdminStudyProgramDegreeRequest.value)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emitData('reload');
        }
        // return true;
        emitData('close');
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
                <span class="title text-white">Ubah Gelar</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            Program Studi : {{ detailAdminStudyProgramDegree.name }}
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramDegreeRequest.degree" variant="outlined"
                                hide-details label="Gelar(*)" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramDegreeRequest.short_degree" variant="outlined"
                                hide-details label="Gelar Singkat" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramDegreeRequest.english_degree" variant="outlined"
                                hide-details label="Gelar Asing" :readonly="false" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateAdminStudyProgramDegreeRequest.degree == ''"
                                    @click="update();">
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