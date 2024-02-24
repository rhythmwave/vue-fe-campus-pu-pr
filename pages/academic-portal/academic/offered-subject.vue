
<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerStudyProgramListData } from '~~/types/api/lecturer-study-program/GetLecturerStudyProgramList';
import { GetActiveSemesterClassListData } from '~~/types/api/lecturer-class/GetActiveSemesterClassList';
import { GetOfferedClassData } from "~~/types/api/academic-portal-student-offered-class/GetOfferedClass";
import { getLecturerStudyProgramList } from '~~/composables/api/lecturer-study-program/getLecturerStudyProgramList';
import { getActiveSemesterClassList } from '~~/composables/api/lecturer-class/getActiveSemesterClassList';
import { getOfferedClass } from '~~/composables/api/academic-portal-offered-class/getOfferedClass';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Mata Kuliah Yang Ditawarkan')
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
const appType = ref('')
const LecturerStudyPrograms = ref<GetLecturerStudyProgramListData[]>([])
const selectedLecturerStudyPrograms = ref(<GetLecturerStudyProgramListData>{
  id: "",
  name: "",
  study_level_short_name: "",
  dikti_study_program_type: "",
})
const offeredClasses = ref(<GetOfferedClassData[]>[])
async function getLecturerStudyProgram() {
  try {
    const { response: resp, error: error } = await getLecturerStudyProgramList(1000000, 1, "", "")
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      LecturerStudyPrograms.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function offeredClass() {
  try {
    const { response: resp, error: error } = await getOfferedClass('')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      offeredClasses.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

async function LecturerStudyProgramsOnChange(id: string) {
  selectedLecturerStudyPrograms.value = <GetLecturerStudyProgramListData>LecturerStudyPrograms.value.find((x) => x.id == id)
  await getActiveSemesterClass()
}


const ActiveSemesterClasss = ref(<GetActiveSemesterClassListData[]>[])
// const selectedActiveSemesterClasss = ref(<GetActiveSemesterClassListData>{})
async function getActiveSemesterClass() {
  try {
    if (!selectedLecturerStudyPrograms.value.id) {
      ActiveSemesterClasss.value = []
      return;
    }
    const { response: resp, error: error } = await getActiveSemesterClassList(selectedLecturerStudyPrograms.value.id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      ActiveSemesterClasss.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
onMounted(async () => {
  let user = useAuth()
  appType.value = user.value.app_type
  if (appType.value == 'lecturer') {
    await getLecturerStudyProgram()
  }
  if (appType.value == 'student') {
    await offeredClass()
  }
})
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
        Informasi Mata Kuliah Ditawarkan berisi seluruh Mata Kuliah yang ditawarkan pada semester aktif. Dosen dapat
        melihat
        Mata Kuliah yang ditawarkan oleh program studi lain dengan memilih Sistem Informasi Akademik yang bersesuaian.
        Dari
        seluruh Mata Kuliah yang terdapat pada daftar, setiap Mata Kuliah mempunyai aturan tersendiri bergantung pada
        program studi, kurikulum, dan aturan akademik lainnya. Untuk lebih jelasnya, anda dapat melihat detil kelas.
      </v-alert>
    </v-col>
    <v-row>
      <v-col cols="12">
        <UiParentCard :title="title">
          <v-row v-if="appType == 'lecturer'">
            <v-col cols="12" lg="4" md="6">
              <v-select variant="outlined" hide-details :items="LecturerStudyPrograms" item-value="id" item-title="name"
                label="Program Studi" @update:model-value="(sl: any) => LecturerStudyProgramsOnChange(sl)"></v-select>
            </v-col>
            <!-- <v-col cols="12" lg="6" md="6">
              <v-autocomplete :items="studyPrograms" color="primary" variant="outlined" hide-details
                label="Program Studi"></v-autocomplete>
            </v-col> -->
          </v-row>
          <v-row v-if="appType == 'lecturer'">
            <v-col cols="12" lg="12" md="12" class="text-right">

              <v-btn color="primary" target="_blank" class="ml-2" :disabled="selectedLecturerStudyPrograms.id == ''"
                :to="'/academic-portal/academic/prints/offered-subject/lecturer/' + selectedLecturerStudyPrograms.id + '?studyProgramName=' + selectedLecturerStudyPrograms.name">
                <PrinterIcon stroke-width="1.5" size="20" />
                Cetak Daftar Matakuliah Ditawarkan
              </v-btn>

            </v-col>
          </v-row>
          <v-row v-if="appType == 'student'">
            <v-col cols="12" lg="12" md="12" class="text-right">

              <v-btn color="primary" target="_blank" class="ml-2"
                :to="'/academic-portal/academic/prints/offered-subject/student?studyProgramName=' + selectedLecturerStudyPrograms.name">
                <PrinterIcon stroke-width="1.5" size="20" />
                Cetak Daftar Matakuliah Ditawarkan
              </v-btn>

            </v-col>
          </v-row>
        </UiParentCard>
      </v-col>
    </v-row>
    <v-row v-if="selectedLecturerStudyPrograms.id && appType == 'lecturer'">
      <v-col cols="12" v-for="a in ActiveSemesterClasss">
        <v-expansion-panels>
          <v-expansion-panel :title="'Paket Semester ' + a.semester_package">
            <v-expansion-panel-text>
              <v-table class="mt-5">
                <thead>
                  <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                    <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Dosen</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                    <th class="text-subtitle-1 font-weight-semibold">W/P</th>
                    <th class="text-subtitle-1 font-weight-semibold">SKS</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kuota Kelas</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="c, i in a.classes">
                    <tr v-for="l, j in c.lecturers">

                      <td>{{ i == 0 ? (k = 1) : (k = k + 1) }}</td>
                      <td>{{ c.subject_code }}</td>
                      <td>{{ c.subject_name }}</td>
                      <td>{{ l.front_title + " " + l.name + " " + l.back_degree }}</td>
                      <td>{{ c.name }}</td>
                      <td>{{ c.subject_is_mandatory ? "W" : "P" }}</td>
                      <td>{{ c.subject_theory_credit }}</td>
                      <td>{{ c.maximum_participant }}</td>
                    </tr>
                  </template>

                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" v-for="a in offeredClasses">
        <v-expansion-panels>
          <v-expansion-panel :title="'Paket Semester ' + a.semester_package">
            <v-expansion-panel-text>
              <v-table class="mt-5">
                <thead>
                  <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                    <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Dosen</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                    <th class="text-subtitle-1 font-weight-semibold">W/P</th>
                    <th class="text-subtitle-1 font-weight-semibold">SKS</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kuota Kelas</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="c, i in a.classes">
                    <tr v-for="l, j in c.lecturers">
                      <td>{{ i == 0 ? (k = 1) : (k = k + 1) }}</td>
                      <td>{{ c.subject_code }}</td>
                      <td>{{ c.subject_name }}</td>
                      <td>{{ l.front_title + " " + l.name + " " + l.back_degree }}</td>
                      <td>{{ c.name }}</td>
                      <td>{{ c.subject_is_mandatory ? "W" : "P" }}</td>
                      <td>{{ c.subject_theory_credit }}</td>
                      <td>{{ c.maximum_participant }}</td>
                    </tr>
                  </template>

                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
