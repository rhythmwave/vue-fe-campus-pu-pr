<script setup lang="ts">
import { useBackofficePermissionsStore } from '@/stores/apps/backoffice/permissions'
import { Permission } from '@/types/backoffice/backofficeTypes'
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});


const permissions = ref<Permission[]>()
// const pagination = ref<Pagination[]>();
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

const title = ref('Daftar Modul')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Daftar Modul',
    disabled: true,
    href: '#'
  }
])

onMounted(() => {
  getData(limit, 1, search)
})

const valid = ref(true)
const rolesbg = ref(['primary', 'secondary', 'error', 'success', 'warning'])
const editedIndex = ref(-1)

async function getData(limit: number, page: number, search: String) {

  try {
    const { data: response, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_permission.RootPermissionHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
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
      next: response.value.pagination.next,
      prev: response.value.pagination.prev,
      total_pages: response.value.pagination.total_pages,
      total_records: response.value.pagination.total_records,
      limit: response.value.pagination.limit,
      page: response.value.pagination.page
    }

    permissions.value = response.value.data
  } catch (error) {
    alert(error)

  }
}
</script>

<template>
  <div>
    <SharedBackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs" />
    <SharedUiParentCard title="Modul">
      <v-col cols="12" lg="4" md="6">
        <v-text-field density="compact" label="Pencarian Modul" hide-details variant="outlined"
          @input="getData(limit, pagination.page, $event.target.value)" />
      </v-col>
    </SharedUiParentCard>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">
            No
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Nama Modul
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item, index in permissions" :key="item.id">
          <td class="text-subtitle-1">
            {{ index + 1 }}
          </td>
          <td class="text-subtitle-1">
            {{ item.name }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">
            <TablePaginationView func_get_data="permissions" :limit="limit" :page="pagination.page"
              :total_pages="pagination.total_pages" :total_records="pagination.total_records" :prev="pagination.prev"
              :next="pagination.next" @prevPage="getData(limit, pagination.prev, search)"
              @jumpPage="(page) => getData(limit, page, search)" @nextPage="getData(limit, pagination.next, search)" />
          </td>
        </tr>
      </tfoot>
    </v-table>
  </div>
</template>
