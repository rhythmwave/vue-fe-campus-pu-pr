<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import { UpdateScheduleRequest, ExamSupervisorRequest } from '~~/types/api/schedule/UpdateScheduleRequest';
import { GetExamSupervisorRoleListData } from '~~/types/api/class-participant/GetExamSupervisorRole';
import { GetExamSupervisorListData } from '~~/types/api/class-participant/GetExamSupervisor';
import { getExamSupervisorRoleList } from '~~/composables/api/class-participant/exam-supervisor-role/getExamSupervisorRoleList';
import { getExamSupervisorList } from '~~/composables/api/class-participant/exam-supervisor/getExamSupervisorList';
import { updateSchedule } from '~~/composables/api/schedule/updateSchedule';
import { ErrorRoot } from '~~/types/api/error';

const emit = defineEmits(['close', 'reload'])
const props = defineProps({
    data: Object,
});
const limit = 20
const page = 1
interface supervisorList {
    name: string
    role: string
    exam_supervisor_id: string
    exam_supervisor_role_id: string
}
const data = ref(<UpdateScheduleRequest>{})
const examSupervisorRoleList = ref(<GetExamSupervisorRoleListData[]>[])
const examSupervisorList = ref(<GetExamSupervisorListData[]>[])
const examSupervisorRole = ref('')
const examSupervisor = ref('')
const examSupervisorsForUpdate = ref(<ExamSupervisorRequest[]>[])
const examSupervisorForUpdate = ref(<supervisorList[]>[])
async function getExamSupervisorRole(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getExamSupervisorRoleList(limit, page, search)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            examSupervisorRoleList.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getExamSupervisor(limit: number, page: number, search: string) {
  try {
    const { response: resp, error: error } = await getExamSupervisorList(limit, page, search, '')
    if (error) {
        let dataError = <ErrorRoot>error;
        alert(dataError.meta.message);
        return;
    }
    if (resp != null) {
      examSupervisorList.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function add(){
    examSupervisorForUpdate.value.push(<supervisorList>{
        name: examSupervisor.value.name,
        role: examSupervisorRole.value.name,
        exam_supervisor_id: examSupervisor.value.id,
        exam_supervisor_role_id: examSupervisorRole.value.id,
    })
    examSupervisorRole.value = ''
    examSupervisor.value = ''
}
async function deleteForUpdate(item: any){
    let index = examSupervisorForUpdate.value.map(e => e.exam_supervisor_id).indexOf(item.exam_supervisor_id)
    examSupervisorForUpdate.value.splice(index, 1)
}
async function save(){
    examSupervisorForUpdate.value.forEach(function(item){
        data.value.exam_supervisors.push(<ExamSupervisorRequest>{
            exam_supervisor_id: item.exam_supervisor_id,
            exam_supervisor_role_id: item.exam_supervisor_role_id,
        })
    })
    try {
        const { response: createRoleResponse, error } = await updateSchedule(data.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emit('reload')
            emit('close')
        }
    } catch (error) {
        alert(error)
    }
}
onMounted(async () => {
    await getExamSupervisorRole(limit, page, '')
    await getExamSupervisor(limit, page, '')
    props.data?.exam_supervisors.forEach(function(item: any){
        examSupervisorForUpdate.value.push(<supervisorList>{
            name: item.name,
            role: item.exam_supervisor_role_name,
            exam_supervisor_id: item.id,
            exam_supervisor_role_id: item.exam_supervisor_role_id,
        })
    });
    data.value = <UpdateScheduleRequest>{
        id: props.data?.id,
        class_id: props.data?.class_id,
        room_id: props.data?.room_id,
        single_day_lecturer_id: props.data?.single_day_lecturer_id,
        single_day_date: props.data?.single_day_date,
        day_of_week: props.data?.day_of_week,
        start_time: props.data?.start_time,
        end_time: props.data?.end_time,
        theory_credit: props.data?.theory_credit,
        practicum_credit: props.data?.practicum_credit,
        field_practicum_credit: props.data?.field_practicum_credit,
        is_exam: props.data?.is_exam,
        is_theory_exam: props.data?.is_theory_exam,
        is_practicum_exam: props.data?.is_practicum_exam,
        is_field_practicum_exam: props.data?.is_field_practicum_exam,
        is_midterm_exam: props.data?.is_midterm_exam,
        is_endterm_exam: props.data?.is_endterm_exam,
        exam_supervisors: examSupervisorsForUpdate.value,
    }
})
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Peran Pengawas</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="12">
                                <v-autocomplete v-model="examSupervisor" :items="examSupervisorList" item-value="id" item-title="name" variant="outlined" hide-details label="Cari Pengawas Ujian" @update:search="(sl: any) => getExamSupervisor(20, 1, sl)" default-value="" return-object></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-autocomplete v-model="examSupervisorRole" :items="examSupervisorRoleList" item-value="id" item-title="name" variant="outlined" hide-details label="Cari Peran Pengawas Ujian" @update:search="(sl: any) => getExamSupervisorRole(20, 1, sl)" default-value="" return-object></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-btn color="secondary"
                                    @click="add">
                                    Tambah
                                </v-btn>
                            </v-col>
                            <v-table class="mt-5">
                                <thead>
                                    <tr>
                                        <th class="text-subtitle-1 font-weight-semibold">No</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Peran</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in examSupervisorForUpdate">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ item.name }}</td>
                                        <td>{{ item.role }}</td>
                                        <td>
                                            <v-btn title="Add" icon flat @click="deleteForUpdate(item)">
                                                <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                            </v-btn>
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
                                <v-btn color="secondary"
                                    @click="save(); ">
                                    Simpan
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>