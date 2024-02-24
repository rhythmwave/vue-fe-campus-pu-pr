<script setup lang="ts">
import { GetLectureDetailData } from '~~/types/api/lecturer-lecture/GetLectureDetail';
import { CreateLectureRequest, CreateLectureParticipantData } from '~~/types/api/lecturer-lecture/CreateLecture';
import { getLectureDetail } from '~~/composables/api/academic-portal-lecturer-lecture/getLectureDetail';
import { updateLecture } from '~~/composables/api/academic-portal-lecturer-lecture/updateLecture';
import { ErrorRoot } from '~~/types/api/error';


const emit = defineEmits(['close', 'reload'])
const props = defineProps({
    title: String,
    lectureId: String,
});

const lectureId = ref('')
const detail = ref(<GetLectureDetailData>{})
const attendances = ref(<CreateLectureParticipantData[]>[])
const detailStudentLength = ref(0)
const create = ref(<CreateLectureRequest>{
    id: '',
    lecture_theme: '',
    lecture_subject: '',
    remarks: '',
    is_manual_participation: true,
    autonomous_participation_end_time: '',
    participants: []
})

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
    attendances.value.forEach(function(item){
        create.value.participants.push(item)
    })
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
    detailStudentLength.value = detail.value.students.length
    detail.value.students.forEach(function(item){
        if(item.is_awol || item.is_attend || item.is_leave || item.is_sick){
            if(item.is_awol){
                attendances.value.push(<CreateLectureParticipantData>{
                    name: 'Alpha',
                    student_id: item.id,
                    is_attend: false,
                    is_sick: false,
                    is_leave: false,
                    is_awol: true
                })
            }
            if(item.is_sick){
                attendances.value.push(<CreateLectureParticipantData>{
                    name: 'Sakit',
                    student_id: item.id,
                    is_attend: false,
                    is_sick: false,
                    is_leave: false,
                    is_awol: true
                })
            }
            if(item.is_leave){
                attendances.value.push(<CreateLectureParticipantData>{
                    name: 'Izin',
                    student_id: item.id,
                    is_attend: false,
                    is_sick: false,
                    is_leave: true,
                    is_awol: false
                })
            }
            if(item.is_attend){
                attendances.value.push(<CreateLectureParticipantData>{
                    name: 'Hadir',
                    student_id: item.id,
                    is_attend: true,
                    is_sick: false,
                    is_leave: false,
                    is_awol: false
                })
            }
        }
    })
    console.log(attendances.value)
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
                    <td>{{ detail.subject_name }}</td>
                </tr>
                <tr>
                    <td>Kelas</td>
                    <td> {{ detail.class_name }} </td>
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
        </v-form>
        <v-table class="month-table">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kehadiran</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in detail.students">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                        <v-select variant="outlined" hide-details label="Kehadiran" v-model="attendances[index]" :items="[
                            {student_id: item.id, name: 'Hadir', is_attend: true, is_sick: false, is_leave: false, is_awol: false},
                            {student_id: item.id, name: 'Alpha', is_attend: false, is_sick: false, is_leave: false, is_awol: true},
                            {student_id: item.id, name: 'Izin', is_attend: false, is_sick: false, is_leave: true, is_awol: false},
                            {student_id: item.id, name: 'Sakit', is_attend: false, is_sick: true, is_leave: false, is_awol: false},
                        ]" item-value="id" item-title="name" return-object />
                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-col cols="12">
            <v-card-actions class="pa-4">
                <v-spacer />
                <v-btn color="error" @click="$emit('close')">
                    Batal
                </v-btn>
                <v-btn color="secondary" :disabled="detailStudentLength != attendances.length" @click="save">
                    Simpan
                </v-btn>
            </v-card-actions>
        </v-col>
    </v-card>
</template>