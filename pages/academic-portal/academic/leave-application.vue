<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { getStudentStudentLeaveList } from '~~/composables/api/student-student-leave/getStudentStudentLeaveList';
import { GetStudentStudentLeaveListData } from '~~/types/api/student-student-leave/GetStudentStudentLeaveList';
import { deleteStudentStudentLeave } from '~~/composables/api/student-student-leave/deleteStudentStudentLeave';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Pengajuan Cuti')
const mode = ref('list')
const dialog = ref(false)

const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogDelete = ref(false)
const dialogShow = ref(false)
const search = ref('')


const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: title.value,
    disabled: true,
    href: '#'
  }
]);
function show() {
  mode.value = 'show'
}
function showDetail() {
  mode.value = 'detail'
  dialog.value = true
}
onMounted(async () => {
  await getStudentStudentLeaveData()
})
const studentStudentLeaves = ref<GetStudentStudentLeaveListData[]>([])
// const selectedStudentStudentLeave = ref(<GetStudentStudentLeaveListData>{});
async function getStudentStudentLeaveData() {
  try {
    const { response: resp, error: error } = await getStudentStudentLeaveList(10000, 1, search.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentStudentLeaves.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

const detailData = ref(<GetStudentStudentLeaveListData>{
})
function showItem(data: GetStudentStudentLeaveListData) {
  mode.value = 'show'
  detailData.value = data
  dialogShow.value = true
}

const updateStudentStudentLeaveId = ref('')
const updateData = ref(<GetStudentStudentLeaveListData>{
})

function editItem(data: GetStudentStudentLeaveListData) {
  mode.value = 'update'
  updateData.value = data
  dialogUpdate.value = true
}

function closeUpdate() {
  dialogUpdate.value = false
  setTimeout(() => {
    updateStudentStudentLeaveId.value = ""
  }, 300)
}


const deletedData = ref(<GetStudentStudentLeaveListData>{})

function deleteItem(data: GetStudentStudentLeaveListData) {
  mode.value = 'delete'
  deletedData.value = data
  console.log(data)
  dialogDelete.value = true
}


function closeDelete() {
  dialogDelete.value = false
}

async function deleteItm() {
  try {
    const { response: deleteResponse, error } = await deleteStudentStudentLeave(deletedData.value)
    if (error) {
      let dataError = <ErrorRoot>error.data;
      alert(dataError.meta.message);
      return;
    }
    // return true;
  } catch (error) {
    alert(error)
    // return false;
  }
  closeDelete()
  getStudentStudentLeaveData()
}

function create() {
  mode.value = 'create'
  dialogCreate.value = true
}
function closeCreate() {
  dialogCreate.value = false
}
</script>

<template>
  <div>
    <div v-if="mode == 'create'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogCreate" max-width="800">
          <PagesAcademicPortalStudentStudentLeaveCreate @reload="getStudentStudentLeaveData()" @close="closeCreate()" />
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'update'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogUpdate" max-width="800">
          <PagesAcademicPortalStudentStudentLeaveUpdate @reload="getStudentStudentLeaveData()" @close="closeUpdate()"
            :getStudentStudentLeaveListData="updateData" />
        </v-dialog>
      </v-col>
    </div>
    <v-col cols="12">
      <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
    </v-col>
    <v-row>
      <v-col cols="12">
        <UiParentCard title="Daftar Pengajuan Cuti">
          <v-row>
            <v-col cols="12" lg="4" md="6">
              <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined"
                @input="getStudentStudentLeaveData()"></v-text-field>
            </v-col>
            <v-col cols="12" lg="8" md="6" class="text-right">
              <v-btn color="primary" flat class="ml-auto" @click="create()">
                <v-icon class="mr-2">
                  mdi-account-multiple-plus
                </v-icon>Tambah Pengajuan
              </v-btn>
            </v-col>
          </v-row>
        </UiParentCard>
      </v-col>
    </v-row>
    <v-col cols="12">
      <v-alert type="info" variant="tonal">
        Keterangan :
        <br />
        Pada Menu ini anda bisa melakukan pengajuan untuk Cuti pada semester yang bersangkutan dan juga bisa melihat
        histori data pengajuan cuti anda.
      </v-alert>
    </v-col>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Semester Pengajuan</th>
          <th class="text-subtitle-1 font-weight-semibold">Sebab Cuti</th>
          <th class="text-subtitle-1 font-weight-semibold">Catatan</th>
          <th class="text-subtitle-1 font-weight-semibold">Status</th>
          <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sl, i in studentStudentLeaves">
          <td>{{ i + 1 }}</td>
          <td>{{ sl.semester_type }} {{ sl.semester_school_year }}</td>
          <td>{{ sl.purpose }}</td>
          <td>{{ sl.remarks }}</td>
          <td>{{ sl.is_approved ? 'Disetujui' : 'Belum Disetujui' }}</td>
          <td>
            <div class="d-flex align-center">
              <v-tooltip text="Ubah">
                <template #activator="{ props }">
                  <v-btn icon flat v-bind="props" @click="editItem(sl)">
                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
