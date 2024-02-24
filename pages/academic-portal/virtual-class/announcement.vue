<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { GetLecturerSemesterListData } from '~~/types/api/lecturer-semester/GetLecturerSemesterList';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';
import { GetLecturerClassAnnouncementData } from '~~/types/api/lecturer-class-announcement/GetLecturerClassAnnouncement';
import { getLecturerSemesterList } from '~~/composables/api/lecturer-semester/getLecturerSemesterList';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-class/getLecturerAssignedClassList';
import { getLecturerClassAnnouncement } from '~~/composables/api/lecturer-class-announcement/getLecturerClassAnnouncement';
import { deleteLecturerAnnouncement } from '~~/composables/api/lecturer-class-announcement/deleteLecturerAnnouncement';
import { ErrorRoot } from '~~/types/api/error';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week'
import { formatYearMonthDate } from '~~/utils/helpers/date-utils'
import { LoginData } from '~~/types/api/auth/Login';
import { GetStudentStudentClassListData } from '~~/types/api/student-student-class/GetStudentStudentClassList';
import { getStudentStudentClassList } from '~~/composables/api/student-student-class/getStudentStudentClassList';
import { GetStudentSemesterListData } from '~~/types/api/student-semester/GetStudentSemesterList';
import { getStudentSemesterList } from '~~/composables/api/student-semester/getStudentSemesterList';
import { PaginationModel } from '~~/types/api/pagination';
import { GetStudentClassAnnouncementListData } from '~~/types/api/student-class-announcement/GetStudentClassAnnouncementList';
import { getStudentClassAnnouncementList } from '~~/composables/api/student-class-announcement/getStudentClassAnnouncementList';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});

let userData = ref(<LoginData>{});
onMounted(async () => {
  const user = useAuth()
  if (user.value) {
    userData.value = <LoginData>user.value;
    if (userData.value.app_type == "lecturer") {

      // await lecturerMounted()

      await getSemester(limit, 1)
    } else if (userData.value.app_type == "student") {
      // await studentMounted()
      await getStudentSemesterData(limit, 1)
    }

  } else {
    return navigateTo({ name: 'login', path: '' })
  }
})
const limit = 20

const pagination = ref<PaginationModel>({
  page: 1,
  limit,
  prev: 1,
  next: 1,
  total_pages: 1,
  total_records: 0
})
const title = ref('Pengumuman')
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
const semesters = ref<GetLecturerSemesterListData[]>([])
const semesterId = ref('')
const classrooms = ref<GetLecturerAssignedClassListData[]>([])
const classroomId = ref('')
const announcements = ref(<GetLecturerClassAnnouncementData[]>[])
const announcementObj = ref(<GetLecturerClassAnnouncementData>{})
const search = ref('')

async function getSemester(limit: number, page: number) {
  try {
    const { response: resp, error: error } = await getLecturerSemesterList(limit, page, '')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      semesters.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function getClassroom() {
  try {
    const { response: resp, error: error } = await getLecturerAssignedClassList(semesterId.value)
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
async function getAnnouncement(limit: number, page: number, search: string) {
  try {
    const { response: resp, error: error } = await getLecturerClassAnnouncement(limit, page, search, classroomId.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      console.log(resp)
      announcements.value = resp?.data
      pagination.value = resp?.pagination
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

  studentClassAnnouncements.value = []
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
    const { response: resp, error: error } = await getStudentStudentClassList(semesterId.value)
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
  getStudentClassAnnouncementData(limit, 1)
}
const studentClassAnnouncements = ref<GetStudentClassAnnouncementListData[]>([])
async function getStudentClassAnnouncementData(limit: number, page: number) {
  try {
    if (!classroomId) {
      pagination.value = {
        page: 1,
        limit,
        prev: 1,
        next: 1,
        total_pages: 1,
        total_records: 0
      }
      studentClassAnnouncements.value = []
      // deleteList.value = []
      return;
    }
    const { response: resp, error: error } = await getStudentClassAnnouncementList(limit, page, search.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentClassAnnouncements.value = resp?.data
      pagination.value = resp?.pagination
    }
  } catch (error) {
    alert(error)
  }
}

///=======================
function create() {
  mode.value = 'create'
  dialog.value = true
}

function MouseOver(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
async function edit(item: any) {
  announcementObj.value = item
  mode.value = 'edit'
  dialog.value = true
}
async function deleteItm(item: any) {
  if (!confirm('Yakin Menghapus Item Ini ' + item.title + ' ?')) {
    return false
  }
  let req = <string[]>[]
  req.push(item.id)
  try {
    const { response: createFileResponse, error } = await deleteLecturerAnnouncement(req)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    } else {
      await getAnnouncement(pagination.value.limit, pagination.value.page, '')
    }
  } catch (error) {
    alert(error)
  }
}
function close() {
  dialog.value = false
}
watch(classroomId, async function (value) {
  if (value != '') {
    if (userData.value.app_type == 'lecturer') {
      await getAnnouncement(pagination.value.limit, pagination.value.page, '')
      console.log("ecart")
    } else {
      console.log("trace")
      await getStudentClassAnnouncementData(pagination.value.limit, pagination.value.page)
    }
  }
})
watch(semesterId, async function (value) {
  if (value != '') {
    if (userData.value.app_type == 'lecturer') {
      await getClassroom()
    } else {
      await getStudentClassData()
    }

  }
})
</script>
<template>
  <div v-if="mode == 'create'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalLecturerClassAnnouncementCreate
          @reload="getAnnouncement(pagination.limit, pagination.page, search)" @close="close" :classId="classroomId" />
      </v-dialog>
    </v-col>
  </div>
  <div v-if="mode == 'edit'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalLecturerClassAnnouncementEdit
          @reload="getAnnouncement(pagination.limit, pagination.page, search)" @close="close"
          :announcement="announcementObj" />
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
      Pengumuman merupakan fitur untuk meihat informasi bersama yang disampaikan oleh Dosen pengampu kelas kepada
      Mahasiswa peserta kelas.
    </v-alert>
  </v-col>
  <v-row>
    <v-col cols="12">
      <UiParentCard :title="'Daftar ' + title">
        <v-row>
          <v-col cols="12" lg="4" md="4">
            <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details
              :items="userData.app_type == 'lecturer' ? semesters : studentSemesters" label="Pilih Semester">
              <template v-slot:selection="{ item }">
                <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
              </template>
              <template v-slot:item="{ item, props: { onClick, title, value } }">
                <ul>
                  <li style="padding: 10px; margin: 2px;">
                    <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                      @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                      <span @click="onClick">{{ title.school_year }} - {{ title.semester_type }}</span>
                    </a>
                  </li>
                </ul>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" lg="4" md="4">
            <v-select v-model="classroomId" item-value="id" variant="outlined" hide-details
              :items="userData.app_type == 'lecturer' ? classrooms : studentStudentClasss" label="Pilih Kelas">
              <template v-slot:selection="{ item }">
                <span>{{ item.props.title.study_program_name }} - {{ item.props.title.subject_name }} - {{
                  item.props.title.name }}</span>
              </template>
              <template v-slot:item="{ item, props: { onClick, title, value } }">
                <ul>
                  <li style="padding: 10px; margin: 2px;">
                    <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                      @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                      <span @click="onClick">{{ title.subject_code }} - {{ title.subject_name }} - {{ title.name }}
                        (kapasitas: {{ title.maximum_participant }} orang)</span>
                    </a>
                  </li>
                </ul>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" lg="4" md="4">
            <v-text-field v-model="search" variant="outlined" hide-details label="Judul" />
          </v-col>
          <v-col cols="12" lg="4" md="4">
            <v-text-field type="date" variant="outlined" hide-details label="Tanggal" />
          </v-col>
          <v-col cols="12" lg="4" md="4">
            <v-text-field type="date" variant="outlined" hide-details label="Sampai Dengan" />
          </v-col>
          <v-col cols="12" lg="4" md="4">
            <!-- <v-btn title="Detil" icon flat @click="show()" class="mr-2">
              <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
            </v-btn> -->
            <v-btn color="primary" flat class="ml-auto" @click="create()" :disabled="classroomId == ''"
              v-if="userData.app_type == 'lecturer'">
              <v-icon class="mr-2">
                mdi-plus
              </v-icon>Tambah Pengumuman
            </v-btn>
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
        <th class="text-subtitle-1 font-weight-semibold">Tanggal Batas</th>
        <th class="text-subtitle-1 font-weight-semibold">Judul</th>
        <th class="text-subtitle-1 font-weight-semibold">Konten</th>
        <th class="text-subtitle-1 font-weight-semibold" v-if="userData.app_type == 'lecturer'">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in announcements" v-if="userData.app_type == 'lecturer'">
        <td>{{ index + 1 }}</td>
        <td v-if="item.start_time != ''">
          {{ new Date(item.start_time).getDay() == 0 ? convertDayOfWeek(new Date(item.start_time).getDay() + 7) + ', ' :
            convertDayOfWeek(new Date(item.start_time).getDay()) + ', ' }} {{ formatYearMonthDate(item.start_time) }}
        </td>
        <td v-else>-</td>
        <td v-if="item.end_time != ''">
          {{ new Date(item.end_time).getDay() == 0 ? convertDayOfWeek(new Date(item.end_time).getDay() + 7) + ', ' :
            convertDayOfWeek(new Date(item.end_time).getDay()) + ', ' }} {{ formatYearMonthDate(item.end_time) }}
        </td>
        <td v-else>-</td>
        <td>{{ item.title }}</td>
        <td>{{ item.content }}</td>
        <td>
          <v-tooltip text="Ubah" v-if="userData.app_type == 'lecturer'">
            <template #activator="{ props }">
              <v-btn title="Ubah" icon flat @click="edit(item)">
                <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="Hapus" v-if="userData.app_type == 'lecturer'">
            <template #activator="{ props }">
              <v-btn title="Hapus" icon flat @click="deleteItm(item)">
                <TrashIcon stroke-width="1.5" size="20" class="text-error" />
              </v-btn>
            </template>
          </v-tooltip>
        </td>
      </tr>
      <tr v-for="(item, index) in studentClassAnnouncements" v-if="userData.app_type == 'student'">
        <td>{{ index + 1 }}</td>
        <td v-if="item.start_time != ''">
          {{ new Date(item.start_time).getDay() == 0 ? convertDayOfWeek(new Date(item.start_time).getDay() + 7) + ', ' :
            convertDayOfWeek(new Date(item.start_time).getDay()) + ', ' }} {{ formatYearMonthDate(item.start_time) }}
        </td>
        <td v-else>-</td>
        <td v-if="item.end_time != ''">
          {{ new Date(item.end_time).getDay() == 0 ? convertDayOfWeek(new Date(item.end_time).getDay() + 7) + ', ' :
            convertDayOfWeek(new Date(item.end_time).getDay()) + ', ' }} {{ formatYearMonthDate(item.end_time) }}
        </td>
        <td v-else>-</td>
        <td>{{ item.title }}</td>
        <td>{{ item.content }}</td>

      </tr>
    </tbody>
  </v-table>
</template>
