<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerSemesterListData } from '~~/types/api/lecturer-semester/GetLecturerSemesterList';
import { getLecturerSemesterList } from '~~/composables/api/lecturer-semester/getLecturerSemesterList';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-class/getLecturerAssignedClassList';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';
import { getLecturerClassDiscussionList } from '~~/composables/api/lecturer-class-discussion/getLecturerClassDiscussionList';
import { GetLecturerClassDiscussionListData } from '~~/types/api/lecturer-class-discussion/GetLecturerClassDiscussionList';
import { PaginationModel } from '~~/types/api/pagination';
import moment from 'moment';
import { DownloadIcon } from 'vue-tabler-icons';
import { deleteLecturerClassDiscussion } from '~~/composables/api/lecturer-class-discussion/deleteLecturerClassDiscussion';
import { LoginData } from '~~/types/api/auth/Login';
import { GetStudentSemesterListData } from '~~/types/api/student-semester/GetStudentSemesterList';
import { getStudentSemesterList } from '~~/composables/api/student-semester/getStudentSemesterList';
import { GetStudentStudentClassListData } from '~~/types/api/student-student-class/GetStudentStudentClassList';
import { getStudentStudentClassList } from '~~/composables/api/student-student-class/getStudentStudentClassList';
import { GetStudentClassDiscussionListData } from '~~/types/api/student-class-discussion/GetStudentClassDiscussionList';
import { getStudentClassDiscussionList } from '~~/composables/api/student-class-discussion/getStudentClassDiscussionList';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});

const title = ref('Diskusi Online')
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
    text: 'Daftar ' + title.value,
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

const editData = ref(<GetLecturerClassDiscussionListData>{})
function edit(data: GetLecturerClassDiscussionListData) {
  mode.value = 'edit'
  dialog.value = true
  editData.value = data
}
const deleteData = ref(<GetLecturerClassDiscussionListData>{})
function deleteForm(data: GetLecturerClassDiscussionListData) {
  mode.value = 'delete'
  dialog.value = true
  deleteData.value = data
}

const commentsData = ref(<any>{})
function comments(data: any) {
  mode.value = 'comments'
  dialog.value = true
  commentsData.value = data
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

  lecturerClassDiscussions.value = []
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
  getLecturerClassDiscussionData(limit, 1)
}
const lecturerClassDiscussions = ref<GetLecturerClassDiscussionListData[]>([])
async function getLecturerClassDiscussionData(limit: number, page: number) {
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
      lecturerClassDiscussions.value = []
      return;
    }
    const { response: resp, error: error } = await getLecturerClassDiscussionList(limit, page, search.value, selectedLecturerAssignedClass.value.id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lecturerClassDiscussions.value = resp?.data
      pagination.value = resp.pagination
    }
  } catch (error) {
    alert(error)
  }
}
const deleteId = ref("")
async function deleteItm(id: string) {
  try {
    const { response: deleteResponse, error } = await deleteLecturerClassDiscussion(id)
    if (error) {
      let dataError = <ErrorRoot>error.data;
      alert(dataError.meta.message);
      return;
    }
  } catch (error) {
    alert(error)
    // return false;
  }
  close()
  getLecturerClassDiscussionData(limit, 1)
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

  studentClassDiscussions.value = []
  pagination.value = {
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
  }
  getStudentClassData()
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
  getStudentClassDiscussionData(limit, 1)
}

const studentClassDiscussions = ref<GetStudentClassDiscussionListData[]>([])
async function getStudentClassDiscussionData(limit: number, page: number) {
  try {
    if (!selectedStudentStudentClass.value.id) {
      pagination.value = {
        page: 1,
        limit,
        prev: 1,
        next: 1,
        total_pages: 1,
        total_records: 0
      }
      studentClassDiscussions.value = []
      return;
    }
    const { response: resp, error: error } = await getStudentClassDiscussionList(limit, page, selectedStudentStudentClass.value.id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentClassDiscussions.value = resp?.data
      pagination.value = resp.pagination
    }
  } catch (error) {
    alert(error)
  }
}

///=======================
function MouseOver(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

</script>
<template>
  <div v-if="mode == 'comments'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalVirtualClassDiscussionComments :classDiscussionCommentId="commentsData.id" @close="close"
          :title="commentsData.title"
          @reload="userData.app_type == 'lecturer' ? getLecturerClassDiscussionData(limit, 1) : getStudentClassDiscussionData(limit, 1)" />
      </v-dialog>
    </v-col>
  </div>
  <div v-if="mode == 'create'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalVirtualClassDiscussionCreate :semester="selectedLecturerSemester" @close="close"
          @reload="getLecturerClassDiscussionData(limit, 1)" />
      </v-dialog>
    </v-col>
  </div>
  <div v-if="mode == 'edit'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalVirtualClassDiscussionUpdate :detail="editData" :semester="selectedLecturerSemester"
          @close="close" @reload="getLecturerClassDiscussionData(limit, 1)" />
      </v-dialog>
    </v-col>
  </div>
  <div v-if="mode == 'delete'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <v-card>
          <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Hapus Diskusi </span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>

              <v-row>
                <div>Hapus diskusi yang yang di pilih?</div>
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
                  <v-btn color="secondary" :disabled="!deleteData.id" @click="deleteItm(deleteData.id)">
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
          <v-col cols="12" lg="4" md="4">
            <v-select :items="lecturerAssignedClasss" item-value="id" item-title="studyporgram_subject"
              v-if="userData.app_type == 'lecturer'" @update:model-value="(sl: any) => lecturerAssignedClassOnChange(sl)"
              v-model="selectedLecturerAssignedClass.id" label="Pilih Matakuliah"></v-select>

            <v-select :items="studentStudentClasss" item-value="id" item-title="studyporgram_subject"
              v-if="userData.app_type == 'student'" @update:model-value="(sl: any) => studentStudentClassOnChange(sl)"
              v-model="selectedStudentStudentClass.id" label="Pilih Matakuliah"></v-select>
          </v-col>
          <v-col cols="12" lg="4" md="4" v-if="userData.app_type == 'lecturer'">
            <v-text-field density="compact" v-model="search" label="Judul" hide-details variant="outlined"
              @input="getLecturerClassDiscussionData(limit, 1)"></v-text-field>
            <!-- @input="userData.app_type == 'lecturer' ? getLecturerClassDiscussionData(limit, 1) : getStudentClassDiscussionData(limit, 1)"></v-text-field> -->
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
  <v-row v-if="userData.app_type == 'lecturer'">
    <v-col cols="12" lg="12" md="12" class="text-right">
      <v-btn color="primary" flat class="ml-auto" @click="create()" :disabled="!selectedLecturerSemester.id">
        <v-icon class="mr-2">
          mdi-plus
        </v-icon>Tambah Diskusi Kelas
      </v-btn>
    </v-col>
  </v-row>
  <v-table class="mt-5">
    <thead>
      <tr>
        <!-- <th class="text-subtitle-1 font-weight-semibold">
          <v-checkbox></v-checkbox>
        </th> -->
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Topik</th>
        <th class="text-subtitle-1 font-weight-semibold">Pesan</th>
        <th class="text-subtitle-1 font-weight-semibold">Terakhir</th>
        <th class="text-subtitle-1 font-weight-semibold">Moderator</th>
        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="discussion, i in lecturerClassDiscussions" v-if="userData.app_type == 'lecturer'">
        <!-- <td>
          <v-checkbox :value="discussion.id" v-model="deleteList"></v-checkbox>
        </td> -->
        <td>{{ i + 1 }}</td>
        <td> <a @click="comments(discussion)">{{ discussion.title }}</a></td>
        <td>{{ discussion.abstraction }}</td>
        <td>{{ discussion.last_comment }}</td>
        <td>{{ discussion.lecturer_name }}</td>
        <td>
          <div class="d-flex align-center">
            <v-tooltip text="Ubah">
              <template #activator="{ props }">
                <v-btn icon flat @click="edit(discussion)">
                  <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Hapus">
              <template #activator="{ props }">
                <v-btn icon flat @click="deleteForm(discussion)">
                  <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Diskusi">
              <template #activator="{ props }">
                <v-btn class="mdi mdi-comment text-primary" flat @click="comments(discussion)">
                  <!-- <CommentIcon stroke-width="1.5" size="20" class="text-error" /> -->
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </td>
      </tr>
      <tr v-for="discussion, i in studentClassDiscussions" v-if="userData.app_type == 'student'">
        <!-- <td>
          <v-checkbox :value="discussion.id" v-model="deleteList"></v-checkbox>
        </td> -->
        <td>{{ i + 1 }}</td>
        <td>{{ discussion.title }}</td>
        <td>{{ discussion.abstraction }}</td>
        <td>{{ discussion.last_comment }}</td>
        <td>{{ discussion.lecturer_name }}</td>
        <td>
          <div class="d-flex align-center">
            <v-tooltip text="Diskusi">
              <template #activator="{ props }">
                <v-btn flat @click="comments(discussion)" class="mdi mdi-comment text-primary">
                  <!-- <CommentIcon stroke-width="1.5" size="20" class="text-error" /> -->
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>
  <!-- <v-row>
    <v-col cols="12" lg="12" md="12" class="text-left">
      <v-btn color="error" flat class="ml-auto" @click="deleteData()" :disabled="deleteList.length == 0">
        <v-icon class="mr-2">
          mdi-delete
        </v-icon>Hapus
      </v-btn>
    </v-col>
  </v-row> -->
</template>
