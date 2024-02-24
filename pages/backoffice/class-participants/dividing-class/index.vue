<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const page = 1
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Pembagian Kelas')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: title,
    disabled: true,
    href: '#'
  }
])

const studyPrograms = ref<GetAdminStudyProgramListData[]>([])
const studyProgramId = ref('')
const classrooms = ref<GetClassroomListData[]>([])
const classIds = ref(<string[]>[])
const methodTypeClass = ref(0)

async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getClassroom(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getClassroomList(limit, page, search, studyProgramId.value, '', true, '', false)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classrooms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function selectedAll(){
    if(methodTypeClass.value !== 3){
        alert('tidak bisa memilih semua, selain metode Bagi Rata')
        return false
    }
    if(!(classIds.value.some(el => el === 'all'))){
        classrooms.value?.forEach(function(item){
            classIds.value.push(item.id)
        })
    }else{
        classIds.value = <string[]>[]
    }
}
async function radioSelected(ev: any){
    switch (Number(ev.target.value)) {
        case 1:
        methodTypeClass.value = 1     
            break;
        case 2:
        methodTypeClass.value = 2     
            break;
        case 3:
        methodTypeClass.value = 3     
            break;
    }
}
async function process(){
    if(methodTypeClass.value === 3){
        if(classIds.value.length < 2){
            alert('pilih kelas lebih dari 2')
            return false
        }
    }else if(methodTypeClass.value > 0){
        if(classIds.value.length !== 2){
            alert('pilih kelas harus 2')
            return false
        }
    }
    const checkData = ref(<any>[])
    for(let index = 0; index < classIds.value.length; index++) {
        // let detailClass = <GetClassroomDetail>{}
        let detailClass = await getClassroomDetail(classIds.value[index])
        let key = <any>detailClass.response?.data.subject_id
        if(index == 0){
            checkData.value.push(key)
        }else{
            if(checkData.value.indexOf(key) > -1){
                checkData.value.push(key)
            }else{
                alert("Harus Memilih Mata Kuliah Yang Sama ! ")
                return false
            }
        }
    }
    let router = useRouter()
    router.push({path: '/backoffice/class-participants/dividing-class/classes', query: {class_id: classIds.value, type: methodTypeClass.value}})
}
watch(studyProgramId, async function(value){
    if(value != ''){
        await getClassroom(limit, page, '')
    }
})
onMounted(async () => {
    await getAdminStudyProgram()
})
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="'Daftar '+title">
            <v-row>
                <v-col cols="12" lg="12" md="12">
                    <v-alert type="info" variant="tonal">
                        Keterangan : 
                        <br />
                        - Harus Memilih Lebih Dari 2 (dua) Kelas Untuk Melakukan Perombakan Pada Kelas <br>
                        - Jika Ingin Merombak Ganjil/Genap Hanya Diperuntukkan 2 (dua) Kelas Saja.
                    </v-alert>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" lg="12" md="12">
                    <v-col cols="12" lg="6" md="6">
                        <v-autocomplete v-model="studyProgramId" :items="studyPrograms" item-title="name" item-value="id" density="compact" :label="'Pilih Program Studi'" hide-details variant="outlined" />
                    </v-col>
                </v-col>
                <v-col cols="12" lg="12" md="12">
                    <v-radio-group inline>
                        <v-radio label="Ganjil/Genap" :value="1" @click="(sl: any) => {radioSelected(sl)}"></v-radio>
                        <v-radio label="Genap/Ganjil" :value="2" @click="(sl: any) => {radioSelected(sl)}"></v-radio>
                        <v-radio label="Bagi Rata" :value="3" @click="(sl: any) => {radioSelected(sl)}"></v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
        </SharedUiParentCard>
        <v-table class="mt-10">
            <caption>Daftar Kelas</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">
                        <v-checkbox v-model="classIds" :value="'all'" @click="selectedAll"></v-checkbox>
                    </th>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                    <th class="text-subtitle-1 font-weight-semibold">Dosen</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kapasitas Maksimal</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah Peserta</th>
                    <th class="text-subtitle-1 font-weight-semibold">KRS Belum Disetujui</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in classrooms">
                    <td>
                        <v-checkbox v-model="classIds" :value="item.id"></v-checkbox>
                    </td>
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.subject_name }} ({{ item.subject_code }})</td>
                    <td>{{ item.name }}</td>
                    <td>
                        <ul v-for="lecturer in item.lecturers">
                            <li>{{ lecturer.name }}</li>
                        </ul>
                    </td>
                    <td>{{ item.maximum_participant }}</td>
                    <td>{{ item.total_participant }}</td>
                    <td>{{ item.unapproved_study_plan }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="8" class="text-center">
                    <VBtn color="primary" flat class="ml-auto" @click="process" :disabled="methodTypeClass == 0 || classIds.length == 0">
                        <v-icon class="mr-2">
                            mdi-arrow-collapse-right
                        </v-icon>Proses
                    </VBtn>
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>