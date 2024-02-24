import { ErrorRoot } from "~~/types/api/error";
import { BulkAssignStudentAccountRequest, BulkAssignStudentAccountRoot } from "~~/types/api/account/BulkAssignStudentAccount";

export async function bulkAssignStudentAccount(body: BulkAssignStudentAccountRequest)
    : Promise<{ response: BulkAssignStudentAccountRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<BulkAssignStudentAccountRoot>(() => `/api/v1/admin/auth/admin_authentication.AdminAuthenticationHandler/BulkCreate`, <any>{
            method: 'POST',
            body: body,
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