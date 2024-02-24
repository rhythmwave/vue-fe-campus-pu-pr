<script setup lang="ts">
import { ErrorRoot } from '~~/types/api/error';
const emit = defineEmits(['closeDialog'])
const props = defineProps({
    title: String,
    dialog: Boolean,
    data: Object as any,
})
const valid = ref(true)
const suspension_remarks = ref('')
function close(){
    emit('closeDialog', {dialog: true, data:{}})
}
async function blockAuthStudent(){
    try {
        var createData = Object.assign({}, {id: props.data.id, is_active: false, suspension_remarks: suspension_remarks});
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/auth/admin_authentication.AdminAuthenticationHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: createData?.id,
                is_active: createData?.is_active,
                suspension_remarks: createData?.suspension_remarks,
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
            <span class="title text-white">Block Login {{ props.title }} : {{ props.data?.name }}</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="12" sm="12">
                        <v-text-field v-model="suspension_remarks" variant="outlined" hide-details label="Catatan"/>
                    </v-col>
                </v-row>
            </v-form>
            <VCardActions class="pa-4">
                <VSpacer />
                <VBtn color="error" @click="close">
                Batal
                </VBtn>
                <VBtn color="secondary" @click="blockAuthStudent">
                Simpan
                </VBtn>
            </VCardActions>
        </v-card-text>
    </v-card>
</template>