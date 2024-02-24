<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerSemesterListData } from '~~/types/api/lecturer-semester/GetLecturerSemesterList';
import { getLecturerSemesterList } from '~~/composables/api/lecturer-semester/getLecturerSemesterList';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-class/getLecturerAssignedClassList';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';
import { getLecturerClassWorkList } from '~~/composables/api/lecturer-class-work/getLecturerClassWorkList';
import { GetLecturerClassWorkListData } from '~~/types/api/lecturer-class-work/GetLecturerClassWorkList';
import { PaginationModel } from '~~/types/api/pagination';
import moment from 'moment';
import { DownloadIcon } from 'vue-tabler-icons';
import { deleteLecturerClassWork } from '~~/composables/api/lecturer-class-work/deleteLecturerClassWork';
import { GetStudentClassWorkListData } from '~~/types/api/student-class-work/GetStudentClassWorkList';
import { getStudentClassWorkList } from '~~/composables/api/student-class-work/getStudentClassWorkList';
import { getStudentSemesterList } from '~~/composables/api/student-semester/getStudentSemesterList';
import { getStudentStudentClassList } from '~~/composables/api/student-student-class/getStudentStudentClassList';
import { GetStudentSemesterListData } from '~~/types/api/student-semester/GetStudentSemesterList';
import { GetStudentStudentClassListData } from '~~/types/api/student-student-class/GetStudentStudentClassList';
import { LoginData } from '~~/types/api/auth/Login';
import { submitStudentClassWork } from '~~/composables/api/student-class-work/submitStudentClassWork';
import { SubmitStudentClassWorkRequest } from '~~/types/api/student-class-work/SubmitStudentClassWork';
import { fileUpload } from '~~/utils/helpers/file-upload';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});

const title = ref('Tugas Kuliah')
// const mode = ref('list')
const mode = ref('show')
const dialog = ref(false)
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

function create() {
  mode.value = 'create'
  dialog.value = true
}

const editData = ref(<GetLecturerClassWorkListData>{})
const showData = ref(<GetLecturerClassWorkListData>{})
function edit(data: GetLecturerClassWorkListData) {
  mode.value = 'edit'
  dialog.value = true
  editData.value = data
}
function showDetail(data: GetLecturerClassWorkListData) {
  mode.value = 'show'
  dialog.value = true
  showData.value = data
}
const deleteList = ref(<string[]>[])
function deleteData() {
  mode.value = 'delete'
  dialog.value = true
}
function close() {
  dialog.value = false
}


let userData = ref(<LoginData>{});
onMounted(async () => {
  const user = useAuth()
  // await getLecturerSemesterData(1000000, 1);const user = useAuth()
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
  await getLecturerSemesterData(1000000, 1);
}

async function studentMounted() {
  await getStudentSemesterData(1000000, 1);
}
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
const lecturerSemesters = ref<GetLecturerSemesterListData[]>([])
const selectedLecturerSemester = ref(<GetLecturerSemesterListData>{});
async function getLecturerSemesterData(limit: number, page: number) {
  try {
    const { response: resp, error: error } = await getLecturerSemesterList(limit, page, "")
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lecturerSemesters.value = resp?.data
      lecturerSemesters.value.forEach((s) => {
        s.semester_type_year = s.semester_start_year + " " + s.semester_type
      });
    }
  } catch (error) {
    alert(error)
  }
}
async function lecturerSemesterOnChange(id: any) {
  selectedLecturerSemester.value = lecturerSemesters.value.filter((x) => { return x.id == id })[0]
  selectedLecturerAssignedClass.value = <GetLecturerAssignedClassListData>{}
  lecturerAssignedClasss.value = []

  lecturerClassWorks.value = []
  deleteList.value = []
  pagination.value = {
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
  }
  getLecturerAssignedClassData()
}
const lecturerAssignedClasss = ref<GetLecturerAssignedClassListData[]>([])
const selectedLecturerAssignedClass = ref(<GetLecturerAssignedClassListData>{});
async function getLecturerAssignedClassData() {
  try {
    if (!selectedLecturerSemester.value.id) {
      lecturerAssignedClasss.value = []
    }
    const { response: resp, error: error } = await getLecturerAssignedClassList(selectedLecturerSemester.value.id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lecturerAssignedClasss.value = resp?.data
      lecturerAssignedClasss.value.forEach((s) => {
        s.studyporgram_subject = s.study_program_name + " - " + s.subject_name + " - " + s.name
      });
    }
  } catch (error) {
    alert(error)
  }
}
async function lecturerAssignedClassOnChange(id: any) {
  selectedLecturerAssignedClass.value = lecturerAssignedClasss.value.filter((x) => { return x.id == id })[0]
  getLecturerClassWorkData(limit, 1)
}
const lecturerClassWorks = ref<GetLecturerClassWorkListData[]>([])
async function getLecturerClassWorkData(limit: number, page: number) {
  try {
    if (!selectedLecturerAssignedClass.value.id) {
      pagination.value = {
        page: 1,
        limit,
        prev: 1,
        next: 1,
        total_pages: 1,
        total_records: 0
      }
      lecturerClassWorks.value = []
      deleteList.value = []
      return;
    }
    const { response: resp, error: error } = await getLecturerClassWorkList(limit, page, search.value, selectedLecturerAssignedClass.value.id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lecturerClassWorks.value = resp?.data
      pagination.value = resp.pagination
    }
  } catch (error) {
    alert(error)
  }
}

///======================= STUDENT===========================
const studentSemesters = ref<GetStudentSemesterListData[]>([])
const selectedStudentSemester = ref(<GetStudentSemesterListData>{});
async function getStudentSemesterData(limit: number, page: number) {
  try {
    const { response: resp, error: error } = await getStudentSemesterList(limit, page, "")
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentSemesters.value = resp?.data
      studentSemesters.value.forEach((s) => {
        s.semester_type_year = s.semester_start_year + " " + s.semester_type
      });
    }
  } catch (error) {
    alert(error)
  }
}
async function studentSemesterOnChange(id: any) {
  selectedStudentSemester.value = studentSemesters.value.filter((x) => { return x.id == id })[0]
  selectedStudentStudentClass.value = <GetStudentStudentClassListData>{}
  studentStudentClasss.value = []

  studentClassWorks.value = []
  deleteList.value = []
  pagination.value = {
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
  }
  // getStudentClassData()
  getStudentClassWorkData(limit, 1)
}
const studentStudentClasss = ref<GetStudentStudentClassListData[]>([])
const selectedStudentStudentClass = ref(<GetStudentStudentClassListData>{});
async function getStudentClassData() {
  try {
    if (!selectedStudentSemester.value.id) {
      studentStudentClasss.value = []
    }
    const { response: resp, error: error } = await getStudentStudentClassList(selectedStudentSemester.value.id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentStudentClasss.value = resp?.data
      studentStudentClasss.value.forEach((s) => {
        s.studyporgram_subject = s.subject_name + " - " + s.name
      });
    }
  } catch (error) {
    alert(error)
  }
}
async function studentStudentClassOnChange(id: any) {
  selectedStudentStudentClass.value = studentStudentClasss.value.filter((x) => { return x.id == id })[0]
  getStudentClassWorkData(limit, 1)
}

const studentClassWorks = ref<GetStudentClassWorkListData[]>([])
async function getStudentClassWorkData(limit: number, page: number) {
  try {
    if (!selectedStudentSemester.value.id) {
      pagination.value = {
        page: 1,
        limit,
        prev: 1,
        next: 1,
        total_pages: 1,
        total_records: 0
      }
      studentClassWorks.value = []
      deleteList.value = []
      return;
    }
    const { response: resp, error: error } = await getStudentClassWorkList(limit, page, search.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentClassWorks.value = resp?.data
      pagination.value = resp.pagination
    }
  } catch (error) {
    alert(error)
  }
}

///=======================

async function deleteItm() {
  try {
    const { response: deleteResponse, error } = await deleteLecturerClassWork(deleteList.value)
    if (error) {
      let dataError = <ErrorRoot>error.data;
      alert(dataError.meta.message);
      return;
    }
    // return true;
    deleteList.value = []
  } catch (error) {
    alert(error)
    // return false;
  }
  close()
  getLecturerClassWorkData(limit, 1)
}
function MouseOver(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

// const submitStudentClassWorks = ref(<SubmitStudentClassWorkData>{})
async function getSubmitStudentClassWorkData(classWork: GetStudentClassWorkListData, fileBase64: string) {
  try {
    let temFile = await fileUpload(fileBase64)
    const { response: resp, error: error } = await submitStudentClassWork(
      <SubmitStudentClassWorkRequest>{
        class_work_id: classWork.id,
        file_path: temFile.path,
        file_path_type: temFile.path_type,
      }
    )
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      // submitStudentClassWorks.value = resp?.data
      getStudentClassWorkData(limit, 1)
      alert("Tugas berhasil di kirim");

    }
  } catch (error) {
    alert(error)
  }
}

async function onFileChanged(event: any, data: GetStudentClassWorkListData) {
  const target = event.target as HTMLInputElement
  if (target.files?.length == 0) {
    return false
  }
  const reader = new FileReader();
  reader.readAsDataURL(target.files![0])
  reader.onload = function () {
    const base64 = reader.result!.toString().split(',')[1]
    getSubmitStudentClassWorkData(data, base64)
  }
}
</script>
<template>
  <div v-if="mode == 'create'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalVirtualClassAssignmentsCreate :semester="selectedLecturerSemester" @close="close"
          @reload="getLecturerClassWorkData(limit, 1)" />
      </v-dialog>
    </v-col>
  </div>
  <div v-if="mode == 'edit'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalVirtualClassAssignmentsUpdate :detail="editData" :semester="selectedLecturerSemester"
          @close="close" @reload="getLecturerClassWorkData(limit, 1)" />
      </v-dialog>
    </v-col>
  </div>
  <div v-if="mode == 'show'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalVirtualClassAssignmentsShow :detail="showData" @close="close" @reload="getLecturerClassWorkData(limit, 1)" />
      </v-dialog>
    </v-col>
  </div>
  <div v-if="mode == 'delete'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <v-card>
          <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Hapus Tugas </span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>

              <v-row>
                <div>Hapus {{ deleteList.length }} Tugas yang yang di pilih?</div>
              </v-row>
              <!-- <v-row>
                <h5>Umur</h5>
              </v-row>
              <v-row>
                <div>{{ deletedData.age }}</div>
              </v-row> -->


              <v-col class="text-right">
                <v-card-actions class="pa-4">
                  <v-spacer />
                  <v-btn color="error" @click="close()">
                    Batal
                  </v-btn>
                  <v-btn color="secondary" :disabled="deleteList.length == 0" @click="deleteItm()">
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
  <v-col cols="12">
    <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
  </v-col>
  <v-row>
    <v-col cols="12">
      <UiParentCard :title="'Filter Daftar ' + title">
        <v-row>
          <v-col cols="12" lg="4" md="4">
            <v-select item-value="id" variant="outlined" hide-details
              :items="userData.app_type == 'lecturer' ? lecturerSemesters : studentSemesters" label="Semester"
              @update:model-value="(sl: any) => userData.app_type == 'lecturer' ? lecturerSemesterOnChange(sl) : studentSemesterOnChange(sl)">
              <template v-slot:selection="{ item }">
                <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                }}</span>
              </template>
              <template v-slot:item="{ item, props: { onClick, title, value } }">
                <ul>
                  <li style="padding: 10px; margin: 2px;">
                    <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                      @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                      <span @click="onClick">{{ title.school_year }} - {{ title.semester_type
                      }}</span>
                    </a>
                  </li>
                </ul>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" lg="4" md="4" v-if="userData.app_type == 'lecturer' ? true : false">
            <v-select :items="lecturerAssignedClasss" item-value="id" item-title="studyporgram_subject"
              @update:model-value="(sl: any) => lecturerAssignedClassOnChange(sl)"
              v-model="selectedLecturerAssignedClass.id" label="Pilih Matakuliah"></v-select>
          </v-col>
          <v-col cols="12" lg="4" md="4">
            <v-text-field density="compact" v-model="search" label="Judul" hide-details variant="outlined"
              @input="userData.app_type == 'lecturer' ? getLecturerClassWorkData(limit, 1) : getStudentClassWorkData(limit, 1)"></v-text-field>
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" lg="12" md="12" class="text-right" v-if="userData.app_type == 'lecturer'">
      <v-btn color="primary" flat class="ml-auto" @click="create()" :disabled="!selectedLecturerSemester.id">
        <v-icon class="mr-2">
          mdi-plus
        </v-icon>Tambah Tugas Kelas
      </v-btn>
    </v-col>
  </v-row>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold" v-if="userData.app_type == 'lecturer'">
          <v-checkbox></v-checkbox>
        </th>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Tugas</th>
        <th class="text-subtitle-1 font-weight-semibold">File</th>
        <th class="text-subtitle-1 font-weight-semibold">Waktu</th>
        <th class="text-subtitle-1 font-weight-semibold" v-if="userData.app_type == 'student'">File Pengerjaan</th>
        <th class="text-subtitle-1 font-weight-semibold" v-if="userData.app_type == 'lecturer'">Yang Mengerjakan</th>
        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="evt, i in lecturerClassWorks" v-if="userData.app_type == 'lecturer'">
        <td>
          <v-checkbox :value="evt.id" v-model="deleteList"></v-checkbox>
        </td>
        <td>{{ i + 1 }}</td>
        <td>{{ evt.title }}</td>
        <td><a :href="evt.file_url" v-if="evt.file_url">Download Tugas</a></td>
        <td>{{ moment(evt.end_time).format('DD-MMM-YYYY HH:mm') }}</td>
        <td>{{ evt.total_submission }}</td>
        <td>
          <div class="d-flex align-center">
            <v-tooltip text="Ubah">
              <template #activator="{ props }">
                <v-btn icon flat @click="edit(evt)">
                  <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Lihat">
              <template #activator="{ props }">
                <v-btn icon flat @click="showDetail(evt)">
                  <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </td>
      </tr>
      <tr v-for="evt, i in studentClassWorks" v-if="userData.app_type == 'student'">
        <td>{{ i + 1 }}</td>
        <td>{{ evt.title }}</td>
        <td><a :href="evt.file_url" v-if="evt.file_url">Download Tugas</a></td>
        <td>{{ moment(evt.end_time).format('DD-MMM-YYYY HH:mm') }}</td>
        <td><a :href="evt.submission_file_url" v-if="evt.submission_file_url">Download</a></td>
        <td>
          <div class="d-flex align-center">
            <v-tooltip text="Kirim Tugas">
              <template #activator="{ props }">
                <v-btn icon flat>
                  <UploadIcon stroke-width="1.5" size="20" class="text-primary"
                    onclick="document.getElementById('uploader').click()" />
                </v-btn>
                <input id="uploader" class="d-none" type="file" @change="onFileChanged($event, evt)">
              </template>
            </v-tooltip>
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>
  <v-row v-if="userData.app_type == 'lecturer'">
    <v-col cols="12" lg="12" md="12" class="text-left">
      <v-btn color="error" flat class="ml-auto" @click="deleteData()" :disabled="deleteList.length == 0">
        <v-icon class="mr-2">
          mdi-delete
        </v-icon>Hapus
      </v-btn>
    </v-col>
  </v-row>
</template>
