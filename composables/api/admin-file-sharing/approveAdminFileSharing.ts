import { ErrorRoot } from "~~/types/api/error";
import { UpdateFileSharingRoot } from "~~/types/api/file-sharing/UpdateFileSharing";

export async function approveAdminFileSharing(id: string)
    : Promise<{ response: UpdateFileSharingRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateFileSharingRoot>(() => `/api/v1/admin/reference_data/admin_shared_file.AdminSharedFileHandler/Approve`, <any>{
            method: 'PATCH',
            body: {
                id: id
            },
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                return { response: null, error: errorRoot };
            }
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return { response: null, error: errorRoot };
            }
            return { response: null, error: errorRoot };
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}