<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetSKPIRegistrationDataDetail } from '~/types/api/admin-skpi/GetSKPIRegistration'
import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';

definePageMeta({
    layout: "backoffice",
    middleware: ['check-auth'],
});

const skpi_registration_id = ref('')
const thisFullPath:string = window.location.pathname
const thisID:any = thisFullPath.split("/")

if (thisID[thisID.length-1] != '' || typeof thisID[thisID.length-1] != 'undefined'){
    skpi_registration_id.value = thisID[thisID.length-1]
}

const skpi_registration_detail = ref<GetSKPIRegistrationDataDetail>()
const title = ref('Detail Pendaftaran SKPI')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: title,
    disabled: true,
    href: '#'
  }
])
async function getDetail(id: string) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/skpi/admin_student_skpi.AdminStudentSkpiHandler/GetDetail?id=${id}`, <any>{
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
        skpi_registration_detail.value = {
            id: _resp.value.data.id,
            student_id: _resp.value.data.student_id,
            student_nim_number: _resp.value.data.student_nim_number,
            student_name: _resp.value.data.student_name,
            student_study_program_id: _resp.value.data.student_study_program_id,
            student_study_program_name: _resp.value.data.student_study_program_name,
            student_dikti_study_program_code: _resp.value.data.student_dikti_study_program_code,
            skpi_number: _resp.value.data.skpi_number,
            is_approved: _resp.value.data.is_approved,
            achievement_path: _resp.value.data.achievement_path,
            achievement_path_type: _resp.value.data.achievement_path_type,
            achievement_url: _resp.value.data.achievement_url,
            organization_path: _resp.value.data.organization_path,
            organization_path_type: _resp.value.data.organization_path_type,
            organization_url: _resp.value.data.organization_url,
            certificate_path: _resp.value.data.certificate_path,
            certificate_path_type: _resp.value.data.certificate_path_type,
            certificate_url: _resp.value.data.certificate_url,
            language_path: _resp.value.data.language_path,
            language_path_type: _resp.value.data.language_path_type,
            language_url: _resp.value.data.language_url,
            achievements: _resp.value.data.achievements,
            organizations: _resp.value.data.organizations,
            certificates: _resp.value.data.certificates,
            character_buildings: _resp.value.data.character_buildings,
            internships: _resp.value.data.internships,
            languages: _resp.value.data.languages,
        }
    } catch (error) {
        alert(error)
    }   
}
function back(){
    let router = useRouter()
    router.push({
        path: '/backoffice/skpi/skpi-registration/',
    })
}
onMounted(async () => {
    await getDetail(skpi_registration_id.value)
})
</script>
<template>
    <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
    <SharedUiParentCard :title="title">
        <VCol cols="12" lg="12" md="12" class="text-right">
            <VBtn color="warning" flat class="ml-auto" @click="back">
                <VIcon class="mr-2">
                    mdi-keyboard-backspace
                </VIcon>Kembali
            </VBtn>
        </VCol>
    </SharedUiParentCard>
    <VTable class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold" width="200">{{ title }}</th>
                <th class="text-subtitle-1 font-weight-semibold"></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>NIM :</td>
                <td>{{ skpi_registration_detail?.student_nim_number }}</td>
            </tr>
            <tr>
                <td>Nama :</td>
                <td>{{ skpi_registration_detail?.student_name }}</td>
            </tr>
            <tr>
                <td>Status :</td>
                <td style="color: green;" v-if="skpi_registration_detail?.is_approved">disetujui</td>
                <td style="color: red;" v-else>belum disetujui</td>
            </tr>
            <tr>
                <td>Nomor SKPI :</td>
                <td>{{ skpi_registration_detail?.skpi_number }}</td>
            </tr>
        </tbody>
    </VTable>
    <VTable class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold" colspan="2">1. Prestasi dan penghargaan / Achievement and Awards </th>
                <th style="float: right">
                    <a style="text-decoration: none" :href="skpi_registration_detail?.achievement_url" target="_blank">Download</a>
                </th>
            </tr>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold">No</th>
                <th class="text-subtitle-1 font-weight-semibold">Prestasi</th>
                <th class="text-subtitle-1 font-weight-semibold">Tahun</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item, index in skpi_registration_detail?.achievements">
                <td>{{ index+1 }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.year }}</td>
            </tr>
        </tbody>
    </VTable>
    <VTable class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold" colspan="3">2. Pengalaman Organisasi / Organizational Experiences</th>
                <th style="float: right">
                    <a style="text-decoration: none" :href="skpi_registration_detail?.organization_url" target="_blank">Download</a>
                </th>
            </tr>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold">No</th>
                <th class="text-subtitle-1 font-weight-semibold">Nama Organisasi</th>
                <th class="text-subtitle-1 font-weight-semibold">Posisi</th>
                <th class="text-subtitle-1 font-weight-semibold">Masa Jabatan (tahun)</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item, index in skpi_registration_detail?.organizations">
                <td>{{ index+1 }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.position }}</td>
                <td>{{ item.service_length }}</td>
            </tr>
        </tbody>
    </VTable>
    <VTable class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold" colspan="2">3. Sertifikat Keahlian / Certificate of Expertise</th>
                <th style="float: right">
                    <a style="text-decoration: none" :href="skpi_registration_detail?.certificate_url" target="_blank">Download</a>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item, index in skpi_registration_detail?.certificates">
                <td width="20">-</td>
                <td>{{ item.name }}</td>
            </tr>
        </tbody>
    </VTable>
    <VTable class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold" colspan="2">4. Kerja Praktek/Magang / Internship</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item, index in skpi_registration_detail?.internships">
                <td width="20">-</td>
                <td>{{ item.name }}</td>
            </tr>
        </tbody>
    </VTable>
    <VTable class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold" colspan="2">5. Tugas Akhir / Final Project</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td width="20">-</td>
            </tr>
        </tbody>
    </VTable>
    <VTable class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold" colspan="2">6. Bahasa Internasional / International Language(s)</th>
                <th style="float: right">
                    <a style="text-decoration: none" :href="skpi_registration_detail?.language_url" target="_blank">Download</a>
                </th>
            </tr>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold">Bahasa</th>
                <th class="text-subtitle-1 font-weight-semibold">Skor</th>
                <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item, index in skpi_registration_detail?.languages">
                <td>{{ item.name }}</td>
                <td>{{ item.score }}</td>
                <td>{{ moment(item.date).format('DD MMM YYYY') }}</td>
            </tr>
        </tbody>
    </VTable>
    <VTable class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold" colspan="2">7. Pendidikan karakter / Character Building</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item, index in skpi_registration_detail?.character_buildings">
                <td width="20">-</td>
                <td>{{ item.name }}</td>
            </tr>
        </tbody>
    </VTable>
</template>