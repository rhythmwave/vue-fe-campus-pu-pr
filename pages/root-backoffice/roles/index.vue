<script setup lang="ts">
import { GetRoleListData, GetRoleListRoot } from '~~/types/api/role/GetRoleList';

import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});


const limit = 20
const search = ref('')

const title = ref('Daftar Grup')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Daftar Grup',
    disabled: true,
    href: '#'
  }
])

const roles = ref<GetRoleListData[]>([])
const pagination = ref({
  page: 1,
  limit,
  prev: 1,
  next: 1,
  total_pages: 1,
  total_records: 0
})

onMounted(() => {
  getData(limit, 1, search.value)
})

const valid = ref(true)
const mode = ref('list')
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogDelete = ref(false)
const role = ref(<GetRoleListData>{
  id: '',
  name: '',
  description: '',
  permissions: [],
  study_programs: [],
})

function create() {
  mode.value = 'create'
  dialogCreate.value = true
}
function editItem(item: GetRoleListData) {
  mode.value = 'update'
  role.value = item,
    dialogUpdate.value = true
}

function deleteItem(item: GetRoleListData) {
  mode.value = 'delete'
  role.value = item,
    dialogDelete.value = true
}

function closeCreate() {
  dialogCreate.value = false
  setTimeout(() => {
    role.value = Object.assign({}, role.value)
  }, 300)
}
function closeUpdate() {
  dialogUpdate.value = false
  setTimeout(() => {
    role.value = Object.assign({}, role.value)
  }, 300)
}
function closeDelete() {
  dialogDelete.value = false
  setTimeout(() => {
    role.value = Object.assign({}, role.value)
  }, 300)
}

async function deleteItm() {
  console.log(role.value)
  try {
    try {
      const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_role.RootRoleHandler/Delete`, <any>{
        method: 'Delete',
        body: {
          id: role.value.id,
          name: role.value.name,
          description: role.value.description,
          study_program_ids: [],
          permission_ids: []
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

    // return true;
  } catch (error) {
    alert(error)
    console.log(error)
    // return false;
  }
  closeDelete()
  getData(limit, 1, search.value)
}

const editedIndex = ref(-1)
async function getData(limit: number, page: number, searchText: String) {
  search.value = searchText.toString();
  try {
    const { data: response, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_role.RootRoleHandler/GetList?limit=${limit}&page=${page}&search=${searchText}`, <any>{
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
    roles.value = response.value.data

  } catch (error) {
    return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
  }

}
// Computed Property
const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New Contact' : 'Edit Contact'
})
const counter = useState('counter', () => Math.round(Math.random() * 1000))

</script>

<template>
  <div>
    <div v-if="mode == 'create'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogCreate" max-width="800">
          <PagesRolesCreate @reload="getData(limit, 1, search)" @close="closeCreate()" />
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'update'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogUpdate" max-width="800">
          <PagesRolesUpdate @reload="getData(limit, 1, search)" @close="closeUpdate()" :id="role.id" :name="role.name"
            :description="role.description" :permissions="role.permissions" :study_programs="role.study_programs" />
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'delete'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogDelete" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Hapus Grup</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <h5>Nama Grup</h5>
                </v-row>
                <v-row>
                  <div>{{ role.name }}</div>
                </v-row>
                <v-row class="pt-2">
                  <h5>Keterangan</h5>
                </v-row>
                <v-row>
                  <div>{{ role.description }}</div>
                </v-row>
                <v-col class="text-right">
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="error" @click="closeDelete">
                      Batal
                    </v-btn>
                    <v-btn color="secondary" :disabled="role.name == ''" @click="deleteItm">
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
    <SharedBackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs" />
    <SharedUiParentCard title="Grup">
      <v-row>
        <v-col cols="12" lg="4" md="6">
          <v-text-field density="compact" label="Pencarian Grup" hide-details variant="outlined"
            @input="getData(limit, pagination.page, $event.target.value)" />
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
          <v-btn color="primary" flat class="ml-auto" @click="create()">
            <v-icon class="mr-2">
              mdi-account-multiple-plus
            </v-icon>Tambah Grup
          </v-btn>
        </v-col>
      </v-row>
    </SharedUiParentCard>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">
            No
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Nama Grup
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Keterangan
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Akses Modul
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Akses Program Studi
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item, index in roles" :key="item.id">
          <td class="text-subtitle-1">
            {{ (pagination.limit * (pagination.page - 1)) + index + 1 }}
          </td>
          <td class="text-subtitle-1">
            {{ item.name }}
          </td>
          <td class="text-subtitle-1">
            {{ item.description }}
          </td>
          <td class="text-subtitle-1">
            <ul v-for="permission in item.permissions">
              <li>{{ permission.name }}</li>
            </ul>
          </td>
          <td class="text-subtitle-1">
            <ul v-for="study_program in item.study_programs">
              <li>{{ study_program.name }} - {{ study_program.study_level_short_name }} - {{
                study_program.dikti_study_program_type }}</li>
            </ul>
          </td>
          <td>
            <div class="d-flex align-center">
              <v-tooltip text="Ubah">
                <template #activator="{ props }">
                  <v-btn icon flat v-bind="props" @click="editItem(item)">
                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Hapus">
                <template #activator="{ props }">
                  <v-btn icon flat v-bind="props" @click="deleteItem(item)">
                    <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">
            <TablePaginationView func_get_data="roles" :limit="limit" :page="pagination.page"
              :total_pages="pagination.total_pages" :total_records="pagination.total_records" :prev="pagination.prev"
              :next="pagination.next" @prevPage="getData(limit, pagination.prev, search)"
              @jumpPage="(page: any) => getData(limit, page, search)" @nextPage="getData(limit, pagination.next, search)" />
          </td>
        </tr>
      </tfoot>
    </v-table>
  </div>
</template>
