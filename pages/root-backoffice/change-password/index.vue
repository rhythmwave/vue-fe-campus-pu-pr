<script setup lang="ts">
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import user1 from '/images/profile/user-1.jpg';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});


const store = useContactStore();

const page = ref({ title: 'Ubah Password' });
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Ubah Password',
        disabled: true,
        href: '#'
    }
]);

onMounted(() => {
    store.fetchContacts();
});
const getContacts: any = computed(() => {
    return store.contacts;
});

// const valid = ref(true);
// const dialog = ref(false);
// const search = ref('');
// const rolesbg = ref(['primary', 'secondary', 'error', 'success', 'warning']);
// const desserts = ref(contact);
// const editedIndex = ref(-1);
// const editedItem = ref({
//     id: '',
//     avatar: user1,
//     userinfo: '',
//     usermail: '',
//     phone: '',
//     jdate: '',
//     role: '',
//     rolestatus: ''
// });
// const defaultItem = ref({
//     id: '',
//     avatar: user1,
//     userinfo: '',
//     usermail: '',
//     phone: '',
//     jdate: '',
//     role: '',
//     rolestatus: ''
// });

// //Methods
// const filteredList = computed(() => {
//     return desserts.value.filter((user: any) => {
//         return user.userinfo.toLowerCase().includes(search.value.toLowerCase());
//     });
// });

// function editItem(item: any) {
//     editedIndex.value = desserts.value.indexOf(item);
//     editedItem.value = Object.assign({}, item);
//     dialog.value = true;
// }
// function deleteItem(item: any) {
//     const index = desserts.value.indexOf(item);
//     confirm('Are you sure you want to delete this item?') && desserts.value.splice(index, 1);
// }

// function close() {
//     dialog.value = false;
//     setTimeout(() => {
//         editedItem.value = Object.assign({}, defaultItem.value);
//         editedIndex.value = -1;
//     }, 300);
// }
// function save() {
//     if (editedIndex.value > -1) {
//         Object.assign(desserts.value[editedIndex.value], editedItem.value);
//     } else {
//         desserts.value.push(editedItem.value);
//     }
//     close();
// }

// //Computed Property
// const formTitle = computed(() => {
//     return editedIndex.value === -1 ? 'New Contact' : 'Edit Contact';
// });
const changePass = ref({
    old_password: '',
    new_password: '',
    second_new_password: '',
})
const new_password = ref('')

function showOldPassword(show: boolean) {
    if (show) {
        document.getElementById('old_password')?.setAttribute('type', 'text')
    } else {
        document.getElementById('old_password')?.setAttribute('type', 'password')
    }
}
function showNewPassword(show: boolean) {
    if (show) {
        document.getElementById('new_password')?.setAttribute('type', 'text')
    } else {
        document.getElementById('new_password')?.setAttribute('type', 'password')
    }
}
function showSecondNewPassword(show: boolean) {
    if (show) {
        document.getElementById('second_new_password')?.setAttribute('type', 'text')
    } else {
        document.getElementById('second_new_password')?.setAttribute('type', 'password')
    }
}

async function save() {
    if (changePass.value.new_password != changePass.value.second_new_password) {
        alert("ulangi password salah")
        return false
    }
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `api/v1/general/general_auth.GeneralAuthHandler/UpdatePassword`, <any>{
            method: 'PATCH',
            body: {
                old_password: changePass.value.old_password,
                new_password: changePass.value.new_password,
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
        alert("ubah password berhasil")
    } catch (error) {
        alert(error)

    }

}
</script>

<template>
    <div>
        <SharedBackofficeBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></SharedBackofficeBreadcrumb>
        <SharedUiParentCard title="Ubah Password">
            <VCol cols="12" lg="12">
                <VForm ref="form" lazy-validation>
                    <VRow>
                        <VCol cols="12" lg="10" sm="10">
                            <VTextField id="old_password" type="password" v-model="changePass.old_password"
                                variant="outlined" hide-details label="Password Lama" />
                        </VCol>
                        <VCol cols="12" lg="2" sm="2">
                            <VBtn color="secondary" @mousedown="showOldPassword(true)" @mouseup="showOldPassword(false)">
                                Lihat
                            </VBtn>
                        </VCol>
                        <VCol cols="12" lg="10" sm="10">
                            <VTextField id="new_password" type="password" v-model="changePass.new_password"
                                variant="outlined" hide-details label="Password Baru" />
                        </VCol>
                        <VCol cols="12" lg="2" sm="2">
                            <VBtn color="secondary" @mousedown="showNewPassword(true)" @mouseup="showNewPassword(false)">
                                Lihat
                            </VBtn>
                        </VCol>
                        <VCol cols="12" lg="10" sm="10">
                            <VTextField id="second_new_password" type="password" v-model="changePass.second_new_password"
                                variant="outlined" hide-details label="Ulangi Password Baru" />
                        </VCol>
                        <VCol cols="12" lg="2" sm="2">
                            <VBtn color="secondary" @mousedown="showSecondNewPassword(true)"
                                @mouseup="showSecondNewPassword(false)">
                                Lihat
                            </VBtn>
                        </VCol>
                        <VCol cols="12" lg="10" sm="10">
                            <VCardAction>
                                <VBtn color="secondary" :disabled="
                                    changePass.old_password == '' ||
                                    changePass.new_password == '' ||
                                    changePass.second_new_password == ''
                                " @click="save">
                                    Ubah
                                </VBtn>
                            </VCardAction>
                        </VCol>
                    </VRow>
                </VForm>
            </VCol>
        </SharedUiParentCard>
        <!-- <VRow>
                            <VCol cols="12">
                                <VCard>
                                    <VCardTitle>
                                        <span class="title text-white">ubah password</span>
                                    </VCardTitle>
                                    <VCardText>
                                        <VForm ref="form" lazy-validation>
                                            <VRow>
                                                <VCol cols="12" sm="12">
                                                    <VTextField v-model="changePassword?.old_password" variant="outlined" hide-details label="Password Lama" />
                                                </VCol>
                                                <VCol cols="12" sm="12">
                                                    <VTextField v-model="changePassword?.new_password" variant="outlined" hide-details label="Password Baru" />
                                                </VCol>
                                                <VCol cols="12" sm="12">
                                                    <VTextField v-model="new_password" variant="outlined" hide-details label="Ulang Password Baru" />
                                                </VCol>
                                                <VCard-action>
                                                    <VBtn color="secondary" :disabled="
                                                        changePassword?.old_password == '' ||
                                                        changePassword?.new_password == '' ||
                                                        new_password == ''
                                                        " @click="save">
                                                        Simpan
                                                    </VBtn>
                                                </VCard-action>
                                            </VRow>
                                        </VForm>
                                    </VCardText>
                                </VCard>
                            </VCol>
                    </VRow> -->
    </div>
</template>