<script setup lang="ts">
import { getLecturerClassGradeComponentList } from '~~/composables/api/lecturer-class-grade-component/getLecturerClassGradeComponentList';
import { getLecturerClassDetail } from '~~/composables/api/lecturer-class/getLecturerClassDetail';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerClassGradeComponentListData } from '~~/types/api/lecturer-class-grade-component/GetLecturerClassGradeComponentList';
import { GetLecturerClassDetailData } from '~~/types/api/lecturer-class/GetLecturerClassDetail';

definePageMeta({
    layout: "academic-portal",
    middleware: ['check-auth'],
});
const toogle = ref([])
const limit = 20
const search = ref('')
const title = ref('Nilai Mata Kuliah')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/academic-portal'
    },
    {
        text: 'Ubah ' + title.value,
        disabled: true,
        href: '#'
    }
]);
const route = useRoute()
const mode = ref('list')
const dialog = ref(false)

function close() {
    dialog.value = false
}
function setting() {
    mode.value = 'setting'
    dialog.value = true
}

async function refresh() {
    class_id.value = location.href.split('/')[window.location.href.split('/').length - 1]
    await getLecturerClassDetailData()
    await getLecturerClassGradeComponentListData()
}

onMounted(async () => {
    await refresh()
})

const class_id = ref('')
const getLecturerClassDetails = ref (<GetLecturerClassDetailData>{})
async function getLecturerClassDetailData() {
    try {
        const { response: resp, error: error } = await getLecturerClassDetail(class_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            getLecturerClassDetails.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}


const getLecturerClassGradeComponentLists = ref (<GetLecturerClassGradeComponentListData[]>[])
async function getLecturerClassGradeComponentListData() {
    try {
        const { response: resp, error: error } = await getLecturerClassGradeComponentList(class_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            getLecturerClassGradeComponentLists.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

</script>
<template>
    <div>
        <div v-if="mode == 'setting'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesAcademicPortalAcademicSubjectEnabledSetting :input="getLecturerClassGradeComponentLists"
                        :class_id="class_id" @close="close()" @reload="refresh()" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="'Ubah  ' + title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="'Kelas : ' + getLecturerClassDetails?.name">
            <VRow>
                <VCol cols="12" lg="12" md="12" class="text-right">
                    <NuxtLink to="/academic-portal/academic/subject-enabled">
                        <VBtn color="warning" flat class="ml-auto mr-2">
                            <VIcon>
                                mdi-keyboard-backspace
                            </VIcon>Kembali
                        </VBtn>
                    </NuxtLink>
                    <VBtn color="primary" flat class="ml-auto mr-2" @click="setting()">
                        <VIcon>
                            mdi-account-multiple-plus
                        </VIcon>Setting
                    </VBtn>
                </VCol>
            </VRow>
        </SharedUiParentCard>
        <v-table>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jenis Komponen Nilai</th>
                    <th class="text-subtitle-1 font-weight-semibold">Persentase (%)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in getLecturerClassGradeComponentLists"
                    v-if="getLecturerClassGradeComponentLists.length > 0">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.percentage }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>