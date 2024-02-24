<script setup lang="ts">
import { ErrorRoot } from '~~/types/api/error';
const emit = defineEmits(['closeDialog'])
const props = defineProps({
    title: String,
    dialog: Boolean,
    data: Object as any,
})
function close(){
    emit('closeDialog', true)
}
async function deleteAuth(){
    try {
        var createData = Object.assign({}, props.data);
            const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/auth/admin_authentication.AdminAuthenticationHandler/Delete`, <any>{
            method: 'DELETE',
            body: {
                id: props.data.authentication_id,
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
    } catch (error) {
        alert(error)
    }
}
</script>

<template>
    <v-card max-height="600" style="overflow: auto;">
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Hapus Akses Login {{ props.title }} : {{ props.data?.user_name }}</span>
        </v-card-title>
        <v-card-text>
            <VCardActions class="pa-4">
                <VSpacer />
                <VBtn color="error" @click="close">
                Batal
                </VBtn>
                <VBtn color="secondary" @click="deleteAuth">
                Hapus Akses
                </VBtn>
            </VCardActions>
        </v-card-text>
    </v-card>
</template>