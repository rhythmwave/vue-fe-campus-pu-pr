import { ErrorRoot } from "~~/types/api/error";
import { GetSupervisorRoleRoot } from "~~/types/api/thesis/GetSupervisorRole";

export async function getSupervisorRole(limit: number, page: number, search: string)
    : Promise<{ response: GetSupervisorRoleRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetSupervisorRoleRoot>(() => `api/v1/admin/admin_thesis_supervisor_role.AdminThesisSupervisorRoleHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
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