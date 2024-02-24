<script setup lang="ts">
import { StudyProgram, StudyProgramDikti, Faculty, Major, GetStudyProgramDiktiRoot, GetFacultyRoot, Lecture } from '@/types/backoffice/backofficeTypes'
import { ErrorEmailRequire } from '~~/utils/helpers/required-input'
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});

const studyPrograms = ref<StudyProgram[] | undefined>()
const studyProgramDikti = ref<StudyProgramDikti[] | undefined>()
const selectedDiktiStudyProgram = ref(<StudyProgramDikti>{});

const faculties = ref<Faculty[]>()
const majors = ref<Major[]>()
const lecturers = ref<Lecture[]>()
const createStudyProgramData = ref({
  id: '',
  dikti_study_program_id: '',
  dikti_study_program_code: '',
  dikti_study_program_name: '',
  dikti_study_program_type: '',
  study_level_short_name: '',
  study_level_name: '',
  name: '',
  english_name: '',
  short_name: '',
  english_short_name: '',
  administrative_unit: '',
  faculty_id: '',
  faculty_name: '',
  major_id: '',
  major_name: '',
  address: '',
  phone_number: '',
  fax: '',
  email: '',
  website: '',
  contact_person: '',
  curiculum_review_frequency: '',
  curiculum_review_method: '',
  establishment_date: '',
  is_active: false,
  start_semester: '',
  operational_permit_number: '',
  operational_permit_date: '',
  operational_permit_due_date: '',
  head_lecturer_id: '',
  head_lecturer_mobile_phone_number: '',
  operator_name: '',
  operator_phone_number: ''
})
const updateStudyProgramData = ref({
  id: '',
  dikti_study_program_id: '',
  dikti_study_program_code: '',
  dikti_study_program_name: '',
  dikti_study_program_type: '',
  study_level_short_name: '',
  study_level_name: '',
  name: '',
  english_name: '',
  short_name: '',
  english_short_name: '',
  administrative_unit: '',
  faculty_id: '',
  faculty_name: '',
  major_id: '',
  major_name: '',
  address: '',
  phone_number: '',
  fax: '',
  email: '',
  website: '',
  contact_person: '',
  curiculum_review_frequency: '',
  curiculum_review_method: '',
  establishment_date: '',
  is_active: false,
  start_semester: '',
  operational_permit_number: '',
  operational_permit_date: '',
  operational_permit_due_date: '',
  head_lecturer_id: '',
  head_lecturer_mobile_phone_number: '',
  operator_name: '',
  operator_phone_number: ''
})
const studyProgram = ref({
  id: '',
  dikti_study_program_id: '',
  dikti_study_program_code: '',
  dikti_study_program_name: '',
  dikti_study_program_type: '',
  study_level_short_name: '',
  study_level_name: '',
  name: '',
  english_name: '',
  short_name: '',
  english_short_name: '',
  administrative_unit: '',
  faculty_id: '',
  faculty_name: '',
  major_id: '',
  major_name: '',
  address: '',
  phone_number: '',
  fax: '',
  email: '',
  website: '',
  contact_person: '',
  curiculum_review_frequency: '',
  curiculum_review_method: '',
  establishment_date: '',
  is_active: false,
  start_semester: '',
  operational_permit_number: '',
  operational_permit_date: '',
  operational_permit_due_date: '',
  head_lecturer_id: '',
  head_lecturer_mobile_phone_number: '',
  operator_name: '',
  operator_phone_number: ''
})
const limit = 20
const pagination = ref({
  page: 1,
  limit,
  prev: 1,
  next: 1,
  total_pages: 1,
  total_records: 0
})
const search = ref('')
const title = ref('Daftar Program Studi')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Daftar Program Studi',
    disabled: true,
    href: '#'
  }
])
const valid = ref(true)
const dialog = ref(false)
const mode = ref('list')
function close() {
  dialog.value = false
  setTimeout(() => {
    studyProgram.value = {
      id: '',
      dikti_study_program_id: '',
      dikti_study_program_code: '',
      dikti_study_program_name: '',
      dikti_study_program_type: '',
      study_level_short_name: '',
      study_level_name: '',
      name: '',
      english_name: '',
      short_name: '',
      english_short_name: '',
      administrative_unit: '',
      faculty_id: '',
      faculty_name: '',
      major_id: '',
      major_name: '',
      address: '',
      phone_number: '',
      fax: '',
      email: '',
      website: '',
      contact_person: '',
      curiculum_review_frequency: '',
      curiculum_review_method: '',
      establishment_date: '',
      is_active: false,
      start_semester: '',
      operational_permit_number: '',
      operational_permit_date: '',
      operational_permit_due_date: '',
      head_lecturer_id: '',
      head_lecturer_mobile_phone_number: '',
      operator_name: '',
      operator_phone_number: ''
    }
  }, 300)
}
async function getData(limit: number, page: number, search: String) {
  try {
    const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_study_program.RootStudyProgramHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
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
    pagination.value =
    {
      next: _resp.value.pagination.next,
      prev: _resp.value.pagination.prev,
      total_pages: _resp.value.pagination.total_pages,
      total_records: _resp.value.pagination.total_records,
      limit: _resp.value.pagination.limit,
      page: _resp.value.pagination.page
    }

    studyPrograms.value = _resp.value.data
  } catch (error) {
    alert(error)

  }
}
async function getDataDikti(limit: number, page: number, search: String) {
  try {
    const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_dikti_study_program.RootDiktiStudyProgramHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
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
    studyProgramDikti.value = _resp.value?.data.map((item: any) => {
        // item.name = item.name + ' (' +item.study_level_short_name + ')'
        return <StudyProgramDikti>{
          id: item.id,
          code: item.code,
          name: item.name + ' (' +item.study_level_short_name + ')',
          study_level_name: item.study_level_name,
          study_level_short_name: item.study_level_short_name,
          alias: item.alias,
        };
    })
  } catch (error) {
    alert(error)
  }

}
async function getDataFaculty(limit: number, page: number, search: String) {
  try {
    const { data: _respDataFaculty, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_faculty.RootFacultyHandler/GetList?limit=1000&page=${page}&search=${search}`, <any>{
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
    faculties.value = _respDataFaculty.value?.data
  } catch (error) {
    alert(error)

  }

}
async function getDataMajors(limit: number, page: number, search: String, faculty_id: String) {
  try {
    const { data: _respDataMajor, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_major.RootMajorHandler/GetList?limit=${limit}&page=${page}&search=${search}&facultyId=${faculty_id}`, <any>{
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
    majors.value = _respDataMajor.value.data
  } catch (error) {
    alert(error)

  }

}
async function getDataLecturers(limit: number, page: number, search: String) {
  try {
    const { data: _respDataLecturer, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_lecturer.RootLecturerHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
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
    lecturers.value = _respDataLecturer.value.data
  } catch (error) {
    alert(error)

  }

}
async function getDetail(id: string) {
  try {
    const { data: _respDetail, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_study_program.RootStudyProgramHandler/GetDetail?id=${id}`, <any>{
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
    studyProgram.value = _respDetail.value.data
  } catch (error) {
    alert(error)

  }
}
async function create() {
  mode.value = 'create'
  await getDataFaculty(20, 1, '')
  createStudyProgramData.value = {
    id: '',
    dikti_study_program_id: '',
    dikti_study_program_code: '',
    dikti_study_program_name: '',
    dikti_study_program_type: '',
    study_level_short_name: '',
    study_level_name: '',
    name: '',
    english_name: '',
    short_name: '',
    english_short_name: '',
    administrative_unit: '',
    faculty_id: '',
    faculty_name: '',
    major_id: '',
    major_name: '',
    address: '',
    phone_number: '',
    fax: '',
    email: '',
    website: '',
    contact_person: '',
    curiculum_review_frequency: '',
    curiculum_review_method: '',
    establishment_date: '',
    is_active: false,
    start_semester: '',
    operational_permit_number: '',
    operational_permit_date: '',
    operational_permit_due_date: '',
    head_lecturer_id: '',
    head_lecturer_mobile_phone_number: '',
    operator_name: '',
    operator_phone_number: ''
  }
  dialog.value = true
}

const labelDikti = ref('')
async function editItem(item: any) {
  mode.value = 'edit'
  dialog.value = true
  await getDataDikti(limit, 1, '')
  // await getDataFaculty(20, 1, '')
  // await getDataMajors(20, 1, '', studyProgram.value.faculty_id)
  // await getDataLecturers(20, 1, '')
  await getDetail(item.id)
  let indexLabelDikti = <number>studyProgramDikti.value?.findIndex(x => x.id === studyProgram.value.dikti_study_program_id)
  labelDikti.value = <string>studyProgramDikti.value?.at(indexLabelDikti)?.name
  updateStudyProgramData.value = Object.assign({}, studyProgram.value);
  updateStudyProgramData.value.establishment_date = updateStudyProgramData.value.establishment_date.substring(0, 10)
  updateStudyProgramData.value.operational_permit_date = updateStudyProgramData.value.operational_permit_date.substring(0, 10)
  updateStudyProgramData.value.operational_permit_due_date = updateStudyProgramData.value.operational_permit_due_date.substring(0, 10)
  selectedDiktiStudyProgram.value = <StudyProgramDikti>{
    id: studyProgram.value.dikti_study_program_id,
    code: studyProgram.value.dikti_study_program_code,
    name: studyProgram.value.dikti_study_program_name,
    study_level_short_name: studyProgram.value.study_level_short_name,
  }

}

function deleteItem(item: any) {
  mode.value = 'delete'
  dialog.value = true
  studyProgram.value = item
}

const checkDate = ref(false)
async function save() {
  if (ErrCheckEmail.value) {
    return false
  }
  let checkdate1 = new Date(createStudyProgramData.value.operational_permit_date)
  let checkdate2 = new Date(createStudyProgramData.value.operational_permit_due_date)
  if (checkdate1 >= checkdate2) {
    checkDate.value = true
  } else {
    checkDate.value = false
  }
  try {
    var createData = Object.assign({}, createStudyProgramData.value);
    if (createData.establishment_date) createData.establishment_date = convertDateWithoutTimeToTimezoned(createData.establishment_date)
    if (createData.operational_permit_date) createData.operational_permit_date = convertDateWithoutTimeToTimezoned(createData.operational_permit_date)
    if (createData.operational_permit_due_date) createData.operational_permit_due_date = convertDateWithoutTimeToTimezoned(createData.operational_permit_due_date)
    const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_study_program.RootStudyProgramHandler/Create`, <any>{
      method: 'POST',
      body: {
        dikti_study_program_id: createData.dikti_study_program_id,
        dikti_study_program_code: createData.dikti_study_program_code,
        dikti_study_program_name: createData.dikti_study_program_name,
        dikti_study_program_type: createData.dikti_study_program_type,
        study_level_short_name: createData.study_level_short_name,
        study_level_name: createData.study_level_name,
        name: createData.name,
        english_name: createData.english_name,
        short_name: createData.short_name,
        english_short_name: createData.english_short_name,
        administrative_unit: createData.administrative_unit,
        faculty_id: createData.faculty_id,
        faculty_name: createData.faculty_name,
        major_id: createData.major_id,
        major_name: createData.major_name,
        address: createData.address,
        phone_number: createData.phone_number,
        fax: createData.fax,
        email: createData.email,
        website: createData.website,
        contact_person: createData.contact_person,
        curiculum_review_frequency: createData.curiculum_review_frequency,
        curiculum_review_method: createData.curiculum_review_method,
        establishment_date: createData.establishment_date,
        is_active: Boolean(Number(createData.is_active)),
        start_semester: createData.start_semester,
        operational_permit_number: createData.operational_permit_number,
        operational_permit_date: createData.operational_permit_date,
        operational_permit_due_date: createData.operational_permit_due_date,
        head_lecturer_id: createData.head_lecturer_id,
        head_lecturer_mobile_phone_number: createData.head_lecturer_mobile_phone_number,
        operator_name: createData.operator_name,
        operator_phone_number: createData.operator_phone_number
      },
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
    close()
    getData(limit, 1, '')
    // return { response: data.value, error: null };
  } catch (error) {
    alert(error)
  }
}
async function update() {
  if (ErrCheckEmail.value) {
    return false
  }
  let checkdate1 = new Date(updateStudyProgramData.value.operational_permit_date)
  let checkdate2 = new Date(updateStudyProgramData.value.operational_permit_due_date)
  if (checkdate1 >= checkdate2) {
    checkDate.value = true
  } else {
    checkDate.value = false
  }
  try {
    var updateData = Object.assign({}, updateStudyProgramData.value);
    if (updateData.establishment_date) updateData.establishment_date = convertDateWithoutTimeToTimezoned(updateData.establishment_date)
    if (updateData.operational_permit_date) updateData.operational_permit_date = convertDateWithoutTimeToTimezoned(updateData.operational_permit_date)
    if (updateData.operational_permit_due_date) updateData.operational_permit_due_date = convertDateWithoutTimeToTimezoned(updateData.operational_permit_due_date)
    const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_study_program.RootStudyProgramHandler/Update`, <any>{
      method: 'PATCH',
      body: {
        id: updateData.id,
        dikti_study_program_id: updateData.dikti_study_program_id,
        dikti_study_program_code: updateData.dikti_study_program_code,
        dikti_study_program_name: updateData.dikti_study_program_name,
        dikti_study_program_type: updateData.dikti_study_program_type,
        study_level_short_name: updateData.study_level_short_name,
        study_level_name: updateData.study_level_name,
        name: updateData.name,
        english_name: updateData.english_name,
        short_name: updateData.short_name,
        english_short_name: updateData.english_short_name,
        administrative_unit: updateData.administrative_unit,
        faculty_id: updateData.faculty_id,
        faculty_name: updateData.faculty_name,
        major_id: updateData.major_id,
        major_name: updateData.major_name,
        address: updateData.address,
        phone_number: updateData.phone_number,
        fax: updateData.fax,
        email: updateData.email,
        website: updateData.website,
        contact_person: updateData.contact_person,
        curiculum_review_frequency: updateData.curiculum_review_frequency,
        curiculum_review_method: updateData.curiculum_review_method,
        establishment_date: updateData.establishment_date,
        is_active: Boolean(Number(updateData.is_active)),
        start_semester: updateData.start_semester,
        operational_permit_number: updateData.operational_permit_number,
        operational_permit_date: updateData.operational_permit_date,
        operational_permit_due_date: updateData.operational_permit_due_date,
        head_lecturer_id: updateData.head_lecturer_id,
        head_lecturer_mobile_phone_number: updateData.head_lecturer_mobile_phone_number,
        operator_name: updateData.operator_name,
        operator_phone_number: updateData.operator_phone_number
      },
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
    close()
    getData(limit, 1, '')
    return { response: data.value, error: null };
  } catch (error) {
    alert(error)

  }
}

// async function changeMajor(event: any) {
//   let labelElement = event.currentTarget.parentNode.getElementsByTagName('label')
//   labelElement[0].setAttribute('class', 'change-label')
//   await getDataLecturers(20, 1, '')
// }

// function changeFrekuensi(event: any){
//   let labelElement = event.currentTarget.parentNode.getElementsByTagName('label')
//   labelElement[0].setAttribute('class', 'change-label')
// }
// function changePeninjauan(event: any){
//   let labelElement = event.currentTarget.parentNode.getElementsByTagName('label')
//   labelElement[0].setAttribute('class', 'change-label')
// }
// function changeStatus(event: any){
//   let labelElement = event.currentTarget.parentNode.getElementsByTagName('label')
//   labelElement[0].setAttribute('class', 'change-label')
// }
// function changeSemester(event: any){
//   let labelElement = event.currentTarget.parentNode.getElementsByTagName('label')
//   labelElement[0].setAttribute('class', 'change-label')
// }
// function changeKaProdi(event: any){
//   let labelElement = event.currentTarget.parentNode.getElementsByTagName('label')
//   labelElement[0].setAttribute('class', 'change-label')
// }
async function deleteData() {
  try {
    const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_study_program.RootStudyProgramHandler/Delete`, <any>{
      method: 'Delete',
      body: {
        id: studyProgram.value.id
      },
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

  close()
  getData(limit, 1, '')
}
const showId = ref('')
const dialogShow = ref(false)
function showItem(id: string) {
  mode.value = 'show'
  showId.value = id
  dialogShow.value = true
}

function closeShow() {
  dialogShow.value = false
}

function formatDate(date: string) {
  let result = date.replace('/', '-')
  result = result.replace(', ', '')
  result = result.replace('.', ':')
  return result + '+0700'
}
const ErrCheckEmail = ref(false)
function checkEmail(email: string) {
  ErrCheckEmail.value = ErrorEmailRequire(email)
}

function getAutocompleteStudyProgramDikti(data: any) {
  console.log("JSON.stringify(data)")
  console.log(JSON.stringify(data))
  if (mode.value == 'create') {
    createStudyProgramData.value.dikti_study_program_id = data.id
    createStudyProgramData.value.study_level_name = data.study_level_name
    createStudyProgramData.value.study_level_short_name = data.study_level_short_name
  } else if (mode.value == 'edit') {
    updateStudyProgramData.value.dikti_study_program_id = data.id
    updateStudyProgramData.value.study_level_name = data.study_level_name
    updateStudyProgramData.value.study_level_short_name = data.study_level_short_name
  }
}

watch(studyProgram, value => {
  if (typeof value.faculty_id !== 'undefined' && value.faculty_id != '') {
    getDataMajors(20, 1, '', studyProgram.value?.faculty_id)
  }
}, { deep: true, immediate: true })

watch(createStudyProgramData, value => {
  if (typeof value.faculty_id !== 'undefined' && value.faculty_id != '') {
    getDataMajors(20, 1, '', createStudyProgramData.value?.faculty_id)
  }
}, { deep: true, immediate: true })
watch(updateStudyProgramData, value => {
  if (typeof value.faculty_id !== 'undefined' && value.faculty_id != '') {
    getDataMajors(20, 1, '', updateStudyProgramData.value?.faculty_id)
  }
}, { deep: true, immediate: true })

function changeOperationPermitDate(event: any) {
  let date = new Date(event.target.value)
  let year = date.getFullYear() + 5
  let splitDate = event.target.value.split("-")
  splitDate[0] = year.toString()
  createStudyProgramData.value.operational_permit_due_date = splitDate.join("-")
  updateStudyProgramData.value.operational_permit_due_date = splitDate.join("-")
}

function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

onMounted(async () => {
  await getDataDikti(limit, 1, '')
  await getData(limit, 1, '')
  await getDataFaculty(limit, 1, '')
  await getDataLecturers(limit, 1, '')
})
</script>

<template>
  <div>
    <div v-if="mode == 'delete'">
      <VCol cols="12" lg="8" md="6" class="text-right">
        <VDialog v-model="dialog" max-width="800">
          <VCard>
            <VCardTitle class="pa-4 bg-secondary">
              <span class="title text-white">hapus program studi {{ studyProgram.name }}</span>
            </VCardTitle>
            <VCardText>
              <VForm ref="form" v-model="valid" lazy-validation>
                <VRow>
                  <VCardActions class="pa-4">
                    <VSpacer />
                    <VBtn color="error" @click="close">
                      Batal
                    </VBtn>
                    <VBtn color="secondary" :disabled="studyProgram.name == ''" @click="deleteData">
                      Hapus
                    </VBtn>
                  </VCardActions>
                </VRow>
              </VForm>
            </VCardText>
          </VCard>
        </VDialog>
      </VCol>
    </div>
    <div v-if="mode == 'create'">
      <VCol cols="12" lg="8" md="6" class="text-right">
        <VDialog v-model="dialog" max-width="800">
          <VCard>
            <VCardTitle class="pa-4 bg-secondary">
              <span class="title text-white">Tambah Program Studi</span>
            </VCardTitle>
            <VCardText>
              <VForm ref="form" v-model="valid" lazy-validation>
                <VRow>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.name" variant="outlined" hide-details label="*Nama" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-autocomplete variant="outlined" hide-details solo flat :label="'*Pilih Rumpun Keilmuan Dikti'" :items="studyProgramDikti" item-value="id" item-title="name" @input="(data: any) => getDataDikti(limit, 1, data.target.value)" @update:model-value="(data : any) => getAutocompleteStudyProgramDikti(data)" return-object>
                      <!-- <template v-slot:selection="{ item }">
                        <span>{{ item.props.title.name }} - {{ item.props.title.study_level_short_name }}</span>
                      </template>
                      <template v-slot:item="{item, props: {onClick, title, value}}">
                        <ul>
                          <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                            <li style="padding: 10px; margin: 2px;" @click="onClick">
                              <span>{{ title.name }} - {{ title.study_level_short_name }}</span>
                            </li>
                          </a>
                        </ul>
                      </template> -->
                    </v-autocomplete>
                    <!-- <Autocomplete @reload="(data: any) => getDataDikti(20, 1, data.search)"
                      :label="'*Pilih Rumpun Keilmuan Dikti'" @selected="(data : any) => getAutocompleteStudyProgramDikti(data)"
                      :options="studyProgramDikti" /> -->

                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.study_level_name" variant="outlined" hide-details
                      label="*Jenjang" :readonly="true" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.study_level_short_name" variant="outlined" hide-details
                      label="Jenjang Singkat" :readonly="true" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.english_name" variant="outlined" hide-details
                      label="Nama Asing" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.short_name" variant="outlined" hide-details
                      label="*Nama Singkat" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.english_short_name" variant="outlined" hide-details
                      label="Nama Asing Singkat" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.administrative_unit" variant="outlined" hide-details
                      label="Satuan Administrasi" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-select v-model="createStudyProgramData.faculty_id" label="*Fakultas" placeholder="*Fakultas"
                      item-value="id" item-title="name" :items="faculties">
                    </v-select>
                  </VCol>
                  <VCol v-if="createStudyProgramData.faculty_id != ''" cols="12" sm="12">
                    <v-select v-model="createStudyProgramData.major_id" label="*Jurusan" placeholder="*Jurusan"
                      item-value="id" item-title="name" :items="majors">
                    </v-select>
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.address" variant="outlined" hide-details
                      label="*Alamat" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field type="number" v-model="createStudyProgramData.phone_number" variant="outlined"
                      hide-details label="*Telepon" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.fax" variant="outlined" hide-details label="Fax" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field @keyup="checkEmail($event.target.value)" v-model="createStudyProgramData.email"
                      variant="outlined" hide-details label="*Email" />
                    <label v-if="ErrCheckEmail"><small style="color: red">email must be a valid email</small></label>
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.website" variant="outlined" hide-details
                      label="Website" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.contact_person" variant="outlined" hide-details
                      label="*Kontak Person" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-select v-model="createStudyProgramData.curiculum_review_frequency"
                      label="Frekuensi Peninjauan Kurikulum" placeholder="Frekuensi Peninjauan Kurikulum" item-value="id"
                      item-title="name" :items="[
                        { id: 'Setiap 1 Tahun', name: 'Setiap 1 Tahun' },
                        { id: 'Setiap 2 Tahun', name: 'Setiap 2 Tahun' },
                        { id: 'Setiap 3 Tahun', name: 'Setiap 3 Tahun' },
                        { id: 'Setiap 4 Tahun', name: 'Setiap 4 Tahun' },
                        { id: 'Sesuai Ketentuan Pemerintah', name: 'Sesuai Ketentuan Pemerintah' },
                        { id: 'Sesuai Kebutuhan', name: 'Sesuai Kebutuhan' },
                      ]">
                    </v-select>
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-select v-model="createStudyProgramData.curiculum_review_method"
                      label="Pelaksanaan Peninjauan Kurikulum" placeholder="Pelaksanaan Peninjauan Kurikulum"
                      item-value="id" item-title="name" :items="[
                        { id: 'Oleh P.S. Sendiri', name: 'Oleh P.S. Sendiri' },
                        { id: 'Bersama Tim Dalam Perguruan Tinggi', name: 'Bersama Tim Dalam Perguruan Tinggi' },
                        { id: 'Orientasi Perguruan Tinggi Lain', name: 'Orientasi Perguruan Tinggi Lain' },
                        { id: 'Orientasi Kebutuhan Pasar', name: 'Orientasi Kebutuhan Pasar' },
                        { id: 'Bersama Stakeholder', name: 'Bersama Stakeholder' },
                      ]">
                    </v-select>
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.establishment_date" type="date" variant="outlined"
                      hide-details label="*Tanggal Berdiri" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-select v-model="createStudyProgramData.is_active" label="Status" placeholder="Status"
                      item-value="id" item-title="name" :items="[
                        { id: true, name: 'Aktif' },
                        { id: false, name: 'Hapus' },
                      ]">
                    </v-select>
                  </VCol>
                  <VCol cols="12" sm="12">
                    <!-- <v-text-field v-model="createStudyProgramData.start_semester" type="date" variant="outlined"
                          hide-details label="Semester Mulai" /> -->
                    <v-select v-model="createStudyProgramData.start_semester" label="Semester Mulai"
                      placeholder="Semester Mulai" item-value="id" item-title="name" :items="[
                        { id: new Date().getFullYear() - 5+'-1', name: new Date().getFullYear() - 5+'-1' },
                        { id: new Date().getFullYear() - 5+'-2', name: new Date().getFullYear() - 5+'-2' },
                        { id: new Date().getFullYear() - 4+'-1', name: new Date().getFullYear() - 4+'-1' },
                        { id: new Date().getFullYear() - 4+'-2', name: new Date().getFullYear() - 4+'-2' },
                        { id: new Date().getFullYear() - 3+'-1', name: new Date().getFullYear() - 3+'-1' },
                        { id: new Date().getFullYear() - 3+'-2', name: new Date().getFullYear() - 3+'-2' },
                        { id: new Date().getFullYear() - 2+'-1', name: new Date().getFullYear() - 2+'-1' },
                        { id: new Date().getFullYear() - 2+'-2', name: new Date().getFullYear() - 2+'-2' },
                        { id: new Date().getFullYear() - 1+'-1', name: new Date().getFullYear() - 1+'-1' },
                        { id: new Date().getFullYear() - 1+'-2', name: new Date().getFullYear() - 1+'-2' },
                        { id: new Date().getFullYear()+'-1', name: new Date().getFullYear()+'-1' },
                        { id: new Date().getFullYear()+'-2', name: new Date().getFullYear()+'-2' },
                        { id: new Date().getFullYear()+1+'-1', name: new Date().getFullYear()+1+'-1' },
                        { id: new Date().getFullYear()+1+'-2', name: new Date().getFullYear()+1+'-2' },
                        { id: new Date().getFullYear()+2+'-1', name: new Date().getFullYear()+2+'-1' },
                        { id: new Date().getFullYear()+2+'-2', name: new Date().getFullYear()+2+'-2' },
                        { id: new Date().getFullYear()+3+'-1', name: new Date().getFullYear()+3+'-1' },
                        { id: new Date().getFullYear()+3+'-2', name: new Date().getFullYear()+3+'-2' },
                        { id: new Date().getFullYear()+4+'-1', name: new Date().getFullYear()+4+'-1' },
                        { id: new Date().getFullYear()+4+'-2', name: new Date().getFullYear()+4+'-2' },
                        { id: new Date().getFullYear()+5+'-1', name: new Date().getFullYear()+5+'-1' },
                        { id: new Date().getFullYear()+5+'-2', name: new Date().getFullYear()+5+'-2' },
                      ]" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.operational_permit_number" variant="outlined"
                      hide-details label="No. S.K. (Surat Keputusan) Izin operasional Dikti (terakhir)" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field onselect="changeOperationPermitDate($event)" @change="changeOperationPermitDate($event)"
                      v-model="createStudyProgramData.operational_permit_date" type="date" variant="outlined" hide-details
                      label="*Tanggal S.K. (Surat Keputusan) Izin operasional Dikti" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field type="date" v-model="createStudyProgramData.operational_permit_due_date"
                      variant="outlined" hide-details
                      label="*Tanggal batas akhir berlaku S.K. (Surat Keputusan) Izin operasional Dikti" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-select v-model="createStudyProgramData.head_lecturer_id" label="Kepala Prodi"
                      placeholder="Kepala Prodi" item-value="id" item-title="name" :items="lecturers">
                    </v-select>
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field type="number" v-model="createStudyProgramData.head_lecturer_mobile_phone_number"
                      variant="outlined" hide-details label="No Telepon KA Prodi" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="createStudyProgramData.operator_name" variant="outlined" hide-details
                      label="Nama Operator" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field type="number" v-model="createStudyProgramData.operator_phone_number" variant="outlined"
                      hide-details label="Telepon Operator" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <label v-if="checkDate" style="color: red">tanggal SK tidak boleh lebih kecil dari tanggal habis
                      SK</label>
                  </VCol>
                  <VCardActions class="pa-4">
                    <VSpacer />
                    <VBtn color="error" @click="close">
                      Batal
                    </VBtn>
                    <VBtn color="secondary" :disabled="
                      createStudyProgramData.major_id == '' ||
                      createStudyProgramData.dikti_study_program_id == '' ||
                      createStudyProgramData.name == '' ||
                      createStudyProgramData.short_name == '' ||
                      createStudyProgramData.address == '' ||
                      createStudyProgramData.phone_number == '' ||
                      createStudyProgramData.email == '' ||
                      createStudyProgramData.contact_person == '' ||
                      createStudyProgramData.establishment_date == '' ||
                      createStudyProgramData.operational_permit_date == '' ||
                      createStudyProgramData.operational_permit_due_date == ''
                    " @click="save()">
                      Simpan
                    </VBtn>
                  </VCardActions>
                </VRow>
              </VForm>
            </VCardText>
          </VCard>
        </VDialog>
      </VCol>
    </div>
    <div v-if="mode == 'edit'">
      <VCol cols="12" lg="8" md="6" class="text-right">
        <VDialog v-model="dialog" max-width="800">
          <VCard>
            <VCardTitle class="pa-4 bg-secondary">
              <span class="title text-white">Ubah Program Studi</span>
            </VCardTitle>
            <VCardText>
              <VForm ref="form" v-model="valid" lazy-validation>
                <VRow>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.name" variant="outlined" hide-details label="*Nama" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-autocomplete variant="outlined" hide-details solo flat :label="labelDikti" :items="studyProgramDikti" item-value="id" item-title="name" @input="(data: any) => getDataDikti(limit, 1, data.target.value)" @update:model-value="(data : any) => getAutocompleteStudyProgramDikti(data)" return-object></v-autocomplete>
                    <!-- <Autocomplete @reload="(data: any) => getDataDikti(20, 1, data.search)" :label="labelDikti"
                      :initSelected="selectedDiktiStudyProgram" :options="studyProgramDikti"
                      @selected="(data: any) => getAutocompleteStudyProgramDikti(data)" /> -->
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.study_level_name" variant="outlined" hide-details
                      label="*Jenjang" :readonly="true" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.study_level_short_name" variant="outlined" hide-details
                      label="Jenjang Singkat" :readonly="true" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.english_name" variant="outlined" hide-details
                      label="Nama Asing" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.short_name" variant="outlined" hide-details
                      label="*Nama Singkat" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.english_short_name" variant="outlined" hide-details
                      label="Nama Asing Singkat" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.administrative_unit" variant="outlined" hide-details
                      label="Satuan Administrasi" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-select v-model="updateStudyProgramData.faculty_id" label="*Fakultas" placeholder="*Fakultas"
                      item-value="id" item-title="name" :items="faculties">
                    </v-select>
                  </VCol>
                  <VCol v-if="updateStudyProgramData.faculty_id != ''" cols="12" sm="12">
                    <v-select v-model="updateStudyProgramData.major_id" label="*Jurusan" placeholder="*Jurusan"
                      item-value="id" item-title="name" :items="majors">
                    </v-select>
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.address" variant="outlined" hide-details
                      label="*Alamat" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field type="number" v-model="updateStudyProgramData.phone_number" variant="outlined"
                      hide-details label="*Telepon" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.fax" variant="outlined" hide-details label="Fax" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field @keyup="checkEmail($event.target.value)" v-model="updateStudyProgramData.email"
                      variant="outlined" hide-details label="*Email" />
                    <label v-if="ErrCheckEmail"><small style="color: red">email must be a valid email</small></label>
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.website" variant="outlined" hide-details
                      label="Website" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.contact_person" variant="outlined" hide-details
                      label="*Kontak Person" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-select v-model="updateStudyProgramData.curiculum_review_frequency"
                      label="Frekuensi Peninjauan Kurikulum" placeholder="Frekuensi Peninjauan Kurikulum" item-value="id"
                      item-title="name" :items="[
                        { id: 'Setiap 1 Tahun', name: 'Setiap 1 Tahun' },
                        { id: 'Setiap 2 Tahun', name: 'Setiap 2 Tahun' },
                        { id: 'Setiap 3 Tahun', name: 'Setiap 3 Tahun' },
                        { id: 'Setiap 4 Tahun', name: 'Setiap 4 Tahun' },
                        { id: 'Sesuai Ketentuan Pemerintah', name: 'Sesuai Ketentuan Pemerintah' },
                        { id: 'Sesuai Kebutuhan', name: 'Sesuai Kebutuhan' },
                      ]">
                    </v-select>
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-select v-model="updateStudyProgramData.curiculum_review_method"
                      label="Pelaksanaan Peninjauan Kurikulum" placeholder="Pelaksanaan Peninjauan Kurikulum"
                      item-value="id" item-title="name" :items="[
                        { id: 'Oleh P.S. Sendiri', name: 'Oleh P.S. Sendiri' },
                        { id: 'Bersama Tim Dalam Perguruan Tinggi', name: 'Bersama Tim Dalam Perguruan Tinggi' },
                        { id: 'Orientasi Perguruan Tinggi Lain', name: 'Orientasi Perguruan Tinggi Lain' },
                        { id: 'Orientasi Kebutuhan Pasar', name: 'Orientasi Kebutuhan Pasar' },
                        { id: 'Bersama Stakeholder', name: 'Bersama Stakeholder' },
                      ]">
                    </v-select>
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.establishment_date" type="date" variant="outlined"
                      hide-details label="*Tanggal Berdiri" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-select v-model="updateStudyProgramData.is_active" label="Status" placeholder="Status"
                      item-value="id" item-title="name" :items="[
                        { id: true, name: 'Aktif' },
                        { id: false, name: 'Hapus' },
                      ]">
                    </v-select>
                  </VCol>
                  <v-col cols="12" sm="12">
                    <v-select v-model="updateStudyProgramData.start_semester" label="Semester Mulai"
                      placeholder="Semester Mulai" item-value="id" item-title="name" :items="[
                        { id: new Date().getFullYear() - 5+'-1', name: new Date().getFullYear() - 5+'-1' },
                        { id: new Date().getFullYear() - 5+'-2', name: new Date().getFullYear() - 5+'-2' },
                        { id: new Date().getFullYear() - 4+'-1', name: new Date().getFullYear() - 4+'-1' },
                        { id: new Date().getFullYear() - 4+'-2', name: new Date().getFullYear() - 4+'-2' },
                        { id: new Date().getFullYear() - 3+'-1', name: new Date().getFullYear() - 3+'-1' },
                        { id: new Date().getFullYear() - 3+'-2', name: new Date().getFullYear() - 3+'-2' },
                        { id: new Date().getFullYear() - 2+'-1', name: new Date().getFullYear() - 2+'-1' },
                        { id: new Date().getFullYear() - 2+'-2', name: new Date().getFullYear() - 2+'-2' },
                        { id: new Date().getFullYear() - 1+'-1', name: new Date().getFullYear() - 1+'-1' },
                        { id: new Date().getFullYear() - 1+'-2', name: new Date().getFullYear() - 1+'-2' },
                        { id: new Date().getFullYear()+'-1', name: new Date().getFullYear()+'-1' },
                        { id: new Date().getFullYear()+'-2', name: new Date().getFullYear()+'-2' },
                        { id: new Date().getFullYear()+1+'-1', name: new Date().getFullYear()+1+'-1' },
                        { id: new Date().getFullYear()+1+'-2', name: new Date().getFullYear()+1+'-2' },
                        { id: new Date().getFullYear()+2+'-1', name: new Date().getFullYear()+2+'-1' },
                        { id: new Date().getFullYear()+2+'-2', name: new Date().getFullYear()+2+'-2' },
                        { id: new Date().getFullYear()+3+'-1', name: new Date().getFullYear()+3+'-1' },
                        { id: new Date().getFullYear()+3+'-2', name: new Date().getFullYear()+3+'-2' },
                        { id: new Date().getFullYear()+4+'-1', name: new Date().getFullYear()+4+'-1' },
                        { id: new Date().getFullYear()+4+'-2', name: new Date().getFullYear()+4+'-2' },
                        { id: new Date().getFullYear()+5+'-1', name: new Date().getFullYear()+5+'-1' },
                        { id: new Date().getFullYear()+5+'-2', name: new Date().getFullYear()+5+'-2' },
                      ]" />
                  </v-col>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.operational_permit_number" variant="outlined"
                      hide-details label="No. S.K. (Surat Keputusan) Izin operasional Dikti (terakhir)" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field onselect="changeOperationPermitDate($event)" @change="changeOperationPermitDate($event)"
                      v-model="updateStudyProgramData.operational_permit_date" type="date" variant="outlined" hide-details
                      label="*Tanggal S.K. (Surat Keputusan) Izin operasional Dikti" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field type="date" v-model="updateStudyProgramData.operational_permit_due_date"
                      variant="outlined" hide-details
                      label="*Tanggal batas akhir berlaku S.K. (Surat Keputusan) Izin operasional Dikti" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-select v-model="updateStudyProgramData.head_lecturer_id" label="Kepala Prodi"
                      placeholder="Kepala Prodi" item-value="id" item-title="name" :items="lecturers">
                    </v-select>
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field type="number" v-model="updateStudyProgramData.head_lecturer_mobile_phone_number"
                      variant="outlined" hide-details label="No Telepon KA Prodi" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field v-model="updateStudyProgramData.operator_name" variant="outlined" hide-details
                      label="Nama Operator" />
                  </VCol>
                  <VCol cols="12" sm="12">
                    <v-text-field type="number" v-model="updateStudyProgramData.operator_phone_number" variant="outlined"
                      hide-details label="Telepon Operator" />
                  </VCol>
                  <VCardActions class="pa-4">
                    <VSpacer />
                    <VBtn color="error" @click="close">
                      Batal
                    </VBtn>
                    <VBtn color="secondary" :disabled="
                      updateStudyProgramData.major_id == '' ||
                      updateStudyProgramData.dikti_study_program_id == '' ||
                      updateStudyProgramData.name == '' ||
                      updateStudyProgramData.short_name == '' ||
                      updateStudyProgramData.address == '' ||
                      updateStudyProgramData.phone_number == '' ||
                      updateStudyProgramData.email == '' ||
                      updateStudyProgramData.contact_person == '' ||
                      updateStudyProgramData.establishment_date == '' ||
                      updateStudyProgramData.operational_permit_date == '' ||
                      updateStudyProgramData.operational_permit_due_date == ''
                    " @click="update()">
                      Ubah
                    </VBtn>
                  </VCardActions>
                </VRow>
              </VForm>
            </VCardText>
          </VCard>
        </VDialog>
      </VCol>
    </div>
    <div v-if="mode == 'show'">
      <VCol cols="12" lg="8" md="6" class="text-right">
        <VDialog v-model="dialogShow" max-width="800">
          <PagesStudyProgramsDetail :id="showId" />
        </VDialog>
      </VCol>
    </div>
    <SharedBackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs" />
    <SharedUiParentCard title="Program Studi">
      <VCol cols="12" lg="4" md="6" class="float-left">
        <v-text-field density="compact" label="Pencarian Prodi" hide-details variant="outlined"
          @input="getData(limit, pagination.page, $event.target.value)" />
      </VCol>
      <VCol cols="12" lg="8" md="6" class="text-right">
        <VBtn color="primary" flat class="ml-auto" @click="create()">
          <VIcon class="mr-2">
            mdi-account-multiple-plus
          </VIcon>Tambah Program Studi
        </VBtn>
      </VCol>
    </SharedUiParentCard>
    <VTable class="mt-5">
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">
            No
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Program Studi
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Jenjang
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Tipe
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item, index in studyPrograms" :key="item.id">
          <td class="text-subtitle-1">
            {{ index + 1 }}
          </td>
          <td class="text-subtitle-1">
            {{ item.name }}
          </td>
          <td class="text-subtitle-1">
            {{ item.study_level_short_name }}
          </td>
          <td class="text-subtitle-1">
            {{ item.dikti_study_program_type }}
          </td>
          <td>
            <div class="d-flex align-center">
              <VTooltip text="Detail">
                <template #activator="{ props }">
                  <VBtn icon flat v-bind="props" @click="showItem(item.id)">
                    <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                  </VBtn>
                </template>
              </VTooltip>
              <VTooltip text="Ubah">
                <template #activator="{ props }">
                  <VBtn icon flat v-bind="props" @click="editItem(item)">
                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                  </VBtn>
                </template>
              </VTooltip>
              <VTooltip text="Hapus">
                <template #activator="{ props }">
                  <VBtn icon flat v-bind="props" @click="deleteItem(item)">
                    <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                  </VBtn>
                </template>
              </VTooltip>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">
            <!-- <TablePagination func_get_data="studyPrograms" :limit="limit" :page="page" :search="search" :total_pages="pagination.total_pages" :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"  /> -->
          </td>
        </tr>
      </tfoot>
    </VTable>
  </div>
</template>
<style>
.label {
  position: absolute;
  font-size: 14px;
  padding: 10px;
  z-index: -1;
}

.change-label {
  display: none;
}

.input-group .select2-container {
  height: 37px;
}

.input-group .select2-container .selection .select2-selection--single {
  height: 100%;
}

.input-group .my-control {
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
}

.select2-search__field {
  z-index: 9999;
}

.select2-container.select2-container--default.select2-container--open {
  z-index: 9999;
}
</style>