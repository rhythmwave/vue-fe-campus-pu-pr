<script setup lang="ts">
import { MailIcon } from "vue-tabler-icons";
// import { profileDD } from "@/_mockApis/headerPortalAcademicsData";
import { GetAcademicPortalLecturerGeneralProfileData } from '~~/types/api/academic-portal-lecturer-general/GetAcademicPortalLecturerGeneralProfile';
import { getAcademicPortalLecturerGeneralProfile } from '~~/composables/api/academic-portal-lecturer-general/getAcademicPortalLecturerGeneralProfile';
import { GetAcademicPortalStudentGeneralProfileData } from '~~/types/api/academic-portal-student-general/GetAcademicPortalStudentGeneralProfile';
import { getAcademicPortalStudentGeneralProfile } from '~~/composables/api/academic-portal-student-general/getAcademicPortalStudentGeneralProfile';
import { ErrorRoot } from "~~/types/api/error";
import { ApiAuthLogout } from "~~/composables/api/auth/useLogout";
import { useStorage, StorageSerializers } from "@vueuse/core";
const loginAs = ref('')
const profileLecturer = ref(<GetAcademicPortalLecturerGeneralProfileData>{
  id: '',
  id_national_lecturer: '',
  name: '',
  front_title: '',
  back_degree: '',
  study_program_id: '',
  study_program_name: '',
  birth_date: '',
  birth_regency_id: 0,
  birth_regency_name: '',
  birth_country_id: 0,
  birth_country_name: '',
  sex: '',
  religion: '',
  address: '',
  regency_id: 0,
  regency_name: '',
  country_id: 0,
  country_name: '',
  postal_code: '',
  phone_number: '',
  fax: '',
  mobile_phone_number: '',
  office_phone_number: '',
  academic_position: '',
  employment_status: '',
  status: '',
})
const profileStudent = ref(<GetAcademicPortalStudentGeneralProfileData>{
  id: '',
  profile_photo_path: '',
  profile_photo_path_type: '',
  profile_photo_url: '',
  name: '',
  sex: '',
  birth_province_id: 0,
  birth_province_name: '',
  birth_regency_id: 0,
  birth_regency_name: '',
  birth_date: '',
  blood_type: '',
  height: 0,
  weight: 0,
  is_color_blind: false,
  use_glasses: false,
  has_complete_teeth: false,
  study_program_id: '',
  study_program_name: '',
  dikti_study_program_type: '',
  study_level_short_name: '',
  admittance_semester: '',
  student_force: 0,
  admittance_test_number: '',
  college_entrance_type: '',
  admittance_date: '',
  admittance_status: '',
  npwp_number: '',
  nisn_number: '',
  religion: '',
  marital_status: '',
  nationality: '',
  province_id: 0,
  province_name: '',
  regency_id: 0,
  regency_name: '',
  district_id: 0,
  district_name: '',
  village_id: 0,
  village_name: '',
  rt: '',
  rw: '',
  postal_code: '',
  address: '',
  phone_number: '',
  mobile_phone_number: '',
  email: '',
  transportation_mean: '',
  is_kps_recipient: false,
  fund_source: '',
  is_scholarship_grantee: false,
  total_brother: 0,
  total_sister: 0,
  work_type: '',
  work_place: '',
  work_address: '',
  assurance_number: '',
  hobby: '',
})
onMounted(async () => {
  const user = useAuth()
  loginAs.value = user.value.app_type
  console.log(loginAs.value)
  if (user.value.app_type == 'lecturer') {
    // await getProfileLecturer()
    let temp = useStorage('lecturerProfile', null, undefined, { serializer: StorageSerializers.object }).value
    profileLecturer.value = temp
  } else if (user.value.app_type == 'student') {
    // await getProfileStudent()
    let temp = useStorage('studentProfile', null, undefined, { serializer: StorageSerializers.object }).value
    profileStudent.value = temp 
  } else {
    return navigateTo({ name: 'login', path: '' })
  }
})
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- notifications DD -->
  <!-- ---------------------------------------------- -->
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn class="custom-hover-primary" variant="text" v-bind="props" icon>
        <v-avatar size="35">
          <img v-if="loginAs == 'lecturer'" :src="'/images/profile/user-1.jpg'" width="35" :alt="profileLecturer.name" />
          <img v-if="loginAs == 'student'"
            :src="profileStudent.profile_photo_url ? profileStudent.profile_photo_url : '/images/profile/user-1.jpg'"
            width="35" :alt="profileStudent.name" />
        </v-avatar>
      </v-btn>
    </template>
    <v-sheet rounded="md" width="360" elevation="10">
      <div class="px-8 pt-6">
        <h6 class="text-h5 font-weight-medium">Profil</h6>
        <div class="d-flex align-center mt-4 pb-6">
          <v-avatar size="80">
            <img v-if="loginAs == 'lecturer'" :src="'/images/profile/user-1.jpg'" width="80"
              :alt="profileLecturer.name" />
            <img v-if="loginAs == 'student'"
              :src="profileStudent.profile_photo_url ? profileStudent.profile_photo_url : '/images/profile/user-1.jpg'"
              width="80" :alt="profileStudent.name" />
          </v-avatar>
          <div class="ml-3">
            <h6 v-if="loginAs == 'lecturer'" class="text-h6 mb-n1">{{ profileLecturer.name }}</h6>
            <h6 v-if="loginAs == 'student'" class="text-h6 mb-n1">{{ profileStudent.name }}</h6>
            <span v-if="loginAs == 'lecturer'" class="text-subtitle-1 font-weight-regular textSecondary">{{
              profileLecturer.academic_position }}</span>
            <span v-if="loginAs == 'student'" class="text-subtitle-1 font-weight-regular textSecondary">{{
              profileStudent.nisn_number }}</span>
            <!-- <div class="d-flex align-center mt-1">
              <MailIcon size="18" />
              <span
                class="text-subtitle-1 font-weight-regular textSecondary ml-2"
                > profile.address </span
              >
            </div> -->
          </div>
        </div>
        <v-divider></v-divider>
      </div>
      <!-- <perfect-scrollbar style="height: calc(100vh - 240px); max-height: 240px"> -->
      <!-- <v-list class="py-0 theme-list" lines="two">
        <v-list-item v-for="item in profileDD" :key="item.title" class="py-4 px-8 custom-text-primary" :to="item.href">
          <template v-slot:prepend>
            <v-avatar size="48" color="lightprimary" class="mr-3" rounded="md">
              <v-img :src="item.avatar" width="24" height="24" :alt="item.avatar" />
            </v-avatar>
          </template>
          <div>
            <h6 class="text-subtitle-1 font-weight-bold mb-2 custom-title">
              {{ item.title }}
            </h6>
          </div>
          <p class="text-subtitle-1 font-weight-regular textSecondary">
            {{ item.subtitle }}
          </p>
        </v-list-item>
      </v-list> -->
      <div class="pt-4 pb-6 px-8 text-center">
        <v-btn color="primary" variant="outlined" @click="ApiAuthLogout();">Logout</v-btn>
      </div>
    </v-sheet>
  </v-menu>
</template>
