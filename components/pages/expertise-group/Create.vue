<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';

import { CreateExpertiseGroupRequest } from '~~/types/api/expertise-group/CreateExpertiseGroup';
import { createExpertiseGroup } from '~~/composables/api/expertise-group/createExpertiseGroup';

import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';


const props = defineProps({
    id: String,
});

onMounted(async () => {

});

const valid = ref(true)
const create = ref(<CreateExpertiseGroupRequest>{});

const emitData = defineEmits(['close', 'reload'])


async function save() {
    try {
        const { response: createRoleResponse, error } = await createExpertiseGroup(create.value)
        
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
                <span class="title text-white">Tambah Kelompok Keahlian</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="create.name" variant="outlined" hide-details
                                label="Nama (*)" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="create.name == ''"
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