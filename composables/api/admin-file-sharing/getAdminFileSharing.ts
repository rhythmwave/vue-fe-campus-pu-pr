import { ErrorRoot } from "~~/types/api/error";
import { GetFileSharingRoot } from "~~/types/api/file-sharing/GetFileSharing";

export async function getAdminFileSharing(limit: number, page: number, search: string, isApproved: any)
    : Promise<{ response: GetFileSharingRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetFileSharingRoot>(() => `/api/v1/admin/admin_shared_file.AdminSharedFileHandler/GetList?limit=${limit}&page=${page}&search=${search}&isApproved=${isApproved}`, <any>{
            method: 'GET',
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