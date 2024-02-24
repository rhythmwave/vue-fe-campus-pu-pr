<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { GetGraduationPredicateListAdmin, GetGraduationPredicateListData } from '~~/types/api/admin-study-program/GetGraduationPredicateListAdmin'
import { GetGraduationPredicateDetailData } from '~~/types/api/graduation-title/GetGraduationPredicateDetail';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});

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
const title = ref('Manajemen Predikat Kelulusan')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Manajemen Predikat Kelulusan',
    disabled: true,
    href: '#'
  }
])

const mode = ref('list')
const dialog = ref(false)
const valid = ref(true)
const predicate = ref<GetGraduationPredicateListAdmin[]>([])
const predicateSingle = ref(<GetGraduationPredicateListData>{})
const createPredicate = ref({
    predicate: '',
    minimum_gpa: 0,
    maximum_study_semester: 0,
    repeat_course_limit: 0,
    below_minimum_grade_point_limit: 0
})
const updatePredicate = ref({
    id: '',
    predicate: '',
    minimum_gpa: 0,
    maximum_study_semester: 0,
    repeat_course_limit: 0,
    below_minimum_grade_point_limit: 0
})

async function create() {
    mode.value = 'create'
    createPredicate.value = {
        predicate: '',
        minimum_gpa: 0,
        maximum_study_semester: 0,
        repeat_course_limit: 0,
        below_minimum_grade_point_limit: 0
    }
    dialog.value = true
}
async function getData(limit: number, page: number, search: String) {
  try {
    const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_graduation_predicate.AdminGraduationPredicateHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
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
    predicate.value = _resp.value
  } catch (error) {
    alert(error)

  }
}
async function save() {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/graduation_predicate/admin_graduation_predicate.AdminGraduationPredicateHandler/Create`, <any>{
            method: 'POST',
            body: {
                predicate: createPredicate.value.predicate,
                minimum_gpa: Number(createPredicate.value.minimum_gpa),
                maximum_study_semester: Number(createPredicate.value.maximum_study_semester),
                repeat_course_limit: Number(createPredicate.value.repeat_course_limit),
                below_minimum_grade_point_limit: Number(createPredicate.value.below_minimum_grade_point_limit),
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
        await getData(limit, 1, search)
    } catch (error) {
        alert(error)
    }
}
function close() {
  dialog.value = false
  setTimeout(() => {
    createPredicate.value = {
        predicate: '',
        minimum_gpa: 0,
        maximum_study_semester: 0,
        repeat_course_limit: 0,
        below_minimum_grade_point_limit: 0
    }
  }, 300)
}
onMounted(async () => {
    await getData(limit, 1, search)
})
// const showId = ref('')
const dialogShow = ref(false)
const predicateDetail = ref(<GetGraduationPredicateDetailData>{});
function showItem(item: any) {
  mode.value = 'show'
  predicateDetail.value = item
  dialogShow.value = true
}
async function editItem(item: any) {
    mode.value = 'edit'
    dialog.value = true
    updatePredicate.value = Object.assign({}, item);
}
async function update() {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/graduation_predicate/admin_graduation_predicate.AdminGraduationPredicateHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: updatePredicate.value.id,
                predicate: updatePredicate.value.predicate,
                minimum_gpa: Number(updatePredicate.value.minimum_gpa),
                maximum_study_semester: Number(updatePredicate.value.maximum_study_semester),
                repeat_course_limit: Number(updatePredicate.value.repeat_course_limit),
                below_minimum_grade_point_limit: Number(updatePredicate.value.below_minimum_grade_point_limit),
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
        await getData(limit, 1, search)
    } catch (error) {
        alert(error)
    }
}
function deleteItem(item: any) {
  mode.value = 'delete'
  dialog.value = true
  predicateSingle.value = item
}
async function deleteData() {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/graduation_predicate/admin_graduation_predicate.AdminGraduationPredicateHandler/Delete`, <any>{
        method: 'Delete',
        body: {
            id: predicateSingle.value.id
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
    close()
    getData(limit, 1, search)
}
</script>

<template>
    <div>
        <div v-if="mode == 'delete'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                    <span class="title text-white">hapus predikat kelulusan {{ predicateSingle.predicate }}</span>
                    </VCardTitle>
                    <VCardText>
                    <VForm ref="form" v-model="valid" lazy-validation>
                        <VRow>
                        <VCardActions class="pa-4">
                            <VSpacer />
                            <VBtn color="error" @click="close">
                            Batal
                            </VBtn>
                            <VBtn color="secondary" :disabled="predicateSingle.predicate == ''" @click="deleteData">
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
        <div v-if="mode == 'edit'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <VCard>
                        <VCardTitle class="pa-4 bg-secondary">
                            <span class="title text-white">ubah predikat kelulusan</span>
                        </VCardTitle>
                        <VCardText>
                            <VForm ref="form" v-model="valid" lazy-validation>
                                <VRow>
                                    <VCol cols="12" sm="12">
                                        <v-text-field v-model="updatePredicate.predicate" variant="outlined" hide-details label="*Predikat" />
                                    </VCol>
                                    <VCol cols="12" sm="12">
                                        <v-text-field type="number" v-model="updatePredicate.minimum_gpa" variant="outlined" hide-details label="*IPK Minimal" />
                                    </VCol>
                                    <VCol cols="12" sm="12">
                                        <v-text-field type="number" v-model="updatePredicate.maximum_study_semester" variant="outlined" hide-details label="*Masa Studi (Semester)" />
                                    </VCol>
                                    <VCol cols="12" sm="12">
                                        <v-text-field type="number" v-model="updatePredicate.repeat_course_limit" variant="outlined" hide-details label="Batas Mengulang" />
                                    </VCol>
                                    <VCol cols="12" sm="12">
                                        <v-text-field type="number" v-model="updatePredicate.below_minimum_grade_point_limit" variant="outlined" hide-details label="Batas Nilai C" />
                                    </VCol>
                                    <VCardActions class="pa-4">
                                        <VSpacer />
                                        <VBtn color="error" @click="close">
                                        Batal
                                        </VBtn>
                                        <VBtn color="secondary" :disabled="
                                        updatePredicate.predicate == '' ||
                                        updatePredicate.minimum_gpa == 0 ||
                                        updatePredicate.maximum_study_semester == 0
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
        <div v-if="mode == 'create'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                        <span class="title text-white">tambah predikat kelulusan</span>
                    </VCardTitle>
                    <VCardText>
                        <VForm ref="form" v-model="valid" lazy-validation>
                            <VRow>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createPredicate.predicate" variant="outlined" hide-details label="*Predikat" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="createPredicate.minimum_gpa" variant="outlined" hide-details label="*IPK Minimal" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="createPredicate.maximum_study_semester" variant="outlined" hide-details label="*Masa Studi (Semester)" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="createPredicate.repeat_course_limit" variant="outlined" hide-details label="Batas Mengulang" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="createPredicate.below_minimum_grade_point_limit" variant="outlined" hide-details label="Batas Nilai C" />
                                </VCol>
                                <VCardActions class="pa-4">
                                    <VSpacer />
                                    <VBtn color="error" @click="close">
                                    Batal
                                    </VBtn>
                                    <VBtn color="secondary" :disabled="
                                    createPredicate.predicate == '' ||
                                    createPredicate.minimum_gpa == 0 ||
                                    createPredicate.maximum_study_semester == 0
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
        <div v-if="mode == 'show'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialogShow" max-width="800">
                    <PagesGraduationTitleDetail :data="predicateDetail" />
                </VDialog>
            </VCol>
        </div>
        <SharedBackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs" />
        <SharedUiParentCard :title="title">
            <VCol cols="12" lg="4" md="6" class="float-left">
                <v-text-field density="compact" label="Pencarian Predikat Kelulusan" hide-details variant="outlined" @input="getData(limit, pagination.page, $event.target.value)" />
            </VCol>
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VBtn color="primary" flat class="ml-auto" @click="create()">
                <VIcon class="mr-2">
                    mdi-account-multiple-plus
                </VIcon>Tambah Predikat Kelulusan
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
                        Predikat
                    </th>
                    <th class="text-subtitle-1 font-weight-semibold">
                        IPK Minimal
                    </th>
                    <th class="text-subtitle-1 font-weight-semibold">
                        Batas Mengulang
                    </th>
                    <th class="text-subtitle-1 font-weight-semibold">
                        Batas Nilai C
                    </th>
                    <th class="text-subtitle-1 font-weight-semibold">
                        Aksi
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in predicate.data">
                    <td class="text-subtitle-1">
                        {{ index + 1 }}
                    </td>
                    <td class="text-subtitle-1">
                        {{ item?.predicate }}
                    </td>
                    <td class="text-subtitle-1">
                        {{ item?.minimum_gpa }}
                    </td>
                    <td class="text-subtitle-1">
                        {{ item?.repeat_course_limit }}
                    </td>
                    <td class="text-subtitle-1">
                        {{ item?.below_minimum_grade_point_limit }}
                    </td>
                    <td>
                        <div class="d-flex align-center">
                            <VTooltip text="Detail">
                                <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="showItem(item)">
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
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                            :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                            :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(pagination.limit, pagination.prev, '')"
                            @jumpPage="(page: any) => getData(pagination.limit, page, '')"
                            @nextPage="getData(pagination.limit, pagination.next, '')" />
                    </td>
                </tr>
            </tfoot>
        </VTable>
    </div>
</template>