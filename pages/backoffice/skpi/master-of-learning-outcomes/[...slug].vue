<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetCurriculumListData } from '~~/types/api/admin-curriculum/GetCurriculumListData';
import { GetMasterOfLearningOutcomesCategoryData, GetMasterOfLearningOutcomesData } from '~~/types/api/admin-skpi/GetMasterOfLearningOutcomes';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta({
    layout: "backoffice",
    middleware: ['check-auth'],
});

const slug = useRoute().params.slug
const category_slug = slug.length
const study_program_id = ref(slug[0])
const curriculum_id = ref(slug[1])
const learning_achievement_category_id = ref(slug[2])
const limit = 20
const pagination = ref({
  page: 1,
  limit,
  prev: 1,
  next: 1,
  total_pages: 1,
  total_records: 0
})
const search: String = ''
const title = ref('')
if (category_slug == 1){
    title.value = 'Kurikulum Capaian Pembelajaran'
}else if(category_slug == 2){
    title.value = 'Capaian Pembelajaran'
}else if(category_slug == 3){
    title.value = 'Sub Capaian Pembelajaran'
}
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
])
const mode = ref('list')
const dialog = ref(false)
const valid = ref(true)
const curriculums = ref<GetCurriculumListData[]>([])
const learning_achievement_categories = ref<GetMasterOfLearningOutcomesCategoryData[]>([])
const learning_achievements = ref<GetMasterOfLearningOutcomesData[]>([])
async function getDataCurriculum(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_curriculum.AdminCurriculumHandler/GetList?limit=${limit}&page=${page}&search=${search}&studyProgramId=${study_program_id.value}`, <any>{
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
        curriculums.value = _resp.value.data
    } catch (error) {
        alert(error)
    }   
}
async function getDataLearningAchievementCategory(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_learning_achievement_category.AdminLearningAchievementCategoryHandler/GetList?limit=${limit}&page=${page}&search=${search}&curriculumId=${curriculum_id.value}`, <any>{
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
        learning_achievement_categories.value = _resp.value.data
    } catch (error) {
        alert(error)
    }   
}
async function getDataLearningAchievement(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_learning_achievement.AdminLearningAchievementHandler/GetList?limit=${limit}&page=${page}&search=${search}&learningAchievementCategoryId=${learning_achievement_category_id.value}`, <any>{
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
        learning_achievements.value = _resp.value.data
    } catch (error) {
        alert(error)
    }   
}
const learningAchievementCategoryObj = ref({
    id: '',
    name: '',
    english_name: ''
})
const createLearningAchievementCategoryObj = ref({
    name: '',
    english_name: ''
})
const updateLearningAchievementCategoryObj = ref({
    id: '',
    name: '',
    english_name: ''
})
const learningAchievementObj = ref({
    id: '',
    name: '',
    english_name: ''
})
const createLearningAchievementObj = ref({
    name: '',
    english_name: ''
})
const updateLearningAchievementObj = ref({
    id: '',
    name: '',
    english_name: ''
})
// Learning Achievement Category
function createLearningAchievementCategory(){
    mode.value = 'create-learning-achievement-category'
    dialog.value = true
    createLearningAchievementCategoryObj.value = {
        name: '',
        english_name: ''
    }
}
function closeLearningAchievementCategory(){
    dialog.value = false
    setTimeout(() => {
        createLearningAchievementCategoryObj.value = {
            name: "",
            english_name: "",
        }
    }, 300)
}
function editLearningAchievementCategory(item: any){
    mode.value = 'edit-learning-achievement-category'
    dialog.value = true
    updateLearningAchievementCategoryObj.value = {
        id: item.id,
        name: item.name,
        english_name: item.english_name
    }
}
async function saveLearningAchievementCategory(){
    try {
        var createData = Object.assign({}, createLearningAchievementCategoryObj.value);
            const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/skpi/admin_learning_achievement_category.AdminLearningAchievementCategoryHandler/Create`, <any>{
            method: 'POST',
            body: {
                name: createData.name,
                english_name: createData.english_name,
                curriculum_id: curriculum_id.value,
                
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
        closeLearningAchievementCategory()
        await getDataLearningAchievementCategory(limit, 1, search, curriculum_id.value)
        // return { response: data.value, error: null };
    } catch (error) {
        alert(error)
    }
}
async function updateLearningAchievementCategory(){
    try {
        var updateData = Object.assign({}, updateLearningAchievementCategoryObj.value);
            const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/skpi/admin_learning_achievement_category.AdminLearningAchievementCategoryHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: updateData.id,
                name: updateData.name,
                english_name: updateData.english_name,
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
        closeLearningAchievementCategory()
        await getDataLearningAchievementCategory(limit, 1, search, curriculum_id.value)
    } catch (error) {
        alert(error)
    }
}
function deleteLearningAchievementCategory(item: any){
    mode.value = 'delete-learning-achievement-category'
    dialog.value = true
    learningAchievementCategoryObj.value = item
}
async function deleteDataLearningAchievementCategory() {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/skpi/admin_learning_achievement_category.AdminLearningAchievementCategoryHandler/Delete`, <any>{
            method: 'Delete',
            body: {
                id: learningAchievementCategoryObj.value.id
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
    } catch (error) {
        alert(error)

    }
    closeLearningAchievementCategory()
    await getDataLearningAchievementCategory(limit, 1, search, curriculum_id.value)
}
// Learning Achievement Category
function createLearningAchievement(){
    mode.value = 'create-learning-achievement'
    dialog.value = true
    createLearningAchievementObj.value = {
        name: '',
        english_name: ''
    }
}
function closeLearningAchievement(){
    dialog.value = false
    setTimeout(() => {
        createLearningAchievementObj.value = {
            name: "",
            english_name: "",
        }
    }, 300)
}
function editLearningAchievement(item: any){
    mode.value = 'edit-learning-achievement'
    dialog.value = true
    updateLearningAchievementObj.value = {
        id: item.id,
        name: item.name,
        english_name: item.english_name
    }
}
async function saveLearningAchievement(){
    try {
        var createData = Object.assign({}, createLearningAchievementObj.value);
            const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/skpi/admin_learning_achievement.AdminLearningAchievementHandler/Create`, <any>{
            method: 'POST',
            body: {
                name: createData.name,
                english_name: createData.english_name,
                learning_achievement_category_id: learning_achievement_category_id.value,
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
        closeLearningAchievement()
        await getDataLearningAchievement(limit, 1, search, learning_achievement_category_id.value)
        // return { response: data.value, error: null };
    } catch (error) {
        alert(error)
    }
}
async function updateLearningAchievement(){
    try {
        var updateData = Object.assign({}, updateLearningAchievementObj.value);
            const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/skpi/admin_learning_achievement.AdminLearningAchievementHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: updateData.id,
                name: updateData.name,
                english_name: updateData.english_name,
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
        closeLearningAchievement()
        await getDataLearningAchievement(limit, 1, search, learning_achievement_category_id.value)
    } catch (error) {
        alert(error)
    }
}
function deleteLearningAchievement(item: any){
    mode.value = 'delete-learning-achievement'
    dialog.value = true
    learningAchievementObj.value = item
}
async function deleteDataLearningAchievement() {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/skpi/admin_learning_achievement.AdminLearningAchievementHandler/Delete`, <any>{
            method: 'Delete',
            body: {
                id: learningAchievementObj.value.id
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
    } catch (error) {
        alert(error)

    }
    closeLearningAchievement()
    await getDataLearningAchievement(limit, 1, search, learning_achievement_category_id.value)
}
onMounted(async () => {
    await getDataCurriculum(limit, 1, search, study_program_id.value)
    if(typeof curriculum_id.value != 'undefined'){
        await getDataLearningAchievementCategory(limit, 1, search, curriculum_id.value)
    }
    if(typeof learning_achievement_category_id.value != 'undefined'){
        await getDataLearningAchievement(limit, 1, search, learning_achievement_category_id.value)
    }
})
</script>
<template>
    <div>
        <div v-if="mode == 'create-learning-achievement-category'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                        <span class="title text-white">Tambah {{title}}</span>
                    </VCardTitle>
                    <VCardText>
                        <VForm ref="form" v-model="valid" lazy-validation>
                            <VRow>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLearningAchievementCategoryObj.name" variant="outlined" hide-details label="*Capaian Pembelajaran" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLearningAchievementCategoryObj.english_name" variant="outlined" hide-details label="Capaian Pembelajaran Asing" />
                                </VCol>
                                <VCardActions class="pa-4">
                                    <VSpacer />
                                    <VBtn color="error" @click="closeLearningAchievementCategory">
                                    Batal
                                    </VBtn>
                                    <VBtn color="secondary" :disabled="createLearningAchievementCategoryObj.name == ''" @click="saveLearningAchievementCategory">
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
        <div v-if="mode == 'edit-learning-achievement-category'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                        <span class="title text-white">Tambah {{title}}</span>
                    </VCardTitle>
                    <VCardText>
                        <VForm ref="form" v-model="valid" lazy-validation>
                            <VRow>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLearningAchievementCategoryObj.name" variant="outlined" hide-details label="*Capaian Pembelajaran" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLearningAchievementCategoryObj.english_name" variant="outlined" hide-details label="Capaian Pembelajaran Asing" />
                                </VCol>
                                <VCardActions class="pa-4">
                                    <VSpacer />
                                    <VBtn color="error" @click="closeLearningAchievementCategory">
                                    Batal
                                    </VBtn>
                                    <VBtn color="secondary" :disabled="updateLearningAchievementCategoryObj.name == ''" @click="updateLearningAchievementCategory">
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
        <div v-if="mode == 'delete-learning-achievement-category'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                    <span class="title text-white">Hapus {{ title }} {{ learningAchievementCategoryObj.name }}</span>
                    </VCardTitle>
                    <VCardText>
                    <VForm ref="form" v-model="valid" lazy-validation>
                        <VRow>
                        <VCardActions class="pa-4">
                            <VSpacer />
                            <VBtn color="error" @click="closeLearningAchievementCategory">
                            Batal
                            </VBtn>
                            <VBtn color="secondary" :disabled="learningAchievementCategoryObj.name == ''" @click="deleteDataLearningAchievementCategory">
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
        <div v-if="mode == 'create-learning-achievement'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                        <span class="title text-white">Tambah {{title}}</span>
                    </VCardTitle>
                    <VCardText>
                        <VForm ref="form" v-model="valid" lazy-validation>
                            <VRow>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLearningAchievementObj.name" variant="outlined" hide-details label="*Sub Capaian Pembelajaran" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLearningAchievementObj.english_name" variant="outlined" hide-details label="Sub Capaian Pembelajaran Asing" />
                                </VCol>
                                <VCardActions class="pa-4">
                                    <VSpacer />
                                    <VBtn color="error" @click="closeLearningAchievement">
                                    Batal
                                    </VBtn>
                                    <VBtn color="secondary" :disabled="createLearningAchievementObj.name == ''" @click="saveLearningAchievement">
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
        <div v-if="mode == 'edit-learning-achievement'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                        <span class="title text-white">Tambah {{title}}</span>
                    </VCardTitle>
                    <VCardText>
                        <VForm ref="form" v-model="valid" lazy-validation>
                            <VRow>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLearningAchievementObj.name" variant="outlined" hide-details label="*Capaian Pembelajaran" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLearningAchievementObj.english_name" variant="outlined" hide-details label="Capaian Pembelajaran Asing" />
                                </VCol>
                                <VCardActions class="pa-4">
                                    <VSpacer />
                                    <VBtn color="error" @click="closeLearningAchievement">
                                    Batal
                                    </VBtn>
                                    <VBtn color="secondary" :disabled="updateLearningAchievementObj.name == ''" @click="updateLearningAchievement">
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
        <div v-if="mode == 'delete-learning-achievement'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                    <span class="title text-white">Hapus {{ title }} {{ learningAchievementObj.name }}</span>
                    </VCardTitle>
                    <VCardText>
                    <VForm ref="form" v-model="valid" lazy-validation>
                        <VRow>
                        <VCardActions class="pa-4">
                            <VSpacer />
                            <VBtn color="error" @click="closeLearningAchievement">
                            Batal
                            </VBtn>
                            <VBtn color="secondary" :disabled="learningAchievementObj.name == ''" @click="deleteDataLearningAchievement">
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
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <div v-if="category_slug == 1">
            <SharedUiParentCard :title="title">
                <VRow>
                    <VCol cols="12" lg="4" md="6" class="text-left">
                        <v-text-field density="compact" :label="`Pencarian `+title" hide-details variant="outlined" @input="getDataCurriculum(limit, pagination.page, $event.target.value, study_program_id)" />
                    </VCol>
                    <VCol cols="12" lg="8" md="6" class="text-right">
                        <NuxtLink to="/backoffice/skpi/master-of-learning-outcomes/">
                            <VBtn color="warning" flat class="ml-auto">
                                <VIcon class="mr-2">
                                    mdi-keyboard-backspace
                                </VIcon>Kembali
                            </VBtn>
                        </NuxtLink>
                    </VCol>
                </VRow>
            </SharedUiParentCard>
            <VTable class="mt-5">
                <thead>
                    <tr>
                        <th class="text-subtitle-1 font-weight-semibold">No</th>
                        <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                        <th class="text-subtitle-1 font-weight-semibold">Tahun</th>
                        <th class="text-subtitle-1 font-weight-semibold">Ideal</th>
                        <th class="text-subtitle-1 font-weight-semibold">Max</th>
                        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item, index in curriculums">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.year }}</td>
                        <td>{{ item.ideal_study_period }}</td>
                        <td>{{ item.maximum_study_period }}</td>
                        <td>
                            <VTooltip text="Detail">
                                <template #activator="{ props }">
                                    <a :href="'/backoffice/skpi/master-of-learning-outcomes/'+study_program_id+`/`+item.id">
                                        <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </a>
                                </template>
                            </VTooltip>
                        </td>
                    </tr>
                </tbody>
            </VTable>
        </div>
        <div v-if="category_slug == 2">
            <SharedUiParentCard :title="title">
                <VRow>
                    <VCol cols="12" lg="4" md="6" class="text-left">
                        <v-text-field density="compact" :label="`Pencarian `+title" hide-details variant="outlined" @input="getDataLearningAchievementCategory(limit, pagination.page, $event.target.value, curriculum_id)" />
                    </VCol>
                    <VCol cols="12" lg="8" md="6" class="text-right">
                        <a :href="`/backoffice/skpi/master-of-learning-outcomes/`+study_program_id">
                            <VBtn color="warning" flat class="ml-auto">
                                <VIcon class="mr-2">
                                    mdi-keyboard-backspace
                                </VIcon>Kembali
                            </VBtn>
                        </a>
                        <VBtn color="primary" flat class="ml-2" @click="createLearningAchievementCategory">
                            <VIcon class="mr-2">
                                mdi-account-multiple-plus
                            </VIcon>Tambah {{ title }}
                        </VBtn>
                    </VCol>
                </VRow>
            </SharedUiParentCard>
            <VTable class="mt-5">
                <thead>
                    <tr>
                        <th class="text-subtitle-1 font-weight-semibold">No</th>
                        <th class="text-subtitle-1 font-weight-semibold">Indonesia</th>
                        <th class="text-subtitle-1 font-weight-semibold">Asing</th>
                        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item, index in learning_achievement_categories">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.english_name }}</td>
                        <td>
                            <VTooltip text="Detail">
                                <template #activator="{ props }">
                                    
                                    <a :href="'/backoffice/skpi/master-of-learning-outcomes/'+study_program_id+`/`+curriculum_id+`/`+item.id">
                                        <VBtn icon flat v-bind="props">
                                            <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                        </VBtn>
                                    </a>
                                </template>
                            </VTooltip>
                            <VTooltip text="Ubah">
                                <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="editLearningAchievementCategory(item)">
                                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                </VBtn>
                                </template>
                            </VTooltip>
                            <VTooltip text="Hapus">
                                <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="deleteLearningAchievementCategory(item)">
                                    <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                </VBtn>
                                </template>
                            </VTooltip>
                        </td>
                    </tr>
                </tbody>
            </VTable>
        </div>
        <div v-if="category_slug == 3">
            <SharedUiParentCard :title="title">
                <VRow>
                    <VCol cols="12" lg="4" md="6" class="text-left">
                        <v-text-field density="compact" :label="`Pencarian `+title" hide-details variant="outlined" @input="getDataLearningAchievement(limit, pagination.page, $event.target.value, learning_achievement_category_id)" />
                    </VCol>
                    <VCol cols="12" lg="8" md="6" class="text-right">
                        <a :href="`/backoffice/skpi/master-of-learning-outcomes/`+study_program_id+`/`+curriculum_id">
                            <VBtn color="warning" flat class="ml-auto">
                                <VIcon class="mr-2">
                                    mdi-keyboard-backspace
                                </VIcon>Kembali
                            </VBtn>
                        </a>
                        <VBtn color="primary" flat class="ml-2" @click="createLearningAchievement">
                            <VIcon class="mr-2">
                                mdi-account-multiple-plus
                            </VIcon>Tambah {{ title }}
                        </VBtn>
                    </VCol>
                </VRow>
            </SharedUiParentCard>
            <VTable class="mt-5">
                <thead>
                    <tr>
                        <th class="text-subtitle-1 font-weight-semibold">No</th>
                        <th class="text-subtitle-1 font-weight-semibold">Indonesia</th>
                        <th class="text-subtitle-1 font-weight-semibold">Asing</th>
                        <th class="text-subtitle-1 font-weight-semibold" style="min-width: 200px;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item, index in learning_achievements">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.english_name }}</td>
                        <td>
                            <VTooltip text="Detail">
                                <template #activator="{ props }">
                                    <VTooltip text="Ubah">
                                        <template #activator="{ props }">
                                        <VBtn icon flat v-bind="props" @click="editLearningAchievement(item)">
                                            <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                        </VBtn>
                                        </template>
                                    </VTooltip>
                                    <VTooltip text="Hapus">
                                        <template #activator="{ props }">
                                        <VBtn icon flat v-bind="props" @click="deleteLearningAchievement(item)">
                                            <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                        </VBtn>
                                        </template>
                                    </VTooltip>
                                </template>
                            </VTooltip>
                        </td>
                    </tr>
                </tbody>
            </VTable>
        </div>
    </div>
</template>