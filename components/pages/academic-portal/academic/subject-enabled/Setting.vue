<script setup lang="ts">
import { ErrorRoot } from "~~/types/api/error";
import { SetLecturerClassGradeComponentData, SetLecturerClassGradeComponentRequest } from "~~/types/api/lecturer-class-grade-component/SetLecturerClassGradeComponent";
import { setLecturerClassGradeComponent } from '~~/composables/api/lecturer-class-grade-component/setLecturerClassGradeComponent';

const emit = defineEmits(['close', 'reload'])

const props = defineProps({
    data: Array as any,
    input: Array as any,
    class_id: String,
});

const createLecturerClassGradeComponent = ref(<SetLecturerClassGradeComponentRequest>{})

watch(props.input, value => {
    let name = []
    let objects = []
    if (typeof value !== 'undefined') {
        for (let i = 0; i < value.length; i++) {
            if (typeof props.input[i] !== 'undefined') {
                for (let index = 0; index < props.input.length; index++) {
                    if (!inArrayCheck(props.input[i].name, name)) {
                        name.push(props.input[i].name)
                        objects.push({
                            name: props.input[i].name,
                            percentage: Number(props.input[i].percentage),
                            is_active: props.input[i].is_active
                        })
                    }
                }
            }
            if (!inArrayCheck(value[i].name, name)) {
                name.push(value[i].name)
                objects.push({
                    name: value[i].name,
                    percentage: Number(value[i].default_percentage),
                    is_active: false
                })
            }
        }
    }
    createLecturerClassGradeComponent.value = {
        class_id: <string>props.class_id,
        data: <SetLecturerClassGradeComponentData[]>(objects),
    }
    console.log("objects")
    console.log(objects)
}, { deep: true, immediate: true })

function inArrayCheck(first: string, second: string[]) {
    var length = second.length;
    for (var i = 0; i < length; i++) {
        if (second[i] == first) return true;
    }
    return false;
}

async function save() {
    let sumPercentage = 0
    var tempData = <SetLecturerClassGradeComponentData[]>[];
    var isExist = false;
    var isHaveNonames = false;
    createLecturerClassGradeComponent.value?.data.forEach(function (item) {
        item.is_active = true
        sumPercentage += Number(item.percentage)
        item.name = item.name.trim()
        tempData.forEach(function (td) {
            if (td.name == item.name) {
                isExist = true;
            }
        })
        if (item.name.trim() == "") {
            isHaveNonames = true
        }
        tempData.push(item)
    })
    if (isHaveNonames) {
        alert('Jenis Komponen Penilaian Harus Di Isi')
        return false
    }
    if (isExist) {
        alert('Komponen Penilaian Harus Unik')
        return false
    }
    if (sumPercentage != 100) {
        alert('Jumlah Harus Dibuat 100%')
        return false
    }
    try {
        const { response: resp, error: error } = await setLecturerClassGradeComponent(createLecturerClassGradeComponent.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emit('reload')
        }
    } catch (error) {
        alert(error)
    }
    emit('close')
}
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Setting Nilai Mata Kuliah</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col>
                        <v-table>
                            <thead>
                                <tr>
                                    <!-- <th class="text-subtitle-1 font-weight-semibold">Ceklis</th> -->
                                    <th class="text-subtitle-1 font-weight-semibold">Jenis Komponen Nilai</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Persentase (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in createLecturerClassGradeComponent?.data">
                                    <!-- <td>
                                        <v-checkbox v-model="item.is_active" class="mt-4" label=""></v-checkbox>
                                    </td> -->
                                    <td>
                                        <v-text-field variant="outlined" hide-details v-model="item.name"
                                            :label="item.name" readonly/>
                                    </td>
                                    <td>
                                        <v-text-field type="number" variant="outlined" hide-details
                                            v-model.number="item.percentage" />
                                    </td>
                                </tr>
                                
                            </tbody>
                        </v-table>
                    </v-col>
                    <v-col cols="12">
                        <v-card-actions class="pa-4">
                            <v-spacer />
                            <v-btn color="error" @click="$emit('close')">
                                Batal
                            </v-btn>
                            <v-btn color="secondary" @click="save();">
                                Tambah
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>