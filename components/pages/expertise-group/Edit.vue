<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';

import { UpdateExpertiseGroupRequest } from '~~/types/api/expertise-group/UpdateExpertiseGroup';
import { updateExpertiseGroup } from '~~/composables/api/expertise-group/updateExpertiseGroup';

import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';


const props = defineProps({
    data: <UpdateExpertiseGroupRequest>{} as any,
});

onMounted(async () => {

});

const valid = ref(true)
const updateData = ref(<UpdateExpertiseGroupRequest>{});

const emitData = defineEmits(['close', 'reload'])


async function update() {
    try {
        const { response: createRoleResponse, error } = await updateExpertiseGroup(updateData.value)
        
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
onMounted(async () => {
    updateData.value = <UpdateExpertiseGroupRequest>{
        id: props.data.id,
        name: props.data.name,
    }
})
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
                            <v-text-field v-model="updateData.name" variant="outlined" hide-details
                                label="Nama (*)" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateData.name == ''"
                                    @click="update(); ">
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