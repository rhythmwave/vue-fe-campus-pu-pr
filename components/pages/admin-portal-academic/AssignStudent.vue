<script setup lang="ts">
import { ErrorRoot } from '~~/types/api/error';
const emit = defineEmits(['closeDialog'])
const props = defineProps({
    title: String,
    dialog: Boolean,
    data: Object as any,
})
function close(){
    emit('closeDialog', {dialog: true, data:{}})
}
async function save(){
    try {
        var createData = Object.assign({}, props.data);
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/auth/admin_authentication.AdminAuthenticationHandler/Create`, <any>{
            method: 'POST',
            body: {
                authentication_type: createData.authentication_type,
                user_id: createData.user_id,
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
        emit('closeDialog', {dialog: true, data:_resp.value.data})
    } catch (error) {
        alert(error)
    }
}
</script>
<template>
    <v-card max-height="600" style="overflow: auto;">
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Tetapkan Akses Login {{ props.title }} : {{ props.data?.user_name }}</span>
        </v-card-title>
        <v-card-text>
            <VCardActions class="pa-4">
                <VSpacer />
                <VBtn color="error" @click="close">
                Batal
                </VBtn>
                <VBtn color="secondary" @click="save()">
                Simpan
                </VBtn>
            </VCardActions>
        </v-card-text>
    </v-card>
</template>