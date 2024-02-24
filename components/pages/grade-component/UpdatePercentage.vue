<script setup lang="ts">

import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import { BulkupdateGradeComponentPercentage } from '~~/composables/api/grade-component/BulkUpdateGradeComponentPercentage';
import { ErrorRoot } from '~~/types/api/error';
import { BulkUpdateGradeComponentPercentageRequest } from '~~/types/api/grade-component/BulkUpdateGradeComponentPercentage';
import { GetGradeComponentWithCategoryListData, GetGradeComponentWithCategoryListGradeComponent } from '~~/types/api/grade-component/GetGradeComponentWithCategoryList';


const emit = defineEmits(['close', 'reload'])
const props = defineProps({
    getGradeComponentWithCategoryListData: Array as any,
});


onMounted(async () => {
    updateData.value = Object.assign({}, <GetGradeComponentWithCategoryListData>props.getGradeComponentWithCategoryListData)
    listData.value = [];//Object.assign([], updateData.value.grade_components)
    updateData.value.grade_components.forEach((gc) => {
        listData.value.push(Object.assign({}, gc))
    });
});

const valid = ref(true)
const updateData = ref(<GetGradeComponentWithCategoryListData>{
})
const listData = ref(<GetGradeComponentWithCategoryListGradeComponent[]>[])

async function update() {
    let check = listData.value.map((ld) => ld.default_percentage).reduce((a, b) => a + b, 0)
    if(check != 100){
        alert('Nilai Harus 100%')
        return false
    }
    try {
        const { response: updateRoleResponse, error } = await BulkupdateGradeComponentPercentage(<BulkUpdateGradeComponentPercentageRequest>{
            study_program_id: updateData.value.study_program_id,
            subject_category_id: updateData.value.study_program_id,
            grade_components: listData.value,
        })

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
                <span class="title text-white">Set Komponen Nilai Per Program Study</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <table>
                    <PagesStudyProgramsDetailItem title="Program Studi" :value="`: ${updateData.study_program_name}`" />
                    <PagesStudyProgramsDetailItem title="Kategori Mata Kuliah"
                        :value="`: ${updateData.subject_category_name}`" />
                </table>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-table>
                        <thead>
                            <tr>
                                <th width="30">
                                    No
                                </th>
                                <th>
                                    Jenis
                                </th>
                                <th>
                                    Percentage
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="gc, index in listData">
                                <td>{{ index + 1 }}</td>
                                <td>
                                    <v-checkbox :label="gc.name" v-model="gc.is_active"></v-checkbox>
                                </td>
                                <td>
                                    <v-text-field v-model.number="gc.default_percentage" type="number" variant="outlined"
                                        :rules="[(v: number) => (v >= 0 && v <= 100) || 'Masukan persentase antara 0 - 100',]"
                                        :hide-details="gc.default_percentage >= 0 && gc.default_percentage <= 100"
                                        :label="`${gc.name}(%)`" />
                                    <!-- {{ gc.default_percentage }} -->
                                </td>
                            </tr>
                        </tbody>

                    </v-table>
                    <v-table style="width:220px">
                        <PagesStudyProgramsDetailItem title="Jumlah Persentase"
                            :value="`: ${listData.map((ld) => ld.default_percentage).reduce((a, b) => a + b, 0)}%`" />
                    </v-table>
                    <Vspace space="3"></Vspace>
                    <v-alert
                        v-if="!(listData.map((ld) => ld.default_percentage).reduce((a, b) => a + b, 0) <= 100 && listData.map((ld) => ld.default_percentage).reduce((a, b) => a + b, 0) >= 0)"
                        class="mb-3 " color="error" variant="tonal">Jumlah persentase tidak valid, Jumlah harus antara 0 -
                        100</v-alert>
                    <v-col cols="12">
                        <v-card-actions class="pa-4">
                            <v-spacer />
                            <v-btn color="error" @click="$emit('close')">
                                Batal
                            </v-btn>
                            <v-btn color="secondary"
                                :disabled="!    (listData.map((ld) => ld.default_percentage).reduce((a, b) => a + b, 0) <= 100 && listData.map((ld) => ld.default_percentage).reduce((a, b) => a + b, 0) >= 0)"
                                @click="update(); ">
                                Simpan
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>