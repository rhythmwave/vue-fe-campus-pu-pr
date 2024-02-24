<script setup lang="ts">
import { Major, Faculty } from '@/types/backoffice/backofficeTypes'
import { ErrorEmailRequire } from '~~/utils/helpers/required-input'
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});


const majors = ref<Major[]>()
const major = ref({
  id: '',
  faculty_id: '',
  name: '',
  short_name: '',
  english_name: '',
  english_short_name: '',
  address: '',
  phone_number: '',
  fax: '',
  email: '',
  contact_person: '',
  experiment_building_area: '',
  lecture_hall_area: '',
  lecture_hall_count: '',
  laboratorium_area: '',
  laboratorium_count: '',
  permanent_lecturer_room_area: '',
  administration_room_area: '',
  book_count: '',
  book_copy_count: ''
})
const faculties = ref<Faculty[]>()
const limit = 20
const pagination = ref({
  page: 1,
  limit,
  prev: 1,
  next: 1,
  total_pages: 1,
  total_records: 0
})
const search: String = ''
const title = ref('Daftar Jurusan')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Daftar Jurusan',
    disabled: true,
    href: '#'
  }
])
const valid = ref(true)
const dialog = ref(false)
const mode = ref('list')

function close() {
  faculties.value = []
  dialog.value = false
  setTimeout(() => {
    major.value = {
      id: '',
      faculty_id: '',
      name: '',
      short_name: '',
      english_name: '',
      english_short_name: '',
      address: '',
      phone_number: '',
      fax: '',
      email: '',
      contact_person: '',
      experiment_building_area: '',
      lecture_hall_area: '',
      lecture_hall_count: '',
      laboratorium_area: '',
      laboratorium_count: '',
      permanent_lecturer_room_area: '',
      administration_room_area: '',
      book_count: '',
      book_copy_count: ''
    }
  }, 300)
}

const showId = ref('')
const dialogShow = ref(false)
function showItem(id: string) {
  mode.value = 'show'
  //   updateFacultyRequest.value=<UpdateFacultyRequest>{};
  showId.value = id
  dialogShow.value = true
}

function closeShow() {
  dialogShow.value = false
}

onMounted(() => {
  getData(limit, 1, search)
})
async function getData(limit: number, page: number, search: String) {
  try {
    try {
      const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_major.RootMajorHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
        method: 'GET',
      })
      if (error.value) {
        let errorRoot = <ErrorRoot><unknown>error.value.data;
        if (!errorRoot.meta) {
          alert(errorRoot);
        } else {
          alert(errorRoot.meta.message);
        }
        if (errorRoot.meta.status == 401) {
          const authUser = useAuthStorage();
          authUser.value = null;
          navigateTo({ name: 'login', path: '' })
          alert(errorRoot.meta.message);
        }
      }
      pagination.value =
      {
        next: _resp.value.pagination.next,
        prev: _resp.value.pagination.prev,
        total_pages: _resp.value.pagination.total_pages,
        total_records: _resp.value.pagination.total_records,
        limit: _resp.value.pagination.limit,
        page: _resp.value.pagination.page
      }

      majors.value = _resp.value.data
    } catch (error) {
      alert(error)
    }
  } catch (error) {
    alert(error)
    console.log(error)
  }
}

async function getDataFaculty(limit: number, page: number, search: String) {
  try {
    try {
      const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_faculty.RootFacultyHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
        method: 'GET',
      })
      if (error.value) {
        let errorRoot = <ErrorRoot><unknown>error.value.data;
        if (!errorRoot.meta) {
          alert(errorRoot);
          return;
        } else {
          alert(errorRoot.meta.message);
        }
        if (errorRoot.meta.status == 401) {
          const authUser = useAuthStorage();
          authUser.value = null;
          navigateTo({ name: 'login', path: '' })
          alert(errorRoot.meta.message);
          return;
        }
        return;
      }
      faculties.value = _resp.value.data
    } catch (error) {
      alert(error);
    }
  } catch (error) {
    alert(error)
    console.log(error)
  }
}

async function getDetail(id: string) {
  try {
    try {
      const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_major.RootMajorHandler/GetDetail?id=${id}`, <any>{
        method: 'GET',
      })
      if (error.value) {
        let errorRoot = <ErrorRoot><unknown>error.value.data;
        if (!errorRoot.meta) {
          alert(errorRoot);
          return;
        } else {
          alert(errorRoot.meta.message);
        }
        if (errorRoot.meta.status == 401) {
          const authUser = useAuthStorage();
          authUser.value = null;
          navigateTo({ name: 'login', path: '' })
          alert(errorRoot.meta.message);
          return;
        }
        return;
      }
      major.value = _resp.value.data
    } catch (error) {
      alert(error)
    }
  } catch (error) {
    alert(error)
    console.log(error)
  }
}

async function create() {
  faculties.value = []
  mode.value = 'create'
  dialog.value = true
  await getDataFaculty(20, 1, search)
}

async function editItem(item: any) {
  faculties.value = []
  await getDetail(item.id)
  mode.value = 'edit'
  dialog.value = true
  await getDataFaculty(20, 1, '')
}

function deleteItem(item: any) {
  mode.value = 'delete'
  dialog.value = true
  major.value = item
}

async function save() {
  if (ErrCheckEmail.value) {
    return false
  }
  try {
    try {
      const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_major.RootMajorHandler/Create`, <any>{
        method: 'POST',
        body: {
          faculty_id: major.value.faculty_id,
          name: major.value.name,
          short_name: major.value.short_name,
          english_name: major.value.english_name,
          english_short_name: major.value.english_short_name,
          address: major.value.address,
          phone_number: major.value.phone_number,
          fax: major.value.fax,
          email: major.value.email,
          contact_person: major.value.contact_person,
          experiment_building_area: parseFloat(major.value.experiment_building_area),
          lecture_hall_area: parseFloat(major.value.lecture_hall_area),
          lecture_hall_count: parseInt(major.value.lecture_hall_count),
          laboratorium_area: parseFloat(major.value.laboratorium_area),
          laboratorium_count: parseInt(major.value.laboratorium_count),
          permanent_lecturer_room_area: parseFloat(major.value.permanent_lecturer_room_area),
          administration_room_area: parseFloat(major.value.administration_room_area),
          book_count: parseInt(major.value.book_count),
          book_copy_count: parseInt(major.value.book_copy_count)
        },
      })
      if (error.value) {
        let errorRoot = <ErrorRoot><unknown>error.value.data;
        if (!errorRoot.meta) {
          alert(errorRoot);
          return;
        } else {
          alert(errorRoot.meta.message);
        }
        if (errorRoot.meta.status == 401) {
          const authUser = useAuthStorage();
          authUser.value = null;
          navigateTo({ name: 'login', path: '' })
          alert(errorRoot.meta.message);
          return;
        }
        return;
      }
      // return { response: data.value, error: null };
    } catch (error) {
      alert(error)
    }
    // return true;
  } catch (error) {
    alert(error)
    console.log(error)
    // return false;
  }
  close()
  getData(limit, 1, search)
}
async function update() {
  if (ErrCheckEmail.value) {
    return false
  }
  try {
    try {
      const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_major.RootMajorHandler/Update`, <any>{
        method: 'PATCH',
        body: {
          id: major.value.id,
          faculty_id: major.value.faculty_id,
          name: major.value.name,
          short_name: major.value.short_name,
          english_name: major.value.english_name,
          english_short_name: major.value.english_short_name,
          address: major.value.address,
          phone_number: major.value.phone_number,
          fax: major.value.fax,
          email: major.value.email,
          contact_person: major.value.contact_person,
          experiment_building_area: parseFloat(major.value.experiment_building_area),
          lecture_hall_area: parseFloat(major.value.lecture_hall_area),
          lecture_hall_count: parseInt(major.value.lecture_hall_count),
          laboratorium_area: parseFloat(major.value.laboratorium_area),
          laboratorium_count: parseInt(major.value.laboratorium_count),
          permanent_lecturer_room_area: parseFloat(major.value.permanent_lecturer_room_area),
          administration_room_area: parseFloat(major.value.administration_room_area),
          book_count: parseInt(major.value.book_count),
          book_copy_count: parseInt(major.value.book_copy_count)
        },
      })
      if (error.value) {
        let errorRoot = <ErrorRoot><unknown>error.value.data;
        if (!errorRoot.meta) {
          alert(errorRoot);
          return;
        } else {
          alert(errorRoot.meta.message);
        }
        if (errorRoot.meta.status == 401) {
          const authUser = useAuthStorage();
          authUser.value = null;
          navigateTo({ name: 'login', path: '' })
          alert(errorRoot.meta.message);
          return;
        }
        return;
      }
      // return { response: data.value, error: null };
    } catch (error) {
      alert(error)
    }
  } catch (error) {
    alert(error)
    console.log(error)
    // return false;
  }
  close()
  getData(limit, 1, search)
}

async function deleteData() {
  try {
    try {
      const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_major.RootMajorHandler/Delete`, <any>{
        method: 'Delete',
        body: {
          id: major.value.id
        },
      })
      if (error.value) {
        let errorRoot = <ErrorRoot><unknown>error.value.data;
        if (!errorRoot.meta) {
          alert(errorRoot);
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
          alert(errorRoot.meta.message);
          return;
        }
        return;
      }
    } catch (error) {
      alert(error)
    }
  } catch (error) {
    alert(error)
    console.log(error)
    // return false;
  }
  close()
  getData(limit, 1, search)
}

const ErrCheckEmail = ref(false)
function checkEmail(email: string) {
  ErrCheckEmail.value = ErrorEmailRequire(email)
}
</script>

<template>
  <div>
    <div v-if="mode == 'delete'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialog" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">hapus jurusan {{ major.name }}</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="error" @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="secondary" :disabled="major.id == ''" @click="deleteData">
                      Hapus
                    </v-btn>
                  </v-card-actions>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'create'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialog" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Tambah Jurusan</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.name" variant="outlined" hide-details label="*Nama Jurusan" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-select v-model="major.faculty_id" label="*Fakultas" placeholder="*Fakultas" item-title="name"
                      item-value="id" :items="faculties" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.short_name" variant="outlined" hide-details label="*Nama Singkat" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.english_name" variant="outlined" hide-details label="Nama Asing" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.english_short_name" variant="outlined" hide-details
                      label="Nama Asing Singkat" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.address" variant="outlined" hide-details label="*Alamat" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model="major.phone_number" variant="outlined" hide-details
                      label="*Telepon" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model="major.fax" variant="outlined" hide-details label="Fax" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field @keyup="checkEmail($event.target.value)" v-model="major.email" variant="outlined"
                      hide-details label="*Email" />
                    <label v-if="ErrCheckEmail"><small style="color: red">email must be a valid email</small></label>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.contact_person" variant="outlined" hide-details label="*Kontak Person" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.experiment_building_area" type="number" variant="outlined" hide-details
                      label="Luas Kebun Percobaan (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.lecture_hall_area" type="number" variant="outlined" hide-details
                      label="Luas Ruang Kuliah (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.lecture_hall_count" type="number" variant="outlined" hide-details
                      label="Jumlah Ruang Kuliah (ruang)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.laboratorium_area" type="number" variant="outlined" hide-details
                      label="Luas Laboratorium (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.laboratorium_count" type="number" variant="outlined" hide-details
                      label="Jumlah Laboratorium (ruang)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.permanent_lecturer_room_area" type="number" variant="outlined"
                      hide-details label="Luas Ruang Dosen (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.administration_room_area" type="number" variant="outlined" hide-details
                      label="Luas Ruang Administrasi (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.book_count" type="number" variant="outlined" hide-details
                      label="Jumlah Judul Buku (buah)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.book_copy_count" type="number" variant="outlined" hide-details
                      label="Jumlah Eksemplar (eksemplar)" />
                  </v-col>
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="error" @click="close">
                      Batal
                    </v-btn>
                    <v-btn color="secondary" :disabled="
                      major.name == '' ||
                      major.faculty_id == '' ||
                      major.short_name == '' ||
                      major.address == '' ||
                      major.phone_number == '' ||
                      major.email == '' ||
                      major.contact_person == ''
                    " @click="save">
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
    <div v-if="mode == 'edit'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialog" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Ubah Jurusan</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.name" variant="outlined" hide-details label="*Nama Jurusan" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-select v-model="major.faculty_id" label="*Fakultas" placeholder="*Fakultas" item-title="name"
                      item-value="id" :items="faculties" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.short_name" variant="outlined" hide-details label="*Nama Singkat" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.english_name" variant="outlined" hide-details label="Nama Asing" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.english_short_name" variant="outlined" hide-details
                      label="Nama Asing Singkat" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.address" variant="outlined" hide-details label="*Alamat" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model="major.phone_number" variant="outlined" hide-details
                      label="*Telepon" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="number" v-model="major.fax" variant="outlined" hide-details label="Fax" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field @keyup="checkEmail($event.target.value)" v-model="major.email" variant="outlined"
                      hide-details label="*Email" />
                    <label v-if="ErrCheckEmail"><small style="color: red">email must be a valid email</small></label>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.contact_person" variant="outlined" hide-details label="*Kontak Person" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.experiment_building_area" type="number" variant="outlined" hide-details
                      label="Luas Kebun Percobaan (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.lecture_hall_area" type="number" variant="outlined" hide-details
                      label="Luas Ruang Kuliah (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.lecture_hall_count" type="number" variant="outlined" hide-details
                      label="Jumlah Ruang Kuliah (ruang)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.laboratorium_area" type="number" variant="outlined" hide-details
                      label="Luas Laboratorium (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.laboratorium_count" type="number" variant="outlined" hide-details
                      label="Jumlah Laboratorium (ruang)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.permanent_lecturer_room_area" type="number" variant="outlined"
                      hide-details label="Luas Ruang Dosen (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.administration_room_area" type="number" variant="outlined" hide-details
                      label="Luas Ruang Administrasi (m2)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.book_count" type="number" variant="outlined" hide-details
                      label="Jumlah Judul Buku (buah)" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="major.book_copy_count" type="number" variant="outlined" hide-details
                      label="Jumlah Eksemplar (eksemplar)" />
                  </v-col>
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="error" @click="close">
                      Batal
                    </v-btn>
                    <v-btn color="secondary" :disabled="
                      major.name == '' ||
                      major.faculty_id == '' ||
                      major.short_name == '' ||
                      major.address == '' ||
                      major.phone_number == '' ||
                      major.email == '' ||
                      major.contact_person == ''
                    " @click="update">
                      Ubah
                    </v-btn>
                  </v-card-actions>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'show'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogShow" max-width="800">
          <PagesMajorsDetail :id="showId" />
        </v-dialog>
      </v-col>
    </div>
    <div>
      <SharedBackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs" />
      <SharedUiParentCard title="Jurusan">
        <v-row>
          <v-col cols="12" lg="4" md="6" class="float-left">
            <v-text-field density="compact" label="Pencarian Jurusan" hide-details variant="outlined"
              @input="getData(limit, pagination.page, $event.target.value)" />
          </v-col>
          <v-col cols="12" lg="8" md="6" class="text-right">
            <v-btn color="primary" flat class="ml-auto" @click="create()">
              <v-icon class="mr-2">
                mdi-account-multiple-plus
              </v-icon>Tambah Jurusan
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
              Jurusan
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
          <tr v-for="item, index in majors" :key="item.id">
            <td class="text-subtitle-1">
              {{ index + 1 }}
            </td>
            <td class="text-subtitle-1">
              {{ item.name }}
            </td>
            <td class="text-subtitle-1">
              {{ item.faculty_name }}
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
                    <v-btn icon flat v-bind="props" @click="editItem(item)">
                      <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                    </v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip text="Hapus">
                  <template #activator="{ props }">
                    <v-btn icon flat v-bind="props" @click="deleteItem(item)">
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
              <!-- <TablePagination func_get_data="majors" :limit="limit" :page="page" :search="search" :total_pages="pagination.total_pages" :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"  /> -->
            </td>
          </tr>
        </tfoot>
      </v-table>
    </div>
  </div>
</template>
