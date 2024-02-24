<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

import { GetFileSharingData } from '~~/types/api/file-sharing/GetFileSharing';
import { getFileSharing } from '~~/composables/api/file-sharing/getFileSharing';
import { deleteFileSharing } from '~~/composables/api/file-sharing/deleteFileSharing';

import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week'
import { formatYearMonthDate } from '~~/utils/helpers/date-utils'
import { ErrorRoot } from '~~/types/api/error';
import { LoginData } from '~~/types/api/auth/Login';
import { GetStudentFileSharingListData } from '~~/types/api/student-file-sharing/GetStudentFileSharingList';
import { getStudentFileSharingList } from '~~/composables/api/student-file-sharing/getStudentFileSharingList';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const limit = 20
var page = 1
const title = ref('File Sharing')
const mode = ref('list')
const dialog = ref(false)
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Daftar ' + title.value,
    disabled: true,
    href: '#'
  }
]);

const fileSharings = ref<GetFileSharingData[]>([])
const fileSharingObj = ref(<GetFileSharingData>{})
const isOwned = ref(true)

async function getFiles(limit: number, page: number, search: string) {
  try {
    const { response: resp, error: error } = await getFileSharing(limit, page, search, isOwned.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      fileSharings.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

async function edit(item: any) {
  fileSharingObj.value = item
  mode.value = 'edit'
  dialog.value = true
}
async function deleteItm(item: any) {
  if (!confirm('Yakin Menghapus Item Ini ' + item.title + ' ?')) {
    return false
  }
  try {
    const { response: createFileResponse, error } = await deleteFileSharing(item.id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    } else {
      await getFiles(limit, page, '')
    }
  } catch (error) {
    alert(error)
  }
}
function upload() {
  mode.value = 'upload'
  dialog.value = true
}
function close() {
  dialog.value = false
}

let userData = ref(<LoginData>{});
onMounted(async () => {
  const user = useAuth()
  if (user.value) {
    userData.value = <LoginData>user.value;
    if (userData.value.app_type == "lecturer") {

      await lecturerMounted()
    } else if (userData.value.app_type == "student") {
      await studentMounted()
    }

  } else {
    return navigateTo({ name: 'login', path: '' })
  }
})

async function lecturerMounted() {
  await getFiles(limit, page, '')
}

async function studentMounted() {
  await getStudentFileSharingData(limit, page,)
}

const studentFileSharings = ref<GetStudentFileSharingListData[]>([])
const selectedStudentFileSharing = ref(<GetStudentFileSharingListData>{});
async function getStudentFileSharingData(limit: number, page: number) {
  try {
    const { response: resp, error: error } = await getStudentFileSharingList(limit, page, '')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentFileSharings.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function studentFileSharingOnChange(id: any) {
  selectedStudentFileSharing.value = studentFileSharings.value.filter((x) => { return x.id == id })[0]
}
</script>
<template>
  <div v-if="mode == 'upload'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalVirtualClassFileSharingUpload @close="close" @reload="getFiles(limit, page, '')" />
      </v-dialog>
    </v-col>
  </div>
  <div v-if="mode == 'edit'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalVirtualClassFileSharingEdit @close="close" @reload="getFiles(limit, page, '')"
          :data="fileSharingObj" />
      </v-dialog>
    </v-col>
  </div>
  <v-col cols="12">
    <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
  </v-col>
  <v-col cols="12">
    <v-alert type="info" variant="tonal">
      Keterangan :
      <br />
      File sharing merupakan fitur membagikan file atau materi kepada seluruh pengguna portal akademik.
    </v-alert>
  </v-col>
  <v-row v-if="userData.app_type == 'lecturer'">
    <v-col cols="12">
      <UiParentCard :title="'Pilih ' + title">
        <v-row>
          <v-col cols="12" lg="12" md="12" class="text-right">
            <VBtn title="Upload" color="primary" @click="upload()">
              Upload File
            </VBtn>
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Judul</th>
        <th class="text-subtitle-1 font-weight-semibold">Pengirim</th>
        <th class="text-subtitle-1 font-weight-semibold">Waktu Kirim</th>
        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in fileSharings" v-if="userData.app_type == 'lecturer'">
        <td>{{ index + 1 }}</td>
        <td>{{ item.title }}</td>
        <td>{{ item.lecturer_name }}</td>
        <td v-if="item.created_at != ''">
          {{ new Date(item.created_at).getDay() == 0 ? convertDayOfWeek(new Date(item.created_at).getDay() + 7) + ', ' :
            convertDayOfWeek(new Date(item.created_at).getDay()) + ', ' }} {{ formatYearMonthDate(item.created_at) }}
        </td>
        <td v-else>-</td>
        <td >
          <v-tooltip text="Ubah">
            <template #activator="{ props }">
              <v-btn title="Ubah" icon flat @click="edit(item)">
                <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="Lihat">
            <template #activator="{ props }">
              <a :href="item.file_url" target="_blank" download>
                <v-btn title="Lihat" icon flat>
                  <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                </v-btn>
              </a>
            </template>
          </v-tooltip>
          <v-tooltip text="Hapus">
            <template #activator="{ props }">
              <v-btn title="Hapus" icon flat @click="deleteItm(item)">
                <TrashIcon stroke-width="1.5" size="20" class="text-error" />
              </v-btn>
            </template>
          </v-tooltip>
        </td>
      </tr>
      <tr v-for="(item, index) in studentFileSharings" v-if="userData.app_type == 'student'">
        <td>{{ index + 1 }}</td>
        <td>{{ item.title }}</td>
        <td>{{ item.lecturer_name }}</td>
        <td v-if="item.created_at != ''">
          {{ new Date(item.created_at).getDay() == 0 ? convertDayOfWeek(new Date(item.created_at).getDay() + 7) + ', ' :
            convertDayOfWeek(new Date(item.created_at).getDay()) + ', ' }} {{ formatYearMonthDate(item.created_at) }}
        </td>
        <td v-else>-</td>
        <td>
          <v-tooltip text="Lihat">
            <template #activator="{ props }">
              <a :href="item.file_url" target="_blank" download>
                <v-btn title="Lihat" icon flat>
                  <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                </v-btn>
              </a>
            </template>
          </v-tooltip>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
