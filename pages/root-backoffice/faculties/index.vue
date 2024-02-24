<script setup lang="ts">
import { Form } from "vee-validate";
import * as Yup from "yup";
import { ErrorEmailRequire } from '~~/utils/helpers/required-input'
import { useBackofficeFacultiesStore } from '@/stores/apps/backoffice/faculties'
import { CreateFacultyRequest } from '~~/types/api/faculty/CreateFaculty'
import { DeleteFacultyRequest, DeleteFacultyRoot } from '~~/types/api/faculty/DeleteFaculty'
import { GetFacultyDetailRoot } from '~~/types/api/faculty/GetFacultyDetail'
import { GetFacultyListData, GetFacultyListRoot } from '~~/types/api/faculty/GetFacultyList'
import { UpdateFacultyRequest } from '~~/types/api/faculty/UpdateFaculty'
import { PaginationModel } from '~~/types/api/pagination'
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from "~~/types/api/error";

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});


const valid = ref(true)
const mode = ref('list')
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogDelete = ref(false)
const dialogShow = ref(false)

const title = ref('Daftar Fakultas')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Daftar Fakultas',
    disabled: true,
    href: '#'
  }
])

const limit = 20
const search = ref('')
const faculties = ref<GetFacultyListData[] | undefined>([])
const pagination = ref<PaginationModel>({
  page: 1,
  limit,
  prev: 1,
  next: 1,
  total_pages: 1,
  total_records: 0
})

onMounted(() => {
  getData(limit, 1, '')
})

const createFacultyRequest = ref<CreateFacultyRequest>({
  name: '',
  short_name: '',
  english_name: '',
  english_short_name: '',
  address: '',
  phone_number: '',
  fax: '',
  email: '',
  contact_person: '',
  experiment_building_area: 0,
  lecture_hall_area: 0,
  lecture_hall_count: 0,
  laboratorium_area: 0,
  laboratorium_count: 0,
  permanent_lecturer_room_area: 0,
  administration_room_area: 0,
  book_count: 0,
  book_copy_count: 0
})
function create() {
  createFacultyRequest.value = Object.assign({}, createFacultyRequest.value)
  mode.value = 'create'
  createFacultyRequest.value = Object.assign({}, createFacultyRequest.value)
  dialogCreate.value = true
}

function closeCreate() {
  dialogCreate.value = false
  setTimeout(() => {
    createFacultyRequest.value = Object.assign({}, createFacultyRequest.value)
  }, 300)
}

const updateFacultyRequest = ref<UpdateFacultyRequest>({
  id: '',
  name: '',
  short_name: '',
  english_name: '',
  english_short_name: '',
  address: '',
  phone_number: '',
  fax: '',
  email: '',
  contact_person: '',
  experiment_building_area: 0,
  lecture_hall_area: 0,
  lecture_hall_count: 0,
  laboratorium_area: 0,
  laboratorium_count: 0,
  permanent_lecturer_room_area: 0,
  administration_room_area: 0,
  book_count: 0,
  book_copy_count: 0
})

function editItem(id: String) {
  mode.value = 'update'
  getDetail(id)
  dialogUpdate.value = true
}

function closeUpdate() {
  dialogUpdate.value = false
  setTimeout(() => {
    updateFacultyRequest.value = Object.assign({}, updateFacultyRequest.value)
  }, 300)
}
const showId = ref('')
function showItem(id: string) {
  mode.value = 'show'
  //   updateFacultyRequest.value=<UpdateFacultyRequest>{};
  showId.value = id
  dialogShow.value = true
}

function closeShow() {
  dialogShow.value = false
}

const deleteFacultyRequest = ref<DeleteFacultyRequest>({
  id: ''
})
function deleteItem(id: String) {
  mode.value = 'delete'
  getDetail(id)
  dialogDelete.value = true
}

function closeDelete() {
  dialogDelete.value = false
  setTimeout(() => {
    deleteFacultyRequest.value = Object.assign({}, deleteFacultyRequest.value)
  }, 300)
}
async function getData(limit: number, page: number, searchText: String) {
  try {
    const { data: getFacultyList, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_faculty.RootFacultyHandler/GetList?limit=${limit}&page=${page}&search=${searchText}`, <any>{
      method: 'GET',
    })
    if (error.value) {
      let errorRoot = <ErrorRoot><unknown>error.value.data;
      if (!errorRoot.meta) {
        alert(errorRoot)
        return;
      }
      alert(errorRoot.meta.message)
      if (errorRoot.meta.status == 401) {
        const authUser = useAuthStorage();
        authUser.value = null;
        navigateTo({ name: 'login', path: '' })
        return;
      }
      return;
    }
    pagination.value = getFacultyList.value?.pagination
    faculties.value = getFacultyList.value?.data
  } catch (error) {
    alert(error)
  }

}
async function getDetail(id: String) {
  try {
    const { data: getFacultyDetail, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_faculty.RootFacultyHandler/GetDetail?id=${id}`, <any>{
      method: 'GET',
    })
    if (error.value) {
      let errorRoot = <ErrorRoot><unknown>error.value.data;
      if (!errorRoot.meta) {
        alert(errorRoot)
        return;
      }
      alert(errorRoot.meta.message)
      if (errorRoot.meta.status == 401) {
        const authUser = useAuthStorage();
        authUser.value = null;
        navigateTo({ name: 'login', path: '' })
        return;
      }
      return;
    }
    updateFacultyRequest.value = getFacultyDetail.value?.data

  } catch (error) {
    alert(error)

  }

}
async function save() {
  if (ErrCheckEmail.value) {
    return false
  }
  // console.log(JSON.stringify(createFacultyRequest.value))
  try {
    const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_faculty.RootFacultyHandler/Create`, <any>{
      method: 'POST',
      body: createFacultyRequest.value,
    })
    if (error.value) {
      let errorRoot = <ErrorRoot><unknown>error.value.data;
      if (!errorRoot.meta) {
        alert(errorRoot)
        return;
      }
      alert(errorRoot.meta.message)
      if (errorRoot.meta.status == 401) {
        const authUser = useAuthStorage();
        authUser.value = null;
        navigateTo({ name: 'login', path: '' })
        return;
      }
      return;
    }
  } catch (error) {
    alert(error)
  }

  closeCreate()
  getData(limit, 1, '')
}

async function update() {
  if (ErrCheckEmail.value) {
    return false
  }
  try {
    const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_faculty.RootFacultyHandler/Update`, <any>{
      method: 'PATCH',
      body: updateFacultyRequest.value,
    })
    if (error.value) {
      let errorRoot = <ErrorRoot><unknown>error.value.data;
      if (!errorRoot.meta) {
        alert(errorRoot)
        return;
      }
      alert(errorRoot.meta.message)
      if (errorRoot.meta.status == 401) {
        const authUser = useAuthStorage();
        authUser.value = null;
        navigateTo({ name: 'login', path: '' })
        return;
      }
      return;
    }
  } catch (error) {
    alert(error)

  }

  closeUpdate()
  getData(limit, 1, '')
}
async function deleteItm() {
  try {
    const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_faculty.RootFacultyHandler/Delete`, <any>{
      method: 'Delete',
      body:
        updateFacultyRequest.value ?? {}
    })
    if (error.value) {
      let errorRoot = <ErrorRoot><unknown>error.value.data;
      if (!errorRoot.meta) {
        alert(errorRoot)
        return;
      }
      if(errorRoot.meta.message.search('curriculums_study_program_id_fkey') > -1){
        alert('Data Tidak Bisa Di Hapus, Terikat Pada Data Lain')
      }else{
        alert(errorRoot.meta.message)
      }
      if (errorRoot.meta.status == 401) {
        const authUser = useAuthStorage();
        authUser.value = null;
        navigateTo({ name: 'login', path: '' })
        return;
      }
      return;
    }
  } catch (error) {
    alert(error)

  }

  closeDelete()
  getData(limit, 1, '')
}
watch(search, async function (value) {
    if (value != '') {
        await getData(limit, 1, value)
    }
})
const ErrCheckEmail = ref(false)
function checkEmail(email: string) {
  ErrCheckEmail.value = ErrorEmailRequire(email)
}
</script>

<template>
  <div>
    <div v-if="mode == 'create'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogCreate" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Tambah Fakultas</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="createFacultyRequest.name" variant="outlined" hide-details
                      label="*Nama Fakultas" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="createFacultyRequest.short_name" variant="outlined" hide-details
                      label="*Nama Singkat" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="createFacultyRequest.english_name" variant="outlined" hide-details
                      label="Nama Asing" />
                  </v-col>

                  <v-col cols="12" sm="12">
                    <v-text-field v-model="createFacultyRequest.english_short_name" variant="outlined" hide-details
                      label="Nama Asing Singkat" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="createFacultyRequest.address" variant="outlined" hide-details
                      label="*Alamat" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model="createFacultyRequest.phone_number" variant="outlined"
                      hide-details label="*Telepon" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model="createFacultyRequest.fax" variant="outlined" hide-details
                      label="Fax" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field @keyup="checkEmail($event.target.value)" v-model="createFacultyRequest.email"
                      variant="outlined" hide-details label="*Email" />
                    <label v-if="ErrCheckEmail"><small style="color: red">email must be a valid email</small></label>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="createFacultyRequest.contact_person" variant="outlined" hide-details
                      label="*Kontak Person" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model.number="createFacultyRequest.experiment_building_area"
                      variant="outlined" hide-details label="Luas Gedung Percobaan (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model.number="createFacultyRequest.lecture_hall_area" variant="outlined"
                      hide-details label="Luas Ruang Kuliah (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model.number="createFacultyRequest.lecture_hall_count"
                      variant="outlined" hide-details label="Jumlah Ruang Kuliah (ruang)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model.number="createFacultyRequest.laboratorium_area" variant="outlined"
                      hide-details label="Luas Laboratorium (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model.number="createFacultyRequest.laboratorium_count"
                      variant="outlined" hide-details label="Jumlah Laboratorium (ruang)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model.number="createFacultyRequest.permanent_lecturer_room_area"
                      variant="outlined" hide-details label="Luas Ruang Dosen Tetap (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model.number="createFacultyRequest.administration_room_area"
                      variant="outlined" hide-details label="Luas Ruang Administrasi (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model.number="createFacultyRequest.book_count" variant="outlined"
                      hide-details label="Jumlah Judul Buku (buah)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model.number="createFacultyRequest.book_copy_count" variant="outlined"
                      hide-details label="Jumlah Expemplar Buku (eksemplar)" />
                  </v-col>
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="error" @click="closeCreate">
                      Batal
                    </v-btn>
                    <v-btn color="secondary" :disabled="
                      ErrCheckEmail ||
                      createFacultyRequest.name == '' ||
                      createFacultyRequest.short_name == '' ||
                      createFacultyRequest.address == '' ||
                      createFacultyRequest.phone_number == '' ||
                      createFacultyRequest.email == '' ||
                      createFacultyRequest.contact_person == ''
                    " @click="save()">
                      Simpan
                    </v-btn>
                  </v-card-actions>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'update'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogUpdate" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Ubah Fakultas</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-text-field v-model="updateFacultyRequest.name" variant="outlined" hide-details
                        label="*Nama Fakultas" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field v-model="updateFacultyRequest.short_name" variant="outlined" hide-details
                        label="*Nama Singkat" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field v-model="updateFacultyRequest.english_name" variant="outlined" hide-details
                        label="Nama Asing" />
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-text-field v-model="updateFacultyRequest.english_short_name" variant="outlined" hide-details
                        label="Nama Asing Singkat" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field v-model="updateFacultyRequest.address" variant="outlined" hide-details
                        label="*Alamat" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field type="number" v-model="updateFacultyRequest.phone_number" variant="outlined"
                        hide-details label="*Telepon" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field type="number" v-model="updateFacultyRequest.fax" variant="outlined" hide-details
                        label="Fax" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field @keyup="checkEmail($event.target.value)" v-model="updateFacultyRequest.email"
                        variant="outlined" hide-details label="*Email" />
                      <label v-if="ErrCheckEmail"><small style="color: red">email must be a valid email</small></label>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field v-model="updateFacultyRequest.contact_person" variant="outlined" hide-details
                        label="*Kontak Person" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field type="number" v-model.number="updateFacultyRequest.experiment_building_area"
                        variant="outlined" hide-details label="Luas Gedung Percobana(m2)" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field type="number" v-model.number="updateFacultyRequest.lecture_hall_area"
                        variant="outlined" hide-details label="Luas Ruang Kuliah(m2)" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field type="number" v-model.number="updateFacultyRequest.lecture_hall_count"
                        variant="outlined" hide-details label="Jumlah Ruang Kuliah" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field type="number" v-model.number="updateFacultyRequest.laboratorium_area"
                        variant="outlined" hide-details label="Luas Laboratorium(m2)" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field type="number" v-model.number="updateFacultyRequest.laboratorium_count"
                        variant="outlined" hide-details label="Jumlah Laboratorium" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field type="number" v-model.number="updateFacultyRequest.permanent_lecturer_room_area"
                        variant="outlined" hide-details label="Luas Ruang Dosen Tetap(m2)" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field type="number" v-model.number="updateFacultyRequest.administration_room_area"
                        variant="outlined" hide-details label="Luas Ruang Administrasi(m2)" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field type="number" v-model.number="updateFacultyRequest.book_count" variant="outlined"
                        hide-details label="Jumlah Judul Buku" />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field type="number" v-model.number="updateFacultyRequest.book_copy_count" variant="outlined"
                        hide-details label="Jumlah Expemplar Buku" />
                    </v-col>
                    <v-card-actions class="pa-4">
                      <v-spacer />
                      <v-btn color="error" @click="closeUpdate">
                        Batal
                      </v-btn>
                      <v-btn color="secondary" :disabled="
                        ErrCheckEmail ||
                        updateFacultyRequest.name == '' ||
                        updateFacultyRequest.short_name == '' ||
                        updateFacultyRequest.address == '' ||
                        updateFacultyRequest.phone_number == '' ||
                        updateFacultyRequest.email == '' ||
                        updateFacultyRequest.contact_person == ''
                      " @click="update()">
                        Ubah
                      </v-btn>
                    </v-card-actions>
                  </v-row>
                </v-form>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'delete'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogDelete" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Hapus Fakultas</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <h5>Nama Fakultas</h5>
                </v-row>
                <v-row>
                  <div>{{ updateFacultyRequest.name }}</div>
                </v-row>
                <v-row v-if="updateFacultyRequest.english_name" class="pt-2">
                  <h5>Nama Asing</h5>
                </v-row>
                <v-row v-if="updateFacultyRequest.english_name">
                  <div>{{ updateFacultyRequest.english_name }}</div>
                </v-row>
                <v-col class="text-right">
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="error" @click="closeDelete">
                      Batal
                    </v-btn>
                    <v-btn color="secondary" :disabled="updateFacultyRequest.name == ''" @click="deleteItm()">
                      Hapus
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'show'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogShow" max-width="800">
          <PagesFacultiesDetail :id="showId" />
        </v-dialog>
      </v-col>
    </div>
    <SharedBackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs" />
    <SharedUiParentCard title="Fakultas">
      <v-row>
        <v-col cols="12" lg="4" md="6">
          <v-text-field v-model="search" density="compact" label="Pencarian Fakultas" hide-details variant="outlined"/>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
          <v-btn color="primary" flat class="ml-auto" @click="create()">
            <v-icon class="mr-2">
              mdi-account-multiple-plus
            </v-icon>Tambah Fakultas
          </v-btn>
        </v-col>
      </v-row>
    </SharedUiParentCard>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">
            No
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Fakultas
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item, index in faculties" :key="item.id">
          <td class="text-subtitle-1">
            {{ (pagination.limit * (pagination.page - 1)) + index + 1 }}
          </td>
          <td class="text-subtitle-1">
            {{ item.name }}
          </td>
          <td>
            <div class="d-flex align-center">
              <v-tooltip text="Detail">
                <template #activator="{ props }">
                  <v-btn icon flat v-bind="props" @click="showItem(item.id)">
                    <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Ubah">
                <template #activator="{ props }">
                  <v-btn icon flat v-bind="props" @click="editItem(item.id)">
                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Hapus">
                <template #activator="{ props }">
                  <v-btn icon flat v-bind="props" @click="deleteItem(item.id)">
                    <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">
            <TablePaginationView func_get_data="roles" :limit="limit" :page="pagination.page"
              :total_pages="pagination.total_pages" :total_records="pagination.total_records" :prev="pagination.prev"
              :next="pagination.next" @prevPage="getData(limit, pagination.prev, search)"
              @jumpPage="(page: any) => getData(limit, page, search)" @nextPage="getData(limit, pagination.next, search)" />
          </td>
        </tr>
      </tfoot>
    </v-table>
  </div>
</template>
