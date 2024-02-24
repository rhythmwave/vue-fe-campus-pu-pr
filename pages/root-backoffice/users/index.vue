<script setup lang="ts">
import { User, Role } from '@/types/backoffice/backofficeTypes'
import { GetRoleListData, GetRoleListPermission, GetRoleListRoot, GetRoleListStudyProgram } from '~~/types/api/role/GetRoleList';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';

import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});


const users = ref<User[]>()
const user = ref({
  id: '',
  name: '',
  username: '',
  password: '',
  role_id: ''
})
const roles = ref(<GetRoleListData[]>[])
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

const title = ref('Daftar User')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Daftar User',
    disabled: true,
    href: '#'
  }
])

onMounted(async () => {
  await getData(limit, 1, search)
})

const valid = ref(true)
// const rolesbg = ref(['primary', 'secondary', 'error', 'success', 'warning'])
// Methods

async function getData(limit: number, page: number, search: String) {
  try {
    const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_admin.RootAdminHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
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

    users.value = _resp.value.data
  } catch (error) {
    alert(error)

  }
}
async function getDataRoles(limit: number, page: number, search: String) {
  try {
    const { data: response, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_role.RootRoleHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
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
    roles.value = <GetRoleListData[]>response.value?.data
  } catch (error) {
    alert(error)

  }

}
// Computed Property

const mode = ref('list')
const dialog = ref(false)
const dialogPermission = ref(false)

async function create() {
  roles.value = []
  mode.value = 'create'
  dialog.value = true
  await getDataRoles(100000000, 1, '')
}

async function editItem(item: any) {
  roles.value = []
  mode.value = 'edit'
  dialog.value = true
  await getDataRoles(100000000, 1, '')
  user.value = item
}

function deleteItem(item: any) {
  mode.value = 'delete'
  dialog.value = true
  user.value = item
}

function close() {
  dialog.value = false
  setTimeout(() => {
    user.value = {
      id: '',
      name: '',
      username: '',
      password: '',
      role_id: ''
    }
    roles.value = []
  }, 300)
}

async function save() {
  try {
    const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_admin.RootAdminHandler/Create`, <any>{
      method: 'POST',
      body: {
        name: user.value.name,
        username: user.value.username,
        password: user.value.password,
        role_id: user.value.role_id
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
    getData(limit, 1, search)
    dialog.value = false
    return { response: data.value, error: null };
  } catch (error) {
    alert(error)

  }

  close()
  getData(limit, 1, search)
}

async function update() {
  try {
    const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_admin.RootAdminHandler/Update`, <any>{
      method: 'PATCH',
      body: {
        id: user.value.id,
        name: user.value.name,
        username: user.value.username,
        role_id: user.value.role_id
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

async function deleteData() {
  try {
    const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_admin.RootAdminHandler/Delete`, <any>{
      method: 'Delete',
      body: {
        id: user.value.id
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

function GetPermissions(roleId: string): GetRoleListPermission[] {
  var selectedRole: GetRoleListData[] = roles.value.filter((obj) => {
    return obj.id === roleId;
  });
  if (!selectedRole) return [];
  return selectedRole[0].permissions;
}
function GetStudyPrograms(roleId: string): GetRoleListStudyProgram[] {
  var selectedRole: GetRoleListData[] = roles.value.filter((obj) => {
    return obj.id === roleId;
  });
  if (!selectedRole) return [];
  return selectedRole[0].study_programs;
}

</script>

<template>
  <div>
    <div v-if="mode == 'delete'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialog" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">hapus user {{ user.name }}</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="error" @click="close">
                      Batal
                    </v-btn>
                    <v-btn color="secondary" :disabled="user.username == '' && user.role_id == '' && user.password == ''"
                      @click="deleteData">
                      Hapus
                    </v-btn>
                  </v-card-actions>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'create'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialog" width="auto">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Tambah User</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="user.name" variant="outlined" hide-details label="*Nama" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="user.username" variant="outlined" hide-details label="*Nama Login"
                      title="*Nama Login" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-select v-model="user.role_id" label="*Role" placeholder="*Role" item-title="name" item-value="id"
                      :items="roles" />
                    <v-dialog v-model="dialogPermission" scrollable>
                      <template v-slot:activator="{ props }">
                        <v-card-actions v-if="user.role_id" class="pa-0">
                          <v-btn color="primary" @click="dialogPermission = true">
                            Lihat Hak Akses
                          </v-btn>
                        </v-card-actions>
                      </template>
                      <PagesUsersPermissions @close="dialogPermission = false" :permissions="GetPermissions(user.role_id)"
                        :study_programs="GetStudyPrograms(user.role_id)"></PagesUsersPermissions>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="user.password" type="password" variant="outlined" hide-details
                      label="*Password" />
                  </v-col>
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="error" @click="close">
                      Batal
                    </v-btn>
                    <v-btn color="secondary"
                      :disabled="user.name == '' || user.username == '' || user.role_id == '' || user.password == ''"
                      @click="save">
                      Simpan
                    </v-btn>
                  </v-card-actions>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'edit'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialog" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Ubah User</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="user.name" variant="outlined" hide-details label="*Nama" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="user.username" variant="outlined" hide-details label="*Nama Login" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-select v-model="user.role_id" label="*Role" placeholder="*Role" item-title="name" item-value="id"
                      :items="roles" />
                    <v-dialog v-model="dialogPermission" scrollable>
                      <template v-slot:activator="{ props }">
                        <v-card-actions v-if="user.role_id" class="pa-0">
                          <v-btn color="primary" @click="dialogPermission = true">
                            Lihat Hak Akses
                          </v-btn>
                        </v-card-actions>
                      </template>
                      <PagesUsersPermissions @close="dialogPermission = false" :permissions="GetPermissions(user.role_id)"
                        :study_programs="GetStudyPrograms(user.role_id)"></PagesUsersPermissions>
                    </v-dialog>
                  </v-col>
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="error" @click="close">
                      Batal
                    </v-btn>
                    <v-btn color="secondary" :disabled="user.name == '' || user.username == '' || user.role_id == ''"
                      @click="update">
                      Ubah
                    </v-btn>
                  </v-card-actions>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </div>
    <SharedBackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs" />
    <SharedUiParentCard title="User">
      <v-row>
        <v-col cols="12" lg="4" md="6" class="float-left">
          <v-text-field density="compact" label="Pencarian User" hide-details variant="outlined"
            @input="getData(limit, pagination.page, $event.target.value)" />
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
          <v-btn color="primary" flat class="ml-auto" @click="create()">
            <v-icon class="mr-2">
              mdi-account-multiple-plus
            </v-icon>Tambah User
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
            Nama Login
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Nama Lengkap
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Grup
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Akses Modul
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Akses Prodi
          </th>
          <th class="text-subtitle-1 font-weight-semibold">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item, index in users" :key="item.id">
          <td class="text-subtitle-1">
            {{ index + 1 }}
          </td>
          <td class="text-subtitle-1">
            {{ item.username }}
          </td>
          <td class="text-subtitle-1">
            {{ item.name }}
          </td>
          <td class="text-subtitle-1">
            {{ item.role_name }}
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
              @jumpPage="(page : any) => getData(limit, page, search)" @nextPage="getData(limit, pagination.next, search)" />
            <!-- <TablePagination :func_get_data="users" :pagination="pagination" :search="search" /> -->
          </td>
        </tr>
      </tfoot>
    </v-table>
  </div>
</template>
