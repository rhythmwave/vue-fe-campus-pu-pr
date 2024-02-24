<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { PaginationModel } from '~~/types/api/pagination';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetExamSupervisorListData } from '~~/types/api/class-participant/GetExamSupervisor';
import { GetExamSupervisorRoleListData } from '~~/types/api/class-participant/GetExamSupervisorRole';

import { getExamSupervisorList } from '~~/composables/api/class-participant/exam-supervisor/getExamSupervisorList';
import { getExamSupervisorRoleList } from '~~/composables/api/class-participant/exam-supervisor-role/getExamSupervisorRoleList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Pengawas Ujian')
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
const examSupervisorList = ref(<GetExamSupervisorListData[]>[])
const examSupervisorId = ref('')
const examSupervisorName = ref('')
const adminStudyPrograms = ref(<GetAdminStudyProgramListData[]>[])
const study_program_id = ref('')

async function create(){
  mode.value = 'create'
  dialog.value = true
}
async function close(){
  dialog.value = false
}
async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            adminStudyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getData(limit: number, page: number, search: string) {
  try {
    const { response: resp, error: error } = await getExamSupervisorList(limit, page, search, study_program_id.value)
    if (error) {
        let dataError = <ErrorRoot>error;
        alert(dataError.meta.message);
        return;
    }
    if (resp != null) {
      examSupervisorList.value = resp?.data
      pagination.value = resp?.pagination
    }
  } catch (error) {
    alert(error)
  }
}
async function show(item: any){
  mode.value = 'show'
  dialog.value = true
  examSupervisorId.value = item.id
}
async function edit(item: any){
  mode.value = 'edit'
  dialog.value = true
  examSupervisorId.value = item.id
}
async function deleteItem(item: any){
  mode.value = 'delete'
  dialog.value = true
  examSupervisorId.value = item.id
  examSupervisorName.value = item.name
}

watch(study_program_id, async function (value) {
    if (value != '') {
        await getData(pagination.value.limit, pagination.value.page, search.value)
    }
})
onMounted(async () => {
  await getAdminStudyProgram()
  await getData(pagination.value.limit, pagination.value.page, search.value)
})
</script>
<template>
    <div>
      <div v-if="mode == 'delete'">
        <v-col cols="12" lg="8" md="6" class="text-right">
          <v-dialog v-model="dialog" max-width="800">
            <PagesBackofficeClassParticipantExamSupervisorDelete :dataId="examSupervisorId" :dataName="examSupervisorName" @reload="getData(limit, 1, '')" @close="close()" />
          </v-dialog>
        </v-col>
      </div>
      <div v-if="mode == 'edit'">
        <v-col cols="12" lg="8" md="6" class="text-right">
          <v-dialog v-model="dialog" max-width="800">
            <PagesBackofficeClassParticipantExamSupervisorEdit :data="examSupervisorId" @reload="getData(limit, 1, '')" @close="close()" />
          </v-dialog>
        </v-col>
      </div>
      <div v-if="mode == 'show'">
        <v-col cols="12" lg="8" md="6" class="text-right">
          <v-dialog v-model="dialog" max-width="800">
            <PagesBackofficeClassParticipantExamSupervisorDetail :data="examSupervisorId" />
          </v-dialog>
        </v-col>
      </div>
      <div v-if="mode == 'create'">
        <v-col cols="12" lg="8" md="6" class="text-right">
          <v-dialog v-model="dialog" max-width="800">
            <PagesBackofficeClassParticipantExamSupervisorCreate @reload="getData(limit, 1, '')" @close="close()" />
          </v-dialog>
        </v-col>
      </div>
      <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
      <v-row>
          <v-col cols="12">
            <UiParentCard title="Pilih Program Studi">
              <v-row>
                <v-col cols="12" lg="4" md="6">
                  <v-select v-model="study_program_id" variant="outlined" hide-details :items="adminStudyPrograms" item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                </v-col>
                <v-col cols="12" lg="4" md="6">
                  <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined" @input="getData(pagination.limit, 1, $event.target.value)"></v-text-field>
                </v-col>
              </v-row>
            </UiParentCard>
          </v-col>
        </v-row>
      <!-- <SharedUiParentCard :title="'Daftar '+title">
          <v-row>
            <v-col cols="12">
              <v-col cols="12" lg="4" md="6">
                <v-select v-model="study_program_id" variant="outlined" hide-details :items="adminStudyPrograms" item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
              </v-col>
            </v-col>
            <v-col cols="12" lg="12" md="12" class="text-right">
              <v-btn color="primary" flat class="ml-auto" @click="create">
                <v-icon class="mr-2">
                mdi-plus
                </v-icon>Tambah
              </v-btn>
            </v-col>
          </v-row>
      </SharedUiParentCard> -->
      <v-table class="mt-10">
        <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-semibold">No</th>
            <th class="text-subtitle-1 font-weight-semibold">NIDN</th>
            <th class="text-subtitle-1 font-weight-semibold">Nama</th>
            <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in examSupervisorList">
            <td>{{ index + 1 }}</td>
            <td>{{ item.id_national_lecturer }}</td>
            <td>{{ item.name }}</td>
            <td>
              <v-btn icon flat @click="show(item)">
                <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
              </v-btn>  
              <v-btn icon flat @click="edit(item)">
                <PencilIcon stroke-width="1.5" size="20" class="text-warning" />
              </v-btn>
              <v-btn icon flat @click="deleteItem(item)">
                <TrashIcon stroke-width="1.5" size="20" class="text-error" />
              </v-btn>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">
              <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                :prev="pagination.prev" :next="pagination.next"
                @prevPage="getData(pagination.limit, pagination.prev, '')"
                @jumpPage="(page: any) => getData(pagination.limit, page, '')"
                @nextPage="getData(pagination.limit, pagination.next, '')" />
            </td>
          </tr>
        </tfoot>
      </v-table>
    </div>
</template>