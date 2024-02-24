<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import { ApiAuthLogin } from '~~/composables/api/auth/useLogin';
import { LoginRequest } from '~~/types/api/auth/Login';
import { getAcademicPortalStudentGeneralProfile } from '~~/composables/api/academic-portal-student-general/getAcademicPortalStudentGeneralProfile';
import { getAcademicPortalLecturerGeneralProfile } from '~~/composables/api/academic-portal-lecturer-general/getAcademicPortalLecturerGeneralProfile';
import { StorageSerializers, useStorage } from '@vueuse/core'
import { ErrorRoot } from '~~/types/api/error';
import { GetSsoAuthData } from '~~/types/api/auth/GetSsoAuth';
import { getSsoAuth } from '~~/composables/api/auth/getSsoAuth';
import { loginWithSso } from '~~/composables/api/auth/loginWithSso';
import { LoginWithSsoRequest } from '~~/types/api/auth/LoginWithSso';


const props = defineProps({
  get_sso_auth: Array as any
});

onMounted(async () => {
  await getSsoAuthData()
  let uri = window.location.search.substring(1);
  let params = new URLSearchParams(uri);
  let ssoCode = params.get("sso_code")
  let username = params.get("username")
  // console.log('ssoCode && username')
  // console.log(ssoCode + '&&' + username)
  // console.log(ssoCode && username)
  if (ssoCode && username) {
    // call api login with sso
    execLoginSso(username, ssoCode)
  }
})

const getSSoAuths = ref(<GetSsoAuthData>{})
async function getSsoAuthData() {
  try {
    const { response: resp, error: error } = await getSsoAuth()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      getSSoAuths.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}


/* Social icons */
const router = useRouter()
const checkbox = ref(false)
const password = ref('')
const username = ref('')
const errorMessage = ref('')
const passwordRules = ref([
  (v: string) => !!v || 'Password is required',
  (v: string) =>
    (v && v.length <= 10) || 'Password must be less than 10 characters'
])
const usernameRules = ref([
  (v: string) => !!v || 'E-mail is required',
  // (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
])

function validate() {
  errorMessage.value = "";
  // router.push({ path: '/backoffice' })
  execLogin();
}


async function execLoginSso(username: string, ssoCode: string) {
  let request = <LoginWithSsoRequest>{
    username: username,
    sso_code: ssoCode,
  }
  var result = await loginWithSso(
    request,
  );
  
  if (result.response!.meta.status == 200) {
    if (result.response!.data.app_type == "root") {
      router.push({ path: '/backoffice' })
    } else if (result.response!.data.app_type == "admin") {
      router.push({ path: '/backoffice/study-program/study-program-management' })
    } else if (result.response!.data.app_type == "lecturer") {
      // router.push({ path: '/academic-portal' })
      getProfileLecturer()
    } else if (result.response!.data.app_type == "student") {
      getProfileStudent()
    }
  } else {
    errorMessage.value = "(code: " + result.response!.meta.code + ") " + result.response!.meta.message;
  }
}

async function execLogin() {
  let request = <LoginRequest>{
    username: username.value,
    password: password.value,
  }
  var result = await ApiAuthLogin(
    request,
  );

  if (result.meta.status == 200) {
    if (result.data.app_type == "root") {
      router.push({ path: '/backoffice' })
    } else if (result.data.app_type == "admin") {
      router.push({ path: '/backoffice/study-program/study-program-management' })
    } else if (result.data.app_type == "lecturer") {
      // router.push({ path: '/academic-portal' })
      getProfileLecturer()
    } else if (result.data.app_type == "student") {
      getProfileStudent()
    }
  } else {
    errorMessage.value = "(code: " + result.meta.code + ") " + result.meta.message;
  }
}

async function getProfileStudent() {
  try {
    const { response: resp, error: error } = await getAcademicPortalStudentGeneralProfile()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      useStorage('studentProfile', null, undefined, { serializer: StorageSerializers.object }).value = resp?.data
      router.push({ path: '/academic-portal' })
      // profileStudent.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

async function getProfileLecturer() {
  try {
    const { response: resp, error: error } = await getAcademicPortalLecturerGeneralProfile()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      useStorage('lecturerProfile', null, undefined, { serializer: StorageSerializers.object }).value = resp?.data
      router.push({ path: '/academic-portal' })
      // profileLecturer.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

function showPassword(show: boolean) {
  if (show) {
    document.getElementById('show_password')?.setAttribute('type', 'text')
  } else {
    document.getElementById('show_password')?.setAttribute('type', 'password')
  }
}

</script>

<template>
  <v-alert v-if="errorMessage" class="mb-3 " color="error" variant="tonal">{{ errorMessage }}</v-alert>
  <v-row class="d-flex mb-3">
    <!-- <v-col cols="6" sm="6" class="pr-2">
          <v-btn
            variant="outlined"
            size="large"
            class="border text-subtitle-1"
            block
          >
            <img :src="google" height="16" class="mr-2" alt="google" />
            <span class="d-sm-flex d-none mr-1">Sign in with</span>Google
          </v-btn>
        </v-col> -->
    <!-- <v-col cols="6" sm="6" class="pl-2">
          <v-btn
            variant="outlined"
            size="large"
            class="border text-subtitle-1"
            block
          >
            <img
              :src="facebook"
              width="25"
              height="25"
              class="mr-1"
              alt="facebook"
            />
            <span class="d-sm-flex d-none mr-1">Sign in with</span>FB
          </v-btn>
        </v-col> -->
  </v-row>
  <div class="d-flex align-center text-center mb-6">
    <!-- <div
          class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative"
        >
          <span class="bg-surface px-5 py-3 position-relative">or sign in with</span
          >
        </div> -->
  </div>
  <Form v-slot="{ errors, isSubmitting }" class="mt-5" @submit="validate">
    <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">
      Username
    </v-label>
    <VTextField v-model="username" :rules="usernameRules" class="mb-8" required hide-details="auto" />
    <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">
      Password
    </v-label>
    <VTextField id="show_password" v-model="password" :rules="passwordRules" required hide-details="auto" type="password"
      class="pwdInput">
      <v-btn icon="mdi-eye" style="height: 25px; width: 25px; position: absolute; right: 20px;"
        @mousedown="showPassword(true)" @mouseup="showPassword(false)"></v-btn>
    </VTextField>
    <!-- <div class="d-flex flex-wrap align-center my-3 ml-n2">
      <v-checkbox v-model="checkbox" :rules="[(v: any) => !!v || 'You must agree to continue!']" required hide-details
        color="primary">
        <template #label>
          Biarkan Tetap Masuk
        </template>
      </v-checkbox>&nbsp;
      <div class="ml-sm-auto">
        <NuxtLink to="" class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium">
          Lupa Password ?
        </NuxtLink>
      </div>
    </div> -->
    <br />
    <v-btn size="large" :loading="isSubmitting" color="primary" :disabled="!password" block type="submit" flat>
      Masuk
    </v-btn>
    <br />
    <NuxtLink :href="getSSoAuths.url + '?app_id=' + getSSoAuths.app_id + '&redirect_uri=' + getSSoAuths.frontend_url">
      <!-- <NuxtLink :href="getSSoAuths.url + '?app_id=' + getSSoAuths.app_id + '&redirect_uri=https://localhost/login'"> -->

      <v-btn size="large" :loading="isSubmitting" color="primary" type="button" block flat>
        Masuk Dengan SSO
      </v-btn>
    </NuxtLink>

    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">
        {{ errors.apiError }}
      </v-alert>
      <!-- <button @click="wadaw()">asd</button> -->
    </div>
  </Form>
</template>
