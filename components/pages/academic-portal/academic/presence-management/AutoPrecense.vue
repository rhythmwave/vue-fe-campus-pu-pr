<script setup lang="ts">
import { GetLectureDetailData } from '~~/types/api/lecturer-lecture/GetLectureDetail';
import { CreateLectureRequest } from '~~/types/api/lecturer-lecture/CreateLecture';
import { getLectureDetail } from '~~/composables/api/academic-portal-lecturer-lecture/getLectureDetail';
import { updateLecture } from '~~/composables/api/academic-portal-lecturer-lecture/updateLecture';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateTimeToTimezoned } from '~~/utils/helpers/date-utils'

const emit = defineEmits(['close', 'reload'])
const props = defineProps({
    title: String,
    lectureId: String,
});

const lectureId = ref('')
const detail = ref(<GetLectureDetailData>{})
    const create = ref(<CreateLectureRequest>{
    id: '',
    lecture_theme: '',
    lecture_subject: '',
    remarks: '',
    is_manual_participation: false,
    autonomous_participation_end_time: '',
    participants: []
})
const date = ref('')
const time = ref('')

async function getDetail() {
    try {
        const { response: resp, error: error } = await getLectureDetail(lectureId.value)
        if (error) {
          let dataError = <ErrorRoot>error;
          alert(dataError.meta.message);
          return;
        }
        if (resp != null) {
            detail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function save(){
    create.value.autonomous_participation_end_time = convertDateTimeToTimezoned(date.value, time.value)
    try {
    const { response: createRoleResponse, error } = await updateLecture(create.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emit('close');
            emit('reload');
        }
    } catch (error) {
        alert(error)
    }
}
onMounted(async () => {
    lectureId.value = <string>props.lectureId
    create.value.id = lectureId.value
    await getDetail()
})
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">{{ title }}</span>
        </v-card-title>
        <v-table class="month-table">
            <thead>
                <tr>
                    <th colspan="2" class="text-subtitle-1 font-weight-semibold">Input Presensi</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Mata Kuliah</td>
                    <td>Pendidikan Pancasila</td>
                </tr>
                <tr>
                    <td>Kelas</td>
                    <td>A+B</td>
                </tr>
                <tr>
                    <td>Pertemuan Ke</td>
                    <td>1</td>
                </tr>
            </tbody>
        </v-table>
        <v-form ref="form" lazy-validation>
            <v-col cols="12" sm="12">
                <v-text-field v-model="create.lecture_theme" variant="outlined" hide-details label="Tema" />
            </v-col>
            <v-col cols="12" sm="12">
                <v-text-field v-model="create.lecture_subject" variant="outlined" hide-details label="Pokok Bahasan" />
            </v-col>
            <v-col cols="12" sm="12">
                <v-textarea v-model="create.remarks" label="Keterangan"></v-textarea>
            </v-col>
            <v-col cols="6" sm="6" class="float-left">
                <v-text-field type="date" v-model="date" variant="outlined" hide-details label="Tanggal" />
            </v-col>
            <v-col cols="6" sm="6" class="float-left">
                <v-text-field type="time" v-model="time" variant="outlined" hide-details label="Waktu Berakhir" />
            </v-col>
        </v-form>
        <v-col cols="12">
            <v-card-actions class="pa-4">
                <v-spacer />
                <v-btn color="error" @click="$emit('close')">
                    Batal
                </v-btn>
                <v-btn color="secondary" @click="save" :disabled="create.lecture_theme == '' || create.lecture_subject == '' || date == '' || time == ''">
                    Tambah
                </v-btn>
            </v-card-actions>
        </v-col>
    </v-card>
</template>