<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { UpdateSubjectCategoryRequest } from '~~/types/api/subject-category/UpdateSubjectCategory';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { updateSubjectCategory } from '~~/composables/api/subject-category/updateSubjectCategory';

const props = defineProps({
    id: String,
    name: String,
    code: String,
});

const valid = ref(true)
const updateSubjectCategoryRequest = ref(<UpdateSubjectCategoryRequest>{

});
let formatTimeAppend=""
onMounted(async () => {
    updateSubjectCategoryRequest.value = {
        id: `${props.id}`,
        code: `${props.code}`,
        name: `${props.name}`,
    };
})


const emit = defineEmits(['close', 'reload'])
async function update() {
    try {

        const { response: updateRoleResponse, error } = await updateSubjectCategory(updateSubjectCategoryRequest.value)
        
        if (error) {
            let dataError = <ErrorRoot>error.data;
            alert(dataError.meta.message);
            console.log(dataError.meta.message); alert(error)
            return;
        }
        emit("reload");
    } catch (error) {
        alert(error)
        console.log(error)
        // return false;
    }
    emit("close");
}

</script>
<template>
    <div>
        <v-card>
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Kategori Mata Kuliah</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateSubjectCategoryRequest.code" variant="outlined" hide-details
                                label="Code (*)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateSubjectCategoryRequest.name" variant="outlined"
                                hide-details label="Nama (*)" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateSubjectCategoryRequest.id == ''"
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