<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerAcademicGuidanceListData } from '~~/types/api/lecturer-academic-guidance/GetLecturerAcademicGuidanceList';
import { getLecturerAcademicGuidanceList } from '~~/composables/api/lecturer-academic-guidance/getLecturerAcademicGuidanceList';
import page from 'nuxt/dist/pages/runtime/page';
import { getLecturerSemesterList } from '~~/composables/api/lecturer-semester/getLecturerSemesterList';
import { GetLecturerSemesterListData } from '~~/types/api/lecturer-semester/GetLecturerSemesterList';

import moment from 'moment';
import { deleteLecturerAcademicGuidance } from '~~/composables/api/lecturer-academic-guidance/deleteLecturerAcademicGuidance';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Bimbingan Akademik')
const mode = ref('list')
const showMode = ref(true)
const valid = ref(true)
const dialog = ref(false)
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogDelete = ref(false)
const dialogShow = ref(false)
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
  showMode.value = true
}

onMounted(async () => {
  await getLecturerSemesterData()
})

const lecturerAcademicGuidances = ref<GetLecturerAcademicGuidanceListData[]>([])
async function getLecturerAcademicGuidanceData() {
  try {
    const { response: resp, error: error } = await getLecturerAcademicGuidanceList(selectedLecturerSemester.value.id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lecturerAcademicGuidances.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

const lecturerSemesters = ref<GetLecturerSemesterListData[]>([])
const selectedLecturerSemester = ref(<GetLecturerSemesterListData>{});
async function getLecturerSemesterData() {
  try {
    const { response: resp, error: error } = await getLecturerSemesterList(100000, 1, '')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lecturerSemesters.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function lecturerSemesterOnChange(id: any) {
  selectedLecturerSemester.value = lecturerSemesters.value.filter((x) => { return x.id == id })[0]
  await getLecturerAcademicGuidanceData()
}


const detailData = ref(<GetLecturerAcademicGuidanceListData>{
})
function showSummary(data: GetLecturerAcademicGuidanceListData) {
  mode.value = 'showSummary'
  detailData.value = data
  dialogShow.value = true
}
function showStudents(data: GetLecturerAcademicGuidanceListData) {
  mode.value = 'showStudents'
  detailData.value = data
  dialogShow.value = true
}
function showFiles(data: GetLecturerAcademicGuidanceListData) {
  mode.value = 'showFiles'
  detailData.value = data
  dialogShow.value = true
}

const updateLecturerAcademicGuidanceId = ref('')
const updateData = ref(<GetLecturerAcademicGuidanceListData>{
})

function editItem(data: GetLecturerAcademicGuidanceListData) {
  mode.value = 'update'
  updateData.value = data
  dialogUpdate.value = true
}

function closeUpdate() {
  dialogUpdate.value = false
  setTimeout(() => {
    updateLecturerAcademicGuidanceId.value = ""
  }, 300)
}


const deletedData = ref(<GetLecturerAcademicGuidanceListData>{})

function deleteItem(data: GetLecturerAcademicGuidanceListData) {
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
    const { response: deleteResponse, error } = await deleteLecturerAcademicGuidance(deletedData.value)
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
  getLecturerAcademicGuidanceData()
}

function create() {
  mode.value = 'create'
  dialogCreate.value = true
}
function closeCreate() {
  dialogCreate.value = false
}

function MouseOver(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
</script>
<template>
  <v-col cols="12">
    <div v-if="mode == 'showStudents'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogShow" max-width="800">
          <PagesAcademicPortalLecturerAcademicGuidanceStudent :getLecturerAcademicGuidanceListData="detailData" />
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'showSummary'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogShow" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Ringkasan</span>
            </v-card-title>
            <v-row style="min-height: 400px;">
              <v-col :cols="12">
                <div class="pa-3">
                  {{ detailData.summary }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'showFiles'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogShow" max-width="800">
          <PagesAcademicPortalLecturerAcademicGuidanceFile :getLecturerAcademicGuidanceListData="detailData" />
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'create'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogCreate" max-width="800">
          <PagesAcademicPortalLecturerAcademicGuidanceCreate @reload="getLecturerAcademicGuidanceData()"
            @close="closeCreate()" :semesterId="selectedLecturerSemester.id" />
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'update'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogUpdate" max-width="800">
          <PagesAcademicPortalLecturerAcademicGuidanceUpdate @reload="getLecturerAcademicGuidanceData()"
            @close="closeUpdate()" :semesterId="selectedLecturerSemester.id"
            :getLecturerAcademicGuidanceListData="updateData" />
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'delete'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogDelete" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Hapus Bimbingan Akademik</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <h5>Semester</h5>
                </v-row>
                <v-row>
                  <div>{{ selectedLecturerSemester.semester_type }} {{ selectedLecturerSemester.school_year }}</div>
                </v-row>
                <v-row>
                  <h5>Matakuliah</h5>
                </v-row>
                <v-row>
                  <div>{{ deletedData.subject }}</div>
                </v-row>


                <v-col class="text-right">
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="error" @click="closeDelete()">
                      Batal
                    </v-btn>
                    <v-btn color="secondary" :disabled="deletedData.id == ''" @click="deleteItm()">
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
    <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
  </v-col>
  <v-col cols="12">
    <v-alert type="info" variant="tonal">
      Keterangan :
      <br />
      Bimbingan Akademik berisi daftar mahasiswa yang merupakan mahasiswa bimbingan dari dosen pengguna. Dari menu ini
      dosen dapat melihat kartu rencana studi (KRS), kartu hasil studi (KHS), riwayat nilai, serta profil mahasiswa.
    </v-alert>
  </v-col>
  <v-row>
    <v-col cols="12">
      <UiParentCard :title="'Pilih ' + title">
        <v-row>
          <v-col cols="12" lg="6" md="6">
            <v-select item-value="id" variant="outlined" hide-details :items="lecturerSemesters" label="Pilih Semester"
              @update:model-value="(sl: any) => lecturerSemesterOnChange(sl)">
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
          <!-- <v-col cols="12" lg="6" md="6">
            <VBtn title="Detil" icon flat @click="show()">
              <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
            </VBtn>
          </v-col> -->
        </v-row>

        <v-col cols="12" lg="6" md="6" class="text-right">
          <v-btn color="primary" flat class="ml-auto" @click="create()" :disabled="!selectedLecturerSemester.id">
            <v-icon class="mr-2">
              mdi-account-multiple-plus
            </v-icon>Tambah Bimbingan Akademik
          </v-btn>
        </v-col>
      </UiParentCard>
    </v-col>
  </v-row>
  <v-table class="mt-5" v-if="showMode">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
        <th class="text-subtitle-1 font-weight-semibold">Sesi</th>
        <th class="text-subtitle-1 font-weight-semibold" width="250">Ringkasan</th>
        <th class="text-subtitle-1 font-weight-semibold">Files</th>
        <th class="text-subtitle-1 font-weight-semibold">Jumlah</th>
        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="ag, index in lecturerAcademicGuidances">
        <td>{{ index + 1 }}</td>
        <td>{{ ag.subject }}</td>
        <td>{{ moment(new Date(ag.session_date)).format("DD MMM YYYY") }}</td>
        <td><a href="#" v-on:click.prevent="showSummary(ag)">{{ ag.summary.length > 20 ? ag.summary.substring(0, 20) + '...' : ag.summary }}</a></td>
        <td><a href="#" v-on:click.prevent="showFiles(ag)">{{ ag.files.length }} file</a></td>
        <td><a href="#" v-on:click.prevent="showStudents(ag)">{{ ag.students.length }} orang</a></td>
        <td>
          <!-- <v-tooltip text="Detail">
            <template #activator="{ props }">
              <v-btn icon flat v-bind="props" @click="showItem(ag)">
                <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
              </v-btn>
            </template>
          </v-tooltip> -->
          <v-tooltip text="Ubah">
            <template #activator="{ props }">
              <v-btn icon flat v-bind="props" @click="editItem(ag)">
                <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="Hapus">
            <template #activator="{ props }">
              <v-btn icon flat v-bind="props" @click="deleteItem(ag)">
                <TrashIcon stroke-width="1.5" size="20" class="text-error" />
              </v-btn>
            </template>
          </v-tooltip>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
