<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentStudyPlanDetailData } from '~~/types/api/student-study-plan/GetStudentStudyPlanDetail';
import { getStudentStudyPlanDetail } from '~~/composables/api/student-study-plan/getStudentStudyPlanDetail';
import { getHomePageSemesterSummary } from '~~/composables/api/general-student/getHomePageSemesterSummary';
import { GetHomePageSemesterSummaryData } from '~~/types/api/general-student/GetHomePageSemesterSummary';
import { GetStudentSemesterListData } from '~~/types/api/student-semester/GetStudentSemesterList';
import { getStudentSemesterList } from '~~/composables/api/student-semester/getStudentSemesterList';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Kartu Hasil Studi')
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
const studyPrograms = ref([
  'Teknologi Konstruksi Bangunan Air',
  'Teknologi Konstruksi Bangunan Gedung',
  'Teknologi Konstruksi Jalan dan Jembatan',
])
onMounted(async () => {
  await getHomePageSemesterSummaryData()
})

const studentStudyPlanDetails = ref(<GetStudentStudyPlanDetailData>{})
async function getStudentStudyPlanDetailData(semester: GetStudentSemesterListData) {
  try {
    const { response: resp, error: error } = await getStudentStudyPlanDetail(semester.id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentStudyPlanDetails.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

const homePageSemesterSummarys = ref(<GetHomePageSemesterSummaryData>{})
async function getHomePageSemesterSummaryData() {
  try {
    const { response: resp, error: error } = await getHomePageSemesterSummary()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      homePageSemesterSummarys.value = resp?.data
      await getStudentSemesterData(1000000, 1)
    }
  } catch (error) {
    alert(error)
  }
}
const studentSemesters = ref<GetStudentSemesterListData[]>([])
const selectedStudentSemester = ref(<GetStudentSemesterListData>{});
const selectedStudentSemesterId = ref('')
async function getStudentSemesterData(limit: number, page: number) {
  try {
    const { response: resp, error: error } = await getStudentSemesterList(limit, page, '')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentSemesters.value = resp?.data
      studentSemesters.value.forEach(s => {
        if (s.id == homePageSemesterSummarys.value.semester_id) {
          console.log("default")
          selectedStudentSemester.value = s
          selectedStudentSemesterId.value = s.id
          console.log(selectedStudentSemesterId)
        }
      });
    }
  } catch (error) {
    alert(error)
  }
}
async function studentSemesterOnChange(id: any) {
  selectedStudentSemester.value = studentSemesters.value.filter((x) => { return x.id == id })[0]
}

function MouseOver(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
async function show() {
  await getStudentStudyPlanDetailData(selectedStudentSemester.value)
}
</script>
<template>
  <div>
    <v-col cols="12">
      <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
    </v-col>
    <v-col cols="12">
      <v-alert type="info" variant="tonal">
        Keterangan :
        <br />
        Kartu Hasil Studi merupakan fasilitas yang dapat digunakan untuk melihat hasil studi mahasiswa persemester. Selain
        dapat dilihat secara online, hasil studi ini juga dapat dicetak.
      </v-alert>
    </v-col>
    <v-row>
      <v-col cols="12">
        <UiParentCard :title="'Pilih ' + title">
          <v-row>
            <v-col cols="12" lg="6" md="6">
              <!-- <v-autocomplete :items="['Genap 2022/2023', 'Ganjil 2022/2023']" color="primary" variant="outlined"
                hide-details></v-autocomplete> -->
              <v-select item-value="id" variant="outlined" hide-details :items="studentSemesters" label="Semester"
                @update:model-value="(sl: any) => studentSemesterOnChange(sl)" v-model="selectedStudentSemesterId">
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
            <v-col cols="12" lg="6" md="6" class="text-right">
              <v-btn color="primary" class="mt-2" @click="show()">
                Lihat
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12">

              <hr />
              <v-row>
                <v-col cols="2" sm="2">
                  Nama
                </v-col>
                <v-col cols="10" sm="10">
                  {{ studentStudyPlanDetails.student_name }}
                </v-col>
              </v-row>
              <hr />

              <v-row>
                <v-col cols="2" sm="2">
                  Nim
                </v-col>
                <v-col cols="10" sm="10">
                  {{ studentStudyPlanDetails.student_nim_number }}
                </v-col>
              </v-row>
              <hr />

              <v-row>
                <v-col cols="2" sm="2">
                  Program Studi
                </v-col>
                <v-col cols="10" sm="10">
                  {{ studentStudyPlanDetails.study_program_name }}
                </v-col>
              </v-row>
              <hr />

              <v-row>
                <v-col cols="2" sm="2">
                  Semester
                </v-col>
                <v-col cols="10" sm="10">
                  {{ studentStudyPlanDetails.semester_type }} - {{ studentStudyPlanDetails.semester_school_year }}
                </v-col>
              </v-row>
              <hr />
              <br />
              <br />
              <hr />
              <v-row>
                <v-col cols="1" sm="1">
                  No
                </v-col>
                <v-col cols="1" sm="1">
                  Kode
                </v-col>
                <v-col cols="6" sm="6">
                  Mata Kuliah
                </v-col>
                <v-col cols="1" sm="1">
                  Kelas
                </v-col>
                <v-col cols="1" sm="1">
                  W/P
                </v-col>
                <v-col cols="1" sm="1">
                  SKS
                </v-col>
                <v-col cols="1" sm="1">
                  Nilai
                </v-col>
              </v-row>
              <hr />
              <div v-for="clss, i in studentStudyPlanDetails.classes">
                <v-row>
                  <v-col cols="1" sm="1">
                    {{ i + 1 }}
                  </v-col>
                  <v-col cols="1" sm="1">
                    {{ clss.subject_code }}
                  </v-col>
                  <v-col cols="6" sm="6">
                    {{ clss.subject_name }}
                  </v-col>
                  <v-col cols="1" sm="1">
                    {{ clss.name }}
                  </v-col>
                  <v-col cols="1" sm="1">
                    {{ clss.is_mandatory ? 'W' : 'P' }}
                  </v-col>
                  <v-col cols="1" sm="1">
                    {{ clss.subject_theory_credit + clss.subject_practicum_credit }}
                  </v-col>
                  <v-col cols="1" sm="1">
                    {{ clss.grade_code }}
                  </v-col>
                </v-row>
                <hr />
              </div>
              <br />
              <hr />
              <v-row>
                <v-col cols="3" sm="3">
                  Jumlah SKS yang diambil
                </v-col>
                <v-col cols="9" sm="9">
                  {{ studentStudyPlanDetails.total_mandatory_credit + studentStudyPlanDetails.total_optional_credit }}
                </v-col>
              </v-row>
              <hr />
              <v-row>
                <v-col cols="3" sm="3">
                  Jumlah Matakuliah yang diambil
                </v-col>
                <v-col cols="9" sm="9">
                  {{ studentStudyPlanDetails.classes.length }}
                </v-col>
              </v-row>
              <hr />
              
              <v-row>
                <v-col cols="3" sm="3">
                  IP Komulatif
                </v-col>
                <v-col cols="9" sm="9">
                  {{ studentStudyPlanDetails.gpa}}
                </v-col>
              </v-row>
              <hr />
              
              <v-row>
                <v-col cols="3" sm="3">
                  IP Semester
                </v-col>
                <v-col cols="9" sm="9">
                  {{ studentStudyPlanDetails.grade_point }}
                </v-col>
              </v-row>
              <hr />
            </v-col>
          </v-row>
        </UiParentCard>
      </v-col>

    </v-row>

  </div>
</template>
